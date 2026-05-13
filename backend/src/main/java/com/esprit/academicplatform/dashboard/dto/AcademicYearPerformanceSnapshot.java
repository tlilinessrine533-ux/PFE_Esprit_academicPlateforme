package com.esprit.academicplatform.dashboard.dto;

import java.math.BigDecimal;

public record AcademicYearPerformanceSnapshot(
    String periodLabel,
    long totalActivities,
    long totalTeachingActivities,
    long totalSupervisions,
    long totalResearchActivities,
    long totalEventActivities,
    long totalExamSurveillanceActivities,
    long totalResponsibilityActivities,
    long totalPartnershipActivities,
    BigDecimal teachingPerformancePoints,
    BigDecimal generalScore
) {
}
