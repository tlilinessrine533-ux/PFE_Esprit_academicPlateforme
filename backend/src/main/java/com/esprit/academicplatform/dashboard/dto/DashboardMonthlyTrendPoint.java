package com.esprit.academicplatform.dashboard.dto;

public record DashboardMonthlyTrendPoint(
    String monthLabel,
    long totalActivities,
    long submittedActivities,
    long validatedActivities,
    long rejectedActivities
) {
}
