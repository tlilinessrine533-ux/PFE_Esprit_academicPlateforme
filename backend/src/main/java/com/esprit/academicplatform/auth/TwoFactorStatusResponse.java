package com.esprit.academicplatform.auth;

import java.time.LocalDateTime;

public record TwoFactorStatusResponse(
    boolean enabled,
    boolean pendingEnrollment,
    String issuer,
    String accountName,
    String manualEntryKey,
    String otpAuthUri,
    LocalDateTime setupExpiresAt,
    int backupCodesRemaining
) {
}
