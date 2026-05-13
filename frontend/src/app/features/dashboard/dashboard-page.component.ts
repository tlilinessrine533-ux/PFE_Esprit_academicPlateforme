import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { catchError, forkJoin, of } from 'rxjs';
import { UserResponse } from '../../core/models/auth.models';
import { AbsenceSummaryResponse, AdministrativeEvaluationResponse } from '../../core/models/administration.models';
import { AvailabilityRequestResponse } from '../../core/models/availability.models';
import {
  AcademicYearPerformanceSnapshot,
  DashboardDepartmentBenchmarkItem,
  DashboardTeacherBenchmarkItem,
  DepartmentDashboardResponse,
  GlobalDashboardResponse,
  PersonalDashboardResponse
} from '../../core/models/dashboard.models';
import { ExamSurveillanceActivityResponse } from '../../core/models/exam-surveillance.models';
import { EventActivityResponse } from '../../core/models/event.models';
import { ReportResponse } from '../../core/models/report.models';
import { ResearchActivityResponse } from '../../core/models/research.models';
import { ActivityStatus } from '../../core/models/shared.models';
import { ResponsibilityActivityResponse } from '../../core/models/responsibility.models';
import { SupervisionActivityResponse } from '../../core/models/supervision.models';
import { TeachingActivityResponse } from '../../core/models/teaching.models';
import { AuthService } from '../../core/services/auth.service';
import { AdministrationService } from '../../core/services/administration.service';
import { AvailabilityRequestService } from '../../core/services/availability-request.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { EventService } from '../../core/services/event.service';
import { ExamSurveillanceService } from '../../core/services/exam-surveillance.service';
import { ResearchService } from '../../core/services/research.service';
import { ReportService } from '../../core/services/report.service';
import { ResponsibilityService } from '../../core/services/responsibility.service';
import { SupervisionService } from '../../core/services/supervision.service';
import { TeachingService } from '../../core/services/teaching.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { UsersService } from '../../core/services/users.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { scrollElementIntoViewOnNextFrame } from '../../core/utils/scroll.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

interface DashboardSummaryCard {
  label: string;
  value: string;
  note: string;
  icon: string;
  tone: 'brand' | 'ink' | 'soft' | 'accent';
  comparisonRows?: ScopeRow[];
  performanceGauge?: PerformanceGauge;
}

interface StrategicBenchmarkRow {
  rank: number;
  label: string;
  secondary: string;
  activities: number;
  submitted: number;
  validated: number;
  rejected: number;
  validationRate: number;
  points: number;
  hours: number;
}

type StrategicBenchmarkMetric = 'validationRate' | 'activities' | 'points' | 'hours';

interface StrategicMetricOption {
  key: StrategicBenchmarkMetric;
  label: string;
}

interface StrategicHighlightCard {
  label: string;
  value: string;
  note: string;
  tone: 'brand' | 'accent' | 'ink';
}

interface DashboardActionCard {
  label: string;
  path: string;
  hint: string;
  icon: string;
}

interface RecentActivityCard {
  id: string;
  title: string;
  description: string;
  typeLabel: string;
  shortCode: string;
  metric: string;
  statusLabel: string;
  dateLabel: string;
  updatedAt: string;
  path: string;
  tone: 'brand' | 'accent' | 'ink' | 'soft';
}

interface AdviceCard {
  title: string;
  message: string;
  tone: 'warning' | 'success' | 'info';
  path: string;
  actionLabel: string;
}

interface ScopeRow {
  label: string;
  value: string;
}

interface StatsRange {
  min: number;
  average: number;
  max: number;
}

interface DashboardOverviewSection {
  title: string;
  description: string;
  rows: ScopeRow[];
}

interface DashboardOverviewAction {
  label: string;
  path: string;
}

interface PerformanceGauge {
  bandLabel: string;
  bandTone: 'starter' | 'steady' | 'strong' | 'leader';
  userPosition: number;
  averagePosition: number;
  minValue: string;
  averageValue: string;
  maxValue: string;
}

interface DashboardSnapshot {
  submitted: number;
  validated: number;
  rejected: number;
  reports: number;
  teaching: number;
  supervisions: number;
  research: number;
  pfe: number;
  points: number;
  hoursCompleted: number;
}

interface GeneralRankTrend {
  previousPeriodLabel: string;
  deltaValue: number;
  deltaPercent: number | null;
}

interface GeneralRankBand {
  label: string;
  tone: 'low' | 'mid' | 'high' | 'top';
}

interface GlobalWorkflowSummaryItem {
  label: string;
  value: number;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
}

interface GlobalComparisonSummary {
  min: number;
  average: number;
  max: number;
  current: number;
  minPositionPercent: number;
  maxPositionPercent: number;
  currentPositionPercent: number;
  averagePositionPercent: number;
  deltaVsAverage: number;
  deltaVsMax: number;
}

interface GlobalComparisonSignal {
  label: string;
  tone: 'leader' | 'steady' | 'warning';
}

interface SuperAdminSystemAction {
  id: string;
  occurredAt: string;
  actor: string;
  action: string;
  status: 'OK' | 'ERREUR';
  detail: string;
}

interface AdminSecondaryMetric {
  label: string;
  value: string;
  tone: 'brand' | 'success' | 'warning' | 'danger' | 'ink';
}

