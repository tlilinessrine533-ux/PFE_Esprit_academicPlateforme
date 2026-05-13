package com.esprit.academicplatform.signuprequest.dto;

import jakarta.validation.constraints.Size;

public record ReviewSignupRequest(
    @Size(max = 1000, message = "Le commentaire est trop long")
    String reviewComment
) {
}
