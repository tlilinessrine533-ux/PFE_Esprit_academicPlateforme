package com.esprit.academicplatform.administration.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdministrativeDecisionHistoryResponse(
    Long id,
    Long teacherId,
    String teacherName,
    String departmentName,
    String periodLabel,
    long validatedActivities,
    BigDecimal validatedTeachingPoints,
    int absenceDays,
    BigDecimal activityTypePoints,
    BigDecimal calculatedBonus,
    BigDecimal calculatedPromotionPoints,
    String decisionStatus,
    String decisionComment,
    Long decidedById,
    String decidedByName,
    LocalDateTime decidedAt,
    LocalDateTime createdAt
) {
}

