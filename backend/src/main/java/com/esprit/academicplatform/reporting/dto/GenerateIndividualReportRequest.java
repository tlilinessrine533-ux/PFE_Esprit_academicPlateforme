package com.esprit.academicplatform.reporting.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record GenerateIndividualReportRequest(
    @NotBlank(message = "L'annee universitaire est obligatoire")
    @Size(max = 50, message = "L'annee universitaire est invalide")
    String periodLabel,

    @NotNull(message = "L'appreciation globale est obligatoire")
    @Min(value = 1, message = "L'appreciation doit etre comprise entre 1 et 5")
    @Max(value = 5, message = "L'appreciation doit etre comprise entre 1 et 5")
    Integer appreciationLevel,

    @NotEmpty(message = "Au moins un objectif pour l'annee a venir est obligatoire")
    @Size(max = 8, message = "Le nombre d'objectifs est limite a 8")
    List<@Valid FutureObjectiveRequest> futureObjectives
) {
}
