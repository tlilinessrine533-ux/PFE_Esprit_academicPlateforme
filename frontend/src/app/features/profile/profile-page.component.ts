import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import QRCode from 'qrcode';
import {
  AuthUser,
  FaceRecognitionStatusResponse,
  TwoFactorDisablePayload,
  TwoFactorEnablePayload,
  TwoFactorStatusResponse,
  UpdateProfilePayload
} from '../../core/models/auth.models';
import {
  ResponsibilityActivityResponse,
  ResponsibilitySummaryResponse
} from '../../core/models/responsibility.models';
import { AuthService } from '../../core/services/auth.service';
import { FaceRecognitionClientService } from '../../core/services/face-recognition-client.service';
import { ResponsibilityService } from '../../core/services/responsibility.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  @ViewChild('faceEnrollmentVideo') private faceEnrollmentVideoRef?: ElementRef<HTMLVideoElement>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly faceRecognitionClient = inject(FaceRecognitionClientService);
  private readonly responsibilityService = inject(ResponsibilityService);
  private readonly toastService = inject(UiToastService);
  private readonly router = inject(Router);
  private faceEnrollmentStream: MediaStream | null = null;

  readonly user = this.authService.user;
  readonly role = this.authService.role;
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly twoFactorBusy = signal(false);
  readonly faceRecognitionBusy = signal(false);
  readonly faceRecognitionSupported = signal(false);
  readonly faceCameraReady = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly responsibilities = signal<ResponsibilityActivityResponse[]>([]);
  readonly responsibilitySummary = signal<ResponsibilitySummaryResponse | null>(null);
  readonly twoFactorStatus = signal<TwoFactorStatusResponse | null>(null);
  readonly faceRecognitionStatus = signal<FaceRecognitionStatusResponse | null>(null);
  readonly backupCodes = signal<string[]>([]);
  readonly twoFactorQrCodeDataUrl = signal('');
  readonly twoFactorQrCodeError = signal('');
  readonly securityLoadError = signal('');
  readonly copiedBackupCode = signal<string | null>(null);
  readonly showSecurityDetails = signal(false);
  readonly showFaceSectionDetails = signal(false);
  readonly showAllResponsibilities = signal(false);
  readonly securityDetailsToggleLabel = computed(() =>
    this.showSecurityDetails() ? 'Masquer les details de securite' : 'Afficher les details de securite'
  );
  readonly faceSectionToggleLabel = computed(() =>
    this.showFaceSectionDetails() ? 'Masquer la reconnaissance faciale' : 'Afficher la reconnaissance faciale'
  );
  readonly responsibilitiesToggleLabel = computed(() =>
    this.showAllResponsibilities() ? 'Masquer la liste complete' : 'Afficher toutes les responsabilites'
  );
  readonly isMandatoryTwoFactorRole = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly isTeacher = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly hasPendingTwoFactorSetup = computed(() => Boolean(this.twoFactorStatus()?.pendingEnrollment));
  readonly isTwoFactorEnabled = computed(() => Boolean(this.twoFactorStatus()?.enabled));
  readonly isFaceRecognitionEnabled = computed(() => Boolean(this.faceRecognitionStatus()?.enrolled));
  readonly sortedResponsibilities = computed(() =>
    [...this.responsibilities()]
      .sort((left, right) => new Date(right.startDate).getTime() - new Date(left.startDate).getTime())
  );
  readonly hasResponsibilitiesDropdown = computed(() => this.sortedResponsibilities().length > 2);
  readonly displayedResponsibilities = computed(() => {
    const orderedResponsibilities = this.sortedResponsibilities();
    if (this.showAllResponsibilities()) {
      return orderedResponsibilities;
    }
    return orderedResponsibilities.slice(0, 2);
  });
  private twoFactorQrCodeVersion = 0;

  readonly profileForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  readonly enableTwoFactorForm = this.formBuilder.nonNullable.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    code: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
  });

  readonly disableTwoFactorForm = this.formBuilder.nonNullable.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    code: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.stopFaceCamera());
    this.faceRecognitionSupported.set(this.faceRecognitionClient.isSupported());
    this.loadProfilePage();
  }

  loadProfilePage() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.securityLoadError.set('');

    forkJoin({
      user: this.authService.refreshCurrentUser().pipe(catchError(() => of(this.user()))),
      responsibilities: this.isTeacher()
        ? this.responsibilityService.getResponsibilityActivities().pipe(catchError(() => of([])))
        : of([]),
      responsibilitySummary: this.isTeacher()
        ? this.responsibilityService.getSummary().pipe(catchError(() => of(null)))
        : of(null),
      twoFactor: this.authService.getTwoFactorStatus().pipe(
        catchError((error: unknown) => {
          const message = extractErrorMessage(
            error,
            'La securite du compte n a pas pu etre chargee. Reessayez.'
          );
          this.securityLoadError.set(message);
          return of(null);
        })
      ),
      faceRecognition: this.authService.getFaceRecognitionStatus().pipe(catchError(() => of(null)))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ user, responsibilities, responsibilitySummary, twoFactor, faceRecognition }) => {
          if (user) {
            this.patchProfileForm(user);
          }
          this.responsibilities.set(responsibilities);
          this.responsibilitySummary.set(responsibilitySummary);
          this.applyTwoFactorStatus(twoFactor);
          this.faceRecognitionStatus.set(faceRecognition);
          if (!twoFactor && !this.securityLoadError()) {
            this.securityLoadError.set('La securite du compte est temporairement indisponible.');
          }
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.loading.set(false);
          const message = extractErrorMessage(error, 'Le profil n a pas pu etre charge.');
          this.errorMessage.set(message);
          this.toastService.error('Profil indisponible', message);
        }
      });
  }

  saveProfile() {
    if (this.profileForm.invalid || this.saving()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.profileForm.getRawValue();
    const payload: UpdateProfilePayload = {
      firstName: rawValue.firstName.trim(),
      lastName: rawValue.lastName.trim(),
      email: rawValue.email.trim()
    };

    this.authService
      .updateProfile(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.saving.set(false);
          this.patchProfileForm(user);
          this.successMessage.set('Profil mis a jour avec succes.');
          this.toastService.success('Profil enregistre', 'Vos informations ont ete mises a jour avec succes.');
        },
        error: (error: unknown) => {
          this.saving.set(false);
          const message = extractErrorMessage(error, 'La mise a jour du profil a echoue.');
          this.errorMessage.set(message);
          this.toastService.error('Mise a jour impossible', message);
        }
      });
  }

  startTwoFactorSetup() {
    if (this.twoFactorBusy()) {
      return;
    }

    this.twoFactorBusy.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.backupCodes.set([]);

    this.authService
      .setupTwoFactor()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (status) => {
          this.twoFactorBusy.set(false);
          this.applyTwoFactorStatus(status);
          this.enableTwoFactorForm.reset({ currentPassword: '', code: '' });
          this.successMessage.set(
            'Secret genere. Scannez le QR code ou copiez la cle secrete sur votre telephone, puis saisissez le code.'
          );
          this.toastService.success('2FA prete', 'La configuration de la double authentification est prete.');
        },
        error: (error: unknown) => {
          this.twoFactorBusy.set(false);
          const message = extractErrorMessage(error, 'La configuration 2FA n a pas pu etre preparee.');
          this.errorMessage.set(message);
          this.toastService.error('2FA indisponible', message);
        }
      });
  }

  enableTwoFactor() {
    if (this.enableTwoFactorForm.invalid || this.twoFactorBusy()) {
      this.enableTwoFactorForm.markAllAsTouched();
      return;
    }

    this.twoFactorBusy.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.enableTwoFactorForm.getRawValue();
    const payload: TwoFactorEnablePayload = {
      currentPassword: rawValue.currentPassword,
      code: this.normalizeTotpInput(rawValue.code)
    };

    this.authService
      .enableTwoFactor(payload)
      .pipe(
        switchMap((response) =>
          this.authService.getTwoFactorStatus().pipe(
            map((status) => ({ response, status }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ response, status }) => {
          this.twoFactorBusy.set(false);
          this.applyTwoFactorStatus(status);
          this.backupCodes.set(response.backupCodes);
          this.enableTwoFactorForm.reset({ currentPassword: '', code: '' });
          this.successMessage.set(response.message);
          this.toastService.success('2FA activee', 'La double authentification est maintenant activee.');
        },
        error: (error: unknown) => {
          this.twoFactorBusy.set(false);
          const message = extractErrorMessage(error, 'L activation de la 2FA a echoue.');
          this.errorMessage.set(message);
          this.toastService.error('Activation impossible', message);
        }
      });
  }

  disableTwoFactor() {
    if (this.disableTwoFactorForm.invalid || this.twoFactorBusy()) {
      this.disableTwoFactorForm.markAllAsTouched();
      return;
    }

    this.twoFactorBusy.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.disableTwoFactorForm.getRawValue();
    const payload: TwoFactorDisablePayload = {
      currentPassword: rawValue.currentPassword,
      code: this.normalizeSecondFactorInput(rawValue.code)
    };

    this.authService
      .disableTwoFactor(payload)
      .pipe(
        switchMap((response) =>
          this.authService.getTwoFactorStatus().pipe(
            map((status) => ({ response, status }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ response, status }) => {
          this.twoFactorBusy.set(false);
          this.applyTwoFactorStatus(status);
          this.backupCodes.set([]);
          this.disableTwoFactorForm.reset({ currentPassword: '', code: '' });
          this.successMessage.set(response.message);
          this.toastService.success('2FA desactivee', response.message);
        },
        error: (error: unknown) => {
          this.twoFactorBusy.set(false);
          const message = extractErrorMessage(error, 'La desactivation de la 2FA a echoue.');
          this.errorMessage.set(message);
          this.toastService.error('Desactivation impossible', message);
        }
      });
  }

  regenerateBackupCodes() {
    if (this.disableTwoFactorForm.invalid || this.twoFactorBusy()) {
      this.disableTwoFactorForm.markAllAsTouched();
      return;
    }

    this.twoFactorBusy.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.disableTwoFactorForm.getRawValue();
    const payload: TwoFactorDisablePayload = {
      currentPassword: rawValue.currentPassword,
      code: this.normalizeSecondFactorInput(rawValue.code)
    };

    this.authService
      .regenerateBackupCodes(payload)
      .pipe(
        switchMap((response) =>
          this.authService.getTwoFactorStatus().pipe(
            map((status) => ({ response, status }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ response, status }) => {
          this.twoFactorBusy.set(false);
          this.applyTwoFactorStatus(status);
          this.backupCodes.set(response.backupCodes);
          this.disableTwoFactorForm.controls.code.reset('');
          this.successMessage.set(response.message);
          this.toastService.success('Codes regeneres', response.message);
        },
        error: (error: unknown) => {
          this.twoFactorBusy.set(false);
          const message = extractErrorMessage(error, 'La regeneration des codes de secours a echoue.');
          this.errorMessage.set(message);
          this.toastService.error('Regeneration impossible', message);
        }
      });
  }

  async activateFaceCamera() {
    if (this.faceRecognitionBusy()) {
      return;
    }

    if (!this.faceRecognitionSupported()) {
      const message = 'La camera n est pas disponible sur cet appareil ou ce navigateur.';
      this.errorMessage.set(message);
      this.toastService.error('Camera indisponible', message);
      return;
    }

    const videoElement = this.faceEnrollmentVideoRef?.nativeElement;
    if (!videoElement) {
      const message = "La camera n'est pas encore prete. Reessayez dans un instant.";
      this.errorMessage.set(message);
      this.toastService.error('Camera indisponible', message);
      return;
    }

    this.faceRecognitionBusy.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.faceRecognitionClient.ensureReady();
      this.stopFaceCamera();
      this.faceEnrollmentStream = await this.faceRecognitionClient.startCamera(videoElement);
      this.faceCameraReady.set(true);
    } catch (error) {
      this.faceCameraReady.set(false);
      const message = error instanceof Error ? error.message : "La camera n'a pas pu etre activee.";
      this.errorMessage.set(message);
      this.toastService.error('Camera indisponible', message);
    } finally {
      this.faceRecognitionBusy.set(false);
    }
  }

  async enrollFaceRecognition() {
    if (this.faceRecognitionBusy()) {
      return;
    }

    const videoElement = this.faceEnrollmentVideoRef?.nativeElement;
    if (!videoElement || !this.faceCameraReady()) {
      const message = "Activez d'abord la camera pour enregistrer le visage.";
      this.errorMessage.set(message);
      this.toastService.error('Camera requise', message);
      return;
    }

    this.faceRecognitionBusy.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const descriptor = await this.faceRecognitionClient.captureDescriptor(videoElement);
      this.authService
        .enrollFaceRecognition({ descriptor })
        .pipe(
          switchMap((response) =>
            this.authService.getFaceRecognitionStatus().pipe(
              map((status) => ({ response, status }))
            )
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: ({ response, status }) => {
            this.faceRecognitionBusy.set(false);
            this.faceRecognitionStatus.set(status);
            this.stopFaceCamera();
            this.successMessage.set(response.message);
            this.toastService.success('Visage enregistre', response.message);
          },
          error: (error: unknown) => {
            this.faceRecognitionBusy.set(false);
            const message = extractErrorMessage(error, "L'enregistrement du visage a echoue.");
            this.errorMessage.set(message);
            this.toastService.error('Enregistrement impossible', message);
          }
        });
    } catch (error) {
      this.faceRecognitionBusy.set(false);
      const message = error instanceof Error ? error.message : "L'enregistrement du visage a ete interrompu.";
      this.errorMessage.set(message);
      this.toastService.error('Enregistrement impossible', message);
    }
  }

  removeFaceRecognition() {
    if (this.faceRecognitionBusy()) {
      return;
    }

    this.faceRecognitionBusy.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService
      .removeFaceRecognition()
      .pipe(
        switchMap((response) =>
          this.authService.getFaceRecognitionStatus().pipe(
            map((status) => ({ response, status }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ response, status }) => {
          this.faceRecognitionBusy.set(false);
          this.faceRecognitionStatus.set(status);
          this.stopFaceCamera();
          this.successMessage.set(response.message);
          this.toastService.success('Visage supprime', response.message);
        },
        error: (error: unknown) => {
          this.faceRecognitionBusy.set(false);
          const message = extractErrorMessage(error, 'La suppression du visage a echoue.');
          this.errorMessage.set(message);
          this.toastService.error('Suppression impossible', message);
        }
      });
  }

  formattedManualEntryKey() {
    return this.manualEntryKeyRaw().replace(/(.{4})/g, '$1 ').trim();
  }

  manualEntryKeyRaw() {
    const manualEntryKey = this.twoFactorStatus()?.manualEntryKey ?? '';
    return manualEntryKey.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  async copyManualEntryKey() {
    const manualEntryKey = this.manualEntryKeyRaw();
    if (!manualEntryKey) {
      this.toastService.warning('Cle indisponible', 'Regenerer le secret avant de copier la cle.');
      return;
    }

    try {
      await this.writeTextToClipboard(manualEntryKey);
      this.toastService.success('Cle copiee', 'La cle secrete a ete copiee pour la configuration manuelle.');
    } catch {
      this.toastService.error('Copie impossible', 'La cle secrete n a pas pu etre copiee automatiquement.');
    }
  }

  async copyOtpAuthUri() {
    const otpAuthUri = this.twoFactorStatus()?.otpAuthUri ?? '';
    if (!otpAuthUri) {
      this.toastService.warning('Lien indisponible', 'Regenerer le secret avant de copier le lien otpauth.');
      return;
    }

    try {
      await this.writeTextToClipboard(otpAuthUri);
      this.toastService.success('Lien copie', 'Le lien otpauth a ete copie dans le presse-papiers.');
    } catch {
      this.toastService.error('Copie impossible', 'Le lien otpauth n a pas pu etre copie automatiquement.');
    }
  }

  async copyBackupCode(code: string) {
    try {
      await this.writeTextToClipboard(code);
      this.copiedBackupCode.set(code);
      this.toastService.success('Code copie', 'Le code de secours a ete copie dans le presse-papiers.');
      setTimeout(() => {
        if (this.copiedBackupCode() === code) {
          this.copiedBackupCode.set(null);
        }
      }, 2000);
    } catch {
      this.toastService.error('Copie impossible', 'Le code n a pas pu etre copie automatiquement.');
    }
  }

  openResponsibilitiesPage() {
    void this.router.navigateByUrl('/responsibilities');
  }

  openResponsibilityCreatePage() {
    void this.router.navigateByUrl('/responsibilities/new');
  }

  toggleResponsibilitiesList() {
    if (!this.hasResponsibilitiesDropdown()) {
      return;
    }
    this.showAllResponsibilities.update((value) => !value);
  }

  responsibilityState(activity: ResponsibilityActivityResponse) {
    if (!activity.endDate) {
      return 'Active';
    }

    return new Date(activity.endDate).getTime() >= new Date().setHours(0, 0, 0, 0) ? 'Active' : 'Terminee';
  }

  formatResponsibilityType(type: string) {
    switch (type) {
      case 'MAITRE_STAGE':
      case 'COORDINATEUR_MODULE':
      case 'RESPONSABLE_FILIERE':
        return 'Responsable de formation';
      case 'CHEF_DEPARTEMENT':
        return 'Responsable de departement';
      case 'AUTRE':
        return 'Direction';
      default:
        return type.replaceAll('_', ' ');
    }
  }

  toggleSecurityDetails() {
    this.showSecurityDetails.update((value) => {
      const nextValue = !value;
      if (!nextValue) {
        this.showFaceSectionDetails.set(false);
      }
      return nextValue;
    });
  }

  toggleFaceSectionDetails() {
    this.showFaceSectionDetails.update((value) => !value);
  }

  private applyTwoFactorStatus(status: TwoFactorStatusResponse | null) {
    this.twoFactorStatus.set(status);
    void this.updateTwoFactorQrCode(status);
  }

  private async updateTwoFactorQrCode(status: TwoFactorStatusResponse | null) {
    const currentVersion = ++this.twoFactorQrCodeVersion;
    this.twoFactorQrCodeDataUrl.set('');
    this.twoFactorQrCodeError.set('');

    if (!status?.pendingEnrollment || !status.otpAuthUri) {
      return;
    }

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(status.otpAuthUri, {
        width: 220,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#111827',
          light: '#ffffff'
        }
      });

      if (currentVersion !== this.twoFactorQrCodeVersion) {
        return;
      }

      this.twoFactorQrCodeDataUrl.set(qrCodeDataUrl);
    } catch {
      if (currentVersion !== this.twoFactorQrCodeVersion) {
        return;
      }

      this.twoFactorQrCodeError.set(
        'Le QR code n a pas pu etre genere. Utilisez la cle secrete ou le lien otpauth ci-dessous.'
      );
    }
  }

  private patchProfileForm(user: AuthUser) {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  }

  private stopFaceCamera() {
    this.faceRecognitionClient.stopCamera(this.faceEnrollmentStream);
    this.faceEnrollmentStream = null;
    this.faceCameraReady.set(false);
  }

  private async writeTextToClipboard(value: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  private normalizeSecondFactorInput(value: string) {
    return value.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  private normalizeTotpInput(value: string) {
    return this.normalizeSecondFactorInput(value).replace(/\D/g, '');
  }
}
