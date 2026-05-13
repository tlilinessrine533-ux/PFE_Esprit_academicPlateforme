import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import {
  AuthInfoResponse,
  FaceRecognitionLoginPayload,
  FaceRecognitionPayload,
  FaceRecognitionStatusResponse,
  PasskeyAuthenticationFinishPayload,
  PasskeyAuthenticationOptionsResponse,
  PasskeyRegistrationFinishPayload,
  PasskeyRegistrationOptionsResponse,
  PasskeyStatusResponse,
  AuthResponse,
  AuthSession,
  TwoFactorDisablePayload,
  TwoFactorEnablePayload,
  TwoFactorEnableResponse,
  TwoFactorLoginPayload,
  TwoFactorStatusResponse,
  AuthUser,
  LoginPayload,
  PhonePasswordResetConfirmPayload,
  PhonePasswordResetRequestPayload,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  UpdateProfilePayload
} from '../models/auth.models';
import { RoleType } from '../models/shared.models';

const STORAGE_KEY = 'academic-platform-session';
const TRUSTED_DEVICE_STORAGE_KEY = 'academic-platform-trusted-devices';

interface TrustedDeviceEntry {
  token: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionSignal = signal<AuthSession | null>(this.loadStoredSession());
  private readonly trustedDevices = new Map<string, TrustedDeviceEntry>(this.loadTrustedDevices());

