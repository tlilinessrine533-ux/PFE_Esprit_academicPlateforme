import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FaceRecognitionClientService } from '../../core/services/face-recognition-client.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';

const ESPRIT_EMAIL_PATTERN = /^[^\s@]+@esprit\.tn$/i;

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  @ViewChild('faceVideo') private faceVideoRef?: ElementRef<HTMLVideoElement>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly faceRecognitionClient = inject(FaceRecognitionClientService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private faceCameraStream: MediaStream | null = null;

  readonly isSubmitting = signal(false);
  readonly faceCameraBusy = signal(false);
  readonly faceCameraReady = signal(false);
  readonly errorMessage = signal('');
  readonly loginStep = signal<'credentials' | 'twoFactor'>('credentials');
  readonly loginMethod = signal<'password' | 'face'>('password');
  readonly faceRecognitionSupported = signal(false);
  readonly twoFactorChallenge = signal<{
    email: string;
    challengeToken: string;
    expiresIn: number;
  } | null>(null);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(ESPRIT_EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly twoFactorForm = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
    rememberDevice: [false]
  });

  readonly faceLoginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(ESPRIT_EMAIL_PATTERN)]]
  });

  constructor() {
    const email = this.route.snapshot.queryParamMap.get('email')?.trim() ?? '';
    if (email) {
      this.loginForm.controls.email.setValue(email);
      this.faceLoginForm.controls.email.setValue(email);
    }

    this.destroyRef.onDestroy(() => this.stopFaceCamera());
    this.faceRecognitionSupported.set(this.faceRecognitionClient.isSupported());
  }

  login() {
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    const payload = this.loginForm.getRawValue();

    this.authService
      .login(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false);

          if (response.requiresTwoFactor && response.twoFactorChallengeToken) {
            this.loginStep.set('twoFactor');
            this.twoFactorChallenge.set({
              email: payload.email.trim(),
              challengeToken: response.twoFactorChallengeToken,
              expiresIn: response.twoFactorChallengeExpiresIn
            });
            this.twoFactorForm.reset({ code: '', rememberDevice: false });
            return;
          }

          if (response.token) {
            void this.router.navigateByUrl(this.authService.defaultRoute());
            return;
          }

          this.errorMessage.set('Connexion impossible. Reessayez.');
        },
        error: (error: unknown) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Connexion impossible. Verifiez votre adresse e-mail et votre mot de passe.'));
        }
      });
  }

  verifyTwoFactor() {
    const challenge = this.twoFactorChallenge();
    if (!challenge || this.twoFactorForm.invalid || this.isSubmitting()) {
      this.twoFactorForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.authService
      .verifyTwoFactorLogin({
        email: challenge.email,
        challengeToken: challenge.challengeToken,
        code: this.normalizeSecondFactorInput(this.twoFactorForm.controls.code.value),
        rememberDevice: this.twoFactorForm.controls.rememberDevice.value
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          void this.router.navigateByUrl(this.authService.defaultRoute());
        },
        error: (error: unknown) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Verification 2FA impossible. Verifiez le code saisi.'));
        }
      });
  }

  async activateFaceCamera() {
    if (this.faceCameraBusy()) {
      return;
    }

    if (!this.faceRecognitionSupported()) {
      this.errorMessage.set('La camera n est pas disponible sur cet appareil ou ce navigateur.');
      return;
    }

    const videoElement = this.faceVideoRef?.nativeElement;
    if (!videoElement) {
      this.errorMessage.set("La camera n'est pas encore prete. Reessayez dans un instant.");
      return;
    }

    this.faceCameraBusy.set(true);
    this.errorMessage.set('');

    try {
      await this.faceRecognitionClient.ensureReady();
      this.stopFaceCamera();
      this.faceCameraStream = await this.faceRecognitionClient.startCamera(videoElement);
      this.faceCameraReady.set(true);
    } catch (error) {
      this.faceCameraReady.set(false);
      this.errorMessage.set(
        error instanceof Error ? error.message : "La camera n'a pas pu etre initialisee."
      );
    } finally {
      this.faceCameraBusy.set(false);
    }
  }

  async loginWithFaceRecognition() {
    if (this.faceLoginForm.invalid || this.isSubmitting()) {
      this.faceLoginForm.markAllAsTouched();
      return;
    }

    const videoElement = this.faceVideoRef?.nativeElement;
    if (!videoElement || !this.faceCameraReady()) {
      this.errorMessage.set("Activez d'abord la camera pour lancer la reconnaissance faciale.");
      return;
    }

    const email = this.faceLoginForm.controls.email.value.trim();
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      const descriptor = await this.faceRecognitionClient.captureDescriptor(videoElement);
      this.authService
        .authenticateWithFaceRecognition({
          email,
          descriptor
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.stopFaceCamera();
            void this.router.navigateByUrl(this.authService.defaultRoute());
          },
          error: (error: unknown) => {
            this.isSubmitting.set(false);
            this.errorMessage.set(
              extractErrorMessage(
                error,
                "Connexion par reconnaissance faciale impossible. Verifiez l'eclairage et recommencez."
              )
            );
          }
        });
    } catch (error) {
      this.isSubmitting.set(false);
      this.errorMessage.set(
        error instanceof Error
          ? error.message
          : "La reconnaissance faciale a ete annulee ou n'a pas pu aboutir."
      );
    }
  }

  toggleFaceLogin() {
    this.setLoginMethod(this.loginMethod() === 'face' ? 'password' : 'face');
  }

  setLoginMethod(method: 'password' | 'face') {
    if (this.loginMethod() === method) {
      return;
    }

    const currentEmail = method === 'face'
      ? this.loginForm.controls.email.value.trim()
      : this.faceLoginForm.controls.email.value.trim();

    if (currentEmail) {
      if (method === 'face') {
        this.faceLoginForm.controls.email.setValue(currentEmail);
      } else {
        this.loginForm.controls.email.setValue(currentEmail);
      }
    }

    if (method === 'password') {
      this.stopFaceCamera();
    } else {
      this.faceCameraReady.set(false);
    }

    this.loginMethod.set(method);
    this.errorMessage.set('');
  }

  private stopFaceCamera() {
    this.faceRecognitionClient.stopCamera(this.faceCameraStream);
    this.faceCameraStream = null;
    this.faceCameraReady.set(false);
  }

  private normalizeSecondFactorInput(value: string) {
    return value.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  goBackToCredentials() {
    this.loginStep.set('credentials');
    this.twoFactorChallenge.set(null);
    this.twoFactorForm.reset({ code: '', rememberDevice: false });
    this.errorMessage.set('');
  }

  goToForgotPassword() {
    const email = this.loginForm.controls.email.value.trim();
    void this.router.navigate(['/forgot-password'], {
      queryParams: email ? { email } : undefined
    });
  }
}
