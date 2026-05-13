package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.NotBlank;

public record TwoFactorEnableRequest(
    @NotBlank(message = "Le mot de passe actuel est obligatoire")
    String currentPassword,

    @NotBlank(message = "Le code de verification est obligatoire")
    String code
) {
}
