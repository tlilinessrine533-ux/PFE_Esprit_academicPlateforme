package com.esprit.academicplatform.auth;

import com.esprit.academicplatform.auth.dto.AuthLoginRequest;
import com.esprit.academicplatform.auth.dto.AuthResponse;
import com.esprit.academicplatform.auth.dto.AuthUserResponse;
import com.esprit.academicplatform.auth.dto.UpdateProfileRequest;
import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.department.Department;
import com.esprit.academicplatform.user.User;
import com.esprit.academicplatform.user.UserRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.EnumSet;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import com.esprit.academicplatform.auth.dto.PhonePasswordResetRequest;
import com.esprit.academicplatform.auth.dto.PhonePasswordResetConfirmRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String INVALID_CREDENTIALS_MESSAGE = "Email ou mot de passe incorrect";
    private static final String ACCOUNT_LOCKED_MESSAGE = "Nombre maximal de tentatives atteint, Veuillez reessayer dans 1 minute";
    private static final String PASSWORD_RESET_REQUEST_MESSAGE =
        "Si un compte correspond a cette adresse e-mail, un code de verification a ete envoye.";
    private static final String INVALID_RESET_CODE_MESSAGE = "Le code de verification est invalide ou expire.";
    private static final String INVALID_TWO_FACTOR_CODE_MESSAGE =
        "Code de double authentification invalide ou expire.";
    private static final String INVALID_CURRENT_PASSWORD_MESSAGE = "Le mot de passe actuel est incorrect.";
    private static final String TWO_FACTOR_ALREADY_ENABLED_MESSAGE = "La double authentification est deja activee.";
    private static final String TWO_FACTOR_NOT_ENABLED_MESSAGE = "La double authentification n'est pas activee.";
    private static final String TWO_FACTOR_SETUP_EXPIRED_MESSAGE =
        "La configuration de la double authentification a expire. Relancez la configuration.";
    private static final String TWO_FACTOR_ENABLE_SUCCESS_MESSAGE = "Double authentification activee avec succes.";
    private static final String TWO_FACTOR_BACKUP_CODES_REGENERATED_MESSAGE =
        "Les codes de secours ont ete regeneres avec succes.";
    private static final String TWO_FACTOR_DISABLE_SUCCESS_MESSAGE = "Double authentification desactivee avec succes.";
    private static final String FACE_RECOGNITION_NOT_ENABLED_MESSAGE =
        "Aucune reconnaissance faciale par camera n'est activee pour ce compte.";
    private static final String FACE_RECOGNITION_ENABLE_SUCCESS_MESSAGE =
        "Reconnaissance faciale par camera activee avec succes.";
    private static final String FACE_RECOGNITION_DISABLE_SUCCESS_MESSAGE =
        "Reconnaissance faciale par camera supprimee avec succes.";
    private static final String PASSKEY_NOT_ENABLED_MESSAGE = "Aucune connexion Face ID / biometrie n'est activee pour ce compte.";
    private static final String PASSKEY_ENABLE_SUCCESS_MESSAGE = "Connexion Face ID / biometrie activee avec succes.";
    private static final String PASSKEY_DISABLE_SUCCESS_MESSAGE = "Connexion Face ID / biometrie supprimee avec succes.";
    private static final int PASSWORD_RESET_CODE_LENGTH = 6;
    private static final String BACKUP_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int BACKUP_CODE_LENGTH = 8;
    private static final EnumSet<RoleType> MANDATORY_TWO_FACTOR_ROLES = EnumSet.of(
        RoleType.SUPER_ADMIN,
        RoleType.ADMINISTRATION,
        RoleType.CHEF_DEPARTEMENT
    );
    private static final String PHONE_RESET_REQUEST_MESSAGE =
    "Si un compte correspond a ce numero, un code de verification a ete genere.";

    private final UserRepository userRepository;
    private final AuthSecurityStateRepository authSecurityStateRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthSecurityProperties authSecurityProperties;
    private final PasswordResetMailService passwordResetMailService;
    private final TotpService totpService;
    private final FaceRecognitionService faceRecognitionService;
    private final PasskeyService passkeyService;
    private final PasskeyProperties passkeyProperties;
    private final SecureRandom secureRandom = new SecureRandom();
    private final SmsService smsService;

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public AuthResponse login(AuthLoginRequest request) {
        User user = findActiveUserByEmail(request.email(), HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE);

        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (authSecurityState.isLoginLocked(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, ACCOUNT_LOCKED_MESSAGE);
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            registerFailedLoginAttempt(authSecurityState);
        }

        clearLoginFailures(authSecurityState);
        authSecurityState.clearPasswordResetState();

        if (authSecurityState.isTwoFactorEnabled()) {
            if (hasValidTrustedDevice(authSecurityState, request.trustedDeviceToken(), LocalDateTime.now())) {
                authSecurityState.clearTwoFactorLoginChallenge();
                authSecurityStateRepository.save(authSecurityState);
                return buildAuthResponse(user, authSecurityState, null, 0);
            }

            String challengeToken = issueTwoFactorChallenge(authSecurityState);
            authSecurityStateRepository.save(authSecurityState);
            return AuthResponse.twoFactorRequired(
                challengeToken,
                authSecurityProperties.getTwoFactorChallengeTtlMinutes() * 60
            );
        }

        authSecurityState.clearTwoFactorLoginChallenge();
        authSecurityStateRepository.save(authSecurityState);
        return buildAuthResponse(user, authSecurityState, null, 0);
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public AuthResponse verifyTwoFactorLogin(TwoFactorLoginVerifyRequest request) {
        User user = findActiveUserByEmail(request.email(), HttpStatus.UNAUTHORIZED, INVALID_TWO_FACTOR_CODE_MESSAGE);
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (authSecurityState.isLoginLocked(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, ACCOUNT_LOCKED_MESSAGE);
        }

        if (!authSecurityState.isTwoFactorEnabled()
            || !authSecurityState.hasValidTwoFactorLoginChallenge(LocalDateTime.now())
            || !passwordEncoder.matches(request.challengeToken(), authSecurityState.getTwoFactorLoginChallengeHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_TWO_FACTOR_CODE_MESSAGE);
        }

        if (!isValidSecondFactor(authSecurityState, request.code())) {
            registerFailedSecondFactorAttempt(authSecurityState);
        }

        clearLoginFailures(authSecurityState);
        authSecurityState.clearTwoFactorLoginChallenge();
        authSecurityState.clearPasswordResetState();

        String trustedDeviceToken = null;
        long trustedDeviceExpiresIn = 0;
        if (request.rememberDevice()) {
            trustedDeviceToken = issueTrustedDeviceToken(authSecurityState);
            trustedDeviceExpiresIn = authSecurityProperties.getTrustedDeviceTtlDays() * 24 * 60 * 60;
        }

        authSecurityStateRepository.save(authSecurityState);
        return buildAuthResponse(user, authSecurityState, trustedDeviceToken, trustedDeviceExpiresIn);
    }

    @Transactional
    public TwoFactorStatusResponse getTwoFactorStatus(String email) {
        User user = findUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);
        return buildTwoFactorStatusResponse(user, authSecurityState, LocalDateTime.now());
    }

    @Transactional
    public TwoFactorStatusResponse prepareTwoFactorSetup(String email) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (authSecurityState.isTwoFactorEnabled()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, TWO_FACTOR_ALREADY_ENABLED_MESSAGE);
        }

        LocalDateTime setupExpiresAt = LocalDateTime.now().plusMinutes(authSecurityProperties.getTwoFactorEnrollmentTtlMinutes());
        authSecurityState.setTwoFactorPendingSecret(totpService.generateSecret());
        authSecurityState.setTwoFactorPendingSecretExpiresAt(setupExpiresAt);
        authSecurityStateRepository.save(authSecurityState);

        return buildTwoFactorStatusResponse(user, authSecurityState, LocalDateTime.now());
    }

    @Transactional
    public TwoFactorEnableResponse enableTwoFactor(String email, TwoFactorEnableRequest request) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        validateCurrentPassword(user, request.currentPassword());

        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (authSecurityState.isTwoFactorEnabled()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, TWO_FACTOR_ALREADY_ENABLED_MESSAGE);
        }

        if (!authSecurityState.hasValidTwoFactorPendingSecret(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TWO_FACTOR_SETUP_EXPIRED_MESSAGE);
        }

        if (!totpService.verifyCode(authSecurityState.getTwoFactorPendingSecret(), normalizeTotpInput(request.code()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_TWO_FACTOR_CODE_MESSAGE);
        }

        List<String> backupCodes = generateBackupCodes();
        authSecurityState.setTwoFactorEnabled(true);
        authSecurityState.setTwoFactorSecret(authSecurityState.getTwoFactorPendingSecret());
        authSecurityState.clearTwoFactorPendingSecret();
        authSecurityState.clearTrustedDevice();
        authSecurityState.setTwoFactorBackupCodeHashes(hashBackupCodes(backupCodes));
        authSecurityStateRepository.save(authSecurityState);

        return new TwoFactorEnableResponse(TWO_FACTOR_ENABLE_SUCCESS_MESSAGE, backupCodes);
    }

    @Transactional
    public TwoFactorEnableResponse regenerateBackupCodes(String email, TwoFactorBackupCodesRegenerateRequest request) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        validateCurrentPassword(user, request.currentPassword());

        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (!authSecurityState.isTwoFactorEnabled()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TWO_FACTOR_NOT_ENABLED_MESSAGE);
        }

        if (!isValidSecondFactor(authSecurityState, request.code())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_TWO_FACTOR_CODE_MESSAGE);
        }

        List<String> backupCodes = generateBackupCodes();
        authSecurityState.setTwoFactorBackupCodeHashes(hashBackupCodes(backupCodes));
        authSecurityStateRepository.save(authSecurityState);
        return new TwoFactorEnableResponse(TWO_FACTOR_BACKUP_CODES_REGENERATED_MESSAGE, backupCodes);
    }

    @Transactional
    public AuthInfoResponse disableTwoFactor(String email, TwoFactorDisableRequest request) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        validateCurrentPassword(user, request.currentPassword());

        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (!authSecurityState.isTwoFactorEnabled()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, TWO_FACTOR_NOT_ENABLED_MESSAGE);
        }

        if (!isValidSecondFactor(authSecurityState, request.code())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_TWO_FACTOR_CODE_MESSAGE);
        }

        authSecurityState.disableTwoFactor();
        authSecurityStateRepository.save(authSecurityState);
        return new AuthInfoResponse(TWO_FACTOR_DISABLE_SUCCESS_MESSAGE);
    }

    @Transactional
    public FaceRecognitionStatusResponse getFaceRecognitionStatus(String email) {
        User user = findUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);
        return buildFaceRecognitionStatusResponse(authSecurityState);
    }

    @Transactional
    public AuthInfoResponse enrollFaceRecognition(String email, FaceRecognitionEnrollRequest request) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        authSecurityState.setFaceRecognitionDescriptor(faceRecognitionService.serializeDescriptor(request.descriptor()));
        authSecurityState.setFaceRecognitionEnrolledAt(LocalDateTime.now());
        authSecurityState.setFaceRecognitionLastUsedAt(null);
        authSecurityStateRepository.save(authSecurityState);

        return new AuthInfoResponse(FACE_RECOGNITION_ENABLE_SUCCESS_MESSAGE);
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public AuthResponse authenticateWithFaceRecognition(FaceRecognitionLoginRequest request) {
        User user = findActiveUserByEmail(request.email(), HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE);
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (authSecurityState.isLoginLocked(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, ACCOUNT_LOCKED_MESSAGE);
        }

        if (!authSecurityState.hasFaceRecognition()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, FACE_RECOGNITION_NOT_ENABLED_MESSAGE);
        }

        double distance = faceRecognitionService.computeDistance(
            faceRecognitionService.deserializeDescriptor(authSecurityState.getFaceRecognitionDescriptor()),
            request.descriptor()
        );

        if (distance > authSecurityProperties.getFaceRecognitionMatchThreshold()) {
            registerFailedAttempt(authSecurityState, "Reconnaissance faciale invalide.");
        }

        clearLoginFailures(authSecurityState);
        authSecurityState.clearPasswordResetState();
        authSecurityState.clearTwoFactorLoginChallenge();
        authSecurityState.clearTrustedDevice();
        authSecurityState.setFaceRecognitionLastUsedAt(LocalDateTime.now());
        authSecurityStateRepository.save(authSecurityState);

        return buildAuthResponse(user, authSecurityState, null, 0);
    }

    @Transactional
    public AuthInfoResponse removeFaceRecognition(String email) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (!authSecurityState.hasFaceRecognition()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, FACE_RECOGNITION_NOT_ENABLED_MESSAGE);
        }

        authSecurityState.clearFaceRecognition();
        authSecurityStateRepository.save(authSecurityState);
        return new AuthInfoResponse(FACE_RECOGNITION_DISABLE_SUCCESS_MESSAGE);
    }

    @Transactional
    public PasskeyStatusResponse getPasskeyStatus(String email) {
        User user = findUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);
        return buildPasskeyStatusResponse(authSecurityState);
    }

    @Transactional
    public PasskeyRegistrationOptionsResponse preparePasskeyRegistration(String email) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        String challenge = passkeyService.generateChallenge();
        authSecurityState.setPasskeyRegistrationChallenge(challenge);
        authSecurityState.setPasskeyRegistrationExpiresAt(
            LocalDateTime.now().plusMinutes(passkeyProperties.getChallengeTtlMinutes())
        );
        authSecurityStateRepository.save(authSecurityState);

        return new PasskeyRegistrationOptionsResponse(
            challenge,
            passkeyProperties.getRpId(),
            passkeyProperties.getRpName(),
            passkeyService.buildUserHandle(user.getId()),
            user.getEmail(),
            user.getFirstName() + " " + user.getLastName(),
            passkeyProperties.getTimeoutMs()
        );
    }

    @Transactional
    public AuthInfoResponse registerPasskey(String email, PasskeyRegistrationFinishRequest request) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (!authSecurityState.hasValidPasskeyRegistrationChallenge(LocalDateTime.now())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La configuration Face ID / biometrie a expire. Relancez l'activation."
            );
        }

        PasskeyService.PasskeyRegistrationVerificationResult verificationResult = passkeyService.verifyRegistration(
            request,
            authSecurityState.getPasskeyRegistrationChallenge()
        );

        authSecurityStateRepository.findByPasskeyCredentialId(verificationResult.credentialId())
            .filter(existingState -> !existingState.getUserId().equals(authSecurityState.getUserId()))
            .ifPresent(existingState -> {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cette cle Face ID / biometrie est deja associee a un autre compte."
                );
            });

        authSecurityState.setPasskeyCredentialId(verificationResult.credentialId());
        authSecurityState.setPasskeyPublicKey(verificationResult.publicKey());
        authSecurityState.setPasskeySignCount(verificationResult.signCount());
        authSecurityState.setPasskeyRegisteredAt(LocalDateTime.now());
        authSecurityState.setPasskeyLastUsedAt(null);
        authSecurityState.clearPasskeyRegistrationChallenge();
        authSecurityState.clearPasskeyAuthenticationChallenge();
        authSecurityStateRepository.save(authSecurityState);

        return new AuthInfoResponse(PASSKEY_ENABLE_SUCCESS_MESSAGE);
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public PasskeyAuthenticationOptionsResponse preparePasskeyAuthentication(PasskeyAuthenticationOptionsRequest request) {
        User user = findActiveUserByEmail(request.email(), HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE);
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (authSecurityState.isLoginLocked(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, ACCOUNT_LOCKED_MESSAGE);
        }

        if (!authSecurityState.hasRegisteredPasskey()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, PASSKEY_NOT_ENABLED_MESSAGE);
        }

        String challenge = passkeyService.generateChallenge();
        authSecurityState.setPasskeyAuthenticationChallenge(challenge);
        authSecurityState.setPasskeyAuthenticationExpiresAt(
            LocalDateTime.now().plusMinutes(passkeyProperties.getChallengeTtlMinutes())
        );
        authSecurityStateRepository.save(authSecurityState);

        return new PasskeyAuthenticationOptionsResponse(
            challenge,
            passkeyProperties.getRpId(),
            authSecurityState.getPasskeyCredentialId(),
            passkeyProperties.getTimeoutMs()
        );
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public AuthResponse authenticateWithPasskey(PasskeyAuthenticationFinishRequest request) {
        User user = findActiveUserByEmail(request.email(), HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE);
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (authSecurityState.isLoginLocked(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, ACCOUNT_LOCKED_MESSAGE);
        }

        if (!authSecurityState.hasRegisteredPasskey()
            || !authSecurityState.hasValidPasskeyAuthenticationChallenge(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La demande Face ID / biometrie a expire.");
        }

        PasskeyService.PasskeyAuthenticationVerificationResult verificationResult = passkeyService.verifyAuthentication(
            request,
            authSecurityState.getPasskeyAuthenticationChallenge(),
            authSecurityState.getPasskeyCredentialId(),
            authSecurityState.getPasskeyPublicKey(),
            authSecurityState.getPasskeySignCount()
        );

        clearLoginFailures(authSecurityState);
        authSecurityState.clearPasswordResetState();
        authSecurityState.clearTwoFactorLoginChallenge();
        authSecurityState.clearTrustedDevice();
        authSecurityState.clearPasskeyAuthenticationChallenge();
        authSecurityState.setPasskeySignCount(verificationResult.signCount());
        authSecurityState.setPasskeyLastUsedAt(LocalDateTime.now());
        authSecurityStateRepository.save(authSecurityState);

        return buildAuthResponse(user, authSecurityState, null, 0);
    }

    @Transactional
    public AuthInfoResponse removePasskey(String email) {
        User user = findActiveUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        releaseExpiredSecurityState(authSecurityState);

        if (!authSecurityState.hasRegisteredPasskey()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, PASSKEY_NOT_ENABLED_MESSAGE);
        }

        authSecurityState.clearPasskeyCredential();
        authSecurityStateRepository.save(authSecurityState);
        return new AuthInfoResponse(PASSKEY_DISABLE_SUCCESS_MESSAGE);
    }

    @Transactional(readOnly = true)
    public AuthUserResponse getCurrentUser(String email) {
        User user = findUserByEmail(email, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        return toAuthUserResponse(user);
    }

    @Transactional
    public AuthUserResponse updateCurrentUser(String currentEmail, UpdateProfileRequest request) {
        User user = findUserByEmail(currentEmail, HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        String normalizedEmail = normalizeEmail(request.email());

        userRepository.findByEmail(normalizedEmail)
            .filter(existingUser -> !existingUser.getId().equals(user.getId()))
            .ifPresent(existingUser -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email existe deja");
            });

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(normalizedEmail);

        return toAuthUserResponse(userRepository.save(user));
    }

    @Transactional
    public AuthInfoResponse requestPasswordReset(PasswordResetRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        userRepository.findByEmail(normalizedEmail)
            .filter(User::isActive)
            .ifPresent(user -> {
                AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
                String verificationCode = generateVerificationCode();

                authSecurityState.setPasswordResetCodeHash(passwordEncoder.encode(verificationCode));
                authSecurityState.setPasswordResetRequestedAt(LocalDateTime.now());
                authSecurityState.setPasswordResetExpiresAt(
                    LocalDateTime.now().plusMinutes(authSecurityProperties.getPasswordResetCodeTtlMinutes())
                );

                authSecurityStateRepository.save(authSecurityState);
                passwordResetMailService.sendPasswordResetCode(user, verificationCode);
            });

        return new AuthInfoResponse(PASSWORD_RESET_REQUEST_MESSAGE);
    }

    @Transactional
    public AuthResponse confirmPasswordReset(PasswordResetConfirmRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_RESET_CODE_MESSAGE));

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Le compte est desactive");
        }

        AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
        if (!authSecurityState.hasValidPasswordResetCode(LocalDateTime.now())
            || !passwordEncoder.matches(request.code(), authSecurityState.getPasswordResetCodeHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_RESET_CODE_MESSAGE);
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        clearLoginFailures(authSecurityState);
        authSecurityState.clearPasswordResetState();
        authSecurityState.clearTwoFactorLoginChallenge();
        authSecurityState.clearTrustedDevice();
        authSecurityStateRepository.save(authSecurityState);

        return buildAuthResponse(user, authSecurityState, null, 0);
    }


    @Transactional
