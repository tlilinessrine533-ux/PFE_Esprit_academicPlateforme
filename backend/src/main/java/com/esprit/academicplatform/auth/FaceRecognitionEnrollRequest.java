package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record FaceRecognitionEnrollRequest(
    @NotEmpty(message = "Le descripteur facial est obligatoire")
    List<@NotNull(message = "Le descripteur facial est obligatoire") Double> descriptor
) {
}
