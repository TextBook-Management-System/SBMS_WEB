import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookPackageService } from '../../services/book-package';
import { BookPackage } from '../../models/book-package.model';

@Component({
  selector: 'app-qr-print',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="qr-print-container" *ngIf="package">
      <div class="print-header">
        <button (click)="goBack()" class="btn-close"><i class="pi pi-times"></i></button>
        <h2>Print QR Code</h2>
        <button (click)="print()" class="btn-print"><i class="pi pi-print"></i> Print</button>
      </div>

      <div class="print-content" #printContent>
        <div class="qr-label">
          <div class="label-content">
            <div class="qr-code">
              <img [src]="package.qrCode" alt="QR Code" />
            </div>
            <div class="label-info">
              <h3>{{ package.packageNumber }}</h3>
              <p><strong>From:</strong> {{ package.originSchoolName }}</p>
              <p><strong>To:</strong> {{ package.destinationSchoolName }}</p>
              <p><strong>Books:</strong> {{ package.totalBooks }}</p>
              <p><strong>Date:</strong> {{ package.createdAt | date: 'short' }}</p>
            </div>
          </div>
        </div>

        <!-- Multiple labels for cutting -->
        <div class="qr-label" *ngFor="let i of [1,2,3]">
          <div class="label-content">
            <div class="qr-code">
              <img [src]="package.qrCode" alt="QR Code" />
            </div>
            <div class="label-info">
              <h3>{{ package.packageNumber }}</h3>
              <p><strong>From:</strong> {{ package.originSchoolName }}</p>
              <p><strong>To:</strong> {{ package.destinationSchoolName }}</p>
              <p><strong>Books:</strong> {{ package.totalBooks }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-print-container { padding: 1.5rem; max-width: 42rem; margin: 0 auto; }
    .print-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding: 1rem; background-color: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
    .print-header h2 { font-size: 1.25rem; font-weight: bold; color: #1f2937; }
    .btn-close { padding: 0.5rem; color: #6b7280; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-close:hover { background-color: #f3f4f6; }
    .btn-print { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #2563eb; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-print:hover { background-color: #1d4ed8; }
    
    .print-content { }
    .qr-label { margin-bottom: 1rem; padding: 1rem; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; }
    .label-content { display: flex; gap: 1rem; align-items: center; width: 100%; }
    .qr-code { flex-shrink: 0; }
    .qr-code img { width: 8rem; height: 8rem; }
    .label-info { flex: 1; }
    .label-info h3 { font-size: 1.125rem; font-weight: bold; color: #1f2937; }
    .label-info p { font-size: 0.875rem; color: #374151; margin-top: 0.25rem; }
    
    @media print {
      .print-header { display: none; }
      .page-break { page-break-after: always; }
    }
  `]
})
export class QRPrintComponent implements OnInit {
  package: BookPackage | null = null;

  constructor(private packageService: BookPackageService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.packageService.getPackageById(params['id']).subscribe(pkg => {
        this.package = pkg || null;
      });
    });
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/main/packages']);
  }
}