public AuthInfoResponse requestPasswordResetByPhone(PhonePasswordResetRequest request) {
    String normalizedPhone = normalizePhoneNumber(request.phoneNumber());
    AtomicReference<String> demoVerificationCode = new AtomicReference<>();

    userRepository.findByPhoneNumber(normalizedPhone)
        .filter(User::isActive)
        .ifPresent(user -> {
            AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);
            String verificationCode = generateVerificationCode();

            authSecurityState.setPasswordResetCodeHash(passwordEncoder.encode(verificationCode));
            authSecurityState.setPasswordResetRequestedAt(LocalDateTime.now());
            authSecurityState.setPasswordResetExpiresAt(
                LocalDateTime.now().plusMinutes(authSecurityProperties.getPasswordResetCodeTtlMinutes())
            );

            authSecurityStateRepository.save(authSecurityState);

            if (authSecurityProperties.isSmsDemoMode()) {
                log.warn("SMS demo mode: verification code for {} is {} (no real SMS sent).", normalizedPhone, verificationCode);
                demoVerificationCode.set(verificationCode);
                return;
            }

            try {
                smsService.sendPasswordResetCode(normalizedPhone, verificationCode);
            } catch (RuntimeException exception) {
                log.warn("Failed to send SMS verification code to {}: {}", normalizedPhone, exception.getMessage());
            }
        });

    return new AuthInfoResponse(PHONE_RESET_REQUEST_MESSAGE, demoVerificationCode.get());
}

