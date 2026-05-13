package com.esprit.academicplatform.auth;

import java.time.LocalDateTime;

public record FaceRecognitionStatusResponse(
    boolean enrolled,
    LocalDateTime enrolledAt,
    LocalDateTime lastUsedAt
) {
}
