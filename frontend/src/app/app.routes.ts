import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';
import { RoleType } from './core/models/shared.models';

const activityRoles: RoleType[] = ['ENSEIGNANT', 'CHEF_DEPARTEMENT'];
const activityCreateRoles: RoleType[] = ['ENSEIGNANT'];
const responsibilityRoles: RoleType[] = ['ENSEIGNANT', 'CHEF_DEPARTEMENT'];
const responsibilityCreateRoles: RoleType[] = ['ENSEIGNANT', 'CHEF_DEPARTEMENT'];
const teacherOnlyRoles: RoleType[] = ['ENSEIGNANT'];
const dashboardRoles: RoleType[] = ['ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN'];
const managementRoles: RoleType[] = ['SUPER_ADMIN'];
const profileRoles: RoleType[] = ['ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN'];
const reportsRoles: RoleType[] = ['ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN'];
const workflowRoles: RoleType[] = ['ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION'];
const administrationRoles: RoleType[] = ['ADMINISTRATION'];
const absenceTrackingRoles: RoleType[] = ['CHEF_DEPARTEMENT', 'ADMINISTRATION'];

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login-page.component').then((m) => m.LoginPageComponent)
  },
  {
    path: 'signup',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/forgot-password-page.component').then((m) => m.ForgotPasswordPageComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: dashboardRoles },
        loadComponent: () => import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent)
      },
      {
        path: 'profile',
        canActivate: [roleGuard],
        data: { roles: profileRoles },
        loadComponent: () => import('./features/profile/profile-page.component').then((m) => m.ProfilePageComponent)
      },
      {
        path: 'availability/leave',
        canActivate: [roleGuard],
        data: { roles: teacherOnlyRoles, requestType: 'CONGE' },
        loadComponent: () =>
          import('./features/availability/availability-request-page.component').then((m) => m.AvailabilityRequestPageComponent)
      },
      {
        path: 'availability/mission',
        canActivate: [roleGuard],
        data: { roles: teacherOnlyRoles, requestType: 'MISSION' },
        loadComponent: () =>
          import('./features/availability/availability-request-page.component').then((m) => m.AvailabilityRequestPageComponent)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: managementRoles, view: 'management' },
        loadComponent: () => import('./features/users/users-page.component').then((m) => m.UsersPageComponent)
      },
      {
        path: 'users/supervision',
        pathMatch: 'full',
        redirectTo: 'users/supervision/structure-organisationnelle'
      },
      {
        path: 'users/supervision/structure-organisationnelle',
        canActivate: [roleGuard],
        data: { roles: managementRoles, view: 'supervision', supervisionSection: 'structure' },
        loadComponent: () => import('./features/users/users-page.component').then((m) => m.UsersPageComponent)
      },
      {
        path: 'users/supervision/supervision-technique',
        canActivate: [roleGuard],
        data: { roles: managementRoles, view: 'supervision', supervisionSection: 'technique' },
        loadComponent: () => import('./features/users/users-page.component').then((m) => m.UsersPageComponent)
      },
      {
        path: 'users/supervision/connexions-estimees',
        canActivate: [roleGuard],
        data: { roles: managementRoles, view: 'supervision', supervisionSection: 'connexions' },
        loadComponent: () => import('./features/users/users-page.component').then((m) => m.UsersPageComponent)
      },
      {
        path: 'users/supervision/bareme-et-primes',
        canActivate: [roleGuard],
        data: { roles: managementRoles, view: 'supervision', supervisionSection: 'bareme-primes' },
        loadComponent: () => import('./features/users/users-page.component').then((m) => m.UsersPageComponent)
      },
      {
        path: 'users/supervision/suivi-problemes-systeme',
        canActivate: [roleGuard],
        data: { roles: managementRoles, view: 'supervision', supervisionSection: 'problemes-systeme' },
        loadComponent: () => import('./features/users/users-page.component').then((m) => m.UsersPageComponent)
      },
      {
        path: 'teaching/new',
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: 'create' },
        loadComponent: () => import('./features/teaching/teaching-page.component').then((m) => m.TeachingPageComponent)
      },
      {
        path: 'partnerships/new',
        canActivate: [roleGuard],
        data: {
          roles: activityCreateRoles,
          mode: 'create',
          forcedActivityType: 'PARTENARIAT',
          createPath: '/partnerships/new',
          listPath: '/partnerships'
        },
        loadComponent: () => import('./features/teaching/teaching-page.component').then((m) => m.TeachingPageComponent)
      },
      {
        path: 'partnerships',
        canActivate: [roleGuard],
        data: {
          roles: activityRoles,
          mode: 'list',
          forcedActivityType: 'PARTENARIAT',
          activityListFilterType: 'PARTENARIAT',
          createPath: '/partnerships/new',
          listPath: '/partnerships'
        },
        loadComponent: () => import('./features/teaching/teaching-page.component').then((m) => m.TeachingPageComponent)
      },
      {
        path: 'teaching',
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: 'list' },
        loadComponent: () => import('./features/teaching/teaching-page.component').then((m) => m.TeachingPageComponent)
      },
      {
        path: 'supervision/new',
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: 'create' },
        loadComponent: () =>
          import('./features/supervision/supervision-page.component').then((m) => m.SupervisionPageComponent)
      },
      {
        path: 'supervision',
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: 'list' },
        loadComponent: () =>
          import('./features/supervision/supervision-page.component').then((m) => m.SupervisionPageComponent)
      },
      {
        path: 'research/new',
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: 'create' },
        loadComponent: () =>
          import('./features/research/research-page.component').then((m) => m.ResearchPageComponent)
      },
      {
        path: 'research',
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: 'list' },
        loadComponent: () =>
          import('./features/research/research-page.component').then((m) => m.ResearchPageComponent)
      },
      {
        path: 'events/new',
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: 'create' },
        loadComponent: () => import('./features/events/events-page.component').then((m) => m.EventsPageComponent)
      },
      {
        path: 'events',
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: 'list' },
        loadComponent: () => import('./features/events/events-page.component').then((m) => m.EventsPageComponent)
      },
      {
        path: 'exam-surveillance/new',
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: 'create' },
        loadComponent: () =>
          import('./features/exam-surveillance/exam-surveillance-page.component').then(
            (m) => m.ExamSurveillancePageComponent
          )
      },
      {
        path: 'exam-surveillance',
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: 'list' },
        loadComponent: () =>
          import('./features/exam-surveillance/exam-surveillance-page.component').then(
            (m) => m.ExamSurveillancePageComponent
          )
      },
      {
        path: 'responsibilities/new',
        canActivate: [roleGuard],
        data: { roles: responsibilityCreateRoles, mode: 'create' },
        loadComponent: () =>
          import('./features/responsibilities/responsibilities-page.component').then(
            (m) => m.ResponsibilitiesPageComponent
          )
      },
      {
        path: 'responsibilities',
        canActivate: [roleGuard],
        data: { roles: responsibilityRoles, mode: 'list' },
        loadComponent: () =>
          import('./features/responsibilities/responsibilities-page.component').then(
            (m) => m.ResponsibilitiesPageComponent
          )
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: reportsRoles },
        loadComponent: () => import('./features/reports/reports-page.component').then((m) => m.ReportsPageComponent)
      },
      {
        path: 'administration',
        canActivate: [roleGuard],
        data: { roles: administrationRoles },
        loadComponent: () =>
          import('./features/administration/administration-page.component').then((m) => m.AdministrationPageComponent)
      },
      {
        path: 'absences',
        canActivate: [roleGuard],
        data: { roles: absenceTrackingRoles },
        loadComponent: () =>
          import('./features/availability/absence-tracking-page.component').then((m) => m.AbsenceTrackingPageComponent)
      },
      {
        path: 'workflow',
        canActivate: [roleGuard],
        data: { roles: workflowRoles },
        loadComponent: () => import('./features/workflow/workflow-page.component').then((m) => m.WorkflowPageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
