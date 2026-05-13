package com.esprit.academicplatform.auth;

import com.esprit.academicplatform.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "auth_security_states")
public class AuthSecurityState {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts;

    @Column(name = "login_locked_until")
    private LocalDateTime loginLockedUntil;

    @Column(name = "password_reset_code_hash", length = 255)
    private String passwordResetCodeHash;

    @Column(name = "password_reset_expires_at")
    private LocalDateTime passwordResetExpiresAt;

    @Column(name = "password_reset_requested_at")
    private LocalDateTime passwordResetRequestedAt;

    @Column(name = "two_factor_enabled", nullable = false)
    private boolean twoFactorEnabled;

    @Column(name = "two_factor_secret", length = 128)
    private String twoFactorSecret;

    @Column(name = "two_factor_pending_secret", length = 128)
    private String twoFactorPendingSecret;

    @Column(name = "two_factor_pending_secret_expires_at")
    private LocalDateTime twoFactorPendingSecretExpiresAt;

    @Column(name = "two_factor_login_challenge_hash", length = 255)
    private String twoFactorLoginChallengeHash;

    @Column(name = "two_factor_login_challenge_expires_at")
    private LocalDateTime twoFactorLoginChallengeExpiresAt;

    @Column(name = "two_factor_backup_code_hashes", columnDefinition = "TEXT")
    private String twoFactorBackupCodeHashes;

    @Column(name = "trusted_device_token_hash", length = 255)
    private String trustedDeviceTokenHash;

    @Column(name = "trusted_device_expires_at")
    private LocalDateTime trustedDeviceExpiresAt;

    @Column(name = "passkey_credential_id", length = 255)
    private String passkeyCredentialId;

    @Column(name = "passkey_public_key", columnDefinition = "TEXT")
    private String passkeyPublicKey;

    @Column(name = "passkey_sign_count", nullable = false)
    private long passkeySignCount;

    @Column(name = "passkey_registered_at")
    private LocalDateTime passkeyRegisteredAt;

    @Column(name = "passkey_last_used_at")
    private LocalDateTime passkeyLastUsedAt;

    @Column(name = "passkey_registration_challenge", length = 255)
    private String passkeyRegistrationChallenge;

    @Column(name = "passkey_registration_expires_at")
    private LocalDateTime passkeyRegistrationExpiresAt;

    @Column(name = "passkey_authentication_challenge", length = 255)
    private String passkeyAuthenticationChallenge;

    @Column(name = "passkey_authentication_expires_at")
    private LocalDateTime passkeyAuthenticationExpiresAt;

    @Column(name = "face_recognition_descriptor", columnDefinition = "TEXT")
    private String faceRecognitionDescriptor;

    @Column(name = "face_recognition_enrolled_at")
    private LocalDateTime faceRecognitionEnrolledAt;

    @Column(name = "face_recognition_last_used_at")
    private LocalDateTime faceRecognitionLastUsedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public boolean isLoginLocked(LocalDateTime now) {
        return loginLockedUntil != null && loginLockedUntil.isAfter(now);
    }

    public boolean hasValidPasswordResetCode(LocalDateTime now) {
        return passwordResetCodeHash != null
            && passwordResetExpiresAt != null
            && passwordResetExpiresAt.isAfter(now);
    }

    public void clearPasswordResetState() {
        passwordResetCodeHash = null;
        passwordResetExpiresAt = null;
        passwordResetRequestedAt = null;
    }

    public boolean hasValidTwoFactorPendingSecret(LocalDateTime now) {
        return twoFactorPendingSecret != null
            && twoFactorPendingSecretExpiresAt != null
            && twoFactorPendingSecretExpiresAt.isAfter(now);
    }

    public boolean hasValidTwoFactorLoginChallenge(LocalDateTime now) {
        return twoFactorLoginChallengeHash != null
            && twoFactorLoginChallengeExpiresAt != null
            && twoFactorLoginChallengeExpiresAt.isAfter(now);
    }

    public void clearTwoFactorPendingSecret() {
        twoFactorPendingSecret = null;
        twoFactorPendingSecretExpiresAt = null;
    }

    public void clearTwoFactorLoginChallenge() {
        twoFactorLoginChallengeHash = null;
        twoFactorLoginChallengeExpiresAt = null;
    }

    public boolean hasTrustedDevice(LocalDateTime now) {
        return trustedDeviceTokenHash != null
            && trustedDeviceExpiresAt != null
            && trustedDeviceExpiresAt.isAfter(now);
    }

    public void clearTrustedDevice() {
        trustedDeviceTokenHash = null;
        trustedDeviceExpiresAt = null;
    }

    public boolean hasRegisteredPasskey() {
        return passkeyCredentialId != null && passkeyPublicKey != null;
    }

    public boolean hasValidPasskeyRegistrationChallenge(LocalDateTime now) {
        return passkeyRegistrationChallenge != null
            && passkeyRegistrationExpiresAt != null
            && passkeyRegistrationExpiresAt.isAfter(now);
    }

    public boolean hasValidPasskeyAuthenticationChallenge(LocalDateTime now) {
        return passkeyAuthenticationChallenge != null
            && passkeyAuthenticationExpiresAt != null
            && passkeyAuthenticationExpiresAt.isAfter(now);
    }

    public void clearPasskeyRegistrationChallenge() {
        passkeyRegistrationChallenge = null;
        passkeyRegistrationExpiresAt = null;
    }

    public void clearPasskeyAuthenticationChallenge() {
        passkeyAuthenticationChallenge = null;
        passkeyAuthenticationExpiresAt = null;
    }

    public void clearPasskeyCredential() {
        passkeyCredentialId = null;
        passkeyPublicKey = null;
        passkeySignCount = 0;
        passkeyRegisteredAt = null;
        passkeyLastUsedAt = null;
        clearPasskeyRegistrationChallenge();
        clearPasskeyAuthenticationChallenge();
    }

    public boolean hasFaceRecognition() {
        return faceRecognitionDescriptor != null;
    }

    public void clearFaceRecognition() {
        faceRecognitionDescriptor = null;
        faceRecognitionEnrolledAt = null;
        faceRecognitionLastUsedAt = null;
    }

    public void disableTwoFactor() {
        twoFactorEnabled = false;
        twoFactorSecret = null;
        twoFactorBackupCodeHashes = null;
        clearTwoFactorPendingSecret();
        clearTwoFactorLoginChallenge();
        clearTrustedDevice();
    }

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
