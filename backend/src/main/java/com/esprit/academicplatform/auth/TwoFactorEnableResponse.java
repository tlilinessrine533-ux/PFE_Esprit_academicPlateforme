package com.esprit.academicplatform.auth;

import java.util.List;

public record TwoFactorEnableResponse(
    String message,
    List<String> backupCodes
) {
}
