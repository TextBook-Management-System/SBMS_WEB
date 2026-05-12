import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService, ReportType } from '../../../services/report';

@Component({
  selector: 'app-report-list',
  standalone: false,
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.css']
})
export class ReportListComponent implements OnInit {
  reportTypes: ReportType[] = [];

  constructor(
    private readonly reportService: ReportService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.reportService.getReportTypes().subscribe(types => {
      this.reportTypes = types;
    });
  }

  generateReport(id: string): void {
    this.router.navigate(['/app/reports', id]);
  }
}
