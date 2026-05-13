import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { PersonalDashboardResponse } from '../../core/models/dashboard.models';
import {
  CreateTeachingActivityPayload,
  PartnershipDeclarationType,
  TeachingActivityResponse,
  TeachingPointsBreakdown,
  TeachingRestructuringStatus
} from '../../core/models/teaching.models';
import { SemesterType, TeachingMode } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { TeachingService } from '../../core/services/teaching.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { scrollElementIntoViewOnNextFrame } from '../../core/utils/scroll.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';
import { startWith } from 'rxjs';

interface TeachingFormValue {
  programName: string;
  className: string;
  moduleName: string;
  semester: SemesterType;
  teachingMode: TeachingMode;
  language: string;
  plannedHours: number;
  completedHours: number;
  newCourseHours: number;
  courseRestructuringPercentage: number;
  syllabusCount: number;
  carFileElaborated: boolean;
  examElaborated: boolean;
  eveningOrSaturdayHours: number;
  coordination: boolean;
  academicYear: string;
  partnershipDeclarationType: PartnershipDeclarationType | null;
  syllabusPath: string;
}

type TeachingActivityEntryType =
  | 'ENSEIGNEMENT_COURS'
  | 'NOUVEAU_COURS'
  | 'RESTRUCTURATION_COURS'
  | 'ELABORATION_SYLLABUS'
  | 'FICHIER_CAR'
  | 'ELABORATION_EXAMEN'
  | 'COURS_SOIR_SAMEDI'
  | 'COORDINATION'
  | 'PARTENARIAT';

type TeachingActivityDisplayType = TeachingActivityEntryType | 'ACTIVITE_MIXTE';

interface TeachingActivityTypeOption {
  value: TeachingActivityEntryType;
  label: string;
  description: string;
}

interface ModuleFormationOption {
  module: string;
  formation: string;
}

interface TeachingPointsRow {
  label: string;
  value: number;
}

