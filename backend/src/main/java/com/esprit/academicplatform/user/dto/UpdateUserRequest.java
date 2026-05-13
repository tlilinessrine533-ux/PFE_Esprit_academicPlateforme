package com.esprit.academicplatform.user.dto;

import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.TeacherType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdateUserRequest(
    @NotBlank(message = "Le prenom est obligatoire")
    String firstName,

    @NotBlank(message = "Le nom est obligatoire")
    String lastName,

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    @Pattern(regexp = "^[^\\s@]+@esprit\\.tn$", message = "Utilisez une adresse institutionnelle esprit.tn")
    String email,

    @NotNull(message = "Le rôle est obligatoire")
    RoleType role,

    TeacherType teacherType,

    Long departmentId,

    @NotNull(message = "Le statut actif est obligatoire")
    Boolean isActive
) {
}
