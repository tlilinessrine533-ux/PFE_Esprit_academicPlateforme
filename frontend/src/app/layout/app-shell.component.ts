import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, timer } from 'rxjs';
import { NotificationOverviewResponse } from '../core/models/notification.models';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { UiToastService } from '../core/services/ui-toast.service';
import { AssistantWidgetComponent } from '../shared/assistant-widget.component';
import { ToastOutletComponent } from '../shared/toast-outlet.component';

interface ShellNavChildItem {
  label: string;
  path: string;
  hint: string;
  visible?: boolean;
}

interface ShellNavItem {
  label: string;
  path: string;
  icon: string;
  hint: string;
  visible: boolean;
  collapsible?: boolean;
  children?: ShellNavChildItem[];
}

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ToastOutletComponent, AssistantWidgetComponent, DatePipe],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly toastService = inject(UiToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly user = this.authService.user;
  readonly isAdministration = computed(() => this.authService.hasAnyRole('ADMINISTRATION'));
  readonly isDepartmentHead = computed(() => this.authService.hasAnyRole('CHEF_DEPARTEMENT'));
  readonly isSuperAdmin = computed(() => this.authService.hasAnyRole('SUPER_ADMIN'));
  readonly showNotificationCenter = computed(() => false);
  readonly notificationsLoading = signal(false);
  readonly notificationOverview = signal<NotificationOverviewResponse | null>(null);
  readonly currentUrl = signal(this.router.url);
  readonly currentDateTime = signal(new Date());
  readonly expandedNavGroups = signal<Record<string, boolean>>({});
  readonly routeEntering = signal(true);
  private routeEnterTimer: ReturnType<typeof setTimeout> | null = null;
  readonly navItems = computed(() => {
    const items: ShellNavItem[] = [
      {
        label: 'Tableau de bord',
        path: '/dashboard',
        icon: 'TB',
        hint: '',
        visible: this.authService.hasAnyRole('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
      },
      {
        label: this.isDepartmentHead() ? 'Activites enseignants' : 'Mes activites',
        path: '/teaching',
        icon: 'AC',
        hint: this.isDepartmentHead() ? 'Consultation du departement' : 'Toutes vos declarations',
        visible: this.authService.hasAnyRole('ENSEIGNANT', 'CHEF_DEPARTEMENT'),
        children: [
          { label: 'Cours', path: '/teaching', hint: 'Formation et modules' },
          { label: 'Encadrements', path: '/supervision', hint: 'PFE et jurys' },
          { label: 'Recherche', path: '/research', hint: 'Articles et conferences' },
          { label: 'Evenements', path: '/events', hint: 'Organisation scientifique' },
          { label: 'Surveillances', path: '/exam-surveillance', hint: 'Examens' },
          {
            label: 'Responsabilites',
            path: '/responsibilities',
            hint: 'Roles institutionnels'
          },
          {
            label: 'Partenariat',
            path: '/partnerships',
            hint: 'Declaration academique / professionnelle',
            visible: this.authService.hasAnyRole('ENSEIGNANT', 'CHEF_DEPARTEMENT')
          }
        ]
      },
      {
        label: 'Disponibilite',
        path: '/availability/leave',
        icon: 'DP',
        hint: 'Conges et missions',
        visible: this.authService.hasAnyRole('ENSEIGNANT'),
        collapsible: true,
        children: [
          { label: 'Demander un conge', path: '/availability/leave', hint: 'Declaration de conge' },
          { label: 'Demander une mission', path: '/availability/mission', hint: 'Declaration de mission' }
        ]
      },
      {
        label: 'Utilisateurs et roles',
        path: '/users',
        icon: 'US',
        hint: 'Gestion des utilisateurs et des roles',
        visible: this.authService.hasAnyRole('SUPER_ADMIN')
      },
      {
        label: 'Supervision systeme',
        path: '/users/supervision',
        icon: 'SP',
        hint: 'Journaux, connexions, configuration et incidents',
        visible: this.authService.hasAnyRole('SUPER_ADMIN'),
        collapsible: true,
        children: [
          {
            label: 'Structure organisationnelle',
            path: '/users/supervision/structure-organisationnelle',
            hint: 'Departements et capacite'
          },
          {
            label: 'Supervision technique',
            path: '/users/supervision/supervision-technique',
            hint: 'Journaux systeme'
          },
          {
            label: 'Connexions estimees',
            path: '/users/supervision/connexions-estimees',
            hint: 'Activite de connexion'
          },
          {
            label: 'Bareme et primes',
            path: '/users/supervision/bareme-et-primes',
            hint: 'Configuration des regles'
          },
          {
            label: 'Suivi des problemes systeme',
            path: '/users/supervision/suivi-problemes-systeme',
            hint: 'Incidents et alertes'
          }
        ]
      },
      {
        label: 'Suivi absences',
        path: '/absences',
        icon: 'AB',
        hint: "Jours d'absence des enseignants",
        visible: this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION')
      },
      {
        label: 'Administration RH',
        path: '/administration',
        icon: 'AD',
        hint: 'Bonus, promotion et parametres',
        visible: this.authService.hasAnyRole('ADMINISTRATION')
      },
      {
        label: this.isDepartmentHead()
          ? 'Validation et historique'
          : 'Workflow',
        path: '/workflow',
        icon: 'WF',
        hint: this.isDepartmentHead() ? 'Valider, rejeter et consulter l historique' : 'Validation des dossiers',
        visible: this.authService.hasAnyRole('CHEF_DEPARTEMENT', 'ADMINISTRATION')
      },
      {
        label: this.isSuperAdmin()
          ? 'Rapports globaux'
          : this.isAdministration()
          ? 'Rapports institutionnels'
          : this.isDepartmentHead()
            ? 'Rapports departementaux'
            : 'Rapport individuel',
        path: '/reports',
        icon: 'RP',
        hint: this.isSuperAdmin()
          ? 'Generation et historique globaux'
          : this.isAdministration()
          ? 'Rapports et primes de performance'
          : this.isDepartmentHead()
            ? 'Exports consolides du departement'
            : 'Generation et historique individuel',
        visible: this.authService.hasAnyRole('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
      },
      {
        label: 'Profil et securite',
        path: '/profile',
        icon: 'PR',
        hint: 'Compte, profil et 2FA',
        visible: this.authService.hasAnyRole('ENSEIGNANT', 'CHEF_DEPARTEMENT', 'ADMINISTRATION', 'SUPER_ADMIN')
      }
    ];

    return items
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) => child.visible !== false)
      }))
      .filter((item) => item.visible);
  });
  readonly recentNotifications = computed(() => (this.notificationOverview()?.notifications ?? []).slice(0, 3));
  readonly unreadNotificationsCount = computed(() => this.notificationOverview()?.unreadCount ?? 0);
  readonly currentDateLabel = computed(() =>
    new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    }).format(this.currentDateTime())
  );
  readonly currentTimeLabel = computed(() =>
    new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(this.currentDateTime())
  );
  readonly workspaceGreeting = computed(() => {
    const hour = this.currentDateTime().getHours();

    if (hour < 12) {
      return 'Bonjour';
    }

    if (hour < 18) {
      return 'Bon apres-midi';
    }

    return 'Bonsoir';
  });
  readonly activeWorkspaceLabel = computed(() => {
    const currentUrl = this.currentUrl();

    for (const item of this.navItems()) {
      const activeChild = item.children?.find((child) => currentUrl === child.path || currentUrl.startsWith(`${child.path}/`));
      if (activeChild) {
        return activeChild.label;
      }

      if (currentUrl === item.path || currentUrl.startsWith(`${item.path}/`)) {
        return item.label;
      }
    }

    return 'Espace de travail';
  });
  readonly activeWorkspaceHint = computed(() => {
    const currentUrl = this.currentUrl();

    for (const item of this.navItems()) {
      const activeChild = item.children?.find((child) => currentUrl === child.path || currentUrl.startsWith(`${child.path}/`));
      if (activeChild) {
        return activeChild.hint;
      }

      if (currentUrl === item.path || currentUrl.startsWith(`${item.path}/`)) {
        return item.hint;
      }
    }

    return 'Plateforme academique ESPRIT';
  });
  readonly userInitials = computed(() => {
    const currentUser = this.user();
    if (!currentUser) {
      return 'U';
    }

    return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
  });

  constructor() {
    this.triggerRouteEntrance();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.triggerRouteEntrance();
      });

    timer(0, 20000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentDateTime.set(new Date());

        if (!this.showNotificationCenter()) {
          return;
        }

        this.loadNotifications();
      });

    this.destroyRef.onDestroy(() => {
      if (this.routeEnterTimer != null) {
        clearTimeout(this.routeEnterTimer);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  roleLabel(role: string | undefined) {
    switch (role) {
      case 'ENSEIGNANT':
        return 'Enseignant';
      case 'CHEF_DEPARTEMENT':
        return 'Chef de departement';
      case 'ADMINISTRATION':
        return 'Administration';
      case 'SUPER_ADMIN':
        return 'Super administrateur';
      default:
        return 'Utilisateur';
    }
  }

  loadNotifications(showErrorToast = false) {
    if (!this.showNotificationCenter()) {
      this.notificationOverview.set(null);
      this.notificationsLoading.set(false);
      return;
    }

    this.notificationsLoading.set(true);

    this.notificationService
      .getOverview()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (overview) => {
          this.notificationOverview.set(overview);
          this.notificationsLoading.set(false);
        },
        error: () => {
          this.notificationsLoading.set(false);
          if (showErrorToast) {
            this.toastService.warning(
              'Notifications indisponibles',
              "Le centre de notifications n'a pas pu etre charge."
            );
          }
        }
      });
  }

  markNotificationAsRead(notificationId: number) {
    if (!this.showNotificationCenter()) {
      return;
    }

    this.notificationService
      .markAsRead(notificationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (overview) => {
          this.notificationOverview.set(overview);
        },
        error: () => {
          this.toastService.warning('Action impossible', "La notification n'a pas pu etre mise a jour.");
        }
      });
  }

  markAllNotificationsAsRead() {
    if (!this.showNotificationCenter()) {
      return;
    }

    this.notificationService
      .markAllAsRead()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (overview) => {
          this.notificationOverview.set(overview);
          this.toastService.success('Notifications lues', 'Toutes les notifications visibles ont ete marquees comme lues.');
        },
        error: () => {
          this.toastService.warning('Action impossible', "Les notifications n'ont pas pu etre mises a jour.");
        }
      });
  }

  isRouteActive(path: string) {
    const currentUrl = this.currentUrl();
    return currentUrl === path || currentUrl.startsWith(`${path}/`);
  }

  isNavItemActive(item: ShellNavItem) {
    return this.isRouteActive(item.path);
  }

  isNavGroupActive(item: ShellNavItem) {
    if (item.children?.some((child) => this.isRouteActive(child.path))) {
      return true;
    }

    return this.isNavItemActive(item);
  }

  isNavGroupExpanded(item: ShellNavItem) {
    if (!item.collapsible) {
      return true;
    }

    return this.expandedNavGroups()[item.path] === true;
  }

  toggleNavGroup(item: ShellNavItem) {
    if (!item.collapsible) {
      return;
    }

    this.expandedNavGroups.update((groups) => ({
      ...groups,
      [item.path]: !groups[item.path]
    }));
  }

  private triggerRouteEntrance() {
    this.routeEntering.set(false);
    if (this.routeEnterTimer != null) {
      clearTimeout(this.routeEnterTimer);
    }

    this.routeEnterTimer = setTimeout(() => {
      this.routeEntering.set(true);
      this.routeEnterTimer = null;
    }, 18);
  }
}
