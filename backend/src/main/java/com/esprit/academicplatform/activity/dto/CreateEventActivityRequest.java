package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateEventActivityRequest(
    @NotNull(message = "Le type d evenement est obligatoire")
    EventType eventType,

    @NotBlank(message = "Le titre est obligatoire")
    String title,

    @NotNull(message = "La date de l evenement est obligatoire")
    LocalDate eventDate,

    String organizationRole,

    @NotBlank(message = "L'annee universitaire est obligatoire")
    String academicYear
) {
}
