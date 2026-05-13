import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookPackageService } from '../../services/book-package';
import { BookPackage, BookPackageHistory } from '../../models/book-package.model';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="detail-container" *ngIf="package">
      <div class="detail-header">
        <button (click)="goBack()" class="btn-back"><i class="pi pi-arrow-left"></i></button>
        <div class="header-info">
          <h2>{{ package.packageNumber }}</h2>
          <span [class]="'status-badge ' + getStatusClass(package.status)">
            {{ formatStatus(package.status) }}
          </span>
        </div>
        <div class="header-actions">
          <button (click)="acceptPackage()" class="btn-success" *ngIf="canAccept()">
            <i class="pi pi-check"></i> Accept
          </button>
          <button (click)="declinePackage()" class="btn-danger" *ngIf="canDecline()">
            <i class="pi pi-times"></i> Decline
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'" class="tab-btn">
          Overview
        </button>
        <button [class.active]="activeTab === 'contents'" (click)="activeTab = 'contents'" class="tab-btn">
          Contents
        </button>
        <button [class.active]="activeTab === 'history'" (click)="activeTab = 'history'" class="tab-btn">
          History
        </button>
      </div>

      <!-- Overview Tab -->
      <div *ngIf="activeTab === 'overview'" class="tab-content">
        <div class="info-grid">
          <div class="info-item">
            <label>From:</label>
            <p>{{ package.originSchoolName }}</p>
          </div>
          <div class="info-item">
            <label>To:</label>
            <p>{{ package.destinationSchoolName }}</p>
          </div>
          <div class="info-item">
            <label>Total Books:</label>
            <p>{{ package.totalBooks }}</p>
          </div>
          <div class="info-item">
            <label>Created:</label>
            <p>{{ package.createdAt | date: 'medium' }}</p>
          </div>
          <div class="info-item" *ngIf="package.shippedAt">
            <label>Shipped:</label>
            <p>{{ package.shippedAt | date: 'medium' }}</p>
          </div>
          <div class="info-item" *ngIf="package.receivedAt">
            <label>Received:</label>
            <p>{{ package.receivedAt | date: 'medium' }}</p>
          </div>
          <div class="info-item" *ngIf="package.declineReason" class="full-width">
            <label>Decline Reason:</label>
            <p class="text-red-600">{{ package.declineReason }}</p>
          </div>
          <div class="info-item" *ngIf="package.notes" class="full-width">
            <label>Notes:</label>
            <p>{{ package.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Contents Tab -->
      <div *ngIf="activeTab === 'contents'" class="tab-content">
        <table class="contents-table">
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
            <tr *ngFor="let item of package.items">
              <td>{{ item.isbn }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.condition }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- History Tab -->
      <div *ngIf="activeTab === 'history'" class="tab-content">
        <div class="timeline">
          <div *ngFor="let event of history" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>{{ event.action | uppercase }}</h4>
              <p>{{ event.details }}</p>
              <small>{{ event.performedAt | date: 'medium' }} by {{ event.performedBy }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { padding: 1.5rem; max-width: 56rem; margin: 0 auto; }
    .detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding: 1rem; background-color: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
    .btn-back { padding: 0.5rem; color: #6b7280; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-back:hover { background-color: #f3f4f6; }
    .header-info { flex: 1; margin-left: 1rem; }
    .header-info h2 { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
    .header-actions { display: flex; gap: 0.5rem; }
    
    .tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem; }
    .tab-btn { padding: 0.75rem 1rem; border-bottom: 2px solid transparent; color: #6b7280; transition: color 0.2s; }
    .tab-btn:hover { color: #374151; }
    .tab-btn.active { border-bottom: 2px solid #2563eb; color: #2563eb; }
    
    .tab-content { padding: 1.5rem; background-color: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .info-item { }
    .info-item.full-width { grid-column: span 2; }
    .info-item label { font-weight: 600; color: #374151; }
    .info-item p { color: #6b7280; margin-top: 0.25rem; }
    
    .contents-table { width: 100%; }
    table thead { background-color: #f3f4f6; }
    table th { padding: 0.5rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; }
    table td { padding: 0.5rem 1rem; border-bottom: 1px solid #e5e7eb; }
    
    .timeline { margin: 0.75rem 0; }
    .timeline-item { display: flex; gap: 1rem; }
    .timeline-marker { width: 0.75rem; height: 0.75rem; margin-top: 0.5rem; border-radius: 50%; background-color: #2563eb; }
    .timeline-content { flex: 1; padding: 1rem; background-color: #f9fafb; border-radius: 0.5rem; }
    .timeline-content h4 { font-weight: 600; color: #1f2937; }
    .timeline-content p { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
    .timeline-content small { font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; display: block; }
    
    .status-badge { display: inline-flex; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; }
    .status-packaging { background-color: #f3f4f6; color: #1f2937; }
    .status-ready_to_ship { background-color: #dbeafe; color: #1e40af; }
    .status-shipped { background-color: #fed7aa; color: #9a3412; }
    .status-received { background-color: #dcfce7; color: #166534; }
    .status-declined { background-color: #fee2e2; color: #991b1b; }
    
    .btn-success { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #16a34a; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-success:hover { background-color: #15803d; }
    .btn-danger { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #dc2626; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-danger:hover { background-color: #b91c1c; }
    
    .text-red-600 { color: #dc2626; }
  `]
})
export class PackageDetailComponent implements OnInit {
  package: BookPackage | null = null;
  history: BookPackageHistory[] = [];
  activeTab: 'overview' | 'contents' | 'history' = 'overview';

  constructor(private packageService: BookPackageService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.packageService.getPackageById(params['id']).subscribe(pkg => {
        if (pkg) {
          this.package = pkg;
          this.packageService.getPackageHistory(pkg.id).subscribe(h => {
            this.history = h;
          });
        }
      });
    });
  }

  canAccept(): boolean {
    return this.package?.status === 'shipped';
  }

  canDecline(): boolean {
    return this.package?.status === 'shipped';
  }

  acceptPackage(): void {
    if (this.package) {
      // Redirect to QR scan page for acceptance
      this.router.navigate(['/main/packages', this.package.id, 'scan-accept']);
    }
  }

  declinePackage(): void {
    const reason = prompt('Enter decline reason:');
    if (reason && this.package) {
      this.packageService.declinePackage(this.package.id, reason).subscribe(() => {
        this.ngOnInit();
      });
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toUpperCase();
  }

  getStatusClass(status: string): string {
    return 'status-' + status;
  }

  goBack(): void {
    this.router.navigate(['/main/packages']);
  }
}
