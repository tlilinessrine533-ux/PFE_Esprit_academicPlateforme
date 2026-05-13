package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import com.esprit.academicplatform.common.enums.ResponsibilityType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ResponsibilityActivityResponse(
    Long id,
    Long userId,
    String teacherName,
    ResponsibilityType responsibilityType,
    LocalDate startDate,
    LocalDate endDate,
    ActivityStatus status,
    String academicYear,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
