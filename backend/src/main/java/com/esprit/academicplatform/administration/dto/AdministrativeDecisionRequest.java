package com.esprit.academicplatform.administration.dto;

import com.esprit.academicplatform.common.enums.ValidationDecision;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdministrativeDecisionRequest(
    @NotBlank @Size(max = 20) String periodLabel,
    @NotNull ValidationDecision decision,
    @Size(max = 1000) String commentText
) {
}

