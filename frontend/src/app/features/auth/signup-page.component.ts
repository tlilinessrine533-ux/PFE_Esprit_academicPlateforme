import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Department, RoleType } from '../../core/models/shared.models';
import { SignupRequestService } from '../../core/services/signup-request.service';
import { UsersService } from '../../core/services/users.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { SIGNUP_DEPARTMENT_OPTIONS, SignupDepartmentOption } from './signup-department-options';

const ESPRIT_EMAIL_PATTERN = /^[^\s@]+@esprit\.tn$/i;
const STRONG_PASSWORD_PATTERN = /^(?=.*[^A-Za-z0-9])(?=\S+$).{8,}$/;

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword || password === confirmPassword) {
    return null;
  }

  return { passwordMismatch: true };
}

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly signupRequestService = inject(SignupRequestService);
  private readonly usersService = inject(UsersService);

  readonly signupSubmitting = signal(false);
  readonly signupErrorMessage = signal('');
  readonly signupSuccessMessage = signal('');
  readonly departmentsLoading = signal(false);
  readonly availableDepartments = signal<Department[]>([]);
  readonly departmentOptions = SIGNUP_DEPARTMENT_OPTIONS;
  readonly roleOptions: ReadonlyArray<{ value: RoleType; label: string }> = [
    { value: 'ENSEIGNANT', label: 'Enseignant' },
    { value: 'CHEF_DEPARTEMENT', label: 'Chef de departement' },
    { value: 'ADMINISTRATION', label: 'Admin' }
  ];

  readonly signupForm = this.formBuilder.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(ESPRIT_EMAIL_PATTERN)]],
      role: ['ENSEIGNANT' as RoleType, [Validators.required]],
      departmentName: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(STRONG_PASSWORD_PATTERN)]],
      confirmPassword: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern(STRONG_PASSWORD_PATTERN)]
      ]
    },
    { validators: passwordsMatchValidator }
  );

  constructor() {
    this.loadAvailableDepartments();
  }

  goBackToLogin() {
    void this.router.navigateByUrl('/login');
  }

  submitSignupRequest() {
    if (this.signupForm.invalid || this.signupSubmitting()) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.signupSubmitting.set(true);
    this.signupErrorMessage.set('');
    this.signupSuccessMessage.set('');

    const rawValue = this.signupForm.getRawValue();
    const selectedDepartmentName = rawValue.departmentName.trim();
    const matchingDepartment = this.findDepartmentByName(selectedDepartmentName);

    this.signupRequestService
      .createRequest({
        firstName: rawValue.firstName.trim(),
        lastName: rawValue.lastName.trim(),
        email: rawValue.email.trim(),
        password: rawValue.password,
        role: rawValue.role,
        departmentId: matchingDepartment?.id ?? null,
        departmentName: matchingDepartment ? null : selectedDepartmentName
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.signupSubmitting.set(false);
          this.signupSuccessMessage.set(
            "Votre demande a ete envoyee au super-administrateur. Vous pourrez vous connecter apres validation."
          );
          this.signupForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            role: 'ENSEIGNANT',
            departmentName: '',
            password: '',
            confirmPassword: ''
          });
        },
        error: (error: unknown) => {
          this.signupSubmitting.set(false);
          this.signupErrorMessage.set(
            extractErrorMessage(error, "L'envoi de la demande d'inscription a echoue.")
          );
        }
      });
  }

  hasSignupPasswordMismatch() {
    return (
      this.signupForm.hasError('passwordMismatch') &&
      (this.signupForm.controls.password.touched || this.signupForm.controls.confirmPassword.touched)
    );
  }

  hasSignupDepartmentError() {
    return this.signupForm.controls.departmentName.invalid;
  }

  hasSignupRoleError() {
    return this.signupForm.controls.role.invalid;
  }

  hasSignupEmailError() {
    return this.signupForm.controls.email.invalid;
  }

  hasSignupPasswordStrengthError() {
    const passwordControl = this.signupForm.controls.password;
    return passwordControl.invalid && passwordControl.touched;
  }

  selectedDepartmentOption(): SignupDepartmentOption | null {
    const selectedName = this.signupForm.controls.departmentName.value;
    return this.departmentOptions.find((department) => department.name === selectedName) ?? null;
  }

  private loadAvailableDepartments() {
    this.departmentsLoading.set(true);

    this.usersService
      .getDepartments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (departments) => {
          this.availableDepartments.set(departments);
          this.departmentsLoading.set(false);
        },
        error: () => {
          this.departmentsLoading.set(false);
        }
      });
  }

  private findDepartmentByName(departmentName: string) {
    const normalizedDepartmentName = departmentName.toLowerCase();
    return this.availableDepartments().find((department) => department.name.toLowerCase() === normalizedDepartmentName) ?? null;
  }
}
