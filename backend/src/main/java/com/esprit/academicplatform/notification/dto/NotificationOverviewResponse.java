package com.esprit.academicplatform.notification.dto;

import java.util.List;

public record NotificationOverviewResponse(
    long unreadCount,
    List<NotificationItemResponse> notifications
) {
}
