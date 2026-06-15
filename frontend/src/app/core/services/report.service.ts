import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerateIndividualReportPayload, ReportResponse } from '../models/report.models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);

  getReports() {
    return this.http.get<ReportResponse[]>('/api/reports');
  }

  getIndividualAcademicYears() {
    return this.http.get<string[]>('/api/reports/individual/academic-years');
  }

  generatePdf(payload: GenerateIndividualReportPayload) {
    return this.http.post('/api/reports/individual/pdf', payload, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateExcel(payload: GenerateIndividualReportPayload) {
    return this.http.post('/api/reports/individual/excel', payload, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateDepartmentPdf(periodLabel: string, departmentId?: number | null) {
    let params = new HttpParams().set('periodLabel', periodLabel);
    if (departmentId != null) {
      params = params.set('departmentId', departmentId);
    }

    return this.http.post('/api/reports/department/pdf', null, {
      params,
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateDepartmentExcel(periodLabel: string, departmentId?: number | null) {
    let params = new HttpParams().set('periodLabel', periodLabel);
    if (departmentId != null) {
      params = params.set('departmentId', departmentId);
    }

    return this.http.post('/api/reports/department/excel', null, {
      params,
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateInstitutionPdf(periodLabel: string) {
    return this.http.post('/api/reports/institution/pdf', null, {
      params: new HttpParams().set('periodLabel', periodLabel),
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateInstitutionExcel(periodLabel: string) {
    return this.http.post('/api/reports/institution/excel', null, {
      params: new HttpParams().set('periodLabel', periodLabel),
      observe: 'response',
      responseType: 'blob'
    });
  }

  downloadReport(id: number) {
    return this.http.get(`/api/reports/${id}/download`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  saveResponseFile(response: HttpResponse<Blob>) {
    const body = response.body;
    if (!body) {
      return;
    }

    const filename = this.extractFilename(response.headers) ?? 'rapport';
    const url = window.URL.createObjectURL(body);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }

  private extractFilename(headers: HttpHeaders) {
    const disposition = headers.get('content-disposition');
    if (!disposition) {
      return null;
    }

    const match = disposition.match(/filename=\"?([^\";]+)\"?/i);
    return match ? match[1] : null;
  }
}
