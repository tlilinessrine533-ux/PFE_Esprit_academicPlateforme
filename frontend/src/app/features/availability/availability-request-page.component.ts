import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  AvailabilityRequestResponse,
  CreateLeaveAvailabilityPayload,
  CreateMissionAvailabilityPayload
} from '../../core/models/availability.models';
import { AuthService } from '../../core/services/auth.service';
import { AvailabilityRequestService } from '../../core/services/availability-request.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { UsersService } from '../../core/services/users.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { AvailabilityRequestType, Department, LeaveType, MissionKind } from '../../core/models/shared.models';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

@Component({
  selector: 'app-availability-request-page',
  imports: [ReactiveFormsModule, DatePipe, ChartPanelComponent],
  templateUrl: './availability-request-page.component.html',
  styleUrl: './availability-request-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityRequestPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly availabilityRequestService = inject(AvailabilityRequestService);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(UiToastService);
  private readonly maxMedicalCertificateSizeBytes = 5 * 1024 * 1024;

  @ViewChild('medicalCertificateInput')
  private medicalCertificateInput?: ElementRef<HTMLInputElement>;

  readonly requestType = this.route.snapshot.data['requestType'] as AvailabilityRequestType;
  readonly isLeavePage = computed(() => this.requestType === 'CONGE');
  readonly showRequestForm = signal(false);
  readonly requests = signal<AvailabilityRequestResponse[]>([]);
  readonly requestTypeMix = signal({ leave: 0, mission: 0 });
  readonly showAvailabilityDashboard = signal(true);
  readonly showAllRequests = signal(false);
  readonly availableDepartments = signal<Department[]>([]);
  readonly departmentsLoading = signal(false);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly currentUser = this.authService.user;
  readonly medicalCertificatePreview = signal('');
  readonly medicalCertificateFileName = signal('');
  readonly leaveTypes: LeaveType[] = ['ANNUEL', 'MALADIE', 'EXCEPTIONNEL', 'SANS_SOLDE', 'AUTRE'];
  readonly missionKinds: MissionKind[] = ['MISSION', 'CONFERENCE'];

  readonly leaveForm = this.formBuilder.nonNullable.group({
    leaveType: ['ANNUEL' as LeaveType, [Validators.required]],
    departmentId: [this.defaultDepartmentId(), [Validators.required]],
    pedagogicalUnit: ['', [Validators.required, Validators.maxLength(180)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    reason: ['', [Validators.required, Validators.maxLength(2000)]],
    academicYear: [this.defaultAcademicYear(), [Validators.required]],
    medicalCertificateImageDataUrl: ['']
  });

  readonly missionForm = this.formBuilder.nonNullable.group({
    missionKind: ['MISSION' as MissionKind, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(180)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    reason: ['', [Validators.required, Validators.maxLength(2000)]],
    academicYear: [this.defaultAcademicYear(), [Validators.required]]
  });

  readonly pageTitle = computed(() => (this.isLeavePage() ? 'Demander un conge' : 'Demander une mission'));
  readonly pageHint = computed(() =>
    this.isLeavePage()
      ? "Renseignez votre periode d'absence et le motif pour declarer votre disponibilite."
      : 'Renseignez votre mission et sa periode pour declarer votre disponibilite.'
  );
  readonly selectedLeaveType = toSignal(
    this.leaveForm.controls.leaveType.valueChanges.pipe(startWith(this.leaveForm.controls.leaveType.value)),
    { initialValue: this.leaveForm.controls.leaveType.value }
  );
  readonly isMedicalLeave = computed(() => this.selectedLeaveType() === 'MALADIE');
  readonly selectedMissionKind = toSignal(
    this.missionForm.controls.missionKind.valueChanges.pipe(startWith(this.missionForm.controls.missionKind.value)),
    { initialValue: this.missionForm.controls.missionKind.value }
  );
  readonly missionTitlePlaceholder = computed(() =>
    this.selectedMissionKind() === 'CONFERENCE'
      ? "Exemple : Colloque international sur l'innovation pedagogique"
      : 'Exemple : Mission pedagogique a Sousse'
  );
  readonly missionReasonPlaceholder = computed(() =>
    this.selectedMissionKind() === 'CONFERENCE'
      ? "Precisez le contexte, l'objectif et les details utiles de votre participation a la conference."
      : 'Precisez le contexte, le but et les details utiles de la mission.'
  );
  readonly sortedRequests = computed(() =>
    [...this.requests()].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    )
  );
  readonly visibleRequests = computed(() =>
    this.showAllRequests() ? this.sortedRequests() : this.sortedRequests().slice(0, 2)
  );
  readonly hasCollapsedRequests = computed(() => this.sortedRequests().length > 2);
  readonly totalRequestsCount = computed(() => this.requests().length);
  readonly leaveRequestsCount = computed(() => this.requestTypeMix().leave);
  readonly missionRequestsCount = computed(() => this.requestTypeMix().mission);
  readonly totalAbsenceDays = computed(() => {
    if (!this.isLeavePage()) {
      return 0;
    }

    return this.requests().reduce((total, request) => total + Number(request.absenceDays ?? 0), 0);
  });
  readonly validatedAbsenceDays = computed(() => {
    if (!this.isLeavePage()) {
      return 0;
    }

    return this.requests()
      .filter((request) => request.status === 'VALIDEE_DEPARTEMENT' || request.status === 'VALIDEE_FINALE')
      .reduce((total, request) => total + Number(request.absenceDays ?? 0), 0);
  });
  readonly pendingAbsenceDays = computed(() => {
    if (!this.isLeavePage()) {
      return 0;
    }

    return this.requests()
      .filter((request) => request.status !== 'REJETEE' && request.status !== 'VALIDEE_DEPARTEMENT' && request.status !== 'VALIDEE_FINALE')
      .reduce((total, request) => total + Number(request.absenceDays ?? 0), 0);
  });
  readonly requestsToggleLabel = computed(() =>
    this.showAllRequests()
      ? this.isLeavePage()
        ? 'Masquer les demandes de conge'
        : 'Masquer les demandes de mission'
      : this.isLeavePage()
        ? 'Afficher toutes les demandes de conge'
        : 'Afficher toutes les demandes de mission'
  );
  readonly requestFormToggleLabel = computed(() =>
    this.showRequestForm()
      ? this.isLeavePage()
        ? 'Masquer le formulaire de demande de conge'
        : 'Masquer le formulaire de demande de mission'
      : this.isLeavePage()
        ? 'Afficher le formulaire de demande de conge'
        : 'Afficher le formulaire de demande de mission'
  );
  readonly absenceRateLabel = computed(() => {
    if (this.isLeavePage()) {
      const totalDays = this.totalAbsenceDays();
      if (totalDays <= 0) {
        return '0.0%';
      }
      return `${((this.validatedAbsenceDays() / totalDays) * 100).toFixed(1)}%`;
    }

    const totalRequests = this.totalRequestsCount();
    if (totalRequests <= 0) {
      return '0.0%';
    }
    const validatedRequests = this.requests().filter(
      (request) => request.status === 'VALIDEE_DEPARTEMENT' || request.status === 'VALIDEE_FINALE'
    ).length;
    return `${((validatedRequests / totalRequests) * 100).toFixed(1)}%`;
  });
  readonly availabilityByMonthChartData = computed<ChartData<'bar'>>(() => {
    const totals = this.requests().reduce<Record<string, number>>((accumulator, request) => {
      const date = new Date(request.startDate);
      if (Number.isNaN(date.getTime())) {
        return accumulator;
      }
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const value = this.isLeavePage() ? Number(request.absenceDays ?? 0) : 1;
      accumulator[monthKey] = (accumulator[monthKey] ?? 0) + value;
      return accumulator;
    }, {});

    const rows = Object.entries(totals).sort((left, right) => left[0].localeCompare(right[0]));

    return {
      labels: rows.map(([monthKey]) => monthKey),
      datasets: [
        {
          label: this.isLeavePage() ? "Jours d'absence" : 'Demandes',
          data: rows.map(([, total]) => total),
          backgroundColor: '#1d4ed8',
          borderRadius: 8,
          maxBarThickness: 38
        }
      ]
    };
  });
  readonly availabilityTypeChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Conge', 'Mission'],
    datasets: [
      {
        data: [this.leaveRequestsCount(), this.missionRequestsCount()],
        backgroundColor: ['#0f766e', '#f97316'],
        borderWidth: 0
      }
    ]
  }));

  constructor() {
    this.loadRequests();
    this.loadDepartments();

    this.leaveForm.controls.leaveType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((leaveType) => {
        if (leaveType !== 'MALADIE') {
          this.clearMedicalCertificateSelection();
        }
      });
  }

  loadRequests() {
    this.loading.set(true);
    this.errorMessage.set('');

    const alternateType: AvailabilityRequestType = this.requestType === 'CONGE' ? 'MISSION' : 'CONGE';

    forkJoin({
      current: this.availabilityRequestService.getRequests(this.requestType),
      alternate: this.availabilityRequestService.getRequests(alternateType)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ current, alternate }) => {
          const leaveCount = this.requestType === 'CONGE' ? current.length : alternate.length;
          const missionCount = this.requestType === 'MISSION' ? current.length : alternate.length;
          this.requests.set(current);
          this.requestTypeMix.set({ leave: leaveCount, mission: missionCount });
          this.showAllRequests.set(false);
          this.loading.set(false);
        },
        error: (error) => {
          this.requestTypeMix.set({ leave: 0, mission: 0 });
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Impossible de charger vos demandes de disponibilite.'));
        }
      });
  }

  loadDepartments() {
    this.departmentsLoading.set(true);

    this.usersService
      .getDepartments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (departments) => {
          this.availableDepartments.set(departments);
          this.departmentsLoading.set(false);

          const currentDepartmentId = this.leaveForm.controls.departmentId.value;
          if (!currentDepartmentId) {
            const fallbackDepartmentId = this.defaultDepartmentId();
            if (fallbackDepartmentId) {
              this.leaveForm.controls.departmentId.setValue(fallbackDepartmentId);
            }
          }
        },
        error: (error) => {
          this.departmentsLoading.set(false);
          const message = extractErrorMessage(error, 'Impossible de charger la liste des departements.');
          this.errorMessage.set(message);
          this.toastService.warning('Departements indisponibles', message);
        }
      });
  }

  submitRequest() {
    if (this.saving()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.isLeavePage()) {
      if (this.leaveForm.invalid) {
        this.leaveForm.markAllAsTouched();
        return;
      }

      const payload = this.leaveForm.getRawValue();
      if (payload.endDate < payload.startDate) {
        this.errorMessage.set('La date de fin doit etre superieure ou egale a la date de debut.');
        return;
      }

      const departmentId = Number(payload.departmentId);
      const selectedDepartment = this.availableDepartments().find((department) => department.id === departmentId) ?? null;
      if (!selectedDepartment) {
        this.errorMessage.set('Veuillez selectionner un departement valide.');
        return;
      }

      if (payload.leaveType === 'MALADIE' && !payload.medicalCertificateImageDataUrl.trim()) {
        this.errorMessage.set('Un certificat medical image est obligatoire pour un conge maladie.');
        return;
      }

      this.createLeaveRequest({
        leaveType: payload.leaveType,
        departmentId,
        pedagogicalUnit: payload.pedagogicalUnit.trim(),
        startDate: payload.startDate,
        endDate: payload.endDate,
        reason: payload.reason.trim(),
        academicYear: payload.academicYear.trim(),
        medicalCertificateImageDataUrl: payload.medicalCertificateImageDataUrl.trim() || null
      });
      return;
    }

    if (this.missionForm.invalid) {
      this.missionForm.markAllAsTouched();
      return;
    }

    const payload = this.missionForm.getRawValue();
    if (payload.endDate < payload.startDate) {
      this.errorMessage.set('La date de fin doit etre superieure ou egale a la date de debut.');
      return;
    }

    this.createMissionRequest(payload);
  }

  statusLabel(status: AvailabilityRequestResponse['status']) {
    switch (status) {
      case 'BROUILLON':
        return 'Brouillon';
      case 'SOUMISE':
        return 'Soumise';
      case 'VALIDEE_DEPARTEMENT':
        return 'Validee departement';
      case 'VALIDEE_FINALE':
        return 'Validee finale';
      case 'REJETEE':
        return 'Rejetee';
      case 'A_CORRIGER':
        return 'A corriger';
      default:
        return status;
    }
  }

  onMedicalCertificateSelected(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      this.clearMedicalCertificateSelection();
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Le certificat medical doit etre charge sous forme d image.');
      this.toastService.warning('Fichier refuse', 'Choisissez une image PNG, JPG ou WEBP.');
      this.clearMedicalCertificateSelection();
      return;
    }

    if (file.size > this.maxMedicalCertificateSizeBytes) {
      this.errorMessage.set('Le certificat medical image ne doit pas depasser 5 Mo.');
      this.toastService.warning('Fichier trop volumineux', 'La taille maximale autorisee est de 5 Mo.');
      this.clearMedicalCertificateSelection();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result.startsWith('data:image/')) {
        this.errorMessage.set('Le certificat medical doit etre charge sous forme d image valide.');
        this.clearMedicalCertificateSelection();
        return;
      }

      this.leaveForm.controls.medicalCertificateImageDataUrl.setValue(result);
      this.medicalCertificatePreview.set(result);
      this.medicalCertificateFileName.set(file.name);
    };
    reader.onerror = () => {
      this.errorMessage.set("La lecture du certificat medical a echoue.");
      this.toastService.error('Lecture impossible', "Le certificat medical n'a pas pu etre charge.");
      this.clearMedicalCertificateSelection();
    };
    reader.readAsDataURL(file);
  }

  removeMedicalCertificate() {
    this.clearMedicalCertificateSelection();
  }

  requestTitle(request: AvailabilityRequestResponse) {
    if (request.requestType === 'CONGE') {
      return `Conge ${request.leaveType?.toLowerCase() ?? ''}`.trim();
    }

    return request.title ?? this.missionKindLabel(request.missionKind);
  }

  missionKindLabel(missionKind: MissionKind | null | undefined) {
    return missionKind === 'CONFERENCE' ? 'Participation a une conference' : 'Mission';
  }

  toggleRequests() {
    if (!this.hasCollapsedRequests()) {
      return;
    }

    this.showAllRequests.update((value) => !value);
  }

  toggleAvailabilityDashboard() {
    this.showAvailabilityDashboard.update((value) => !value);
  }

  toggleRequestForm() {
    if (this.saving()) {
      return;
    }

    this.showRequestForm.update((value) => !value);
  }

  cancelRequestForm() {
    if (this.saving()) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.isLeavePage()) {
      this.leaveForm.reset({
        leaveType: 'ANNUEL',
        departmentId: this.defaultDepartmentId(),
        pedagogicalUnit: '',
        startDate: '',
        endDate: '',
        reason: '',
        academicYear: this.defaultAcademicYear(),
        medicalCertificateImageDataUrl: ''
      });
      this.clearMedicalCertificateSelection();
    } else {
      this.missionForm.reset({
        missionKind: 'MISSION',
        title: '',
        startDate: '',
        endDate: '',
        reason: '',
        academicYear: this.defaultAcademicYear()
      });
    }

    this.showRequestForm.set(false);
  }

  private createLeaveRequest(payload: CreateLeaveAvailabilityPayload) {
    this.saving.set(true);

    this.availabilityRequestService
      .createLeaveRequest(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Votre demande de conge a ete envoyee avec succes.');
          this.toastService.success('Demande envoyee', 'La demande de conge a ete transmise au workflow.');
          this.leaveForm.reset({
            leaveType: 'ANNUEL',
            departmentId: this.defaultDepartmentId(),
            pedagogicalUnit: '',
            startDate: '',
            endDate: '',
            reason: '',
            academicYear: this.defaultAcademicYear(),
            medicalCertificateImageDataUrl: ''
          });
          this.clearMedicalCertificateSelection();
          this.loadRequests();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "L'envoi de la demande de conge est impossible."));
        }
      });
  }

  private createMissionRequest(payload: CreateMissionAvailabilityPayload) {
    this.saving.set(true);

    this.availabilityRequestService
      .createMissionRequest(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Votre demande de mission a ete envoyee avec succes.');
          this.toastService.success('Demande envoyee', 'La demande de mission a ete transmise au workflow.');
          this.missionForm.reset({
            missionKind: 'MISSION',
            title: '',
            startDate: '',
            endDate: '',
            reason: '',
            academicYear: this.defaultAcademicYear()
          });
          this.loadRequests();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "L'envoi de la demande de mission est impossible."));
        }
      });
  }

  private defaultAcademicYear() {
    const today = new Date();
    const year = today.getFullYear();
    return today.getMonth() >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  private defaultDepartmentId() {
    const departmentId = this.currentUser()?.departmentId;
    return departmentId != null ? String(departmentId) : '';
  }

  private clearMedicalCertificateSelection() {
    this.leaveForm.controls.medicalCertificateImageDataUrl.setValue('');
    this.medicalCertificatePreview.set('');
    this.medicalCertificateFileName.set('');

    if (this.medicalCertificateInput?.nativeElement) {
      this.medicalCertificateInput.nativeElement.value = '';
    }
  }
}
