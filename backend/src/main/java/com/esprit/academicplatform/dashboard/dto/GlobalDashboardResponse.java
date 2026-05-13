package com.esprit.academicplatform.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public record GlobalDashboardResponse(
    String periodLabel,
    long totalDepartments,
    long totalUsers,
    long totalActiveUsers,
    long totalDisabledUsers,
    long totalAdministrationUsers,
    long totalDepartmentHeadUsers,
    long totalSuperAdminUsers,
    long totalRoles,
    long totalTeachers,
    long systemLogsCount,
    boolean systemLogsCountPlaceholder,
    BigDecimal errorRatePercent,
    long totalLogins,
    boolean totalLoginsPlaceholder,
    long totalConfigurationChanges,
    BigDecimal platformAvailabilityPercent,
    boolean platformAvailabilityPlaceholder,
    long totalAdministrativeIncidents,
    boolean administrativeIncidentsDerived,
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
    long totalGeneratedReports,
    List<DashboardActivityBreakdownItem> activityBreakdown,
    List<DashboardMonthlyTrendPoint> monthlyTrend,
    List<DashboardDepartmentBenchmarkItem> departmentBenchmark
) {
}
