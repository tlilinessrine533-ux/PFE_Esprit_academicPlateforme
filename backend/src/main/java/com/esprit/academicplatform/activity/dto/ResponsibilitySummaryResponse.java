package com.esprit.academicplatform.activity.dto;

public record ResponsibilitySummaryResponse(
    long totalResponsibilities,
    long totalActiveResponsibilities,
    long totalCompletedResponsibilities,
    long totalLeadershipResponsibilities
) {
}
