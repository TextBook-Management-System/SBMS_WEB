import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private readonly api: ApiService) {}

  /**
   * GET /api/v1/reports/types
   * Get available report types
   */
  getReportTypes(): Observable<ReportType[]> {
    return this.api.get<ReportType[]>('/reports/types');
  }

  /**
   * GET /api/v1/reports/generate
   * Generate a report by type
   */
  generateReport(reportType: string, params?: Record<string, any>): Observable<any> {
    return this.api.get<any>('/reports/generate', { report_type: reportType, ...params });
  }
}
