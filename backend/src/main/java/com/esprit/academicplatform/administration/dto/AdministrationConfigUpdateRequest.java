package com.esprit.academicplatform.administration.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record AdministrationConfigUpdateRequest(
    @NotNull @DecimalMin("0.00") BigDecimal referencePoints,
    @NotNull @DecimalMin("0.00") BigDecimal bonusAbsencePenaltyPerDay,
    @NotNull @DecimalMin("0.00") BigDecimal promotionTeachingPointFactor,
    @NotNull @DecimalMin("0.00") BigDecimal teachingActivityPoint,
    @NotNull @DecimalMin("0.00") BigDecimal supervisionActivityPoint,
    @NotNull @DecimalMin("0.00") BigDecimal researchActivityPoint,
    @NotNull @DecimalMin("0.00") BigDecimal eventActivityPoint,
    @NotNull @DecimalMin("0.00") BigDecimal examSurveillanceActivityPoint,
    @NotNull @DecimalMin("0.00") BigDecimal responsibilityActivityPoint,
    @NotNull @DecimalMin("0.00") BigDecimal totalPrimeAmount
) {
}
