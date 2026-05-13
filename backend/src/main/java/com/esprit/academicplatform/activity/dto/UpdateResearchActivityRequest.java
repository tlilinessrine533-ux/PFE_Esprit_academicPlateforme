package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.PublicationType;
import com.esprit.academicplatform.common.enums.ResearchPublicationRank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateResearchActivityRequest(
    @NotNull(message = "Le type de recherche est obligatoire")
    PublicationType publicationType,

    @NotBlank(message = "Le titre est obligatoire")
    String title,

    String venueName,

    @Min(value = 2000, message = "L'annee de publication est invalide")
    @Max(value = 2100, message = "L'annee de publication est invalide")
    Integer publicationYear,

    String indexingName,

    String doi,

    String studentName,

    String pfeLevel,

    String deliverable,

    ResearchPublicationRank publicationRank,

    @NotBlank(message = "L'annee universitaire est obligatoire")
    String academicYear
) {
}