@Transactional
public AuthResponse confirmPasswordResetByPhone(PhonePasswordResetConfirmRequest request) {
    String normalizedPhone = normalizePhoneNumber(request.phoneNumber());

    User user = userRepository.findByPhoneNumber(normalizedPhone)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_RESET_CODE_MESSAGE));

    if (!user.isActive()) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Le compte est desactive");
    }

    AuthSecurityState authSecurityState = getOrCreateAuthSecurityState(user);

    if (!authSecurityState.hasValidPasswordResetCode(LocalDateTime.now())
        || !passwordEncoder.matches(request.code(), authSecurityState.getPasswordResetCodeHash())) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_RESET_CODE_MESSAGE);
    }

    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);

    clearLoginFailures(authSecurityState);
    authSecurityState.clearPasswordResetState();
    authSecurityState.clearTwoFactorLoginChallenge();
    authSecurityState.clearTrustedDevice();
    authSecurityStateRepository.save(authSecurityState);

    return buildAuthResponse(user, authSecurityState, null, 0);
}

    private AuthResponse buildAuthResponse(
        User user,
        AuthSecurityState authSecurityState,
        String trustedDeviceToken,
        long trustedDeviceExpiresIn
    ) {
        if (isTwoFactorEnrollmentRequired(user, authSecurityState)) {
            return AuthResponse.authenticatedWithTwoFactorEnrollmentRequired(
                jwtService.generateToken(user),
                "Bearer",
                jwtService.getJwtExpirationMs(),
                toAuthUserResponse(user),
                trustedDeviceToken,
                trustedDeviceExpiresIn
            );
        }

        return AuthResponse.authenticated(
            jwtService.generateToken(user),
            "Bearer",
            jwtService.getJwtExpirationMs(),
            toAuthUserResponse(user),
            trustedDeviceToken,
            trustedDeviceExpiresIn
        );
    }

    private TwoFactorStatusResponse buildTwoFactorStatusResponse(
        User user,
        AuthSecurityState authSecurityState,
        LocalDateTime now
    ) {
        boolean pendingEnrollment = !authSecurityState.isTwoFactorEnabled()
            && authSecurityState.hasValidTwoFactorPendingSecret(now);

        String manualEntryKey = pendingEnrollment ? authSecurityState.getTwoFactorPendingSecret() : null;
        String otpAuthUri = pendingEnrollment
            ? totpService.buildOtpAuthUri(authSecurityProperties.getTwoFactorIssuer(), user.getEmail(), manualEntryKey)
            : null;

        return new TwoFactorStatusResponse(
            authSecurityState.isTwoFactorEnabled(),
            pendingEnrollment,
            authSecurityProperties.getTwoFactorIssuer(),
            user.getEmail(),
            manualEntryKey,
            otpAuthUri,
            pendingEnrollment ? authSecurityState.getTwoFactorPendingSecretExpiresAt() : null,
            countBackupCodes(authSecurityState)
        );
    }

    private PasskeyStatusResponse buildPasskeyStatusResponse(AuthSecurityState authSecurityState) {
        return new PasskeyStatusResponse(
            authSecurityState.hasRegisteredPasskey(),
            authSecurityState.getPasskeyRegisteredAt(),
            authSecurityState.getPasskeyLastUsedAt()
        );
    }

    private FaceRecognitionStatusResponse buildFaceRecognitionStatusResponse(AuthSecurityState authSecurityState) {
        return new FaceRecognitionStatusResponse(
            authSecurityState.hasFaceRecognition(),
            authSecurityState.getFaceRecognitionEnrolledAt(),
            authSecurityState.getFaceRecognitionLastUsedAt()
        );
    }

    private AuthUserResponse toAuthUserResponse(User user) {
        Department department = user.getDepartment();
        return new AuthUserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            user.effectiveTeacherType(),
            department != null ? department.getId() : null,
            department != null ? department.getName() : null
        );
    }

    private User findUserByEmail(String email, HttpStatus status, String message) {
        return userRepository.findByEmail(normalizeEmail(email))
            .orElseThrow(() -> new ResponseStatusException(status, message));
    }

    private User findActiveUserByEmail(String email, HttpStatus status, String message) {
        User user = findUserByEmail(email, status, message);
        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Le compte est desactive");
        }
        return user;
    }

    private void validateCurrentPassword(User user, String currentPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_CURRENT_PASSWORD_MESSAGE);
        }
    }

    private AuthSecurityState getOrCreateAuthSecurityState(User user) {
        return authSecurityStateRepository.findById(user.getId())
            .orElseGet(() -> {
                AuthSecurityState authSecurityState = new AuthSecurityState();
                authSecurityState.setUser(user);
                return authSecurityState;
            });
    }

    private void releaseExpiredSecurityState(AuthSecurityState authSecurityState) {
        LocalDateTime now = LocalDateTime.now();
        boolean mutated = false;

        if (authSecurityState.getLoginLockedUntil() != null && !authSecurityState.isLoginLocked(now)) {
            clearLoginFailures(authSecurityState);
            mutated = true;
        }

        if (authSecurityState.getTwoFactorPendingSecretExpiresAt() != null
            && !authSecurityState.hasValidTwoFactorPendingSecret(now)) {
            authSecurityState.clearTwoFactorPendingSecret();
            mutated = true;
        }

        if (authSecurityState.getTwoFactorLoginChallengeExpiresAt() != null
            && !authSecurityState.hasValidTwoFactorLoginChallenge(now)) {
            authSecurityState.clearTwoFactorLoginChallenge();
            mutated = true;
        }

        if (authSecurityState.getTrustedDeviceExpiresAt() != null && !authSecurityState.hasTrustedDevice(now)) {
            authSecurityState.clearTrustedDevice();
            mutated = true;
        }

        if (authSecurityState.getPasskeyRegistrationExpiresAt() != null
            && !authSecurityState.hasValidPasskeyRegistrationChallenge(now)) {
            authSecurityState.clearPasskeyRegistrationChallenge();
            mutated = true;
        }

        if (authSecurityState.getPasskeyAuthenticationExpiresAt() != null
            && !authSecurityState.hasValidPasskeyAuthenticationChallenge(now)) {
            authSecurityState.clearPasskeyAuthenticationChallenge();
            mutated = true;
        }

        if (mutated) {
            authSecurityStateRepository.save(authSecurityState);
        }
    }

    private void registerFailedLoginAttempt(AuthSecurityState authSecurityState) {
        registerFailedAttempt(authSecurityState, INVALID_CREDENTIALS_MESSAGE);
    }

    private void registerFailedSecondFactorAttempt(AuthSecurityState authSecurityState) {
        registerFailedAttempt(authSecurityState, INVALID_TWO_FACTOR_CODE_MESSAGE);
    }

    private void registerFailedAttempt(AuthSecurityState authSecurityState, String message) {
        int failedAttempts = authSecurityState.getFailedLoginAttempts() + 1;
        authSecurityState.setFailedLoginAttempts(failedAttempts);

        if (failedAttempts >= authSecurityProperties.getMaxLoginAttempts()) {
            authSecurityState.setLoginLockedUntil(LocalDateTime.now().plusMinutes(authSecurityProperties.getLockDurationMinutes()));
            authSecurityStateRepository.save(authSecurityState);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, ACCOUNT_LOCKED_MESSAGE);
        }

        authSecurityStateRepository.save(authSecurityState);
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, message);
    }

    private boolean isValidSecondFactor(AuthSecurityState authSecurityState, String rawCode) {
        String normalizedCode = normalizeSecondFactorInput(rawCode);
        String normalizedTotp = normalizeTotpInput(normalizedCode);

        if (!authSecurityState.isTwoFactorEnabled() || !StringUtils.hasText(authSecurityState.getTwoFactorSecret())) {
            return false;
        }

        if (normalizedTotp.matches("\\d{6}") && totpService.verifyCode(authSecurityState.getTwoFactorSecret(), normalizedTotp)) {
            return true;
        }

        return consumeBackupCode(authSecurityState, normalizedCode);
    }

    private boolean consumeBackupCode(AuthSecurityState authSecurityState, String normalizedCode) {
        if (!StringUtils.hasText(normalizedCode)) {
            return false;
        }

        List<String> hashes = getBackupCodeHashes(authSecurityState);
        for (int index = 0; index < hashes.size(); index++) {
            if (passwordEncoder.matches(normalizedCode, hashes.get(index))) {
                hashes.remove(index);
                authSecurityState.setTwoFactorBackupCodeHashes(joinBackupCodeHashes(hashes));
                return true;
            }
        }

        return false;
    }

    private int countBackupCodes(AuthSecurityState authSecurityState) {
        return getBackupCodeHashes(authSecurityState).size();
    }

    private List<String> getBackupCodeHashes(AuthSecurityState authSecurityState) {
        if (!StringUtils.hasText(authSecurityState.getTwoFactorBackupCodeHashes())) {
            return new ArrayList<>();
        }

        List<String> hashes = new ArrayList<>();
        for (String hash : authSecurityState.getTwoFactorBackupCodeHashes().split("\\R")) {
            if (StringUtils.hasText(hash)) {
                hashes.add(hash.trim());
            }
        }
        return hashes;
    }

    private String hashBackupCodes(List<String> backupCodes) {
        List<String> hashes = new ArrayList<>(backupCodes.size());
        for (String backupCode : backupCodes) {
            hashes.add(passwordEncoder.encode(normalizeSecondFactorInput(backupCode)));
        }
        return joinBackupCodeHashes(hashes);
    }

    private String joinBackupCodeHashes(List<String> hashes) {
        return hashes.isEmpty() ? null : String.join("\n", hashes);
    }

    private String issueTwoFactorChallenge(AuthSecurityState authSecurityState) {
        String challengeToken = generateRandomToken();
        authSecurityState.setTwoFactorLoginChallengeHash(passwordEncoder.encode(challengeToken));
        authSecurityState.setTwoFactorLoginChallengeExpiresAt(
            LocalDateTime.now().plusMinutes(authSecurityProperties.getTwoFactorChallengeTtlMinutes())
        );
        return challengeToken;
    }

    private String issueTrustedDeviceToken(AuthSecurityState authSecurityState) {
        String trustedDeviceToken = generateRandomToken();
        authSecurityState.setTrustedDeviceTokenHash(passwordEncoder.encode(trustedDeviceToken));
        authSecurityState.setTrustedDeviceExpiresAt(
            LocalDateTime.now().plusDays(authSecurityProperties.getTrustedDeviceTtlDays())
        );
        return trustedDeviceToken;
    }

    private boolean hasValidTrustedDevice(AuthSecurityState authSecurityState, String rawTrustedDeviceToken, LocalDateTime now) {
        if (!StringUtils.hasText(rawTrustedDeviceToken) || !authSecurityState.hasTrustedDevice(now)) {
            return false;
        }

        return passwordEncoder.matches(rawTrustedDeviceToken.trim(), authSecurityState.getTrustedDeviceTokenHash());
    }

    private List<String> generateBackupCodes() {
        int codeCount = Math.max(4, authSecurityProperties.getTwoFactorBackupCodeCount());
        List<String> backupCodes = new ArrayList<>(codeCount);
        for (int index = 0; index < codeCount; index++) {
            backupCodes.add(generateBackupCode());
        }
        return backupCodes;
    }

    private String generateBackupCode() {
        StringBuilder builder = new StringBuilder(BACKUP_CODE_LENGTH);
        for (int index = 0; index < BACKUP_CODE_LENGTH; index++) {
            builder.append(BACKUP_CODE_ALPHABET.charAt(secureRandom.nextInt(BACKUP_CODE_ALPHABET.length())));
        }

        String rawCode = builder.toString();
        return rawCode.substring(0, 4) + "-" + rawCode.substring(4);
    }

    private void clearLoginFailures(AuthSecurityState authSecurityState) {
        authSecurityState.setFailedLoginAttempts(0);
        authSecurityState.setLoginLockedUntil(null);
    }

    private String generateVerificationCode() {
        StringBuilder builder = new StringBuilder(PASSWORD_RESET_CODE_LENGTH);
        for (int index = 0; index < PASSWORD_RESET_CODE_LENGTH; index++) {
            builder.append(secureRandom.nextInt(10));
        }
        return builder.toString();
    }

    private String generateRandomToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String normalizeSecondFactorInput(String code) {
        if (!StringUtils.hasText(code)) {
            return "";
        }

        return code.trim().replaceAll("[^A-Za-z0-9]", "").toUpperCase();
    }

    private String normalizeTotpInput(String code) {
        if (!StringUtils.hasText(code)) {
            return "";
        }

        return code.replaceAll("\\D", "");
    }

    private String normalizeEmail(String email) {
        return StringUtils.hasText(email) ? email.trim().toLowerCase() : email;
    }

    private String normalizePhoneNumber(String phoneNumber) {
    if (!StringUtils.hasText(phoneNumber)) {
        return "";
    }

    return phoneNumber.trim().replaceAll("[\\s().-]", "");
}

    private boolean isTwoFactorEnrollmentRequired(User user, AuthSecurityState authSecurityState) {
        return MANDATORY_TWO_FACTOR_ROLES.contains(user.getRole()) && !authSecurityState.isTwoFactorEnabled();
    }
}
