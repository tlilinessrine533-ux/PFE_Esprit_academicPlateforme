import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartData } from 'chart.js';
import { catchError, forkJoin, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CreateUserPayload, UpdateUserPayload, UserResponse } from '../../core/models/auth.models';
import { GlobalDashboardResponse } from '../../core/models/dashboard.models';
import { ReportResponse } from '../../core/models/report.models';
import { Department, RoleType, TeacherType } from '../../core/models/shared.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { ReportService } from '../../core/services/report.service';
import { UiToastService } from '../../core/services/ui-toast.service';
import { UsersService } from '../../core/services/users.service';
import { extractErrorMessage } from '../../core/utils/http-error.util';
import { ChartPanelComponent } from '../../shared/chart-panel.component';

const ESPRIT_EMAIL_PATTERN = /^[^\s@]+@esprit\.tn$/i;
const STRONG_PASSWORD_PATTERN = /^(?=.*[^A-Za-z0-9])(?=\S+$).{8,}$/;
const ROLE_PERMISSION_MATRIX: Record<RoleType, string[]> = {
  ENSEIGNANT: [
    'Declarer activites',
    'Soumettre workflow',
    'Gerer disponibilite',
    'Generer rapport individuel'
  ],
  CHEF_DEPARTEMENT: [
    'Valider dossiers departement',
    'Consulter comparatifs',
    'Generer rapport departemental',
    'Suivre absences departement'
  ],
  ADMINISTRATION: [
    'Validation finale',
    'Configuration bareme',
    'Gestion primes',
    'Rapports institutionnels'
  ],
  SUPER_ADMIN: [
    'Gestion utilisateurs',
    'Supervision systeme',
    'Audit journaux',
    'Rapports globaux'
  ]
};

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword || password === confirmPassword) {
    return null;
  }

  return { passwordMismatch: true };
}

interface DepartmentOverview {
  id: number;
  name: string;
  code: string | null;
  totalUsers: number;
  totalTeachers: number;
  activeTeachers: number;
  activeDepartmentHeads: number;
  activeAdministrators: number;
  managerName: string;
}

interface SystemLogEntry {
  id: string;
  occurredAt: string;
  actor: string;
  action: string;
  category: 'UTILISATEUR' | 'RAPPORT' | 'SYSTEME';
  status: 'OK' | 'ERREUR';
  detail: string;
}

interface RolePermissionRow {
  role: RoleType;
  permissions: string[];
  updatedAt: string;
}

interface ConnectionEntry {
  id: string;
  userName: string;
  role: RoleType;
  connectedAt: string;
  ipAddress: string;
}

interface IncidentEntry {
  id: string;
  incidentType: string;
  occurredAt: string;
  status: 'OUVERT' | 'RESOLU';
  detail: string;
}

type SuperAdminUsersView = 'management' | 'supervision';
type SupervisionSectionView = 'structure' | 'technique' | 'connexions' | 'bareme-primes' | 'problemes-systeme';

