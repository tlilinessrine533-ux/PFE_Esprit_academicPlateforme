package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.JuryRole;
import com.esprit.academicplatform.common.enums.StatutEncadrement;
import com.esprit.academicplatform.common.enums.SupervisionType;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSupervisionActivityRequest(
    @NotNull(message = "Le type d'encadrement est obligatoire")
    SupervisionType supervisionType,

    @NotBlank(message = "Le nom de l'etudiant est obligatoire")
    String studentName,

    @NotBlank(message = "Le niveau est obligatoire")
    String studentProgram,

    @NotBlank(message = "Le titre du sujet est obligatoire")
    String subjectTitle,

    @NotNull(message = "Le statut de l'encadrement est obligatoire")
    StatutEncadrement supervisionStatus,

    JuryRole roleInJury,

    BigDecimal quantityValue,

    @NotBlank(message = "L'annee universitaire est obligatoire")
    String academicYear
) {
}
