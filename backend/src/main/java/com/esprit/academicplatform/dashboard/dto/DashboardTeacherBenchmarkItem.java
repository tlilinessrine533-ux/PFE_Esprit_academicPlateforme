package com.esprit.academicplatform.dashboard.dto;

import java.math.BigDecimal;

public record DashboardTeacherBenchmarkItem(
    Long teacherId,
    String teacherName,
    long totalActivities,
    long totalTeachingActivities,
    long totalSupervisionActivities,
    long totalResearchActivities,
    long totalEventActivities,
    long totalExamSurveillanceActivities,
    long totalResponsibilityActivities,
    long totalPartnershipActivities,
    long totalSubmittedActivities,
    long totalValidatedActivities,
    long totalRejectedActivities,
    BigDecimal totalCompletedHours,
    BigDecimal totalTeachingPerformancePoints,
    BigDecimal validationRatePercent
) {
}
