import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

@Component({
  selector: 'app-report-list',
  standalone: false,
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.css']
})
export class ReportListComponent implements OnInit {
  reportTypes: ReportType[] = [];
  isLoading = true;
  loadError: string | null = null;

  // Generation
  selectedType: string | null = null;
  selectedFormat: string = 'pdf';
  isGenerating = false;
  generateError: string | null = null;
  generateSuccess: string | null = null;

  constructor(
    private readonly api: ApiService,
    private readonly http: HttpClient,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReportTypes();
  }

  loadReportTypes(): void {
    this.isLoading = true;
    this.loadError = null;

    this.api.get<ReportType[]>('/reports/types').subscribe({
      next: (types) => {
        this.zone.run(() => {
          this.reportTypes = types || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.reportTypes = [];
          this.isLoading = false;
          this.loadError = 'Could not load report types';
          this.cdr.detectChanges();
        });
      }
    });
  }

  selectType(id: string): void {
    this.selectedType = id;
    this.generateError = null;
    this.generateSuccess = null;
  }

  getSelectedTypeInfo(): ReportType | undefined {
    return this.reportTypes.find(r => r.id === this.selectedType);
  }

  generateReport(): void {
    if (!this.selectedType) return;
    this.isGenerating = true;
    this.generateError = null;
    this.generateSuccess = null;

    this.api.get<any>('/reports/generate', {
      report_type: this.selectedType,
      format: this.selectedFormat
    }).subscribe({
      next: (response) => {
        this.zone.run(() => {
          this.isGenerating = false;

          // If response has a download URL, trigger download
          if (response?.download_url) {
            this.downloadFile(response.download_url, `${this.selectedType}_report.${this.selectedFormat}`);
            this.generateSuccess = 'Report generated successfully! Download started.';
          } else if (response?.file_url) {
            this.downloadFile(response.file_url, `${this.selectedType}_report.${this.selectedFormat}`);
            this.generateSuccess = 'Report generated! Download started.';
          } else {
            // Response is the report data itself — download as JSON
            this.downloadJson(response, `${this.selectedType}_report.json`);
            this.generateSuccess = 'Report generated and downloaded.';
          }
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isGenerating = false;
          this.generateError = 'Failed to generate report. Please try again.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  private downloadFile(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private downloadJson(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    this.downloadFile(url, filename);
    URL.revokeObjectURL(url);
  }
}
