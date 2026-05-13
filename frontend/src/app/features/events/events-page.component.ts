import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { catchError, forkJoin, of } from 'rxjs';
import { PersonalDashboardResponse } from '../../core/models/dashboard.models';
import { CreateEventActivityPayload, EventActivityResponse, EventSummaryResponse } from '../../core/models/event.models';
import { EventType } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { EventService } from '../../core/services/event.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { scrollElementIntoViewOnNextFrame } from '../../core/utils/scroll.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

type EventTypeFilter = 'ALL' | EventType;
type ScientificRole = 'ORGANISATION' | 'MEMBRE';

@Component({
  selector: 'app-events-page',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, ChartPanelComponent],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);
  private readonly workflowService = inject(WorkflowService);

  readonly activities = signal<EventActivityResponse[]>([]);
  readonly summary = signal<EventSummaryResponse | null>(null);
  readonly dashboardInsights = signal<PersonalDashboardResponse | null>(null);
  readonly dashboardInsightsLoading = signal(false);
  readonly dashboardInsightsError = signal('');
  readonly dashboardPeriodLabel = signal(this.defaultAcademicYear());
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly eventTypes: EventType[] = ['SEMINAIRE', 'COLLOQUE', 'WORKSHOP', 'JOURNEE_SCIENTIFIQUE'];
  readonly eventTypeFilters: EventTypeFilter[] = ['ALL', 'SEMINAIRE', 'COLLOQUE', 'WORKSHOP', 'JOURNEE_SCIENTIFIQUE'];
  readonly scientificRoles: ScientificRole[] = ['ORGANISATION', 'MEMBRE'];

  readonly currentUserId = computed(() => this.authService.user()?.id ?? null);
  readonly currentRole = this.authService.role;
  readonly isCreatePage = this.route.snapshot.data['mode'] === 'create';
  readonly canCreate = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly isManagerDashboard = computed(() =>
    this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
  );
  readonly searchTerm = signal('');
  readonly typeFilter = signal<EventTypeFilter>('ALL');
  readonly showActivityDashboard = signal(true);
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly selectedActivity = signal<EventActivityResponse | null>(null);
  readonly editingActivityId = signal<number | null>(null);
  readonly detailSection = viewChild<ElementRef<HTMLElement>>('detailSection');

  readonly filteredActivities = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.typeFilter();

    return this.activities()
      .filter((activity) => {
        const normalizedType = this.normalizeEventType(activity.eventType);
        const matchesType = type === 'ALL' || normalizedType === type;
        const roleLabel = this.roleLabel(activity.eventType, activity.organizationRole).toLowerCase();
        const matchesTerm =
          term.length === 0 ||
          activity.title.toLowerCase().includes(term) ||
          activity.teacherName.toLowerCase().includes(term) ||
          this.typeLabel(activity.eventType).toLowerCase().includes(term) ||
          roleLabel.includes(term);

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
    this.filteredActivities().reduce((total, activity) => total + this.pointsForActivity(activity), 0)
  );
  readonly eventKpiTotals = computed(() => {
    const summary = this.summary();
    if (summary) {
      return {
        totalEvents: Number(summary.totalEvents ?? 0),
        totalSeminars: Number(summary.totalScientificEvents ?? 0),
        totalFormations: Number(summary.totalHackathons ?? 0),
        totalPoints: Number(summary.totalPoints ?? 0),
        totalSchoolActivities: Number(summary.totalSchoolActivities ?? 0)
      };
    }

    let totalEvents = 0;
    let totalSeminars = 0;
    let totalFormations = 0;
    let totalPoints = 0;
    let totalSchoolActivities = 0;

    for (const activity of this.activities()) {
      const normalizedType = this.normalizeEventType(activity.eventType);
      totalEvents += 1;
      totalPoints += this.pointsForActivity(activity);
      if (normalizedType === 'SEMINAIRE') {
        totalSeminars += 1;
      }
      if (normalizedType === 'WORKSHOP') {
        totalFormations += 1;
      }
      if (normalizedType === 'JOURNEE_SCIENTIFIQUE') {
        totalSchoolActivities += 1;
      }
    }

    return { totalEvents, totalSeminars, totalFormations, totalPoints, totalSchoolActivities };
  });
  readonly eventsComparisonTitle = computed(() =>
    this.isManagerDashboard()
      ? 'Comparatif evenement departement vs moyenne enseignant'
      : 'Comparatif evenement enseignant vs moyenne collegues'
  );
  readonly eventsComparisonSubtitle = computed(() =>
    this.isManagerDashboard()
      ? 'Volume total du perimetre visible et moyenne par enseignant.'
      : 'Mes evenements vs moyenne des evenements collegues.'
  );
  readonly eventsTrendSubtitle = computed(() =>
    this.isManagerDashboard()
      ? "Historique annuel des declarations d'evenements du perimetre."
      : "Historique de vos declarations d'evenements."
  );
  readonly eventsComparisonNote = computed(() => {
    if (this.isManagerDashboard()) {
      const stats = this.dashboardScopeEventStats();
      if (stats.total === 0) {
        return "Aucune declaration d'evenement disponible sur le perimetre actuel.";
      }
      return `Perimetre departemental: ${stats.total} evenement(s) sur ${stats.teacherCount} enseignant(s), moyenne ${this.formatAverage(stats.average)} par enseignant.`;
    }

    const insights = this.dashboardInsights();
    if (!insights) {
      return '';
    }

    const gap = insights.totalEventActivities - insights.colleagueEventActivitiesCount;
    if (gap === 0) {
      return 'Parite atteinte avec la moyenne des collegues dans cette activite.';
    }
    if (gap > 0) {
      return `Vous avez ${gap} evenement(s) de plus que la moyenne des collegues.`;
    }
    return `Vous avez ${Math.abs(gap)} evenement(s) de moins que la moyenne des collegues.`;
  });
  readonly eventsComparisonChartData = computed<ChartData<'bar'>>(() => {
    if (this.isManagerDashboard()) {
      const stats = this.dashboardScopeEventStats();
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
      labels: ['Mes evenements', 'Moyenne collegues'],
      datasets: [
        {
          label: 'Declarations',
          data: [insights?.totalEventActivities ?? 0, insights?.colleagueEventActivitiesCount ?? 0],
          backgroundColor: ['#dc2626', '#1d4ed8'],
          borderRadius: 10,
          maxBarThickness: 56
        }
      ]
    };
  });
  readonly eventsTrendChartData = computed<ChartData<'line'>>(() => {
    const historyFromActivitiesMap = this.activities().reduce<Record<string, number>>((accumulator, activity) => {
      const periodKey = this.normalizeAcademicYearLabel(activity.academicYear);
      if (!periodKey) {
        return accumulator;
      }
      accumulator[periodKey] = (accumulator[periodKey] ?? 0) + 1;
      return accumulator;
    }, {});
    const historyFromActivities = Object.entries(historyFromActivitiesMap)
      .map(([periodLabel, total]) => ({ periodLabel, totalEventActivities: total }))
      .sort((left, right) => this.compareAcademicYears(left.periodLabel, right.periodLabel));

    const insights = this.dashboardInsights();
    const historyFromInsights = [...(insights?.yearlyPerformance ?? [])].sort((left, right) =>
      this.compareAcademicYears(left.periodLabel, right.periodLabel)
    );
    const hasUsableInsightsHistory = historyFromInsights.some((entry) => Number(entry.totalEventActivities ?? 0) > 0);
    const sorted =
      hasUsableInsightsHistory || historyFromActivities.length === 0 ? historyFromInsights : historyFromActivities;

    return {
      labels: sorted.map((entry) => entry.periodLabel),
      datasets: [
        {
          label: 'Evenements',
          data: sorted.map((entry) => Number(entry.totalEventActivities ?? 0)),
          borderColor: '#ea580c',
          backgroundColor: 'rgba(234, 88, 12, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
  });

  readonly createForm = this.formBuilder.nonNullable.group({
    eventType: ['COLLOQUE' as EventType, [Validators.required]],
    title: ['', [Validators.required]],
    eventDate: ['', [Validators.required]],
    organizationRole: ['MEMBRE' as ScientificRole],
    academicYear: ['2025-2026', [Validators.required]]
  });

  readonly editForm = this.formBuilder.nonNullable.group({
    eventType: ['COLLOQUE' as EventType, [Validators.required]],
    title: ['', [Validators.required]],
    eventDate: ['', [Validators.required]],
    organizationRole: ['MEMBRE' as ScientificRole],
    academicYear: ['', [Validators.required]]
  });

  constructor() {
    if (this.isCreatePage && !this.canCreate()) {
      this.router.navigateByUrl('/events');
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
      activities: this.eventService.getEventActivities(),
      summary: this.eventService.getSummary().pipe(catchError(() => of(null)))
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
          this.summary.set(null);
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Impossible de charger les evenements.'));
        }
      });
  }

  createEvent() {
    if (!this.canCreate()) {
      this.errorMessage.set('Vous ne pouvez pas ajouter un evenement depuis ce compte.');
      return;
    }

    if (this.createForm.invalid || this.saving()) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.buildPayloadFromForm(this.createForm.getRawValue());

    this.eventService
      .createEventActivity(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toastService.success('Evenement ajoute', "L'evenement a ete cree avec succes.");
          this.router.navigateByUrl('/events');
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Creation de l'evenement impossible."));
        }
      });
  }

  canManage(activity: EventActivityResponse) {
    const currentRole = this.currentRole();
    if (currentRole === 'ADMINISTRATION' || currentRole === 'SUPER_ADMIN') {
      return true;
    }

    const currentUserId = this.currentUserId();
    return currentUserId === activity.userId && (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER');
  }

  canSubmit(activity: EventActivityResponse) {
    const currentUserId = this.currentUserId();
    return (
      this.authService.hasAnyRole('ENSEIGNANT') &&
      currentUserId === activity.userId &&
      (activity.status === 'BROUILLON' || activity.status === 'A_CORRIGER')
    );
  }

  submitActivity(activity: EventActivityResponse) {
    if (!this.canSubmit(activity)) {
      this.errorMessage.set('Vous ne pouvez pas soumettre cet evenement.');
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
          this.errorMessage.set(extractErrorMessage(error, "Soumission de l'evenement impossible."));
        }
      });
  }

  deleteEvent(activity: EventActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas supprimer cet evenement.');
      return;
    }

    if (!confirm(`Supprimer l'evenement ${activity.title} ?`)) {
      return;
    }

    this.eventService
      .deleteEventActivity(activity.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Evenement supprime avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.errorMessage.set(extractErrorMessage(error, "Suppression de l'evenement impossible."));
        }
      });
  }

  selectActivity(activity: EventActivityResponse) {
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

  startEditing(activity: EventActivityResponse) {
    if (!this.canManage(activity)) {
      this.errorMessage.set('Vous ne pouvez pas modifier cet evenement.');
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
    this.router.navigateByUrl('/events/new');
  }

  goToListPage() {
    this.router.navigateByUrl('/events');
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

    const payload = this.buildPayloadFromForm(this.editForm.getRawValue());

    this.eventService
      .updateEventActivity(activity.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.editingActivityId.set(null);
          this.successMessage.set('Evenement modifie avec succes.');
          this.loadData();
        },
        error: (error) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error, "Modification de l'evenement impossible."));
        }
      });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateTypeFilter(value: string) {
    if (this.eventTypeFilters.includes(value as EventTypeFilter)) {
      this.typeFilter.set(value as EventTypeFilter);
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

  filterTypeLabel(type: EventTypeFilter) {
    if (type === 'ALL') {
      return 'Tous les types';
    }
    return this.typeLabel(type);
  }

  typeLabel(type: EventType | null | undefined) {
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

  roleOptionLabel(role: ScientificRole) {
    return role === 'ORGANISATION' ? 'Organisation' : 'Membre';
  }

  roleLabel(type: EventType | null | undefined, role: string | null | undefined) {
    if (!this.isScientificEventType(type)) {
      return '-';
    }

    return this.normalizeScientificRole(role) === 'ORGANISATION' ? 'Organisation' : 'Membre';
  }

  isScientificEventType(type: EventType | null | undefined) {
    return this.normalizeEventType(type) === 'SEMINAIRE';
  }

  pointsPreview(type: EventType | null | undefined, role: string | null | undefined) {
    return this.computePoints(type, role);
  }

  pointsForActivity(activity: EventActivityResponse) {
    if (activity.activityPoints != null) {
      return Number(activity.activityPoints);
    }

    return this.computePoints(activity.eventType, activity.organizationRole);
  }

  private buildPayloadFromForm(rawValue: ReturnType<typeof this.createForm.getRawValue>): CreateEventActivityPayload {
    const normalizedType = this.normalizeEventType(rawValue.eventType);
    return {
      eventType: normalizedType,
      title: rawValue.title.trim(),
      eventDate: rawValue.eventDate,
      organizationRole: this.isScientificEventType(normalizedType) ? this.normalizeScientificRole(rawValue.organizationRole) : null,
      academicYear: rawValue.academicYear.trim()
    };
  }

  private compareActivitiesByRecency(first: EventActivityResponse, second: EventActivityResponse) {
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

  private refreshDashboardInsights(activities: EventActivityResponse[]) {
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
          this.dashboardInsightsError.set("Le dashboard evenement n'a pas pu etre charge.");
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

  private dashboardScopeEventStats() {
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

  private uniqueTeacherCount(activities: EventActivityResponse[]) {
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

  private patchEditForm(activity: EventActivityResponse) {
    const normalizedType = this.normalizeEventType(activity.eventType);
    this.editForm.patchValue({
      eventType: normalizedType,
      title: activity.title,
      eventDate: activity.eventDate,
      organizationRole: this.isScientificEventType(normalizedType)
        ? this.normalizeScientificRole(activity.organizationRole)
        : 'MEMBRE',
      academicYear: activity.academicYear
    });
  }

  private configureDynamicValidators(form: typeof this.createForm) {
    const applyValidators = () => {
      const scientificType = this.isScientificEventType(form.controls.eventType.value);
      form.controls.organizationRole.setValidators(scientificType ? [Validators.required] : []);

      if (!scientificType) {
        form.controls.organizationRole.setValue('MEMBRE', { emitEvent: false });
      }

      form.controls.organizationRole.updateValueAndValidity({ emitEvent: false });
    };

    applyValidators();

    form.controls.eventType.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      applyValidators();
    });
  }

  private normalizeEventType(type: EventType | null | undefined): EventType {
    if (!type) {
      return 'WORKSHOP';
    }

    return type === 'AUTRE' ? 'JOURNEE_SCIENTIFIQUE' : type;
  }

  private normalizeScientificRole(value: string | null | undefined): ScientificRole {
    const normalizedValue = (value ?? '').trim().toUpperCase();
    return normalizedValue === 'ORGANISATION' || normalizedValue === 'ORGANIZATION' ? 'ORGANISATION' : 'MEMBRE';
  }

  private computePoints(type: EventType | null | undefined, role: string | null | undefined) {
    if (this.isScientificEventType(type)) {
      return this.normalizeScientificRole(role) === 'ORGANISATION' ? 20 : 10;
    }

    return 10;
  }
}
