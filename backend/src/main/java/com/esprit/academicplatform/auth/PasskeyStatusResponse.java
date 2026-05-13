package com.esprit.academicplatform.auth;

import java.time.LocalDateTime;

public record PasskeyStatusResponse(
    boolean enrolled,
    LocalDateTime registeredAt,
    LocalDateTime lastUsedAt
) {
}
