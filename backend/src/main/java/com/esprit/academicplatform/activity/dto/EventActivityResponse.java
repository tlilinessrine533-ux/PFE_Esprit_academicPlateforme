package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.EventType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EventActivityResponse(
    Long id,
    Long userId,
    String teacherName,
    EventType eventType,
    String title,
    LocalDate eventDate,
    String organizationRole,
    BigDecimal activityPoints,
    ActivityStatus status,
    String academicYear,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
