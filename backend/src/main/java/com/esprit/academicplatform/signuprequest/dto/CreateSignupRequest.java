package com.esprit.academicplatform.signuprequest.dto;

import com.esprit.academicplatform.common.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateSignupRequest(
    @NotBlank(message = "Le prenom est obligatoire")
    String firstName,

    @NotBlank(message = "Le nom est obligatoire")
    String lastName,

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    @Pattern(regexp = "(?i)^[^\\s@]+@esprit\\.tn$", message = "L'email doit obligatoirement se terminer par @esprit.tn")
    String email,

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caracteres")
    @Pattern(
        regexp = "^(?=.*[^A-Za-z0-9])(?=\\S+$).{8,}$",
        message = "Le mot de passe doit contenir au moins 8 caracteres et un caractere special"
    )
    String password,

    @NotNull(message = "Le role demande est obligatoire")
    RoleType role,

    Long departmentId,

    @Size(max = 100, message = "Le departement ne doit pas depasser 100 caracteres")
    String departmentName
) {
}
