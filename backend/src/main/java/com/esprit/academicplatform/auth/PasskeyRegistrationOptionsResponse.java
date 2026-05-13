package com.esprit.academicplatform.auth;

public record PasskeyRegistrationOptionsResponse(
    String challenge,
    String rpId,
    String rpName,
    String userHandle,
    String userName,
    String userDisplayName,
    long timeoutMs
) {
}