  readonly session = this.sessionSignal.asReadonly();
  readonly user = computed(() => this.sessionSignal()?.user ?? null);
  readonly token = computed(() => this.sessionSignal()?.token ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.token()));
  readonly role = computed(() => this.user()?.role ?? null);
  readonly requiresTwoFactorEnrollment = computed(() => Boolean(this.sessionSignal()?.requiresTwoFactorEnrollment));

  login(payload: LoginPayload) {
    const normalizedEmail = this.normalizeEmail(payload.email);
    return this.http
      .post<AuthResponse>('/api/auth/login', {
        email: normalizedEmail,
        password: payload.password,
        trustedDeviceToken: this.getTrustedDeviceToken(normalizedEmail)
      })
      .pipe(
        tap((response) => {
          if (response.requiresTwoFactor || response.requiresTwoFactorEnrollment) {
            this.clearTrustedDevice(normalizedEmail);
          }

          this.storeSession(response);
          this.storeTrustedDevice(normalizedEmail, response);
        })
      );
  }

  verifyTwoFactorLogin(payload: TwoFactorLoginPayload) {
    const normalizedEmail = this.normalizeEmail(payload.email);
    return this.http
      .post<AuthResponse>('/api/auth/login/verify-2fa', {
        ...payload,
        email: normalizedEmail
      })
      .pipe(
        tap((response) => {
          this.storeSession(response);
          this.storeTrustedDevice(normalizedEmail, response);
        })
      );
  }

  requestPasswordReset(payload: PasswordResetRequestPayload) {
    return this.http.post<AuthInfoResponse>('/api/auth/password-reset/request', payload);
  }

  requestPasswordResetByPhone(payload: PhonePasswordResetRequestPayload) {
    return this.http.post<AuthInfoResponse>('/api/auth/password-reset/phone/request', {
      phoneNumber: payload.phoneNumber.trim()
    });
  }

  confirmPasswordReset(payload: PasswordResetConfirmPayload) {
    const normalizedEmail = this.normalizeEmail(payload.email);
    return this.http
      .post<AuthResponse>('/api/auth/password-reset/confirm', {
        ...payload,
        email: normalizedEmail
      })
      .pipe(
        tap((response) => {
          this.clearTrustedDevice(normalizedEmail);
          this.storeSession(response);
        })
      );
  }

  confirmPasswordResetByPhone(payload: PhonePasswordResetConfirmPayload) {
    return this.http
      .post<AuthResponse>('/api/auth/password-reset/phone/confirm', {
        phoneNumber: payload.phoneNumber.trim(),
        code: payload.code.trim(),
        newPassword: payload.newPassword
      })
      .pipe(
        tap((response) => {
          if (response.user?.email) {
            this.clearTrustedDevice(response.user.email);
          }
          this.storeSession(response);
        })
      );
  }

  getCurrentUser() {
    return this.http.get<AuthUser>('/api/auth/me');
  }

  refreshCurrentUser() {
    return this.getCurrentUser().pipe(
      tap((user) => {
        this.replaceStoredUser(user);
      })
    );
  }

  updateProfile(payload: UpdateProfilePayload) {
    return this.http.put<AuthUser>('/api/auth/me', payload).pipe(
      tap((user) => {
        this.replaceStoredUser(user);
      })
    );
  }

  getTwoFactorStatus() {
    return this.http.get<TwoFactorStatusResponse>('/api/auth/two-factor');
  }

  getPasskeyStatus() {
    return this.http.get<PasskeyStatusResponse>('/api/auth/passkeys');
  }

  getFaceRecognitionStatus() {
    return this.http.get<FaceRecognitionStatusResponse>('/api/auth/face-recognition');
  }

  enrollFaceRecognition(payload: FaceRecognitionPayload) {
    return this.http.post<AuthInfoResponse>('/api/auth/face-recognition/enroll', payload);
  }

  removeFaceRecognition() {
    return this.http.delete<AuthInfoResponse>('/api/auth/face-recognition');
  }

  authenticateWithFaceRecognition(payload: FaceRecognitionLoginPayload) {
    const normalizedEmail = this.normalizeEmail(payload.email);
    return this.http
      .post<AuthResponse>('/api/auth/face-recognition/login', {
        ...payload,
        email: normalizedEmail
      })
      .pipe(
        tap((response) => {
          this.clearTrustedDevice(normalizedEmail);
          this.storeSession(response);
        })
      );
  }

  createPasskeyRegistrationOptions() {
    return this.http.post<PasskeyRegistrationOptionsResponse>('/api/auth/passkeys/register/options', {});
  }

  completePasskeyRegistration(payload: PasskeyRegistrationFinishPayload) {
    return this.http.post<AuthInfoResponse>('/api/auth/passkeys/register/finish', payload);
  }

  removePasskey() {
    return this.http.delete<AuthInfoResponse>('/api/auth/passkeys');
  }

  createPasskeyAuthenticationOptions(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    return this.http.post<PasskeyAuthenticationOptionsResponse>('/api/auth/passkeys/login/options', {
      email: normalizedEmail
    });
  }

  authenticateWithPasskey(payload: PasskeyAuthenticationFinishPayload) {
    const normalizedEmail = this.normalizeEmail(payload.email);
    return this.http
      .post<AuthResponse>('/api/auth/passkeys/login/finish', {
        ...payload,
        email: normalizedEmail
      })
      .pipe(
        tap((response) => {
          this.clearTrustedDevice(normalizedEmail);
          this.storeSession(response);
        })
      );
  }

  setupTwoFactor() {
    return this.http.post<TwoFactorStatusResponse>('/api/auth/two-factor/setup', {});
  }

  enableTwoFactor(payload: TwoFactorEnablePayload) {
    return this.http.post<TwoFactorEnableResponse>('/api/auth/two-factor/enable', payload);
  }

  regenerateBackupCodes(payload: TwoFactorDisablePayload) {
    return this.http.post<TwoFactorEnableResponse>('/api/auth/two-factor/backup-codes/regenerate', payload);
  }

  disableTwoFactor(payload: TwoFactorDisablePayload) {
    return this.http.post<AuthInfoResponse>('/api/auth/two-factor/disable', payload).pipe(
      tap(() => {
        const currentEmail = this.user()?.email;
        if (currentEmail) {
          this.clearTrustedDevice(currentEmail);
        }
      })
    );
  }

  logout() {
    this.sessionSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigateByUrl('/login');
  }

  hasAnyRole(...roles: RoleType[]) {
    const currentRole = this.role();
    return currentRole ? roles.includes(currentRole) : false;
  }

  defaultRoute() {
    if (this.requiresTwoFactorEnrollment()) {
      return '/profile';
    }

    if (this.hasAnyRole('SUPER_ADMIN')) {
      return '/dashboard';
    }

    if (this.hasAnyRole('ADMINISTRATION')) {
      return '/dashboard';
    }

    return '/dashboard';
  }

  private storeSession(response: AuthResponse) {
    if (!this.isAuthenticatedResponse(response)) {
      return;
    }

    this.sessionSignal.set(response);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  }

  private replaceStoredUser(user: AuthUser) {
    const currentSession = this.sessionSignal();
    if (!currentSession) {
      return;
    }

    const previousEmail = this.normalizeEmail(currentSession.user.email);
    const nextEmail = this.normalizeEmail(user.email);

    const updatedSession: AuthSession = {
      ...currentSession,
      user
    };

    this.sessionSignal.set(updatedSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));

    if (previousEmail !== nextEmail) {
      this.moveTrustedDevice(previousEmail, nextEmail);
    }
  }

  private loadStoredSession(): AuthSession | null {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as AuthSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  private isAuthenticatedResponse(response: AuthResponse): response is AuthSession {
    return Boolean(response.token && response.tokenType && response.user && !response.requiresTwoFactor);
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private loadTrustedDevices() {
    const rawValue = localStorage.getItem(TRUSTED_DEVICE_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(rawValue) as Record<string, TrustedDeviceEntry>;
      return Object.entries(parsedValue);
    } catch {
      localStorage.removeItem(TRUSTED_DEVICE_STORAGE_KEY);
      return [];
    }
  }

  private persistTrustedDevices() {
    const entries = Object.fromEntries(this.trustedDevices.entries());
    localStorage.setItem(TRUSTED_DEVICE_STORAGE_KEY, JSON.stringify(entries));
  }

  private getTrustedDeviceToken(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const trustedDevice = this.trustedDevices.get(normalizedEmail);
    if (!trustedDevice) {
      return null;
    }

    if (new Date(trustedDevice.expiresAt).getTime() <= Date.now()) {
      this.clearTrustedDevice(normalizedEmail);
      return null;
    }

    return trustedDevice.token;
  }

  private storeTrustedDevice(email: string, response: AuthResponse) {
    if (!response.trustedDeviceToken || response.trustedDeviceExpiresIn <= 0) {
      return;
    }

    const normalizedEmail = this.normalizeEmail(email);
    const expiresAt = new Date(Date.now() + response.trustedDeviceExpiresIn * 1000).toISOString();
    this.trustedDevices.set(normalizedEmail, {
      token: response.trustedDeviceToken,
      expiresAt
    });
    this.persistTrustedDevices();
  }

  private clearTrustedDevice(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    if (!this.trustedDevices.delete(normalizedEmail)) {
      return;
    }

    this.persistTrustedDevices();
  }

  private moveTrustedDevice(previousEmail: string, nextEmail: string) {
    const trustedDevice = this.trustedDevices.get(previousEmail);
    if (!trustedDevice) {
      return;
    }

    this.trustedDevices.delete(previousEmail);
    this.trustedDevices.set(nextEmail, trustedDevice);
    this.persistTrustedDevices();
  }
}