@Component({
  selector: 'app-users-page',
  imports: [ReactiveFormsModule, DatePipe, ChartPanelComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);
  private readonly reportService = inject(ReportService);
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(UiToastService);

  readonly users = signal<UserResponse[]>([]);
  readonly availableDepartments = signal<Department[]>([]);
  readonly systemLogs = signal<SystemLogEntry[]>([]);
  readonly globalSnapshot = signal<GlobalDashboardResponse | null>(null);
  readonly periodLabel = signal(this.defaultAcademicYear());
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly collapsedListSize = 2;
  readonly showUsersDashboard = signal(true);
  readonly showCreateForm = signal(false);
  readonly showAllUsersRows = signal(false);
  readonly showAllRolePermissionRows = signal(false);
  readonly showAllDepartmentRows = signal(false);
  readonly showAllSystemLogRows = signal(false);
  readonly showAllConnectionRows = signal(false);
  readonly showAllConfigurationRows = signal(false);
  readonly showAllIncidentRows = signal(false);
  readonly editingUserId = signal<number | null>(null);
  readonly currentUser = this.authService.user;
  readonly canManageUsers = computed(() => this.authService.hasAnyRole('SUPER_ADMIN'));
  readonly superAdminView = toSignal(
    this.activatedRoute.data.pipe(
      map((data) => this.resolveSuperAdminView(data['view'])),
      startWith(this.resolveSuperAdminView(this.activatedRoute.snapshot.data['view']))
    ),
    {
      initialValue: this.resolveSuperAdminView(this.activatedRoute.snapshot.data['view'])
    }
  );
  readonly supervisionSection = toSignal(
    this.activatedRoute.data.pipe(
      map((data) => this.resolveSupervisionSection(data['supervisionSection'])),
      startWith(this.resolveSupervisionSection(this.activatedRoute.snapshot.data['supervisionSection']))
    ),
    {
      initialValue: this.resolveSupervisionSection(this.activatedRoute.snapshot.data['supervisionSection'])
    }
  );
  readonly isUsersManagementView = computed(() => this.superAdminView() === 'management');
  readonly isUsersSupervisionView = computed(() => this.superAdminView() === 'supervision');
  readonly supervisionSectionTitle = computed(() => this.supervisionSectionLabel(this.supervisionSection()));
  readonly supervisionSectionDescription = computed(() => this.supervisionSectionHint(this.supervisionSection()));
  readonly usersPageTitle = computed(() =>
    this.isUsersSupervisionView() ? this.supervisionSectionTitle() : 'Gestion des utilisateurs et des roles'
  );
  readonly usersPageDescription = computed(() =>
    this.isUsersSupervisionView()
      ? this.supervisionSectionDescription()
      : 'Comptes, roles et controle des acces.'
  );
  readonly usersDashboardToggleLabel = computed(() =>
    this.showUsersDashboard()
      ? this.isUsersSupervisionView()
        ? 'Masquer Dashboard Supervision systeme'
        : 'Masquer Dashboard Utilisateurs'
      : this.isUsersSupervisionView()
        ? 'Afficher Dashboard Supervision systeme'
        : 'Afficher Dashboard Utilisateurs'
  );
  readonly createFormToggleLabel = computed(() =>
    this.showCreateForm() ? 'Masquer le formulaire de creation' : 'Afficher le formulaire de creation'
  );
  readonly sortedUsers = computed(() =>
    [...this.users()].sort((first, second) => {
      const secondCreatedAt = Date.parse(second.createdAt);
      const firstCreatedAt = Date.parse(first.createdAt);

      if (!Number.isNaN(secondCreatedAt) && !Number.isNaN(firstCreatedAt) && secondCreatedAt !== firstCreatedAt) {
        return secondCreatedAt - firstCreatedAt;
      }

      const secondUpdatedAt = Date.parse(second.updatedAt);
      const firstUpdatedAt = Date.parse(first.updatedAt);
      if (!Number.isNaN(secondUpdatedAt) && !Number.isNaN(firstUpdatedAt) && secondUpdatedAt !== firstUpdatedAt) {
        return secondUpdatedAt - firstUpdatedAt;
      }

      return second.id - first.id;
    })
  );
  readonly hasUsersRowsToggle = computed(() => this.sortedUsers().length > this.collapsedListSize);
  readonly usersRowsToggleLabel = computed(() =>
    this.showAllUsersRows() ? "Masquer l'historique complet" : "Afficher tout l'historique"
  );
  readonly displayedUsers = computed(() =>
    this.showAllUsersRows() ? this.sortedUsers() : this.sortedUsers().slice(0, this.collapsedListSize)
  );
  readonly hasRolePermissionRowsToggle = computed(() => this.rolePermissionRows().length > this.collapsedListSize);
  readonly rolePermissionRowsToggleLabel = computed(() =>
    this.showAllRolePermissionRows() ? 'Masquer la liste complete' : 'Afficher toute la liste'
  );
  readonly displayedRolePermissionRows = computed(() =>
    this.showAllRolePermissionRows()
      ? this.rolePermissionRows()
      : this.rolePermissionRows().slice(0, this.collapsedListSize)
  );
  readonly hasDepartmentRowsToggle = computed(() => this.departmentOverview().length > this.collapsedListSize);
  readonly departmentRowsToggleLabel = computed(() =>
    this.showAllDepartmentRows() ? 'Masquer la liste complete' : 'Afficher toute la liste'
  );
  readonly displayedDepartmentOverview = computed(() =>
    this.showAllDepartmentRows()
      ? this.departmentOverview()
      : this.departmentOverview().slice(0, this.collapsedListSize)
  );
  readonly hasSystemLogRowsToggle = computed(() => this.systemLogs().length > this.collapsedListSize);
  readonly systemLogRowsToggleLabel = computed(() =>
    this.showAllSystemLogRows() ? 'Masquer la liste complete' : 'Afficher toute la liste'
  );
  readonly displayedSystemLogs = computed(() =>
    this.showAllSystemLogRows() ? this.systemLogs() : this.systemLogs().slice(0, this.collapsedListSize)
  );
  readonly totalUsersCount = computed(() => this.users().length);
  readonly totalActiveUsersCount = computed(() => this.users().filter((user) => user.isActive).length);
  readonly totalDisabledUsersCount = computed(() => this.totalUsersCount() - this.totalActiveUsersCount());
  readonly totalRolesCount = computed(() => new Set(this.users().map((user) => user.role)).size);
  readonly averageUsersPerDepartment = computed(() => {
    const totalDepartments = this.availableDepartments().length;
    if (totalDepartments === 0) {
      return 0;
    }

    return this.totalUsersCount() / totalDepartments;
  });
  readonly permissionsCount = computed(() => {
    const permissionSet = new Set<string>();
    Object.values(ROLE_PERMISSION_MATRIX).forEach((permissions) => {
      permissions.forEach((permission) => permissionSet.add(permission));
    });
    return permissionSet.size;
  });
  readonly permissionChangeCount = computed(() => this.globalSnapshot()?.totalConfigurationChanges ?? 0);
  readonly systemActionCount = computed(() => this.systemLogs().length);
  readonly systemErrorCount = computed(() => this.systemLogs().filter((log) => log.status === 'ERREUR').length);
  readonly systemErrorRateDisplay = computed(() => this.formatPercent(this.globalSnapshot()?.errorRatePercent ?? 0));
  readonly platformAvailabilityDisplay = computed(() => {
    const snapshot = this.globalSnapshot();
    if (!snapshot) {
      return '0.0%';
    }

    if (!snapshot.platformAvailabilityPlaceholder) {
      return this.formatPercent(snapshot.platformAvailabilityPercent);
    }

    const fallback = Math.max(0, 100 - Number(snapshot.errorRatePercent ?? 0));
    return this.formatPercent(fallback);
  });
  readonly rolePermissionRows = computed<RolePermissionRow[]>(() => {
    const users = this.users();

    return (Object.keys(ROLE_PERMISSION_MATRIX) as RoleType[]).map((role) => {
      const latestRoleUpdate = users
        .filter((user) => user.role === role)
        .map((user) => this.parseDateValue(user.updatedAt))
        .reduce((latest, value) => Math.max(latest, value), 0);

      return {
        role,
        permissions: ROLE_PERMISSION_MATRIX[role],
        updatedAt: latestRoleUpdate > 0 ? new Date(latestRoleUpdate).toISOString() : new Date().toISOString()
      };
    });
  });
  readonly connectionEntries = computed<ConnectionEntry[]>(() =>
    this.users()
      .map((user) => ({
        id: `conn-${user.id}`,
        userName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        connectedAt: user.updatedAt,
        ipAddress: 'N/A'
      }))
      .filter((entry) => this.parseDateValue(entry.connectedAt) > 0)
      .sort((left, right) => this.parseDateValue(right.connectedAt) - this.parseDateValue(left.connectedAt))
  );
  readonly hasConnectionRowsToggle = computed(() => this.connectionEntries().length > this.collapsedListSize);
  readonly connectionRowsToggleLabel = computed(() =>
    this.showAllConnectionRows() ? 'Masquer la liste complete' : 'Afficher toute la liste'
  );
  readonly displayedConnections = computed(() =>
    this.showAllConnectionRows()
      ? this.connectionEntries()
      : this.connectionEntries().slice(0, this.collapsedListSize)
  );
  readonly totalConnectionsCount = computed(() => this.connectionEntries().length);
  readonly averageConnectionsPerDay = computed(() => {
    const entries = this.connectionEntries();
    if (entries.length === 0) {
      return 0;
    }

    const uniqueDays = new Set(entries.map((entry) => new Date(entry.connectedAt).toISOString().slice(0, 10))).size;
    return uniqueDays === 0 ? 0 : entries.length / uniqueDays;
  });
  readonly incidentEntries = computed<IncidentEntry[]>(() => {
    const accountIncidents = this.users()
      .filter((user) => !user.isActive)
      .map((user) => ({
        id: `inactive-${user.id}`,
        incidentType: 'Compte desactive',
        occurredAt: user.updatedAt,
        status: 'OUVERT' as const,
        detail: `${user.firstName} ${user.lastName} est inactif.`
      }));

    const errorLogs = this.systemLogs()
      .filter((entry) => entry.status === 'ERREUR')
      .map((entry) => ({
        id: `log-${entry.id}`,
        incidentType: 'Alerte journal systeme',
        occurredAt: entry.occurredAt,
        status: 'OUVERT' as const,
        detail: entry.detail
      }));

    return [...accountIncidents, ...errorLogs].sort(
      (left, right) => this.parseDateValue(right.occurredAt) - this.parseDateValue(left.occurredAt)
    );
  });
  readonly hasConfigurationRowsToggle = computed(() => this.rolePermissionRows().length > this.collapsedListSize);
  readonly configurationRowsToggleLabel = computed(() =>
    this.showAllConfigurationRows() ? 'Masquer la liste complete' : 'Afficher toute la liste'
  );
  readonly displayedConfigurationRows = computed(() =>
    this.showAllConfigurationRows()
      ? this.rolePermissionRows()
      : this.rolePermissionRows().slice(0, this.collapsedListSize)
  );
  readonly hasIncidentRowsToggle = computed(() => this.incidentEntries().length > this.collapsedListSize);
  readonly incidentRowsToggleLabel = computed(() =>
    this.showAllIncidentRows() ? 'Masquer la liste complete' : 'Afficher toute la liste'
  );
  readonly displayedIncidentRows = computed(() =>
    this.showAllIncidentRows()
      ? this.incidentEntries()
      : this.incidentEntries().slice(0, this.collapsedListSize)
  );
  readonly criticalIncidentCount = computed(() => this.incidentEntries().filter((incident) => incident.status === 'OUVERT').length);
  readonly departmentOverview = computed<DepartmentOverview[]>(() => {
    const users = this.users();

    return this.availableDepartments()
      .map((department) => {
        const relatedUsers = users.filter((user) => user.departmentId === department.id);
        const manager = relatedUsers.find((user) => user.role === 'CHEF_DEPARTEMENT' && user.isActive);
        return {
          id: department.id,
          name: department.name,
          code: department.code,
          totalUsers: relatedUsers.length,
          totalTeachers: relatedUsers.filter((user) => user.role === 'ENSEIGNANT').length,
          activeTeachers: relatedUsers.filter((user) => user.role === 'ENSEIGNANT' && user.isActive).length,
          activeDepartmentHeads: relatedUsers.filter((user) => user.role === 'CHEF_DEPARTEMENT' && user.isActive).length,
          activeAdministrators: relatedUsers.filter((user) => user.role === 'ADMINISTRATION' && user.isActive).length,
          managerName: manager ? `${manager.firstName} ${manager.lastName}` : 'Non assigne'
        };
      })
      .sort((left, right) => right.totalUsers - left.totalUsers || left.name.localeCompare(right.name));
  });
  readonly roleDistributionChartData = computed<ChartData<'doughnut'>>(() => {
    const users = this.users();
    return {
      labels: ['Enseignants', 'Chef departement', 'Administration', 'Super admin'],
      datasets: [
        {
          data: [
            users.filter((user) => user.role === 'ENSEIGNANT').length,
            users.filter((user) => user.role === 'CHEF_DEPARTEMENT').length,
            users.filter((user) => user.role === 'ADMINISTRATION').length,
            users.filter((user) => user.role === 'SUPER_ADMIN').length
          ],
          backgroundColor: ['#2563eb', '#f59e0b', '#dc2626', '#7c3aed'],
          borderColor: ['rgba(37, 99, 235, 0.9)', 'rgba(245, 158, 11, 0.9)', 'rgba(220, 38, 38, 0.9)', 'rgba(124, 58, 237, 0.9)'],
          borderWidth: 1,
          hoverOffset: 10
        }
      ]
    };
  });
  readonly accountStatusChartData = computed<ChartData<'doughnut'>>(() => {
    const users = this.users();
    return {
      labels: ['Actifs', 'Inactifs'],
      datasets: [
        {
          data: [users.filter((user) => user.isActive).length, users.filter((user) => !user.isActive).length],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderColor: ['rgba(34, 197, 94, 0.9)', 'rgba(239, 68, 68, 0.9)'],
          borderWidth: 1,
          hoverOffset: 10
        }
      ]
    };
  });
  readonly departmentUsersChartData = computed<ChartData<'bar'>>(() => {
    const buckets = new Map<string, number>();
    for (const user of this.users()) {
      const bucket = user.departmentName ?? 'Sans departement';
      buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
    }

    const sortedBuckets = Array.from(buckets.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8);

    return {
      labels: sortedBuckets.map(([department]) => this.compactDepartmentTick(department)),
      datasets: [
        {
          label: 'Utilisateurs',
          data: sortedBuckets.map(([, count]) => count),
          borderRadius: 10,
          maxBarThickness: 34,
          backgroundColor: '#dc2626'
        }
      ]
    };
  });
  readonly usersByRoleBarChartData = computed<ChartData<'bar'>>(() => ({
    labels: ['Enseignants', 'Chef departement', 'Administration', 'Super admin'],
    datasets: [
      {
        label: 'Utilisateurs',
        data: [
          this.users().filter((user) => user.role === 'ENSEIGNANT').length,
          this.users().filter((user) => user.role === 'CHEF_DEPARTEMENT').length,
          this.users().filter((user) => user.role === 'ADMINISTRATION').length,
          this.users().filter((user) => user.role === 'SUPER_ADMIN').length
        ],
        backgroundColor: ['#2563eb', '#f59e0b', '#ef4444', '#475569'],
        borderRadius: 10,
        maxBarThickness: 34
      }
    ]
  }));
  readonly accountCreationTrendChartData = computed<ChartData<'line'>>(() => {
    const labels = this.buildTrailingMonthLabels(6);
    const buckets = new Map(labels.map((label) => [label, 0]));

    this.users().forEach((user) => {
      const key = this.monthKeyFromDate(user.createdAt);
      if (!key || !buckets.has(key)) {
        return;
      }
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Comptes crees',
          data: labels.map((label) => buckets.get(label) ?? 0),
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
  readonly permissionsByRoleChartData = computed<ChartData<'bar'>>(() => {
    const rows = this.rolePermissionRows();

    return {
      labels: rows.map((row) => this.roleLabel(row.role)),
      datasets: [
        {
          label: 'Permissions actives',
          data: rows.map((row) => row.permissions.length),
          backgroundColor: ['#2563eb', '#f59e0b', '#ef4444', '#475569'],
          borderRadius: 10,
          maxBarThickness: 34
        }
      ]
    };
  });
  readonly departmentTeachersChartData = computed<ChartData<'bar'>>(() => ({
    labels: this.departmentOverview().map((department) => this.compactDepartmentTick(department.name)),
    datasets: [
      {
        label: 'Enseignants',
        data: this.departmentOverview().map((department) => department.totalTeachers),
        backgroundColor: '#2563eb',
        borderRadius: 10,
        maxBarThickness: 34
      }
    ]
  }));
  readonly departmentDistributionChartData = computed<ChartData<'doughnut'>>(() => {
    const rows = this.departmentOverview().slice(0, 6);
    return {
      labels: rows.map((department) => department.name),
      datasets: [
        {
          data: rows.map((department) => department.totalUsers),
          backgroundColor: ['#2563eb', '#f59e0b', '#ef4444', '#0ea5e9', '#22c55e', '#64748b'],
          borderWidth: 1
        }
      ]
    };
  });
  readonly systemStatusChartData = computed<ChartData<'doughnut'>>(() => {
    const okCount = this.systemLogs().filter((log) => log.status === 'OK').length;
    const errorCount = this.systemLogs().filter((log) => log.status === 'ERREUR').length;

    return {
      labels: ['OK', 'Erreurs'],
      datasets: [
        {
          data: [okCount, errorCount],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderColor: ['rgba(34, 197, 94, 0.9)', 'rgba(239, 68, 68, 0.9)'],
          borderWidth: 1
        }
      ]
    };
  });
  readonly systemErrorsTrendChartData = computed<ChartData<'line'>>(() => {
    const labels = this.buildTrailingMonthLabels(6);
    const buckets = new Map(labels.map((label) => [label, 0]));

    this.systemLogs()
      .filter((entry) => entry.status === 'ERREUR')
      .forEach((entry) => {
        const key = this.monthKeyFromDate(entry.occurredAt);
        if (!key || !buckets.has(key)) {
          return;
        }
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      });

    return {
      labels,
      datasets: [
        {
          label: 'Erreurs',
          data: labels.map((label) => buckets.get(label) ?? 0),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.16)',
          pointBackgroundColor: '#ef4444',
          pointRadius: 3,
          fill: true,
          tension: 0.28
        }
      ]
    };
  });
  readonly connectionsTrendChartData = computed<ChartData<'line'>>(() => {
    const labels = this.buildTrailingMonthLabels(6);
    const buckets = new Map(labels.map((label) => [label, 0]));

    this.connectionEntries().forEach((entry) => {
      const key = this.monthKeyFromDate(entry.connectedAt);
      if (!key || !buckets.has(key)) {
        return;
      }
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Connexions',
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
  readonly connectionsByRoleChartData = computed<ChartData<'bar'>>(() => {
    const roleBuckets: Record<RoleType, number> = {
      ENSEIGNANT: 0,
      CHEF_DEPARTEMENT: 0,
      ADMINISTRATION: 0,
      SUPER_ADMIN: 0
    };

    this.connectionEntries().forEach((entry) => {
      roleBuckets[entry.role] += 1;
    });

    return {
      labels: ['Enseignants', 'Chef departement', 'Administration', 'Super admin'],
      datasets: [
        {
          label: 'Connexions',
          data: [
            roleBuckets.ENSEIGNANT,
            roleBuckets.CHEF_DEPARTEMENT,
            roleBuckets.ADMINISTRATION,
            roleBuckets.SUPER_ADMIN
          ],
          backgroundColor: ['#2563eb', '#f59e0b', '#ef4444', '#475569'],
          borderRadius: 10,
          maxBarThickness: 34
        }
      ]
    };
  });
  readonly configurationTrendChartData = computed<ChartData<'line'>>(() => {
    const labels = this.buildTrailingMonthLabels(6);
    const values = labels.map(() => 0);
    const currentMonthIndex = values.length - 1;
    values[currentMonthIndex] = this.permissionChangeCount();

    return {
      labels,
      datasets: [
        {
          label: 'Modifications',
          data: values,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.16)',
          pointBackgroundColor: '#f59e0b',
          pointRadius: 3,
          fill: true,
          tension: 0.24
        }
      ]
    };
  });
  readonly incidentByTypeChartData = computed<ChartData<'bar'>>(() => {
    const buckets = new Map<string, number>();
    this.incidentEntries().forEach((entry) => {
      buckets.set(entry.incidentType, (buckets.get(entry.incidentType) ?? 0) + 1);
    });

    const rows = Array.from(buckets.entries());
    return {
      labels: rows.map(([label]) => label),
      datasets: [
        {
          label: 'Incidents',
          data: rows.map(([, count]) => count),
          backgroundColor: '#ef4444',
          borderRadius: 10,
          maxBarThickness: 36
        }
      ]
    };
  });
  readonly createForm = this.formBuilder.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(ESPRIT_EMAIL_PATTERN)]],
      role: ['ENSEIGNANT' as RoleType, [Validators.required]],
      teacherType: ['PERMANENT' as TeacherType, [Validators.required]],
      departmentId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(STRONG_PASSWORD_PATTERN)]],
      confirmPassword: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern(STRONG_PASSWORD_PATTERN)]
      ],
      isActive: [true]
    },
    { validators: passwordsMatchValidator }
  );
  readonly updateForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(ESPRIT_EMAIL_PATTERN)]],
    role: ['ENSEIGNANT' as RoleType, [Validators.required]],
    teacherType: ['PERMANENT' as TeacherType, [Validators.required]],
    departmentId: ['', [Validators.required]],
    isActive: [true]
  });
  readonly createRoleOptions = computed<ReadonlyArray<{ value: RoleType; label: string }>>(() => [
    { value: 'ENSEIGNANT', label: 'Enseignant' },
    { value: 'CHEF_DEPARTEMENT', label: 'Chef de departement' },
    { value: 'ADMINISTRATION', label: 'Administration' }
  ]);
  readonly teacherTypeOptions: ReadonlyArray<{ value: TeacherType; label: string }> = [
    { value: 'PERMANENT', label: 'Permanent' },
    { value: 'VACATAIRE', label: 'Vacataire' }
  ];
  readonly selectedRole = toSignal(
    this.createForm.controls.role.valueChanges.pipe(startWith(this.createForm.controls.role.value)),
    { initialValue: this.createForm.controls.role.value }
  );
  readonly selectedTeacherType = toSignal(
    this.createForm.controls.teacherType.valueChanges.pipe(startWith(this.createForm.controls.teacherType.value)),
    { initialValue: this.createForm.controls.teacherType.value }
  );
  readonly isTeacherRoleSelected = computed(() => this.selectedRole() === 'ENSEIGNANT');
  readonly selectedDepartmentId = toSignal(
    this.createForm.controls.departmentId.valueChanges.pipe(startWith(this.createForm.controls.departmentId.value)),
    { initialValue: this.createForm.controls.departmentId.value }
  );
  readonly selectedRoleDescription = computed(() => {
    return this.roleDescription(this.selectedRole());
  });
  readonly selectedUpdateRole = toSignal(
    this.updateForm.controls.role.valueChanges.pipe(startWith(this.updateForm.controls.role.value)),
    { initialValue: this.updateForm.controls.role.value }
  );
  readonly selectedUpdateTeacherType = toSignal(
    this.updateForm.controls.teacherType.valueChanges.pipe(startWith(this.updateForm.controls.teacherType.value)),
    { initialValue: this.updateForm.controls.teacherType.value }
  );
  readonly isUpdateTeacherRoleSelected = computed(() => this.selectedUpdateRole() === 'ENSEIGNANT');
  readonly selectedUpdateRoleDescription = computed(() => this.roleDescription(this.selectedUpdateRole()));
  readonly eligibleDepartments = computed(() => this.availableDepartments());
  readonly updateEligibleDepartments = computed(() => this.availableDepartments());
  readonly selectedDepartment = computed(() => {
    const rawDepartmentId = this.selectedDepartmentId();
    const departmentId = Number(rawDepartmentId);

    if (!rawDepartmentId || Number.isNaN(departmentId)) {
      return null;
    }

    return this.availableDepartments().find((department) => department.id === departmentId) ?? null;
  });
  readonly selectedDepartmentHead = computed(() => {
    const department = this.selectedDepartment();
    if (!department) {
      return null;
    }

    return this.activeDepartmentHead(department.id);
  });
  readonly editingUser = computed(() => {
    const editingUserId = this.editingUserId();
    if (editingUserId == null) {
      return null;
    }

    return this.users().find((user) => user.id === editingUserId) ?? null;
  });
  readonly selectedUpdateDepartmentId = toSignal(
    this.updateForm.controls.departmentId.valueChanges.pipe(startWith(this.updateForm.controls.departmentId.value)),
    { initialValue: this.updateForm.controls.departmentId.value }
  );
  readonly selectedUpdateDepartment = computed(() => {
    const rawDepartmentId = this.selectedUpdateDepartmentId();
    const departmentId = Number(rawDepartmentId);

    if (!rawDepartmentId || Number.isNaN(departmentId)) {
      return null;
    }

    return this.availableDepartments().find((department) => department.id === departmentId) ?? null;
  });
  readonly selectedUpdateDepartmentHead = computed(() => {
    const department = this.selectedUpdateDepartment();
    const editingUser = this.editingUser();
    if (!department) {
      return null;
    }

    return this.activeDepartmentHead(department.id, editingUser?.id ?? null);
  });
  readonly selectedDepartmentRoleWarning = computed(() => {
    const department = this.selectedDepartment();
    if (!department) {
      return '';
    }

    if (this.selectedRole() === 'ENSEIGNANT' && !this.departmentHasActiveHead(department.id)) {
      return "Ce departement n'a pas encore de chef actif. La creation d'un enseignant y restera bloquee tant qu'un chef de departement n'est pas cree.";
    }

    if (this.selectedRole() === 'CHEF_DEPARTEMENT' && this.departmentHasActiveHead(department.id)) {
      return 'Ce departement a deja un chef actif. Choisissez un autre departement pour creer un nouveau chef.';
    }

    return '';
  });
  readonly selectedUpdateDepartmentRoleWarning = computed(() => {
    const department = this.selectedUpdateDepartment();
    const editingUser = this.editingUser();
    if (!department || !editingUser) {
      return '';
    }

    if (this.selectedUpdateRole() === 'ENSEIGNANT' && !this.departmentHasActiveHead(department.id, editingUser.id)) {
      return "Ce departement n'a pas de chef actif en dehors de ce compte. Un enseignant doit etre rattache a un departement avec chef actif.";
    }

    if (this.selectedUpdateRole() === 'CHEF_DEPARTEMENT' && this.departmentHasActiveHead(department.id, editingUser.id)) {
      return 'Ce departement a deja un chef actif. Choisissez un autre departement ou laissez le chef actuel en poste.';
    }

    return '';
  });

  constructor() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      users: this.usersService.getUsers(),
      departments: this.usersService.getDepartments(),
      reports: this.reportService.getReports().pipe(catchError(() => of([] as ReportResponse[]))),
      global: this.dashboardService.getGlobal(this.periodLabel()).pipe(catchError(() => of(null as GlobalDashboardResponse | null)))
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ users, departments, reports, global }) => {
          this.users.set(users);
          this.availableDepartments.set(departments);
          this.globalSnapshot.set(global);
          this.systemLogs.set(this.buildSystemLogs(users, reports));
          this.loading.set(false);
          if (users.length <= this.collapsedListSize) {
            this.showAllUsersRows.set(false);
          }

          const currentDepartmentId = this.createForm.controls.departmentId.value;
          if (currentDepartmentId && !departments.some((department) => String(department.id) === currentDepartmentId)) {
            this.createForm.controls.departmentId.setValue('');
          }

          const updateDepartmentId = this.updateForm.controls.departmentId.value;
          if (updateDepartmentId && !departments.some((department) => String(department.id) === updateDepartmentId)) {
            this.updateForm.controls.departmentId.setValue('');
          }

          const editingUserId = this.editingUserId();
          if (editingUserId != null && !users.some((user) => user.id === editingUserId)) {
            this.cancelEditUser();
          }
        },
        error: (error: unknown) => {
          this.loading.set(false);
          const message = extractErrorMessage(error, 'Impossible de charger les utilisateurs.');
          this.errorMessage.set(message);
          this.toastService.error('Utilisateurs indisponibles', message);
        }
      });
  }

  createUser() {
    if (!this.canManageUsers()) {
      this.errorMessage.set('Seul le super-administrateur peut creer un utilisateur.');
      return;
    }

    if (this.createForm.invalid || this.saving()) {
      this.createForm.markAllAsTouched();
      const validationMessage = this.buildCreateFormValidationMessage();
      this.errorMessage.set(validationMessage);
      this.toastService.warning('Formulaire incomplet', validationMessage);
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.createForm.getRawValue();
    const departmentId = Number(rawValue.departmentId);
    const selectedDepartment = this.availableDepartments().find((department) => department.id === departmentId) ?? null;

    if (!selectedDepartment) {
      this.errorMessage.set('Veuillez selectionner un departement valide.');
      return;
    }

    if (rawValue.role === 'ENSEIGNANT' && !this.departmentHasActiveHead(selectedDepartment.id)) {
      this.errorMessage.set(
        "Impossible de creer cet enseignant: le departement selectionne n'a pas encore de chef de departement actif."
      );
      return;
    }

    if (rawValue.role === 'CHEF_DEPARTEMENT' && this.departmentHasActiveHead(selectedDepartment.id)) {
      this.errorMessage.set('Ce departement a deja un chef de departement actif.');
      return;
    }

    this.saving.set(true);

    const payload: CreateUserPayload = {
      firstName: rawValue.firstName.trim(),
      lastName: rawValue.lastName.trim(),
      email: rawValue.email.trim(),
      password: rawValue.password,
      role: rawValue.role,
      teacherType: rawValue.role === 'ENSEIGNANT' ? rawValue.teacherType : null,
      departmentId: selectedDepartment.id,
      departmentName: null,
      isActive: rawValue.isActive
    };

    this.usersService
      .createUser(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Compte cree avec succes.');
          this.toastService.success('Compte cree', 'Le nouveau compte a ete ajoute avec succes.');
          this.createForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            role: 'ENSEIGNANT',
            teacherType: 'PERMANENT',
            departmentId: '',
            password: '',
            confirmPassword: '',
            isActive: true
          });
          this.showCreateForm.set(false);
          this.loadData();
        },
        error: (error: unknown) => {
          this.saving.set(false);
          const message = extractErrorMessage(error, "Creation de l'utilisateur impossible.");
          this.errorMessage.set(message);
          this.toastService.error('Creation impossible', message);
        }
      });
  }

  toggleCreateForm() {
    if (!this.canManageUsers() || this.saving()) {
      return;
    }

    this.showCreateForm.update((value) => {
      const nextValue = !value;
      if (nextValue) {
        this.cancelEditUser();
      }
      return nextValue;
    });
  }

  toggleUsersRowsVisibility() {
    if (!this.hasUsersRowsToggle()) {
      return;
    }

    this.showAllUsersRows.update((value) => !value);
  }

  toggleRolePermissionRowsVisibility() {
    if (!this.hasRolePermissionRowsToggle()) {
      return;
    }

    this.showAllRolePermissionRows.update((value) => !value);
  }

  toggleDepartmentRowsVisibility() {
    if (!this.hasDepartmentRowsToggle()) {
      return;
    }

    this.showAllDepartmentRows.update((value) => !value);
  }

  toggleSystemLogRowsVisibility() {
    if (!this.hasSystemLogRowsToggle()) {
      return;
    }

    this.showAllSystemLogRows.update((value) => !value);
  }

  toggleConnectionRowsVisibility() {
    if (!this.hasConnectionRowsToggle()) {
      return;
    }

    this.showAllConnectionRows.update((value) => !value);
  }

  toggleConfigurationRowsVisibility() {
    if (!this.hasConfigurationRowsToggle()) {
      return;
    }

    this.showAllConfigurationRows.update((value) => !value);
  }

  toggleIncidentRowsVisibility() {
    if (!this.hasIncidentRowsToggle()) {
      return;
    }

    this.showAllIncidentRows.update((value) => !value);
  }

  toggleUsersDashboard() {
    this.showUsersDashboard.update((value) => !value);
  }

  isSupervisionSection(section: SupervisionSectionView) {
    return this.isUsersSupervisionView() && this.supervisionSection() === section;
  }

  canEditUser(user: UserResponse) {
    return this.canManageUsers() && user.role !== 'SUPER_ADMIN' && this.currentUser()?.id !== user.id;
  }

  startEditUser(user: UserResponse) {
    if (!this.canEditUser(user) || this.saving()) {
      return;
    }

    if (this.editingUserId() === user.id) {
      this.cancelEditUser();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.showCreateForm.set(false);
    this.editingUserId.set(user.id);
    this.patchUpdateForm(user);
  }

  cancelEditUser() {
    this.editingUserId.set(null);
    this.updateForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      role: 'ENSEIGNANT',
      teacherType: 'PERMANENT',
      departmentId: '',
      isActive: true
    });
  }

  updateUser() {
    const user = this.editingUser();
    if (!user) {
      this.errorMessage.set('Aucun utilisateur selectionne pour modification.');
      return;
    }

    if (!this.canManageUsers()) {
      this.errorMessage.set('Seul le super-administrateur peut modifier un utilisateur.');
      return;
    }

    if (this.updateForm.invalid || this.saving()) {
      this.updateForm.markAllAsTouched();
      const validationMessage = this.buildUpdateFormValidationMessage();
      this.errorMessage.set(validationMessage);
      this.toastService.warning('Formulaire incomplet', validationMessage);
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    const rawValue = this.updateForm.getRawValue();
    const departmentId = Number(rawValue.departmentId);
    const selectedDepartment = this.availableDepartments().find((department) => department.id === departmentId) ?? null;

    if (!selectedDepartment) {
      this.errorMessage.set('Veuillez selectionner un departement valide.');
      return;
    }

    if (rawValue.role === 'ENSEIGNANT' && !this.departmentHasActiveHead(selectedDepartment.id, user.id)) {
      this.errorMessage.set(
        "Impossible de rattacher cet enseignant: le departement selectionne n'a pas de chef de departement actif."
      );
      return;
    }

    if (rawValue.role === 'CHEF_DEPARTEMENT' && this.departmentHasActiveHead(selectedDepartment.id, user.id)) {
      this.errorMessage.set('Ce departement a deja un chef de departement actif.');
      return;
    }

    this.saving.set(true);

    const payload: UpdateUserPayload = {
      firstName: rawValue.firstName.trim(),
      lastName: rawValue.lastName.trim(),
      email: rawValue.email.trim(),
      role: rawValue.role,
      teacherType: rawValue.role === 'ENSEIGNANT' ? rawValue.teacherType : null,
      departmentId: selectedDepartment.id,
      isActive: rawValue.isActive
    };

    this.usersService
      .updateUser(user.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Utilisateur modifie avec succes.');
          this.toastService.success('Utilisateur modifie', 'Les informations du compte ont ete mises a jour.');
          this.cancelEditUser();
          this.loadData();
        },
        error: (error: unknown) => {
          this.saving.set(false);
          const message = extractErrorMessage(error, 'Mise a jour utilisateur impossible.');
          this.errorMessage.set(message);
          this.toastService.error('Mise a jour impossible', message);
        }
      });
  }

  deleteUser(user: UserResponse) {
    if (!this.canManageUsers()) {
      this.errorMessage.set('Vous etes en mode lecture seule sur cette page.');
      return;
    }

    if (user.role === 'SUPER_ADMIN') {
      this.errorMessage.set('Ce compte est protege et ne peut pas etre supprime depuis cet espace.');
      return;
    }

    if (!confirm(`Supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.usersService
      .deleteUser(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Utilisateur supprime avec succes.');
          this.toastService.success('Utilisateur supprime', 'Le compte a ete retire avec succes.');
          this.loadData();
        },
        error: (error: unknown) => {
          const message = extractErrorMessage(error, 'Suppression utilisateur impossible.');
          this.errorMessage.set(message);
          this.toastService.error('Suppression impossible', message);
        }
      });
  }

  toggleUserActivation(user: UserResponse) {
    if (!this.canEditUser(user) || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload: UpdateUserPayload = {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      email: user.email.trim(),
      role: user.role,
      teacherType: user.role === 'ENSEIGNANT' ? user.teacherType ?? 'PERMANENT' : null,
      departmentId: user.departmentId,
      isActive: !user.isActive
    };

    this.usersService
      .updateUser(user.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          const actionLabel = payload.isActive ? 'reactive' : 'desactive';
          this.successMessage.set(`Compte ${actionLabel} avec succes.`);
          this.toastService.success('Mise a jour statut', `Le compte ${user.firstName} ${user.lastName} est ${actionLabel}.`);
          this.loadData();
        },
        error: (error: unknown) => {
          this.saving.set(false);
          const message = extractErrorMessage(error, 'Mise a jour du statut utilisateur impossible.');
          this.errorMessage.set(message);
          this.toastService.error('Statut non mis a jour', message);
        }
      });
  }

  roleLabel(role: RoleType) {
    switch (role) {
      case 'ENSEIGNANT':
        return 'Enseignant';
      case 'CHEF_DEPARTEMENT':
        return 'Chef de departement';
      case 'ADMINISTRATION':
        return 'Administration';
      case 'SUPER_ADMIN':
        return 'Super administrateur';
    }
  }

  teacherTypeLabel(teacherType: TeacherType | null) {
    if (!teacherType) {
      return '-';
    }

    return teacherType === 'VACATAIRE' ? 'Vacataire' : 'Permanent';
  }

  hasUpdateDepartmentError() {
    return this.updateForm.controls.departmentId.invalid && this.updateForm.controls.departmentId.touched;
  }

  hasUpdateEmailError() {
    return this.updateForm.controls.email.invalid && this.updateForm.controls.email.touched;
  }

  hasUpdateFirstNameError() {
    return this.updateForm.controls.firstName.invalid && this.updateForm.controls.firstName.touched;
  }

  hasUpdateLastNameError() {
    return this.updateForm.controls.lastName.invalid && this.updateForm.controls.lastName.touched;
  }

  updateFormValidationMessage() {
    if (!this.updateForm.touched || !this.updateForm.invalid) {
      return '';
    }

    return this.buildUpdateFormValidationMessage();
  }

  hasCreateDepartmentError() {
    return this.createForm.controls.departmentId.invalid && this.createForm.controls.departmentId.touched;
  }

  hasCreateEmailError() {
    return this.createForm.controls.email.invalid && this.createForm.controls.email.touched;
  }

  hasCreateFirstNameError() {
    return this.createForm.controls.firstName.invalid && this.createForm.controls.firstName.touched;
  }

  hasCreateLastNameError() {
    return this.createForm.controls.lastName.invalid && this.createForm.controls.lastName.touched;
  }

  hasCreatePasswordStrengthError() {
    const passwordControl = this.createForm.controls.password;
    return passwordControl.invalid && passwordControl.touched;
  }

  hasCreateConfirmPasswordStrengthError() {
    const confirmPasswordControl = this.createForm.controls.confirmPassword;
    return confirmPasswordControl.invalid && confirmPasswordControl.touched;
  }

  hasCreatePasswordMismatch() {
    return (
      this.createForm.hasError('passwordMismatch') &&
      (this.createForm.controls.password.touched || this.createForm.controls.confirmPassword.touched)
    );
  }

  createFormValidationMessage() {
    if (!this.createForm.touched || !this.createForm.invalid) {
      return '';
    }

    return this.buildCreateFormValidationMessage();
  }

  departmentOptionLabel(department: Department) {
    return department.name;
  }

  systemLogCategoryLabel(category: SystemLogEntry['category']) {
    if (category === 'RAPPORT') {
      return 'Rapport';
    }

    if (category === 'SYSTEME') {
      return 'Systeme';
    }

    return 'Utilisateur';
  }

  systemLogStatusClass(status: SystemLogEntry['status']) {
    return status === 'ERREUR' ? 'status-pill status-pill--danger' : 'status-pill status-pill--active';
  }

  incidentStatusClass(status: IncidentEntry['status']) {
    return status === 'OUVERT' ? 'status-pill status-pill--danger' : 'status-pill status-pill--active';
  }

  rolePermissionsText(role: RoleType) {
    return ROLE_PERMISSION_MATRIX[role].join(', ');
  }

  lastConnectionLabel(user: UserResponse) {
    const value = this.parseDateValue(user.updatedAt);
    if (value <= 0) {
      return 'N/A';
    }

    return new Date(value).toISOString();
  }

  private buildSystemLogs(users: UserResponse[], reports: ReportResponse[]) {
    const userLogs = users.flatMap((user) => {
      const createdLog: SystemLogEntry = {
        id: `user-created-${user.id}`,
        occurredAt: user.createdAt,
        actor: 'Super Admin',
        action: `Creation compte #${user.id}`,
        category: 'UTILISATEUR',
        status: 'OK',
        detail: `${user.firstName} ${user.lastName} (${this.roleLabel(user.role)})`
      };

      const updatedAt = this.parseDateValue(user.updatedAt);
      const createdAt = this.parseDateValue(user.createdAt);
      const hasUpdate = updatedAt > 0 && createdAt > 0 && updatedAt !== createdAt;
      const disabledLog: SystemLogEntry | null = user.isActive
        ? null
        : {
            id: `user-disabled-${user.id}`,
            occurredAt: user.updatedAt,
            actor: 'Systeme',
            action: `Compte desactive #${user.id}`,
            category: 'SYSTEME',
            status: 'ERREUR',
            detail: `${user.firstName} ${user.lastName} marque inactif`
          };

      if (!hasUpdate) {
        return disabledLog ? [disabledLog, createdLog] : [createdLog];
      }

      const updatedLog: SystemLogEntry = {
        id: `user-updated-${user.id}`,
        occurredAt: user.updatedAt,
        actor: 'Super Admin',
        action: `Mise a jour compte #${user.id}`,
        category: 'UTILISATEUR',
        status: 'OK',
        detail: `${user.firstName} ${user.lastName} (${this.roleLabel(user.role)})`
      };

      const entries = [updatedLog, createdLog];
      return disabledLog ? [disabledLog, ...entries] : entries;
    });

    const reportLogs: SystemLogEntry[] = reports.map((report) => ({
      id: `report-${report.id}`,
      occurredAt: report.generatedAt,
      actor: report.generatedByName ?? 'Systeme',
      action: `Generation rapport #${report.id}`,
      category: 'RAPPORT',
      status: 'OK',
      detail: `${report.reportType.replaceAll('_', ' ')} - ${report.reportFormat}`
    }));

    const alertsFromGlobal: SystemLogEntry[] = this.globalSnapshot()
      ? [
          {
            id: `global-error-rate-${this.periodLabel()}`,
            occurredAt: new Date().toISOString(),
            actor: 'Monitoring',
            action: "Analyse taux d'erreur",
            category: 'SYSTEME',
            status: (this.globalSnapshot()?.errorRatePercent ?? 0) > 0 ? 'ERREUR' : 'OK',
            detail: `Taux erreur ${this.systemErrorRateDisplay()} sur ${this.periodLabel()}`
          }
        ]
      : [];

    return [...alertsFromGlobal, ...userLogs, ...reportLogs].sort(
      (left, right) => this.parseDateValue(right.occurredAt) - this.parseDateValue(left.occurredAt)
    );
  }

  private formatPercent(value: number) {
    return `${Number(value ?? 0).toFixed(1)}%`;
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

  private defaultAcademicYear() {
    const currentDate = new Date();
    const year = currentDate.getMonth() >= 8 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
    return `${year}-${year + 1}`;
  }

  private compactDepartmentTick(label: string) {
    const normalizedLabel = label.trim().replace(/\s+/g, ' ');
    if (!normalizedLabel) {
      return '-';
    }

    if (normalizedLabel.length <= 16) {
      return normalizedLabel;
    }

    const words = normalizedLabel.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxCharsPerLine = 16;

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (candidate.length <= maxCharsPerLine) {
        currentLine = candidate;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      if (word.length > maxCharsPerLine) {
        lines.push(`${word.slice(0, maxCharsPerLine - 3)}...`);
        currentLine = '';
      } else {
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    if (lines.length <= 2) {
      return lines;
    }

    const secondLineSource = lines.slice(1).join(' ');
    const secondLine =
      secondLineSource.length > maxCharsPerLine
        ? `${secondLineSource.slice(0, maxCharsPerLine - 3)}...`
        : secondLineSource;
    return [lines[0] ?? normalizedLabel, secondLine];
  }

  private activeDepartmentHead(departmentId: number, excludedUserId: number | null = null) {
    return (
      this.users()
        .filter(
          (user) =>
            user.role === 'CHEF_DEPARTEMENT' &&
            user.isActive &&
            user.departmentId === departmentId &&
            (excludedUserId == null || user.id !== excludedUserId)
        )
        .sort((first, second) => first.id - second.id)[0] ?? null
    );
  }

  private departmentHasActiveHead(departmentId: number, excludedUserId: number | null = null) {
    return this.activeDepartmentHead(departmentId, excludedUserId) !== null;
  }

  private patchUpdateForm(user: UserResponse) {
    this.updateForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role === 'SUPER_ADMIN' ? 'ADMINISTRATION' : user.role,
      teacherType: user.teacherType ?? 'PERMANENT',
      departmentId: user.departmentId != null ? String(user.departmentId) : '',
      isActive: user.isActive
    });
  }

  private roleDescription(role: RoleType) {
    switch (role) {
      case 'ENSEIGNANT':
        return "Compte enseignant pour les declarations d'activites, la disponibilite et le suivi individuel.";
      case 'CHEF_DEPARTEMENT':
        return 'Compte chef de departement pour la validation departementale et le pilotage du departement.';
      case 'ADMINISTRATION':
        return "Compte administration pour le tableau de bord institutionnel, la validation finale, les primes de performance et les rapports institutionnels.";
      default:
        return 'Selectionnez le role qui correspond aux responsabilites du futur utilisateur.';
    }
  }

  private buildCreateFormValidationMessage() {
    const invalidFields: string[] = [];

    if (this.createForm.controls.firstName.invalid) {
      invalidFields.push('le prenom');
    }

    if (this.createForm.controls.lastName.invalid) {
      invalidFields.push('le nom');
    }

    if (this.createForm.controls.email.invalid) {
      invalidFields.push("l'email institutionnel");
    }

    if (this.createForm.controls.departmentId.invalid) {
      invalidFields.push('le departement');
    }

    if (this.createForm.controls.role.value === 'ENSEIGNANT' && this.createForm.controls.teacherType.invalid) {
      invalidFields.push("le type d'enseignant");
    }

    if (this.createForm.controls.password.invalid) {
      invalidFields.push('un mot de passe valide');
    }

    if (this.createForm.controls.confirmPassword.invalid) {
      invalidFields.push('la confirmation du mot de passe');
    }

    if (this.createForm.hasError('passwordMismatch')) {
      invalidFields.push('des mots de passe identiques');
    }

    if (invalidFields.length === 0) {
      return 'Veuillez corriger le formulaire avant de creer le compte.';
    }

    return `Veuillez verifier ${invalidFields.join(', ')} avant de creer le compte.`;
  }

  private buildUpdateFormValidationMessage() {
    const invalidFields: string[] = [];

    if (this.updateForm.controls.firstName.invalid) {
      invalidFields.push('le prenom');
    }

    if (this.updateForm.controls.lastName.invalid) {
      invalidFields.push('le nom');
    }

    if (this.updateForm.controls.email.invalid) {
      invalidFields.push("l'email institutionnel");
    }

    if (this.updateForm.controls.departmentId.invalid) {
      invalidFields.push('le departement');
    }

    if (this.updateForm.controls.role.value === 'ENSEIGNANT' && this.updateForm.controls.teacherType.invalid) {
      invalidFields.push("le type d'enseignant");
    }

    if (invalidFields.length === 0) {
      return 'Veuillez corriger le formulaire avant de modifier le compte.';
    }

    return `Veuillez verifier ${invalidFields.join(', ')} avant de modifier le compte.`;
  }

  private resolveSuperAdminView(viewValue: unknown): SuperAdminUsersView {
    return viewValue === 'supervision' ? 'supervision' : 'management';
  }

  private resolveSupervisionSection(sectionValue: unknown): SupervisionSectionView {
    switch (sectionValue) {
      case 'structure':
      case 'technique':
      case 'connexions':
      case 'bareme-primes':
      case 'problemes-systeme':
        return sectionValue;
      default:
        return 'structure';
    }
  }

  private supervisionSectionLabel(section: SupervisionSectionView) {
    switch (section) {
      case 'structure':
        return 'Structure organisationnelle';
      case 'technique':
        return 'Supervision technique';
      case 'connexions':
        return 'Connexions estimees';
      case 'bareme-primes':
        return 'Bareme et primes';
      case 'problemes-systeme':
        return 'Suivi des problemes systeme';
      default:
        return 'Supervision systeme';
    }
  }

  private supervisionSectionHint(section: SupervisionSectionView) {
    switch (section) {
      case 'structure':
        return 'Departements, responsables et capacite enseignante.';
      case 'technique':
        return 'Journaux techniques, statut des actions et alertes.';
      case 'connexions':
        return 'Volume et tendance des connexions estimees.';
      case 'bareme-primes':
        return 'Configuration des regles et suivi des changements.';
      case 'problemes-systeme':
        return 'Incidents detectes, severite et suivi de resolution.';
      default:
        return 'Journaux, connexions, configuration et incidents.';
    }
  }
}
