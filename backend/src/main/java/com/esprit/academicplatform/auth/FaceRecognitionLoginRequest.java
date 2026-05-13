package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record FaceRecognitionLoginRequest(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    String email,

    @NotEmpty(message = "Le descripteur facial est obligatoire")
    List<@NotNull(message = "Le descripteur facial est obligatoire") Double> descriptor
) {
}
