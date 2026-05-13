import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';

interface ReportTypeItem {
  type: string;
  description: string;
}

interface ReportTypesResponse {
  report_types: ReportTypeItem[];
  formats: string[];
}

@Component({
  selector: 'app-report-list',
  standalone: false,
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.css']
})
export class ReportListComponent implements OnInit {
  reportTypes: ReportTypeItem[] = [];
  formats: string[] = [];
  isLoading = true;
  loadError: string | null = null;

  // Generation
  selectedType: string | null = null;
  selectedFormat: string = '';
  isGenerating = false;
  generateError: string | null = null;
  generateSuccess: string | null = null;

  constructor(
    private readonly api: ApiService,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReportTypes();
  }

  loadReportTypes(): void {
    this.isLoading = true;
    this.loadError = null;

    this.api.get<ReportTypesResponse>('/reports/types').subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.reportTypes = res?.report_types || [];
          this.formats = res?.formats || ['pdf', 'excel'];
          if (this.formats.length > 0) {
            this.selectedFormat = this.formats[0];
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadError = 'Could not load report types';
          this.cdr.detectChanges();
        });
      }
    });
  }

  selectType(type: string): void {
    this.selectedType = type;
    this.generateError = null;
    this.generateSuccess = null;
  }

  getSelectedTypeInfo(): ReportTypeItem | undefined {
    return this.reportTypes.find(r => r.type === this.selectedType);
  }

  getFormatIcon(format: string): string {
    switch (format) {
      case 'pdf': return 'pi pi-file-pdf';
      case 'excel': return 'pi pi-file-excel';
      case 'csv': return 'pi pi-file';
      default: return 'pi pi-file';
    }
  }

  formatLabel(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  generateReport(): void {
    if (!this.selectedType || !this.selectedFormat) return;
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

          if (response?.download_url) {
            this.downloadFile(response.download_url, `${this.selectedType}_report.${this.selectedFormat}`);
            this.generateSuccess = 'Report generated! Download started.';
          } else if (response?.file_url) {
            this.downloadFile(response.file_url, `${this.selectedType}_report.${this.selectedFormat}`);
            this.generateSuccess = 'Report generated! Download started.';
          } else {
            // Response is data — download as file
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
