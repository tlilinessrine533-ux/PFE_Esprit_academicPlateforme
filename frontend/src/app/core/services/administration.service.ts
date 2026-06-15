import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {
  AbsenceSummaryResponse,
  AdministrationConfig,
  AdministrationConfigUpdateRequest,
  AdministrativeDecisionHistoryResponse,
  AdministrativeDecisionRequest,
  AdministrativeEvaluationResponse
} from '../models/administration.models';

@Injectable({ providedIn: 'root' })
export class AdministrationService {
  private readonly http = inject(HttpClient);

  getConfiguration() {
    return this.http.get<AdministrationConfig>('/api/administration/config');
  }

  updateConfiguration(payload: AdministrationConfigUpdateRequest) {
    return this.http.put<AdministrationConfig>('/api/administration/config', payload).pipe(
      catchError((error: unknown) => {
        if (!(error instanceof HttpErrorResponse) || error.status !== 400) {
          return throwError(() => error);
        }

        const compatibilityPayload = {
          ...payload,
          bonusBaseAmount: payload.referencePoints,
          bonusAmountPerPoint: 0,
          availabilityActivityPoint: 0
        };

        return this.http.put<AdministrationConfig>('/api/administration/config', compatibilityPayload);
      })
    );
  }

  getEvaluations(periodLabel: string) {
    const params = new HttpParams().set('periodLabel', periodLabel);
    return this.http.get<AdministrativeEvaluationResponse[]>('/api/administration/evaluations', { params });
  }

  submitFinalDecision(teacherId: number, payload: AdministrativeDecisionRequest) {
    return this.http.post<AdministrativeDecisionHistoryResponse>(
      `/api/administration/evaluations/${teacherId}/final-decision`,
      payload
    );
  }

  getHistory(periodLabel: string) {
    const params = new HttpParams().set('periodLabel', periodLabel);
    return this.http.get<AdministrativeDecisionHistoryResponse[]>('/api/administration/history', { params });
  }

  getAbsenceSummaries(periodLabel: string) {
    const params = new HttpParams().set('periodLabel', periodLabel);
    return this.http.get<AbsenceSummaryResponse[]>('/api/administration/absences', { params });
  }
}
