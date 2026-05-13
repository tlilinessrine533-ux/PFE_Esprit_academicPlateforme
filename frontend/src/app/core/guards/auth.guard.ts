import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleType } from '../models/shared.models';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as RoleType[] | undefined;
  if (!allowedRoles?.length || authService.hasAnyRole(...allowedRoles)) {
    return true;
  }

  return router.parseUrl(authService.defaultRoute());
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? router.parseUrl(authService.defaultRoute()) : true;
};
