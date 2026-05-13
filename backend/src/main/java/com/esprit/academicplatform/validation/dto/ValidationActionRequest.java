package com.esprit.academicplatform.validation.dto;

import com.esprit.academicplatform.common.enums.ValidationDecision;
import jakarta.validation.constraints.NotNull;

public record ValidationActionRequest(
    @NotNull(message = "La decision est obligatoire")
    ValidationDecision decision,

    String commentText
) {
}
