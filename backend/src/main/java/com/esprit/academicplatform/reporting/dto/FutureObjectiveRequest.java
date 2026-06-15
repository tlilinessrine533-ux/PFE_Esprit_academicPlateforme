package com.esprit.academicplatform.reporting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FutureObjectiveRequest(
    @NotBlank(message = "L'objectif est obligatoire")
    @Size(max = 1200, message = "L'objectif est trop long")
    String objective,

    @NotBlank(message = "Le delai est obligatoire")
    @Size(max = 255, message = "Le delai est trop long")
    String timeline,

    @NotBlank(message = "Les moyens necessaires sont obligatoires")
    @Size(max = 1200, message = "Le champ des moyens est trop long")
    String requiredResources,

    @NotBlank(message = "Les indicateurs attendus sont obligatoires")
    @Size(max = 1200, message = "Le champ des indicateurs est trop long")
    String successIndicators
) {
}
