import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';

const ESPRIT_EMAIL_PATTERN = /^[^\s@]+@esprit\.tn$/i;
const VERIFICATION_CODE_PATTERN = /^\d{6}$/;
const PHONE_NUMBER_PATTERN = /^\+?[0-9()\-\s]{8,20}$/;
type RecoveryMode = 'email' | 'phone';

function matchingFieldsValidator(firstControlName: string, secondControlName: string, errorKey: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const firstValue = control.get(firstControlName)?.value;
    const secondValue = control.get(secondControlName)?.value;

    if (!firstValue || !secondValue || firstValue === secondValue) {
      return null;
    }

    return { [errorKey]: true };
  };
}

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly recoveryMode = signal<RecoveryMode | null>(null);
  readonly recoveryStep = signal<'request' | 'confirm'>('request');
  readonly recoverySubmitting = signal(false);
  readonly recoveryErrorMessage = signal('');
  readonly recoverySuccessMessage = signal('');

  readonly resetRequestForm = this.formBuilder.nonNullable.group({
    contact: ['', [Validators.required]]
  });

  readonly resetConfirmForm = this.formBuilder.nonNullable.group(
    {
      contact: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern(VERIFICATION_CODE_PATTERN)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    },
    { validators: matchingFieldsValidator('newPassword', 'confirmPassword', 'passwordMismatch') }
  );

  constructor() {
    const email = this.route.snapshot.queryParamMap.get('email')?.trim() ?? '';
    if (email) {
      this.resetRequestForm.controls.contact.setValue(email);
      this.resetConfirmForm.controls.contact.setValue(email);
      this.recoveryMode.set('email');
    }

    const phoneNumber = this.route.snapshot.queryParamMap.get('phoneNumber')?.trim() ?? '';
    if (phoneNumber) {
      this.resetRequestForm.controls.contact.setValue(phoneNumber);
      this.resetConfirmForm.controls.contact.setValue(phoneNumber);
      this.recoveryMode.set('phone');
    }
  }

  requestPasswordReset() {
    if (this.resetRequestForm.invalid || this.recoverySubmitting()) {
      this.resetRequestForm.markAllAsTouched();
      return;
    }

    const contact = this.resetRequestForm.controls.contact.value.trim();
    const mode = this.detectRecoveryMode(contact);

    if (!mode) {
      this.recoveryErrorMessage.set(
        "Saisissez une adresse e-mail institutionnelle valide ou un numero de telephone valide."
      );
      return;
    }

    this.recoveryMode.set(mode);
    this.recoveryErrorMessage.set('');
    this.recoverySuccessMessage.set('');
    this.recoverySubmitting.set(true);
    
    const request$ =
      mode === 'email'
        ? this.authService.requestPasswordReset({ email: contact })
        : this.authService.requestPasswordResetByPhone({ phoneNumber: contact });

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.recoverySubmitting.set(false);
        this.recoveryStep.set('confirm');
        const demoCodeNotice = response.verificationCode
          ? ` Code (mode demo, aucun SMS reel envoye) : ${response.verificationCode}`
          : '';
        this.recoverySuccessMessage.set(
          `${response.message} Saisissez le code recu et choisissez un nouveau mot de passe.${demoCodeNotice}`
        );
        this.resetConfirmForm.patchValue({
          contact,
          code: '',
          newPassword: '',
          confirmPassword: ''
        });
      },
      error: (error: unknown) => {
        this.recoverySubmitting.set(false);
        this.recoveryErrorMessage.set(
          extractErrorMessage(error, "La demande de reinitialisation n'a pas pu etre envoyee.")
        );
      }
    });
  }

  confirmPasswordReset() {
    if (this.resetConfirmForm.invalid || this.recoverySubmitting()) {
      this.resetConfirmForm.markAllAsTouched();
      return;
    }

    const mode = this.recoveryMode();
    const formValue = this.resetConfirmForm.getRawValue();
    const contact = formValue.contact.trim();

    if (!mode) {
      this.recoveryErrorMessage.set("Le type de recuperation n'est pas determine. Recommencez la demande de code.");
      return;
    }

    this.recoverySubmitting.set(true);
    this.recoveryErrorMessage.set('');
    this.recoverySuccessMessage.set('');

    const confirm$ =
      mode === 'email'
        ? this.authService.confirmPasswordReset({
            email: contact,
            code: formValue.code.trim(),
            newPassword: formValue.newPassword
          })
        : this.authService.confirmPasswordResetByPhone({
            phoneNumber: contact,
            code: formValue.code.trim(),
            newPassword: formValue.newPassword
          });

    confirm$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.recoverySubmitting.set(false);
        this.recoverySuccessMessage.set('Mot de passe reinitialise. Connexion automatique en cours...');
        void this.router.navigateByUrl(this.authService.defaultRoute());
      },
      error: (error: unknown) => {
        this.recoverySubmitting.set(false);
        this.recoveryErrorMessage.set(
          extractErrorMessage(error, "La verification du code a echoue. Verifiez le code et recommencez.")
        );
      }
    });
  }

  goBackToPasswordResetRequest() {
    const contact = this.resetConfirmForm.controls.contact.value.trim();
    this.recoveryStep.set('request');
    this.resetRequestForm.controls.contact.setValue(contact);

    this.recoveryErrorMessage.set('');
    this.recoverySuccessMessage.set('');
  }

  hasPasswordResetMismatch() {
    return (
      this.resetConfirmForm.hasError('passwordMismatch') &&
      (this.resetConfirmForm.controls.newPassword.touched || this.resetConfirmForm.controls.confirmPassword.touched)
    );
  }

  isRequestContactInvalid() {
    const control = this.resetRequestForm.controls.contact;
    if (!control.touched) {
      return false;
    }

    const value = control.value.trim();
    if (!value) {
      return true;
    }

    return this.detectRecoveryMode(value) === null;
  }

  goBackToLogin() {
    const contact = this.resetRequestForm.controls.contact.value.trim();
    const email = contact.includes('@') ? contact : '';

    void this.router.navigate(['/login'], {
      queryParams: email ? { email } : undefined
    });
  }

  private detectRecoveryMode(contact: string): RecoveryMode | null {
    const normalizedContact = contact.trim();
    if (!normalizedContact) {
      return null;
    }

    if (normalizedContact.includes('@')) {
      if (!ESPRIT_EMAIL_PATTERN.test(normalizedContact)) {
        return null;
      }

      return 'email';
    }

    return PHONE_NUMBER_PATTERN.test(normalizedContact) ? 'phone' : null;
  }
}
