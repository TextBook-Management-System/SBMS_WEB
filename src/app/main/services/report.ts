import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  generatedAt: Date;
  data: Record<string, unknown>[];
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportTypes: ReportType[] = [
    { id: 'book-distribution', title: 'Book Distribution', description: 'Overview of book distribution across all schools in the district', icon: 'pi pi-book', category: 'Distribution' },
    { id: 'condition-summary', title: 'Condition Summary', description: 'Summary of book conditions across all schools', icon: 'pi pi-chart-bar', category: 'Condition' },
    { id: 'school-comparison', title: 'School Comparison', description: 'Compare book-to-learner ratios between schools', icon: 'pi pi-chart-line', category: 'Comparison' },
    { id: 'request-history', title: 'Request History', description: 'Historical overview of book requests and fulfillment rates', icon: 'pi pi-history', category: 'Requests' },
    { id: 'learner-coverage', title: 'Learner Coverage', description: 'Percentage of learners with assigned textbooks per subject', icon: 'pi pi-users', category: 'Coverage' },
    { id: 'loss-damage', title: 'Loss & Damage Report', description: 'Track lost and damaged books by school and grade', icon: 'pi pi-exclamation-triangle', category: 'Condition' },
  ];

  getReportTypes(): Observable<ReportType[]> {
    return of(this.reportTypes);
  }

  generateReport(reportId: string): Observable<GeneratedReport> {
    const reportType = this.reportTypes.find(r => r.id === reportId);
    const report: GeneratedReport = {
      id: reportId,
      title: reportType?.title || 'Report',
      generatedAt: new Date(),
      summary: `Generated ${reportType?.title} report with data from 5 schools.`,
      data: [
        { school: 'Greenfield Primary', value: 1200, percentage: 85 },
        { school: 'Sunrise Secondary', value: 1800, percentage: 92 },
        { school: 'Hillcrest Combined', value: 900, percentage: 68 },
        { school: 'Valley View Primary', value: 1050, percentage: 78 },
        { school: 'Riverside High', value: 2100, percentage: 95 },
      ]
    };
    return of(report);
  }
}
