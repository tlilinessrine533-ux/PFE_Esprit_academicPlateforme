import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateTeachingActivityPayload, TeachingActivityResponse } from '../models/teaching.models';
import { ValidationActionPayload, ValidationHistoryResponse } from '../models/validation.models';

@Injectable({ providedIn: 'root' })
export class TeachingService {
  private readonly http = inject(HttpClient);

  getTeachingActivities() {
    return this.http.get<TeachingActivityResponse[]>('/api/teaching-activities');
  }

  createTeachingActivity(payload: CreateTeachingActivityPayload) {
    return this.http.post<TeachingActivityResponse>('/api/teaching-activities', payload);
  }

  updateTeachingActivity(id: number, payload: CreateTeachingActivityPayload) {
    return this.http.put<TeachingActivityResponse>(`/api/teaching-activities/${id}`, payload);
  }

  submitTeachingActivity(id: number) {
    return this.http.post<TeachingActivityResponse>(`/api/teaching-activities/${id}/submit`, {});
  }

  getDepartmentPendingTeachingActivities() {
    return this.http.get<TeachingActivityResponse[]>('/api/teaching-activities/pending/department');
  }

  getFinalPendingTeachingActivities() {
    return this.http.get<TeachingActivityResponse[]>('/api/teaching-activities/pending/final');
  }

  departmentReviewTeachingActivity(id: number, payload: ValidationActionPayload) {
    return this.http.post<TeachingActivityResponse>(`/api/teaching-activities/${id}/department-review`, payload);
  }

  finalReviewTeachingActivity(id: number, payload: ValidationActionPayload) {
    return this.http.post<TeachingActivityResponse>(`/api/teaching-activities/${id}/final-review`, payload);
  }

  getValidationHistory(id: number) {
    return this.http.get<ValidationHistoryResponse[]>(`/api/teaching-activities/${id}/validation-history`);
  }

  deleteTeachingActivity(id: number) {
    return this.http.delete<void>(`/api/teaching-activities/${id}`);
  }
}
