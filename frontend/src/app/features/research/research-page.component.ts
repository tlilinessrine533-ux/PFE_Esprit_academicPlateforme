import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { PersonalDashboardResponse } from '../../core/models/dashboard.models';
import {
  CreateResearchActivityPayload,
  PublicationType,
  ResearchActivityResponse,
  ResearchPublicationRank,
  ResearchSummaryResponse
} from '../../core/models/research.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ResearchService } from '../../core/services/research.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { scrollElementIntoViewOnNextFrame } from '../../core/utils/scroll.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

@Component({
  selector: 'app-research-page',
  imports: [ReactiveFormsModule, DecimalPipe, ChartPanelComponent],
  templateUrl: './research-page.component.html',
  styleUrl: './research-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly researchService = inject(ResearchService);
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);
  private readonly workflowService = inject(WorkflowService);

  readonly activities = signal<ResearchActivityResponse[]>([]);
  readonly summary = signal<ResearchSummaryResponse | null>(null);
  readonly dashboardInsights = signal<PersonalDashboardResponse | null>(null);
  readonly dashboardInsightsLoading = signal(false);
  readonly dashboardInsightsError = signal('');
  readonly dashboardPeriodLabel = signal(this.defaultAcademicYear());
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly researchTypes: PublicationType[] = [
    'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE',
    'PROJET_RECHERCHE_ARTICLE_CONFERENCE',
    'PUBLICATION_ARTICLE',
    'PRESENTATION_TRAVAIL'
  ];
  readonly typeFilters = [
    'ALL',
    'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE',
    'PROJET_RECHERCHE_ARTICLE_CONFERENCE',
    'PUBLICATION_ARTICLE',
    'PRESENTATION_TRAVAIL'
  ] as const;
  readonly publicationRanks: ResearchPublicationRank[] = ['Q1', 'Q2', 'Q3', 'Q4', 'CONFERENCE'];

  readonly currentUserId = computed(() => this.authService.user()?.id ?? null);
  readonly currentRole = this.authService.role;
  readonly isCreatePage = this.route.snapshot.data['mode'] === 'create';
  readonly canCreate = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly isManagerDashboard = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly showTeacherIdentity = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly searchTerm = signal('');
  readonly typeFilter = signal<(typeof this.typeFilters)[number]>('ALL');
  readonly showActivityDashboard = signal(true);
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly selectedActivity = signal<ResearchActivityResponse | null>(null);
  readonly editingActivityId = signal<number | null>(null);
  readonly detailSection = viewChild<ElementRef<HTMLElement>>('detailSection');

  readonly filteredActivities = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.typeFilter();

    return this.activities()
      .filter((activity) => {
        const normalizedType = this.normalizeType(activity.publicationType);
        const matchesType = type === 'ALL' || normalizedType === type;
        const matchesTerm =
          term.length === 0 ||
          activity.title.toLowerCase().includes(term) ||
          activity.venueName.toLowerCase().includes(term) ||
          activity.teacherName.toLowerCase().includes(term) ||
          (activity.studentName ?? '').toLowerCase().includes(term) ||
          (activity.deliverable ?? '').toLowerCase().includes(term) ||
          (activity.doi ?? '').toLowerCase().includes(term) ||
          activity.academicYear.toLowerCase().includes(term);

        return matchesType && matchesTerm;
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
    this.displayedActivities().reduce((total, activity) => total + Number(this.pointsForActivity(activity)), 0)
  );
  readonly visiblePublicationCount = computed(
    () =>
      this.displayedActivities().filter((activity) => this.normalizeType(activity.publicationType) === 'PUBLICATION_ARTICLE').length
  );
  readonly researchTypeBreakdown = computed(() => {
    const periodActivities = this.dashboardPeriodActivities();
    let developmentProjects = 0;
    let researchProjects = 0;
    let publications = 0;
    let presentations = 0;

    for (const activity of periodActivities) {
      const normalizedType = this.normalizeType(activity.publicationType);
      switch (normalizedType) {
        case 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE':
          developmentProjects += 1;
          break;
        case 'PROJET_RECHERCHE_ARTICLE_CONFERENCE':
          researchProjects += 1;
          break;
        case 'PRESENTATION_TRAVAIL':
          presentations += 1;
          break;
        case 'PUBLICATION_ARTICLE':
        default:
          publications += 1;
          break;
      }
    }

    return { developmentProjects, researchProjects, publications, presentations, total: periodActivities.length };
  });
  readonly researchComparisonTitle = computed(() => "Comparatif des types d'activite");
  readonly researchComparisonSubtitle = computed(
    () => "Repartition des 4 types: projet developpement, projet recherche, publication et presentation."
  );
  readonly researchTrendSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Historique annuel des declarations de recherche du perimetre.'
      : 'Historique de vos declarations de recherche.'
  );
  readonly researchComparisonNote = computed(() => {
    const stats = this.researchTypeBreakdown();
    if (stats.total === 0) {
      return 'Aucune declaration de recherche disponible sur la periode active.';
    }
    return `${stats.developmentProjects} projet(s) developpement, ${stats.researchProjects} projet(s) recherche, ${stats.publications} publication(s) et ${stats.presentations} presentation(s).`;
  });
  readonly researchComparisonChartData = computed<ChartData<'bar'>>(() => {
    const stats = this.researchTypeBreakdown();
    return {
      labels: ['Projet dev', 'Projet recherche', 'Publications', 'Presentations'],
      datasets: [
        {
          label: 'Activites',
          data: [stats.developmentProjects, stats.researchProjects, stats.publications, stats.presentations],
          backgroundColor: ['#0284c7', '#0f766e', '#2563eb', '#ea580c'],
          borderRadius: 10,
          maxBarThickness: 48
        }
      ]
    };
  });
  readonly researchDistributionChartData = computed<ChartData<'doughnut'>>(() => {
    const stats = this.researchTypeBreakdown();
    return {
      labels: ['Projet developpement', 'Projet recherche', 'Publication', 'Presentation'],
      datasets: [
        {
          data: [stats.developmentProjects, stats.researchProjects, stats.publications, stats.presentations],
          backgroundColor: ['#0ea5e9', '#14b8a6', '#2563eb', '#f97316'],
          borderWidth: 0
        }
      ]
    };
  });
  readonly researchTrendChartData = computed<ChartData<'line'>>(() => {
    const historyFromActivitiesMap = this.activities().reduce<Record<string, number>>((accumulator, activity) => {
      const periodKey = this.normalizeAcademicYearLabel(activity.academicYear);
      if (!periodKey) {
        return accumulator;
      }
      accumulator[periodKey] = (accumulator[periodKey] ?? 0) + 1;
      return accumulator;
    }, {});
    const historyFromActivities = Object.entries(historyFromActivitiesMap)
      .map(([periodLabel, total]) => ({ periodLabel, totalResearchActivities: total }))
      .sort((left, right) => this.compareAcademicYears(left.periodLabel, right.periodLabel));

    const insights = this.dashboardInsights();
    const historyFromInsights = [...(insights?.yearlyPerformance ?? [])].sort((left, right) =>
      this.compareAcademicYears(left.periodLabel, right.periodLabel)
    );
    const hasUsableInsightsHistory = historyFromInsights.some((entry) => Number(entry.totalResearchActivities ?? 0) > 0);
    const sorted =
      hasUsableInsightsHistory || historyFromActivities.length === 0 ? historyFromInsights : historyFromActivities;

    return {
      labels: sorted.map((entry) => entry.periodLabel),
      datasets: [
        {
          label: 'Recherches',
          data: sorted.map((entry) => Number(entry.totalResearchActivities ?? 0)),
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
  });

  readonly createForm = this.formBuilder.nonNullable.group({
    publicationType: ['PROJET_DEVELOPPEMENT_UNITE_RECHERCHE' as PublicationType, [Validators.required]],
    title: ['', [Validators.required]],
    venueName: [''],
    publicationYear: [new Date().getFullYear()],
    indexingName: [''],
    doi: [''],
    studentName: [''],
    pfeLevel: [''],
    deliverable: [''],
    publicationRank: ['Q3' as ResearchPublicationRank],
    academicYear: ['2025-2026', [Validators.required]]
  });

  readonly editForm = this.formBuilder.nonNullable.group({
    publicationType: ['PROJET_DEVELOPPEMENT_UNITE_RECHERCHE' as PublicationType, [Validators.required]],
    title: ['', [Validators.required]],
    venueName: [''],
    publicationYear: [new Date().getFullYear()],
    indexingName: [''],
    doi: [''],
    studentName: [''],
    pfeLevel: [''],
    deliverable: [''],
    publicationRank: ['Q3' as ResearchPublicationRank],
    academicYear: ['', [Validators.required]]
  });

  constructor() {
    if (this.isCreatePage && !this.canCreate()) {
      this.router.navigateByUrl('/research');
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
      activities: this.researchService.getResearchActivities(),
      summary: this.researchService.getSummary()
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
          this.errorMessage.set(extractErrorMessage(error, 'Impossible de charger les recherches.'));
        }
      });
  }

  createResearch() {
    if (!this.canCreate()) {
      this.errorMessage.set('Vous ne pouvez pas ajouter une activite de recherche depuis ce compte.');
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

    const typeError = this.validateTypeSpecificInputs(this.createForm.getRawValue());
    if (typeError) {
      this.errorMessage.set(typeError);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.buildPayloadFromForm(this.createForm.getRawValue());

    this.researchService
      .createResearchActivity(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toastService.success('Recherche ajoutee', "L'activite de recherche a ete creee avec succes.");
          this.router.navigateByUrl('/research');
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Creation de l'activite de recherche impossible."));
        }
      });
  }

  deleteResearch(activity: ResearchActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas supprimer cette activite.');
      return;
    }

    if (!confirm(`Supprimer l'activite ${activity.title} ?`)) {
      return;
    }

    this.researchService
      .deleteResearchActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Activite de recherche supprimee avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, "Suppression de l'activite de recherche impossible."));
        }
      });
  }

  submitActivity(activity: ResearchActivityResponse) {
    if (!this.canSubmit(activity)) {
      this.errorMessage.set('Vous ne pouvez pas soumettre cette activite.');
      return;
    }

    this.workflowService
      .submitActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set(`L'activite ${activity.title} a ete soumise.`);
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, "Soumission de l'activite de recherche impossible."));
        }
      });
  }

  canManage(activity: ResearchActivityResponse) {
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

  canSubmit(activity: ResearchActivityResponse) {
    const currentUserId = this.currentUserId();
    return (
      this.authService.hasAnyRole('ENSEIGNANT') &&
      currentUserId === activity.userId &&
      (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER')
    );
  }

  selectActivity(activity: ResearchActivityResponse) {
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

  startEditing(activity: ResearchActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas modifier cette activite.');
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
    this.router.navigateByUrl('/research/new');
  }

  goToListPage() {
    this.router.navigateByUrl('/research');
  }

  saveEdit() {
    const editingId = this.editingActivityId();
    if (!editingId) {
      this.errorMessage.set('Aucune activite selectionnee pour la modification.');
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

    const typeError = this.validateTypeSpecificInputs(this.editForm.getRawValue());
    if (typeError) {
      this.errorMessage.set(typeError);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.buildPayloadFromForm(this.editForm.getRawValue());

    this.researchService
      .updateResearchActivity(editingId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.editingActivityId.set(null);
          this.successMessage.set('Activite de recherche modifiee avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Modification de l'activite de recherche impossible."));
        }
      });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateTypeFilter(value: string) {
    if (this.typeFilters.includes(value as (typeof this.typeFilters)[number])) {
      this.typeFilter.set(value as (typeof this.typeFilters)[number]);
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

  filterTypeLabel(type: (typeof this.typeFilters)[number]) {
    if (type === 'ALL') {
      return 'Tous les types';
    }
    return this.typeLabel(type);
  }

  typeLabel(type: PublicationType | null | undefined) {
    const normalized = this.normalizeType(type);
    switch (normalized) {
      case 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE':
        return "Projet de developpement (encadrement pro)";
      case 'PROJET_RECHERCHE_ARTICLE_CONFERENCE':
        return 'Projet de recherche (article/conference)';
      case 'PUBLICATION_ARTICLE':
        return "Publication d'articles";
      case 'PRESENTATION_TRAVAIL':
        return "Presentation d'un travail";
      default:
        return normalized;
    }
  }

  rankLabel(rank: ResearchPublicationRank | null | undefined) {
    if (!rank) {
      return '-';
    }
    return rank === 'CONFERENCE' ? 'Conference' : rank;
  }

  pointsPreview(type: PublicationType | null | undefined, rank: ResearchPublicationRank | null | undefined) {
    return this.computePoints(this.normalizeType(type), rank);
  }

  pointsForActivity(activity: ResearchActivityResponse) {
    if (activity.activityPoints != null) {
      return Number(activity.activityPoints);
    }
    return this.computePoints(this.normalizeType(activity.publicationType), activity.publicationRank);
  }

  isDevelopmentType(type: PublicationType | null | undefined) {
    return this.normalizeType(type) === 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE';
  }

  isResearchProjectType(type: PublicationType | null | undefined) {
    return this.normalizeType(type) === 'PROJET_RECHERCHE_ARTICLE_CONFERENCE';
  }

  isPublicationType(type: PublicationType | null | undefined) {
    return this.normalizeType(type) === 'PUBLICATION_ARTICLE';
  }

  isPresentationType(type: PublicationType | null | undefined) {
    return this.normalizeType(type) === 'PRESENTATION_TRAVAIL';
  }

  detailLine(activity: ResearchActivityResponse) {
    const normalizedType = this.normalizeType(activity.publicationType);

    if (normalizedType === 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE') {
      const student = activity.studentName?.trim() || '-';
      const level = activity.pfeLevel?.trim() || '-';
      return `Etudiant: ${student} | Niveau: ${level}`;
    }

    if (normalizedType === 'PUBLICATION_ARTICLE') {
      return `${this.rankLabel(activity.publicationRank)} | ${activity.venueName}`;
    }

    return activity.venueName;
  }

  private buildPayloadFromForm(rawValue: ReturnType<typeof this.createForm.getRawValue>): CreateResearchActivityPayload {
    const normalizedType = this.normalizeType(rawValue.publicationType);
    const venueName = rawValue.venueName.trim();
    const studentName = rawValue.studentName.trim();
    const pfeLevel = rawValue.pfeLevel.trim();
    const deliverable = rawValue.deliverable.trim();
    const indexingName = rawValue.indexingName.trim();
    const doi = rawValue.doi.trim();
    const publicationYear = Number(rawValue.publicationYear);

    return {
      publicationType: normalizedType,
      title: rawValue.title.trim(),
      venueName: venueName || null,
      publicationYear: Number.isFinite(publicationYear) ? publicationYear : null,
      indexingName: this.isPublicationType(normalizedType) ? indexingName || null : null,
      doi: this.isPublicationType(normalizedType) ? doi || null : null,
      studentName: this.isDevelopmentType(normalizedType) ? studentName || null : null,
      pfeLevel: this.isDevelopmentType(normalizedType) ? pfeLevel || null : null,
      deliverable: this.isDevelopmentType(normalizedType) ? deliverable || null : null,
      publicationRank: this.isPublicationType(normalizedType) ? rawValue.publicationRank : null,
      academicYear: rawValue.academicYear.trim()
    };
  }

  private validateTypeSpecificInputs(rawValue: ReturnType<typeof this.createForm.getRawValue>) {
    const normalizedType = this.normalizeType(rawValue.publicationType);

    if (this.isDevelopmentType(normalizedType)) {
      if (!rawValue.studentName.trim()) {
        return "Le champ 'Etudiant' est obligatoire pour ce type.";
      }
      if (!rawValue.pfeLevel.trim()) {
        return "Le champ 'Niveau' est obligatoire pour ce type.";
      }
      if (!rawValue.deliverable.trim()) {
        return "Le champ 'Livrable' est obligatoire pour ce type.";
      }
    }

    if (this.isPublicationType(normalizedType) && !rawValue.publicationRank) {
      return 'Le classement (Q1..Q4 ou Conference) est obligatoire.';
    }

    return null;
  }

  private computePoints(type: PublicationType, rank: ResearchPublicationRank | null | undefined) {
    if (type === 'PROJET_DEVELOPPEMENT_UNITE_RECHERCHE') {
      return 50;
    }
    if (type === 'PROJET_RECHERCHE_ARTICLE_CONFERENCE') {
      return 120;
    }
    if (type === 'PRESENTATION_TRAVAIL') {
      return 10;
    }

    const multiplier = (() => {
      switch (rank ?? 'Q3') {
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

  private normalizeType(type: PublicationType | null | undefined): PublicationType {
    if (!type) {
      return 'PUBLICATION_ARTICLE';
    }

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

  private compareActivitiesByRecency(first: ResearchActivityResponse, second: ResearchActivityResponse) {
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

  private refreshDashboardInsights(activities: ResearchActivityResponse[]) {
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
          this.dashboardInsightsError.set("Le dashboard recherche n'a pas pu etre charge.");
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

  private dashboardScopeResearchStats() {
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

  private uniqueTeacherCount(activities: ResearchActivityResponse[]) {
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

  private patchEditForm(activity: ResearchActivityResponse) {
    const normalizedType = this.normalizeType(activity.publicationType);
    this.editForm.patchValue({
      publicationType: normalizedType,
      title: activity.title,
      venueName: activity.venueName,
      publicationYear: activity.publicationYear || new Date().getFullYear(),
      indexingName: activity.indexingName ?? '',
      doi: activity.doi ?? '',
      studentName: activity.studentName ?? '',
      pfeLevel: activity.pfeLevel ?? '',
      deliverable: activity.deliverable ?? '',
      publicationRank: activity.publicationRank ?? (activity.publicationType === 'CONFERENCE' ? 'CONFERENCE' : 'Q3'),
      academicYear: activity.academicYear
    });
  }

  private configureDynamicValidators(form: typeof this.createForm) {
    const applyValidators = () => {
      const normalizedType = this.normalizeType(form.controls.publicationType.value);

      const publicationYearValidators = this.isPublicationType(normalizedType)
        ? [Validators.required, Validators.min(2000), Validators.max(2100)]
        : [Validators.min(2000), Validators.max(2100)];
      form.controls.publicationYear.setValidators(publicationYearValidators);

      form.controls.publicationRank.setValidators(this.isPublicationType(normalizedType) ? [Validators.required] : []);

      form.controls.studentName.setValidators(this.isDevelopmentType(normalizedType) ? [Validators.required] : []);
      form.controls.pfeLevel.setValidators(this.isDevelopmentType(normalizedType) ? [Validators.required] : []);
      form.controls.deliverable.setValidators(this.isDevelopmentType(normalizedType) ? [Validators.required] : []);

      form.controls.publicationYear.updateValueAndValidity({ emitEvent: false });
      form.controls.publicationRank.updateValueAndValidity({ emitEvent: false });
      form.controls.studentName.updateValueAndValidity({ emitEvent: false });
      form.controls.pfeLevel.updateValueAndValidity({ emitEvent: false });
      form.controls.deliverable.updateValueAndValidity({ emitEvent: false });
    };

    applyValidators();

    form.controls.publicationType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        applyValidators();
      });
  }

  private invalidFormMessage(form: typeof this.createForm) {
    const labels: Record<keyof ReturnType<typeof form.getRawValue>, string> = {
      publicationType: "Type d'activite",
      title: 'Titre',
      venueName: 'Revue ou conference',
      publicationYear: 'Annee de publication',
      indexingName: 'Indexation',
      doi: 'DOI',
      studentName: 'Etudiant',
      pfeLevel: 'Niveau',
      deliverable: 'Livrable',
      publicationRank: 'Classement',
      academicYear: 'Annee universitaire'
    };

    const invalidEntry = Object.entries(form.controls).find(([, control]) => control.invalid);
    if (!invalidEntry) {
      return 'Veuillez verifier les informations saisies.';
    }

    const [fieldName] = invalidEntry as [keyof ReturnType<typeof form.getRawValue>, unknown];
    return `Veuillez verifier le champ "${labels[fieldName] ?? String(fieldName)}".`;
  }
}
