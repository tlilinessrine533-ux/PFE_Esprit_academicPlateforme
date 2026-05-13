import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  WorkflowActivityResponse,
  WorkflowHistoryResponse,
  WorkflowReviewPayload
} from '../models/workflow.models';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private readonly http = inject(HttpClient);

  getActivities() {
    return this.http.get<WorkflowActivityResponse[]>('/api/workflow/activities');
  }

  getDepartmentPendingActivities() {
    return this.http.get<WorkflowActivityResponse[]>('/api/workflow/pending/department');
  }

  getFinalPendingActivities() {
    return this.http.get<WorkflowActivityResponse[]>('/api/workflow/pending/final');
  }

  getValidationHistory(id: number) {
    return this.http.get<WorkflowHistoryResponse[]>(`/api/workflow/${id}/history`);
  }

  submitActivity(id: number) {
    return this.http.post<WorkflowActivityResponse>(`/api/workflow/${id}/submit`, {});
  }

  departmentReviewActivity(id: number, payload: WorkflowReviewPayload) {
    return this.http.post<WorkflowActivityResponse>(`/api/workflow/${id}/department-review`, payload);
  }

  finalReviewActivity(id: number, payload: WorkflowReviewPayload) {
    return this.http.post<WorkflowActivityResponse>(`/api/workflow/${id}/final-review`, payload);
  }
}
