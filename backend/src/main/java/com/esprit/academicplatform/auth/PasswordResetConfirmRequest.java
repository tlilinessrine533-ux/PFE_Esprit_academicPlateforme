package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordResetConfirmRequest(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    String email,

    @NotBlank(message = "Le code de verification est obligatoire")
    @Pattern(regexp = "^\\d{6}$", message = "Le code de verification doit contenir 6 chiffres")
    String code,

    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caracteres")
    @Pattern(
        regexp = "^(?=.*[^A-Za-z0-9])(?=\\S+$).{8,}$",
        message = "Le mot de passe doit contenir au moins 8 caracteres et un caractere special"
    )
    String newPassword
) {
}
