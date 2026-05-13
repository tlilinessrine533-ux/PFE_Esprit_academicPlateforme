import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { PersonalDashboardResponse } from '../../core/models/dashboard.models';
import {
  CreateExamSurveillanceActivityPayload,
  ExamSurveillanceActivityResponse,
  ExamSurveillanceSummaryResponse,
  SurveillanceSessionDay
} from '../../core/models/exam-surveillance.models';
import { SemesterType } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ExamSurveillanceService } from '../../core/services/exam-surveillance.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { scrollElementIntoViewOnNextFrame } from '../../core/utils/scroll.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

@Component({
  selector: 'app-exam-surveillance-page',
  imports: [ReactiveFormsModule, DecimalPipe, ChartPanelComponent],
  templateUrl: './exam-surveillance-page.component.html',
  styleUrl: './exam-surveillance-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamSurveillancePageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly examSurveillanceService = inject(ExamSurveillanceService);
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);
  private readonly workflowService = inject(WorkflowService);

  readonly activities = signal<ExamSurveillanceActivityResponse[]>([]);
  readonly summary = signal<ExamSurveillanceSummaryResponse | null>(null);
  readonly dashboardInsights = signal<PersonalDashboardResponse | null>(null);
  readonly dashboardInsightsLoading = signal(false);
  readonly dashboardInsightsError = signal('');
  readonly dashboardPeriodLabel = signal(this.defaultAcademicYear());
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly sessionNameOptions: string[] = [
    'Session Principale',
    'Session de Rattrapage'
  ];
  readonly semesterOptions: SemesterType[] = ['S1', 'S2', 'ANNUEL'];
  readonly sessionDayOptions: SurveillanceSessionDay[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  readonly semesterFilters = ['ALL', 'S1', 'S2', 'ANNUEL'] as const;
  readonly currentUserId = computed(() => this.authService.user()?.id ?? null);
  readonly currentRole = this.authService.role;
  readonly isCreatePage = this.route.snapshot.data['mode'] === 'create';
  readonly canCreate = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly isManagerDashboard = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly searchTerm = signal('');
  readonly semesterFilter = signal<(typeof this.semesterFilters)[number]>('ALL');
  readonly showActivityDashboard = signal(true);
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly selectedActivity = signal<ExamSurveillanceActivityResponse | null>(null);
  readonly editingActivityId = signal<number | null>(null);
  readonly detailSection = viewChild<ElementRef<HTMLElement>>('detailSection');
  readonly filteredActivities = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const semester = this.semesterFilter();

    return this.activities()
      .filter((activity) => {
        const matchesSemester = semester === 'ALL' || activity.semester === semester;
        const matchesTerm =
          term.length === 0 ||
          activity.sessionName.toLowerCase().includes(term) ||
          activity.teacherName.toLowerCase().includes(term) ||
          activity.academicYear.toLowerCase().includes(term);

        return matchesSemester && matchesTerm;
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
  readonly visiblePoints = computed(() =>
    this.displayedActivities().reduce((total, activity) => total + Number(activity.sessionPoints), 0)
  );
  readonly visibleAnnualCount = computed(
    () => this.displayedActivities().filter((activity) => activity.semester === 'ANNUEL').length
  );
  readonly surveillanceComparisonSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Volume total du perimetre visible et moyenne par enseignant.'
      : 'Mes surveillances vs moyenne des surveillances collegues.'
  );
  readonly surveillanceTrendSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Historique annuel des declarations de surveillance du perimetre.'
      : 'Historique de vos declarations de surveillance.'
  );
  readonly surveillanceGaugeSubtitle = computed(() =>
    this.isManagerDashboard()
      ? `Baseline enseignant: ${this.surveillanceExpectedTotal()} | Surveillances: ${this.surveillanceActualTotal()}`
      : `Groupes enseignes: ${this.surveillanceExpectedTotal()} | Surveillances: ${this.surveillanceActualTotal()}`
  );
  readonly surveillanceSemesterSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Comparaison S1/S2 des surveillances et baseline enseignant.'
      : 'Comparaison S1 et S2 des attentes vs realisations.'
  );
  readonly surveillanceExpectedTotal = computed(
    () => {
      if (this.isManagerDashboard()) {
        const stats = this.dashboardScopeSurveillanceStats();
        return stats.teacherCount;
      }
      return (this.dashboardInsights()?.taughtGroupsSemesterS1 ?? 0) + (this.dashboardInsights()?.taughtGroupsSemesterS2 ?? 0);
    }
  );
  readonly surveillanceActualTotal = computed(
    () => {
      if (this.isManagerDashboard()) {
        const stats = this.dashboardScopeSurveillanceStats();
        return stats.total;
      }
      return (this.dashboardInsights()?.surveillancesSemesterS1 ?? 0) + (this.dashboardInsights()?.surveillancesSemesterS2 ?? 0);
    }
  );
  readonly surveillanceGaugePercent = computed(() => {
    const expected = this.surveillanceExpectedTotal();
    const actual = this.surveillanceActualTotal();
    if (expected <= 0) {
      return actual > 0 ? 100 : 0;
    }
    return Math.max(0, Math.min(100, Math.round((actual / expected) * 100)));
  });
  readonly surveillanceBalanceGap = computed(() => {
    if (this.isManagerDashboard()) {
      return Math.abs(this.surveillanceActualTotal() - this.surveillanceExpectedTotal());
    }
    return this.dashboardInsights()?.surveillanceBalanceGap ?? 0;
  });
  readonly surveillanceDashboardNote = computed(() => {
    const expected = this.surveillanceExpectedTotal();
    const actual = this.surveillanceActualTotal();
    const gap = this.surveillanceBalanceGap();

    if (this.isManagerDashboard()) {
      if (actual === 0) {
        return 'Aucune declaration de surveillance disponible sur le perimetre actuel.';
      }
      if (actual >= expected) {
        return `Charge couverte au-dessus du baseline enseignant (+${actual - expected}).`;
      }
      return `Charge sous le baseline enseignant (manque ${gap}).`;
    }

    if (expected === 0 && actual === 0) {
      return 'Aucune charge de groupe detectee pour la periode active.';
    }
    if (gap === 0) {
      return 'Equilibre atteint entre groupes enseignes et surveillances.';
    }
    return `Desequilibre detecte: ecart cumule de ${gap} surveillance(s).`;
  });
  readonly surveillanceGaugeChartData = computed<ChartData<'doughnut'>>(() => {
    const expected = this.surveillanceExpectedTotal();
    const actual = this.surveillanceActualTotal();

    if (expected <= 0) {
      return {
        labels: ['Surveillances realisees'],
        datasets: [{ data: [Math.max(actual, 0)], backgroundColor: ['#dc2626'], borderWidth: 0 }]
      };
    }

    const cappedActual = Math.min(actual, expected);
    return {
      labels: ['Realise', 'Restant'],
      datasets: [
        {
          data: [cappedActual, Math.max(expected - cappedActual, 0)],
          backgroundColor: ['#dc2626', 'rgba(148, 163, 184, 0.28)'],
          borderWidth: 0
        }
      ]
    };
  });
  readonly surveillanceBySessionChartData = computed<ChartData<'bar'>>(() => {
    const totals = this.dashboardPeriodActivities().reduce<Record<string, number>>((accumulator, activity) => {
      const sessionName = (activity.sessionName ?? '').trim() || 'Session non precisee';
      accumulator[sessionName] = (accumulator[sessionName] ?? 0) + 1;
      return accumulator;
    }, {});

    const rows = Object.entries(totals).sort((left, right) => right[1] - left[1]);

    return {
      labels: rows.map(([sessionName]) => sessionName),
      datasets: [
        {
          label: 'Surveillances',
          data: rows.map(([, total]) => total),
          backgroundColor: '#1d4ed8',
          borderRadius: 8,
          maxBarThickness: 46
        }
      ]
    };
  });
  readonly surveillanceSemesterChartData = computed<ChartData<'bar'>>(() => {
    if (this.isManagerDashboard()) {
      const stats = this.dashboardScopeSurveillanceStats();
      const annualHalfFloor = Math.floor(stats.annual / 2);
      const annualHalfCeil = stats.annual - annualHalfFloor;
      return {
        labels: ['Semestre S1', 'Semestre S2'],
        datasets: [
          {
            label: 'Surveillances realisees',
            data: [stats.semesterS1 + annualHalfCeil, stats.semesterS2 + annualHalfFloor],
            backgroundColor: '#dc2626',
            borderRadius: 8
          },
          {
            label: 'Baseline enseignant',
            data: [stats.semesterS1Teachers, stats.semesterS2Teachers],
            backgroundColor: '#1d4ed8',
            borderRadius: 8
          }
        ]
      };
    }

    const insights = this.dashboardInsights();
    return {
      labels: ['Semestre S1', 'Semestre S2'],
      datasets: [
        {
          label: 'Groupes enseignes',
          data: [insights?.taughtGroupsSemesterS1 ?? 0, insights?.taughtGroupsSemesterS2 ?? 0],
          backgroundColor: '#1d4ed8',
          borderRadius: 8
        },
        {
          label: 'Surveillances realisees',
          data: [insights?.surveillancesSemesterS1 ?? 0, insights?.surveillancesSemesterS2 ?? 0],
          backgroundColor: '#dc2626',
          borderRadius: 8
        }
      ]
    };
  });
  readonly surveillanceComparisonChartData = computed<ChartData<'bar'>>(() => {
    if (this.isManagerDashboard()) {
      const stats = this.dashboardScopeSurveillanceStats();
      return {
        labels: ['Total departement', 'Moyenne / enseignant'],
        datasets: [
          {
            label: 'Declarations',
            data: [stats.total, stats.average],
            backgroundColor: ['#dc2626', '#1d4ed8'],
            borderRadius: 10,
            maxBarThickness: 56
          }
        ]
      };
    }

    const insights = this.dashboardInsights();
    return {
      labels: ['Mes surveillances', 'Moyenne collegues'],
      datasets: [
        {
          label: 'Declarations',
          data: [insights?.totalExamSurveillanceActivities ?? 0, insights?.colleagueExamSurveillanceActivitiesCount ?? 0],
          backgroundColor: ['#dc2626', '#1d4ed8'],
          borderRadius: 10,
          maxBarThickness: 56
        }
      ]
    };
  });
  readonly surveillanceTrendChartData = computed<ChartData<'line'>>(() => {
    const historyFromActivitiesMap = this.activities().reduce<Record<string, number>>((accumulator, activity) => {
      const periodKey = this.normalizeAcademicYearLabel(activity.academicYear);
      if (!periodKey) {
        return accumulator;
      }
      accumulator[periodKey] = (accumulator[periodKey] ?? 0) + 1;
      return accumulator;
    }, {});
    const historyFromActivities = Object.entries(historyFromActivitiesMap)
      .map(([periodLabel, total]) => ({ periodLabel, totalExamSurveillanceActivities: total }))
      .sort((left, right) => this.compareAcademicYears(left.periodLabel, right.periodLabel));

    const insights = this.dashboardInsights();
    const historyFromInsights = [...(insights?.yearlyPerformance ?? [])].sort((left, right) =>
      this.compareAcademicYears(left.periodLabel, right.periodLabel)
    );
    const hasUsableInsightsHistory = historyFromInsights.some(
      (entry) => Number(entry.totalExamSurveillanceActivities ?? 0) > 0
    );
    const sorted =
      hasUsableInsightsHistory || historyFromActivities.length === 0 ? historyFromInsights : historyFromActivities;

    return {
      labels: sorted.map((entry) => entry.periodLabel),
      datasets: [
        {
          label: 'Surveillances',
          data: sorted.map((entry) => Number(entry.totalExamSurveillanceActivities ?? 0)),
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.18)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
  });

  readonly createForm = this.formBuilder.nonNullable.group({
    sessionName: [this.sessionNameOptions[0], [Validators.required]],
    semester: ['S1' as SemesterType, [Validators.required]],
    sessionDay: ['LUNDI' as SurveillanceSessionDay, [Validators.required]],
    academicYear: ['2025-2026', [Validators.required]]
  });

  readonly editForm = this.formBuilder.nonNullable.group({
    sessionName: [this.sessionNameOptions[0], [Validators.required]],
    semester: ['S1' as SemesterType, [Validators.required]],
    sessionDay: ['LUNDI' as SurveillanceSessionDay, [Validators.required]],
    academicYear: ['', [Validators.required]]
  });

  constructor() {
    if (this.isCreatePage && !this.canCreate()) {
      this.router.navigateByUrl('/exam-surveillance');
      return;
    }

    if (!this.isCreatePage) {
      this.loadData();
    }
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      activities: this.examSurveillanceService.getExamSurveillanceActivities(),
      summary: this.examSurveillanceService.getSummary()
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
          this.errorMessage.set(extractErrorMessage(error, 'Impossible de charger les surveillances.'));
        }
      });
  }

  createExamSurveillance() {
    if (!this.canCreate()) {
      this.errorMessage.set('Vous ne pouvez pas ajouter une surveillance depuis ce compte.');
      return;
    }

    if (this.createForm.invalid || this.saving()) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.createForm.getRawValue();
    const points = this.pointsForDay(rawValue.sessionDay);
    const payload: CreateExamSurveillanceActivityPayload = {
      sessionName: rawValue.sessionName.trim(),
      semester: rawValue.semester,
      sessionDay: rawValue.sessionDay,
      hoursCount: points,
      academicYear: rawValue.academicYear.trim()
    };

    this.examSurveillanceService
      .createExamSurveillanceActivity(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toastService.success('Surveillance ajoutee', 'La surveillance a ete creee avec succes.');
          this.router.navigateByUrl('/exam-surveillance');
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Creation de la surveillance impossible.'));
        }
      });
  }

  canManage(activity: ExamSurveillanceActivityResponse) {
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

  canSubmit(activity: ExamSurveillanceActivityResponse) {
    const currentUserId = this.currentUserId();
    return (
      this.authService.hasAnyRole('ENSEIGNANT') &&
      currentUserId === activity.userId &&
      (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER')
    );
  }

  submitActivity(activity: ExamSurveillanceActivityResponse) {
    if (!this.canSubmit(activity)) {
      this.errorMessage.set('Vous ne pouvez pas soumettre cette surveillance.');
      return;
    }

    this.workflowService
      .submitActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(`L'activite ${activity.sessionName} a ete soumise.`);
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, 'Soumission de la surveillance impossible.'));
        }
      });
  }

  deleteExamSurveillance(activity: ExamSurveillanceActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas supprimer cette surveillance.');
      return;
    }

    if (!confirm(`Supprimer la surveillance ${activity.sessionName} ?`)) {
      return;
    }

    this.examSurveillanceService
      .deleteExamSurveillanceActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Surveillance supprimee avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, 'Suppression de la surveillance impossible.'));
        }
      });
  }

  selectActivity(activity: ExamSurveillanceActivityResponse) {
    const alreadySelected = this.selectedActivity()?.id === activity.id;
    if (alreadySelected && this.editingActivityId() !== activity.id) {
      this.selectedActivity.set(null);
      return;
    }

    this.selectedActivity.set(activity);
    if (this.editingActivityId() === activity.id) {
      this.patchEditForm(activity);
    }
    this.scrollToDetailSection();
  }

  startEditing(activity: ExamSurveillanceActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas modifier cette surveillance.');
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
    this.router.navigateByUrl('/exam-surveillance/new');
  }

  goToListPage() {
    this.router.navigateByUrl('/exam-surveillance');
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

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.editForm.getRawValue();
    const points = this.pointsForDay(rawValue.sessionDay);
    const payload: CreateExamSurveillanceActivityPayload = {
      sessionName: rawValue.sessionName.trim(),
      semester: rawValue.semester,
      sessionDay: rawValue.sessionDay,
      hoursCount: points,
      academicYear: rawValue.academicYear.trim()
    };

    this.examSurveillanceService
      .updateExamSurveillanceActivity(activity.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.editingActivityId.set(null);
          this.successMessage.set('Surveillance modifiee avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Modification de la surveillance impossible.'));
        }
      });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateSemesterFilter(value: string) {
    if (this.semesterFilters.includes(value as (typeof this.semesterFilters)[number])) {
      this.semesterFilter.set(value as (typeof this.semesterFilters)[number]);
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

  isKnownSessionName(value: string) {
    return this.sessionNameOptions.includes(value);
  }

  pointsForDay(sessionDay: SurveillanceSessionDay | null | undefined) {
    return sessionDay === 'SAMEDI' ? 2 : 1;
  }

  private compareActivitiesByRecency(first: ExamSurveillanceActivityResponse, second: ExamSurveillanceActivityResponse) {
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

  private refreshDashboardInsights(activities: ExamSurveillanceActivityResponse[]) {
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
          this.dashboardInsightsError.set("Le dashboard surveillance n'a pas pu etre charge.");
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

  private dashboardScopeSurveillanceStats() {
    const periodActivities = this.dashboardPeriodActivities();
    const teacherIds = new Set<number>();
    const s1TeacherIds = new Set<number>();
    const s2TeacherIds = new Set<number>();
    let semesterS1 = 0;
    let semesterS2 = 0;
    let annual = 0;

    for (const activity of periodActivities) {
      if (Number.isFinite(activity.userId)) {
        teacherIds.add(activity.userId);
      }

      if (activity.semester === 'S1') {
        semesterS1 += 1;
        if (Number.isFinite(activity.userId)) {
          s1TeacherIds.add(activity.userId);
        }
      } else if (activity.semester === 'S2') {
        semesterS2 += 1;
        if (Number.isFinite(activity.userId)) {
          s2TeacherIds.add(activity.userId);
        }
      } else {
        annual += 1;
        if (Number.isFinite(activity.userId)) {
          s1TeacherIds.add(activity.userId);
          s2TeacherIds.add(activity.userId);
        }
      }
    }

    const teacherCount = teacherIds.size || 1;
    const total = periodActivities.length;
    const average = teacherCount > 0 ? total / teacherCount : 0;

    return {
      total,
      teacherCount,
      average,
      semesterS1,
      semesterS2,
      annual,
      semesterS1Teachers: s1TeacherIds.size || teacherCount,
      semesterS2Teachers: s2TeacherIds.size || teacherCount
    };
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

  private defaultAcademicYear() {
    const today = new Date();
    const year = today.getFullYear();
    const startsNewAcademicYear = today.getMonth() + 1 >= 8;
    return startsNewAcademicYear ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  private scrollToDetailSection() {
    scrollElementIntoViewOnNextFrame(() => this.detailSection()?.nativeElement);
  }

  private patchEditForm(activity: ExamSurveillanceActivityResponse) {
    this.editForm.patchValue({
      sessionName: activity.sessionName,
      semester: activity.semester,
      sessionDay: activity.sessionDay,
      academicYear: activity.academicYear
    });
  }
}
