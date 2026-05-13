import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CreateResponsibilityActivityPayload,
  ResponsibilityActivityResponse,
  ResponsibilitySummaryResponse
} from '../models/responsibility.models';

@Injectable({ providedIn: 'root' })
export class ResponsibilityService {
  private readonly http = inject(HttpClient);

  getResponsibilityActivities() {
    return this.http.get<ResponsibilityActivityResponse[]>('/api/responsibility-activities');
  }

  getSummary() {
    return this.http.get<ResponsibilitySummaryResponse>('/api/responsibility-activities/summary');
  }

  createResponsibilityActivity(payload: CreateResponsibilityActivityPayload) {
    return this.http.post<ResponsibilityActivityResponse>('/api/responsibility-activities', payload);
  }

  updateResponsibilityActivity(id: number, payload: CreateResponsibilityActivityPayload) {
    return this.http.put<ResponsibilityActivityResponse>(`/api/responsibility-activities/${id}`, payload);
  }

  deleteResponsibilityActivity(id: number) {
    return this.http.delete<void>(`/api/responsibility-activities/${id}`);
  }
}
