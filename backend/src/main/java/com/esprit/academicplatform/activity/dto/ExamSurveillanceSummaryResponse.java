package com.esprit.academicplatform.activity.dto;

import java.math.BigDecimal;

public record ExamSurveillanceSummaryResponse(
    long totalSurveillanceActivities,
    BigDecimal totalPoints,
    long totalSemesterS1,
    long totalSemesterS2,
    long totalAnnualSessions
) {
}
