package com.esprit.academicplatform.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthLoginRequest(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    String email,

    @NotBlank(message = "Le mot de passe est obligatoire")
    String password,

    String trustedDeviceToken
) {
}
