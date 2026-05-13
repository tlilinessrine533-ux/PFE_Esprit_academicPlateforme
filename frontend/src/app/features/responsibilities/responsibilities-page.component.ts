import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { PersonalDashboardResponse } from '../../core/models/dashboard.models';
import {
  CreateResponsibilityActivityPayload,
  ResponsibilityActivityResponse,
  ResponsibilitySummaryResponse
} from '../../core/models/responsibility.models';
import { ResponsibilityType } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ResponsibilityService } from '../../core/services/responsibility.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { scrollElementIntoViewOnNextFrame } from '../../core/utils/scroll.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

@Component({
  selector: 'app-responsibilities-page',
  imports: [ReactiveFormsModule, DatePipe, ChartPanelComponent],
  templateUrl: './responsibilities-page.component.html',
  styleUrl: './responsibilities-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsibilitiesPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly responsibilityService = inject(ResponsibilityService);
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);
  private readonly workflowService = inject(WorkflowService);

  readonly activities = signal<ResponsibilityActivityResponse[]>([]);
  readonly summary = signal<ResponsibilitySummaryResponse | null>(null);
  readonly dashboardInsights = signal<PersonalDashboardResponse | null>(null);
  readonly dashboardInsightsLoading = signal(false);
  readonly dashboardInsightsError = signal('');
  readonly dashboardPeriodLabel = signal(this.defaultAcademicYear());
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly responsibilityTypes: ResponsibilityType[] = [
    'RESPONSABLE_FILIERE',
    'CHEF_DEPARTEMENT',
    'AUTRE'
  ];
  readonly responsibilityTypeFilters = [
    'ALL',
    'RESPONSABLE_FILIERE',
    'CHEF_DEPARTEMENT',
    'AUTRE'
  ] as const;
  readonly stateFilters = ['ALL', 'ACTIVE', 'COMPLETED'] as const;
  readonly currentUserId = computed(() => this.authService.user()?.id ?? null);
  readonly currentRole = this.authService.role;
  readonly isCreatePage = this.route.snapshot.data['mode'] === 'create';
  readonly canCreate = computed(() => this.authService.hasAnyRole('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION'));
  readonly isManagerDashboard = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly searchTerm = signal('');
  readonly typeFilter = signal<(typeof this.responsibilityTypeFilters)[number]>('ALL');
  readonly stateFilter = signal<(typeof this.stateFilters)[number]>('ALL');
  readonly showActivityDashboard = signal(true);
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly selectedActivity = signal<ResponsibilityActivityResponse | null>(null);
  readonly editingActivityId = signal<number | null>(null);
  readonly detailSection = viewChild<ElementRef<HTMLElement>>('detailSection');
  readonly filteredActivities = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.typeFilter();
    const state = this.stateFilter();

    return this.activities()
      .filter((activity) => {
        const normalizedType = this.normalizeResponsibilityType(activity.responsibilityType);
        const matchesType = type === 'ALL' || normalizedType === type;
        const matchesState = state === 'ALL' || this.activityState(activity) === state;
        const matchesTerm =
          term.length === 0 ||
          this.responsibilityTypeLabel(normalizedType).toLowerCase().includes(term) ||
          activity.teacherName.toLowerCase().includes(term) ||
          activity.academicYear.toLowerCase().includes(term);

        return matchesType && matchesState && matchesTerm;
      })
      .sort((first, second) => this.compareActivitiesByRecency(first, second));
  });
  readonly displayedActivities = computed(() => {
    const filtered = this.filteredActivities();
    if (this.showFullHistory() || filtered.length <= this.collapsedHistorySize) {
      return filtered;
    }

    return filtered.slice(0, this.collapsedHistorySize);
  });
  readonly hasHistoryToggle = computed(() => this.filteredActivities().length > this.collapsedHistorySize);
  readonly historyToggleLabel = computed(() =>
    this.showFullHistory() ? "Masquer l'historique" : "Afficher tout l'historique"
  );
  readonly visibleActiveCount = computed(
    () => this.displayedActivities().filter((activity) => this.activityState(activity) === 'ACTIVE').length
  );
  readonly visibleLeadershipCount = computed(
    () =>
      this.displayedActivities().filter(
        (activity) => {
          const normalizedType = this.normalizeResponsibilityType(activity.responsibilityType);
          return normalizedType === 'RESPONSABLE_FILIERE' || normalizedType === 'CHEF_DEPARTEMENT';
        }
      ).length
  );
  readonly responsibilityTypeBreakdown = computed(() => {
    const periodActivities = this.dashboardPeriodActivities();
    let formation = 0;
    let departement = 0;
    let direction = 0;

    for (const activity of periodActivities) {
      const normalizedType = this.normalizeResponsibilityType(activity.responsibilityType);
      if (normalizedType === 'RESPONSABLE_FILIERE') {
        formation += 1;
      } else if (normalizedType === 'CHEF_DEPARTEMENT') {
        departement += 1;
      } else {
        direction += 1;
      }
    }

    return {
      formation,
      departement,
      direction,
      academique: formation + departement,
      administrative: direction,
      total: periodActivities.length
    };
  });
  readonly responsibilityComparisonTitle = computed(() => 'Volume par role institutionnel');
  readonly responsibilityComparisonSubtitle = computed(
    () => 'Comparaison des responsabilites par type: formation, departement et direction.'
  );
  readonly responsibilityTrendSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Historique annuel des declarations de responsabilite du perimetre.'
      : 'Historique de vos declarations de responsabilite.'
  );
  readonly responsibilityComparisonNote = computed(() => {
    const stats = this.responsibilityTypeBreakdown();
    if (stats.total === 0) {
      return 'Aucune responsabilite disponible sur la periode active.';
    }
    return `${stats.formation} formation, ${stats.departement} departement et ${stats.direction} direction sur ${stats.total} declaration(s).`;
  });
  readonly responsibilityComparisonChartData = computed<ChartData<'bar'>>(() => {
    const stats = this.responsibilityTypeBreakdown();
    return {
      labels: ['Responsable de formation', 'Responsable de departement', 'Direction'],
      datasets: [
        {
          label: 'Responsabilites',
          data: [stats.formation, stats.departement, stats.direction],
          backgroundColor: ['#1d4ed8', '#0f766e', '#f97316'],
          borderRadius: 10,
          maxBarThickness: 56
        }
      ]
    };
  });
  readonly responsibilityDistributionChartData = computed<ChartData<'doughnut'>>(() => {
    const stats = this.responsibilityTypeBreakdown();
    return {
      labels: ['Responsable de formation', 'Responsable de departement', 'Direction'],
      datasets: [
        {
          data: [stats.formation, stats.departement, stats.direction],
          backgroundColor: ['#2563eb', '#0f766e', '#f97316'],
          borderWidth: 0
        }
      ]
    };
  });
  readonly responsibilityTrendChartData = computed<ChartData<'line'>>(() => {
    const historyFromActivitiesMap = this.activities().reduce<Record<string, number>>((accumulator, activity) => {
      const periodKey = this.normalizeAcademicYearLabel(activity.academicYear);
      if (!periodKey) {
        return accumulator;
      }
      accumulator[periodKey] = (accumulator[periodKey] ?? 0) + 1;
      return accumulator;
    }, {});
    const historyFromActivities = Object.entries(historyFromActivitiesMap)
      .map(([periodLabel, total]) => ({ periodLabel, totalResponsibilityActivities: total }))
      .sort((left, right) => this.compareAcademicYears(left.periodLabel, right.periodLabel));

    const insights = this.dashboardInsights();
    const historyFromInsights = [...(insights?.yearlyPerformance ?? [])].sort((left, right) =>
      this.compareAcademicYears(left.periodLabel, right.periodLabel)
    );
    const hasUsableInsightsHistory = historyFromInsights.some(
      (entry) => Number(entry.totalResponsibilityActivities ?? 0) > 0
    );
    const sorted =
      hasUsableInsightsHistory || historyFromActivities.length === 0 ? historyFromInsights : historyFromActivities;

    return {
      labels: sorted.map((entry) => entry.periodLabel),
      datasets: [
        {
          label: 'Responsabilites',
          data: sorted.map((entry) => Number(entry.totalResponsibilityActivities ?? 0)),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
  });

  readonly createForm = this.formBuilder.nonNullable.group({
    responsibilityType: ['RESPONSABLE_FILIERE' as ResponsibilityType, [Validators.required]],
    startDate: ['2025-09-01', [Validators.required]],
    endDate: [''],
    academicYear: ['2025-2026', [Validators.required]]
  });

  readonly editForm = this.formBuilder.nonNullable.group({
    responsibilityType: ['RESPONSABLE_FILIERE' as ResponsibilityType, [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    academicYear: ['', [Validators.required]]
  });

  constructor() {
    if (!this.isCreatePage) {
      this.loadData();
    }
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      activities: this.responsibilityService.getResponsibilityActivities(),
      summary: this.responsibilityService.getSummary()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ activities, summary }) => {
          this.activities.set(activities);
          this.summary.set(summary);
          this.refreshDashboardInsights(activities);
          const currentSelectedId = this.selectedActivity()?.id;
          const nextSelected = activities.find((activity) => activity.id === currentSelectedId) ?? null;
          this.selectedActivity.set(nextSelected);

          if (nextSelected && this.editingActivityId() === nextSelected.id) {
            this.patchEditForm(nextSelected);
          }

          if (!nextSelected) {
            this.editingActivityId.set(null);
          }

          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Impossible de charger les responsabilites.'));
        }
      });
  }

  createResponsibility() {
    if (!this.canCreate()) {
      this.errorMessage.set('Vous ne pouvez pas ajouter une responsabilite depuis ce compte.');
      return;
    }

    if (this.createForm.invalid || this.saving()) {
      this.createForm.markAllAsTouched();
      return;
    }

    const rawValue = this.createForm.getRawValue();
    const normalizedType = this.normalizeResponsibilityType(rawValue.responsibilityType);
    const typeRuleMessage = this.validateRoleTypeRule();
    if (typeRuleMessage) {
      this.errorMessage.set(typeRuleMessage);
      this.toastService.error('Type non autorise', typeRuleMessage);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload: CreateResponsibilityActivityPayload = {
      responsibilityType: normalizedType,
      startDate: rawValue.startDate,
      endDate: rawValue.endDate.trim() || null,
      academicYear: rawValue.academicYear.trim()
    };

    this.responsibilityService
      .createResponsibilityActivity(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toastService.success('Responsabilite ajoutee', 'La responsabilite a ete creee avec succes.');
          this.router.navigateByUrl('/responsibilities');
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Creation de la responsabilite impossible.'));
        }
      });
  }

  canManage(activity: ResponsibilityActivityResponse) {
    const currentRole = this.currentRole();
    if (currentRole === 'ADMINISTRATION' || currentRole === 'SUPER_ADMIN') {
      return true;
    }

    const currentUserId = this.currentUserId();
    return (
      currentUserId === activity.userId &&
      (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER')
    );
  }

  canSubmit(activity: ResponsibilityActivityResponse) {
    const currentUserId = this.currentUserId();
    return (
      this.authService.hasAnyRole('ENSEIGNANT') &&
      currentUserId === activity.userId &&
      (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER')
    );
  }

  submitActivity(activity: ResponsibilityActivityResponse) {
    if (!this.canSubmit(activity)) {
      this.errorMessage.set('Vous ne pouvez pas soumettre cette responsabilite.');
      return;
    }

    this.workflowService
      .submitActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(`L'activite ${this.formatResponsibilityType(activity.responsibilityType)} a ete soumise.`);
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, 'Soumission de la responsabilite impossible.'));
        }
      });
  }

  deleteResponsibility(activity: ResponsibilityActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas supprimer cette responsabilite.');
      return;
    }

    if (!confirm(`Supprimer la responsabilite ${this.formatResponsibilityType(activity.responsibilityType)} ?`)) {
      return;
    }

    this.responsibilityService
      .deleteResponsibilityActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Responsabilite supprimee avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, 'Suppression de la responsabilite impossible.'));
        }
      });
  }

  selectActivity(activity: ResponsibilityActivityResponse) {
    this.selectedActivity.set(activity);
    if (this.editingActivityId() === activity.id) {
      this.patchEditForm(activity);
    }
    this.scrollToDetailSection();
  }

  startEditing(activity: ResponsibilityActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas modifier cette responsabilite.');
      return;
    }

    this.selectedActivity.set(activity);
    this.editingActivityId.set(activity.id);
    this.patchEditForm(activity);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.scrollToDetailSection();
  }

  cancelEditing() {
    this.editingActivityId.set(null);
  }

  goToCreatePage() {
    this.router.navigateByUrl('/responsibilities/new');
  }

  goToListPage() {
    this.router.navigateByUrl('/responsibilities');
  }

  saveEdit() {
    const activity = this.selectedActivity();
    if (!activity || this.editingActivityId() !== activity.id) {
      return;
    }

    if (this.editForm.invalid || this.saving()) {
      this.editForm.markAllAsTouched();
      return;
    }

    const rawValue = this.editForm.getRawValue();
    const normalizedType = this.normalizeResponsibilityType(rawValue.responsibilityType);
    const typeRuleMessage = this.validateRoleTypeRule();
    if (typeRuleMessage) {
      this.errorMessage.set(typeRuleMessage);
      this.toastService.error('Type non autorise', typeRuleMessage);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload: CreateResponsibilityActivityPayload = {
      responsibilityType: normalizedType,
      startDate: rawValue.startDate,
      endDate: rawValue.endDate.trim() || null,
      academicYear: rawValue.academicYear.trim()
    };

    this.responsibilityService
      .updateResponsibilityActivity(activity.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.editingActivityId.set(null);
          this.successMessage.set('Responsabilite modifiee avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Modification de la responsabilite impossible.'));
        }
      });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateTypeFilter(value: string) {
    if (this.responsibilityTypeFilters.includes(value as (typeof this.responsibilityTypeFilters)[number])) {
      this.typeFilter.set(value as (typeof this.responsibilityTypeFilters)[number]);
    }
  }

  updateStateFilter(value: string) {
    if (this.stateFilters.includes(value as (typeof this.stateFilters)[number])) {
      this.stateFilter.set(value as (typeof this.stateFilters)[number]);
    }
  }

  toggleHistoryVisibility() {
    if (!this.hasHistoryToggle()) {
      return;
    }

    this.showFullHistory.update((value) => !value);
  }

  toggleActivityDashboard() {
    this.showActivityDashboard.update((value) => !value);
  }

  private scrollToDetailSection() {
    scrollElementIntoViewOnNextFrame(() => this.detailSection()?.nativeElement);
  }

  activityState(activity: ResponsibilityActivityResponse) {
    if (!activity.endDate) {
      return 'ACTIVE';
    }

    return new Date(activity.endDate).getTime() >= new Date().setHours(0, 0, 0, 0) ? 'ACTIVE' : 'COMPLETED';
  }

  responsibilityTypeLabel(type: ResponsibilityType | 'ALL') {
    if (type === 'ALL') {
      return 'Tous';
    }
    return this.formatResponsibilityType(type);
  }

  formatResponsibilityType(type: ResponsibilityType) {
    const normalizedType = this.normalizeResponsibilityType(type);
    switch (normalizedType) {
      case 'RESPONSABLE_FILIERE':
        return 'Responsable de formation';
      case 'CHEF_DEPARTEMENT':
        return 'Responsable de departement';
      case 'AUTRE':
        return 'Direction';
      default:
        return normalizedType.replaceAll('_', ' ');
    }
  }

  private patchEditForm(activity: ResponsibilityActivityResponse) {
    this.editForm.patchValue({
      responsibilityType: this.normalizeResponsibilityType(activity.responsibilityType),
      startDate: activity.startDate,
      endDate: activity.endDate ?? '',
      academicYear: activity.academicYear
    });
  }

  private normalizeResponsibilityType(type: ResponsibilityType): ResponsibilityType {
    if (type === 'MAITRE_STAGE' || type === 'COORDINATEUR_MODULE') {
      return 'RESPONSABLE_FILIERE';
    }
    return type;
  }

  private compareActivitiesByRecency(first: ResponsibilityActivityResponse, second: ResponsibilityActivityResponse) {
    const createdAtDifference = this.parseDateValue(second.createdAt) - this.parseDateValue(first.createdAt);
    if (createdAtDifference !== 0) {
      return createdAtDifference;
    }

    const updatedAtDifference = this.parseDateValue(second.updatedAt) - this.parseDateValue(first.updatedAt);
    if (updatedAtDifference !== 0) {
      return updatedAtDifference;
    }

    return second.id - first.id;
  }

  private parseDateValue(value: string) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private refreshDashboardInsights(activities: ResponsibilityActivityResponse[]) {
    const periodLabel = this.resolveDashboardPeriodLabel(activities.map((activity) => activity.academicYear));
    this.dashboardPeriodLabel.set(periodLabel);
    this.dashboardInsightsLoading.set(true);
    this.dashboardInsightsError.set('');

    if (this.isManagerDashboard()) {
      this.dashboardInsights.set(null);
      this.dashboardInsightsLoading.set(false);
      this.dashboardInsightsError.set('');
      return;
    }

    this.dashboardService
      .getPersonal(periodLabel)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (personalDashboard) => {
          this.dashboardInsights.set(personalDashboard);
          this.dashboardInsightsLoading.set(false);
        },
        error: () => {
          this.dashboardInsights.set(null);
          this.dashboardInsightsLoading.set(false);
          this.dashboardInsightsError.set("Le dashboard responsabilite n'a pas pu etre charge.");
        }
      });
  }

  private resolveDashboardPeriodLabel(periodCandidates: Array<string | null | undefined>) {
    const normalized = periodCandidates
      .filter((candidate): candidate is string => typeof candidate === 'string' && candidate.trim().length > 0)
      .map((candidate) => candidate.trim());

    if (normalized.length === 0) {
      return this.defaultAcademicYear();
    }

    const defaultYear = this.defaultAcademicYear();
    if (normalized.includes(defaultYear)) {
      return defaultYear;
    }

    return [...normalized].sort((left, right) => this.compareAcademicYears(right, left))[0] ?? defaultYear;
  }

  private compareAcademicYears(left: string, right: string) {
    const leftValue = this.academicYearSortKey(left);
    const rightValue = this.academicYearSortKey(right);
    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }
    return left.localeCompare(right);
  }

  private academicYearSortKey(value: string) {
    const [firstToken] = value.split('-');
    const parsed = Number.parseInt(firstToken ?? '', 10);
    return Number.isFinite(parsed) ? parsed : Number.MIN_SAFE_INTEGER;
  }

  private dashboardScopeResponsibilityStats() {
    const periodActivities = this.dashboardPeriodActivities();
    const total = periodActivities.length;
    const teacherCount = this.uniqueTeacherCount(periodActivities);
    const average = teacherCount > 0 ? total / teacherCount : 0;
    return { total, teacherCount, average };
  }

  private dashboardPeriodActivities() {
    const allActivities = this.activities();
    if (allActivities.length === 0) {
      return allActivities;
    }

    const periodKey = this.normalizeAcademicYearLabel(this.dashboardPeriodLabel());
    const periodActivities = allActivities.filter(
      (activity) => this.normalizeAcademicYearLabel(activity.academicYear) === periodKey
    );
    return periodActivities.length > 0 ? periodActivities : allActivities;
  }

  private uniqueTeacherCount(activities: ResponsibilityActivityResponse[]) {
    const teacherIds = new Set<number>();
    for (const activity of activities) {
      if (Number.isFinite(activity.userId)) {
        teacherIds.add(activity.userId);
      }
    }
    return teacherIds.size || 1;
  }

  private normalizeAcademicYearLabel(value: string | null | undefined) {
    const rawValue = (value ?? '').trim();
    if (!rawValue) {
      return '';
    }

    const years = rawValue.match(/\d{4}/g);
    if (years && years.length >= 2) {
      return `${years[0]}-${years[1]}`;
    }

    return rawValue.replace(/[\/\\]/g, '-').replace(/\s+/g, '');
  }

  private formatAverage(value: number) {
    return Number.isInteger(value) ? `${value}` : value.toFixed(1);
  }

  private defaultAcademicYear() {
    const today = new Date();
    const year = today.getFullYear();
    const startsNewAcademicYear = today.getMonth() + 1 >= 8;
    return startsNewAcademicYear ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  private validateRoleTypeRule() {
    if (!this.canCreate()) {
      return "Ce role n'est pas autorise a declarer une responsabilite.";
    }
    return null;
  }
}
