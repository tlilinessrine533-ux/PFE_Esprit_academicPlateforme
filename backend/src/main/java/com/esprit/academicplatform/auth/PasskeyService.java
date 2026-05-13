package com.esprit.academicplatform.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.AlgorithmParameters;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.ECParameterSpec;
import java.security.spec.ECPoint;
import java.security.spec.ECPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PasskeyService {

    private static final byte FLAG_USER_PRESENT = 0x01;
    private static final byte FLAG_USER_VERIFIED = 0x04;
    private static final byte FLAG_ATTESTED_CREDENTIAL_DATA = 0x40;
    private static final int RP_ID_HASH_LENGTH = 32;
    private static final int FLAGS_LENGTH = 1;
    private static final int SIGN_COUNT_LENGTH = 4;
    private static final int AAGUID_LENGTH = 16;
    private static final int CREDENTIAL_ID_LENGTH = 2;

    private final PasskeyProperties passkeyProperties;
    private final ObjectMapper objectMapper;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateChallenge() {
        byte[] challengeBytes = new byte[32];
        secureRandom.nextBytes(challengeBytes);
        return encodeBase64Url(challengeBytes);
    }

    public PasskeyRegistrationVerificationResult verifyRegistration(
        PasskeyRegistrationFinishRequest request,
        String expectedChallenge
    ) {
        parseAndValidateClientData(request.clientDataJSON(), "webauthn.create", expectedChallenge);
        byte[] attestationObject = decodeBase64Url(request.attestationObject());
        Map<Object, Object> attestation = readCborMap(attestationObject);
        byte[] authData = requireByteArray(attestation.get("authData"), "authData");
        ParsedAuthenticatorData parsedAuthenticatorData = parseAuthenticatorData(authData, true);

        validateRpIdHash(parsedAuthenticatorData.rpIdHash());
        validateUserVerification(parsedAuthenticatorData.flags());

        if (!request.credentialId().equals(parsedAuthenticatorData.credentialId())) {
            throw invalidPasskeyPayload("La cle d'authentification recue est invalide.");
        }

        PublicKey publicKey = decodeCoseEc256PublicKey(parsedAuthenticatorData.credentialPublicKey());
        return new PasskeyRegistrationVerificationResult(
            parsedAuthenticatorData.credentialId(),
            encodeBase64(publicKey.getEncoded()),
            parsedAuthenticatorData.signCount()
        );
    }

    public PasskeyAuthenticationVerificationResult verifyAuthentication(
        PasskeyAuthenticationFinishRequest request,
        String expectedChallenge,
        String expectedCredentialId,
        String encodedPublicKey,
        long storedSignCount
    ) {
        parseAndValidateClientData(request.clientDataJSON(), "webauthn.get", expectedChallenge);

        if (!expectedCredentialId.equals(request.credentialId())) {
            throw invalidPasskeyPayload("La cle d'authentification ne correspond pas a ce compte.");
        }

        byte[] authenticatorData = decodeBase64Url(request.authenticatorData());
        ParsedAuthenticatorData parsedAuthenticatorData = parseAuthenticatorData(authenticatorData, false);
        validateRpIdHash(parsedAuthenticatorData.rpIdHash());
        validateUserVerification(parsedAuthenticatorData.flags());
        verifyAssertionSignature(
            authenticatorData,
            decodeBase64Url(request.clientDataJSON()),
            decodeBase64Url(request.signature()),
            decodeStoredPublicKey(encodedPublicKey)
        );

        long nextSignCount = parsedAuthenticatorData.signCount();
        if (storedSignCount > 0 && nextSignCount > 0 && nextSignCount <= storedSignCount) {
            throw invalidPasskeyPayload("La signature biometrie a ete rejetee.");
        }

        return new PasskeyAuthenticationVerificationResult(nextSignCount > 0 ? nextSignCount : storedSignCount);
    }

    public String buildUserHandle(Long userId) {
        return encodeBase64Url(userId.toString().getBytes(StandardCharsets.UTF_8));
    }

    private JsonNode parseAndValidateClientData(String encodedClientData, String expectedType, String expectedChallenge) {
        try {
            byte[] clientDataJson = decodeBase64Url(encodedClientData);
            JsonNode clientData = objectMapper.readTree(clientDataJson);

            String type = clientData.path("type").asText();
            if (!expectedType.equals(type)) {
                throw invalidPasskeyPayload("Le type de verification biometrie est invalide.");
            }

            String challenge = clientData.path("challenge").asText();
            if (!expectedChallenge.equals(challenge)) {
                throw invalidPasskeyPayload("Le challenge biometrie est invalide ou expire.");
            }

            String origin = clientData.path("origin").asText();
            if (!passkeyProperties.getOrigin().equals(origin)) {
                throw invalidPasskeyPayload("L'origine biometrie n'est pas autorisee.");
            }

            return clientData;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw invalidPasskeyPayload("Le payload biometrie est invalide.");
        }
    }

    private void verifyAssertionSignature(
        byte[] authenticatorData,
        byte[] clientDataJson,
        byte[] signature,
        PublicKey publicKey
    ) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] clientDataHash = messageDigest.digest(clientDataJson);
            byte[] signedBytes = ByteBuffer.allocate(authenticatorData.length + clientDataHash.length)
                .put(authenticatorData)
                .put(clientDataHash)
                .array();

            Signature verifier = Signature.getInstance("SHA256withECDSA");
            verifier.initVerify(publicKey);
            verifier.update(signedBytes);
            if (!verifier.verify(signature)) {
                throw invalidPasskeyPayload("La signature biometrie est invalide.");
            }
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw invalidPasskeyPayload("La signature biometrie n'a pas pu etre verifiee.");
        }
    }

    private ParsedAuthenticatorData parseAuthenticatorData(byte[] authData, boolean expectAttestedCredential) {
        int minimumLength = RP_ID_HASH_LENGTH + FLAGS_LENGTH + SIGN_COUNT_LENGTH;
        if (authData.length < minimumLength) {
            throw invalidPasskeyPayload("Les donnees de l'authenticator sont incompletes.");
        }

        ByteBuffer buffer = ByteBuffer.wrap(authData);
        byte[] rpIdHash = new byte[RP_ID_HASH_LENGTH];
        buffer.get(rpIdHash);
        byte flags = buffer.get();
        long signCount = Integer.toUnsignedLong(buffer.getInt());

        if (!expectAttestedCredential) {
            return new ParsedAuthenticatorData(rpIdHash, flags, signCount, null, null);
        }

        if ((flags & FLAG_ATTESTED_CREDENTIAL_DATA) == 0) {
            throw invalidPasskeyPayload("La cle biometrie recue n'est pas complete.");
        }

        int attestedCredentialLength = AAGUID_LENGTH + CREDENTIAL_ID_LENGTH;
        if (buffer.remaining() < attestedCredentialLength) {
            throw invalidPasskeyPayload("Les donnees d'attestation biometrie sont incompletes.");
        }

        byte[] aaguid = new byte[AAGUID_LENGTH];
        buffer.get(aaguid);

        int credentialIdLength = Short.toUnsignedInt(buffer.getShort());
        if (buffer.remaining() < credentialIdLength) {
            throw invalidPasskeyPayload("L'identifiant de la cle biometrie est incomplet.");
        }

        byte[] credentialIdBytes = new byte[credentialIdLength];
        buffer.get(credentialIdBytes);

        byte[] remainingBytes = new byte[buffer.remaining()];
        buffer.get(remainingBytes);
        CborReader credentialReader = new CborReader(remainingBytes);
        credentialReader.read();
        byte[] credentialPublicKeyBytes = Arrays.copyOfRange(remainingBytes, 0, credentialReader.getOffset());

        return new ParsedAuthenticatorData(
            rpIdHash,
            flags,
            signCount,
            encodeBase64Url(credentialIdBytes),
            credentialPublicKeyBytes
        );
    }

    private void validateRpIdHash(byte[] actualRpIdHash) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] expectedRpIdHash = digest.digest(passkeyProperties.getRpId().getBytes(StandardCharsets.UTF_8));
            if (!MessageDigest.isEqual(actualRpIdHash, expectedRpIdHash)) {
                throw invalidPasskeyPayload("Le domaine biometrie ne correspond pas a l'application.");
            }
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw invalidPasskeyPayload("Le domaine biometrie n'a pas pu etre verifie.");
        }
    }

    private void validateUserVerification(byte flags) {
        if ((flags & FLAG_USER_PRESENT) == 0 || (flags & FLAG_USER_VERIFIED) == 0) {
            throw invalidPasskeyPayload("La verification biometrie locale est obligatoire.");
        }
    }

    private Map<Object, Object> readCborMap(byte[] bytes) {
        Object value = new CborReader(bytes).read();
        if (!(value instanceof Map<?, ?> mapValue)) {
            throw invalidPasskeyPayload("Le payload d'attestation biometrie est invalide.");
        }
        @SuppressWarnings("unchecked")
        Map<Object, Object> castedMap = (Map<Object, Object>) mapValue;
        return castedMap;
    }

    private byte[] requireByteArray(Object value, String fieldName) {
        if (value instanceof byte[] bytes) {
            return bytes;
        }
        throw invalidPasskeyPayload("Le champ " + fieldName + " du payload biometrie est invalide.");
    }

    private PublicKey decodeCoseEc256PublicKey(byte[] encodedCoseKey) {
        try {
            Map<Object, Object> coseKey = readCborMap(encodedCoseKey);

            Number keyType = requireNumber(coseKey, 1L);
            Number algorithm = requireNumber(coseKey, 3L);
            Number curve = requireNumber(coseKey, -1L);
            byte[] xCoordinate = requireByteArray(coseKey.get(-2L), "x");
            byte[] yCoordinate = requireByteArray(coseKey.get(-3L), "y");

            if (keyType.longValue() != 2L || algorithm.longValue() != -7L || curve.longValue() != 1L) {
                throw invalidPasskeyPayload("Seules les cles biometrie ES256 sont acceptees.");
            }

            AlgorithmParameters parameters = AlgorithmParameters.getInstance("EC");
            parameters.init(new ECGenParameterSpec("secp256r1"));
            ECParameterSpec ecParameterSpec = parameters.getParameterSpec(ECParameterSpec.class);

            ECPoint ecPoint = new ECPoint(
                new java.math.BigInteger(1, xCoordinate),
                new java.math.BigInteger(1, yCoordinate)
            );
            ECPublicKeySpec publicKeySpec = new ECPublicKeySpec(ecPoint, ecParameterSpec);
            return KeyFactory.getInstance("EC").generatePublic(publicKeySpec);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw invalidPasskeyPayload("La cle publique biometrie est invalide.");
        }
    }

    private Number requireNumber(Map<Object, Object> map, long key) {
        Object value = map.get(key);
        if (value instanceof Number numberValue) {
            return numberValue;
        }
        throw invalidPasskeyPayload("La cle publique biometrie est invalide.");
    }

    private PublicKey decodeStoredPublicKey(String encodedPublicKey) {
        if (!StringUtils.hasText(encodedPublicKey)) {
            throw invalidPasskeyPayload("Aucune cle biometrie n'est configuree.");
        }

        try {
            byte[] keyBytes = decodeBase64(encodedPublicKey);
            return KeyFactory.getInstance("EC").generatePublic(new X509EncodedKeySpec(keyBytes));
        } catch (Exception exception) {
            throw invalidPasskeyPayload("La cle biometrie enregistree est invalide.");
        }
    }

    private byte[] decodeBase64Url(String value) {
        try {
            return Base64.getUrlDecoder().decode(value);
        } catch (IllegalArgumentException exception) {
            throw invalidPasskeyPayload("Le payload biometrie est invalide.");
        }
    }

    private byte[] decodeBase64(String value) {
        try {
            return Base64.getDecoder().decode(value);
        } catch (IllegalArgumentException exception) {
            throw invalidPasskeyPayload("La cle biometrie enregistree est invalide.");
        }
    }

    private String encodeBase64Url(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }

    private String encodeBase64(byte[] value) {
        return Base64.getEncoder().encodeToString(value);
    }

    private ResponseStatusException invalidPasskeyPayload(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    public record PasskeyRegistrationVerificationResult(
        String credentialId,
        String publicKey,
        long signCount
    ) {
    }

    public record PasskeyAuthenticationVerificationResult(long signCount) {
    }

    private record ParsedAuthenticatorData(
        byte[] rpIdHash,
        byte flags,
        long signCount,
        String credentialId,
        byte[] credentialPublicKey
    ) {
    }
}
