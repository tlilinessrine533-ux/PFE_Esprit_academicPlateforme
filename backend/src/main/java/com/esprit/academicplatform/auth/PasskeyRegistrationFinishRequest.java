package com.esprit.academicplatform.auth;

import jakarta.validation.constraints.NotBlank;

public record PasskeyRegistrationFinishRequest(
    @NotBlank(message = "L'identifiant de la cle est obligatoire")
    String credentialId,

    @NotBlank(message = "Le payload clientDataJSON est obligatoire")
    String clientDataJSON,

    @NotBlank(message = "Le payload d'attestation est obligatoire")
    String attestationObject
) {
}
