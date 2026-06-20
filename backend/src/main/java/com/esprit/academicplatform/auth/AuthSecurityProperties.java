package com.esprit.academicplatform.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.auth")
public class AuthSecurityProperties {

    private int maxLoginAttempts = 5;
    private long lockDurationMinutes = 1;
    private long passwordResetCodeTtlMinutes = 10;
    private long twoFactorChallengeTtlMinutes = 5;
    private long twoFactorEnrollmentTtlMinutes = 10;
    private long trustedDeviceTtlDays = 30;
    private String twoFactorIssuer = "ESPRIT Academic Platform";
    private int twoFactorBackupCodeCount = 8;
    private String passwordResetSender = "no-reply@esprit.tn";
    private String passwordResetSubject = "Code de verification de votre compte ESPRIT";
    private boolean logPasswordResetCode = true;
    private boolean smsDemoMode = true;
    private double faceRecognitionMatchThreshold = 0.48d;
}
