package com.esprit.academicplatform.auth.dto;

public record AuthResponse(
    String token,
    String tokenType,
    long expiresIn,
    AuthUserResponse user,
    boolean requiresTwoFactor,
    boolean requiresTwoFactorEnrollment,
    String twoFactorChallengeToken,
    long twoFactorChallengeExpiresIn,
    String trustedDeviceToken,
    long trustedDeviceExpiresIn
) {
    public static AuthResponse authenticated(
        String token,
        String tokenType,
        long expiresIn,
        AuthUserResponse user,
        String trustedDeviceToken,
        long trustedDeviceExpiresIn
    ) {
        return new AuthResponse(
            token,
            tokenType,
            expiresIn,
            user,
            false,
            false,
            null,
            0,
            trustedDeviceToken,
            trustedDeviceExpiresIn
        );
    }

    public static AuthResponse authenticatedWithTwoFactorEnrollmentRequired(
        String token,
        String tokenType,
        long expiresIn,
        AuthUserResponse user,
        String trustedDeviceToken,
        long trustedDeviceExpiresIn
    ) {
        return new AuthResponse(
            token,
            tokenType,
            expiresIn,
            user,
            false,
            true,
            null,
            0,
            trustedDeviceToken,
            trustedDeviceExpiresIn
        );
    }

    public static AuthResponse twoFactorRequired(String challengeToken, long challengeExpiresInSeconds) {
        return new AuthResponse(null, null, 0, null, true, false, challengeToken, challengeExpiresInSeconds, null, 0);
    }
}
