package com.esprit.academicplatform.activity.dto;

import java.math.BigDecimal;

public record ResearchSummaryResponse(
    long totalResearchActivities,
    BigDecimal totalPoints,
    long totalDevelopmentProjects,
    long totalResearchProjects,
    long totalPublications,
    long totalPresentations
) {
}
