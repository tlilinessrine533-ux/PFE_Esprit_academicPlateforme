package com.esprit.academicplatform.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public record DepartmentDashboardResponse(
    String periodLabel,
    Long departmentId,
    String departmentName,
    long totalUsers,
    long totalTeachers,
    long totalTeachingActivities,
    BigDecimal totalCompletedHours,
    BigDecimal totalTeachingPerformancePoints,
    long totalSupervisions,
    long totalPfe,
    long totalResearchActivities,
    long totalEventActivities,
    long totalExamSurveillanceActivities,
    long totalResponsibilityActivities,
    long totalPartnershipActivities,
    long totalActivities,
    long totalSubmittedActivities,
    long totalValidatedActivities,
    long totalRejectedActivities,
    long totalPendingActivities,
    BigDecimal validationRatePercent,
    BigDecimal averageValidationDelayDays,
    BigDecimal averagePointsPerTeacher,
    BigDecimal bestTeacherScore,
    BigDecimal averageAbsenceDays,
    BigDecimal departmentActivityRate,
    long totalGeneratedReports,
    List<DashboardActivityBreakdownItem> activityBreakdown,
    List<DashboardMonthlyTrendPoint> monthlyTrend,
    List<DashboardTeacherBenchmarkItem> teacherBenchmark
) {
}
