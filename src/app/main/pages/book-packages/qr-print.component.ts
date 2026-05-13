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
    .qr-print-container { padding: 1rem 1.5rem; }
    .print-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 0.75rem; background: #fff; border-radius: 0.75rem; border: 1px solid var(--color-border-light); }
    .print-header h2 { font-size: 1rem; font-weight: 600; color: var(--color-navy); }
    .btn-close { padding: 0.5rem; color: var(--color-text-secondary); border-radius: 0.375rem; }
    .btn-close:hover { background: var(--color-surface); }
    .btn-print { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: var(--color-primary); color: #fff; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; }
    .btn-print:hover { background: var(--color-primary-shade); }
    
    .qr-label { margin-bottom: 0.75rem; padding: 1rem; border: 2px dashed var(--color-border-light); display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; }
    .label-content { display: flex; gap: 1rem; align-items: center; width: 100%; }
    .qr-code img { width: 6rem; height: 6rem; }
    .label-info { flex: 1; }
    .label-info h3 { font-size: 1rem; font-weight: 600; color: var(--color-navy); }
    .label-info p { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
    
    @media print { .print-header { display: none; } }
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
