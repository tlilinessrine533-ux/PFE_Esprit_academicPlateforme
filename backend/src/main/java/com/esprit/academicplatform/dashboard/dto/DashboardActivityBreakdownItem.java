package com.esprit.academicplatform.dashboard.dto;

public record DashboardActivityBreakdownItem(
    String key,
    String label,
    long total
) {
}
