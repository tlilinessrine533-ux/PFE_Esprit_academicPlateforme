import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  DepartmentDashboardResponse,
  GlobalDashboardResponse,
  PersonalDashboardResponse
} from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getPersonal(periodLabel: string) {
    const params = new HttpParams()
      .set('periodLabel', periodLabel)
      .set('_ts', Date.now().toString());
    return this.http.get<PersonalDashboardResponse>('/api/dashboard/personal', { params });
  }

  getDepartment(periodLabel: string, departmentId?: number) {
    let params = new HttpParams()
      .set('periodLabel', periodLabel)
      .set('_ts', Date.now().toString());
    if (departmentId) {
      params = params.set('departmentId', departmentId);
    }
    return this.http.get<DepartmentDashboardResponse>('/api/dashboard/department', { params });
  }

  getGlobal(periodLabel: string) {
    const params = new HttpParams()
      .set('periodLabel', periodLabel)
      .set('_ts', Date.now().toString());
    return this.http.get<GlobalDashboardResponse>('/api/dashboard/global', { params });
  }
}
