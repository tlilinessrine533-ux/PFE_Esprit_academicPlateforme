import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateResearchActivityPayload, ResearchActivityResponse, ResearchSummaryResponse } from '../models/research.models';

@Injectable({ providedIn: 'root' })
export class ResearchService {
  private readonly http = inject(HttpClient);

  getResearchActivities() {
    return this.http.get<ResearchActivityResponse[]>('/api/research-activities');
  }

  getSummary() {
    return this.http.get<ResearchSummaryResponse>('/api/research-activities/summary');
  }

  createResearchActivity(payload: CreateResearchActivityPayload) {
    return this.http.post<ResearchActivityResponse>('/api/research-activities', payload);
  }

  updateResearchActivity(id: number, payload: CreateResearchActivityPayload) {
    return this.http.put<ResearchActivityResponse>(`/api/research-activities/${id}`, payload);
  }

  deleteResearchActivity(id: number) {
    return this.http.delete<void>(`/api/research-activities/${id}`);
  }
}
