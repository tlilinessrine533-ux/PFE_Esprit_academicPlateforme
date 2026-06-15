package com.esprit.academicplatform.administration.dto;

import java.math.BigDecimal;

public record AdministrationConfigResponse(
    BigDecimal referencePoints,
    BigDecimal bonusAbsencePenaltyPerDay,
    BigDecimal promotionTeachingPointFactor,
    BigDecimal teachingActivityPoint,
    BigDecimal supervisionActivityPoint,
    BigDecimal researchActivityPoint,
    BigDecimal eventActivityPoint,
    BigDecimal examSurveillanceActivityPoint,
    BigDecimal responsibilityActivityPoint,
    BigDecimal totalPrimeAmount
) {
}
