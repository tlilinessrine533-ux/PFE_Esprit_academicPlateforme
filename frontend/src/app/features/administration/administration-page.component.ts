import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartData } from 'chart.js';
import { catchError, forkJoin, of } from 'rxjs';
import {
  AdministrationConfig,
  AdministrationConfigUpdateRequest,
  AdministrativeDecisionAction,
  AdministrativeDecisionHistoryResponse,
  AdministrativeEvaluationResponse
} from '../../core/models/administration.models';
import { WorkflowActivityResponse } from '../../core/models/workflow.models';
import { AdministrationService } from '../../core/services/administration.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

@Component({
  selector: 'app-administration-page',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, ChartPanelComponent],
  templateUrl: './administration-page.component.html',
  styleUrl: './administration-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministrationPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly administrationService = inject(AdministrationService);
  private readonly toastService = inject(UiToastService);
  private readonly workflowService = inject(WorkflowService);
  private readonly collapsedBonusRowsSize = 2;
  private readonly collapsedConsultationRowsSize = 2;
  private readonly collapsedHistoryRowsSize = 2;

  readonly loading = signal(false);
  readonly configSaving = signal(false);
  readonly decisionLoadingTeacherId = signal<number | null>(null);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly evaluations = signal<AdministrativeEvaluationResponse[]>([]);
  readonly history = signal<AdministrativeDecisionHistoryResponse[]>([]);
  readonly validatedActivities = signal<WorkflowActivityResponse[]>([]);
  readonly searchTerm = signal('');
  readonly showAdministrationDashboard = signal(false);
  readonly showAllBonusRows = signal(false);
  readonly showAllConsultationRows = signal(false);
  readonly showAllHistoryRows = signal(false);
  readonly manualConfigEntryEnabled = signal(true);

  private readonly configFieldNames: Array<keyof AdministrationConfigUpdateRequest> = [
    'referencePoints',
    'totalPrimeAmount',
    'bonusAbsencePenaltyPerDay',
    'promotionTeachingPointFactor',
    'teachingActivityPoint',
    'supervisionActivityPoint',
    'researchActivityPoint',
    'eventActivityPoint',
    'examSurveillanceActivityPoint',
    'responsibilityActivityPoint'
  ];

  readonly periodForm = this.formBuilder.nonNullable.group({
    periodLabel: [this.defaultAcademicYear(), [Validators.required]]
  });

  readonly configForm = this.formBuilder.nonNullable.group({
    referencePoints: ['500', [Validators.required]],
    totalPrimeAmount: ['0', [Validators.required]],
    bonusAbsencePenaltyPerDay: ['5', [Validators.required]],
    promotionTeachingPointFactor: ['0.1', [Validators.required]],
    teachingActivityPoint: ['5', [Validators.required]],
    supervisionActivityPoint: ['3', [Validators.required]],
    researchActivityPoint: ['4', [Validators.required]],
    eventActivityPoint: ['2', [Validators.required]],
    examSurveillanceActivityPoint: ['1', [Validators.required]],
    responsibilityActivityPoint: ['3', [Validators.required]]
  });

  readonly filteredEvaluations = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.evaluations();
    }

    return this.evaluations().filter((item) => {
      return (
        item.teacherName.toLowerCase().includes(term) ||
        (item.departmentName ?? '').toLowerCase().includes(term) ||
        item.decisionStatus.toLowerCase().includes(term)
      );
    });
  });
  readonly hasBonusRowsToggle = computed(
    () => this.filteredEvaluations().length > this.collapsedBonusRowsSize
  );
  readonly bonusRowsToggleLabel = computed(() =>
    this.showAllBonusRows() ? 'Afficher moins de bonus' : 'Afficher tous les bonus'
  );
  readonly visibleBonusRows = computed(() =>
    this.showAllBonusRows()
      ? this.filteredEvaluations()
      : this.filteredEvaluations().slice(0, this.collapsedBonusRowsSize)
  );
  readonly filteredValidatedActivities = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const source = this.validatedActivities();
    if (!term) {
      return source;
    }

    return source.filter((activity) => {
      return (
        activity.title.toLowerCase().includes(term)
        || activity.teacherName.toLowerCase().includes(term)
        || activity.subtitle.toLowerCase().includes(term)
        || activity.activityType.toLowerCase().includes(term)
      );
    });
  });
  readonly hasConsultationRowsToggle = computed(
    () => this.filteredValidatedActivities().length > this.collapsedConsultationRowsSize
  );
  readonly consultationRowsToggleLabel = computed(() =>
    this.showAllConsultationRows() ? 'Afficher moins de consultations' : 'Afficher toutes les consultations'
  );
  readonly visibleConsultationRows = computed(() =>
    this.showAllConsultationRows()
      ? this.filteredValidatedActivities()
      : this.filteredValidatedActivities().slice(0, this.collapsedConsultationRowsSize)
  );
  readonly hasHistoryRowsToggle = computed(
    () => this.history().length > this.collapsedHistoryRowsSize
  );
  readonly historyRowsToggleLabel = computed(() =>
    this.showAllHistoryRows() ? 'Afficher moins d historique administratif' : 'Afficher tout l historique administratif'
  );
  readonly visibleHistoryRows = computed(() =>
    this.showAllHistoryRows()
      ? this.history()
      : this.history().slice(0, this.collapsedHistoryRowsSize)
  );
  readonly validatedActivitiesTotal = computed(() =>
    this.filteredEvaluations().reduce((total, item) => total + Number(item.validatedActivities ?? 0), 0)
  );
  readonly globalWeightTotal = computed(() =>
    this.evaluations().reduce((total, item) => total + this.resolvedEvaluationWeight(item), 0)
  );
  readonly bonusTotal = computed(() =>
    this.filteredEvaluations().reduce((total, item) => total + Number(item.calculatedBonus ?? 0), 0)
  );
  readonly promotionPointsTotal = computed(() =>
    this.filteredEvaluations().reduce((total, item) => total + Number(item.calculatedPromotionPoints ?? 0), 0)
  );
  readonly eligibleTeachersCount = computed(() =>
    this.filteredEvaluations().filter((item) => Number(item.calculatedBonus ?? 0) > 0).length
  );
  readonly pendingDecisionCount = computed(() =>
    this.filteredEvaluations().filter((item) => item.decisionStatus === 'EN_ATTENTE').length
  );
  readonly decisionStatusChartData = computed<ChartData<'pie'>>(() => {
    const pending = this.filteredEvaluations().filter((item) => item.decisionStatus === 'EN_ATTENTE').length;
    const validated = this.filteredEvaluations().filter((item) => item.decisionStatus === 'VALIDE').length;
    const rejected = this.filteredEvaluations().filter((item) => item.decisionStatus === 'REJETE').length;

    return {
      labels: ['En attente', 'Valide', 'Rejete'],
      datasets: [
        {
          data: [pending, validated, rejected],
          backgroundColor: ['#f59e0b', '#16a34a', '#dc2626'],
          borderColor: ['rgba(245, 158, 11, 0.92)', 'rgba(22, 163, 74, 0.92)', 'rgba(220, 38, 38, 0.92)'],
          borderWidth: 1
        }
      ]
    };
  });
  readonly bonusByDepartmentChartData = computed<ChartData<'bar'>>(() => {
    const totals = this.filteredEvaluations().reduce<Record<string, number>>((accumulator, item) => {
      const department = (item.departmentName ?? 'Non affecte').trim() || 'Non affecte';
      accumulator[department] = (accumulator[department] ?? 0) + Number(item.calculatedBonus ?? 0);
      return accumulator;
    }, {});

    const rows = Object.entries(totals)
      .map(([department, amount]) => ({ department, amount }))
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 8);

    return {
      labels: rows.map((row) => row.department),
      datasets: [
        {
          label: 'Prime estimee',
          data: rows.map((row) => this.roundValue(row.amount)),
          backgroundColor: '#1d4ed8',
          borderRadius: 8,
          maxBarThickness: 34
        }
      ]
    };
  });
  readonly pointsByDepartmentChartData = computed<ChartData<'bar'>>(() => {
    const totals = this.filteredEvaluations().reduce<Record<string, number>>((accumulator, item) => {
      const department = (item.departmentName ?? 'Non affecte').trim() || 'Non affecte';
      accumulator[department] = (accumulator[department] ?? 0) + Number(item.calculatedPromotionPoints ?? 0);
      return accumulator;
    }, {});

    const rows = Object.entries(totals)
      .map(([department, points]) => ({ department, points }))
      .sort((left, right) => right.points - left.points)
      .slice(0, 8);

    return {
      labels: rows.map((row) => row.department),
      datasets: [
        {
          label: 'Points promotion',
          data: rows.map((row) => this.roundValue(row.points)),
          backgroundColor: '#f97316',
          borderRadius: 8,
          maxBarThickness: 34
        }
      ]
    };
  });
  readonly bonusTrendChartData = computed<ChartData<'line'>>(() => {
    const rows = this.filteredEvaluations()
      .slice()
      .sort((left, right) => this.roundValue(right.calculatedBonus) - this.roundValue(left.calculatedBonus))
      .slice(0, 8);

    return {
      labels: rows.map((row) => this.compactTeacherLabel(row.teacherName)),
      datasets: [
        {
          label: 'Prime estimee',
          data: rows.map((row) => this.roundValue(row.calculatedBonus)),
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.18)',
          pointBackgroundColor: '#7c3aed',
          pointRadius: 3,
          fill: true,
          tension: 0.28
        }
      ]
    };
  });

  constructor() {
    this.loadPageData();
  }

  loadPageData() {
    this.loading.set(true);
    this.errorMessage.set('');

    const periodLabel = this.periodForm.getRawValue().periodLabel.trim();
    forkJoin({
      configuration: this.administrationService.getConfiguration(),
      evaluations: this.administrationService.getEvaluations(periodLabel),
      history: this.administrationService.getHistory(periodLabel),
      workflowActivities: this.workflowService.getActivities().pipe(
        catchError(() => of([] as WorkflowActivityResponse[]))
      )
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ configuration, evaluations, history, workflowActivities }) => {
          this.applyConfiguration(configuration);
          this.evaluations.set(this.sortEvaluationsByTeacher(evaluations));
          this.history.set(history);
          this.validatedActivities.set(this.extractValidatedActivities(workflowActivities, periodLabel));
          this.showAllBonusRows.set(false);
          this.showAllConsultationRows.set(false);
          this.showAllHistoryRows.set(false);
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Chargement de l'espace administration impossible."));
        }
      });
  }

  refreshEvaluations() {
    this.loading.set(true);
    this.errorMessage.set('');

    const periodLabel = this.periodForm.getRawValue().periodLabel.trim();
    forkJoin({
      evaluations: this.administrationService.getEvaluations(periodLabel),
      history: this.administrationService.getHistory(periodLabel),
      workflowActivities: this.workflowService.getActivities().pipe(
        catchError(() => of([] as WorkflowActivityResponse[]))
      )
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ evaluations, history, workflowActivities }) => {
          this.evaluations.set(this.sortEvaluationsByTeacher(evaluations));
          this.history.set(history);
          this.validatedActivities.set(this.extractValidatedActivities(workflowActivities, periodLabel));
          this.showAllBonusRows.set(false);
          this.showAllConsultationRows.set(false);
          this.showAllHistoryRows.set(false);
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Actualisation des evaluations impossible.'));
        }
      });
  }

  saveConfiguration() {
    if (this.configSaving()) {
      return;
    }

    const payload = this.buildConfigurationPayload();
    if (!payload) {
      this.configForm.markAllAsTouched();
      this.errorMessage.set('Veuillez saisir des nombres valides (virgule ou point) pour toutes les zones.');
      return;
    }

    this.configSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.administrationService
      .updateConfiguration(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (configuration) => {
          this.configSaving.set(false);
          this.applyConfiguration(configuration);
          this.successMessage.set('Configuration enregistree.');
          this.toastService.success('Configuration mise a jour', 'Les regles de calcul ont ete enregistrees.');
          this.refreshEvaluations();
        },
        error: (error) => {
          this.configSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Enregistrement de la configuration impossible.'));
        }
      });
  }

  submitDecision(evaluation: AdministrativeEvaluationResponse, decision: AdministrativeDecisionAction) {
    if (this.decisionLoadingTeacherId() != null) {
      return;
    }

    const commentInput = prompt(
      decision === 'VALIDE'
        ? `Commentaire (optionnel) pour valider ${evaluation.teacherName} :`
        : `Commentaire (optionnel) pour rejeter ${evaluation.teacherName} :`
    );
    if (commentInput === null) {
      return;
    }

    this.decisionLoadingTeacherId.set(evaluation.teacherId);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.administrationService
      .submitFinalDecision(evaluation.teacherId, {
        periodLabel: this.periodForm.getRawValue().periodLabel.trim(),
        decision,
        commentText: commentInput.trim() || null
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.decisionLoadingTeacherId.set(null);
          this.successMessage.set(`Decision ${decision.toLowerCase()} enregistree pour ${evaluation.teacherName}.`);
          this.toastService.success('Decision finale enregistree', 'Le dossier administratif a ete mis a jour.');
          this.refreshEvaluations();
        },
        error: (error) => {
          this.decisionLoadingTeacherId.set(null);
          this.errorMessage.set(extractErrorMessage(error, 'La decision finale n a pas pu etre enregistree.'));
        }
      });
  }

  statusLabel(status: AdministrativeEvaluationResponse['decisionStatus']) {
    switch (status) {
      case 'VALIDE':
        return 'Valide';
      case 'REJETE':
        return 'Rejete';
      default:
        return 'En attente';
    }
  }

  statusClass(status: AdministrativeEvaluationResponse['decisionStatus']) {
    switch (status) {
      case 'VALIDE':
        return 'is-valid';
      case 'REJETE':
        return 'is-rejected';
      default:
        return 'is-pending';
    }
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.showAllBonusRows.set(false);
    this.showAllConsultationRows.set(false);
    this.showAllHistoryRows.set(false);
  }

  toggleAdministrationDashboard() {
    this.showAdministrationDashboard.update((value) => !value);
  }

  toggleManualConfigEntry() {
    if (this.configSaving()) {
      return;
    }

    this.manualConfigEntryEnabled.update((value) => !value);
    if (this.manualConfigEntryEnabled()) {
      this.configForm.enable({ emitEvent: false });
      return;
    }

    this.configForm.disable({ emitEvent: false });
  }

  toggleBonusRowsVisibility() {
    if (!this.hasBonusRowsToggle()) {
      return;
    }

    this.showAllBonusRows.update((value) => !value);
  }

  toggleConsultationRowsVisibility() {
    if (!this.hasConsultationRowsToggle()) {
      return;
    }

    this.showAllConsultationRows.update((value) => !value);
  }

  toggleHistoryRowsVisibility() {
    if (!this.hasHistoryRowsToggle()) {
      return;
    }

    this.showAllHistoryRows.update((value) => !value);
  }

  evaluationWeightForView(evaluation: AdministrativeEvaluationResponse) {
    return this.roundWeightValue(this.resolvedEvaluationWeight(evaluation));
  }

  onNumericKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const allowedKeys = new Set([
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End'
    ]);
    if (allowedKeys.has(event.key)) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      return;
    }

    if (event.key === '.' || event.key === ',') {
      const input = event.currentTarget as HTMLInputElement | null;
      if (!input) {
        event.preventDefault();
        return;
      }

      const selectionStart = input.selectionStart ?? input.value.length;
      const selectionEnd = input.selectionEnd ?? input.value.length;
      const valueExcludingSelection =
        input.value.slice(0, selectionStart) + input.value.slice(selectionEnd);

      if (!valueExcludingSelection.includes('.') && !valueExcludingSelection.includes(',')) {
        return;
      }
    }

    event.preventDefault();
  }

  onNumericInput(event: Event, fieldName: keyof AdministrationConfigUpdateRequest) {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }

    const sanitizedValue = this.sanitizeNumericValue(input.value);
    if (sanitizedValue !== input.value) {
      input.value = sanitizedValue;
    }

    this.configForm.controls[fieldName].setValue(sanitizedValue, { emitEvent: false });
  }

  private applyConfiguration(configuration: AdministrationConfig) {
    this.configForm.patchValue({
      referencePoints: this.formatDecimalForInput(configuration.referencePoints),
      totalPrimeAmount: this.formatDecimalForInput(configuration.totalPrimeAmount),
      bonusAbsencePenaltyPerDay: this.formatDecimalForInput(configuration.bonusAbsencePenaltyPerDay),
      promotionTeachingPointFactor: this.formatDecimalForInput(configuration.promotionTeachingPointFactor),
      teachingActivityPoint: this.formatDecimalForInput(configuration.teachingActivityPoint),
      supervisionActivityPoint: this.formatDecimalForInput(configuration.supervisionActivityPoint),
      researchActivityPoint: this.formatDecimalForInput(configuration.researchActivityPoint),
      eventActivityPoint: this.formatDecimalForInput(configuration.eventActivityPoint),
      examSurveillanceActivityPoint: this.formatDecimalForInput(configuration.examSurveillanceActivityPoint),
      responsibilityActivityPoint: this.formatDecimalForInput(configuration.responsibilityActivityPoint)
    });
  }

  private defaultAcademicYear() {
    const today = new Date();
    const year = today.getFullYear();
    return today.getMonth() >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  private compactTeacherLabel(value: string) {
    const normalized = value.trim();
    if (normalized.length <= 18) {
      return normalized;
    }

    return `${normalized.slice(0, 18)}...`;
  }

  private roundValue(value: number) {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.round(value * 100) / 100;
  }

  private roundWeightValue(value: number) {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.round(value * 1_000_000) / 1_000_000;
  }

  private sortEvaluationsByTeacher(evaluations: AdministrativeEvaluationResponse[]) {
    return evaluations
      .slice()
      .sort((left, right) => {
        const byName = left.teacherName.localeCompare(right.teacherName, 'fr', { sensitivity: 'base' });
        if (byName !== 0) {
          return byName;
        }
        return left.teacherId - right.teacherId;
      });
  }

  private extractValidatedActivities(activities: WorkflowActivityResponse[], periodLabel: string) {
    return activities
      .filter((activity) => {
        return (
          activity.academicYear === periodLabel
          && (activity.status === 'VALIDEE_DEPARTEMENT' || activity.status === 'VALIDEE_FINALE')
        );
      })
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
  }

  private buildConfigurationPayload(): AdministrationConfigUpdateRequest | null {
    if (this.configForm.invalid) {
      return null;
    }

    const raw = this.configForm.getRawValue();
    const payload: Partial<AdministrationConfigUpdateRequest> = {};
    let hasInvalidValue = false;

    for (const fieldName of this.configFieldNames) {
      const control = this.configForm.controls[fieldName];
      const parsedValue = this.parseNonNegativeDecimal(raw[fieldName]);

      if (parsedValue === null) {
        control.setErrors({ ...(control.errors ?? {}), invalidNumber: true });
        hasInvalidValue = true;
        continue;
      }

      if (control.hasError('invalidNumber')) {
        const currentErrors = { ...(control.errors ?? {}) };
        delete currentErrors['invalidNumber'];
        control.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
      }

      payload[fieldName] = parsedValue;
      control.setValue(this.formatDecimalForInput(parsedValue), { emitEvent: false });
    }

    if (hasInvalidValue) {
      return null;
    }

    return payload as AdministrationConfigUpdateRequest;
  }

  private parseNonNegativeDecimal(rawValue: string): number | null {
    const normalized = rawValue.replace(/\s+/g, '').replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(normalized)) {
      return null;
    }

    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return null;
    }

    return parsed;
  }

  private formatDecimalForInput(value: number) {
    if (!Number.isFinite(value)) {
      return '0';
    }
    return value.toString().replace('.', ',');
  }

  private sanitizeNumericValue(rawValue: string) {
    const compact = rawValue.replace(/\s+/g, '');
    const numericOnly = compact.replace(/[^0-9.,]/g, '');
    if (!numericOnly) {
      return '';
    }

    const separatorIndex = numericOnly.search(/[.,]/);
    if (separatorIndex < 0) {
      return numericOnly;
    }

    const integerPart = numericOnly.slice(0, separatorIndex).replace(/[.,]/g, '');
    const separator = numericOnly.charAt(separatorIndex);
    const decimalPart = numericOnly.slice(separatorIndex + 1).replace(/[.,]/g, '');
    const safeIntegerPart = integerPart.length > 0 ? integerPart : '0';

    return `${safeIntegerPart}${separator}${decimalPart}`;
  }

  private resolvedEvaluationWeight(item: AdministrativeEvaluationResponse) {
    const backendWeight = Number(item.calculatedWeight);
    if (Number.isFinite(backendWeight)) {
      return Math.max(0, backendWeight);
    }

    const referencePoints = this.parseNonNegativeDecimal(this.configForm.controls.referencePoints.value);
    if (referencePoints == null || referencePoints <= 0) {
      return 0;
    }

    const promotionPoints = Number(item.calculatedPromotionPoints ?? 0);
    if (!Number.isFinite(promotionPoints)) {
      return 0;
    }

    if (promotionPoints <= referencePoints) {
      return 0;
    }

    return (promotionPoints - referencePoints) / referencePoints;
  }
}
