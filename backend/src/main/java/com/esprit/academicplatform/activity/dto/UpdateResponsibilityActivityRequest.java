package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.ResponsibilityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record UpdateResponsibilityActivityRequest(
    @NotNull(message = "Le type de responsabilité est obligatoire")
    ResponsibilityType responsibilityType,

    @NotNull(message = "La date de debut est obligatoire")
    LocalDate startDate,

    LocalDate endDate,

    @NotBlank(message = "L'année universitaire est obligatoire")
    String academicYear
) {
}
