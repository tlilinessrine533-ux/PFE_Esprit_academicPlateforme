import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AvailabilityRequestResponse,
  CreateLeaveAvailabilityPayload,
  CreateMissionAvailabilityPayload
} from '../models/availability.models';
import { AvailabilityRequestType } from '../models/shared.models';

@Injectable({ providedIn: 'root' })
export class AvailabilityRequestService {
  private readonly http = inject(HttpClient);

  getRequests(type: AvailabilityRequestType) {
    const params = new HttpParams().set('type', type);
    return this.http.get<AvailabilityRequestResponse[]>('/api/availability-requests', { params });
  }

  createLeaveRequest(payload: CreateLeaveAvailabilityPayload) {
    return this.http.post<AvailabilityRequestResponse>('/api/availability-requests/leave', payload);
  }

  createMissionRequest(payload: CreateMissionAvailabilityPayload) {
    return this.http.post<AvailabilityRequestResponse>('/api/availability-requests/mission', payload);
  }
}
