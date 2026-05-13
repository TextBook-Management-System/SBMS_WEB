import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookPackageService } from '../../services/book-package';
import { BookPackage } from '../../models/book-package.model';

@Component({
  selector: 'app-qr-scan-accept',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="qr-scan-container">
      <div class="scan-header">
        <button (click)="goBack()" class="btn-back"><i class="pi pi-arrow-left"></i></button>
        <h2>Scan QR Code to Accept Package</h2>
        <p>Scan the QR code on the package to automatically populate books into your inventory</p>
      </div>

      <div class="scan-section">
        <div class="scan-input">
          <label>QR Code:</label>
          <input [(ngModel)]="qrCodeInput" class="form-control" placeholder="Paste QR code or scan..." />
          <button (click)="scanQRCode()" class="btn-primary" [disabled]="!qrCodeInput">
            <i class="pi pi-qrcode"></i> Scan & Accept
          </button>
        </div>

        <!-- Camera scan option (placeholder for future camera integration) -->
        <div class="camera-scan">
          <button class="btn-secondary" disabled>
            <i class="pi pi-camera"></i> Camera Scan (Coming Soon)
          </button>
        </div>
      </div>

      <!-- Package Preview -->
      <div *ngIf="scannedPackage" class="package-preview">
        <h3>Package Details</h3>
        <div class="preview-grid">
          <div class="preview-item">
            <label>Package #:</label>
            <p>{{ scannedPackage.packageNumber }}</p>
          </div>
          <div class="preview-item">
            <label>From:</label>
            <p>{{ scannedPackage.originSchoolName }}</p>
          </div>
          <div class="preview-item">
            <label>Total Books:</label>
            <p>{{ scannedPackage.totalBooks }}</p>
          </div>
        </div>

        <!-- Books List -->
        <div class="books-list">
          <h4>Books in Package:</h4>
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Qty</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of scannedPackage.items">
                <td>{{ item.isbn }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.condition }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="accept-actions">
          <button (click)="confirmAccept()" class="btn-success">
            <i class="pi pi-check"></i> Confirm & Accept Package
          </button>
          <button (click)="cancelAccept()" class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div *ngIf="acceptSuccess" class="success-message">
        <i class="pi pi-check-circle"></i>
        <h3>Package Accepted Successfully!</h3>
        <p>{{ scannedPackage?.totalBooks }} books have been added to your inventory.</p>
        <button (click)="goToPackages()" class="btn-primary">View All Packages</button>
      </div>
    </div>
  `,
  styles: [`
    .qr-scan-container { padding: 1.5rem; max-width: 56rem; margin: 0 auto; }
    .scan-header { margin-bottom: 2rem; }
    .scan-header h2 { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
    .scan-header p { color: #6b7280; margin-top: 0.25rem; }
    .btn-back { padding: 0.5rem; color: #6b7280; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-back:hover { background-color: #f3f4f6; }

    .scan-section { margin-bottom: 2rem; padding: 1.5rem; background-color: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
    .scan-input { margin-bottom: 1rem; }
    .scan-input label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
    .form-control { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; margin-bottom: 0.75rem; }
    .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #2563eb; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-primary:hover { background-color: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #d1d5db; color: #1f2937; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-secondary:hover { background-color: #9ca3af; }

    .camera-scan { margin-top: 1rem; }

    .package-preview { padding: 1.5rem; background-color: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
    .package-preview h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
    .preview-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .preview-item label { font-weight: 500; color: #374151; }
    .preview-item p { color: #6b7280; margin-top: 0.25rem; }

    .books-list { margin-top: 1.5rem; }
    .books-list h4 { font-weight: 600; margin-bottom: 0.75rem; }
    table { width: 100%; }
    thead { background-color: #f3f4f6; }
    th { padding: 0.5rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; }
    td { padding: 0.5rem 1rem; border-bottom: 1px solid #e5e7eb; }

    .accept-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
    .btn-success { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #16a34a; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-success:hover { background-color: #15803d; }

    .success-message { text-align: center; padding: 3rem 0; }
    .success-message i { font-size: 3rem; color: #16a34a; margin-bottom: 1rem; display: block; }
    .success-message h3 { font-size: 1.25rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem; }
    .success-message p { color: #6b7280; margin-bottom: 1.5rem; }
  `]
})
export class QRScanAcceptComponent implements OnInit {
  qrCodeInput: string = '';
  scannedPackage: BookPackage | null = null;
  acceptSuccess: boolean = false;

  constructor(private packageService: BookPackageService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Check if we have a package ID from route (for direct acceptance)
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.packageService.getPackageById(params['id']).subscribe(pkg => {
          if (pkg && pkg.status === 'shipped') {
            this.scannedPackage = pkg;
          }
        });
      }
    });
  }

  scanQRCode(): void {
    if (!this.qrCodeInput) return;

    this.packageService.scanQRCode(this.qrCodeInput).subscribe(pkg => {
      if (pkg) {
        this.scannedPackage = pkg;
      } else {
        alert('Invalid QR code or package not found');
      }
    });
  }

  confirmAccept(): void {
    if (this.scannedPackage) {
      this.packageService.acceptPackage(this.scannedPackage.id).subscribe(() => {
        this.acceptSuccess = true;
        // In real implementation, this would also call populateInventoryFromPackage
        // this.packageService.populateInventoryFromPackage(this.scannedPackage.id).subscribe(...)
      });
    }
  }

  cancelAccept(): void {
    this.scannedPackage = null;
    this.qrCodeInput = '';
  }

  goBack(): void {
    this.router.navigate(['/main/packages']);
  }

  goToPackages(): void {
    this.router.navigate(['/main/packages']);
  }
}
