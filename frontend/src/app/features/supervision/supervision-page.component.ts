import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { PersonalDashboardResponse } from '../../core/models/dashboard.models';
import {
  CreateSupervisionActivityPayload,
  JuryRole,
  SupervisionActivityResponse,
  SupervisionStatus,
  SupervisionSummaryResponse,
  SupervisionType
} from '../../core/models/supervision.models';
import { ActivityStatus } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { SupervisionService } from '../../core/services/supervision.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { scrollElementIntoViewOnNextFrame } from '../../core/utils/scroll.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

interface SupervisionSpreadTeacherRow {
  teacherId: number;
  teacherName: string;
  academic: number;
  jury: number;
  total: number;
  spread: number;
  status: 'equilibre' | 'excedent-encadrement' | 'excedent-jury';
}

@Component({
  selector: 'app-supervision-page',
  imports: [ReactiveFormsModule, DecimalPipe, ChartPanelComponent],
  templateUrl: './supervision-page.component.html',
  styleUrl: './supervision-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupervisionPageComponent {
  private readonly pfeTypeVariants = [
    'PFE',
    'PFE_ENCADREMENT_ACADEMIQUE',
    'PFE_RAPPORTEUR',
    'PFE_PRESIDENT_JURY',
    'THESE'
  ] as const;
  private readonly listTypeOptions = ['PFE', 'SEMINAIRE', 'PI', 'APP0', 'COURS_SOUTIEN'] as const;
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly supervisionService = inject(SupervisionService);
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);
  private readonly workflowService = inject(WorkflowService);

  readonly activities = signal<SupervisionActivityResponse[]>([]);
  readonly summary = signal<SupervisionSummaryResponse | null>(null);
  readonly dashboardInsights = signal<PersonalDashboardResponse | null>(null);
  readonly dashboardInsightsLoading = signal(false);
  readonly dashboardInsightsError = signal('');
  readonly dashboardPeriodLabel = signal(this.defaultAcademicYear());
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly supervisionTypes: SupervisionType[] = [...this.listTypeOptions];
  readonly pfeRoles: JuryRole[] = ['ENCADRANT', 'RAPPORTEUR', 'PRESIDENT_JURY'];
  readonly supervisionStatuses: SupervisionStatus[] = ['EN_COURS', 'SOUTENU'];
  readonly supervisionTypeFilters = ['ALL', ...this.listTypeOptions] as const;
  readonly supervisionStatusFilters = ['ALL', 'EN_COURS', 'SOUTENU'] as const;
  readonly levelOptions = ['APP0', 'L1', 'L2', 'L3', 'M1', 'M2'];
  readonly currentUserId = computed(() => this.authService.user()?.id ?? null);
  readonly currentRole = this.authService.role;
  readonly isCreatePage = this.route.snapshot.data['mode'] === 'create';
  readonly canCreate = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly isManagerDashboard = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly showActivityDashboard = signal(true);
  readonly searchTerm = signal('');
  readonly typeFilter = signal<(typeof this.supervisionTypeFilters)[number]>('ALL');
  readonly supervisionStatusFilter = signal<(typeof this.supervisionStatusFilters)[number]>('ALL');
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly selectedActivity = signal<SupervisionActivityResponse | null>(null);
  readonly editingActivityId = signal<number | null>(null);
  readonly detailSection = viewChild<ElementRef<HTMLElement>>('detailSection');
  readonly filteredActivities = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.typeFilter();
    const status = this.supervisionStatusFilter();

    return this.activities()
      .filter((activity) => {
        const normalizedType = this.normalizeType(activity.supervisionType);
        const matchesType = type === 'ALL' || this.filterType(activity.supervisionType) === type;
        const matchesStatus = status === 'ALL' || activity.supervisionStatus === status;
        const matchesTerm =
          term.length === 0 ||
          activity.studentName.toLowerCase().includes(term) ||
          activity.studentProgram.toLowerCase().includes(term) ||
          activity.subjectTitle.toLowerCase().includes(term) ||
          activity.teacherName.toLowerCase().includes(term) ||
          this.supervisionTypeLabel(normalizedType).toLowerCase().includes(term);

        return matchesType && matchesStatus && matchesTerm;
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
  readonly visiblePfeCount = computed(
    () => this.displayedActivities().filter((activity) => this.isPfeType(activity.supervisionType)).length
  );
  readonly visiblePoints = computed(() =>
    this.displayedActivities().reduce((total, activity) => total + this.pointsForActivity(activity), 0)
  );
  readonly periodSupervisionBreakdownFromActivities = computed(() => {
    const allEntries = this.activities();
    if (allEntries.length === 0) {
      return {
        academic: 0,
        jury: 0,
        total: 0
      };
    }

    const currentPeriodKey = this.normalizeAcademicYearLabel(this.dashboardPeriodLabel());
    let entries = allEntries.filter(
      (activity) => this.normalizeAcademicYearLabel(activity.academicYear) === currentPeriodKey
    );

    if (entries.length === 0) {
      entries = allEntries;
    }

    const jury = entries.filter((activity) => this.isJurySupervisionActivity(activity)).length;
    const academic = entries.length - jury;
    const total = entries.length;

    return {
      academic,
      jury,
      total
    };
  });
  readonly supervisionBalanceBreakdown = computed(() => {
    const insights = this.dashboardInsights();
    const fallback = this.periodSupervisionBreakdownFromActivities();
    const insightsAcademic = Number(insights?.academicSupervisionsCount ?? 0);
    const insightsJury = Number(insights?.jurySupervisionsCount ?? 0);
    const insightsTotal = Number(insights?.totalSupervisions ?? 0);
    const insightsBreakdownTotal = insightsAcademic + insightsJury;
    const useFallback =
      fallback.total > 0 &&
      (insightsBreakdownTotal === 0 || (insightsTotal > 0 && Math.abs(insightsBreakdownTotal - insightsTotal) >= 2));

    const academic = useFallback ? fallback.academic : insightsAcademic;
    const jury = useFallback ? fallback.jury : insightsJury;
    const total = academic + jury;

    return {
      academic,
      jury,
      total,
      gap: Math.abs(academic - jury),
      useFallback
    };
  });
  readonly supervisionSpreadValue = computed(() => {
    const breakdown = this.supervisionBalanceBreakdown();
    return breakdown.academic - breakdown.jury;
  });
  readonly supervisionSpreadStatus = computed(() => {
    const spread = this.supervisionSpreadValue();
    if (spread === 0) {
      return 'Equilibre';
    }
    return spread > 0 ? 'Excedent encadrement' : 'Excedent jury';
  });
  readonly supervisionSpreadStatusTone = computed(() => {
    const spread = this.supervisionSpreadValue();
    if (spread === 0) {
      return 'balanced';
    }
    return spread > 0 ? 'academic' : 'jury';
  });
  readonly supervisionBalanceGap = computed(() => this.supervisionBalanceBreakdown().gap);
  readonly supervisionTypeDistribution = computed(() => {
    const entries = this.dashboardPeriodActivities();
    let pfe = 0;
    let seminaire = 0;
    let pi = 0;
    let app0 = 0;
    let coursSoutien = 0;

    for (const activity of entries) {
      const type = this.filterType(activity.supervisionType);
      switch (type) {
        case 'SEMINAIRE':
          seminaire += 1;
          break;
        case 'PI':
          pi += 1;
          break;
        case 'APP0':
          app0 += 1;
          break;
        case 'COURS_SOUTIEN':
          coursSoutien += 1;
          break;
        default:
          pfe += 1;
          break;
      }
    }

    return { pfe, seminaire, pi, app0, coursSoutien };
  });
  readonly supervisionTypeDistributionChartData = computed<ChartData<'doughnut'>>(() => {
    const distribution = this.supervisionTypeDistribution();
    return {
      labels: ['PFE', 'Seminaire', 'PI', 'APP0', 'Cours de soutien'],
      datasets: [
        {
          data: [
            distribution.pfe,
            distribution.seminaire,
            distribution.pi,
            distribution.app0,
            distribution.coursSoutien
          ],
          backgroundColor: ['#1d4ed8', '#0f766e', '#f59e0b', '#7c3aed', '#ec4899'],
          borderWidth: 0
        }
      ]
    };
  });
  readonly supervisionDashboardNote = computed(() => {
    const breakdown = this.supervisionBalanceBreakdown();
    const gap = this.supervisionBalanceGap();
    if (breakdown.total === 0) {
      return "Aucune declaration d'encadrement academique ou de jury sur la periode active.";
    }
    if (gap === 0) {
      return "Equilibre atteint entre l'encadrement academique et le jury.";
    }
    return `Desequilibre detecte: ecart de ${gap} declaration(s) entre les deux types.`;
  });
  readonly supervisionBalanceChartData = computed<ChartData<'bar'>>(() => {
    const breakdown = this.supervisionBalanceBreakdown();
    return {
      labels: ['Encadrement academique', 'Jury (rapporteur + president)'],
      datasets: [
        {
          label: 'Declarations',
          data: [breakdown.academic, breakdown.jury],
          backgroundColor: ['#1d4ed8', '#f97316'],
          borderRadius: 10,
          maxBarThickness: 60
        }
      ]
    };
  });
  readonly supervisionComparisonTitle = computed(() =>
    this.isManagerDashboard() ? 'Comparatif departement / moyenne enseignant' : 'Comparatif enseignant / moyenne collegues'
  );
  readonly supervisionComparisonSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Encadrements du perimetre visible et moyenne par enseignant.'
      : 'Encadrements declares sur la periode active (moyenne collegues).'
  );
  readonly supervisionTrendSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Tendance annuelle des encadrements du perimetre visible.'
      : 'Tendance annuelle de vos encadrements.'
  );
  readonly supervisionComparisonChartData = computed<ChartData<'bar'>>(() => {
    if (this.isManagerDashboard()) {
      const stats = this.dashboardScopeSupervisionStats();
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
      labels: ['Mes encadrements', 'Moyenne collegues'],
      datasets: [
        {
          label: 'Declarations',
          data: [insights?.totalSupervisions ?? 0, insights?.colleagueSupervisionsCount ?? 0],
          backgroundColor: ['#dc2626', '#1d4ed8'],
          borderRadius: 10,
          maxBarThickness: 56
        }
      ]
    };
  });
  readonly supervisionTrendChartData = computed<ChartData<'line'>>(() => {
    const insights = this.dashboardInsights();
    const historyFromInsights = [...(insights?.yearlyPerformance ?? [])].sort((left, right) =>
      this.compareAcademicYears(left.periodLabel, right.periodLabel)
    );
    const historyFromActivitiesMap = this.activities().reduce<Record<string, number>>((accumulator, activity) => {
      const periodKey = this.normalizeAcademicYearLabel(activity.academicYear);
      if (!periodKey) {
        return accumulator;
      }

      accumulator[periodKey] = (accumulator[periodKey] ?? 0) + 1;
      return accumulator;
    }, {});

    const historyFromActivities = Object.entries(historyFromActivitiesMap)
      .map(([periodLabel, totalSupervisions]) => ({ periodLabel, totalSupervisions }))
      .sort((left, right) => this.compareAcademicYears(left.periodLabel, right.periodLabel));

    const hasUsableInsightsHistory = historyFromInsights.some((entry) => Number(entry.totalSupervisions ?? 0) > 0);
    const sorted = hasUsableInsightsHistory || historyFromActivities.length === 0 ? historyFromInsights : historyFromActivities;

    return {
      labels: sorted.map((entry) => entry.periodLabel),
      datasets: [
        {
          label: 'Encadrements',
          data: sorted.map((entry) => Number(entry.totalSupervisions ?? 0)),
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.18)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
  });
  readonly supervisionSpreadByTeacherRows = computed<SupervisionSpreadTeacherRow[]>(() => {
    if (!this.isManagerDashboard()) {
      return [];
    }

    const grouped = new Map<string, SupervisionSpreadTeacherRow>();
    for (const activity of this.dashboardPeriodActivities()) {
      const teacherId = Number.isFinite(activity.userId) ? activity.userId : 0;
      const teacherName = (activity.teacherName ?? '').trim() || `Enseignant #${teacherId}`;
      const mapKey = `${teacherId}-${teacherName.toLowerCase()}`;
      const current = grouped.get(mapKey) ?? {
        teacherId,
        teacherName,
        academic: 0,
        jury: 0,
        total: 0,
        spread: 0,
        status: 'equilibre' as const
      };

      if (this.isJurySupervisionActivity(activity)) {
        current.jury += 1;
      } else {
        current.academic += 1;
      }

      current.total = current.academic + current.jury;
      current.spread = current.academic - current.jury;
      current.status = current.spread === 0 ? 'equilibre' : current.spread > 0 ? 'excedent-encadrement' : 'excedent-jury';
      grouped.set(mapKey, current);
    }

    return Array.from(grouped.values()).sort((left, right) => {
      const absoluteSpreadDelta = Math.abs(right.spread) - Math.abs(left.spread);
      if (absoluteSpreadDelta !== 0) {
        return absoluteSpreadDelta;
      }

      const totalDelta = right.total - left.total;
      if (totalDelta !== 0) {
        return totalDelta;
      }

      return left.teacherName.localeCompare(right.teacherName);
    });
  });
  readonly supervisionSpreadByTeacherChartData = computed<ChartData<'bar'>>(() => {
    const rows = this.supervisionSpreadByTeacherRows().slice(0, 12);
    return {
      labels: rows.map((row) => this.compactTeacherLabel(row.teacherName)),
      datasets: [
        {
          label: 'Encadrement academique',
          data: rows.map((row) => row.academic),
          backgroundColor: '#2563eb',
          borderRadius: 8,
          maxBarThickness: 24
        },
        {
          label: 'Participations jury',
          data: rows.map((row) => row.jury),
          backgroundColor: '#f97316',
          borderRadius: 8,
          maxBarThickness: 24
        }
      ]
    };
  });

  readonly createForm = this.formBuilder.nonNullable.group({
    supervisionType: ['PFE' as SupervisionType, [Validators.required]],
    pfeRole: ['ENCADRANT' as JuryRole],
    studentName: ['', [Validators.required]],
    studentProgram: ['L3', [Validators.required]],
    subjectTitle: ['', [Validators.required]],
    supervisionStatus: ['EN_COURS' as SupervisionStatus, [Validators.required]],
    quantityValue: [1],
    academicYear: ['2025-2026', [Validators.required]]
  });
  readonly editForm = this.formBuilder.nonNullable.group({
    supervisionType: ['PFE' as SupervisionType, [Validators.required]],
    pfeRole: ['ENCADRANT' as JuryRole],
    studentName: ['', [Validators.required]],
    studentProgram: ['L3', [Validators.required]],
    subjectTitle: ['', [Validators.required]],
    supervisionStatus: ['EN_COURS' as SupervisionStatus, [Validators.required]],
    quantityValue: [1],
    academicYear: ['', [Validators.required]]
  });

  constructor() {
    if (this.isCreatePage && !this.canCreate()) {
      this.router.navigateByUrl('/supervision');
      return;
    }

    this.configureDynamicValidators(this.createForm);
    this.configureDynamicValidators(this.editForm);

    if (!this.isCreatePage) {
      this.loadData();
    }
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      activities: this.supervisionService.getSupervisionActivities(),
      summary: this.supervisionService.getSummary()
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
          this.errorMessage.set(extractErrorMessage(error, 'Impossible de charger les encadrements.'));
        }
      });
  }

  createSupervision() {
    if (!this.canCreate()) {
      this.errorMessage.set('Vous ne pouvez pas ajouter un encadrement depuis ce compte.');
      return;
    }

    if (this.saving()) {
      this.errorMessage.set('Un enregistrement est deja en cours.');
      return;
    }

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.errorMessage.set(this.invalidFormMessage(this.createForm));
      this.toastService.error('Formulaire incomplet', this.invalidFormMessage(this.createForm));
      return;
    }

    const typeMessage = this.validateTypeQuantity(this.createForm.getRawValue());
    if (typeMessage) {
      this.errorMessage.set(typeMessage);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.buildPayloadFromForm(this.createForm.getRawValue());

    this.supervisionService
      .createSupervisionActivity(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toastService.success('Encadrement ajoute', "L'encadrement a ete cree avec succes.");
          this.router.navigateByUrl('/supervision');
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Creation de l'encadrement impossible."));
        }
      });
  }

  deleteSupervision(activity: SupervisionActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas supprimer cet encadrement.');
      return;
    }

    if (!confirm(`Supprimer l'encadrement de ${activity.studentName} ?`)) {
      return;
    }

    this.supervisionService
      .deleteSupervisionActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Encadrement supprime avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, "Suppression de l'encadrement impossible."));
        }
      });
  }

  submitActivity(activity: SupervisionActivityResponse) {
    if (!this.canSubmit(activity)) {
      this.errorMessage.set('Vous ne pouvez pas soumettre cet encadrement.');
      return;
    }

    this.workflowService
      .submitActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(`L'activite ${activity.studentName} a ete soumise.`);
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, "Soumission de l'encadrement impossible."));
        }
      });
  }

  canManage(activity: SupervisionActivityResponse) {
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

  canSubmit(activity: SupervisionActivityResponse) {
    const currentUserId = this.currentUserId();
    return (
      this.authService.hasAnyRole('ENSEIGNANT') &&
      currentUserId === activity.userId &&
      (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER')
    );
  }

  selectActivity(activity: SupervisionActivityResponse) {
    const current = this.selectedActivity();
    if (current?.id === activity.id) {
      this.selectedActivity.set(null);
      this.editingActivityId.set(null);
      return;
    }

    this.selectedActivity.set(activity);
    this.editingActivityId.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.scrollToDetailSection();
  }

  startEditing(activity: SupervisionActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas modifier cet encadrement.');
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
    this.router.navigateByUrl('/supervision/new');
  }

  goToListPage() {
    this.router.navigateByUrl('/supervision');
  }

  saveEdit() {
    const editingId = this.editingActivityId();
    if (!editingId) {
      this.errorMessage.set('Aucun encadrement selectionne pour la modification.');
      return;
    }

    if (this.saving()) {
      this.errorMessage.set('Un enregistrement est deja en cours.');
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.errorMessage.set(this.invalidFormMessage(this.editForm));
      this.toastService.error('Formulaire incomplet', this.invalidFormMessage(this.editForm));
      return;
    }

    const typeMessage = this.validateTypeQuantity(this.editForm.getRawValue());
    if (typeMessage) {
      this.errorMessage.set(typeMessage);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.buildPayloadFromForm(this.editForm.getRawValue());

    this.supervisionService
      .updateSupervisionActivity(editingId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.editingActivityId.set(null);
          this.successMessage.set('Encadrement modifie avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Modification de l'encadrement impossible."));
        }
      });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateTypeFilter(value: string) {
    if (this.supervisionTypeFilters.includes(value as (typeof this.supervisionTypeFilters)[number])) {
      this.typeFilter.set(value as (typeof this.supervisionTypeFilters)[number]);
    }
  }

  updateStatusFilter(value: string) {
    if (this.supervisionStatusFilters.includes(value as (typeof this.supervisionStatusFilters)[number])) {
      this.supervisionStatusFilter.set(value as (typeof this.supervisionStatusFilters)[number]);
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

  supervisionTypeLabel(type: SupervisionType | 'ALL') {
    const normalizedType = type === 'ALL' ? 'ALL' : this.normalizeType(type);
    switch (normalizedType) {
      case 'ALL':
        return 'Tous';
      case 'PFE':
      case 'PFE_ENCADREMENT_ACADEMIQUE':
        return 'PFE';
      case 'PFE_RAPPORTEUR':
        return 'PFE';
      case 'PFE_PRESIDENT_JURY':
        return 'PFE';
      case 'SEMINAIRE':
        return 'Seminaire';
      case 'PI':
        return 'PI';
      case 'APP0':
        return 'APP0';
      case 'COURS_SOUTIEN':
        return 'Cours de soutien';
      default:
        return normalizedType;
    }
  }

  supervisionStatusLabel(status: SupervisionStatus | 'ALL') {
    switch (status) {
      case 'ALL':
        return 'Tous';
      case 'SOUTENU':
        return 'Soutenu';
      default:
        return 'En cours';
    }
  }

  workflowStatusLabel(status: ActivityStatus) {
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

  workflowStatusTone(status: ActivityStatus) {
    switch (status) {
      case 'VALIDEE_DEPARTEMENT':
      case 'VALIDEE_FINALE':
        return 'approved';
      case 'SOUMISE':
        return 'pending';
      case 'A_CORRIGER':
        return 'warning';
      case 'REJETEE':
        return 'rejected';
      default:
        return 'draft';
    }
  }

  requiresQuantityInput(type: SupervisionType | null | undefined) {
    const normalizedType = this.normalizeType(type);
    return normalizedType === 'SEMINAIRE' || normalizedType === 'PI' || normalizedType === 'COURS_SOUTIEN';
  }

  isSeminarOrPiType(type: SupervisionType | null | undefined) {
    const normalizedType = this.normalizeType(type);
    return normalizedType === 'SEMINAIRE' || normalizedType === 'PI';
  }

  isSupportType(type: SupervisionType | null | undefined) {
    return this.normalizeType(type) === 'COURS_SOUTIEN';
  }

  isPfeType(type: SupervisionType | null | undefined) {
    const normalizedType = this.normalizeType(type);
    return (
      normalizedType === 'PFE_ENCADREMENT_ACADEMIQUE' ||
      normalizedType === 'PFE_RAPPORTEUR' ||
      normalizedType === 'PFE_PRESIDENT_JURY'
    );
  }

  private isJurySupervisionActivity(activity: SupervisionActivityResponse) {
    if (activity.roleInJury === 'RAPPORTEUR' || activity.roleInJury === 'PRESIDENT_JURY') {
      return true;
    }

    const normalizedType = this.normalizeType(activity.supervisionType);
    return normalizedType === 'PFE_RAPPORTEUR' || normalizedType === 'PFE_PRESIDENT_JURY';
  }

  isPfeListType(type: SupervisionType | null | undefined) {
    return this.filterType(type) === 'PFE';
  }

  pfeRoleLabel(role: JuryRole | null | undefined) {
    switch (role) {
      case 'RAPPORTEUR':
        return 'Rapporteur';
      case 'PRESIDENT_JURY':
        return 'President de jury';
      default:
        return 'Encadrement academique';
    }
  }

  pfeRoleForActivity(activity: SupervisionActivityResponse) {
    const normalizedType = this.normalizeType(activity.supervisionType);
    if (normalizedType === 'PFE_RAPPORTEUR') {
      return 'RAPPORTEUR' as JuryRole;
    }
    if (normalizedType === 'PFE_PRESIDENT_JURY') {
      return 'PRESIDENT_JURY' as JuryRole;
    }
    if (this.isPfeType(normalizedType)) {
      return 'ENCADRANT' as JuryRole;
    }
    return activity.roleInJury;
  }

  spreadTeacherStatusLabel(status: SupervisionSpreadTeacherRow['status']) {
    switch (status) {
      case 'excedent-encadrement':
        return 'Excedent encadrement';
      case 'excedent-jury':
        return 'Excedent jury';
      default:
        return 'Equilibre';
    }
  }

  pointsPreview(
    type: SupervisionType | null | undefined,
    pfeRole: JuryRole | null | undefined,
    quantityValue: number | null | undefined
  ) {
    const resolvedType = this.resolvePayloadType(type, pfeRole);
    return this.computePoints(resolvedType, Number(quantityValue ?? 1));
  }

  pointsForActivity(activity: SupervisionActivityResponse) {
    if (activity.activityPoints != null) {
      return Number(activity.activityPoints);
    }
    return this.computePoints(this.normalizeType(activity.supervisionType), Number(activity.quantityValue ?? 1));
  }

  quantityLabel(type: SupervisionType | null | undefined) {
    const normalizedType = this.normalizeType(type);
    if (normalizedType === 'COURS_SOUTIEN') {
      return "Nombre d'heures";
    }
    return 'Nombre de groupes';
  }

  quantityHint(type: SupervisionType | null | undefined) {
    const normalizedType = this.normalizeType(type);
    if (normalizedType === 'COURS_SOUTIEN') {
      return '1h = 0.5 pt';
    }
    return 'Minimum 4/an';
  }

  quantityLine(activity: SupervisionActivityResponse) {
    const normalizedType = this.normalizeType(activity.supervisionType);
    const quantity = Number(activity.quantityValue ?? 1);
    if (normalizedType === 'COURS_SOUTIEN') {
      return `${quantity} h`;
    }
    if (normalizedType === 'SEMINAIRE' || normalizedType === 'PI') {
      return `${quantity} groupe(s)`;
    }
    return 'Forfait';
  }

  private buildPayloadFromForm(rawValue: ReturnType<typeof this.createForm.getRawValue>): CreateSupervisionActivityPayload {
    const normalizedType = this.resolvePayloadType(rawValue.supervisionType, rawValue.pfeRole);
    const quantity = this.normalizeQuantityForPayload(normalizedType, Number(rawValue.quantityValue ?? 1));
    const roleInJury = this.resolvePayloadRole(rawValue.supervisionType, rawValue.pfeRole);

    return {
      supervisionType: normalizedType,
      studentName: rawValue.studentName.trim(),
      studentProgram: rawValue.studentProgram.trim(),
      subjectTitle: rawValue.subjectTitle.trim(),
      supervisionStatus: rawValue.supervisionStatus,
      roleInJury,
      quantityValue: quantity,
      academicYear: rawValue.academicYear.trim()
    };
  }

  private validateTypeQuantity(rawValue: ReturnType<typeof this.createForm.getRawValue>) {
    const normalizedType = this.normalizeType(rawValue.supervisionType);
    const quantity = Number(rawValue.quantityValue ?? 1);

    if (this.isSeminarOrPiType(normalizedType) && quantity < 4) {
      return 'Pour Seminaire et PI, la quantite doit etre superieure ou egale a 4.';
    }

    if (this.isSupportType(normalizedType) && quantity <= 0) {
      return "Le nombre d'heures doit etre strictement positif.";
    }

    return null;
  }

  private normalizeType(type: SupervisionType | null | undefined): SupervisionType {
    if (!type) {
      return 'PFE_ENCADREMENT_ACADEMIQUE';
    }

    const rawType = String(type).trim().toUpperCase();
    const normalizedRawType = rawType.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (normalizedRawType.includes('RAPPORTEUR')) {
      return 'PFE_RAPPORTEUR';
    }

    if (normalizedRawType.includes('PRESIDENT') || normalizedRawType.includes('JURY')) {
      return 'PFE_PRESIDENT_JURY';
    }

    if (normalizedRawType.includes('PFE') || normalizedRawType === 'THESE') {
      return 'PFE_ENCADREMENT_ACADEMIQUE';
    }

    if (normalizedRawType === 'MEMOIRE' || normalizedRawType === 'STAGE' || normalizedRawType === 'PI') {
      return 'PI';
    }

    if (normalizedRawType.includes('SEMINAIRE')) {
      return 'SEMINAIRE';
    }

    if (normalizedRawType === 'APP0') {
      return 'APP0';
    }

    if (normalizedRawType.includes('SOUTIEN')) {
      return 'COURS_SOUTIEN';
    }

    switch (type) {
      case 'PFE':
      case 'THESE':
        return 'PFE_ENCADREMENT_ACADEMIQUE';
      case 'MEMOIRE':
      case 'STAGE':
        return 'PI';
      default:
        return type;
    }
  }

  private filterType(type: SupervisionType | null | undefined): (typeof this.supervisionTypeFilters)[number] {
    if (!type) {
      return 'PFE';
    }

    if (this.pfeTypeVariants.includes(type as (typeof this.pfeTypeVariants)[number])) {
      return 'PFE';
    }

    if (type === 'MEMOIRE' || type === 'STAGE') {
      return 'PI';
    }

    if (type === 'SEMINAIRE' || type === 'PI' || type === 'APP0' || type === 'COURS_SOUTIEN') {
      return type;
    }

    return 'PFE';
  }

  private resolvePayloadType(type: SupervisionType | null | undefined, pfeRole: JuryRole | null | undefined): SupervisionType {
    if (this.filterType(type) === 'PFE') {
      switch (pfeRole) {
        case 'RAPPORTEUR':
          return 'PFE_RAPPORTEUR';
        case 'PRESIDENT_JURY':
          return 'PFE_PRESIDENT_JURY';
        default:
          return 'PFE_ENCADREMENT_ACADEMIQUE';
      }
    }

    return this.normalizeType(type);
  }

  private resolvePayloadRole(type: SupervisionType | null | undefined, pfeRole: JuryRole | null | undefined): JuryRole | null {
    if (this.filterType(type) === 'PFE') {
      return pfeRole ?? 'ENCADRANT';
    }
    return null;
  }

  private computePoints(type: SupervisionType, quantityValue: number) {
    const quantity = Number.isFinite(quantityValue) && quantityValue > 0 ? quantityValue : 1;

    switch (type) {
      case 'PFE_ENCADREMENT_ACADEMIQUE':
        return 25;
      case 'PFE_RAPPORTEUR':
        return 10;
      case 'PFE_PRESIDENT_JURY':
        return 5;
      case 'SEMINAIRE':
      case 'PI':
        return 10 * quantity;
      case 'APP0':
        return 5;
      case 'COURS_SOUTIEN':
        return 0.5 * quantity;
      default:
        return 25;
    }
  }

  private compareActivitiesByRecency(first: SupervisionActivityResponse, second: SupervisionActivityResponse) {
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

  private refreshDashboardInsights(activities: SupervisionActivityResponse[]) {
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
          this.dashboardInsightsError.set("Le dashboard d'encadrement n'a pas pu etre charge.");
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

  private academicYearSortKey(value: string) {
    const [firstToken] = value.split('-');
    const parsed = Number.parseInt(firstToken ?? '', 10);
    return Number.isFinite(parsed) ? parsed : Number.MIN_SAFE_INTEGER;
  }

  private dashboardScopeSupervisionStats() {
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

  private uniqueTeacherCount(activities: SupervisionActivityResponse[]) {
    const teacherIds = new Set<number>();
    for (const activity of activities) {
      if (Number.isFinite(activity.userId)) {
        teacherIds.add(activity.userId);
      }
    }
    return teacherIds.size || 1;
  }

  private defaultAcademicYear() {
    const today = new Date();
    const year = today.getFullYear();
    const startsNewAcademicYear = today.getMonth() + 1 >= 8;
    return startsNewAcademicYear ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  private normalizeQuantityForPayload(type: SupervisionType, quantityValue: number) {
    if (type === 'SEMINAIRE' || type === 'PI' || type === 'COURS_SOUTIEN') {
      const parsed = Number.isFinite(quantityValue) && quantityValue > 0 ? quantityValue : 1;
      return parsed;
    }
    return null;
  }

  private configureDynamicValidators(form: typeof this.createForm) {
    const applyValidators = () => {
      const normalizedType = this.normalizeType(form.controls.supervisionType.value);

      if (normalizedType === 'SEMINAIRE' || normalizedType === 'PI') {
        form.controls.quantityValue.setValidators([Validators.required, Validators.min(4)]);
      } else if (normalizedType === 'COURS_SOUTIEN') {
        form.controls.quantityValue.setValidators([Validators.required, Validators.min(0.5)]);
      } else {
        form.controls.quantityValue.setValidators([]);
      }

      if (this.isPfeListType(form.controls.supervisionType.value)) {
        form.controls.pfeRole.setValidators([Validators.required]);
      } else {
        form.controls.pfeRole.setValidators([]);
      }

      form.controls.quantityValue.updateValueAndValidity({ emitEvent: false });
      form.controls.pfeRole.updateValueAndValidity({ emitEvent: false });
    };

    applyValidators();

    form.controls.supervisionType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => applyValidators());
  }

  private invalidFormMessage(form: typeof this.createForm) {
    const labels: Record<keyof ReturnType<typeof form.getRawValue>, string> = {
      supervisionType: "Type d'encadrement",
      pfeRole: 'Role PFE',
      studentName: 'Etudiant',
      studentProgram: 'Niveau',
      subjectTitle: 'Titre du sujet',
      supervisionStatus: 'Statut',
      quantityValue: 'Quantite',
      academicYear: 'Annee universitaire'
    };

    const invalidEntry = Object.entries(form.controls).find(([, control]) => control.invalid);
    if (!invalidEntry) {
      return 'Veuillez verifier les informations saisies.';
    }

    const [fieldName] = invalidEntry as [keyof ReturnType<typeof form.getRawValue>, unknown];
    return `Veuillez verifier le champ "${labels[fieldName] ?? String(fieldName)}".`;
  }

  private scrollToDetailSection() {
    scrollElementIntoViewOnNextFrame(() => this.detailSection()?.nativeElement);
  }

  private patchEditForm(activity: SupervisionActivityResponse) {
    const normalizedType = this.normalizeType(activity.supervisionType);
    const formType = this.filterType(normalizedType);
    this.editForm.patchValue({
      supervisionType: formType === 'ALL' ? 'PFE' : formType,
      pfeRole: this.pfeRoleForActivity(activity),
      studentName: activity.studentName,
      studentProgram: activity.studentProgram,
      subjectTitle: activity.subjectTitle,
      supervisionStatus: activity.supervisionStatus,
      quantityValue: Number(activity.quantityValue ?? 1),
      academicYear: activity.academicYear
    });
  }

  private compactTeacherLabel(value: string) {
    const normalized = value.trim();
    if (normalized.length <= 20) {
      return normalized;
    }

    return `${normalized.slice(0, 20)}...`;
  }
}
