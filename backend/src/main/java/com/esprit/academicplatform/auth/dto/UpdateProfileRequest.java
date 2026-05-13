package com.esprit.academicplatform.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
    @NotBlank(message = "Le prenom est obligatoire")
    String firstName,

    @NotBlank(message = "Le nom est obligatoire")
    String lastName,

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    String email
) {
}
