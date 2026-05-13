package com.esprit.academicplatform.activity.dto;

import com.esprit.academicplatform.common.enums.SemesterType;
import com.esprit.academicplatform.common.enums.TeachingMode;
import com.esprit.academicplatform.common.enums.PartnershipDeclarationType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpdateTeachingActivityRequest(
    @NotBlank(message = "La formation est obligatoire")
    String programName,

    @NotBlank(message = "La classe est obligatoire")
    String className,

    @NotBlank(message = "Le module est obligatoire")
    String moduleName,

    @NotNull(message = "Le semestre est obligatoire")
    SemesterType semester,

    @NotNull(message = "Le type d'enseignement est obligatoire")
    TeachingMode teachingMode,

    @NotBlank(message = "La langue est obligatoire")
    String language,

    @NotNull(message = "Le nombre d'heures prevues est obligatoire")
    @DecimalMin(value = "0.0", inclusive = true, message = "Les heures prevues doivent etre positives ou nulles")
    BigDecimal plannedHours,

    @NotNull(message = "Le nombre d'heures realisees est obligatoire")
    @DecimalMin(value = "0.0", inclusive = true, message = "Les heures realisees doivent etre positives ou nulles")
    BigDecimal completedHours,

    @NotNull(message = "Le volume des heures de nouveau cours est obligatoire")
    @DecimalMin(value = "0.0", inclusive = true, message = "Les heures de nouveau cours doivent etre positives ou nulles")
    BigDecimal newCourseHours,

    @NotNull(message = "Le pourcentage de restructuration est obligatoire")
    @Min(value = 0, message = "Le pourcentage de restructuration doit etre compris entre 0 et 100")
    @Max(value = 100, message = "Le pourcentage de restructuration doit etre compris entre 0 et 100")
    Integer courseRestructuringPercentage,

    @NotNull(message = "Le nombre de syllabus est obligatoire")
    @Min(value = 0, message = "Le nombre de syllabus doit etre positif ou nul")
    Integer syllabusCount,

    @NotNull(message = "L'indicateur de fichier CAR est obligatoire")
    Boolean carFileElaborated,

    @NotNull(message = "L'indicateur d'elaboration d'examen est obligatoire")
    Boolean examElaborated,

    @NotNull(message = "Le volume des cours de soir ou samedi est obligatoire")
    @DecimalMin(value = "0.0", inclusive = true, message = "Les heures de soir ou samedi doivent etre positives ou nulles")
    BigDecimal eveningOrSaturdayHours,

    @NotNull(message = "L'indicateur de coordination est obligatoire")
    Boolean coordination,

    @NotBlank(message = "L'annee universitaire est obligatoire")
    String academicYear,

    PartnershipDeclarationType partnershipDeclarationType,

    String syllabusPath
) {
}
