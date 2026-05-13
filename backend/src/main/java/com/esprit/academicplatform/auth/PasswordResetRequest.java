package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasswordResetRequest(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    String email
) {
}