@Component({
  selector: 'app-dashboard-page',
  imports: [ChartPanelComponent, DatePipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);
  private readonly administrationService = inject(AdministrationService);
  private readonly availabilityRequestService = inject(AvailabilityRequestService);
  private readonly teachingService = inject(TeachingService);
  private readonly supervisionService = inject(SupervisionService);
  private readonly researchService = inject(ResearchService);
  private readonly eventService = inject(EventService);
  private readonly responsibilityService = inject(ResponsibilityService);
  private readonly examSurveillanceService = inject(ExamSurveillanceService);
  private readonly usersService = inject(UsersService);
  private readonly reportService = inject(ReportService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);

  readonly periodLabel = signal('2025-2026');
  readonly strategicMetric = signal<StrategicBenchmarkMetric>('validationRate');
  readonly showHistoryExplorer = signal(false);
  readonly selectedHistoryYear = signal<string | null>(null);
  readonly selectedRankYear = signal<string | null>(null);
  readonly rankCardsAnimating = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly lastLoadedAt = signal<Date | null>(null);
  readonly personalDashboard = signal<PersonalDashboardResponse | null>(null);
  readonly departmentDashboard = signal<DepartmentDashboardResponse | null>(null);
  readonly globalDashboard = signal<GlobalDashboardResponse | null>(null);
  readonly scopedTeachingActivities = signal<TeachingActivityResponse[]>([]);
  readonly scopedSupervisionActivities = signal<SupervisionActivityResponse[]>([]);
  readonly recentActivities = signal<RecentActivityCard[]>([]);
  readonly showAllRecentActivities = signal(false);
  readonly showGlobalRecentList = signal(false);
  readonly selectedGlobalRecentActivity = signal<RecentActivityCard | null>(null);
  readonly recentActivityDetailSection = viewChild<ElementRef<HTMLElement>>('recentActivityDetailSection');
  readonly activityTotals = signal({ total: 0, pending: 0, approved: 0 });
  readonly superAdminUsers = signal<UserResponse[]>([]);
  readonly superAdminReports = signal<ReportResponse[]>([]);
  readonly superAdminSystemActions = signal<SuperAdminSystemAction[]>([]);
  readonly showAllSuperAdminSystemActions = signal(false);
  readonly adminEvaluations = signal<AdministrativeEvaluationResponse[]>([]);
  readonly adminAbsenceSummaries = signal<AbsenceSummaryResponse[]>([]);
  readonly adminLeaveRequests = signal<AvailabilityRequestResponse[]>([]);
  readonly showAllAdminCriticalCases = signal(false);
  private readonly superAdminCollapsedActionsSize = 2;
  private readonly adminCriticalCasesPreviewSize = 2;
  private readonly adminAbsenteeismReferenceDays = 220;
  private rankCardsAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  readonly user = this.authService.user;
  readonly role = this.authService.role;
  readonly isTeacherAccount = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly isAdministration = computed(() => this.authService.hasAnyRole('ADMINISTRATION', 'SUPER_ADMIN'));
  readonly isSuperAdmin = computed(() => this.authService.hasAnyRole('SUPER_ADMIN'));
  readonly isAdminRh = computed(() => this.authService.hasAnyRole('ADMINISTRATION') && !this.isSuperAdmin());
  readonly isDepartmentHead = computed(() => this.authService.hasAnyRole('CHEF_DEPARTEMENT'));
  readonly strategicMetricOptions: readonly StrategicMetricOption[] = [
    { key: 'validationRate', label: 'Taux de validation' },
    { key: 'activities', label: 'Volume activites' },
    { key: 'points', label: 'Points' },
    { key: 'hours', label: 'Heures' }
  ];
  readonly showRecentActivities = computed(() => !this.isAdministration());
  readonly canOpenHistoryExplorer = computed(
    () => this.isTeacherAccount() && this.availableAcademicYears().length > 0
  );
  readonly showGeneralRankScale = computed(
    () => !this.isAdministration() && !this.isDepartmentHead() && this.personalDashboard() != null
  );
  readonly canViewPersonal = computed(() => this.isTeacherAccount());
  readonly canViewDepartment = computed(() => this.isDepartmentHead());
  readonly canViewGlobal = computed(() => this.authService.hasAnyRole('ADMINISTRATION', 'SUPER_ADMIN'));
  readonly superAdminTotalUsers = computed(() => this.globalDashboard()?.totalUsers ?? this.superAdminUsers().length);
  readonly superAdminActiveUsers = computed(
    () => this.globalDashboard()?.totalActiveUsers ?? this.superAdminUsers().filter((user) => user.isActive).length
  );
  readonly superAdminDepartments = computed(() => this.globalDashboard()?.totalDepartments ?? 0);
  readonly superAdminRoles = computed(() => this.globalDashboard()?.totalRoles ?? 0);
  readonly superAdminErrorRate = computed(() => Number(this.globalDashboard()?.errorRatePercent ?? 0));
  readonly superAdminPlatformAvailability = computed(() => {
    const global = this.globalDashboard();
    if (!global) {
      return 0;
    }

    if (!global.platformAvailabilityPlaceholder) {
      return Number(global.platformAvailabilityPercent ?? 0);
    }

    return Math.max(0, 100 - Number(global.errorRatePercent ?? 0));
  });
  readonly superAdminUsersByRoleChartData = computed<ChartData<'bar'>>(() => {
    const global = this.globalDashboard();
    return {
      labels: ['Enseignants', 'Chef dep.', 'Administration', 'Super admin'],
      datasets: [
        {
          label: 'Utilisateurs',
          data: [
            global?.totalTeachers ?? this.superAdminUsers().filter((user) => user.role === 'ENSEIGNANT').length,
            global?.totalDepartmentHeadUsers ?? this.superAdminUsers().filter((user) => user.role === 'CHEF_DEPARTEMENT').length,
            global?.totalAdministrationUsers ?? this.superAdminUsers().filter((user) => user.role === 'ADMINISTRATION').length,
            global?.totalSuperAdminUsers ?? this.superAdminUsers().filter((user) => user.role === 'SUPER_ADMIN').length
          ],
          backgroundColor: ['#2563eb', '#f59e0b', '#ef4444', '#475569'],
          borderRadius: 10,
          maxBarThickness: 34
        }
      ]
    };
  });
  readonly superAdminSystemStatusChartData = computed<ChartData<'doughnut'>>(() => {
    const errorRate = this.superAdminErrorRate();
    const safeError = Math.min(100, Math.max(0, errorRate));
    const okRate = Math.max(0, 100 - safeError);

    return {
      labels: ['OK', 'Erreurs'],
      datasets: [
        {
          data: [okRate, safeError],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderColor: ['rgba(34, 197, 94, 0.9)', 'rgba(239, 68, 68, 0.9)'],
          borderWidth: 1
        }
      ]
    };
  });
  readonly superAdminConnectionsTrendChartData = computed<ChartData<'line'>>(() => {
    const labels = this.buildTrailingMonthLabels(6);
    const buckets = new Map(labels.map((label) => [label, 0]));

    this.superAdminUsers().forEach((user) => {
      const key = this.monthKeyFromDate(user.updatedAt);
      if (!key || !buckets.has(key)) {
        return;
      }
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Connexions estimees',
          data: labels.map((label) => buckets.get(label) ?? 0),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.16)',
          pointBackgroundColor: '#0ea5e9',
          pointRadius: 3,
          fill: true,
          tension: 0.28
        }
      ]
    };
  });
  readonly hasSuperAdminSystemActionsToggle = computed(
    () => this.superAdminSystemActions().length > this.superAdminCollapsedActionsSize
  );
  readonly superAdminSystemActionsToggleLabel = computed(() =>
    this.showAllSuperAdminSystemActions() ? 'Afficher moins' : 'Afficher toutes les actions'
  );
  readonly visibleSuperAdminSystemActions = computed(() =>
    this.showAllSuperAdminSystemActions()
      ? this.superAdminSystemActions()
      : this.superAdminSystemActions().slice(0, this.superAdminCollapsedActionsSize)
  );
  readonly adminTeacherTotal = computed(() => {
    const evaluationsCount = this.adminEvaluations().length;
    if (evaluationsCount > 0) {
      return evaluationsCount;
    }

    return Number(this.globalDashboard()?.totalTeachers ?? 0);
  });
  readonly adminEligibleBonusCount = computed(() =>
    this.adminEvaluations().filter((item) => Number(item.calculatedBonus ?? 0) > 0).length
  );
  readonly adminTotalBonusAmount = computed(() =>
    this.adminEvaluations()
      .filter((item) => item.decisionStatus === 'VALIDE')
      .reduce((sum, item) => sum + Number(item.calculatedBonus ?? 0), 0)
  );
  readonly adminAverageBonusAmount = computed(() => {
    const teachers = this.adminTeacherTotal();
    if (teachers <= 0) {
      return 0;
    }

    return this.adminTotalBonusAmount() / teachers;
  });
  readonly adminEligibleGradeCount = computed(() =>
    this.adminEvaluations().filter((item) => Number(item.calculatedPromotionPoints ?? 0) > 0).length
  );
  readonly adminValidatedDossiersCount = computed(() =>
    this.adminEvaluations().filter((item) => item.decisionStatus === 'VALIDE').length
  );
  readonly adminPendingDossiersCount = computed(() =>
    this.adminEvaluations().filter((item) => item.decisionStatus === 'EN_ATTENTE').length
  );
  readonly adminRejectedDossiersCount = computed(() =>
    this.adminEvaluations().filter((item) => item.decisionStatus === 'REJETE').length
  );
  readonly adminDossiersTotal = computed(() => this.adminEvaluations().length);
  readonly adminDossierConformityRate = computed(() => {
    const total = this.adminDossiersTotal();
    if (total <= 0) {
      return 0;
    }

    return (this.adminValidatedDossiersCount() / total) * 100;
  });
  readonly adminAveragePointsPerTeacher = computed(() => {
    const teachers = this.adminTeacherTotal();
    if (teachers <= 0) {
      return 0;
    }

    const totalPoints = this.adminEvaluations().reduce((sum, item) => sum + Number(item.validatedTeachingPoints ?? 0), 0);
    return totalPoints / teachers;
  });
  readonly adminTotalAbsenceDays = computed(() =>
    this.adminAbsenceSummaries().reduce((sum, item) => sum + Number(item.totalAbsenceDays ?? 0), 0)
  );
  readonly adminAbsenteeismRate = computed(() => {
    const teachers = this.adminTeacherTotal();
    if (teachers <= 0) {
      return 0;
    }

    const referenceDays = teachers * this.adminAbsenteeismReferenceDays;
    if (referenceDays <= 0) {
      return 0;
    }

    return Math.min(100, (this.adminTotalAbsenceDays() / referenceDays) * 100);
  });
  readonly adminPrimaryKpiCards = computed<DashboardSummaryCard[]>(() => [
    {
      label: 'Total enseignants',
      value: `${this.adminTeacherTotal()}`,
      note: 'Population RH suivie',
      icon: 'EN',
      tone: 'brand'
    },
    {
      label: 'Eligibles prime',
      value: `${this.adminEligibleBonusCount()}`,
      note: 'Dossiers avec prime calculee',
      icon: 'PR',
      tone: 'accent'
    },
    {
      label: 'Montant total primes',
      value: `${this.formatPoints(this.adminTotalBonusAmount())} DT`,
      note: 'Somme des dossiers valides',
      icon: 'DT',
      tone: 'soft'
    },
    {
      label: 'Prime moyenne',
      value: `${this.formatPoints(this.adminAverageBonusAmount())} DT`,
      note: 'Moyenne par enseignant',
      icon: 'MO',
      tone: 'ink'
    },
    {
      label: 'Eligibles grade',
      value: `${this.adminEligibleGradeCount()}`,
      note: 'Points promotion > 0',
      icon: 'GR',
      tone: 'accent'
    },
    {
      label: 'Conformite dossiers',
      value: this.formatRate(this.adminDossierConformityRate()),
      note: 'Dossiers valides / total',
      icon: 'CF',
      tone: 'brand'
    }
  ]);
  readonly adminSecondaryMetrics = computed<AdminSecondaryMetric[]>(() => [
    {
      label: 'Points moyens / enseignant',
      value: `${this.formatPoints(this.adminAveragePointsPerTeacher())} pts`,
      tone: 'brand'
    },
    {
      label: "Total jours d'absence",
      value: `${this.roundNumber(this.adminTotalAbsenceDays())}`,
      tone: 'danger'
    },
    {
      label: "Taux d'absenteisme",
      value: this.formatRate(this.adminAbsenteeismRate()),
      tone: 'warning'
    },
    {
      label: 'Dossiers valides',
      value: `${this.adminValidatedDossiersCount()}`,
      tone: 'success'
    },
    {
      label: 'Dossiers en attente',
      value: `${this.adminPendingDossiersCount()}`,
      tone: 'warning'
    }
  ]);
  readonly adminPrimeByDepartmentRows = computed(() => {
    const totals = this.adminEvaluations().reduce<Record<string, number>>((accumulator, item) => {
      const department = (item.departmentName ?? 'Non affecte').trim() || 'Non affecte';
      accumulator[department] = (accumulator[department] ?? 0) + Number(item.calculatedBonus ?? 0);
      return accumulator;
    }, {});

    return Object.entries(totals)
      .map(([department, bonus]) => ({ department, bonus }))
      .sort((left, right) => right.bonus - left.bonus)
      .slice(0, 6);
  });
  readonly adminPrimeByDepartmentChartData = computed<ChartData<'bar'>>(() => {
    const rows = this.adminPrimeByDepartmentRows();

    return {
      labels: rows.length > 0 ? rows.map((row) => this.truncateChartLabel(row.department, 28)) : ['Aucun departement'],
      datasets: [
        {
          label: 'Montant primes',
          data: rows.length > 0 ? rows.map((row) => this.roundNumber(row.bonus)) : [0],
          backgroundColor: '#2563eb',
          borderRadius: 8,
          maxBarThickness: 34
        }
      ]
    };
  });
  readonly adminPrimeByDepartmentChartOptions = computed<ChartOptions<'bar'>>(() => ({
    indexAxis: 'y',
    plugins: {
      tooltip: {
        callbacks: {
          title: (items) => {
            const first = items[0];
            if (!first) {
              return '';
            }
            return this.adminPrimeByDepartmentRows()[first.dataIndex]?.department ?? `${first.label ?? ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        ticks: {
          autoSkip: false,
          padding: 8
        }
      }
    }
  }));
  readonly adminPrimeByDepartmentChartHeight = computed(() => {
    const labels = this.adminPrimeByDepartmentChartData().labels;
    const rowsCount = Array.isArray(labels) ? labels.length : 0;
    return Math.max(280, rowsCount * 46);
  });
  readonly adminDossiersStatusChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Valides', 'En attente', 'Non conformes'],
    datasets: [
      {
        data: [
          this.adminValidatedDossiersCount(),
          this.adminPendingDossiersCount(),
          this.adminRejectedDossiersCount()
        ],
        backgroundColor: ['#16a34a', '#f59e0b', '#dc2626'],
        borderColor: ['rgba(22, 163, 74, 0.92)', 'rgba(245, 158, 11, 0.92)', 'rgba(220, 38, 38, 0.92)'],
        borderWidth: 1
      }
    ]
  }));
  readonly adminAbsencesTrendChartData = computed<ChartData<'line'>>(() => {
    const labels = this.buildTrailingMonthLabels(8);
    const totalsByMonth = new Map(labels.map((label) => [label, 0]));
    const leaveRequests = this.adminLeaveRequests().filter((item) => this.matchesPeriod(item.academicYear));

    leaveRequests.forEach((request) => {
      const monthKey = this.monthKeyFromDate(request.startDate);
      if (!monthKey || !totalsByMonth.has(monthKey)) {
        return;
      }

      totalsByMonth.set(monthKey, (totalsByMonth.get(monthKey) ?? 0) + Number(request.absenceDays ?? 0));
    });

    if (leaveRequests.length === 0) {
      const lastLabel = labels[labels.length - 1];
      if (lastLabel) {
        totalsByMonth.set(lastLabel, Number(this.adminTotalAbsenceDays() ?? 0));
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Absences (jours)",
          data: labels.map((label) => this.roundNumber(totalsByMonth.get(label) ?? 0)),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.18)',
          pointBackgroundColor: '#dc2626',
          pointRadius: 3,
          fill: true,
          tension: 0.28
        }
      ]
    };
  });
  readonly adminCriticalCases = computed(() =>
    this.adminEvaluations()
      .filter((item) => item.decisionStatus !== 'VALIDE')
      .slice()
      .sort((left, right) => {
        if (left.decisionStatus === right.decisionStatus) {
          return Number(right.calculatedBonus ?? 0) - Number(left.calculatedBonus ?? 0);
        }

        if (left.decisionStatus === 'EN_ATTENTE') {
          return -1;
        }

        if (right.decisionStatus === 'EN_ATTENTE') {
          return 1;
        }

        return 0;
      })
  );
  readonly hasAdminCriticalCasesToggle = computed(
    () => this.adminCriticalCases().length > this.adminCriticalCasesPreviewSize
  );
  readonly adminCriticalCasesToggleLabel = computed(() =>
    this.showAllAdminCriticalCases() ? 'Afficher moins' : 'Afficher toute la liste'
  );
  readonly visibleAdminCriticalCases = computed(() =>
    this.showAllAdminCriticalCases()
      ? this.adminCriticalCases()
      : this.adminCriticalCases().slice(0, this.adminCriticalCasesPreviewSize)
  );
  readonly availableAcademicYears = computed(() => this.personalDashboard()?.availableAcademicYears ?? []);
  readonly yearlyPerformanceHistory = computed<AcademicYearPerformanceSnapshot[]>(() =>
    [...(this.personalDashboard()?.yearlyPerformance ?? [])].sort((left, right) =>
      this.compareAcademicYears(left.periodLabel, right.periodLabel)
    )
  );
  readonly historyYears = computed(() =>
    [...this.yearlyPerformanceHistory()].map((entry) => entry.periodLabel).sort((left, right) =>
      this.compareAcademicYears(right, left)
    )
  );
  readonly selectedYearSnapshot = computed<AcademicYearPerformanceSnapshot | null>(() => {
    const history = this.yearlyPerformanceHistory();
    if (history.length === 0) {
      return null;
    }

    const selectedYear = this.selectedHistoryYear() ?? this.periodLabel().trim();
    return history.find((item) => item.periodLabel === selectedYear) ?? history[history.length - 1] ?? null;
  });
  readonly selectedYearVsCurrentDelta = computed<{ scoreDelta: number; activitiesDelta: number } | null>(() => {
    const selected = this.selectedYearSnapshot();
    if (!selected) {
      return null;
    }

    const currentPeriod = this.periodLabel().trim();
    if (selected.periodLabel === currentPeriod) {
      return null;
    }

    const current = this.yearlyPerformanceHistory().find((item) => item.periodLabel === currentPeriod);
    if (!current) {
      return null;
    }

    return {
      scoreDelta: Number(selected.generalScore ?? 0) - Number(current.generalScore ?? 0),
      activitiesDelta: Number(selected.totalActivities ?? 0) - Number(current.totalActivities ?? 0)
    };
  });
  readonly rankYears = computed(() =>
    [...this.yearlyPerformanceHistory()].map((entry) => entry.periodLabel).sort((left, right) =>
      this.compareAcademicYears(right, left)
    )
  );
  readonly activeRankYear = computed(() => this.selectedRankYear() ?? this.periodLabel().trim());
  readonly generalRankCurrentScore = computed(() => this.personalDashboard()?.currentGeneralScore ?? 0);
  readonly generalRankMaxScore = computed(() => this.personalDashboard()?.historicalGeneralScoreMax ?? 0);
  readonly generalRankAverageScore = computed(() => this.personalDashboard()?.historicalGeneralScoreAverage ?? 0);
  readonly generalRankMinScore = computed(() => this.personalDashboard()?.historicalGeneralScoreMin ?? 0);
  readonly generalRankHistoryCount = computed(() => this.yearlyPerformanceHistory().length);
  readonly generalRankCurrentSnapshot = computed<AcademicYearPerformanceSnapshot | null>(() => {
    const history = this.yearlyPerformanceHistory();
    if (history.length === 0) {
      return null;
    }

    const activePeriod = this.activeRankYear();
    return history.find((item) => item.periodLabel === activePeriod) ?? history[history.length - 1] ?? null;
  });
  readonly generalRankPreviousSnapshot = computed<AcademicYearPerformanceSnapshot | null>(() => {
    const history = this.yearlyPerformanceHistory();
    const current = this.generalRankCurrentSnapshot();
    if (!current) {
      return null;
    }

    const currentIndex = history.findIndex((item) => item.periodLabel === current.periodLabel);
    if (currentIndex <= 0) {
      return null;
    }

    return history[currentIndex - 1] ?? null;
  });
  readonly generalRankTrend = computed<GeneralRankTrend | null>(() => {
    const current = this.generalRankCurrentSnapshot();
    const previous = this.generalRankPreviousSnapshot();
    if (!current || !previous) {
      return null;
    }

    const deltaValue = current.generalScore - previous.generalScore;
    const deltaPercent = previous.generalScore === 0 ? null : (deltaValue / previous.generalScore) * 100;

    return {
      previousPeriodLabel: previous.periodLabel,
      deltaValue,
      deltaPercent
    };
  });
  readonly generalRankPositionPercent = computed(() => {
    const current = this.generalRankCurrentScore();
    const min = this.generalRankMinScore();
    const max = this.generalRankMaxScore();

    if (max <= min) {
      return 50;
    }

    const ratio = ((current - min) / (max - min)) * 100;
    return this.clampScalePercent(ratio);
  });
  readonly generalRankProgressWidth = computed(() => this.generalRankPositionPercent());
  readonly generalRankBand = computed<GeneralRankBand>(() => {
    const position = this.generalRankPositionPercent();
    const trendValue = this.generalRankTrend()?.deltaValue ?? 0;

    if (position >= 86) {
      return { label: 'Excellence', tone: 'top' };
    }

    if (position >= 64 && trendValue >= 0) {
      return { label: 'Tres bon niveau', tone: 'high' };
    }

    if (position >= 42) {
      return { label: 'Niveau stable', tone: 'mid' };
    }

    return { label: 'A renforcer', tone: 'low' };
  });
  readonly generalRankInsight = computed(() => {
    const years = this.generalRankHistoryCount();
    const position = this.generalRankPositionPercent();
    return `Annee active ${this.activeRankYear()} • Position ${Math.round(position)}% sur ${years} annee(s) comparee(s).`;
  });
  readonly historyTeachingChartData = computed<ChartData<'line'>>(() =>
    this.buildHistoryLineChartData('Cours', (item) => item.totalTeachingActivities, '#1d4ed8', 'rgba(29, 78, 216, 0.2)')
  );
  readonly historySupervisionChartData = computed<ChartData<'line'>>(() =>
    this.buildHistoryLineChartData('Encadrement', (item) => item.totalSupervisions, '#ea580c', 'rgba(234, 88, 12, 0.2)')
  );
  readonly historyResearchChartData = computed<ChartData<'line'>>(() =>
    this.buildHistoryLineChartData('Recherche', (item) => item.totalResearchActivities, '#7c3aed', 'rgba(124, 58, 237, 0.2)')
  );
  readonly historyEventChartData = computed<ChartData<'line'>>(() =>
    this.buildHistoryLineChartData('Evenement', (item) => item.totalEventActivities, '#dc2626', 'rgba(220, 38, 38, 0.2)')
  );
  readonly historySurveillanceChartData = computed<ChartData<'line'>>(() =>
    this.buildHistoryLineChartData(
      'Surveillance',
      (item) => item.totalExamSurveillanceActivities,
      '#0f766e',
      'rgba(15, 118, 110, 0.2)'
    )
  );
  readonly historyResponsibilityChartData = computed<ChartData<'line'>>(() =>
    this.buildHistoryLineChartData(
      'Responsabilite',
      (item) => item.totalResponsibilityActivities,
      '#0369a1',
      'rgba(3, 105, 161, 0.2)'
    )
  );
  readonly historyPartnershipChartData = computed<ChartData<'line'>>(() =>
    this.buildHistoryLineChartData(
      'Partenariat',
      (item) => item.totalPartnershipActivities,
      '#be123c',
      'rgba(190, 18, 60, 0.2)'
    )
  );
  readonly yearExplorerPerformanceChartData = computed<ChartData<'line'>>(() => {
    const history = this.yearlyPerformanceHistory();
    const selectedYear = this.selectedHistoryYear() ?? this.periodLabel().trim();

    return {
      labels: history.map((item) => item.periodLabel),
      datasets: [
        {
          label: 'Score global',
          data: history.map((item) => Number(item.generalScore ?? 0)),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.18)',
          pointBackgroundColor: history.map((item) => (item.periodLabel === selectedYear ? '#2563eb' : '#dc2626')),
          pointBorderColor: '#ffffff',
          pointRadius: history.map((item) => (item.periodLabel === selectedYear ? 5 : 3)),
          fill: true,
          tension: 0.32
        }
      ]
    };
  });
  readonly yearExplorerDistributionChartData = computed<ChartData<'bar'>>(() => {
    const snapshot = this.selectedYearSnapshot();

    return {
      labels: ['Cours', 'Encadrement', 'Recherche', 'Evenement', 'Surveillance', 'Responsabilite', 'Partenariat'],
      datasets: [
        {
          label: 'Activites',
          data: snapshot
            ? [
                snapshot.totalTeachingActivities,
                snapshot.totalSupervisions,
                snapshot.totalResearchActivities,
                snapshot.totalEventActivities,
                snapshot.totalExamSurveillanceActivities,
                snapshot.totalResponsibilityActivities,
                snapshot.totalPartnershipActivities
              ]
            : [0, 0, 0, 0, 0, 0, 0],
          borderRadius: 10,
          backgroundColor: ['#1d4ed8', '#ea580c', '#7c3aed', '#dc2626', '#0f766e', '#0369a1', '#be123c']
        }
      ]
    };
  });
  readonly dashboardSnapshot = computed<DashboardSnapshot>(() => {
    if (this.isAdministration()) {
      const global = this.globalDashboard();
      return {
        submitted: global?.totalSubmittedActivities ?? 0,
        validated: global?.totalValidatedActivities ?? 0,
        rejected: global?.totalRejectedActivities ?? 0,
        reports: global?.totalGeneratedReports ?? 0,
        teaching: global?.totalTeachingActivities ?? 0,
        supervisions: global?.totalSupervisions ?? 0,
        research: global?.totalResearchActivities ?? 0,
        pfe: global?.totalPfe ?? 0,
        points: 0,
        hoursCompleted: global?.totalCompletedHours ?? 0
      };
    }

    if (this.isDepartmentHead()) {
      const department = this.departmentDashboard();
      return {
        submitted: department?.totalSubmittedActivities ?? 0,
        validated: department?.totalValidatedActivities ?? 0,
        rejected: department?.totalRejectedActivities ?? 0,
        reports: department?.totalGeneratedReports ?? 0,
        teaching: department?.totalTeachingActivities ?? 0,
        supervisions: department?.totalSupervisions ?? 0,
        research: department?.totalResearchActivities ?? 0,
        pfe: department?.totalPfe ?? 0,
        points: 0,
        hoursCompleted: department?.totalCompletedHours ?? 0
      };
    }

    const personal = this.personalDashboard();
    return {
      submitted: personal?.totalSubmittedActivities ?? 0,
      validated: personal?.totalValidatedActivities ?? 0,
      rejected: personal?.totalRejectedActivities ?? 0,
      reports: personal?.totalGeneratedReports ?? 0,
      teaching: personal?.totalTeachingActivities ?? 0,
      supervisions: personal?.totalSupervisions ?? 0,
      research: personal?.totalResearchActivities ?? 0,
      pfe: personal?.totalPfe ?? 0,
      points: personal?.totalTeachingPerformancePoints ?? 0,
      hoursCompleted: personal?.totalCompletedHours ?? 0
    };
  });
  readonly currentPeriodTeachingActivities = computed(() => {
    const source = this.scopedTeachingActivities();
    if (source.length === 0) {
      return source;
    }

    const periodActivities = source.filter((activity) => this.matchesPeriod(activity.academicYear));
    return periodActivities.length > 0 ? periodActivities : source;
  });
  readonly teacherPendingActivities = computed(() => {
    const personal = this.personalDashboard();
    const totalDeclared = Number(personal?.totalDeclaredActivities ?? 0);
    const validated = Number(personal?.totalValidatedActivities ?? 0);
    const rejected = Number(personal?.totalRejectedActivities ?? 0);
    return Math.max(0, totalDeclared - validated - rejected);
  });
  readonly teacherSpreadSummary = computed(() => {
    const personal = this.personalDashboard();
    const insightsAcademic = Number(personal?.academicSupervisionsCount ?? 0);
    const insightsJury = Number(personal?.jurySupervisionsCount ?? 0);
    const source = this.scopedSupervisionActivities();
    const periodActivities = source.filter((activity) => this.matchesPeriod(activity.academicYear));
    const relevantActivities = periodActivities.length > 0 ? periodActivities : source;
    const fallbackJury = relevantActivities.filter((activity) => this.isJurySupervisionActivity(activity)).length;
    const fallbackAcademic = Math.max(0, relevantActivities.length - fallbackJury);
    const useFallback = relevantActivities.length > 0 && insightsAcademic + insightsJury === 0;
    const academic = useFallback ? fallbackAcademic : insightsAcademic;
    const jury = useFallback ? fallbackJury : insightsJury;
    const spread = academic - jury;

    return {
      academic,
      jury,
      spread,
      total: academic + jury,
      status:
        spread === 0
          ? 'Equilibre'
          : spread > 0
            ? 'Excedent encadrement'
            : 'Excedent jury'
    };
  });
  readonly departmentSpreadSummary = computed(() => {
    const source = this.scopedSupervisionActivities();
    const periodActivities = source.filter((activity) => this.matchesPeriod(activity.academicYear));
    const relevantActivities = periodActivities.length > 0 ? periodActivities : source;
    const jury = relevantActivities.filter((activity) => this.isJurySupervisionActivity(activity)).length;
    const academic = Math.max(0, relevantActivities.length - jury);
    const spread = academic - jury;

    return {
      academic,
      jury,
      spread,
      total: academic + jury,
      status:
        spread === 0
          ? 'Equilibre'
          : spread > 0
            ? 'Excedent encadrement'
            : 'Excedent jury'
    };
  });
  readonly teacherWorkflowPieChartData = computed<ChartData<'pie'>>(() => {
    const personal = this.personalDashboard();
    const validated = Number(personal?.totalValidatedActivities ?? 0);
    const rejected = Number(personal?.totalRejectedActivities ?? 0);
    const pending = this.teacherPendingActivities();
    return {
      labels: ['Validees', 'Rejetees', 'En attente'],
      datasets: [
        {
          data: [validated, rejected, pending],
          backgroundColor: ['#16a34a', '#dc2626', '#f59e0b'],
          borderColor: ['rgba(22, 163, 74, 0.92)', 'rgba(220, 38, 38, 0.92)', 'rgba(245, 158, 11, 0.92)'],
          borderWidth: 1
        }
      ]
    };
  });
  readonly teacherSupervisionSpreadChartData = computed<ChartData<'bar'>>(() => {
    const spread = this.teacherSpreadSummary();
    return {
      labels: ['Encadrements academiques', 'Participations jury'],
      datasets: [
        {
          label: 'Declarations',
          data: [spread.academic, spread.jury],
          borderRadius: 10,
          maxBarThickness: 46,
          backgroundColor: ['#2563eb', '#f97316']
        }
      ]
    };
  });
  readonly teacherHoursBySemesterChartData = computed<ChartData<'bar'>>(() => {
    const activities = this.currentPeriodTeachingActivities();
    const totals = { S1: 0, S2: 0, ANNUEL: 0 };
    for (const activity of activities) {
      const semester = activity.semester === 'S1' || activity.semester === 'S2' ? activity.semester : 'ANNUEL';
      totals[semester] += Number(activity.completedHours ?? 0);
    }

    return {
      labels: ['S1', 'S2', 'Annuel'],
      datasets: [
        {
          label: "Heures d'enseignement",
          data: [this.roundNumber(totals.S1), this.roundNumber(totals.S2), this.roundNumber(totals.ANNUEL)],
          borderRadius: 10,
          maxBarThickness: 46,
          backgroundColor: ['#1d4ed8', '#7c3aed', '#0f766e']
        }
      ]
    };
  });
  readonly teacherPerformanceRadarChartData = computed<ChartData<'radar'>>(() => {
    const personal = this.personalDashboard();
    const spreadSummary = this.teacherSpreadSummary();
    const plannedHours = Number(personal?.totalPlannedHours ?? 0);
    const completedHours = Number(personal?.totalCompletedHours ?? 0);
    const completionRate = plannedHours > 0 ? (completedHours / plannedHours) * 100 : 0;
    const validationRate = Number(personal?.validationRatePercent ?? 0);
    const researchScore = Math.min(100, Number(personal?.totalResearchActivities ?? 0) * 14);
    const responsibilityScore = Math.min(100, Number(personal?.totalResponsibilityActivities ?? 0) * 18);
    const eventScore = Math.min(100, Number(personal?.totalEventActivities ?? 0) * 18);
    const spreadBalanceScore = Math.max(0, 100 - Math.abs(spreadSummary.spread) * 20);

    return {
      labels: ['Validation', 'Charge horaire', 'Recherche', 'Responsabilites', 'Evenements', 'Equilibre E/J'],
      datasets: [
        {
          label: 'Performance globale (%)',
          data: [
            this.clampZeroToHundred(validationRate),
            this.clampZeroToHundred(completionRate),
            this.clampZeroToHundred(researchScore),
            this.clampZeroToHundred(responsibilityScore),
            this.clampZeroToHundred(eventScore),
            this.clampZeroToHundred(spreadBalanceScore)
          ],
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.24)',
          pointBackgroundColor: '#dc2626',
          pointBorderColor: '#ffffff',
          pointRadius: 3,
          fill: true
        }
      ]
    };
  });
  readonly teacherPerformanceRadarChartOptions = computed<ChartOptions<'radar'>>(() => ({
    scales: {
      r: {
        suggestedMax: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  }));
  readonly workflowChartTitle = computed(() => {
    if (this.isAdministration()) {
      return 'Workflow institutionnel';
    }

    if (this.isDepartmentHead()) {
      return 'Workflow departemental';
    }

    return 'Workflow personnel';
  });
  readonly productionChartTitle = computed(() => {
    if (this.isAdministration()) {
      return 'Synthese globale institutionnelle';
    }

    if (this.isDepartmentHead()) {
      return 'Synthese globale departementale';
    }

    return 'Synthese globale personnelle';
  });
  readonly workflowChartData = computed<ChartData<'doughnut'>>(() => {
    const snapshot = this.dashboardSnapshot();
    return {
      labels: ['Soumis', 'Valides', 'Rejetes'],
      datasets: [
        {
          data: [snapshot.submitted, snapshot.validated, snapshot.rejected],
          backgroundColor: ['#f59e0b', '#22c55e', '#ef4444'],
          borderColor: ['rgba(245, 158, 11, 0.92)', 'rgba(34, 197, 94, 0.92)', 'rgba(239, 68, 68, 0.92)'],
          borderWidth: 1,
          hoverOffset: 10
        }
      ]
    };
  });
  readonly productionChartData = computed<ChartData<'bar'>>(() => {
    const snapshot = this.dashboardSnapshot();
    const teacherPending = this.teacherPendingActivities();
    const departmentPending = this.departmentDashboard()?.totalPendingActivities ?? 0;
    const genericPending = Math.max(0, snapshot.submitted - snapshot.validated - snapshot.rejected);
    const pending = this.isTeacherAccount()
      ? teacherPending
      : this.isDepartmentHead()
        ? departmentPending
        : genericPending;

    return {
      labels: ['Activites globales', 'Dossiers soumis', 'En attente', 'Rapports'],
      datasets: [
        {
          label: 'Synthese',
          data: [
            Math.max(0, snapshot.validated + snapshot.rejected + pending),
            snapshot.submitted,
            pending,
            snapshot.reports
          ],
          borderRadius: 10,
          maxBarThickness: 34,
          backgroundColor: ['#1d4ed8', '#f59e0b', '#7c3aed', '#0369a1']
        }
      ]
    };
  });
  readonly performanceChartData = computed<ChartData<'line'>>(() => {
    const snapshot = this.dashboardSnapshot();
    const isTeacher = this.isTeacherAccount();
    return {
      labels: isTeacher
        ? ['Points', 'Heures realisees', 'Dossiers valides', 'Rapports']
        : ['Heures realisees', 'Dossiers soumis', 'Dossiers valides', 'Rapports'],
      datasets: [
        {
          label: 'Performance',
          data: isTeacher
            ? [snapshot.points, snapshot.hoursCompleted, snapshot.validated, snapshot.reports]
            : [snapshot.hoursCompleted, snapshot.submitted, snapshot.validated, snapshot.reports],
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          pointBackgroundColor: '#dc2626',
          pointBorderColor: '#ffffff',
          pointRadius: 4,
          fill: true,
          tension: 0.35
        }
      ]
    };
  });
  readonly teacherDepartmentComparisonChartData = computed<ChartData<'bar'>>(() => {
    const personal = this.personalDashboard();
    return {
      labels: ['Min dep.', 'Moy dep.', 'Mes points', 'Max dep.'],
      datasets: [
        {
          label: 'Points enseignement',
          data: [
            Number(personal?.departmentTeachingPointsMin ?? 0),
            Number(personal?.departmentTeachingPointsAverage ?? 0),
            Number(personal?.totalTeachingPerformancePoints ?? 0),
            Number(personal?.departmentTeachingPointsMax ?? 0)
          ],
          borderRadius: 9,
          maxBarThickness: 34,
          backgroundColor: ['#64748b', '#2563eb', '#dc2626', '#16a34a']
        }
      ]
    };
  });
  readonly superAdminRoleDistributionChartData = computed<ChartData<'doughnut'>>(() => {
    const global = this.globalDashboard();
    return {
      labels: ['Enseignants', 'Chefs dep.', 'Administration', 'Super Admin'],
      datasets: [
        {
          data: [
            Number(global?.totalTeachers ?? 0),
            Number(global?.totalDepartmentHeadUsers ?? 0),
            Number(global?.totalAdministrationUsers ?? 0),
            Number(global?.totalSuperAdminUsers ?? 0)
          ],
          backgroundColor: ['#2563eb', '#f59e0b', '#dc2626', '#16a34a'],
          borderWidth: 1
        }
      ]
    };
  });
  readonly superAdminOpsChartData = computed<ChartData<'bar'>>(() => {
    const global = this.globalDashboard();
    return {
      labels: ['Erreur %', 'Comptes inactifs', 'Incidents', 'Config modifiee'],
      datasets: [
        {
          label: 'Indicateurs',
          data: [
            Number(global?.errorRatePercent ?? 0),
            Number(global?.totalDisabledUsers ?? 0),
            Number(global?.totalAdministrativeIncidents ?? 0),
            Number(global?.totalConfigurationChanges ?? 0)
          ],
          borderRadius: 9,
          maxBarThickness: 34,
          backgroundColor: ['#dc2626', '#1d4ed8', '#f59e0b', '#16a34a']
        }
      ]
    };
  });
  readonly teacherKpiActivityChartData = computed<ChartData<'bar'>>(() => {
    const personal = this.personalDashboard();
    return {
      labels: [
        'Declarees',
        'Validees',
        'Rejetees',
        'Encad. acad.',
        'Jurys',
        'Spread E/J',
        'Recherche',
        'Responsabilites',
        'Surveillances',
        'Evenements',
        'Absences'
      ],
      datasets: [
        {
          label: 'KPIs activites enseignant',
          data: [
            Number(personal?.totalDeclaredActivities ?? 0),
            Number(personal?.totalValidatedActivities ?? 0),
            Number(personal?.totalRejectedActivities ?? 0),
            Number(personal?.academicSupervisionsCount ?? 0),
            Number(personal?.jurySupervisionsCount ?? 0),
            this.teacherSpreadSummary().spread,
            Number(personal?.totalResearchActivities ?? 0),
            Number(personal?.totalResponsibilityActivities ?? 0),
            Number(personal?.totalExamSurveillanceActivities ?? 0),
            Number(personal?.totalEventActivities ?? 0),
            Number(personal?.absenceDays ?? 0)
          ],
          borderRadius: 8,
          maxBarThickness: 32,
          backgroundColor: [
            '#2563eb',
            '#16a34a',
            '#dc2626',
            '#1d4ed8',
            '#f97316',
            '#ea580c',
            '#7c3aed',
            '#0f766e',
            '#0369a1',
            '#f59e0b',
            '#475569'
          ]
        }
      ]
    };
  });
  readonly departmentKpiOverviewChartData = computed<ChartData<'bar'>>(() => {
    const department = this.departmentDashboard();
    return {
      labels: [
        'Enseignants',
        'Soumises',
        'Validees',
        'Rejetees',
        'En attente',
        'Rapports',
        'Absences moy.',
        'Pts moy.'
      ],
      datasets: [
        {
          label: 'KPIs departement',
          data: [
            Number(department?.totalTeachers ?? 0),
            Number(department?.totalSubmittedActivities ?? 0),
            Number(department?.totalValidatedActivities ?? 0),
            Number(department?.totalRejectedActivities ?? 0),
            Number(department?.totalPendingActivities ?? 0),
            Number(department?.totalGeneratedReports ?? 0),
            Number(department?.averageAbsenceDays ?? 0),
            Number(department?.averagePointsPerTeacher ?? 0)
          ],
          borderRadius: 8,
          maxBarThickness: 32,
          backgroundColor: ['#1d4ed8', '#f59e0b', '#16a34a', '#dc2626', '#7c3aed', '#0369a1', '#64748b', '#be123c']
        }
      ]
    };
  });
  readonly globalKpiOverviewChartData = computed<ChartData<'bar'>>(() => {
    const global = this.globalDashboard();
    return {
      labels: ['Utilisateurs', 'Actifs', 'Desactives', 'Departements', 'Roles', 'Incidents', 'Config chg.'],
      datasets: [
        {
          label: 'KPIs globaux',
          data: [
            Number(global?.totalUsers ?? 0),
            Number(global?.totalActiveUsers ?? 0),
            Number(global?.totalDisabledUsers ?? 0),
            Number(global?.totalDepartments ?? 0),
            Number(global?.totalRoles ?? 0),
            Number(global?.totalAdministrativeIncidents ?? 0),
            Number(global?.totalConfigurationChanges ?? 0)
          ],
          borderRadius: 8,
          maxBarThickness: 32,
          backgroundColor: ['#1d4ed8', '#16a34a', '#dc2626', '#7c3aed', '#0369a1', '#ea580c', '#be123c']
        }
      ]
    };
  });
  readonly teacherKpiActivityChartOptions = computed<ChartOptions<'bar'>>(() => ({
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } }
  }));
  readonly departmentKpiOverviewChartOptions = computed<ChartOptions<'bar'>>(() => ({
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } }
  }));
  readonly globalKpiOverviewChartOptions = computed<ChartOptions<'bar'>>(() => ({
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } }
  }));
  readonly showStrategicInsights = computed(() => this.isAdministration() || this.isDepartmentHead());
  readonly strategicMixChartTitle = computed(() =>
    this.isAdministration() ? 'Mix multi-activites institutionnel' : 'Mix multi-activites departemental'
  );
  readonly strategicTrendChartTitle = computed(() =>
    this.isAdministration() ? 'Tendance mensuelle institutionnelle' : 'Tendance mensuelle departementale'
  );
  readonly strategicBenchmarkChartTitle = computed(() =>
    `${this.isAdministration() ? 'Comparatif performance departements' : 'Comparatif performance enseignants'} • ${
      this.strategicBenchmarkChartMetricLabel()
    }`
  );
  readonly strategicBenchmarkTableTitle = computed(() =>
    this.isAdministration() ? 'Classement des departements' : 'Classement des enseignants'
  );
  readonly strategicEntityHeader = computed(() => (this.isAdministration() ? 'Departement' : 'Enseignant'));
  readonly strategicActivityMixChartData = computed<ChartData<'doughnut'>>(() => {
    const breakdown = this.isAdministration()
      ? (this.globalDashboard()?.activityBreakdown ?? [])
      : (this.departmentDashboard()?.activityBreakdown ?? []);

    const labels = breakdown.map((item) => item.label);
    const values = breakdown.map((item) => Number(item.total ?? 0));

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#1d4ed8', '#ea580c', '#7c3aed', '#dc2626', '#0f766e', '#0369a1', '#f59e0b'],
          borderColor: [
            'rgba(29, 78, 216, 0.92)',
            'rgba(234, 88, 12, 0.92)',
            'rgba(124, 58, 237, 0.92)',
            'rgba(220, 38, 38, 0.92)',
            'rgba(15, 118, 110, 0.92)',
            'rgba(3, 105, 161, 0.92)',
            'rgba(245, 158, 11, 0.92)'
          ],
          borderWidth: 1
        }
      ]
    };
  });
  readonly strategicTrendChartData = computed<ChartData<'line'>>(() => {
    const trend = this.isAdministration()
      ? (this.globalDashboard()?.monthlyTrend ?? [])
      : (this.departmentDashboard()?.monthlyTrend ?? []);

    return {
      labels: trend.map((point) => point.monthLabel),
      datasets: [
        {
          label: 'Total',
          data: trend.map((point) => Number(point.totalActivities ?? 0)),
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(29, 78, 216, 0.16)',
          pointBackgroundColor: '#1d4ed8',
          pointRadius: 3,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Valides',
          data: trend.map((point) => Number(point.validatedActivities ?? 0)),
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.16)',
          pointBackgroundColor: '#16a34a',
          pointRadius: 3,
          fill: false,
          tension: 0.3
        },
        {
          label: 'Rejetes',
          data: trend.map((point) => Number(point.rejectedActivities ?? 0)),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.16)',
          pointBackgroundColor: '#dc2626',
          pointRadius: 3,
          fill: false,
          tension: 0.3
        }
      ]
    };
  });
  readonly strategicBenchmarkRows = computed<StrategicBenchmarkRow[]>(() => {
    if (this.isAdministration()) {
      const rows = this.globalDashboard()?.departmentBenchmark ?? [];
      return rows.map((item: DashboardDepartmentBenchmarkItem, index) => ({
        rank: index + 1,
        label: item.departmentName,
        secondary: `${item.totalTeachers} enseignant(s)`,
        activities: Number(item.totalActivities ?? 0),
        submitted: Number(item.totalSubmittedActivities ?? 0),
        validated: Number(item.totalValidatedActivities ?? 0),
        rejected: Number(item.totalRejectedActivities ?? 0),
        validationRate: Number(item.validationRatePercent ?? 0),
        points: Number(item.totalTeachingPerformancePoints ?? 0),
        hours: Number(item.totalCompletedHours ?? 0)
      }));
    }

    const rows = this.departmentDashboard()?.teacherBenchmark ?? [];
    return rows.map((item: DashboardTeacherBenchmarkItem, index) => ({
      rank: index + 1,
      label: item.teacherName,
      secondary: `${item.totalTeachingActivities} cours • ${item.totalPartnershipActivities} partenariat(s)`,
      activities: Number(item.totalActivities ?? 0),
      submitted: Number(item.totalSubmittedActivities ?? 0),
      validated: Number(item.totalValidatedActivities ?? 0),
      rejected: Number(item.totalRejectedActivities ?? 0),
      validationRate: Number(item.validationRatePercent ?? 0),
      points: Number(item.totalTeachingPerformancePoints ?? 0),
      hours: Number(item.totalCompletedHours ?? 0)
    }));
  });
  readonly strategicBenchmarkVisibleRows = computed(() =>
    this.strategicBenchmarkRows().slice(0, this.isDepartmentHead() ? 5 : 8)
  );
  readonly strategicBenchmarkChartMetricLabel = computed(
    () =>
      this.strategicMetricOptions.find((option) => option.key === this.strategicMetric())?.label
      ?? 'Taux de validation'
  );
  readonly strategicBenchmarkChartSubtitle = computed(() => {
    const metricLabel = this.strategicBenchmarkChartMetricLabel();
    if (this.strategicBenchmarkVisibleRows().length === 0) {
      return `Aucune entite disponible pour ${metricLabel.toLowerCase()}.`;
    }

    return `Top ${this.strategicBenchmarkVisibleRows().length} entites • lecture par ${metricLabel.toLowerCase()}.`;
  });
  readonly strategicBenchmarkChartData = computed<ChartData<'bar'>>(() => {
    const metric = this.strategicMetric();
    const rows = this.strategicBenchmarkVisibleRows();
    const values = rows.map((row) => this.strategicMetricValue(row, metric));
    const minimum = values.length > 0 ? Math.min(...values) : 0;
    const maximum = values.length > 0 ? Math.max(...values) : 0;

    return {
      labels: rows.map((row) => `#${row.rank} ${this.benchmarkAxisLabel(row.label)}`),
      datasets: [
        {
          label: this.strategicBenchmarkChartMetricLabel(),
          data: values.map((value) => this.roundNumber(value)),
          borderRadius: 8,
          maxBarThickness: 34,
          backgroundColor: rows.map((row) =>
            this.strategicMetricColor(this.strategicMetricValue(row, metric), metric, minimum, maximum)
          )
        }
      ]
    };
  });
  readonly strategicBenchmarkChartOptions = computed<ChartOptions<'bar'>>(() => {
    const metric = this.strategicMetric();
    const rows = this.strategicBenchmarkVisibleRows();
    const values = rows.map((row) => this.strategicMetricValue(row, metric));
    const maximum = values.length > 0 ? Math.max(...values) : 0;
    const suggestedMax = metric === 'validationRate' ? 100 : Math.max(1, this.roundNumber(maximum * 1.15));

    return {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax,
          ticks: {
            callback: (value) => this.formatStrategicMetricTick(Number(value), metric)
          }
        },
        y: {
          ticks: {
            autoSkip: false
          },
          grid: {
            display: false
          }
        }
      }
    };
  });
  readonly strategicBenchmarkChartHeight = computed(() => {
    const rowCount = this.strategicBenchmarkVisibleRows().length;
    return Math.min(420, Math.max(260, 140 + rowCount * 30));
  });
  readonly strategicHighlightCards = computed<StrategicHighlightCard[]>(() => {
    const rows = this.strategicBenchmarkVisibleRows();
    if (rows.length === 0) {
      return [];
    }

    const topRow = rows[0];
    const bottomRow = rows[rows.length - 1];
    const metric = this.strategicMetric();
    const topValue = this.strategicMetricValue(topRow, metric);
    const bottomValue = this.strategicMetricValue(bottomRow, metric);
    const metricGap = Math.max(0, topValue - bottomValue);

    return [
      {
        label: this.isAdministration() ? 'Leader departement' : 'Leader enseignant',
        value: topRow.label,
        note: `${this.strategicBenchmarkChartMetricLabel()} : ${this.formatStrategicMetricValue(topValue, metric)}`,
        tone: 'brand'
      },
      {
        label: this.isAdministration() ? 'Departement a suivre' : 'Enseignant a suivre',
        value: bottomRow.label,
        note: `${this.strategicBenchmarkChartMetricLabel()} : ${this.formatStrategicMetricValue(bottomValue, metric)}`,
        tone: 'accent'
      },
      {
        label: 'Ecart leader / dernier',
        value: this.formatStrategicMetricValue(metricGap, metric),
        note: `Periode ${this.periodLabel()} • ${rows.length} entite(s) comparee(s)`,
        tone: 'ink'
      }
    ];
  });
  readonly lastUpdatedLabel = computed(() => {
    const value = this.lastLoadedAt();
    if (!value) {
      return '';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(value);
  });
  readonly liveInsight = computed(() => {
    if (this.loading()) {
      return 'Actualisation en cours des indicateurs.';
    }

    if (this.isAdministration()) {
      const global = this.globalDashboard();
      if (this.isSuperAdmin()) {
        return `${global?.totalActiveUsers ?? 0} compte(s) actifs, ${global?.totalAdministrativeIncidents ?? 0} incident(s) derives.`;
      }
      return `${global?.totalSubmittedActivities ?? 0} dossiers actuellement suivis au niveau institutionnel.`;
    }

    if (this.isDepartmentHead()) {
      const department = this.departmentDashboard();
      return `${department?.totalTeachers ?? 0} enseignant(s) dans le perimetre departemental visible.`;
    }

    const totals = this.activityTotals();
    return `${totals.total} activite(s) visibles dans votre espace cette annee.`;
  });

  readonly roleTitle = computed(() => {
    switch (this.role()) {
      case 'CHEF_DEPARTEMENT':
        return 'Pilotage departemental';
      case 'ADMINISTRATION':
        return 'Pilotage administratif';
      case 'SUPER_ADMIN':
        return 'Pilotage super admin';
      default:
        return 'Espace enseignant';
    }
  });
  readonly topbarContextLabel = computed(() => {
    if (this.isAdministration()) {
      if (this.isSuperAdmin()) {
        return 'Vision globale des utilisateurs, incidents et configuration plateforme avec supervision institutionnelle.';
      }
      return 'Vision transversale des departements et pilotage final des validations.';
    }

    if (this.isDepartmentHead()) {
      return 'Suivi detaille du departement, arbitrage des validations et priorites operationnelles.';
    }

    return 'Suivi personnel des activites, de la performance et des validations.';
  });

  readonly overviewTitle = computed(() => {
    switch (this.role()) {
      case 'CHEF_DEPARTEMENT':
        return 'Synthese departementale';
      case 'ADMINISTRATION':
      case 'SUPER_ADMIN':
        return 'Synthese institutionnelle';
      default:
        return 'Synthese annuelle';
    }
  });

  readonly overviewAction = computed<DashboardOverviewAction>(() => {
    switch (this.role()) {
      case 'CHEF_DEPARTEMENT':
        return { label: 'Ouvrir le workflow', path: '/workflow' };
      case 'ADMINISTRATION':
      case 'SUPER_ADMIN':
        return { label: 'Consulter les rapports', path: '/reports' };
      default:
        return { label: 'Voir mon rapport', path: '/reports' };
    }
  });
  readonly showAllOverviewSections = signal(false);

  readonly overviewSections = computed<DashboardOverviewSection[]>(() => {
    const personal = this.personalDashboard();
    const department = this.departmentDashboard();
    const global = this.globalDashboard();

    switch (this.role()) {
      case 'CHEF_DEPARTEMENT':
        return [
          {
            title: 'Perimetre departemental',
            description: 'Le cadre humain et organisationnel du departement sur la periode choisie.',
            rows: [
              { label: 'Departement', value: department?.departmentName ?? '-' },
              { label: 'Utilisateurs', value: `${department?.totalUsers ?? 0}` },
              { label: 'Enseignants', value: `${department?.totalTeachers ?? 0}` }
            ]
          },
          {
            title: 'Workflow global',
            description: 'Le traitement global des dossiers departementaux sur la periode active.',
            rows: [
              { label: 'Activites globales', value: `${department?.totalActivities ?? 0}` },
              { label: 'Dossiers soumis', value: `${department?.totalSubmittedActivities ?? 0}` },
              { label: 'Dossiers valides', value: `${department?.totalValidatedActivities ?? 0}` },
              { label: 'Dossiers rejetes', value: `${department?.totalRejectedActivities ?? 0}` },
              { label: 'Dossiers en attente', value: `${department?.totalPendingActivities ?? 0}` },
              { label: 'Taux de validation', value: this.formatRate(department?.validationRatePercent ?? 0) }
            ]
          },
          {
            title: 'Performance transversale',
            description: 'Les indicateurs transversaux qui ne sont pas detaillees dans les pages activites.',
            rows: [
              {
                label: 'Delai moyen de validation',
                value: `${this.formatHours(department?.averageValidationDelayDays ?? 0)} jour(s)`
              },
              { label: 'Points moyens / enseignant', value: `${this.formatPoints(department?.averagePointsPerTeacher ?? 0)} pts` },
              { label: 'Meilleur score enseignant', value: `${this.formatPoints(department?.bestTeacherScore ?? 0)} pts` },
              { label: 'Absences moyennes', value: `${this.formatHours(department?.averageAbsenceDays ?? 0)} jour(s)` },
              { label: "Taux d'activite global", value: `${this.formatHours(department?.departmentActivityRate ?? 0)} act./ens.` },
              { label: 'Heures consolidees', value: `${this.formatHours(department?.totalCompletedHours ?? 0)} h` },
              { label: 'Rapports generes', value: `${department?.totalGeneratedReports ?? 0}` }
            ]
          }
        ];
      case 'ADMINISTRATION':
      case 'SUPER_ADMIN':
        if (this.isSuperAdmin()) {
          return [
            {
              title: 'Structure institutionnelle',
              description: 'Perimetre global des comptes et des departements.',
              rows: [
                { label: 'Departements', value: `${global?.totalDepartments ?? 0}` },
                { label: 'Utilisateurs', value: `${global?.totalUsers ?? 0}` },
                { label: 'Utilisateurs actifs', value: `${global?.totalActiveUsers ?? 0}` },
                { label: 'Comptes desactives', value: `${global?.totalDisabledUsers ?? 0}` },
                {
                  label: 'Repartition roles',
                  value: `ENS ${global?.totalTeachers ?? 0} • CD ${global?.totalDepartmentHeadUsers ?? 0} • ADM ${
                    global?.totalAdministrationUsers ?? 0
                  } • SA ${global?.totalSuperAdminUsers ?? 0}`
                }
              ]
            },
            {
              title: 'Securite et exploitation',
              description: 'Mesures operationnelles disponibles sur la plateforme.',
              rows: [
                { label: "Taux d'erreur", value: this.formatRate(global?.errorRatePercent ?? 0) },
                {
                  label: 'Incidents administratifs',
                  value: `${global?.totalAdministrativeIncidents ?? 0}${
                    global?.administrativeIncidentsDerived ? ' (derive)' : ''
                  }`
                },
                {
                  label: 'System logs count',
                  value: global?.systemLogsCountPlaceholder ? 'N/A (placeholder)' : `${global?.systemLogsCount ?? 0}`
                },
                {
                  label: 'Nombre de logins',
                  value: global?.totalLoginsPlaceholder ? 'N/A (placeholder)' : `${global?.totalLogins ?? 0}`
                },
                {
                  label: 'Disponibilite plateforme',
                  value: global?.platformAvailabilityPlaceholder
                    ? 'N/A (placeholder)'
                    : this.formatRate(global?.platformAvailabilityPercent ?? 0)
                },
                { label: 'Changements configuration', value: `${global?.totalConfigurationChanges ?? 0}` }
              ]
            },
            {
              title: 'Workflow institutionnel',
              description: 'Suivi des traitements academiques et reporting.',
              rows: [
                { label: 'Dossiers soumis', value: `${global?.totalSubmittedActivities ?? 0}` },
                { label: 'Validations finales', value: `${global?.totalValidatedActivities ?? 0}` },
                { label: 'Dossiers rejetes', value: `${global?.totalRejectedActivities ?? 0}` },
                { label: 'Rapports generes', value: `${global?.totalGeneratedReports ?? 0}` }
              ]
            }
          ];
        }

        return [
          {
            title: 'Structure institutionnelle',
            description: 'Les reperes utiles pour lire le perimetre global de la plateforme.',
            rows: [
              { label: 'Departements', value: `${global?.totalDepartments ?? 0}` },
              { label: 'Utilisateurs', value: `${global?.totalUsers ?? 0}` },
              { label: 'Enseignants', value: `${global?.totalTeachers ?? 0}` }
            ]
          },
          {
            title: 'Workflow global',
            description: 'Le suivi global des dossiers au niveau institutionnel.',
            rows: [
              { label: 'Activites globales', value: `${global?.totalActivities ?? 0}` },
              { label: 'Dossiers soumis', value: `${global?.totalSubmittedActivities ?? 0}` },
              { label: 'Validations finales', value: `${global?.totalValidatedActivities ?? 0}` },
              { label: 'Dossiers rejetes', value: `${global?.totalRejectedActivities ?? 0}` },
              { label: 'Rapports generes', value: `${global?.totalGeneratedReports ?? 0}` }
            ]
          },
          {
            title: 'Performance transversale',
            description: 'Indicateurs RH et performance globale consolidee.',
            rows: [
              { label: 'Points totaux', value: `${this.formatPoints(global?.totalTeachingPerformancePoints ?? 0)} pts` },
              { label: 'Heures consolidees', value: `${this.formatHours(global?.totalCompletedHours ?? 0)} h` },
              { label: 'Departements', value: `${global?.totalDepartments ?? 0}` },
              { label: 'Utilisateurs actifs', value: `${global?.totalActiveUsers ?? 0}` }
            ]
          }
        ];
      default:
        const departmentComparisonCount = personal?.departmentTeacherComparisonCount ?? 0;
        const useDepartmentComparison = departmentComparisonCount > 0;
        const comparisonCount = useDepartmentComparison
          ? departmentComparisonCount
          : (personal?.facultyTeacherComparisonCount ?? 0);
        const comparisonMax = useDepartmentComparison
          ? (personal?.departmentTeachingPointsMax ?? 0)
          : (personal?.facultyTeachingPointsMax ?? 0);
        const comparisonAverage = useDepartmentComparison
          ? (personal?.departmentTeachingPointsAverage ?? 0)
          : (personal?.facultyTeachingPointsAverage ?? 0);
        const comparisonMin = useDepartmentComparison
          ? (personal?.departmentTeachingPointsMin ?? 0)
          : (personal?.facultyTeachingPointsMin ?? 0);
        return [
          {
            title: 'Workflow global personnel',
            description: 'Le suivi global des dossiers sans detail par activite.',
            rows: [
              { label: 'Activites declarees', value: `${personal?.totalDeclaredActivities ?? 0}` },
              { label: 'Dossiers soumis', value: `${personal?.totalSubmittedActivities ?? 0}` },
              {
                label: 'Dossiers en attente',
                value: `${this.teacherPendingActivities()}`
              },
              { label: 'Activites validees', value: `${personal?.totalValidatedActivities ?? 0}` },
              { label: 'Activites rejetees', value: `${personal?.totalRejectedActivities ?? 0}` },
              { label: 'Taux de validation', value: this.formatRate(personal?.validationRatePercent ?? 0) }
            ]
          },
          {
            title: useDepartmentComparison ? 'Comparatif departemental' : 'Comparatif ESPRIT',
            description: `Positionnement global de vos points face aux ${comparisonCount} enseignant(s) actifs compares.`,
            rows: [
              { label: 'Mes points', value: `${this.formatPoints(personal?.totalTeachingPerformancePoints ?? 0)} pts` },
              { label: 'Max', value: `${this.formatPoints(comparisonMax)} pts` },
              { label: 'Moyenne', value: `${this.formatPoints(comparisonAverage)} pts` },
              { label: 'Min', value: `${this.formatPoints(comparisonMin)} pts` }
            ]
          },
          {
            title: 'Performance transversale',
            description: 'Indicateurs personnels globaux non dupliques dans les pages activites.',
            rows: [
              { label: 'Points accumules', value: `${this.formatPoints(personal?.totalAccumulatedPoints ?? 0)} pts` },
              { label: 'Bonus estime', value: `${this.formatPoints(personal?.estimatedBonus ?? 0)} DT` },
              { label: "Jours d'absence", value: `${personal?.absenceDays ?? 0}` },
              {
                label: 'Rang departemental',
                value: personal && personal.departmentRankPopulation > 0
                  ? `${personal.departmentRankPosition}/${personal.departmentRankPopulation}`
                  : '-'
              },
              { label: 'Score general actif', value: `${this.formatPoints(personal?.currentGeneralScore ?? 0)} pts` },
              { label: 'Rapports generes', value: `${personal?.totalGeneratedReports ?? 0}` }
            ]
          }
        ];
    }
  });
  private readonly overviewPreviewCount = 3;
  readonly visibleOverviewSections = computed(() =>
    this.hasCollapsedOverviewSections() && !this.showAllOverviewSections()
      ? this.overviewSections().slice(0, this.overviewPreviewCount)
      : this.overviewSections()
  );
  readonly hasCollapsedOverviewSections = computed(() => this.overviewSections().length > this.overviewPreviewCount);
  readonly overviewToggleLabel = computed(() =>
    this.showAllOverviewSections() ? 'Masquer la synthese' : 'Afficher toute la synthese'
  );

  readonly recentActivitiesRoute = computed(() =>
    this.isAdministration() ? '/workflow' : '/teaching'
  );
  readonly visibleRecentActivities = computed(() =>
    this.showAllRecentActivities() ? this.recentActivities() : this.recentActivities().slice(0, 2)
  );
  readonly hasCollapsedRecentActivities = computed(() => this.recentActivities().length > 2);
  readonly recentActivitiesToggleLabel = computed(() =>
    this.showAllRecentActivities() ? 'Masquer la liste' : 'Consulter toutes les activites'
  );
  readonly globalRecentListToggleLabel = computed(() =>
    this.showGlobalRecentList() ? 'Afficher moins' : 'Afficher toute la liste'
  );
  readonly globalVisibleRecentActivities = computed(() =>
    this.showGlobalRecentList() ? this.globalRecentActivities() : this.globalRecentActivities().slice(0, 2)
  );

  readonly quickActions = computed<DashboardActionCard[]>(() => {
    switch (this.role()) {
      case 'CHEF_DEPARTEMENT':
        return [
          { label: 'Traiter le workflow', path: '/workflow', hint: 'Valider les dossiers en attente.', icon: 'WF' },
          { label: 'Voir les activites', path: '/teaching', hint: 'Suivre les declarations du departement.', icon: 'AC' },
          { label: 'Consulter les rapports', path: '/reports', hint: 'Acceder aux rapports consolides.', icon: 'RP' }
        ];
      case 'ADMINISTRATION':
      case 'SUPER_ADMIN':
        return [
          { label: 'Validation finale', path: '/workflow', hint: 'Traiter les dossiers en attente.', icon: 'WF' },
          {
            label: 'Rapports institutionnels',
            path: '/reports',
            hint: 'Generer les rapports et suivre la performance.',
            icon: 'RP'
          },
          {
            label: 'Indicateurs de performance',
            path: '/dashboard',
            hint: 'Consulter les mesures globales consolidees.',
            icon: 'KP'
          }
        ];
      default:
        return [
          { label: 'Declarer un cours', path: '/teaching', hint: 'Saisir vos charges d enseignement.', icon: 'CR' },
          { label: 'Declarer un encadrement', path: '/supervision', hint: 'Ajouter vos PFE et jurys.', icon: 'EN' },
          { label: 'Rapport individuel', path: '/reports', hint: 'Exporter votre bilan annuel.', icon: 'RP' }
        ];
    }
  });

  readonly summaryCards = computed<DashboardSummaryCard[]>(() => {
    if (this.isAdministration()) {
      const global = this.globalDashboard();

      if (this.isSuperAdmin()) {
        return [
          {
            label: 'Utilisateurs total',
            value: `${global?.totalUsers ?? 0}`,
            note: `Annee universitaire ${this.periodLabel()}`,
            icon: 'US',
            tone: 'brand'
          },
          {
            label: 'Utilisateurs actifs',
            value: `${global?.totalActiveUsers ?? 0}`,
            note: 'Comptes actifs',
            icon: 'AC',
            tone: 'accent'
          },
          {
            label: 'Utilisateurs par role',
            value: `ENS ${global?.totalTeachers ?? 0} • CD ${global?.totalDepartmentHeadUsers ?? 0}`,
            note: `ADM ${global?.totalAdministrationUsers ?? 0} • SA ${global?.totalSuperAdminUsers ?? 0}`,
            icon: 'RL',
            tone: 'soft'
          },
          {
            label: 'Nombre de roles',
            value: `${global?.totalRoles ?? 0}`,
            note: 'Roles actifs en base',
            icon: 'RO',
            tone: 'ink'
          },
          {
            label: 'Departements',
            value: `${global?.totalDepartments ?? 0}`,
            note: 'Structure academique',
            icon: 'DP',
            tone: 'brand'
          },
          {
            label: 'System logs count',
            value: global?.systemLogsCountPlaceholder ? 'N/A' : `${global?.systemLogsCount ?? 0}`,
            note: global?.systemLogsCountPlaceholder ? 'Placeholder temporaire' : 'Logs systeme consolides',
            icon: 'LG',
            tone: 'soft'
          },
          {
            label: "Taux d'erreur",
            value: this.formatRate(global?.errorRatePercent ?? 0),
            note: 'Proxy incidents de connexion',
            icon: 'ER',
            tone: 'accent'
          },
          {
            label: 'Nombre de logins',
            value: global?.totalLoginsPlaceholder ? 'N/A' : `${global?.totalLogins ?? 0}`,
            note: global?.totalLoginsPlaceholder ? 'Placeholder temporaire' : 'Connexions enregistrees',
            icon: 'LI',
            tone: 'ink'
          },
          {
            label: 'Changements config',
            value: `${global?.totalConfigurationChanges ?? 0}`,
            note: 'Points / bonus modifies',
            icon: 'CF',
            tone: 'brand'
          },
          {
            label: 'Disponibilite plateforme',
            value: global?.platformAvailabilityPlaceholder
              ? 'N/A'
              : this.formatRate(global?.platformAvailabilityPercent ?? 0),
            note: global?.platformAvailabilityPlaceholder ? 'Placeholder temporaire' : 'Uptime consolide',
            icon: 'UP',
            tone: 'accent'
          },
          {
            label: 'Comptes desactives',
            value: `${global?.totalDisabledUsers ?? 0}`,
            note: 'Utilisateurs inactifs',
            icon: 'DS',
            tone: 'soft'
          },
          {
            label: 'Incidents administratifs',
            value: `${global?.totalAdministrativeIncidents ?? 0}`,
            note: global?.administrativeIncidentsDerived ? 'Mesure derivee securite' : 'Incidents traces',
            icon: 'IN',
            tone: 'ink'
          }
        ];
      }

      return [
        {
          label: 'Dossiers soumis',
          value: `${global?.totalSubmittedActivities ?? 0}`,
          note: `Annee universitaire ${this.periodLabel()}`,
          icon: 'DS',
          tone: 'brand'
        },
        {
          label: 'Validations finales',
          value: `${global?.totalValidatedActivities ?? 0}`,
          note: 'Dossiers deja confirmes',
          icon: 'VF',
          tone: 'accent'
        },
        {
          label: 'Enseignants actifs',
          value: `${global?.totalTeachers ?? 0}`,
          note: 'Population enseignante suivie',
          icon: 'EN',
          tone: 'ink'
        },
        {
          label: 'Rapports generes',
          value: `${global?.totalGeneratedReports ?? 0}`,
          note: 'Historique des livrables institutionnels',
          icon: 'RP',
          tone: 'soft'
        }
      ];
    }

    if (this.isDepartmentHead()) {
      const department = this.departmentDashboard();

      return [
        {
          label: 'Enseignants',
          value: `${department?.totalTeachers ?? 0}`,
          note: 'Total enseignants du departement',
          icon: 'EN',
          tone: 'brand'
        },
        {
          label: 'Activites globales',
          value: `${department?.totalActivities ?? 0}`,
          note: 'Toutes activites confondues',
          icon: 'AG',
          tone: 'soft'
        },
        {
          label: 'Activites soumises',
          value: `${department?.totalSubmittedActivities ?? 0}`,
          note: 'Soumises au workflow',
          icon: 'SM',
          tone: 'accent'
        },
        {
          label: 'Activites validees',
          value: `${department?.totalValidatedActivities ?? 0}`,
          note: 'Validees departement/final',
          icon: 'VA',
          tone: 'soft'
        },
        {
          label: 'Activites rejetees',
          value: `${department?.totalRejectedActivities ?? 0}`,
          note: 'Dossiers rejetes',
          icon: 'RJ',
          tone: 'ink'
        },
        {
          label: 'Activites en attente',
          value: `${department?.totalPendingActivities ?? 0}`,
          note: 'Soumises ou a corriger',
          icon: 'AT',
          tone: 'soft'
        },
        {
          label: 'Taux validation',
          value: this.formatRate(department?.validationRatePercent ?? 0),
          note: 'Validees / traitees',
          icon: 'TV',
          tone: 'brand'
        },
        {
          label: 'Delai moyen validation',
          value: `${this.formatHours(department?.averageValidationDelayDays ?? 0)} j`,
          note: 'CreatedAt -> decision finale',
          icon: 'DL',
          tone: 'accent'
        },
        {
          label: 'Points moyens / enseignant',
          value: `${this.formatPoints(department?.averagePointsPerTeacher ?? 0)} pts`,
          note: 'Moyenne departementale',
          icon: 'PM',
          tone: 'ink'
        },
        {
          label: 'Meilleur score enseignant',
          value: `${this.formatPoints(department?.bestTeacherScore ?? 0)} pts`,
          note: 'Benchmark interne',
          icon: 'MS',
          tone: 'brand'
        },
        {
          label: 'Absences moyennes',
          value: `${this.formatHours(department?.averageAbsenceDays ?? 0)} j`,
          note: 'Moyenne absences validees',
          icon: 'AB',
          tone: 'accent'
        },
        {
          label: "Taux d'activite departement",
          value: `${this.formatHours(department?.departmentActivityRate ?? 0)} act./ens.`,
          note: 'Activites par enseignant',
          icon: 'AR',
          tone: 'soft'
        },
        {
          label: 'Rapports generes',
          value: `${department?.totalGeneratedReports ?? 0}`,
          note: 'Rapports departementaux',
          icon: 'RP',
          tone: 'ink'
        }
      ];
    }

    const personal = this.personalDashboard();

    return [
      {
        label: 'Activites declarees',
        value: `${personal?.totalDeclaredActivities ?? 0}`,
        note: `Annee universitaire ${this.periodLabel()}`,
        icon: 'AT',
        tone: 'soft'
      },
      {
        label: 'Dossiers soumis',
        value: `${personal?.totalSubmittedActivities ?? 0}`,
        note: 'Transmis au workflow',
        icon: 'SM',
        tone: 'accent'
      },
      {
        label: 'Activites en attente',
        value: `${this.teacherPendingActivities()}`,
        note: 'A valider ou a corriger',
        icon: 'PE',
        tone: 'brand'
      },
      {
        label: 'Activites validees',
        value: `${personal?.totalValidatedActivities ?? 0}`,
        note: 'Dossiers confirmes',
        icon: 'VA',
        tone: 'brand'
      },
      {
        label: 'Taux de validation',
        value: this.formatRate(personal?.validationRatePercent ?? 0),
        note: 'Validees / traitees',
        icon: 'TV',
        tone: 'accent'
      },
      {
        label: 'Activites rejetees',
        value: `${personal?.totalRejectedActivities ?? 0}`,
        note: 'Dossiers rejetes',
        icon: 'RJ',
        tone: 'ink'
      },
      {
        label: 'Points accumules',
        value: `${this.formatPoints(personal?.totalAccumulatedPoints ?? 0)} pts`,
        note: 'Points consolides',
        icon: 'PT',
        tone: 'soft'
      },
      {
        label: 'Bonus estime',
        value: `${this.formatPoints(personal?.estimatedBonus ?? 0)} DT`,
        note: 'Estimation basee sur config',
        icon: 'BN',
        tone: 'ink'
      },
      {
        label: "Jours d'absence",
        value: `${personal?.absenceDays ?? 0}`,
        note: 'Absences validees',
        icon: 'AB',
        tone: 'brand'
      },
      {
        label: 'Rang departement',
        value: personal && personal.departmentRankPopulation > 0
          ? `${personal.departmentRankPosition}/${personal.departmentRankPopulation}`
          : '-',
        note: 'Classement par points',
        icon: 'RG',
        tone: 'accent',
        performanceGauge: this.buildPerformanceGauge(personal)
      }
    ];
  });

  readonly globalKpiCards = computed<DashboardSummaryCard[]>(() => {
    if (this.isDepartmentHead()) {
      const department = this.departmentDashboard();
      return [
        {
          label: 'Enseignants',
          value: `${department?.totalTeachers ?? 0}`,
          note: 'Effectif departemental actif',
          icon: 'EN',
          tone: 'brand'
        },
        {
          label: 'Activites soumises',
          value: `${department?.totalSubmittedActivities ?? 0}`,
          note: `Periode ${this.periodLabel()}`,
          icon: 'SM',
          tone: 'accent'
        },
        {
          label: 'Activites en attente',
          value: `${department?.totalPendingActivities ?? 0}`,
          note: 'A traiter en priorite',
          icon: 'AT',
          tone: 'soft'
        },
        {
          label: 'Taux de validation',
          value: this.formatRate(department?.validationRatePercent ?? 0),
          note: 'Dossiers valides / soumis',
          icon: 'TV',
          tone: 'ink'
        },
        {
          label: 'Moyenne points / enseignant',
          value: `${this.formatPoints(department?.averagePointsPerTeacher ?? 0)} pts`,
          note: 'Performance departementale moyenne',
          icon: 'PT',
          tone: 'brand'
        },
        {
          label: 'Delai moyen validation',
          value: `${this.roundNumber(department?.averageValidationDelayDays ?? 0)} j`,
          note: 'Temps moyen de traitement',
          icon: 'DL',
          tone: 'accent'
        }
      ];
    }

    const points = this.roleScopedPoints();
    const prime = this.roleScopedEstimatedPrime();
    const validationRate = this.roleScopedValidationRate();
    const rank = this.roleScopedDepartmentRank();
    const pending = this.roleScopedPendingActivities();
    const absences = this.roleScopedAbsences();

    return [
      {
        label: 'Points cumules',
        value: `${this.formatPoints(points)} pts`,
        note: 'Indicateur transversal global',
        icon: 'PT',
        tone: 'brand'
      },
      {
        label: 'Prime estimee',
        value: prime,
        note: '0 ou non disponible selon role',
        icon: 'PM',
        tone: 'accent'
      },
      {
        label: 'Taux de validation global',
        value: this.formatRate(validationRate),
        note: 'Tous dossiers confondus',
        icon: 'TV',
        tone: 'soft'
      },
      {
        label: 'Rang departemental',
        value: rank,
        note: 'Position sur votre perimetre',
        icon: 'RG',
        tone: 'ink'
      },
      {
        label: 'Activites en attente',
        value: `${pending}`,
        note: 'A valider ou a corriger',
        icon: 'AT',
        tone: 'brand'
      },
      {
        label: 'Absences',
        value: absences,
        note: 'Valeur globale du perimetre',
        icon: 'AB',
        tone: 'soft'
      }
    ];
  });

  readonly globalStatusChartData = computed<ChartData<'pie'>>(() => {
    const validated = this.roleScopedValidatedActivities();
    const rejected = this.roleScopedRejectedActivities();
    const pending = this.roleScopedPendingActivities();

    return {
      labels: ['Validees', 'Rejetees', 'En attente'],
      datasets: [
        {
          data: [validated, rejected, pending],
          backgroundColor: ['#16a34a', '#dc2626', '#f59e0b'],
          borderColor: ['rgba(22, 163, 74, 0.9)', 'rgba(220, 38, 38, 0.9)', 'rgba(245, 158, 11, 0.9)'],
          borderWidth: 1
        }
      ]
    };
  });
  readonly globalTrendTitle = computed(() =>
    this.isTeacherAccount() ? 'Performance annuelle' : 'Evolution departementale'
  );
  readonly globalTrendSubtitle = computed(() =>
    this.isTeacherAccount() ? 'Evolution annuelle des points' : 'Evolution mensuelle des activites'
  );

  readonly globalPointsTrendChartData = computed<ChartData<'line'>>(() => {
    if (this.isTeacherAccount()) {
      const history = this.yearlyPerformanceHistory();
      if (history.length > 0) {
        return {
          labels: history.map((item) => item.periodLabel),
          datasets: [
            {
              label: 'Points',
              data: history.map((item) => Number(item.teachingPerformancePoints ?? 0)),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.18)',
              pointBackgroundColor: '#2563eb',
              pointRadius: 3,
              fill: true,
              tension: 0.28
            }
          ]
        };
      }
    }

    if (this.isDepartmentHead()) {
      const trend = this.departmentDashboard()?.monthlyTrend ?? [];
      if (trend.length > 0) {
        return {
          labels: trend.map((point) => point.monthLabel),
          datasets: [
            {
              label: 'Activites du departement',
              data: trend.map((point) => Number(point.totalActivities ?? 0)),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.16)',
              pointBackgroundColor: '#2563eb',
              pointRadius: 3,
              fill: true,
              tension: 0.28
            }
          ]
        };
      }
    }

    if (this.isAdministration()) {
      const trend = this.globalDashboard()?.monthlyTrend ?? [];
      if (trend.length > 0) {
        return {
          labels: trend.map((point) => point.monthLabel),
          datasets: [
            {
              label: 'Activites institutionnelles',
              data: trend.map((point) => Number(point.totalActivities ?? 0)),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.16)',
              pointBackgroundColor: '#2563eb',
              pointRadius: 3,
              fill: true,
              tension: 0.28
            }
          ]
        };
      }
    }

    return {
      labels: [this.periodLabel()],
      datasets: [
        {
          label: 'Points',
          data: [this.roleScopedPoints()],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.18)',
          pointBackgroundColor: '#2563eb',
          pointRadius: 3,
          fill: true,
          tension: 0.28
        }
      ]
    };
  });

  readonly globalActivityTypeChartData = computed<ChartData<'doughnut'>>(() => {
    if (this.isTeacherAccount()) {
      const personal = this.personalDashboard();
      return {
        labels: ['Cours', 'Encadrement', 'Recherche', 'Evenements', 'Surveillances', 'Responsabilites', 'Partenariats'],
        datasets: [
          {
            data: [
              Number(personal?.totalTeachingActivities ?? 0),
              Number(personal?.totalSupervisions ?? 0),
              Number(personal?.totalResearchActivities ?? 0),
              Number(personal?.totalEventActivities ?? 0),
              Number(personal?.totalExamSurveillanceActivities ?? 0),
              Number(personal?.totalResponsibilityActivities ?? 0),
              Number(personal?.totalPartnershipActivities ?? 0)
            ],
            backgroundColor: ['#1d4ed8', '#ea580c', '#7c3aed', '#dc2626', '#0f766e', '#0369a1', '#f59e0b'],
            borderWidth: 1
          }
        ]
      };
    }

    const breakdown = this.isDepartmentHead()
      ? (this.departmentDashboard()?.activityBreakdown ?? [])
      : (this.globalDashboard()?.activityBreakdown ?? []);

    return {
      labels: breakdown.length > 0 ? breakdown.map((item) => item.label) : ['Non disponible'],
      datasets: [
        {
          data: breakdown.length > 0 ? breakdown.map((item) => Number(item.total ?? 0)) : [0],
          backgroundColor: ['#1d4ed8', '#ea580c', '#7c3aed', '#dc2626', '#0f766e', '#0369a1', '#f59e0b'],
          borderWidth: 1
        }
      ]
    };
  });

  readonly globalComparisonTitle = computed(() => {
    if (this.isTeacherAccount()) {
      return 'Comparatif points (Min / Moy / Max)';
    }

    if (this.isDepartmentHead()) {
      return 'Comparatif enseignants du departement (points)';
    }

    return 'Comparatif departements (points)';
  });

  readonly globalComparisonRows = computed<ScopeRow[]>(() => {
    if (this.isTeacherAccount()) {
      const personal = this.personalDashboard();
      const useDepartmentReference = Number(personal?.departmentTeacherComparisonCount ?? 0) > 0;
      const min = useDepartmentReference
        ? Number(personal?.departmentTeachingPointsMin ?? 0)
        : Number(personal?.facultyTeachingPointsMin ?? 0);
      const average = useDepartmentReference
        ? Number(personal?.departmentTeachingPointsAverage ?? 0)
        : Number(personal?.facultyTeachingPointsAverage ?? 0);
      const max = useDepartmentReference
        ? Number(personal?.departmentTeachingPointsMax ?? 0)
        : Number(personal?.facultyTeachingPointsMax ?? 0);
      const current = Number(personal?.totalTeachingPerformancePoints ?? 0);

      return this.buildComparisonRows({ min, average, max }, current);
    }

    if (this.isDepartmentHead()) {
      const benchmark = this.departmentDashboard()?.teacherBenchmark ?? [];
      const stats = this.computeStatsRange(benchmark.map((item) => Number(item.totalTeachingPerformancePoints ?? 0)));
      const current = Number(this.departmentDashboard()?.averagePointsPerTeacher ?? 0);
      return this.buildComparisonRows(stats, current);
    }

    const benchmark = this.globalDashboard()?.departmentBenchmark ?? [];
    const stats = this.computeStatsRange(benchmark.map((item) => Number(item.totalTeachingPerformancePoints ?? 0)));
    const departmentsCount = Math.max(1, Number(this.globalDashboard()?.totalDepartments ?? 0));
    const current = Number(this.globalDashboard()?.totalTeachingPerformancePoints ?? 0) / departmentsCount;
    return this.buildComparisonRows(stats, current);
  });

  readonly globalDeclaredActivities = computed(() => {
    if (this.isTeacherAccount()) {
      return Number(this.personalDashboard()?.totalDeclaredActivities ?? 0);
    }

    if (this.isDepartmentHead()) {
      return Number(this.departmentDashboard()?.totalActivities ?? 0);
    }

    return Number(this.globalDashboard()?.totalActivities ?? 0);
  });

  readonly globalWorkflowSummary = computed<GlobalWorkflowSummaryItem[]>(() => {
    const snapshot = this.dashboardSnapshot();
    const validated = this.roleScopedValidatedActivities();
    const pending = this.roleScopedPendingActivities();
    const rejected = this.roleScopedRejectedActivities();

    return [
      { label: 'Validees', value: validated, tone: 'success' },
      { label: 'En attente', value: pending, tone: 'warning' },
      { label: 'Rejetees', value: rejected, tone: 'danger' },
      { label: 'Dossiers soumis', value: snapshot.submitted, tone: 'neutral' }
    ];
  });

  readonly globalAbsenceDisplay = computed(() => this.roleScopedAbsences());
  readonly globalActiveScoreDisplay = computed(() => `${this.formatPoints(this.roleScopedPoints())} pts`);
  readonly globalReportsDisplay = computed(() => `${this.dashboardSnapshot().reports}`);
  readonly globalComparisonSummary = computed<GlobalComparisonSummary>(() => {
    let stats: StatsRange = { min: 0, average: 0, max: 0 };
    let current = 0;

    if (this.isTeacherAccount()) {
      const personal = this.personalDashboard();
      const useDepartmentReference = Number(personal?.departmentTeacherComparisonCount ?? 0) > 0;
      const min = useDepartmentReference
        ? Number(personal?.departmentTeachingPointsMin ?? 0)
        : Number(personal?.facultyTeachingPointsMin ?? 0);
      const average = useDepartmentReference
        ? Number(personal?.departmentTeachingPointsAverage ?? 0)
        : Number(personal?.facultyTeachingPointsAverage ?? 0);
      const max = useDepartmentReference
        ? Number(personal?.departmentTeachingPointsMax ?? 0)
        : Number(personal?.facultyTeachingPointsMax ?? 0);
      current = Number(personal?.totalTeachingPerformancePoints ?? 0);
      stats = { min, average, max };
    } else if (this.isDepartmentHead()) {
      const benchmark = this.departmentDashboard()?.teacherBenchmark ?? [];
      stats = this.computeStatsRange(benchmark.map((item) => Number(item.totalTeachingPerformancePoints ?? 0)));
      current = Number(this.departmentDashboard()?.averagePointsPerTeacher ?? 0);
    } else {
      const benchmark = this.globalDashboard()?.departmentBenchmark ?? [];
      stats = this.computeStatsRange(benchmark.map((item) => Number(item.totalTeachingPerformancePoints ?? 0)));
      const departmentsCount = Math.max(1, Number(this.globalDashboard()?.totalDepartments ?? 0));
      current = Number(this.globalDashboard()?.totalTeachingPerformancePoints ?? 0) / departmentsCount;
    }

    const range = stats.max - stats.min;
    const safeRange = range <= 0 ? 1 : range;
    const minPositionPercent = this.clampScalePercent(0);
    const maxPositionPercent = this.clampScalePercent(100);
    const currentPositionPercent = this.clampScalePercent(((current - stats.min) / safeRange) * 100);
    const averagePositionPercent = this.clampScalePercent(((stats.average - stats.min) / safeRange) * 100);

    return {
      min: stats.min,
      average: stats.average,
      max: stats.max,
      current,
      minPositionPercent,
      maxPositionPercent,
      currentPositionPercent,
      averagePositionPercent,
      deltaVsAverage: current - stats.average,
      deltaVsMax: current - stats.max
    };
  });
  readonly globalComparisonSignal = computed<GlobalComparisonSignal>(() => {
    const summary = this.globalComparisonSummary();

    if (summary.current >= summary.max && summary.max > 0) {
      return { label: 'Leader', tone: 'leader' };
    }

    if (summary.current >= summary.average) {
      return { label: 'Bon niveau', tone: 'steady' };
    }

    return { label: 'A renforcer', tone: 'warning' };
  });
  readonly globalRecentActivities = computed(() => this.recentActivities());

  readonly adviceCard = computed<AdviceCard>(() => {
    if (this.isAdministration()) {
      return {
        title: 'Pilotage',
        message:
          'Suivez ici les indicateurs institutionnels, traitez la validation finale des dossiers et generez les rapports de performance.',
        tone: 'info',
        path: '/workflow',
        actionLabel: 'Ouvrir la validation finale'
      };
    }

    if (this.isDepartmentHead()) {
      const department = this.departmentDashboard();
      const pending = department?.totalSubmittedActivities ?? 0;

      if (pending > 0) {
        return {
          title: 'Priorite',
          message: `${pending} dossier(s) attendent encore une decision departementale. Traitez-les pour garder un workflow propre.`,
          tone: 'warning',
          path: '/workflow',
          actionLabel: 'Ouvrir la validation'
        };
      }

      return {
        title: 'Pilotage',
        message:
          'Le chef de departement suit ici les indicateurs de performance, consulte les activites des enseignants et genere les rapports departementaux.',
        tone: 'success',
        path: '/reports',
        actionLabel: 'Ouvrir les rapports'
      };
    }

    const totals = this.activityTotals();

    if (totals.pending > 0) {
      return {
        title: 'Conseil',
        message: `Vous avez ${totals.pending} dossier(s) encore en attente. Priorisez leur traitement pour garder un suivi propre.`,
        tone: 'warning',
        path: this.recentActivitiesRoute(),
        actionLabel: 'Ouvrir le suivi'
      };
    }

    if (totals.total === 0) {
      return {
        title: 'Conseil',
        message: 'Commencez par ajouter votre premiere activite pour alimenter le tableau de bord et les rapports.',
        tone: 'info',
        path: '/teaching',
        actionLabel: 'Ajouter une activite'
      };
    }

    return {
      title: 'Conseil',
      message: 'Le tableau de bord est bien alimente. Vous pouvez maintenant consolider vos rapports ou verifier les derniers dossiers.',
      tone: 'success',
      path: '/reports',
      actionLabel: 'Voir les rapports'
    };
  });

  readonly scopeRows = computed<ScopeRow[]>(() => {
    const personal = this.personalDashboard();
    const department = this.departmentDashboard();
    const global = this.globalDashboard();

    switch (this.role()) {
      case 'CHEF_DEPARTEMENT':
        if (!department) {
          return [];
        }
        return [
          { label: 'Departement', value: department.departmentName },
          { label: 'Enseignants', value: `${department.totalTeachers}` },
          { label: 'Activites', value: `${department.totalActivities}` },
          { label: 'Dossiers valides', value: `${department.totalValidatedActivities}` },
          { label: 'Taux validation', value: this.formatRate(department.validationRatePercent) }
        ];
      case 'ADMINISTRATION':
      case 'SUPER_ADMIN':
        if (!global) {
          return [];
        }
        if (this.isSuperAdmin()) {
          return [
            { label: 'Departements', value: `${global.totalDepartments}` },
            { label: 'Utilisateurs', value: `${global.totalUsers}` },
            { label: 'Utilisateurs actifs', value: `${global.totalActiveUsers}` },
            { label: 'Comptes desactives', value: `${global.totalDisabledUsers}` },
            { label: "Taux d'erreur", value: this.formatRate(global.errorRatePercent) },
            { label: 'Incidents', value: `${global.totalAdministrativeIncidents}` }
          ];
        }
        return [
          { label: 'Departements', value: `${global.totalDepartments}` },
          { label: 'Utilisateurs', value: `${global.totalUsers}` },
          { label: 'Activites', value: `${global.totalActivities}` },
          { label: 'Dossiers valides', value: `${global.totalValidatedActivities}` }
        ];
      default:
        if (!personal) {
          return [];
        }
        return [
          { label: 'Annee universitaire', value: personal.periodLabel },
          { label: 'Points', value: `${this.formatPoints(personal.totalAccumulatedPoints)} pts` },
          { label: 'Bonus estime', value: `${this.formatPoints(personal.estimatedBonus)} DT` },
          { label: "Jours d'absence", value: `${personal.absenceDays}` }
        ];
    }
  });

  constructor() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      personal: this.canViewPersonal() ? this.dashboardService.getPersonal(this.periodLabel()) : of(null),
      department: this.canViewDepartment() ? this.dashboardService.getDepartment(this.periodLabel()) : of(null),
      global: this.canViewGlobal() ? this.dashboardService.getGlobal(this.periodLabel()) : of(null),
      adminEvaluations: this.isAdminRh()
        ? this.administrationService
            .getEvaluations(this.periodLabel())
            .pipe(catchError(() => of([] as AdministrativeEvaluationResponse[])))
        : of([] as AdministrativeEvaluationResponse[]),
      adminAbsences: this.isAdminRh()
        ? this.administrationService
            .getAbsenceSummaries(this.periodLabel())
            .pipe(catchError(() => of([] as AbsenceSummaryResponse[])))
        : of([] as AbsenceSummaryResponse[]),
      adminLeaveRequests: this.isAdminRh()
        ? this.availabilityRequestService
            .getRequests('CONGE')
            .pipe(catchError(() => of([] as AvailabilityRequestResponse[])))
        : of([] as AvailabilityRequestResponse[]),
      users: this.isSuperAdmin()
        ? this.usersService.getUsers().pipe(catchError(() => of([] as UserResponse[])))
        : of([] as UserResponse[]),
      reports: this.isSuperAdmin()
        ? this.reportService.getReports().pipe(catchError(() => of([] as ReportResponse[])))
        : of([] as ReportResponse[]),
      teachings: this.showRecentActivities()
        ? this.teachingService.getTeachingActivities().pipe(catchError(() => of([] as TeachingActivityResponse[])))
        : of([] as TeachingActivityResponse[]),
      supervisions: this.showRecentActivities()
        ? this.supervisionService.getSupervisionActivities().pipe(catchError(() => of([] as SupervisionActivityResponse[])))
        : of([] as SupervisionActivityResponse[]),
      researches: this.showRecentActivities()
        ? this.researchService.getResearchActivities().pipe(catchError(() => of([] as ResearchActivityResponse[])))
        : of([] as ResearchActivityResponse[]),
      events: this.showRecentActivities()
        ? this.eventService.getEventActivities().pipe(catchError(() => of([] as EventActivityResponse[])))
        : of([] as EventActivityResponse[]),
      responsibilities: this.showRecentActivities()
        ? this.responsibilityService
            .getResponsibilityActivities()
            .pipe(catchError(() => of([] as ResponsibilityActivityResponse[])))
        : of([] as ResponsibilityActivityResponse[]),
      surveillances: this.showRecentActivities()
        ? this.examSurveillanceService
            .getExamSurveillanceActivities()
            .pipe(catchError(() => of([] as ExamSurveillanceActivityResponse[])))
        : of([] as ExamSurveillanceActivityResponse[])
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({
          personal,
          department,
          global,
          adminEvaluations,
          adminAbsences,
          adminLeaveRequests,
          users,
          reports,
          teachings,
          supervisions,
          researches,
          events,
          responsibilities,
          surveillances
        }) => {
          this.personalDashboard.set(personal);
          this.departmentDashboard.set(department);
          this.globalDashboard.set(global);
          this.adminEvaluations.set(adminEvaluations);
          this.adminAbsenceSummaries.set(adminAbsences);
          this.adminLeaveRequests.set(adminLeaveRequests);
          this.showAllAdminCriticalCases.set(false);
          this.superAdminUsers.set(users);
          this.superAdminReports.set(reports);
          this.superAdminSystemActions.set(this.buildSuperAdminSystemActions(users, reports, global));
          this.showAllSuperAdminSystemActions.set(false);
          this.scopedTeachingActivities.set(teachings);
          this.scopedSupervisionActivities.set(supervisions);
          this.showAllOverviewSections.set(false);
          this.lastLoadedAt.set(new Date());
          if (personal?.periodLabel) {
            this.periodLabel.set(personal.periodLabel);
            this.selectedHistoryYear.set(personal.periodLabel);
            this.selectedRankYear.set(personal.periodLabel);
          }

          this.triggerRankCardsAnimation();

          if (!this.showRecentActivities()) {
            this.scopedTeachingActivities.set([]);
            this.scopedSupervisionActivities.set([]);
            this.recentActivities.set([]);
            this.showAllRecentActivities.set(false);
            this.showGlobalRecentList.set(false);
            this.selectedGlobalRecentActivity.set(null);
            this.activityTotals.set({ total: 0, pending: 0, approved: 0 });
            this.loading.set(false);
            return;
          }

          const allActivities = this.buildActivityFeed(
            teachings,
            supervisions,
            researches,
            events,
            responsibilities,
            surveillances
          );

          this.recentActivities.set(allActivities);
          this.showAllRecentActivities.set(false);
          this.showGlobalRecentList.set(false);
          this.selectedGlobalRecentActivity.set(null);
          this.activityTotals.set(this.buildActivityTotals(allActivities));
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          const message = extractErrorMessage(error, "Le tableau de bord n'a pas pu etre charge.");
          this.errorMessage.set(message);
          this.toastService.error('Tableau de bord indisponible', message);
        }
      });
  }

  toggleRecentActivities() {
    if (!this.hasCollapsedRecentActivities()) {
      return;
    }

    this.showAllRecentActivities.update((value) => !value);
  }

  toggleGlobalRecentList() {
    this.showGlobalRecentList.update((value) => !value);
  }

  toggleSuperAdminSystemActions() {
    if (!this.hasSuperAdminSystemActionsToggle()) {
      return;
    }

    this.showAllSuperAdminSystemActions.update((value) => !value);
  }

  toggleAdminCriticalCases() {
    if (!this.hasAdminCriticalCasesToggle()) {
      return;
    }

    this.showAllAdminCriticalCases.update((value) => !value);
  }

  toggleOverviewSections() {
    if (!this.hasCollapsedOverviewSections()) {
      return;
    }

    this.showAllOverviewSections.update((value) => !value);
  }

  toggleHistoryExplorer() {
    if (!this.canOpenHistoryExplorer()) {
      return;
    }

    if (!this.showHistoryExplorer()) {
      const years = this.historyYears();
      const activePeriod = this.periodLabel().trim();
      const defaultPeriod = years.includes(activePeriod) ? activePeriod : (years[0] ?? null);
      this.selectedHistoryYear.set(defaultPeriod);
    }

    this.showHistoryExplorer.update((value) => !value);
  }

  closeHistoryExplorer() {
    this.showHistoryExplorer.set(false);
  }

  selectHistoryYear(periodLabel: string) {
    this.selectedHistoryYear.set(periodLabel);
  }

  selectRankYear(periodLabel: string) {
    this.selectedRankYear.set(periodLabel);
    this.triggerRankCardsAnimation();
  }

  selectStrategicMetric(metric: StrategicBenchmarkMetric) {
    this.strategicMetric.set(metric);
  }

  openSelectedHistoryYear() {
    const selectedYear = this.selectedHistoryYear();
    if (!selectedYear || selectedYear === this.periodLabel().trim()) {
      this.closeHistoryExplorer();
      return;
    }

    this.periodLabel.set(selectedYear);
    this.closeHistoryExplorer();
    this.loadDashboard();
  }

  selectGlobalRecentActivity(activity: RecentActivityCard) {
    const current = this.selectedGlobalRecentActivity();
    const next = current?.id === activity.id ? null : activity;
    this.selectedGlobalRecentActivity.set(next);

    if (next) {
      scrollElementIntoViewOnNextFrame(() => this.recentActivityDetailSection()?.nativeElement);
    }
  }

  routeToWorkflowDecision(activity: RecentActivityCard, decision: 'VALIDE' | 'REJETE') {
    const focus = `${activity.title} ${activity.shortCode}`.trim();
    this.router.navigate(['/workflow'], {
      queryParams: {
        q: focus,
        decision
      }
    });
  }

  openAdminCriticalCase(item: AdministrativeEvaluationResponse) {
    this.router.navigate(['/workflow'], {
      queryParams: {
        q: item.teacherName
      }
    });
  }

  openDashboardPath(path: string) {
    void this.router.navigateByUrl(path);
  }

  adminDecisionStatusLabel(status: AdministrativeEvaluationResponse['decisionStatus']) {
    switch (status) {
      case 'VALIDE':
        return 'Valide';
      case 'REJETE':
        return 'Non conforme';
      default:
        return 'En attente';
    }
  }

  adminDecisionStatusClass(status: AdministrativeEvaluationResponse['decisionStatus']) {
    switch (status) {
      case 'VALIDE':
        return 'status-pill status-pill--active';
      case 'REJETE':
        return 'status-pill status-pill--danger';
      default:
        return 'status-pill status-pill--warning';
    }
  }

  private buildActivityFeed(
    teachings: TeachingActivityResponse[],
    supervisions: SupervisionActivityResponse[],
    researches: ResearchActivityResponse[],
    events: EventActivityResponse[],
    responsibilities: ResponsibilityActivityResponse[],
    surveillances: ExamSurveillanceActivityResponse[]
  ) {
    const periodFiltered = [
      ...teachings.filter((activity) => this.matchesPeriod(activity.academicYear)).map((activity) => this.mapTeaching(activity)),
      ...supervisions.filter((activity) => this.matchesPeriod(activity.academicYear)).map((activity) => this.mapSupervision(activity)),
      ...researches.filter((activity) => this.matchesPeriod(activity.academicYear)).map((activity) => this.mapResearch(activity)),
      ...events.filter((activity) => this.matchesPeriod(activity.academicYear)).map((activity) => this.mapEvent(activity)),
      ...responsibilities
        .filter((activity) => this.matchesPeriod(activity.academicYear))
        .map((activity) => this.mapResponsibility(activity)),
      ...surveillances
        .filter((activity) => this.matchesPeriod(activity.academicYear))
        .map((activity) => this.mapSurveillance(activity))
    ];

    const fallback = [
      ...teachings.map((activity) => this.mapTeaching(activity)),
      ...supervisions.map((activity) => this.mapSupervision(activity)),
      ...researches.map((activity) => this.mapResearch(activity)),
      ...events.map((activity) => this.mapEvent(activity)),
      ...responsibilities.map((activity) => this.mapResponsibility(activity)),
      ...surveillances.map((activity) => this.mapSurveillance(activity))
    ];

    const source = periodFiltered.length > 0 ? periodFiltered : fallback;
    return source.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
  }

  private buildActivityTotals(recentActivities: RecentActivityCard[]) {
    const total = recentActivities.length;
    const pending = recentActivities.filter((activity) => activity.statusLabel === 'En attente').length;
    const approved = recentActivities.filter((activity) => activity.statusLabel === 'Approuvee').length;

    return { total, pending, approved };
  }

  private mapTeaching(activity: TeachingActivityResponse): RecentActivityCard {
    const partnershipLabel = activity.partnershipDeclarationType === 'PROFESSIONNELLE' ? 'Professionnelle' : 'Academique';
    const isPartnership = activity.partnershipDeclarationType != null;

    return {
      id: `teaching-${activity.id}`,
      title: activity.moduleName,
      description: isPartnership
        ? `Partenariat ${partnershipLabel} - ${activity.programName}`
        : `${activity.programName} - ${activity.className}`,
      typeLabel: isPartnership ? 'Partenariat' : 'Cours',
      shortCode: isPartnership ? 'PA' : 'CR',
      metric: `${this.formatPoints(activity.points.declaredTotalPoints)} pts`,
      statusLabel: this.statusLabel(activity.status),
      dateLabel: this.formatDateLabel(activity.updatedAt),
      updatedAt: activity.updatedAt,
      path: '/teaching',
      tone: 'brand'
    };
  }

  private mapSupervision(activity: SupervisionActivityResponse): RecentActivityCard {
    return {
      id: `supervision-${activity.id}`,
      title: activity.subjectTitle,
      description: `${activity.studentName} - ${this.supervisionTypeLabel(activity.supervisionType)}`,
      typeLabel: 'Encadrement',
      shortCode: 'EN',
      metric: `${this.formatPoints(this.supervisionActivityPoints(activity))} pts`,
      statusLabel: this.statusLabel(activity.status),
      dateLabel: this.formatDateLabel(activity.updatedAt),
      updatedAt: activity.updatedAt,
      path: '/supervision',
      tone: 'accent'
    };
  }

  private supervisionActivityPoints(activity: SupervisionActivityResponse) {
    if (activity.activityPoints != null) {
      return Number(activity.activityPoints);
    }

    const type = this.normalizeSupervisionType(activity.supervisionType);
    const quantity = Number(activity.quantityValue ?? 1);
    if (type === 'PFE_ENCADREMENT_ACADEMIQUE') {
      return 25;
    }
    if (type === 'PFE_RAPPORTEUR') {
      return 10;
    }
    if (type === 'PFE_PRESIDENT_JURY') {
      return 5;
    }
    if (type === 'SEMINAIRE' || type === 'PI') {
      return 10 * quantity;
    }
    if (type === 'APP0') {
      return 5;
    }
    if (type === 'COURS_SOUTIEN') {
      return 0.5 * quantity;
    }

    return 25;
  }

  private isJurySupervisionActivity(activity: SupervisionActivityResponse) {
    if (activity.roleInJury === 'RAPPORTEUR' || activity.roleInJury === 'PRESIDENT_JURY') {
      return true;
    }

    const normalizedType = this.normalizeSupervisionType(activity.supervisionType);
    return normalizedType === 'PFE_RAPPORTEUR' || normalizedType === 'PFE_PRESIDENT_JURY';
  }

  private normalizeSupervisionType(type: SupervisionActivityResponse['supervisionType']) {
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

  private supervisionTypeLabel(type: SupervisionActivityResponse['supervisionType']) {
    const normalizedType = this.normalizeSupervisionType(type);
    switch (normalizedType) {
      case 'PFE_ENCADREMENT_ACADEMIQUE':
        return 'PFE academique';
      case 'PFE_RAPPORTEUR':
        return 'PFE rapporteur';
      case 'PFE_PRESIDENT_JURY':
        return 'PFE president jury';
      case 'SEMINAIRE':
        return 'Seminaire';
      case 'PI':
        return 'PI';
      case 'APP0':
        return 'APP0';
      case 'COURS_SOUTIEN':
        return 'Cours soutien';
      default:
        return normalizedType;
    }
  }

  private mapResearch(activity: ResearchActivityResponse): RecentActivityCard {
    return {
      id: `research-${activity.id}`,
      title: activity.title,
      description: `${this.researchTypeLabel(activity.publicationType)} - ${activity.venueName}`,
      typeLabel: 'Recherche',
      shortCode: 'RC',
      metric: `${this.formatPoints(this.researchActivityPoints(activity))} pts`,
      statusLabel: this.statusLabel(activity.status),
      dateLabel: this.formatDateLabel(activity.updatedAt),
      updatedAt: activity.updatedAt,
      path: '/research',
      tone: 'soft'
    };
  }

  private researchActivityPoints(activity: ResearchActivityResponse) {
    if (activity.activityPoints != null) {
      return Number(activity.activityPoints);
    }

    const normalizedType = this.normalizeResearchType(activity.publicationType);
    if (normalizedType === 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE') {
      return 50;
    }
    if (normalizedType === 'PROJET_RECHERCHE_ARTICLE_CONFERENCE') {
      return 120;
    }
    if (normalizedType === 'PRESENTATION_TRAVAIL') {
      return 10;
    }

    const rank = activity.publicationRank ?? (activity.publicationType === 'CONFERENCE' ? 'CONFERENCE' : 'Q3');
    const multiplier = (() => {
      switch (rank) {
        case 'Q1':
          return 2;
        case 'Q2':
          return 1.5;
        case 'Q4':
          return 0.75;
        case 'CONFERENCE':
          return 0.5;
        default:
          return 1;
      }
    })();

    return 50 * multiplier;
  }

  private normalizeResearchType(type: ResearchActivityResponse['publicationType']) {
    switch (type) {
      case 'ARTICLE':
      case 'CONFERENCE':
      case 'CHAPITRE_OUVRAGE':
        return 'PUBLICATION_ARTICLE';
      case 'COMMUNICATION':
        return 'PRESENTATION_TRAVAIL';
      case 'PROJET_RECHERCHE':
        return 'PROJET_RECHERCHE_ARTICLE_CONFERENCE';
      default:
        return type;
    }
  }

  private researchTypeLabel(type: ResearchActivityResponse['publicationType']) {
    const normalizedType = this.normalizeResearchType(type);
    switch (normalizedType) {
      case 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE':
        return 'Projet developpement';
      case 'PROJET_RECHERCHE_ARTICLE_CONFERENCE':
        return 'Projet recherche';
      case 'PUBLICATION_ARTICLE':
        return 'Publication';
      case 'PRESENTATION_TRAVAIL':
        return 'Presentation';
      default:
        return normalizedType;
    }
  }

  private mapEvent(activity: EventActivityResponse): RecentActivityCard {
    const typeLabel = this.eventTypeLabel(activity.eventType);
    const roleLabel = this.eventRoleLabel(activity.eventType, activity.organizationRole);
    return {
      id: `event-${activity.id}`,
      title: activity.title,
      description: `${typeLabel} - ${roleLabel}`,
      typeLabel: 'Evenement',
      shortCode: 'EV',
      metric: `${this.formatPoints(this.eventActivityPoints(activity))} pts`,
      statusLabel: this.statusLabel(activity.status),
      dateLabel: this.formatDateLabel(activity.updatedAt),
      updatedAt: activity.updatedAt,
      path: '/events',
      tone: 'ink'
    };
  }

  private eventActivityPoints(activity: EventActivityResponse) {
    if (activity.activityPoints != null) {
      return Number(activity.activityPoints);
    }

    if (this.normalizeEventType(activity.eventType) === 'SEMINAIRE') {
      const role = (activity.organizationRole ?? '').trim().toUpperCase();
      return role === 'ORGANISATION' || role === 'ORGANIZATION' ? 20 : 10;
    }

    return 10;
  }

  private eventTypeLabel(type: EventActivityResponse['eventType']) {
    const normalizedType = this.normalizeEventType(type);
    switch (normalizedType) {
      case 'SEMINAIRE':
        return 'Evenement scientifique';
      case 'COLLOQUE':
        return 'Activites de clubs';
      case 'WORKSHOP':
        return 'Hackaton';
      case 'JOURNEE_SCIENTIFIQUE':
        return "Activites de l'ecole";
      default:
        return normalizedType;
    }
  }

  private eventRoleLabel(type: EventActivityResponse['eventType'], role: string | null | undefined) {
    if (this.normalizeEventType(type) !== 'SEMINAIRE') {
      return '-';
    }

    const normalizedRole = (role ?? '').trim().toUpperCase();
    return normalizedRole === 'ORGANISATION' || normalizedRole === 'ORGANIZATION' ? 'Organisation' : 'Membre';
  }

  private normalizeEventType(type: EventActivityResponse['eventType']) {
    return type === 'AUTRE' ? 'JOURNEE_SCIENTIFIQUE' : type;
  }

  private mapResponsibility(activity: ResponsibilityActivityResponse): RecentActivityCard {
    return {
      id: `responsibility-${activity.id}`,
      title: this.responsibilityTypeLabel(activity.responsibilityType),
      description: `Mission academique - ${activity.academicYear}`,
      typeLabel: 'Responsabilite',
      shortCode: 'RS',
      metric: activity.endDate ? this.formatDateLabel(activity.endDate) : 'En cours',
      statusLabel: this.statusLabel(activity.status),
      dateLabel: this.formatDateLabel(activity.updatedAt),
      updatedAt: activity.updatedAt,
      path: '/responsibilities',
      tone: 'accent'
    };
  }

  private responsibilityTypeLabel(type: string) {
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

  private mapSurveillance(activity: ExamSurveillanceActivityResponse): RecentActivityCard {
    return {
      id: `surveillance-${activity.id}`,
      title: activity.sessionName,
      description: `Surveillance ${activity.semester} - ${activity.sessionDay}`,
      typeLabel: 'Surveillance',
      shortCode: 'SV',
      metric: `${this.formatPoints(activity.sessionPoints)} pts`,
      statusLabel: this.statusLabel(activity.status),
      dateLabel: this.formatDateLabel(activity.updatedAt),
      updatedAt: activity.updatedAt,
      path: '/exam-surveillance',
      tone: 'ink'
    };
  }

  private matchesPeriod(academicYear: string) {
    return academicYear === this.periodLabel().trim();
  }

  private benchmarkAxisLabel(rawLabel: string) {
    const compactLabel = rawLabel.replace(/\s+/g, ' ').trim();
    const withoutDepartmentPrefix = this.isAdministration()
      ? compactLabel.replace(/^Departement\s+/i, '')
      : compactLabel;
    const maxLength = this.isAdministration() ? 30 : 34;

    if (withoutDepartmentPrefix.length <= maxLength) {
      return withoutDepartmentPrefix;
    }

    return `${withoutDepartmentPrefix.slice(0, maxLength - 3).trimEnd()}...`;
  }

  strategicRowSignalLabel(row: StrategicBenchmarkRow) {
    if (row.validationRate >= 80) {
      return 'Excellent';
    }

    if (row.validationRate >= 70) {
      return 'A surveiller';
    }

    return 'Alerte';
  }

  strategicRowSignalClass(row: StrategicBenchmarkRow) {
    if (row.validationRate >= 80) {
      return 'excellent';
    }

    if (row.validationRate >= 70) {
      return 'watch';
    }

    return 'risk';
  }

  formatStrategicMetricValue(value: number, metric: StrategicBenchmarkMetric) {
    switch (metric) {
      case 'validationRate':
        return this.formatRate(value);
      case 'activities':
        return `${Math.round(value)}`;
      case 'points':
        return this.formatPoints(value);
      case 'hours':
        return `${this.formatHours(value)} h`;
      default:
        return `${this.roundNumber(value)}`;
    }
  }

  private formatStrategicMetricTick(value: number, metric: StrategicBenchmarkMetric) {
    switch (metric) {
      case 'validationRate':
        return `${Math.round(value)}%`;
      case 'hours':
        return `${this.formatHours(value)}h`;
      case 'points':
        return this.formatPoints(value);
      default:
        return `${Math.round(value)}`;
    }
  }

  private strategicMetricValue(row: StrategicBenchmarkRow, metric: StrategicBenchmarkMetric) {
    switch (metric) {
      case 'activities':
        return row.activities;
      case 'points':
        return row.points;
      case 'hours':
        return row.hours;
      case 'validationRate':
      default:
        return row.validationRate;
    }
  }

  private strategicMetricColor(
    value: number,
    metric: StrategicBenchmarkMetric,
    minimum: number,
    maximum: number
  ) {
    if (metric === 'validationRate') {
      if (value >= 80) {
        return '#16a34a';
      }

      if (value >= 70) {
        return '#2563eb';
      }

      return '#dc2626';
    }

    const safeRange = maximum - minimum;
    if (safeRange <= 0) {
      return '#2563eb';
    }

    const normalized = (value - minimum) / safeRange;
    if (normalized >= 0.75) {
      return '#16a34a';
    }
    if (normalized >= 0.45) {
      return '#2563eb';
    }
    return '#ea580c';
  }

  private roleScopedPoints() {
    if (this.isTeacherAccount()) {
      return Number(this.personalDashboard()?.totalAccumulatedPoints ?? 0);
    }

    if (this.isDepartmentHead()) {
      return Number(this.departmentDashboard()?.totalTeachingPerformancePoints ?? 0);
    }

    return Number(this.globalDashboard()?.totalTeachingPerformancePoints ?? 0);
  }

  private roleScopedEstimatedPrime() {
    if (!this.isTeacherAccount()) {
      return 'Non disponible';
    }

    return `${this.formatPoints(this.personalDashboard()?.estimatedBonus ?? 0)} DT`;
  }

  private roleScopedValidationRate() {
    if (this.isTeacherAccount()) {
      return Number(this.personalDashboard()?.validationRatePercent ?? 0);
    }

    if (this.isDepartmentHead()) {
      return Number(this.departmentDashboard()?.validationRatePercent ?? 0);
    }

    const submitted = Number(this.globalDashboard()?.totalSubmittedActivities ?? 0);
    if (submitted <= 0) {
      return 0;
    }

    const validated = Number(this.globalDashboard()?.totalValidatedActivities ?? 0);
    return (validated / submitted) * 100;
  }

  private roleScopedDepartmentRank() {
    if (!this.isTeacherAccount()) {
      return 'Non disponible';
    }

    const personal = this.personalDashboard();
    if (!personal || personal.departmentRankPopulation <= 0) {
      return 'Non disponible';
    }

    return `${personal.departmentRankPosition}/${personal.departmentRankPopulation}`;
  }

  private roleScopedPendingActivities() {
    if (this.isTeacherAccount()) {
      return this.teacherPendingActivities();
    }

    if (this.isDepartmentHead()) {
      return Number(this.departmentDashboard()?.totalPendingActivities ?? 0);
    }

    const submitted = Number(this.globalDashboard()?.totalSubmittedActivities ?? 0);
    const validated = Number(this.globalDashboard()?.totalValidatedActivities ?? 0);
    const rejected = Number(this.globalDashboard()?.totalRejectedActivities ?? 0);
    return Math.max(0, submitted - validated - rejected);
  }

  private roleScopedAbsences() {
    if (this.isTeacherAccount()) {
      return `${this.personalDashboard()?.absenceDays ?? 0}`;
    }

    if (this.isDepartmentHead()) {
      return `${this.formatHours(this.departmentDashboard()?.averageAbsenceDays ?? 0)} j (moyenne)`;
    }

    return 'Non disponible';
  }

  private roleScopedValidatedActivities() {
    if (this.isTeacherAccount()) {
      return Number(this.personalDashboard()?.totalValidatedActivities ?? 0);
    }

    if (this.isDepartmentHead()) {
      return Number(this.departmentDashboard()?.totalValidatedActivities ?? 0);
    }

    return Number(this.globalDashboard()?.totalValidatedActivities ?? 0);
  }

  private roleScopedRejectedActivities() {
    if (this.isTeacherAccount()) {
      return Number(this.personalDashboard()?.totalRejectedActivities ?? 0);
    }

    if (this.isDepartmentHead()) {
      return Number(this.departmentDashboard()?.totalRejectedActivities ?? 0);
    }

    return Number(this.globalDashboard()?.totalRejectedActivities ?? 0);
  }

  private computeStatsRange(values: number[]): StatsRange {
    if (values.length === 0) {
      return { min: 0, average: 0, max: 0 };
    }

    const cleanedValues = values.map((value) => (Number.isFinite(value) ? value : 0));
    const min = Math.min(...cleanedValues);
    const max = Math.max(...cleanedValues);
    const average = cleanedValues.reduce((sum, value) => sum + value, 0) / cleanedValues.length;
    return { min, average, max };
  }

  private buildComparisonRows(stats: StatsRange, currentValue: number): ScopeRow[] {
    return [
      { label: 'Minimum', value: `${this.formatPoints(stats.min)} pts` },
      { label: 'Moyenne', value: `${this.formatPoints(stats.average)} pts` },
      { label: 'Maximum', value: `${this.formatPoints(stats.max)} pts` },
      { label: 'Valeur actuelle', value: `${this.formatPoints(currentValue)} pts` }
    ];
  }

  formatHours(value: number) {
    return Number.isInteger(value) ? `${value}` : value.toFixed(1);
  }

  formatRate(value: number) {
    return `${new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(this.roundNumber(value))}%`;
  }

  formatPoints(value: number) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  formatSignedPoints(value: number) {
    if (!Number.isFinite(value)) {
      return '0';
    }

    const prefix = value > 0 ? '+' : '';
    return `${prefix}${this.formatPoints(value)}`;
  }

  comparisonDeltaTone(value: number): 'positive' | 'negative' | 'neutral' {
    if (value > 0) {
      return 'positive';
    }

    if (value < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  private roundNumber(value: number) {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.round(value * 100) / 100;
  }

  private truncateChartLabel(value: string, maxChars: number): string {
    const normalized = (value ?? '').trim();
    if (!normalized) {
      return '';
    }

    if (normalized.length <= maxChars) {
      return normalized;
    }

    return `${normalized.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
  }

  private formatDateLabel(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  private statusLabel(status: ActivityStatus) {
    switch (status) {
      case 'VALIDEE_DEPARTEMENT':
      case 'VALIDEE_FINALE':
        return 'Approuvee';
      case 'SOUMISE':
      case 'A_CORRIGER':
        return 'En attente';
      case 'REJETEE':
        return 'Rejetee';
      default:
        return 'Brouillon';
    }
  }

  private buildPerformanceGauge(personal: PersonalDashboardResponse | null): PerformanceGauge | undefined {
    if (!personal) {
      return undefined;
    }

    const score = personal.totalTeachingPerformancePoints ?? 0;
    const departmentComparisonCount = personal.departmentTeacherComparisonCount ?? 0;
    const useDepartmentComparison = departmentComparisonCount > 0;
    const minimum = useDepartmentComparison
      ? (personal.departmentTeachingPointsMin ?? 0)
      : (personal.facultyTeachingPointsMin ?? 0);
    const average = useDepartmentComparison
      ? (personal.departmentTeachingPointsAverage ?? 0)
      : (personal.facultyTeachingPointsAverage ?? 0);
    const maximum = useDepartmentComparison
      ? (personal.departmentTeachingPointsMax ?? 0)
      : (personal.facultyTeachingPointsMax ?? 0);
    const comparisonCount = useDepartmentComparison
      ? departmentComparisonCount
      : (personal.facultyTeacherComparisonCount ?? 0);
    const range = maximum - minimum;

    const userPosition = range <= 0 ? 50 : this.clampPercentage(((score - minimum) / range) * 100);
    const averagePosition = range <= 0 ? 50 : this.clampPercentage(((average - minimum) / range) * 100);

    let bandLabel: PerformanceGauge['bandLabel'] = 'En progression';
    let bandTone: PerformanceGauge['bandTone'] = 'starter';

    if (comparisonCount <= 1) {
      bandLabel = 'Repere unique';
      bandTone = 'steady';
    } else if (score >= maximum && maximum > 0) {
      bandLabel = 'Top enseignant';
      bandTone = 'leader';
    } else if (score >= average && userPosition >= 68) {
      bandLabel = 'Tres bon rang';
      bandTone = 'strong';
    } else if (score >= average) {
      bandLabel = 'Au-dessus';
      bandTone = 'steady';
    } else if (userPosition <= 22) {
      bandLabel = 'A renforcer';
      bandTone = 'starter';
    } else {
      bandLabel = 'En progression';
      bandTone = 'steady';
    }

    return {
      bandLabel,
      bandTone,
      userPosition,
      averagePosition,
      minValue: `${this.formatPoints(minimum)} pts`,
      averageValue: `${this.formatPoints(average)} pts`,
      maxValue: `${this.formatPoints(maximum)} pts`
    };
  }

  private buildHistoryLineChartData(
    datasetLabel: string,
    valueSelector: (item: AcademicYearPerformanceSnapshot) => number,
    borderColor: string,
    backgroundColor: string
  ): ChartData<'line'> {
    const ordered = this.yearlyPerformanceHistory();
    return {
      labels: ordered.map((item) => item.periodLabel),
      datasets: [
        {
          label: datasetLabel,
          data: ordered.map((item) => Number(valueSelector(item) ?? 0)),
          borderColor,
          backgroundColor,
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
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

  private clampPercentage(value: number) {
    return Math.min(94, Math.max(6, value));
  }

  private clampZeroToHundred(value: number) {
    if (!Number.isFinite(value)) {
      return 0;
    }
    return Math.min(100, Math.max(0, this.roundNumber(value)));
  }

  private clampScalePercent(value: number) {
    return Math.min(96, Math.max(4, Math.round(value)));
  }

  superAdminActionStatusClass(status: SuperAdminSystemAction['status']) {
    return status === 'ERREUR' ? 'status-pill status-pill--danger' : 'status-pill status-pill--active';
  }

  private buildSuperAdminSystemActions(
    users: UserResponse[],
    reports: ReportResponse[],
    global: GlobalDashboardResponse | null
  ) {
    const userActions: SuperAdminSystemAction[] = users.flatMap((user) => {
      const createdAction: SuperAdminSystemAction = {
        id: `user-create-${user.id}`,
        occurredAt: user.createdAt,
        actor: 'Super Admin',
        action: `Creation compte #${user.id}`,
        status: 'OK',
        detail: `${user.firstName} ${user.lastName} (${user.role})`
      };

      const actions: SuperAdminSystemAction[] = [createdAction];
      const updatedAt = this.parseDateValue(user.updatedAt);
      const createdAt = this.parseDateValue(user.createdAt);
      if (updatedAt > 0 && createdAt > 0 && updatedAt !== createdAt) {
        actions.push({
          id: `user-update-${user.id}`,
          occurredAt: user.updatedAt,
          actor: 'Super Admin',
          action: `Mise a jour compte #${user.id}`,
          status: 'OK',
          detail: `${user.firstName} ${user.lastName} (${user.role})`
        });
      }

      if (!user.isActive) {
        actions.push({
          id: `user-inactive-${user.id}`,
          occurredAt: user.updatedAt,
          actor: 'Systeme',
          action: `Alerte compte inactif #${user.id}`,
          status: 'ERREUR',
          detail: `${user.firstName} ${user.lastName} est inactif`
        });
      }

      return actions;
    });

    const reportActions: SuperAdminSystemAction[] = reports.map((report) => ({
      id: `report-${report.id}`,
      occurredAt: report.generatedAt,
      actor: report.generatedByName ?? 'Systeme',
      action: `Generation rapport #${report.id}`,
      status: 'OK',
      detail: `${report.reportType} - ${report.reportFormat}`
    }));

    const syntheticMonitoring: SuperAdminSystemAction[] = global
      ? [
          {
            id: `monitoring-${global.periodLabel}`,
            occurredAt: new Date().toISOString(),
            actor: 'Monitoring',
            action: "Controle taux d'erreur",
            status: Number(global.errorRatePercent ?? 0) > 0 ? 'ERREUR' : 'OK',
            detail: `${this.formatRate(Number(global.errorRatePercent ?? 0))} d'erreurs detectees`
          }
        ]
      : [];

    return [...syntheticMonitoring, ...userActions, ...reportActions]
      .sort((left, right) => this.parseDateValue(right.occurredAt) - this.parseDateValue(left.occurredAt))
      .slice(0, 16);
  }

  private parseDateValue(value: string) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private monthKeyFromDate(value: string) {
    const parsed = this.parseDateValue(value);
    if (parsed <= 0) {
      return null;
    }

    const date = new Date(parsed);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    return `${month}/${date.getFullYear()}`;
  }

  private buildTrailingMonthLabels(monthCount: number) {
    const labels: string[] = [];
    const anchor = new Date();
    anchor.setDate(1);

    for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
      const cursor = new Date(anchor.getFullYear(), anchor.getMonth() - offset, 1);
      const month = `${cursor.getMonth() + 1}`.padStart(2, '0');
      labels.push(`${month}/${cursor.getFullYear()}`);
    }

    return labels;
  }

  private triggerRankCardsAnimation() {
    if (!this.showGeneralRankScale()) {
      this.rankCardsAnimating.set(false);
      return;
    }

    if (this.rankCardsAnimationTimer != null) {
      clearTimeout(this.rankCardsAnimationTimer);
      this.rankCardsAnimationTimer = null;
    }

    this.rankCardsAnimating.set(false);
    setTimeout(() => this.rankCardsAnimating.set(true), 10);
    this.rankCardsAnimationTimer = setTimeout(() => {
      this.rankCardsAnimating.set(false);
      this.rankCardsAnimationTimer = null;
    }, 900);
  }
}





