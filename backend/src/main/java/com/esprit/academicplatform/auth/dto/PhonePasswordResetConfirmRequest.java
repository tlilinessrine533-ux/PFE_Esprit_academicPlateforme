package com.esprit.academicplatform.auth.dto;

public record PhonePasswordResetConfirmRequest(
    String phoneNumber,
    String code,
    String newPassword
) {
}