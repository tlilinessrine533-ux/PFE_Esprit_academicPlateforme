import { DatePipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from 'chart.js';
import { catchError, forkJoin, of, timeout } from 'rxjs';
import { ValidationDecision, ValidationHistoryResponse } from '../../core/models/validation.models';
import { WorkflowActivityResponse, WorkflowActivityType } from '../../core/models/workflow.models';
import { AuthService } from '../../core/services/auth.service';
import { ToastTone, UiToastService } from '../../core/services/ui-toast.service';
import { WorkflowService } from '../../core/services/workflow.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

type ReviewLevel = 'department' | 'final';
type ReviewActionDecision = Exclude<ValidationDecision, 'SOUMIS'>;
type ProgressState = 'done' | 'active' | 'pending' | 'blocked';

interface ReviewDraft {
  level: ReviewLevel;
  activity: WorkflowActivityResponse;
  decision: ReviewActionDecision;
}

interface WorkflowAlert {
  tone: 'warning' | 'success' | 'info';
  title: string;
  message: string;
}

interface WorkflowProgressStep {
  label: string;
  subtitle: string;
  state: ProgressState;
}

@Component({
  selector: 'app-workflow-page',
  imports: [DatePipe, ChartPanelComponent],
  templateUrl: './workflow-page.component.html',
  styleUrl: './workflow-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private readonly workflowService = inject(WorkflowService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);

  readonly accessibleActivities = signal<WorkflowActivityResponse[]>([]);
  readonly departmentPending = signal<WorkflowActivityResponse[]>([]);
  readonly finalPending = signal<WorkflowActivityResponse[]>([]);
  readonly validationHistory = signal<ValidationHistoryResponse[]>([]);
  readonly selectedActivity = signal<WorkflowActivityResponse | null>(null);
  readonly detailActivityId = signal<number | null>(null);
  readonly reviewDraft = signal<ReviewDraft | null>(null);
  readonly reviewComment = signal('');
  readonly loading = signal(false);
  readonly historyLoading = signal(false);
  readonly actionLoading = signal(false);
  readonly errorMessage = signal('');
  readonly timeoutNotice = signal('');
  readonly successMessage = signal('');
  readonly role = this.authService.role;
  readonly canDepartmentReview = computed(() => this.authService.hasAnyRole('CHEF_DEPARTEMENT'));
  readonly canFinalReview = computed(() => this.authService.hasAnyRole('ADMINISTRATION'));
  readonly requiresExplicitDetailSelection = computed(() => this.role() === 'CHEF_DEPARTEMENT');
  readonly workflowSearchTerm = signal('');
  readonly showInlineHistoryDetails = signal(false);
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly showFullDepartmentPending = signal(false);
  readonly showFullFinalPending = signal(false);
  readonly collapsedTimelineSize = 2;
  readonly showFullTimeline = signal(false);
  readonly showWorkflowDashboard = signal(true);
  private readonly workflowLoadTimeoutMs = 12000;
  private readonly workflowHistoryTimeoutMs = 10000;
  private loadCycle = 0;
  readonly selectedDetailActivity = computed(() => {
    const activity = this.selectedActivity();
    if (!activity) {
      return null;
    }

    return this.detailActivityId() === activity.id ? activity : null;
  });
  readonly accessibleFilteredActivities = computed(() => {
    const term = this.workflowSearchTerm().trim().toLowerCase();
    const filtered = term.length === 0
      ? this.accessibleActivities()
      : this.accessibleActivities().filter((activity) => {
          return (
            (activity.title ?? '').toLowerCase().includes(term) ||
            (activity.subtitle ?? '').toLowerCase().includes(term) ||
            (activity.summary ?? '').toLowerCase().includes(term) ||
            (activity.teacherName ?? '').toLowerCase().includes(term) ||
            this.activityTypeLabel(activity.activityType).toLowerCase().includes(term)
          );
        });

    return [...filtered].sort((first, second) => this.compareActivitiesByRecency(first, second));
  });
  readonly displayedAccessibleActivities = computed(() => {
    const filtered = this.accessibleFilteredActivities();
    if (this.showFullHistory() || filtered.length <= this.collapsedHistorySize) {
      return filtered;
    }

    return filtered.slice(0, this.collapsedHistorySize);
  });
  readonly hasHistoryToggle = computed(() => this.accessibleFilteredActivities().length > this.collapsedHistorySize);
  readonly historyToggleLabel = computed(() =>
    this.showFullHistory() ? "Masquer l'historique" : "Afficher tout l'historique"
  );
  readonly displayedDepartmentPending = computed(() => {
    const pending = this.departmentPending();
    if (this.showFullDepartmentPending() || pending.length <= this.collapsedHistorySize) {
      return pending;
    }

    return pending.slice(0, this.collapsedHistorySize);
  });
  readonly hasDepartmentPendingToggle = computed(() => this.departmentPending().length > this.collapsedHistorySize);
  readonly departmentPendingToggleLabel = computed(() =>
    this.showFullDepartmentPending() ? 'Masquer la liste' : 'Afficher toute la liste'
  );
  readonly displayedFinalPending = computed(() => {
    const pending = this.finalPending();
    if (this.showFullFinalPending() || pending.length <= this.collapsedHistorySize) {
      return pending;
    }

    return pending.slice(0, this.collapsedHistorySize);
  });
  readonly hasFinalPendingToggle = computed(() => this.finalPending().length > this.collapsedHistorySize);
  readonly finalPendingToggleLabel = computed(() =>
    this.showFullFinalPending() ? 'Masquer la liste' : 'Afficher toute la liste'
  );

  readonly historyTimeline = computed(() =>
    [...this.validationHistory()].sort(
      (left, right) => new Date(right.decidedAt).getTime() - new Date(left.decidedAt).getTime()
    )
  );
  readonly displayedHistoryTimeline = computed(() => {
    const timeline = this.historyTimeline();
    if (this.showFullTimeline() || timeline.length <= this.collapsedTimelineSize) {
      return timeline;
    }

    return timeline.slice(0, this.collapsedTimelineSize);
  });
  readonly hasTimelineToggle = computed(() => this.historyTimeline().length > this.collapsedTimelineSize);
  readonly timelineToggleLabel = computed(() =>
    this.showFullTimeline() ? "Masquer l'historique" : "Afficher tout l'historique"
  );
  readonly selectedLatestStep = computed(() => this.historyTimeline()[0] ?? null);
  readonly selectedLatestDecisionText = computed(() => this.selectedLatestStep()?.decision ?? 'Aucune');
  readonly selectedLatestActorText = computed(() => this.selectedLatestStep()?.actorName ?? 'Aucun');
  readonly selectedCommentCount = computed(
    () => this.historyTimeline().filter((step) => Boolean(step.commentText?.trim())).length
  );
  readonly workflowStatusCounts = computed(() => {
    const activities = this.accessibleFilteredActivities();
    let validated = 0;
    let rejected = 0;
    let pending = 0;

    for (const activity of activities) {
      if (activity.status === 'VALIDEE_FINALE') {
        validated += 1;
      } else if (activity.status === 'REJETEE') {
        rejected += 1;
      } else {
        pending += 1;
      }
    }

    return {
      total: activities.length,
      validated,
      rejected,
      pending
    };
  });
  readonly workflowStatusChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Validees', 'Rejetees', 'En attente'],
    datasets: [
      {
        data: [
          this.workflowStatusCounts().validated,
          this.workflowStatusCounts().rejected,
          this.workflowStatusCounts().pending
        ],
        backgroundColor: ['#16a34a', '#dc2626', '#f59e0b'],
        borderWidth: 0
      }
    ]
  }));
  readonly workflowTrendChartData = computed<ChartData<'line'>>(() => {
    const grouped = this.accessibleFilteredActivities().reduce<Record<string, number>>((accumulator, activity) => {
      const key = this.monthBucket(activity.createdAt);
      if (!key) {
        return accumulator;
      }

      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});

    const rows = Object.entries(grouped)
      .sort((left, right) => this.monthBucketSortKey(left[0]) - this.monthBucketSortKey(right[0]));

    return {
      labels: rows.map(([bucket]) => bucket),
      datasets: [
        {
          label: 'Activites',
          data: rows.map(([, total]) => total),
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(29, 78, 216, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
  });

  readonly selectedStatusMeta = computed(() => {
    const activity = this.selectedActivity();
    if (!activity) {
      return null;
    }

    switch (activity.status) {
      case 'BROUILLON':
        return {
          tone: 'info' as ToastTone,
          title: 'Brouillon en préparation',
          message: 'Cette activité doit encore être soumise par l’enseignant avant d’entrer dans le workflow.'
        };
      case 'SOUMISE':
        return {
          tone: 'warning' as ToastTone,
          title: 'En attente du département',
          message: 'Le dossier attend actuellement une décision du chef de département.'
        };
      case 'VALIDEE_DEPARTEMENT':
        return {
          tone: 'warning' as ToastTone,
          title: 'En attente finale',
          message: 'La validation départementale est terminée. Le dossier attend maintenant l’administration.'
        };
      case 'VALIDEE_FINALE':
        return {
          tone: 'success' as ToastTone,
          title: 'Workflow terminé',
          message: 'Toutes les validations ont été complétées avec succès.'
        };
      case 'A_CORRIGER':
        return {
          tone: 'warning' as ToastTone,
          title: 'Retour pour correction',
          message: 'Un validateur a demandé des ajustements avant de poursuivre le workflow.'
        };
      case 'REJETEE':
        return {
          tone: 'error' as ToastTone,
          title: 'Dossier rejeté',
          message: 'Le dossier a été rejeté et ne peut pas avancer tant qu’une nouvelle action n’est pas engagée.'
        };
      default:
        return null;
    }
  });

  readonly selectedProgressSteps = computed(() => {
    const activity = this.selectedActivity();
    const latestStep = this.selectedLatestStep();

    if (!activity) {
      return [] as WorkflowProgressStep[];
    }

    if (activity.status === 'BROUILLON') {
      return [
        { label: 'Déclaration', subtitle: 'Brouillon en cours', state: 'active' },
        { label: 'Validation départementale', subtitle: 'En attente de soumission', state: 'pending' },
        { label: 'Validation finale', subtitle: 'Non démarrée', state: 'pending' }
      ];
    }

    if (activity.status === 'SOUMISE') {
      return [
        { label: 'Déclaration', subtitle: 'Soumission enregistrée', state: 'done' },
        { label: 'Validation départementale', subtitle: 'Décision attendue', state: 'active' },
        { label: 'Validation finale', subtitle: 'Non démarrée', state: 'pending' }
      ];
    }

    if (activity.status === 'VALIDEE_DEPARTEMENT') {
      return [
        { label: 'Déclaration', subtitle: 'Soumission enregistrée', state: 'done' },
        { label: 'Validation départementale', subtitle: 'Étape validée', state: 'done' },
        { label: 'Validation finale', subtitle: 'Décision attendue', state: 'active' }
      ];
    }

    if (activity.status === 'VALIDEE_FINALE') {
      return [
        { label: 'Déclaration', subtitle: 'Soumission enregistrée', state: 'done' },
        { label: 'Validation départementale', subtitle: 'Étape validée', state: 'done' },
        { label: 'Validation finale', subtitle: 'Validation finale confirmée', state: 'done' }
      ];
    }

    if (activity.status === 'A_CORRIGER') {
      return [
        { label: 'Déclaration', subtitle: 'Correction demandée', state: 'active' },
        {
          label: 'Validation départementale',
          subtitle: latestStep?.validationLevel === 'ADMINISTRATION' ? 'Retour depuis l’administration' : 'Retour depuis le département',
          state: 'blocked'
        },
        { label: 'Validation finale', subtitle: 'Suspendue jusqu’à correction', state: 'pending' }
      ];
    }

    return [
      { label: 'Déclaration', subtitle: 'Soumission enregistrée', state: 'done' },
      {
        label: 'Validation départementale',
        subtitle: latestStep?.validationLevel === 'ADMINISTRATION' ? 'Étape départementale validée' : 'Rejetée',
        state: latestStep?.validationLevel === 'ADMINISTRATION' ? 'done' : 'blocked'
      },
      {
        label: 'Validation finale',
        subtitle: latestStep?.validationLevel === 'ADMINISTRATION' ? 'Rejetée' : 'Non atteinte',
        state: latestStep?.validationLevel === 'ADMINISTRATION' ? 'blocked' : 'pending'
      }
    ];
  });

  readonly reviewTone = computed(() => this.decisionTone(this.reviewDraft()?.decision ?? 'VALIDE'));
  readonly reviewTitle = computed(() => {
    const draft = this.reviewDraft();
    if (!draft) {
      return '';
    }

    const scope = draft.level === 'department' ? 'validation départementale' : 'validation finale';
    return `${this.decisionLabel(draft.decision)} - ${scope}`;
  });
  readonly reviewRequiresComment = computed(() => {
    const decision = this.reviewDraft()?.decision;
    return decision === 'A_CORRIGER' || decision === 'REJETE';
  });

  readonly workflowAlerts = computed(() => {
    const alerts: WorkflowAlert[] = [];

    if (this.departmentPending().length > 0 && this.canDepartmentReview()) {
      alerts.push({
        tone: 'warning',
        title: 'Validation départementale en attente',
        message: `${this.departmentPending().length} dossier(s) attendent une décision du chef de département.`
      });
    }

    if (this.finalPending().length > 0 && this.canFinalReview()) {
      alerts.push({
        tone: 'warning',
        title: 'Validation finale en attente',
        message: `${this.finalPending().length} dossier(s) attendent une décision de l’administration.`
      });
    }

    if (this.departmentPending().length === 0 && this.finalPending().length === 0) {
      alerts.push({
        tone: 'success',
        title: 'Workflow à jour',
        message: 'Aucune activité n’est actuellement en attente de validation.'
      });
    }

    return alerts;
  });

  readonly roleHint = computed(() => {
    switch (this.role()) {
      case 'CHEF_DEPARTEMENT':
        return 'Vous traitez ici les soumissions du département avant la validation finale.';
      case 'ADMINISTRATION':
        return 'Vous traitez ici les validations finales et vous consultez l’historique complet.';
      case 'SUPER_ADMIN':
        return 'Vous pouvez consulter l’ensemble du workflow et intervenir à tous les niveaux.';
      default:
        return 'Vous consultez ici le suivi des validations de toutes vos activités.';
    }
  });

  constructor() {
    const presetSearch = this.route.snapshot.queryParamMap.get('q')?.trim();
    if (presetSearch) {
      this.workflowSearchTerm.set(presetSearch);
    }

    const decisionHint = this.route.snapshot.queryParamMap.get('decision');
    if (presetSearch && decisionHint && this.canDepartmentReview()) {
      this.toastService.info(
        'Filtre applique',
        `Resultats pre-filtres sur "${presetSearch}". Finalisez la decision dans la liste workflow.`
      );
    }

    this.loadData();
  }

  loadData() {
    const cycle = ++this.loadCycle;
    this.loading.set(true);
    this.errorMessage.set('');
    this.timeoutNotice.set('');

    const departmentRequest = this.canDepartmentReview()
      ? this.workflowService.getDepartmentPendingActivities().pipe(
          timeout({ first: this.workflowLoadTimeoutMs }),
          catchError((error: unknown) => this.handleSectionFallback('Validation departementale', error))
        )
      : of([] as WorkflowActivityResponse[]);

    const finalRequest = this.canFinalReview()
      ? this.workflowService.getFinalPendingActivities().pipe(
          timeout({ first: this.workflowLoadTimeoutMs }),
          catchError((error: unknown) => this.handleSectionFallback('Validation finale', error))
        )
      : of([] as WorkflowActivityResponse[]);

    forkJoin({
      department: departmentRequest,
      final: finalRequest
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ department, final }) => {
          if (cycle !== this.loadCycle) {
            return;
          }

          const scopedActivities = this.mergeUniqueActivities(department, final);
          this.departmentPending.set(department);
          this.finalPending.set(final);
          this.accessibleActivities.set(scopedActivities);
          this.loading.set(false);
          this.reconcileSelection(scopedActivities);
          this.loadFullActivitiesInBackground(cycle, department, final);
        },
        error: (error) => {
          if (cycle !== this.loadCycle) {
            return;
          }

          this.loading.set(false);
          const message = extractErrorMessage(error, "Le workflow n'a pas pu etre charge.");
          this.errorMessage.set(message);
          this.toastService.error('Workflow indisponible', message);
        }
      });
  }

  private loadFullActivitiesInBackground(
    cycle: number,
    department: WorkflowActivityResponse[],
    final: WorkflowActivityResponse[]
  ) {
    this.workflowService
      .getActivities()
      .pipe(timeout({ first: this.workflowLoadTimeoutMs }))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (activities) => {
          if (cycle !== this.loadCycle) {
            return;
          }

          const scopedActivities = activities.length > 0 ? activities : this.mergeUniqueActivities(department, final);
          this.accessibleActivities.set(scopedActivities);
          this.reconcileSelection(scopedActivities);
        },
        error: (error: unknown) => {
          if (cycle !== this.loadCycle) {
            return;
          }

          if (this.isTimeoutError(error)) {
            const message = 'Chargement complet en retard. Les dossiers en attente restent disponibles.';
            this.timeoutNotice.set(message);
            this.toastService.warning('Chargement partiel', message);
            return;
          }

          const message = extractErrorMessage(error, 'Le workflow n a pas pu etre charge.');
          if (this.accessibleActivities().length === 0) {
            this.errorMessage.set(message);
          }
          this.toastService.error('Workflow indisponible', message);
        }
      });
  }

  updateWorkflowSearchTerm(value: string) {
    this.workflowSearchTerm.set(value);
  }

  toggleHistoryVisibility() {
    if (!this.hasHistoryToggle()) {
      return;
    }

    this.showFullHistory.update((value) => !value);
  }

  toggleDepartmentPendingVisibility() {
    if (!this.hasDepartmentPendingToggle()) {
      return;
    }

    this.showFullDepartmentPending.update((value) => !value);
  }

  toggleFinalPendingVisibility() {
    if (!this.hasFinalPendingToggle()) {
      return;
    }

    this.showFullFinalPending.update((value) => !value);
  }

  toggleTimelineVisibility() {
    if (!this.hasTimelineToggle()) {
      return;
    }

    this.showFullTimeline.update((value) => !value);
  }

  toggleWorkflowDashboard() {
    this.showWorkflowDashboard.update((value) => !value);
  }

  inspectHistory(activity: WorkflowActivityResponse, options?: { openDetail?: boolean }) {
    this.selectedActivity.set(activity);
    this.detailActivityId.set(options?.openDetail ? activity.id : null);
    this.historyLoading.set(true);
    this.showFullTimeline.set(false);
    this.errorMessage.set('');

    this.workflowService
      .getValidationHistory(activity.id)
      .pipe(timeout({ first: this.workflowHistoryTimeoutMs }))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (history) => {
          this.validationHistory.set(history);
          this.historyLoading.set(false);
        },
        error: (error) => {
          this.historyLoading.set(false);
          const message = this.isTimeoutError(error)
            ? 'Historique indisponible: delai de reponse depasse.'
            : extractErrorMessage(error, 'Historique de validation indisponible.');
          this.errorMessage.set(message);
          this.toastService.warning('Historique indisponible', message);
        }
      });
  }

  openActivityInsights(activity: WorkflowActivityResponse) {
    const current = this.selectedActivity();
    const isSameActivity = current != null && current.id === activity.id;
    if (this.showInlineHistoryDetails() && isSameActivity) {
      this.showInlineHistoryDetails.set(false);
      return;
    }

    this.showInlineHistoryDetails.set(true);
    this.inspectHistory(activity);
    this.scrollToHistoryAndDetails();
  }

  reviewDepartment(activity: WorkflowActivityResponse, decision: ReviewActionDecision) {
    this.startReview('department', activity, decision);
  }

  reviewFinal(activity: WorkflowActivityResponse, decision: ReviewActionDecision) {
    this.startReview('final', activity, decision);
  }

  updateReviewComment(value: string) {
    this.reviewComment.set(value);
  }

  closeReview() {
    this.reviewDraft.set(null);
    this.reviewComment.set('');
  }

  submitReview() {
    const draft = this.reviewDraft();
    if (!draft || this.actionLoading()) {
      return;
    }

    const commentText = this.reviewComment().trim();
    if (this.reviewRequiresComment() && commentText.length === 0) {
      const message = 'Un commentaire est obligatoire pour demander une correction ou rejeter un dossier.';
      this.errorMessage.set(message);
      this.toastService.warning('Commentaire requis', message);
      return;
    }

    this.actionLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const request =
      draft.level === 'department'
        ? this.workflowService.departmentReviewActivity(draft.activity.id, { decision: draft.decision, commentText })
        : this.workflowService.finalReviewActivity(draft.activity.id, { decision: draft.decision, commentText });

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.closeReview();
        this.successMessage.set(`Décision enregistrée pour ${draft.activity.title}.`);
        this.toastService.success(
          'Décision enregistrée',
          `${this.decisionLabel(draft.decision)} appliquée à ${draft.activity.title}.`
        );
        this.loadData();
      },
      error: (error) => {
        this.actionLoading.set(false);
        const message = extractErrorMessage(error, 'La décision n’a pas pu être enregistrée.');
        this.errorMessage.set(message);
        this.toastService.error('Décision impossible', message);
      }
    });
  }

  decisionTone(decision: ReviewActionDecision): ToastTone {
    switch (decision) {
      case 'VALIDE':
        return 'success';
      case 'A_CORRIGER':
        return 'warning';
      case 'REJETE':
        return 'error';
      default:
        return 'info';
    }
  }

  decisionLabel(decision: ReviewActionDecision) {
    switch (decision) {
      case 'VALIDE':
        return 'Validation';
      case 'A_CORRIGER':
        return 'Retour pour correction';
      case 'REJETE':
        return 'Rejet';
      default:
        return decision;
    }
  }

  statusTone(status: WorkflowActivityResponse['status']) {
    switch (status) {
      case 'VALIDEE_FINALE':
        return 'success';
      case 'VALIDEE_DEPARTEMENT':
      case 'SOUMISE':
      case 'A_CORRIGER':
        return 'warning';
      case 'REJETEE':
        return 'error';
      default:
        return 'info';
    }
  }

  historyDecisionTone(decision: ValidationDecision) {
    if (decision === 'VALIDE') {
      return 'success';
    }

    if (decision === 'A_CORRIGER') {
      return 'warning';
    }

    if (decision === 'REJETE') {
      return 'error';
    }

    return 'info';
  }

  activityTypeLabel(type: WorkflowActivityType) {
    switch (type) {
      case 'TEACHING':
        return 'Enseignement';
      case 'SUPERVISION':
        return 'Encadrement';
      case 'RESEARCH':
        return 'Recherche';
      case 'EVENT':
        return 'Événement';
      case 'RESPONSIBILITY':
        return 'Responsabilité';
      case 'LEAVE_REQUEST':
        return 'Conge';
      case 'MISSION_REQUEST':
        return 'Mission';
      case 'EXAM_SURVEILLANCE':
        return 'Surveillance';
      default:
        return 'Activité';
    }
  }

  private startReview(level: ReviewLevel, activity: WorkflowActivityResponse, decision: ReviewActionDecision) {
    this.reviewDraft.set({ level, activity, decision });
    this.reviewComment.set('');
    this.successMessage.set('');
    this.errorMessage.set('');
    this.inspectHistory(activity);
    this.toastService.info('Décision à préparer', `Vérifiez le dossier ${activity.title} puis confirmez votre décision.`);
  }

  private clearSelection() {
    this.showInlineHistoryDetails.set(false);
    this.selectedActivity.set(null);
    this.detailActivityId.set(null);
    this.validationHistory.set([]);
    this.showFullTimeline.set(false);
  }

  private reconcileSelection(scopedActivities: WorkflowActivityResponse[]) {
    if (scopedActivities.length > 0) {
      const currentSelectedId = this.selectedActivity()?.id;
      const nextSelected =
        currentSelectedId == null
          ? null
          : scopedActivities.find((activity) => activity.id === currentSelectedId) ?? null;

      if (nextSelected) {
        this.inspectHistory(nextSelected, { openDetail: this.detailActivityId() === nextSelected.id });
      } else {
        this.clearSelection();
      }
      return;
    }

    this.clearSelection();
    this.reviewDraft.set(null);
  }

  private scrollToHistoryAndDetails() {
    const doc = this.document;
    const tryScroll = (remainingAttempts: number) => {
      const historySection = doc.getElementById('workflow-history-section');
      const detailSection = doc.getElementById('workflow-detail-section');
      const target = historySection ?? detailSection;

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (remainingAttempts > 0) {
        setTimeout(() => tryScroll(remainingAttempts - 1), 70);
      }
    };

    setTimeout(() => tryScroll(10), 0);
  }

  private compareActivitiesByRecency(first: WorkflowActivityResponse, second: WorkflowActivityResponse) {
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
    if (!value) {
      return 0;
    }

    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private monthBucket(value: string) {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
  }

  private monthBucketSortKey(value: string) {
    const [yearToken, monthToken] = value.split('-');
    const year = Number.parseInt(yearToken ?? '', 10);
    const month = Number.parseInt(monthToken ?? '', 10);

    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      return Number.MIN_SAFE_INTEGER;
    }

    return year * 100 + month;
  }

  private handleSectionFallback(sectionTitle: string, error: unknown) {
    const message = this.isTimeoutError(error)
      ? 'Delai de reponse depasse.'
      : extractErrorMessage(error, `${sectionTitle} indisponible.`);
    this.toastService.warning('Section indisponible', `${sectionTitle}: ${message}`);
    return of([] as WorkflowActivityResponse[]);
  }

  private mergeUniqueActivities(
    primary: WorkflowActivityResponse[],
    secondary: WorkflowActivityResponse[]
  ) {
    const index = new Map<number, WorkflowActivityResponse>();
    [...primary, ...secondary].forEach((activity) => {
      const current = index.get(activity.id);
      if (!current || this.compareActivitiesByRecency(activity, current) < 0) {
        index.set(activity.id, activity);
      }
    });

    return [...index.values()].sort((left, right) => this.compareActivitiesByRecency(left, right));
  }

  private isTimeoutError(error: unknown) {
    return (
      typeof error === 'object'
      && error !== null
      && 'name' in error
      && (error as { name?: string }).name === 'TimeoutError'
    );
  }
}


