import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartData } from 'chart.js';
import { AbsenceSummaryResponse } from '../../core/models/administration.models';
import { AuthService } from '../../core/services/auth.service';
import { AdministrationService } from '../../core/services/administration.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

@Component({
  selector: 'app-absence-tracking-page',
  imports: [ReactiveFormsModule, ChartPanelComponent],
  templateUrl: './absence-tracking-page.component.html',
  styleUrl: './absence-tracking-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbsenceTrackingPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly administrationService = inject(AdministrationService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly absences = signal<AbsenceSummaryResponse[]>([]);
  readonly searchTerm = signal('');
  readonly showAbsenceDashboard = signal(true);
  readonly showFullList = signal(false);
  readonly isAdministration = computed(() => this.authService.hasAnyRole('ADMINISTRATION'));
  readonly roleLabel = computed(() => (this.isAdministration() ? 'Administration' : 'Chef de departement'));

  readonly periodForm = this.formBuilder.nonNullable.group({
    periodLabel: [this.defaultAcademicYear(), [Validators.required]]
  });

  readonly visibleAbsences = computed(() =>
    this.showFullList() ? this.filteredAbsences() : this.filteredAbsences().slice(0, 4)
  );

  readonly filteredAbsences = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const source = this.absences();
    if (!term) {
      return source;
    }

    return source.filter((item) => {
      return (
        item.teacherName.toLowerCase().includes(term) ||
        (item.departmentName ?? '').toLowerCase().includes(term)
      );
    });
  });
  readonly totalAbsenceDays = computed(() =>
    this.filteredAbsences().reduce((total, item) => total + Number(item.totalAbsenceDays ?? 0), 0)
  );
  readonly totalValidatedAbsenceDays = computed(() =>
    this.filteredAbsences().reduce((total, item) => total + Number(item.validatedAbsenceDays ?? 0), 0)
  );
  readonly totalPendingAbsenceDays = computed(() =>
    this.filteredAbsences().reduce((total, item) => total + Number(item.pendingAbsenceDays ?? 0), 0)
  );
  readonly totalRejectedAbsenceDays = computed(() =>
    this.filteredAbsences().reduce((total, item) => total + Number(item.rejectedAbsenceDays ?? 0), 0)
  );
  readonly absenceStatusPieChartData = computed<ChartData<'pie'>>(() => ({
    labels: ['Valide', 'En attente', 'Rejete'],
    datasets: [
      {
        data: [this.totalValidatedAbsenceDays(), this.totalPendingAbsenceDays(), this.totalRejectedAbsenceDays()],
        backgroundColor: ['#16a34a', '#f59e0b', '#dc2626'],
        borderColor: ['rgba(22, 163, 74, 0.92)', 'rgba(245, 158, 11, 0.92)', 'rgba(220, 38, 38, 0.92)'],
        borderWidth: 1
      }
    ]
  }));
  readonly absenceByTeacherChartData = computed<ChartData<'bar'>>(() => {
    const rows = [...this.filteredAbsences()]
      .sort((left, right) => Number(right.totalAbsenceDays ?? 0) - Number(left.totalAbsenceDays ?? 0))
      .slice(0, 8);

    return {
      labels: rows.map((row) => this.compactTeacherLabel(row.teacherName)),
      datasets: [
        {
          label: "Jours d'absence",
          data: rows.map((row) => Number(row.totalAbsenceDays ?? 0)),
          backgroundColor: '#1d4ed8',
          borderRadius: 8,
          maxBarThickness: 32
        }
      ]
    };
  });
  readonly absenceByDepartmentChartData = computed<ChartData<'bar'>>(() => {
    const totals = this.filteredAbsences().reduce<Record<string, number>>((accumulator, item) => {
      const department = (item.departmentName ?? 'Non affecte').trim() || 'Non affecte';
      accumulator[department] = (accumulator[department] ?? 0) + Number(item.totalAbsenceDays ?? 0);
      return accumulator;
    }, {});

    const rows = Object.entries(totals)
      .map(([department, days]) => ({ department, days }))
      .sort((left, right) => right.days - left.days)
      .slice(0, 8);

    return {
      labels: rows.map((row) => row.department),
      datasets: [
        {
          label: 'Jours total',
          data: rows.map((row) => row.days),
          backgroundColor: '#f97316',
          borderRadius: 8,
          maxBarThickness: 32
        }
      ]
    };
  });

  constructor() {
    this.loadAbsences();
  }

  loadAbsences() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.administrationService
      .getAbsenceSummaries(this.periodForm.getRawValue().periodLabel.trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (absences) => {
          this.absences.set(absences);
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'Chargement du suivi des absences impossible.'));
        }
      });
  }

  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  toggleAbsenceDashboard() {
    this.showAbsenceDashboard.update((value) => !value);
  }

  toggleFullList() {
    this.showFullList.update((value) => !value);
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
}
