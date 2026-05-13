package com.esprit.academicplatform.activity.dto;

import java.math.BigDecimal;

public record EventSummaryResponse(
    long totalEvents,
    BigDecimal totalPoints,
    long totalScientificEvents,
    long totalClubActivities,
    long totalHackathons,
    long totalSchoolActivities
) {
}
