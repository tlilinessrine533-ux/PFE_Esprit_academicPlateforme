import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
    return this.http.put<AdministrationConfig>('/api/administration/config', payload);
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

