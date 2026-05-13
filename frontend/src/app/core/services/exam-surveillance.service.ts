import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CreateExamSurveillanceActivityPayload,
  ExamSurveillanceActivityResponse,
  ExamSurveillanceSummaryResponse
} from '../models/exam-surveillance.models';

@Injectable({ providedIn: 'root' })
export class ExamSurveillanceService {
  private readonly http = inject(HttpClient);

  getExamSurveillanceActivities() {
    return this.http.get<ExamSurveillanceActivityResponse[]>('/api/exam-surveillance-activities');
  }

  getSummary() {
    return this.http.get<ExamSurveillanceSummaryResponse>('/api/exam-surveillance-activities/summary');
  }

  createExamSurveillanceActivity(payload: CreateExamSurveillanceActivityPayload) {
    return this.http.post<ExamSurveillanceActivityResponse>('/api/exam-surveillance-activities', payload);
  }

  updateExamSurveillanceActivity(id: number, payload: CreateExamSurveillanceActivityPayload) {
    return this.http.put<ExamSurveillanceActivityResponse>(`/api/exam-surveillance-activities/${id}`, payload);
  }

  deleteExamSurveillanceActivity(id: number) {
    return this.http.delete<void>(`/api/exam-surveillance-activities/${id}`);
  }
}
