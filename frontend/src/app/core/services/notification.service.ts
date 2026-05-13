import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NotificationOverviewResponse } from '../models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);

  getOverview() {
    return this.http.get<NotificationOverviewResponse>('/api/notifications');
  }

  markAsRead(id: number) {
    return this.http.post<NotificationOverviewResponse>(`/api/notifications/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.post<NotificationOverviewResponse>('/api/notifications/read-all', {});
  }
}
