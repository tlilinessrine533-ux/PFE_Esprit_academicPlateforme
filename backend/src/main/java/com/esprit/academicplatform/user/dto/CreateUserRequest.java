package com.esprit.academicplatform.user.dto;

import com.esprit.academicplatform.common.enums.RoleType;
import com.esprit.academicplatform.common.enums.TeacherType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @NotBlank(message = "Le prenom est obligatoire")
    String firstName,

    @NotBlank(message = "Le nom est obligatoire")
    String lastName,

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    @Pattern(regexp = "^[^\\s@]+@esprit\\.tn$", message = "Utilisez une adresse institutionnelle esprit.tn")
    String email,

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caracteres")
    String password,

    @NotNull(message = "Le rôle est obligatoire")
    RoleType role,

    TeacherType teacherType,

    Long departmentId,

    @Size(max = 100, message = "Le departement ne doit pas depasser 100 caracteres")
    String departmentName,

    Boolean isActive
) {
}
