package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasskeyAuthenticationFinishRequest(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    String email,

    @NotBlank(message = "L'identifiant de la cle est obligatoire")
    String credentialId,

    @NotBlank(message = "Le payload clientDataJSON est obligatoire")
    String clientDataJSON,

    @NotBlank(message = "Le payload authenticatorData est obligatoire")
    String authenticatorData,

    @NotBlank(message = "La signature est obligatoire")
    String signature,

    String userHandle
) {
}
