import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const isLoginFlowRequest = (url: string) =>
  url.includes('/api/auth/login') ||
  url.includes('/api/auth/password-reset') ||
  url.includes('/api/auth/passkeys/login') ||
  url.includes('/api/auth/face-recognition/login');

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  const requestWithAuth = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : request;

  return next(requestWithAuth).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        authService.isAuthenticated() &&
        !isLoginFlowRequest(request.url)
      ) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
