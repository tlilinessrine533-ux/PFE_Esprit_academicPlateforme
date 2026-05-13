package com.esprit.academicplatform.auth;

import com.esprit.academicplatform.auth.dto.AuthLoginRequest;
import com.esprit.academicplatform.auth.dto.AuthResponse;
import com.esprit.academicplatform.auth.dto.AuthUserResponse;
import com.esprit.academicplatform.auth.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.esprit.academicplatform.auth.dto.PhonePasswordResetRequest;
import com.esprit.academicplatform.auth.dto.PhonePasswordResetConfirmRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthLoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/login/verify-2fa")
    public AuthResponse verifyTwoFactorLogin(@Valid @RequestBody TwoFactorLoginVerifyRequest request) {
        return authService.verifyTwoFactorLogin(request);
    }

    @PostMapping("/passkeys/login/options")
    public PasskeyAuthenticationOptionsResponse preparePasskeyAuthentication(
        @Valid @RequestBody PasskeyAuthenticationOptionsRequest request
    ) {
        return authService.preparePasskeyAuthentication(request);
    }

    @PostMapping("/passkeys/login/finish")
    public AuthResponse authenticateWithPasskey(@Valid @RequestBody PasskeyAuthenticationFinishRequest request) {
        return authService.authenticateWithPasskey(request);
    }

    @PostMapping("/face-recognition/login")
    public AuthResponse authenticateWithFaceRecognition(@Valid @RequestBody FaceRecognitionLoginRequest request) {
        return authService.authenticateWithFaceRecognition(request);
    }

    @PostMapping("/password-reset/request")
    public AuthInfoResponse requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        return authService.requestPasswordReset(request);
    }

    @PostMapping("/password-reset/confirm")
    public AuthResponse confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        return authService.confirmPasswordReset(request);
    }

    @PostMapping("/password-reset/phone/request")

public AuthInfoResponse requestPasswordResetByPhone(

    @Valid @RequestBody PhonePasswordResetRequest request

) {

    return authService.requestPasswordResetByPhone(request);

}

@PostMapping("/password-reset/phone/confirm")

public AuthResponse confirmPasswordResetByPhone(

    @Valid @RequestBody PhonePasswordResetConfirmRequest request

) {

    return authService.confirmPasswordResetByPhone(request);

}

    @GetMapping("/me")
    public AuthUserResponse currentUser(Authentication authentication) {
        return authService.getCurrentUser(authentication.getName());
    }

    @PutMapping("/me")
    public AuthUserResponse updateCurrentUser(
        @Valid @RequestBody UpdateProfileRequest request,
        Authentication authentication
    ) {
        return authService.updateCurrentUser(authentication.getName(), request);
    }

    @GetMapping("/face-recognition")
    public FaceRecognitionStatusResponse getFaceRecognitionStatus(Authentication authentication) {
        return authService.getFaceRecognitionStatus(authentication.getName());
    }

    @PostMapping("/face-recognition/enroll")
    public AuthInfoResponse enrollFaceRecognition(
        @Valid @RequestBody FaceRecognitionEnrollRequest request,
        Authentication authentication
    ) {
        return authService.enrollFaceRecognition(authentication.getName(), request);
    }

    @DeleteMapping("/face-recognition")
    public AuthInfoResponse removeFaceRecognition(Authentication authentication) {
        return authService.removeFaceRecognition(authentication.getName());
    }

    @GetMapping("/passkeys")
    public PasskeyStatusResponse getPasskeyStatus(Authentication authentication) {
        return authService.getPasskeyStatus(authentication.getName());
    }

    @PostMapping("/passkeys/register/options")
    public PasskeyRegistrationOptionsResponse preparePasskeyRegistration(Authentication authentication) {
        return authService.preparePasskeyRegistration(authentication.getName());
    }

    @PostMapping("/passkeys/register/finish")
    public AuthInfoResponse registerPasskey(
        @Valid @RequestBody PasskeyRegistrationFinishRequest request,
        Authentication authentication
    ) {
        return authService.registerPasskey(authentication.getName(), request);
    }

    @DeleteMapping("/passkeys")
    public AuthInfoResponse removePasskey(Authentication authentication) {
        return authService.removePasskey(authentication.getName());
    }

    @GetMapping("/two-factor")
    public TwoFactorStatusResponse getTwoFactorStatus(Authentication authentication) {
        return authService.getTwoFactorStatus(authentication.getName());
    }

    @PostMapping("/two-factor/setup")
    public TwoFactorStatusResponse setupTwoFactor(Authentication authentication) {
        return authService.prepareTwoFactorSetup(authentication.getName());
    }

    @PostMapping("/two-factor/enable")
    public TwoFactorEnableResponse enableTwoFactor(
        @Valid @RequestBody TwoFactorEnableRequest request,
        Authentication authentication
    ) {
        return authService.enableTwoFactor(authentication.getName(), request);
    }

    @PostMapping("/two-factor/backup-codes/regenerate")
    public TwoFactorEnableResponse regenerateBackupCodes(
        @Valid @RequestBody TwoFactorBackupCodesRegenerateRequest request,
        Authentication authentication
    ) {
        return authService.regenerateBackupCodes(authentication.getName(), request);
    }

    @PostMapping("/two-factor/disable")
    public AuthInfoResponse disableTwoFactor(
        @Valid @RequestBody TwoFactorDisableRequest request,
        Authentication authentication
    ) {
        return authService.disableTwoFactor(authentication.getName(), request);
    }
}
