package com.esprit.academicplatform.auth;

import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.regex.Pattern;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class TotpService {

    private static final int SECRET_SIZE_BYTES = 20;
    private static final int OTP_DIGITS = 6;
    private static final int PERIOD_SECONDS = 30;
    private static final int ALLOWED_TIME_WINDOWS = 1;
    private static final Pattern OTP_PATTERN = Pattern.compile("\\d{6}");

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateSecret() {
        byte[] secret = new byte[SECRET_SIZE_BYTES];
        secureRandom.nextBytes(secret);
        return Base32Encoding.encode(secret);
    }

    public boolean verifyCode(String secret, String code) {
        if (secret == null || secret.isBlank()) {
            return false;
        }

        String normalizedCode = normalizeCode(code);
        if (normalizedCode == null) {
            return false;
        }

        byte[] secretBytes = decodeSecret(secret);
        if (secretBytes == null) {
            return false;
        }

        long currentWindow = Instant.now().getEpochSecond() / PERIOD_SECONDS;

        for (int offset = -ALLOWED_TIME_WINDOWS; offset <= ALLOWED_TIME_WINDOWS; offset++) {
            String expectedCode = generateCode(secretBytes, currentWindow + offset);
            if (expectedCode.equals(normalizedCode)) {
                return true;
            }
        }

        return false;
    }

    public String buildOtpAuthUri(String issuer, String accountName, String secret) {
        String safeIssuer = issuer == null || issuer.isBlank() ? "Academic Platform" : issuer.trim();
        String safeAccountName = accountName == null || accountName.isBlank() ? "user" : accountName.trim();
        String encodedIssuer = encodeOtpComponent(safeIssuer);
        String encodedAccountName = encodeOtpComponent(safeAccountName);

        return "otpauth://totp/"
            + encodedIssuer
            + ":"
            + encodedAccountName
            + "?secret="
            + secret
            + "&issuer="
            + encodedIssuer
            + "&algorithm=SHA1&digits="
            + OTP_DIGITS
            + "&period="
            + PERIOD_SECONDS;
    }

    private String encodeOtpComponent(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }

    private String normalizeCode(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }

        String normalized = code.replaceAll("\\D", "");
        return OTP_PATTERN.matcher(normalized).matches() ? normalized : null;
    }

    private byte[] decodeSecret(String secret) {
        String normalizedSecret = secret.replace(" ", "").toUpperCase();

        try {
            return Base32Encoding.decode(normalizedSecret);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private String generateCode(byte[] secret, long counter) {
        try {
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(secret, "HmacSHA1"));
            byte[] hash = mac.doFinal(ByteBuffer.allocate(8).putLong(counter).array());

            int offset = hash[hash.length - 1] & 0x0f;
            int binary = ((hash[offset] & 0x7f) << 24)
                | ((hash[offset + 1] & 0xff) << 16)
                | ((hash[offset + 2] & 0xff) << 8)
                | (hash[offset + 3] & 0xff);

            int otp = binary % (int) Math.pow(10, OTP_DIGITS);
            return String.format("%0" + OTP_DIGITS + "d", otp);
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Unable to generate TOTP code.", exception);
        }
    }
}
