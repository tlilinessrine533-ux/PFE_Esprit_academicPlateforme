package com.esprit.academicplatform.administration.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdministrativeEvaluationResponse(
    Long teacherId,
    String teacherName,
    String departmentName,
    String periodLabel,
    long validatedActivities,
    BigDecimal validatedTeachingPoints,
    int absenceDays,
    BigDecimal activityTypePoints,
    BigDecimal calculatedWeight,
    BigDecimal calculatedBonus,
    BigDecimal calculatedPromotionPoints,
    String decisionStatus,
    String decisionComment,
    String decidedByName,
    LocalDateTime decidedAt
) {
}