@Component({
  selector: 'app-teaching-page',
  imports: [ReactiveFormsModule, DecimalPipe, ChartPanelComponent],
  templateUrl: './teaching-page.component.html',
  styleUrl: './teaching-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeachingPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly teachingService = inject(TeachingService);
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);

  readonly activities = signal<TeachingActivityResponse[]>([]);
  readonly dashboardInsights = signal<PersonalDashboardResponse | null>(null);
  readonly dashboardInsightsLoading = signal(false);
  readonly dashboardInsightsError = signal('');
  readonly dashboardPeriodLabel = signal(this.defaultAcademicYear());
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly semesters: SemesterType[] = ['S1', 'S2', 'ANNUEL'];
  readonly teachingModes: TeachingMode[] = ['PRESENTIEL', 'EN_LIGNE', 'ALTERNANCE', 'EXECUTIF'];
  readonly languages = ['Francais', 'Anglais'] as const;
  readonly partnershipDeclarationTypes: PartnershipDeclarationType[] = ['ACADEMIQUE', 'PROFESSIONNELLE'];
  readonly teachingActivityTypes: TeachingActivityTypeOption[] = [
    {
      value: 'ENSEIGNEMENT_COURS',
      label: 'Enseignement du cours',
      description: 'Declaration des heures de cours assurees.'
    },
    {
      value: 'NOUVEAU_COURS',
      label: 'Nouveau cours',
      description: 'Declaration d un nouveau cours calcule au volume horaire.'
    },
    {
      value: 'RESTRUCTURATION_COURS',
      label: 'Restructuration du cours',
      description: 'Proposition en pourcentage soumise a validation du chef de departement.'
    },
    {
      value: 'ELABORATION_SYLLABUS',
      label: 'Elaboration du syllabus',
      description: 'Declaration du nombre de syllabus prepares pour le module.'
    },
    {
      value: 'FICHIER_CAR',
      label: 'Elaboration d un fichier CAR',
      description: 'Declaration forfaitaire du fichier CAR.'
    },
    {
      value: 'ELABORATION_EXAMEN',
      label: 'Elaboration d examen',
      description: 'Declaration forfaitaire pour la preparation de l examen.'
    },
    {
      value: 'COURS_SOIR_SAMEDI',
      label: 'Cours de soir ou samedi',
      description: 'Declaration des heures en bonus de soir ou samedi.'
    },
    {
      value: 'COORDINATION',
      label: 'Coordination',
      description: 'Declaration forfaitaire de coordination academique.'
    },
    {
      value: 'PARTENARIAT',
      label: 'Partenariat',
      description: 'Declaration de partenariat academique ou professionnelle.'
    }
  ];
  readonly moduleFormationOptions: ModuleFormationOption[] = [
    { module: 'LSG', formation: 'Licence en Sciences de Gestion' },
    { module: 'LBC', formation: 'Licence en Business Computing' },
    { module: 'LMAD', formation: 'Licence en Mathematiques Appliquees au Developpement' },
    { module: 'MDSI', formation: 'Mastere en Developpement des Systemes d Information' },
    { module: 'MKD', formation: 'Marketing Digital' },
    { module: 'BA', formation: 'Business Administration' },
    { module: 'CCA', formation: 'Comptabilite, Controle et Audit' }
  ];
  readonly levelOptions = ['L1', 'L2', 'L3', 'M1', 'M2'] as const;
  readonly statusOptions = ['ALL', 'BROUILLON', 'SOUMISE', 'VALIDEE_DEPARTEMENT', 'VALIDEE_FINALE', 'REJETEE', 'A_CORRIGER'] as const;
  readonly currentUserId = computed(() => this.authService.user()?.id ?? null);
  readonly currentRole = this.authService.role;
  readonly isCreatePage = this.route.snapshot.data['mode'] === 'create';
  readonly forcedActivityType = this.parseTeachingActivityType(this.route.snapshot.data['forcedActivityType']);
  readonly activityListFilterType = this.parseTeachingActivityType(this.route.snapshot.data['activityListFilterType']);
  readonly createPath = (this.route.snapshot.data['createPath'] as string | undefined) ?? '/teaching/new';
  readonly listPath = (this.route.snapshot.data['listPath'] as string | undefined) ?? '/teaching';
  readonly isActivityTypeLocked = this.forcedActivityType != null;
  readonly isPartnershipPage = this.forcedActivityType === 'PARTENARIAT' || this.activityListFilterType === 'PARTENARIAT';
  readonly canCreate = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly isManagerDashboard = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly showTeacherIdentity = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly searchTerm = signal('');
  readonly statusFilter = signal<(typeof this.statusOptions)[number]>('ALL');
  readonly showActivityDashboard = signal(true);
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly selectedActivity = signal<TeachingActivityResponse | null>(null);
  readonly editingActivityId = signal<number | null>(null);
  readonly createActivityType = signal<TeachingActivityEntryType>('ENSEIGNEMENT_COURS');
  readonly editActivityType = signal<TeachingActivityEntryType>('ENSEIGNEMENT_COURS');
  readonly detailSection = viewChild<ElementRef<HTMLElement>>('detailSection');
  readonly filteredActivities = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.activities()
      .filter((activity) => {
        const matchesStatus = status === 'ALL' || activity.status === status;
        const matchesTerm =
          term.length === 0 ||
          activity.moduleName.toLowerCase().includes(term) ||
          activity.programName.toLowerCase().includes(term) ||
          activity.className.toLowerCase().includes(term) ||
          activity.teacherName.toLowerCase().includes(term);

        return matchesStatus && matchesTerm;
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
  readonly hasHistoryToggle = computed(
    () => this.filteredActivities().length > this.collapsedHistorySize
  );
  readonly historyToggleLabel = computed(() =>
    this.showFullHistory() ? "Masquer l'historique" : "Afficher tout l'historique"
  );
  readonly visibleSubmittedCount = computed(
    () => this.displayedActivities().filter((activity) => activity.status === 'SOUMISE').length
  );
  readonly visibleValidatedCount = computed(
    () =>
      this.displayedActivities().filter(
        (activity) => activity.status === 'VALIDEE_DEPARTEMENT' || activity.status === 'VALIDEE_FINALE'
      ).length
  );
  readonly dashboardScopedActivities = computed(() =>
    this.dashboardPeriodActivities().filter((activity) =>
      this.isPartnershipPage ? this.isPartnershipActivity(activity, false) : !this.isPartnershipActivity(activity, false)
    )
  );
  readonly dashboardTotalHours = computed(() => {
    if (this.isPartnershipPage) {
      return 0;
    }

    return this.dashboardScopedActivities().reduce((total, activity) => {
      const plannedHours = Number(activity.plannedHours ?? 0);
      const completedHours = Number(activity.completedHours ?? 0);
      const newCourseHours = Number(activity.newCourseHours ?? 0);
      const eveningHours = Number(activity.eveningOrSaturdayHours ?? 0);
      return total + Math.max(plannedHours, completedHours) + newCourseHours + eveningHours;
    }, 0);
  });
  readonly dashboardCourseCount = computed(() => this.dashboardScopedActivities().length);
  readonly dashboardModuleCount = computed(() => {
    const modules = new Set(
      this.dashboardScopedActivities()
        .map((activity) => activity.moduleName.trim())
        .filter((moduleName) => moduleName.length > 0)
    );
    return modules.size;
  });
  readonly dashboardSemesterCount = computed(() => {
    const semesters = new Set(this.dashboardScopedActivities().map((activity) => activity.semester));
    return semesters.size;
  });
  readonly dashboardTeachingPoints = computed(() =>
    this.dashboardScopedActivities().reduce((total, activity) => total + Number(activity.points.declaredTotalPoints ?? 0), 0)
  );
  readonly dashboardPartnershipAcademicCount = computed(
    () =>
      this.dashboardScopedActivities().filter((activity) => activity.partnershipDeclarationType === 'ACADEMIQUE').length
  );
  readonly dashboardPartnershipProfessionalCount = computed(
    () =>
      this.dashboardScopedActivities().filter((activity) => activity.partnershipDeclarationType === 'PROFESSIONNELLE').length
  );
  readonly dashboardHoursBySemester = computed(() => {
    const totals: Record<SemesterType, number> = { S1: 0, S2: 0, ANNUEL: 0 };
    for (const activity of this.dashboardScopedActivities()) {
      const plannedHours = Number(activity.plannedHours ?? 0);
      const completedHours = Number(activity.completedHours ?? 0);
      const newCourseHours = Number(activity.newCourseHours ?? 0);
      const eveningHours = Number(activity.eveningOrSaturdayHours ?? 0);
      const totalHours = Math.max(plannedHours, completedHours) + newCourseHours + eveningHours;
      totals[activity.semester] += totalHours;
    }
    return totals;
  });
  readonly dashboardAnnualHours = computed(() => {
    const semesterHours = this.dashboardHoursBySemester();
    if (semesterHours['ANNUEL'] > 0) {
      return semesterHours['ANNUEL'];
    }

    return semesterHours['S1'] + semesterHours['S2'];
  });
  readonly dashboardPrimaryChartTitle = computed(() => {
    if (this.isPartnershipPage) {
      return 'Activites de partenariat par type';
    }
    return 'Heures d enseignement par semestre';
  });
  readonly dashboardPrimaryChartSubtitle = computed(() => {
    if (this.isPartnershipPage) {
      return `Repartition academique / professionnelle (${this.dashboardPeriodLabel()}).`;
    }
    return `Volume horaire cumule S1, S2 et annuel (${this.dashboardPeriodLabel()}).`;
  });
  readonly dashboardTrendTitle = computed(() =>
    this.isPartnershipPage ? 'Evolution annuelle des partenariats' : 'Evolution annuelle des heures'
  );
  readonly dashboardTrendSubtitle = computed(() => {
    if (this.isPartnershipPage) {
      return "Nombre d'activites de partenariat par annee.";
    }
    return "Volume horaire total d'enseignement par annee.";
  });
  readonly dashboardPrimaryNote = computed(() => {
    if (this.isPartnershipPage) {
      const total = this.dashboardCourseCount();
      if (total === 0) {
        return 'Aucune activite de partenariat sur la periode active.';
      }
      return `${this.dashboardPartnershipAcademicCount()} academique(s) et ${this.dashboardPartnershipProfessionalCount()} professionnelle(s) declares.`;
    }

    const totalHours = this.dashboardTotalHours();
    if (this.dashboardCourseCount() === 0 || totalHours === 0) {
      return "Aucune activite d'enseignement exploitable sur la periode active.";
    }
    return `${totalHours.toFixed(1)} h cumulees sur ${this.dashboardModuleCount()} module(s) pour ${this.dashboardCourseCount()} declaration(s).`;
  });
  readonly teachingPrimaryChartData = computed<ChartData<'bar'>>(() => {
    if (this.isPartnershipPage) {
      return {
        labels: ['Academique', 'Professionnelle'],
        datasets: [
          {
            label: 'Partenariats',
            data: [
              this.dashboardPartnershipAcademicCount(),
              this.dashboardPartnershipProfessionalCount()
            ],
            backgroundColor: ['#dc2626', '#1d4ed8'],
            borderRadius: 10,
            maxBarThickness: 56
          }
        ]
      };
    }

    const semesterHours = this.dashboardHoursBySemester();
    return {
      labels: ['Semestre S1', 'Semestre S2', 'Annuel'],
      datasets: [
        {
          label: 'Heures',
          data: [
            semesterHours['S1'],
            semesterHours['S2'],
            this.dashboardAnnualHours()
          ],
          backgroundColor: ['#1d4ed8', '#0ea5e9', '#f59e0b'],
          borderRadius: 10,
          maxBarThickness: 56
        }
      ]
    };
  });
  readonly teachingTrendChartData = computed<ChartData<'line'>>(() => {
    const grouped = new Map<string, number>();

    const trendActivities = this.activities().filter((activity) =>
      this.isPartnershipPage ? this.isPartnershipActivity(activity, false) : !this.isPartnershipActivity(activity, false)
    );

    for (const activity of trendActivities) {
      const activityYear = (activity.academicYear ?? '').trim();
      if (!activityYear) {
        continue;
      }

      if (this.isPartnershipPage) {
        grouped.set(activityYear, (grouped.get(activityYear) ?? 0) + 1);
        continue;
      }

      const plannedHours = Number(activity.plannedHours ?? 0);
      const completedHours = Number(activity.completedHours ?? 0);
      const newCourseHours = Number(activity.newCourseHours ?? 0);
      const eveningHours = Number(activity.eveningOrSaturdayHours ?? 0);
      const totalHours = Math.max(plannedHours, completedHours) + newCourseHours + eveningHours;
      grouped.set(activityYear, (grouped.get(activityYear) ?? 0) + totalHours);
    }

    if (grouped.size === 0) {
      const insights = this.dashboardInsights();
      if (insights) {
        for (const snapshot of insights.yearlyPerformance ?? []) {
          const value = this.isPartnershipPage
            ? Number(snapshot.totalPartnershipActivities ?? 0)
            : Math.max(
                0,
                Number(snapshot.totalTeachingActivities ?? 0) - Number(snapshot.totalPartnershipActivities ?? 0)
              );
          grouped.set(snapshot.periodLabel, value);
        }
      }
    }

    const labels = [...grouped.keys()].sort((left, right) => this.compareAcademicYears(left, right));
    const values = labels.map((label) => grouped.get(label) ?? 0);

    return {
      labels,
      datasets: [
        {
          label: this.isPartnershipPage ? 'Partenariats' : 'Cours',
          data: values,
          borderColor: this.isPartnershipPage ? '#dc2626' : '#1d4ed8',
          backgroundColor: this.isPartnershipPage ? 'rgba(220, 38, 38, 0.2)' : 'rgba(29, 78, 216, 0.2)',
          fill: true,
          tension: 0.28,
          pointRadius: 3
        }
      ]
    };
  });
  readonly teachingDistributionChartData = computed<ChartData<'doughnut'>>(() => {
    if (this.isPartnershipPage) {
      return {
        labels: ['Academique', 'Professionnelle'],
        datasets: [
          {
            data: [this.dashboardPartnershipAcademicCount(), this.dashboardPartnershipProfessionalCount()],
            backgroundColor: ['#0f766e', '#f97316'],
            borderWidth: 0
          }
        ]
      };
    }

    const modeCounts = this.dashboardScopedActivities().reduce<Record<TeachingMode, number>>(
      (accumulator, activity) => {
        accumulator[activity.teachingMode] = (accumulator[activity.teachingMode] ?? 0) + 1;
        return accumulator;
      },
      {
        PRESENTIEL: 0,
        EN_LIGNE: 0,
        ALTERNANCE: 0,
        EXECUTIF: 0
      }
    );

    return {
      labels: ['Presentiel', 'En ligne', 'Alternance', 'Executif'],
      datasets: [
        {
          data: [
            modeCounts['PRESENTIEL'],
            modeCounts['EN_LIGNE'],
            modeCounts['ALTERNANCE'],
            modeCounts['EXECUTIF']
          ],
          backgroundColor: ['#1d4ed8', '#0ea5e9', '#f59e0b', '#7c3aed'],
          borderWidth: 0
        }
      ]
    };
  });

  readonly createForm = this.formBuilder.nonNullable.group({
    programName: ['', [Validators.required]],
    className: ['', [Validators.required]],
    moduleName: ['', [Validators.required]],
    semester: ['S1' as SemesterType, [Validators.required]],
    teachingMode: ['PRESENTIEL' as TeachingMode, [Validators.required]],
    language: ['Francais', [Validators.required]],
    plannedHours: [1, [Validators.required, Validators.min(1)]],
    completedHours: [0, [Validators.required, Validators.min(0)]],
    newCourseHours: [0, [Validators.min(0)]],
    courseRestructuringPercentage: [0, [Validators.min(0), Validators.max(100)]],
    syllabusCount: [0, [Validators.min(0)]],
    carFileElaborated: [false],
    examElaborated: [false],
    eveningOrSaturdayHours: [0, [Validators.min(0)]],
    coordination: [false],
    academicYear: ['2025-2026', [Validators.required]],
    partnershipDeclarationType: [null as PartnershipDeclarationType | null],
    syllabusPath: ['']
  });
  readonly editForm = this.formBuilder.nonNullable.group({
    programName: ['', [Validators.required]],
    className: ['', [Validators.required]],
    moduleName: ['', [Validators.required]],
    semester: ['S2' as SemesterType, [Validators.required]],
    teachingMode: ['PRESENTIEL' as TeachingMode, [Validators.required]],
    language: ['Francais', [Validators.required]],
    plannedHours: [1, [Validators.required, Validators.min(1)]],
    completedHours: [0, [Validators.required, Validators.min(0)]],
    newCourseHours: [0, [Validators.min(0)]],
    courseRestructuringPercentage: [0, [Validators.min(0), Validators.max(100)]],
    syllabusCount: [0, [Validators.min(0)]],
    carFileElaborated: [false],
    examElaborated: [false],
    eveningOrSaturdayHours: [0, [Validators.min(0)]],
    coordination: [false],
    academicYear: ['', [Validators.required]],
    partnershipDeclarationType: [null as PartnershipDeclarationType | null],
    syllabusPath: ['']
  });
  private readonly createFormValue = toSignal(this.createForm.valueChanges.pipe(startWith(this.createForm.getRawValue())), {
    initialValue: this.createForm.getRawValue()
  });
  private readonly editFormValue = toSignal(this.editForm.valueChanges.pipe(startWith(this.editForm.getRawValue())), {
    initialValue: this.editForm.getRawValue()
  });
  readonly createPointsPreview = computed(() =>
    this.buildPointsPreview(this.normalizeFormValueByType(this.createFormValue(), this.createActivityType()))
  );
  readonly editPointsPreview = computed(() =>
    this.buildPointsPreview(this.normalizeFormValueByType(this.editFormValue(), this.editActivityType()))
  );
  readonly createPreviewRows = computed(() =>
    this.buildPreviewRows(this.createPointsPreview(), this.createActivityType())
  );
  readonly editPreviewRows = computed(() =>
    this.buildPreviewRows(this.editPointsPreview(), this.editActivityType())
  );

  constructor() {
    if (this.isCreatePage && !this.canCreate()) {
      this.router.navigateByUrl(this.listPath);
      return;
    }

    this.applyActivityTypeToForm(this.createForm, this.createActivityType());
    this.applyActivityTypeToForm(this.editForm, this.editActivityType());
    this.syncProgramNameFromModule(this.createForm);
    this.syncProgramNameFromModule(this.editForm);

    if (this.isCreatePage && this.forcedActivityType) {
      this.createActivityType.set(this.forcedActivityType);
      this.applyActivityTypeToForm(this.createForm, this.forcedActivityType);
    }

    if (!this.isCreatePage) {
      this.loadActivities();
    }
  }

  loadActivities() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.teachingService
      .getTeachingActivities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (activities) => {
          const scopedActivities = this.applyRouteActivityFilter(activities);
          this.activities.set(scopedActivities);
          this.refreshDashboardInsights(scopedActivities);
          const currentSelectedId = this.selectedActivity()?.id;
          const nextSelected = scopedActivities.find((activity) => activity.id === currentSelectedId) ?? null;
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
          this.errorMessage.set(extractErrorMessage(error, 'Impossible de charger les enseignements.'));
        }
      });
  }

  createTeachingActivity() {
    if (!this.canCreate()) {
      this.errorMessage.set('Vous ne pouvez pas ajouter un enseignement depuis ce compte.');
      return;
    }

    if (this.createForm.invalid || this.saving()) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.buildPayload(this.createForm.getRawValue(), this.createActivityType());

    this.teachingService
      .createTeachingActivity(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toastService.success(
            this.isPartnershipPage ? 'Partenariat ajoute' : 'Enseignement ajoute',
            this.isPartnershipPage ? 'Le partenariat a ete cree avec succes.' : 'Le cours a ete cree avec succes.'
          );
          this.router.navigateByUrl(this.listPath);
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Creation de l'enseignement impossible."));
        }
      });
  }

  submitTeachingActivity(activity: TeachingActivityResponse) {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.teachingService
      .submitTeachingActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(`L'activite ${activity.moduleName} a ete soumise.`);
          this.loadActivities();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, 'Soumission impossible.'));
        }
      });
  }

  deleteTeachingActivity(activity: TeachingActivityResponse) {
    if (!this.canDelete(activity)) {
      this.errorMessage.set('Vous ne pouvez pas supprimer cet enseignement.');
      return;
    }

    if (!confirm(`Supprimer l'enseignement ${activity.moduleName} ?`)) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.teachingService
      .deleteTeachingActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(`L'activite ${activity.moduleName} a ete supprimee.`);
          this.loadActivities();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, 'Suppression impossible.'));
        }
      });
  }

  canSubmit(activity: TeachingActivityResponse) {
    const currentUserId = this.currentUserId();
    return (
      this.authService.hasAnyRole('ENSEIGNANT') &&
      currentUserId === activity.userId &&
      (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER')
    );
  }

  canDelete(activity: TeachingActivityResponse) {
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

  canEdit(activity: TeachingActivityResponse) {
    return this.canDelete(activity);
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateStatusFilter(value: string) {
    if (this.statusOptions.includes(value as (typeof this.statusOptions)[number])) {
      this.statusFilter.set(value as (typeof this.statusOptions)[number]);
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

  setCreateActivityType(value: string) {
    if (this.isActivityTypeLocked) {
      return;
    }

    if (!this.isTeachingActivityType(value)) {
      return;
    }

    this.createActivityType.set(value);
    this.applyActivityTypeToForm(this.createForm, value);
  }

  setEditActivityType(value: string) {
    if (this.isActivityTypeLocked) {
      return;
    }

    if (!this.isTeachingActivityType(value)) {
      return;
    }

    this.editActivityType.set(value);
    this.applyActivityTypeToForm(this.editForm, value);
  }

  setCreateModule(value: string) {
    this.syncProgramNameFromModule(this.createForm, value);
  }

  setEditModule(value: string) {
    this.syncProgramNameFromModule(this.editForm, value);
  }

  selectActivity(activity: TeachingActivityResponse) {
    this.selectedActivity.set(activity);
    if (this.editingActivityId() === activity.id) {
      this.patchEditForm(activity);
    }
    this.scrollToDetailSection();
  }

  startEditing(activity: TeachingActivityResponse) {
    if (!this.canEdit(activity)) {
      this.errorMessage.set('Vous ne pouvez pas modifier cet enseignement.');
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
    this.router.navigateByUrl(this.createPath);
  }

  goToListPage() {
    this.router.navigateByUrl(this.listPath);
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

    const payload = this.buildPayload(this.editForm.getRawValue(), this.editActivityType());

    this.teachingService
      .updateTeachingActivity(activity.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.editingActivityId.set(null);
          this.successMessage.set('Enseignement modifie avec succes.');
          this.loadActivities();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Modification de l'enseignement impossible."));
        }
      });
  }

  restructuringStatusLabel(status: TeachingRestructuringStatus) {
    switch (status) {
      case 'APPROVED':
        return 'Validee';
      case 'REJECTED':
        return 'Refusee';
      case 'PENDING':
        return 'En attente';
      default:
        return 'Aucune';
    }
  }

  activityTypeLabel(type: TeachingActivityDisplayType) {
    if (type === 'ACTIVITE_MIXTE') {
      return 'Activite mixte';
    }

    return this.teachingActivityTypes.find((option) => option.value === type)?.label ?? 'Enseignement du cours';
  }

  activityTypeDescription(type: TeachingActivityEntryType) {
    return this.teachingActivityTypes.find((option) => option.value === type)?.description ?? '';
  }

  activityDisplayType(activity: TeachingActivityResponse): TeachingActivityDisplayType {
    const activeTypes: TeachingActivityEntryType[] = [];

    if (this.isPartnershipActivity(activity, this.isPartnershipPage)) {
      activeTypes.push('PARTENARIAT');
    }
    if (Number(activity.plannedHours) > 0 || Number(activity.completedHours) > 0) {
      activeTypes.push('ENSEIGNEMENT_COURS');
    }
    if (Number(activity.newCourseHours) > 0) {
      activeTypes.push('NOUVEAU_COURS');
    }
    if (Number(activity.courseRestructuringPercentage) > 0) {
      activeTypes.push('RESTRUCTURATION_COURS');
    }
    if (Number(activity.syllabusCount) > 0) {
      activeTypes.push('ELABORATION_SYLLABUS');
    }
    if (activity.carFileElaborated) {
      activeTypes.push('FICHIER_CAR');
    }
    if (activity.examElaborated) {
      activeTypes.push('ELABORATION_EXAMEN');
    }
    if (Number(activity.eveningOrSaturdayHours) > 0) {
      activeTypes.push('COURS_SOIR_SAMEDI');
    }
    if (activity.coordination) {
      activeTypes.push('COORDINATION');
    }

    if (activeTypes.length > 1) {
      return 'ACTIVITE_MIXTE';
    }

    return activeTypes[0] ?? 'ENSEIGNEMENT_COURS';
  }

  activitySummary(activity: TeachingActivityResponse) {
    const type = this.activityDisplayType(activity);

    switch (type) {
      case 'ENSEIGNEMENT_COURS':
        return `${activity.completedHours} h / ${activity.plannedHours} h`;
      case 'NOUVEAU_COURS':
        return `${activity.newCourseHours} h de nouveau cours`;
      case 'RESTRUCTURATION_COURS':
        return `${activity.courseRestructuringPercentage}% proposes`;
      case 'ELABORATION_SYLLABUS':
        return `${activity.syllabusCount} syllabus`;
      case 'FICHIER_CAR':
        return 'Forfait fichier CAR';
      case 'ELABORATION_EXAMEN':
        return 'Forfait examen';
      case 'COURS_SOIR_SAMEDI':
        return `${activity.eveningOrSaturdayHours} h de soir / samedi`;
      case 'COORDINATION':
        return 'Forfait coordination';
      case 'PARTENARIAT':
        if (activity.partnershipDeclarationType == null) {
          return 'Declaration partenariat';
        }

        return `Declaration ${this.partnershipDeclarationTypeLabel(activity.partnershipDeclarationType)}`;
      default:
        return `${activity.points.declaredTotalPoints} pts declares`;
    }
  }

  activityPointRows(activity: TeachingActivityResponse): TeachingPointsRow[] {
    const rows: TeachingPointsRow[] = [];
    const displayType = this.activityDisplayType(activity);

    if (activity.points.coursePoints > 0 || displayType === 'ENSEIGNEMENT_COURS' || displayType === 'ACTIVITE_MIXTE') {
      rows.push({ label: 'Cours assures', value: activity.points.coursePoints });
    }
    if (activity.points.newCoursePoints > 0 || displayType === 'NOUVEAU_COURS' || displayType === 'ACTIVITE_MIXTE') {
      rows.push({ label: 'Nouveau cours', value: activity.points.newCoursePoints });
    }
    if (
      activity.points.declaredRestructuringPoints > 0 ||
      activity.points.approvedRestructuringPoints > 0 ||
      displayType === 'RESTRUCTURATION_COURS' ||
      displayType === 'ACTIVITE_MIXTE'
    ) {
      rows.push({ label: 'Restructuration declaree', value: activity.points.declaredRestructuringPoints });
      rows.push({ label: 'Restructuration retenue', value: activity.points.approvedRestructuringPoints });
    }
    if (activity.points.syllabusPoints > 0 || displayType === 'ELABORATION_SYLLABUS' || displayType === 'ACTIVITE_MIXTE') {
      rows.push({ label: 'Syllabus', value: activity.points.syllabusPoints });
    }
    if (activity.points.carFilePoints > 0 || displayType === 'FICHIER_CAR' || displayType === 'ACTIVITE_MIXTE') {
      rows.push({ label: 'Fichier CAR', value: activity.points.carFilePoints });
    }
    if (activity.points.examPoints > 0 || displayType === 'ELABORATION_EXAMEN' || displayType === 'ACTIVITE_MIXTE') {
      rows.push({ label: 'Examen', value: activity.points.examPoints });
    }
    if (
      activity.points.eveningOrSaturdayPoints > 0 ||
      displayType === 'COURS_SOIR_SAMEDI' ||
      displayType === 'ACTIVITE_MIXTE'
    ) {
      rows.push({ label: 'Soir / samedi', value: activity.points.eveningOrSaturdayPoints });
    }
    if (activity.points.coordinationPoints > 0 || displayType === 'COORDINATION' || displayType === 'ACTIVITE_MIXTE') {
      rows.push({ label: 'Coordination', value: activity.points.coordinationPoints });
    }
    if (activity.points.partnershipPoints > 0 || displayType === 'PARTENARIAT' || displayType === 'ACTIVITE_MIXTE') {
      rows.push({ label: 'Partenariat', value: activity.points.partnershipPoints });
    }

    return rows;
  }

  partnershipDeclarationTypeLabel(type: PartnershipDeclarationType | null) {
    if (type === 'PROFESSIONNELLE') {
      return 'Professionnelle';
    }
    if (type === 'ACADEMIQUE') {
      return 'Academique';
    }

    return 'Partenariat';
  }

  createPageTitle() {
    if (this.isPartnershipPage) {
      return 'Ajouter un partenariat';
    }

    return "Ajouter une activite d'enseignement";
  }

  createSubmitLabel() {
    if (this.isPartnershipPage) {
      return 'Enregistrer le partenariat';
    }

    return "Enregistrer l'enseignement";
  }

  listPageTitle() {
    if (this.isPartnershipPage) {
      return 'Declaration de partenariat';
    }

    return "Declaration d'enseignement";
  }

  listSectionTitle() {
    if (this.isPartnershipPage) {
      return 'Liste des declarations de partenariat';
    }

    return "Liste des activites d'enseignement";
  }

  pageEyebrow() {
    if (this.isPartnershipPage) {
      return 'Partenariat';
    }

    return 'Enseignement';
  }

  addButtonLabel() {
    if (this.isPartnershipPage) {
      return 'Ajouter un partenariat';
    }

    return 'Ajouter un enseignement';
  }

  hasRestructuringProposal(activity: TeachingActivityResponse) {
    return activity.courseRestructuringPercentage > 0;
  }

  private buildPayload(rawValue: TeachingFormValue, type: TeachingActivityEntryType): CreateTeachingActivityPayload {
    const value = this.normalizeFormValueByType(rawValue, type);

    return {
      programName: value.programName.trim(),
      className: value.className.trim(),
      moduleName: value.moduleName.trim(),
      semester: value.semester,
      teachingMode: value.teachingMode,
      language: value.language.trim(),
      plannedHours: Number(value.plannedHours),
      completedHours: Number(value.completedHours),
      newCourseHours: Number(value.newCourseHours),
      courseRestructuringPercentage: Number(value.courseRestructuringPercentage),
      syllabusCount: Number(value.syllabusCount),
      carFileElaborated: value.carFileElaborated,
      examElaborated: value.examElaborated,
      eveningOrSaturdayHours: Number(value.eveningOrSaturdayHours),
      coordination: value.coordination,
      academicYear: value.academicYear.trim(),
      partnershipDeclarationType: value.partnershipDeclarationType,
      syllabusPath: value.syllabusPath.trim() || null
    };
  }

  private buildPointsPreview(rawValue: TeachingFormValue): TeachingPointsBreakdown {
    const plannedHours = Number(rawValue.plannedHours ?? 0);
    const newCourseHours = Number(rawValue.newCourseHours ?? 0);
    const courseRestructuringPercentage = Number(rawValue.courseRestructuringPercentage ?? 0);
    const syllabusCount = Number(rawValue.syllabusCount ?? 0);
    const eveningOrSaturdayHours = Number(rawValue.eveningOrSaturdayHours ?? 0);
    const coursePoints = plannedHours;
    const newCoursePoints = newCourseHours * 1.5;
    const declaredRestructuringPoints = (courseRestructuringPercentage * 5) / 100;
    const syllabusPoints = syllabusCount;
    const carFilePoints = rawValue.carFileElaborated ? 10 : 0;
    const examPoints = rawValue.examElaborated ? 5 : 0;
    const eveningOrSaturdayPoints = eveningOrSaturdayHours * 1.5;
    const coordinationPoints = rawValue.coordination ? 5 : 0;
    const partnershipPoints =
      rawValue.partnershipDeclarationType == null ? 0 : rawValue.partnershipDeclarationType === 'PROFESSIONNELLE' ? 15 : 12;
    const declaredTotalPoints =
      coursePoints +
      newCoursePoints +
      declaredRestructuringPoints +
      syllabusPoints +
      carFilePoints +
      examPoints +
      eveningOrSaturdayPoints +
      coordinationPoints +
      partnershipPoints;

    return {
      coursePoints,
      newCoursePoints,
      declaredRestructuringPoints,
      approvedRestructuringPoints: 0,
      syllabusPoints,
      carFilePoints,
      examPoints,
      eveningOrSaturdayPoints,
      coordinationPoints,
      partnershipPoints,
      declaredTotalPoints,
      approvedTotalPoints: 0,
      restructuringStatus: courseRestructuringPercentage > 0 ? 'PENDING' : 'NOT_REQUESTED'
    };
  }

  private buildPreviewRows(points: TeachingPointsBreakdown, type: TeachingActivityEntryType): TeachingPointsRow[] {
    switch (type) {
      case 'ENSEIGNEMENT_COURS':
        return [{ label: 'Cours assures', value: points.coursePoints }];
      case 'NOUVEAU_COURS':
        return [{ label: 'Nouveau cours', value: points.newCoursePoints }];
      case 'RESTRUCTURATION_COURS':
        return [{ label: 'Restructuration declaree', value: points.declaredRestructuringPoints }];
      case 'ELABORATION_SYLLABUS':
        return [{ label: 'Syllabus', value: points.syllabusPoints }];
      case 'FICHIER_CAR':
        return [{ label: 'Fichier CAR', value: points.carFilePoints }];
      case 'ELABORATION_EXAMEN':
        return [{ label: 'Examen', value: points.examPoints }];
      case 'COURS_SOIR_SAMEDI':
        return [{ label: 'Soir / samedi', value: points.eveningOrSaturdayPoints }];
      case 'COORDINATION':
        return [{ label: 'Coordination', value: points.coordinationPoints }];
      case 'PARTENARIAT':
        return [{ label: 'Partenariat', value: points.partnershipPoints }];
      default:
        return [];
    }
  }

  private normalizeFormValue(rawValue: Partial<TeachingFormValue> | TeachingFormValue): TeachingFormValue {
    return {
      programName: rawValue.programName ?? '',
      className: rawValue.className ?? '',
      moduleName: rawValue.moduleName ?? '',
      semester: rawValue.semester ?? 'S1',
      teachingMode: rawValue.teachingMode ?? 'PRESENTIEL',
      language: rawValue.language ?? 'Francais',
      plannedHours: Number(rawValue.plannedHours ?? 1),
      completedHours: Number(rawValue.completedHours ?? 0),
      newCourseHours: Number(rawValue.newCourseHours ?? 0),
      courseRestructuringPercentage: Number(rawValue.courseRestructuringPercentage ?? 0),
      syllabusCount: Number(rawValue.syllabusCount ?? 0),
      carFileElaborated: Boolean(rawValue.carFileElaborated),
      examElaborated: Boolean(rawValue.examElaborated),
      eveningOrSaturdayHours: Number(rawValue.eveningOrSaturdayHours ?? 0),
      coordination: Boolean(rawValue.coordination),
      academicYear: rawValue.academicYear ?? '',
      partnershipDeclarationType: rawValue.partnershipDeclarationType ?? null,
      syllabusPath: rawValue.syllabusPath ?? ''
    };
  }

  private normalizeFormValueByType(
    rawValue: Partial<TeachingFormValue> | TeachingFormValue,
    type: TeachingActivityEntryType
  ): TeachingFormValue {
    const value = this.normalizeFormValue(rawValue);

    switch (type) {
      case 'ENSEIGNEMENT_COURS':
        return {
          ...value,
          newCourseHours: 0,
          courseRestructuringPercentage: 0,
          syllabusCount: 0,
          carFileElaborated: false,
          examElaborated: false,
          eveningOrSaturdayHours: 0,
          coordination: false,
          partnershipDeclarationType: null,
          syllabusPath: ''
        };
      case 'NOUVEAU_COURS':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          courseRestructuringPercentage: 0,
          syllabusCount: 0,
          carFileElaborated: false,
          examElaborated: false,
          eveningOrSaturdayHours: 0,
          coordination: false,
          partnershipDeclarationType: null,
          syllabusPath: ''
        };
      case 'RESTRUCTURATION_COURS':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          newCourseHours: 0,
          syllabusCount: 0,
          carFileElaborated: false,
          examElaborated: false,
          eveningOrSaturdayHours: 0,
          coordination: false,
          partnershipDeclarationType: null,
          syllabusPath: ''
        };
      case 'ELABORATION_SYLLABUS':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          newCourseHours: 0,
          courseRestructuringPercentage: 0,
          carFileElaborated: false,
          examElaborated: false,
          eveningOrSaturdayHours: 0,
          coordination: false,
          partnershipDeclarationType: null
        };
      case 'FICHIER_CAR':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          newCourseHours: 0,
          courseRestructuringPercentage: 0,
          syllabusCount: 0,
          carFileElaborated: true,
          examElaborated: false,
          eveningOrSaturdayHours: 0,
          coordination: false,
          partnershipDeclarationType: null,
          syllabusPath: ''
        };
      case 'ELABORATION_EXAMEN':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          newCourseHours: 0,
          courseRestructuringPercentage: 0,
          syllabusCount: 0,
          carFileElaborated: false,
          examElaborated: true,
          eveningOrSaturdayHours: 0,
          coordination: false,
          partnershipDeclarationType: null,
          syllabusPath: ''
        };
      case 'COURS_SOIR_SAMEDI':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          newCourseHours: 0,
          courseRestructuringPercentage: 0,
          syllabusCount: 0,
          carFileElaborated: false,
          examElaborated: false,
          coordination: false,
          partnershipDeclarationType: null,
          syllabusPath: ''
        };
      case 'COORDINATION':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          newCourseHours: 0,
          courseRestructuringPercentage: 0,
          syllabusCount: 0,
          carFileElaborated: false,
          examElaborated: false,
          eveningOrSaturdayHours: 0,
          coordination: true,
          partnershipDeclarationType: null,
          syllabusPath: ''
        };
      case 'PARTENARIAT':
        return {
          ...value,
          plannedHours: 0,
          completedHours: 0,
          newCourseHours: 0,
          courseRestructuringPercentage: 0,
          syllabusCount: 0,
          carFileElaborated: false,
          examElaborated: false,
          eveningOrSaturdayHours: 0,
          coordination: false,
          partnershipDeclarationType: value.partnershipDeclarationType ?? 'ACADEMIQUE',
          syllabusPath: ''
        };
    }
  }

  private applyActivityTypeToForm(form: FormGroup, type: TeachingActivityEntryType) {
    this.setControlValidators(form, 'plannedHours', type === 'ENSEIGNEMENT_COURS' ? [Validators.required, Validators.min(1)] : []);
    this.setControlValidators(form, 'completedHours', type === 'ENSEIGNEMENT_COURS' ? [Validators.required, Validators.min(0)] : []);
    this.setControlValidators(form, 'newCourseHours', type === 'NOUVEAU_COURS' ? [Validators.required, Validators.min(0.5)] : []);
    this.setControlValidators(
      form,
      'courseRestructuringPercentage',
      type === 'RESTRUCTURATION_COURS' ? [Validators.required, Validators.min(1), Validators.max(100)] : []
    );
    this.setControlValidators(form, 'syllabusCount', type === 'ELABORATION_SYLLABUS' ? [Validators.required, Validators.min(1)] : []);
    this.setControlValidators(
      form,
      'eveningOrSaturdayHours',
      type === 'COURS_SOIR_SAMEDI' ? [Validators.required, Validators.min(0.5)] : []
    );
    this.setControlValidators(
      form,
      'partnershipDeclarationType',
      type === 'PARTENARIAT' ? [Validators.required] : []
    );
  }

  private setControlValidators(form: FormGroup, controlName: keyof TeachingFormValue, validators: ValidatorFn[]) {
    const control = form.get(controlName as string);
    if (!control) {
      return;
    }

    control.setValidators(validators);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private isTeachingActivityType(value: string): value is TeachingActivityEntryType {
    return this.teachingActivityTypes.some((option) => option.value === value);
  }

  private parseTeachingActivityType(value: unknown): TeachingActivityEntryType | null {
    if (typeof value !== 'string') {
      return null;
    }

    return this.isTeachingActivityType(value) ? value : null;
  }

  private applyRouteActivityFilter(activities: TeachingActivityResponse[]) {
    if (this.activityListFilterType === 'PARTENARIAT') {
      return activities.filter((activity) => this.isPartnershipActivity(activity, true));
    }

    return activities;
  }

  private isPartnershipActivity(activity: TeachingActivityResponse, allowFallbackShape: boolean) {
    if (activity.partnershipDeclarationType != null) {
      return true;
    }

    if (Number(activity.points?.partnershipPoints ?? 0) > 0) {
      return true;
    }

    if (!allowFallbackShape) {
      return false;
    }

    const hasTeachingSignals =
      Number(activity.plannedHours) > 0 ||
      Number(activity.completedHours) > 0 ||
      Number(activity.newCourseHours) > 0 ||
      Number(activity.courseRestructuringPercentage) > 0 ||
      Number(activity.syllabusCount) > 0 ||
      activity.carFileElaborated ||
      activity.examElaborated ||
      Number(activity.eveningOrSaturdayHours) > 0 ||
      activity.coordination;

    return !hasTeachingSignals;
  }

  private compareActivitiesByRecency(first: TeachingActivityResponse, second: TeachingActivityResponse) {
    const firstCreatedAt = this.parseDateValue(first.createdAt);
    const secondCreatedAt = this.parseDateValue(second.createdAt);
    const createdAtDifference = secondCreatedAt - firstCreatedAt;
    if (createdAtDifference !== 0) {
      return createdAtDifference;
    }

    const firstUpdatedAt = this.parseDateValue(first.updatedAt);
    const secondUpdatedAt = this.parseDateValue(second.updatedAt);
    const updatedAtDifference = secondUpdatedAt - firstUpdatedAt;
    if (updatedAtDifference !== 0) {
      return updatedAtDifference;
    }

    return second.id - first.id;
  }

  private parseDateValue(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return 0;
    }

    return parsed;
  }

  private refreshDashboardInsights(activities: TeachingActivityResponse[]) {
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
        error: (error) => {
          this.dashboardInsights.set(null);
          this.dashboardInsightsLoading.set(false);
          this.dashboardInsightsError.set(
            extractErrorMessage(error, "Le dashboard d'activite n'a pas pu etre charge.")
          );
        }
      });
  }

  private resolveDashboardPeriodLabel(periodCandidates: Array<string | null | undefined>) {
    for (const candidate of periodCandidates) {
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }
    return this.defaultAcademicYear();
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

  private dashboardScopePartnershipStats() {
    const periodActivities = this.dashboardPeriodActivities().filter((activity) => this.isPartnershipActivity(activity, false));
    const total = periodActivities.length;
    const teacherCount = this.uniqueTeacherCount(periodActivities);
    const average = teacherCount > 0 ? total / teacherCount : 0;
    return { total, teacherCount, average };
  }

  private dashboardScopeTeachingWorkflowStats() {
    const periodActivities = this.dashboardPeriodActivities().filter(
      (activity) => !this.isPartnershipActivity(activity, false)
    );
    const submitted = periodActivities.filter((activity) => activity.status === 'SOUMISE').length;
    const validated = periodActivities.filter(
      (activity) => activity.status === 'VALIDEE_DEPARTEMENT' || activity.status === 'VALIDEE_FINALE'
    ).length;
    const rejected = periodActivities.filter((activity) => activity.status === 'REJETEE').length;
    return { total: periodActivities.length, submitted, validated, rejected };
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

  private uniqueTeacherCount(activities: TeachingActivityResponse[]) {
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

  private scrollToDetailSection() {
    scrollElementIntoViewOnNextFrame(() => this.detailSection()?.nativeElement);
  }

  private patchEditForm(activity: TeachingActivityResponse) {
    const detectedType = this.activityDisplayType(activity);
    const defaultType = detectedType === 'ACTIVITE_MIXTE' ? 'ENSEIGNEMENT_COURS' : detectedType;
    const editType = this.forcedActivityType ?? defaultType;

    this.editForm.patchValue({
      programName: activity.programName,
      className: activity.className,
      moduleName: activity.moduleName,
      semester: activity.semester,
      teachingMode: activity.teachingMode,
      language: activity.language,
      plannedHours: activity.plannedHours,
      completedHours: activity.completedHours,
      newCourseHours: activity.newCourseHours,
      courseRestructuringPercentage: activity.courseRestructuringPercentage,
      syllabusCount: activity.syllabusCount,
      carFileElaborated: activity.carFileElaborated,
      examElaborated: activity.examElaborated,
      eveningOrSaturdayHours: activity.eveningOrSaturdayHours,
      coordination: activity.coordination,
      academicYear: activity.academicYear,
      partnershipDeclarationType:
        editType === 'PARTENARIAT' ? activity.partnershipDeclarationType ?? 'ACADEMIQUE' : activity.partnershipDeclarationType,
      syllabusPath: activity.syllabusPath ?? ''
    });
    this.editActivityType.set(editType);
    this.applyActivityTypeToForm(this.editForm, editType);
    this.syncProgramNameFromModule(this.editForm);
  }

  private syncProgramNameFromModule(form: FormGroup, explicitModule?: string) {
    const moduleValue = explicitModule ?? String(form.get('moduleName')?.value ?? '').trim();
    const matchedOption = this.moduleFormationOptions.find((option) => option.module === moduleValue);

    if (matchedOption) {
      form.patchValue(
        {
          moduleName: matchedOption.module,
          programName: matchedOption.formation
        },
        { emitEvent: false }
      );
      return;
    }

    if (explicitModule != null) {
      form.patchValue(
        {
          moduleName: explicitModule,
          programName: ''
        },
        { emitEvent: false }
      );
    }
  }
}
