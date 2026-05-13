package com.esprit.academicplatform.activity.dto;

import java.math.BigDecimal;

public record SupervisionSummaryResponse(
    long totalSupervisions,
    long totalPfe,
    long totalSupported,
    long totalJuryParticipations,
    BigDecimal totalPoints
) {
}
