package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.SurveillanceSessionDay;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateExamSurveillanceActivityRequest(
    @NotBlank(message = "La session est obligatoire")
    String sessionName,

    @NotNull(message = "Le semestre est obligatoire")
    SemesterType semester,

    @NotNull(message = "Le jour de seance est obligatoire")
    SurveillanceSessionDay sessionDay,

    @NotBlank(message = "L'annee universitaire est obligatoire")
    String academicYear
) {
}
