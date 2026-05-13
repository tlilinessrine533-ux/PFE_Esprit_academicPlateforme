package com.esprit.academicplatform.dashboard.dto;

import java.math.BigDecimal;

public record DashboardDepartmentBenchmarkItem(
    Long departmentId,
    String departmentName,
    long totalTeachers,
    long totalActivities,
    long totalSubmittedActivities,
    long totalValidatedActivities,
    long totalRejectedActivities,
    BigDecimal totalCompletedHours,
    BigDecimal totalTeachingPerformancePoints,
    BigDecimal validationRatePercent
) {
}
