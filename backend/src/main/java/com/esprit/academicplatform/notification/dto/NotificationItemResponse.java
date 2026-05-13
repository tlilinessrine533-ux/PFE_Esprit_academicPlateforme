package com.esprit.academicplatform.notification.dto;

import java.time.LocalDateTime;

public record NotificationItemResponse(
    Long id,
    String title,
    String messageText,
    boolean isRead,
    LocalDateTime createdAt
) {
}
