import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService, GeneratedReport } from '../../../services/report';

@Component({
  selector: 'app-report-view',
  standalone: false,
  templateUrl: './report-view.html',
  styleUrls: ['./report-view.css']
})
export class ReportViewComponent implements OnInit {
  report: GeneratedReport | undefined;

  constructor(
    private readonly reportService: ReportService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reportService.generateReport(id).subscribe(report => {
        this.report = report;
      });
    }
  }

  exportPdf(): void {
    window.print();
  }

  exportCsv(): void {
    // Placeholder for CSV export
    alert('CSV export coming soon');
  }

  goBack(): void {
    this.router.navigate(['/app/reports']);
  }
}
