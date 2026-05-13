package com.esprit.academicplatform.workflow.dto;

import com.esprit.academicplatform.common.enums.ActivityStatus;
import java.time.LocalDateTime;

public record WorkflowActivityResponse(
    Long id,
    String activityType,
    Long userId,
    String teacherName,
    String title,
    String subtitle,
    String summary,
    String metricLabel,
    String metricValue,
    ActivityStatus status,
    String academicYear,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
