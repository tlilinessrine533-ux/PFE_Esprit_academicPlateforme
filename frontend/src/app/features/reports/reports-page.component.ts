import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartData } from 'chart.js';
import { forkJoin, of } from 'rxjs';
import { Department } from '../../core/models/shared.models';
import { ReportFormat, ReportResponse, ReportType } from '../../core/models/report.models';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { UsersService } from '../../core/services/users.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

type GenerationAction =
  | 'individual-pdf'
  | 'individual-excel'
  | 'department-pdf'
  | 'department-excel'
  | 'institution-pdf'
  | 'institution-excel';

@Component({
  selector: 'app-reports-page',
  imports: [ReactiveFormsModule, DatePipe, ChartPanelComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reportService = inject(ReportService);
  private readonly toastService = inject(UiToastService);
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);

  readonly reports = signal<ReportResponse[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(false);
  readonly generatingAction = signal<GenerationAction | null>(null);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly searchTerm = signal('');
  readonly showReportsDashboard = signal(true);
  readonly formatFilters = ['ALL', 'PDF', 'EXCEL'] as const;
  readonly typeFilters = [
    'ALL',
    'INDIVIDUEL_ANNUEL',
    'SEMESTRIEL',
    'PROMOTION_ACADEMIQUE',
    'PRIME_PERFORMANCE',
    'DEPARTEMENTAL',
    'INSTITUTIONNEL'
  ] as const;
  readonly formatFilter = signal<(typeof this.formatFilters)[number]>('ALL');
  readonly typeFilter = signal<(typeof this.typeFilters)[number]>('ALL');
  readonly collapsedHistorySize = 2;
  readonly showFullHistory = signal(false);
  readonly currentUser = this.authService.user;
  readonly isAdministration = computed(() => this.authService.hasAnyRole('ADMINISTRATION'));
  readonly isSuperAdmin = computed(() => this.authService.hasAnyRole('SUPER_ADMIN'));
  readonly isDepartmentHead = computed(() => this.authService.hasAnyRole('CHEF_DEPARTEMENT'));
  readonly canGenerateIndividual = computed(() => this.authService.hasAnyRole('ENSEIGNANT'));
  readonly canGenerateDepartment = computed(() => this.authService.hasAnyRole('CHEF_DEPARTEMENT'));
  readonly canGenerateInstitution = computed(() => this.authService.hasAnyRole('ADMINISTRATION', 'SUPER_ADMIN'));
  readonly canSelectDepartment = computed(() => false);
  readonly visibleReports = computed(() => {
    if (this.isSuperAdmin()) {
      return this.reports();
    }

    if (this.isAdministration()) {
      return this.reports().filter((report) => this.isGlobalReport(report));
    }

    if (this.isDepartmentHead()) {
      const currentDepartmentId = this.currentUser()?.departmentId;
      return this.reports().filter(
        (report) => report.reportType === 'DEPARTEMENTAL' && report.departmentId === currentDepartmentId
      );
    }

    return this.reports().filter((report) => report.reportType === 'INDIVIDUEL_ANNUEL');
  });
  readonly selectedDepartmentLabel = computed(() => {
    const selectedId = this.reportForm.getRawValue().departmentId;
    if (!selectedId) {
      return this.currentUser()?.departmentName ?? 'Aucun département sélectionné';
    }

    return this.departments().find((department) => String(department.id) === selectedId)?.name ?? 'Département sélectionné';
  });
  readonly filteredReports = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const format = this.formatFilter();
    const type = this.typeFilter();

    return this.visibleReports()
      .filter((report) => {
        const matchesFormat = format === 'ALL' || report.reportFormat === format;
        const matchesType = type === 'ALL' || report.reportType === type;
        const matchesTerm =
          term.length === 0 ||
          report.periodLabel.toLowerCase().includes(term) ||
          report.reportType.toLowerCase().includes(term) ||
          (report.departmentName ?? '').toLowerCase().includes(term);

        return matchesFormat && matchesType && matchesTerm;
      })
      .sort((first, second) => this.compareReportsByRecency(first, second));
  });
  readonly displayedReports = computed(() => {
    const filtered = this.filteredReports();
    if (this.showFullHistory() || filtered.length <= this.collapsedHistorySize) {
      return filtered;
    }

    return filtered.slice(0, this.collapsedHistorySize);
  });
  readonly hasHistoryToggle = computed(() => this.filteredReports().length > this.collapsedHistorySize);
  readonly historyToggleLabel = computed(() =>
    this.showFullHistory() ? "Masquer l'historique" : "Afficher tout l'historique"
  );
  readonly latestReport = computed(() => this.filteredReports()[0] ?? this.visibleReports()[0] ?? null);
  readonly totalPdfReports = computed(() => this.visibleReports().filter((report) => report.reportFormat === 'PDF').length);
  readonly totalExcelReports = computed(() => this.visibleReports().filter((report) => report.reportFormat === 'EXCEL').length);
  readonly distinctPeriodsCount = computed(() => new Set(this.visibleReports().map((report) => report.periodLabel)).size);
  readonly typeBreakdown = computed(() => {
    const groups = new Map<ReportType, number>();
    this.visibleReports().forEach((report) => {
      groups.set(report.reportType, (groups.get(report.reportType) ?? 0) + 1);
    });

    return Array.from(groups.entries()).map(([type, count]) => ({
      type,
      count
    }));
  });
  readonly periodBreakdown = computed(() => {
    const groups = new Map<string, number>();
    this.visibleReports().forEach((report) => {
      groups.set(report.periodLabel, (groups.get(report.periodLabel) ?? 0) + 1);
    });

    return Array.from(groups.entries())
      .map(([periodLabel, count]) => ({ periodLabel, count }))
      .sort((left, right) => right.periodLabel.localeCompare(left.periodLabel))
      .slice(0, 5);
  });
  readonly reportFormatChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['PDF', 'Excel'],
    datasets: [
      {
        data: [this.totalPdfReports(), this.totalExcelReports()],
        backgroundColor: ['#1d4ed8', '#f97316'],
        borderColor: ['rgba(29, 78, 216, 0.9)', 'rgba(249, 115, 22, 0.9)'],
        borderWidth: 1
      }
    ]
  }));
  readonly reportTypeChartData = computed<ChartData<'bar'>>(() => {
    const rows = this.typeBreakdown()
      .slice()
      .sort((left, right) => right.count - left.count);

    return {
      labels: rows.map((row) => this.reportTypeLabel(row.type)),
      datasets: [
        {
          label: 'Rapports',
          data: rows.map((row) => row.count),
          backgroundColor: ['#dc2626', '#1d4ed8', '#7c3aed', '#0f766e', '#f59e0b', '#ea580c', '#475569'],
          borderRadius: 8,
          maxBarThickness: 36
        }
      ]
    };
  });
  readonly monthlyReportBreakdown = computed(() => {
    const parsedDates = this.visibleReports()
      .map((report) => this.parseDateValue(report.generatedAt))
      .filter((value) => value > 0);
    const anchorDate = new Date(parsedDates.length > 0 ? Math.max(...parsedDates) : Date.now());
    const labels = this.buildTrailingMonthLabels(6, anchorDate);
    const buckets = new Map(labels.map((label) => [label, 0]));

    this.visibleReports().forEach((report) => {
      const monthKey = this.monthKeyFromDate(report.generatedAt);
      if (!monthKey || !buckets.has(monthKey)) {
        return;
      }

      buckets.set(monthKey, (buckets.get(monthKey) ?? 0) + 1);
    });

    return labels.map((label) => ({
      monthLabel: label,
      count: buckets.get(label) ?? 0
    }));
  });
  readonly reportPeriodTrendChartData = computed<ChartData<'line'>>(() => {
    const rows = this.monthlyReportBreakdown();

    return {
      labels: rows.map((row) => row.monthLabel),
      datasets: [
        {
          label: 'Rapports generes',
          data: rows.map((row) => row.count),
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(29, 78, 216, 0.18)',
          pointBackgroundColor: '#1d4ed8',
          pointRadius: 3,
          fill: true,
          tension: 0.28
        }
      ]
    };
  });

  readonly reportForm = this.formBuilder.nonNullable.group({
    periodLabel: ['2025-2026', [Validators.required]],
    departmentId: ['']
  });

  constructor() {
    this.loadPageData();
  }

  loadPageData() {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      reports: this.reportService.getReports(),
      departments: this.canSelectDepartment() ? this.usersService.getDepartments() : of([] as Department[])
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ reports, departments }) => {
          this.reports.set(reports);
          this.departments.set(departments);
          this.prefillDepartmentIfNeeded(departments);
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          const message = extractErrorMessage(error, 'Impossible de charger les rapports.');
          this.errorMessage.set(message);
          this.toastService.error('Rapports indisponibles', message);
        }
      });
  }

  generatePdf() {
    if (!this.validateBaseForm()) {
      return;
    }

    this.runGeneration(
      'individual-pdf',
      () => this.reportService.generatePdf(this.reportForm.getRawValue().periodLabel),
      'Rapport PDF prêt',
      'Le rapport PDF individuel a été généré et téléchargé.'
    );
  }

  generateExcel() {
    if (!this.validateBaseForm()) {
      return;
    }

    this.runGeneration(
      'individual-excel',
      () => this.reportService.generateExcel(this.reportForm.getRawValue().periodLabel),
      'Rapport Excel prêt',
      'Le rapport Excel individuel a été généré et téléchargé.'
    );
  }

  generateDepartmentPdf() {
    const departmentId = this.resolveDepartmentIdForDepartmentReport();
    if (departmentId === undefined) {
      return;
    }

    this.runGeneration(
      'department-pdf',
      () => this.reportService.generateDepartmentPdf(this.reportForm.getRawValue().periodLabel, departmentId),
      'Rapport départemental PDF prêt',
      'Le rapport départemental PDF a été généré et téléchargé.'
    );
  }

  generateDepartmentExcel() {
    const departmentId = this.resolveDepartmentIdForDepartmentReport();
    if (departmentId === undefined) {
      return;
    }

    this.runGeneration(
      'department-excel',
      () => this.reportService.generateDepartmentExcel(this.reportForm.getRawValue().periodLabel, departmentId),
      'Rapport départemental Excel prêt',
      'Le rapport départemental Excel a été généré et téléchargé.'
    );
  }

  generateInstitutionPdf() {
    if (!this.validateBaseForm()) {
      return;
    }

    this.runGeneration(
      'institution-pdf',
      () => this.reportService.generateInstitutionPdf(this.reportForm.getRawValue().periodLabel),
      'Rapport institutionnel PDF prêt',
      'Le rapport institutionnel PDF a été généré et téléchargé.'
    );
  }

  generateInstitutionExcel() {
    if (!this.validateBaseForm()) {
      return;
    }

    this.runGeneration(
      'institution-excel',
      () => this.reportService.generateInstitutionExcel(this.reportForm.getRawValue().periodLabel),
      'Rapport institutionnel Excel prêt',
      'Le rapport institutionnel Excel a été généré et téléchargé.'
    );
  }

  downloadReport(report: ReportResponse) {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.reportService
      .downloadReport(report.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.reportService.saveResponseFile(response);
          this.successMessage.set('Le rapport a été téléchargé.');
          this.toastService.success('Rapport téléchargé', 'Le rapport a été téléchargé avec succès.');
        },
        error: (error) => {
          const message = extractErrorMessage(error, 'Téléchargement du rapport impossible.');
          this.errorMessage.set(message);
          this.toastService.error('Téléchargement impossible', message);
        }
      });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  updateFormatFilter(value: string) {
    if (this.formatFilters.includes(value as (typeof this.formatFilters)[number])) {
      this.formatFilter.set(value as (typeof this.formatFilters)[number]);
    }
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

  toggleReportsDashboard() {
    this.showReportsDashboard.update((value) => !value);
  }

  reportFormatTone(format: ReportFormat) {
    return format === 'PDF' ? 'brand' : 'accent';
  }

  reportTypeLabel(type: ReportType | 'ALL') {
    if (type === 'ALL') {
      return 'Tous les types';
    }

    return type.replaceAll('_', ' ');
  }

  isGenerating(action: GenerationAction) {
    return this.generatingAction() === action;
  }

  private isGlobalReport(report: ReportResponse) {
    return report.reportType === 'INSTITUTIONNEL' || report.reportType === 'PRIME_PERFORMANCE';
  }

  private compareReportsByRecency(first: ReportResponse, second: ReportResponse) {
    const generatedAtDifference = this.parseDateValue(second.generatedAt) - this.parseDateValue(first.generatedAt);
    if (generatedAtDifference !== 0) {
      return generatedAtDifference;
    }

    return second.id - first.id;
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

  private buildTrailingMonthLabels(monthCount: number, anchorDate: Date) {
    const labels: string[] = [];
    const anchor = new Date(anchorDate);
    anchor.setDate(1);

    for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
      const cursor = new Date(anchor.getFullYear(), anchor.getMonth() - offset, 1);
      const month = `${cursor.getMonth() + 1}`.padStart(2, '0');
      labels.push(`${month}/${cursor.getFullYear()}`);
    }

    return labels;
  }

  private runGeneration(
    action: GenerationAction,
    requestFactory: () => ReturnType<ReportService['generatePdf']>,
    toastTitle: string,
    successMessage: string
  ) {
    this.generatingAction.set(action);
    this.errorMessage.set('');
    this.successMessage.set('');

    requestFactory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.generatingAction.set(null);
          this.reportService.saveResponseFile(response);
          this.successMessage.set(successMessage);
          this.toastService.success(toastTitle, successMessage);
          this.loadPageData();
        },
        error: (error) => {
          this.generatingAction.set(null);
          const message = extractErrorMessage(error, 'Génération du rapport impossible.');
          this.errorMessage.set(message);
          this.toastService.error('Génération impossible', message);
        }
      });
  }

  private validateBaseForm() {
    if (this.reportForm.controls.periodLabel.invalid || this.generatingAction()) {
      this.reportForm.controls.periodLabel.markAsTouched();
      return false;
    }

    return true;
  }

  private resolveDepartmentIdForDepartmentReport() {
    if (!this.validateBaseForm() || !this.canGenerateDepartment()) {
      return undefined;
    }

    if (this.canSelectDepartment()) {
      const selectedId = this.reportForm.getRawValue().departmentId;
      if (!selectedId) {
        const message = 'Sélectionnez un département avant de générer ce rapport.';
        this.errorMessage.set(message);
        this.toastService.warning('Département requis', message);
        return undefined;
      }

      return Number(selectedId);
    }

    return this.currentUser()?.departmentId ?? undefined;
  }

  private prefillDepartmentIfNeeded(departments: Department[]) {
    if (this.canSelectDepartment()) {
      const currentValue = this.reportForm.getRawValue().departmentId;
      if (!currentValue && departments.length > 0) {
        this.reportForm.patchValue({ departmentId: String(departments[0].id) });
      }
      return;
    }

    if (this.currentUser()?.departmentId) {
      this.reportForm.patchValue({ departmentId: String(this.currentUser()?.departmentId) });
    }
  }
}
