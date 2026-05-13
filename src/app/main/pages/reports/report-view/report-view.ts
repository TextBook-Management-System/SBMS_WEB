import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../../../services/report';

@Component({
  selector: 'app-report-view',
  standalone: false,
  templateUrl: './report-view.html',
  styleUrls: ['./report-view.css']
})
export class ReportViewComponent implements OnInit {
  report: any = null;
  isLoading = true;
  loadError: string | null = null;
  reportType: string = '';

  constructor(
    private readonly reportService: ReportService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.reportType = this.route.snapshot.paramMap.get('id') || '';
    if (this.reportType) {
      this.generateReport();
    }
  }

  generateReport(): void {
    this.isLoading = true;
    this.loadError = null;

    this.reportService.generateReport(this.reportType).subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.report = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadError = 'Could not generate report';
          this.cdr.detectChanges();
        });
      }
    });
  }

  exportPdf(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/app/reports']);
  }
}
