import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CreateSupervisionActivityPayload,
  SupervisionActivityResponse,
  SupervisionSummaryResponse
} from '../models/supervision.models';

@Injectable({ providedIn: 'root' })
export class SupervisionService {
  private readonly http = inject(HttpClient);

  getSupervisionActivities() {
    return this.http.get<SupervisionActivityResponse[]>('/api/supervision-activities');
  }

  getSummary() {
    return this.http.get<SupervisionSummaryResponse>('/api/supervision-activities/summary');
  }

  createSupervisionActivity(payload: CreateSupervisionActivityPayload) {
    return this.http.post<SupervisionActivityResponse>('/api/supervision-activities', payload);
  }

  updateSupervisionActivity(id: number, payload: CreateSupervisionActivityPayload) {
    return this.http.put<SupervisionActivityResponse>(`/api/supervision-activities/${id}`, payload);
  }

  deleteSupervisionActivity(id: number) {
    return this.http.delete<void>(`/api/supervision-activities/${id}`);
  }
}
