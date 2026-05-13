package com.esprit.academicplatform.auth;

public record PasskeyAuthenticationOptionsResponse(
    String challenge,
    String rpId,
    String credentialId,
    long timeoutMs
) {
}
