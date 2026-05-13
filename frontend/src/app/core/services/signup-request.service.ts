import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CreateSignupRequestPayload,
  ReviewSignupRequestPayload,
  SignupRequestResponse
} from '../models/signup-request.models';

@Injectable({ providedIn: 'root' })
export class SignupRequestService {
  private readonly http = inject(HttpClient);

  createRequest(payload: CreateSignupRequestPayload) {
    return this.http.post<SignupRequestResponse>('/api/signup-requests', payload);
  }

  getRequests() {
    return this.http.get<SignupRequestResponse[]>('/api/signup-requests');
  }

  approveRequest(id: number, payload: ReviewSignupRequestPayload) {
    return this.http.post<SignupRequestResponse>(`/api/signup-requests/${id}/approve`, payload);
  }

  rejectRequest(id: number, payload: ReviewSignupRequestPayload) {
    return this.http.post<SignupRequestResponse>(`/api/signup-requests/${id}/reject`, payload);
  }
}
