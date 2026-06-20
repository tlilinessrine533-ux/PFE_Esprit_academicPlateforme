package com.esprit.academicplatform.auth;

public record AuthInfoResponse(String message, String verificationCode) {

    public AuthInfoResponse(String message) {
        this(message, null);
    }
}
