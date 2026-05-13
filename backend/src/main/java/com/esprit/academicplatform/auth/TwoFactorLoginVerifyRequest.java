package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record TwoFactorLoginVerifyRequest(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    String email,

    @NotBlank(message = "Le challenge 2FA est obligatoire")
    String challengeToken,

    @NotBlank(message = "Le code de verification est obligatoire")
    String code,

    boolean rememberDevice
) {
}
