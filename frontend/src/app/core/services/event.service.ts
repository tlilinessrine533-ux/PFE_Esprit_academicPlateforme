import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateEventActivityPayload, EventActivityResponse, EventSummaryResponse } from '../models/event.models';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);

  getEventActivities() {
    return this.http.get<EventActivityResponse[]>('/api/event-activities');
  }

  getSummary() {
    return this.http.get<EventSummaryResponse>('/api/event-activities/summary');
  }

  createEventActivity(payload: CreateEventActivityPayload) {
    return this.http.post<EventActivityResponse>('/api/event-activities', payload);
  }

  updateEventActivity(id: number, payload: CreateEventActivityPayload) {
    return this.http.put<EventActivityResponse>(`/api/event-activities/${id}`, payload);
  }

  deleteEventActivity(id: number) {
    return this.http.delete<void>(`/api/event-activities/${id}`);
  }
}
