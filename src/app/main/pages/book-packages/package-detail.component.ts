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
    .detail-container { padding: 1rem 1.5rem; }
    .detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding: 1rem; background: #fff; border-radius: 0.75rem; border: 1px solid var(--color-border-light); box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .btn-back { padding: 0.5rem; color: var(--color-text-secondary); border-radius: 0.375rem; }
    .btn-back:hover { background: var(--color-surface); }
    .header-info { flex: 1; margin-left: 1rem; }
    .header-info h2 { font-size: 1.25rem; font-weight: 700; color: var(--color-navy); }
    .header-actions { display: flex; gap: 0.5rem; }
    
    .tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--color-border-light); margin-bottom: 1rem; }
    .tab-btn { padding: 0.5rem 0.75rem; border-bottom: 2px solid transparent; color: var(--color-text-secondary); font-size: 0.8rem; font-weight: 500; }
    .tab-btn:hover { color: var(--color-navy); }
    .tab-btn.active { border-bottom-color: var(--color-primary); color: var(--color-primary); }
    
    .tab-content { padding: 1.25rem; background: #fff; border-radius: 0.75rem; border: 1px solid var(--color-border-light); }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .info-item.full-width { grid-column: span 2; }
    .info-item label { font-size: 0.8rem; font-weight: 600; color: var(--color-navy); }
    .info-item p { font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
    
    .contents-table { width: 100%; font-size: 0.8rem; }
    table thead { background: var(--color-navy); }
    table th { padding: 0.5rem 1rem; text-align: left; font-size: 0.7rem; font-weight: 600; color: #fff; text-transform: uppercase; }
    table td { padding: 0.5rem 1rem; border-bottom: 1px solid var(--color-border-light); }
    
    .timeline { margin: 0.75rem 0; }
    .timeline-item { display: flex; gap: 1rem; margin-bottom: 0.75rem; }
    .timeline-marker { width: 0.75rem; height: 0.75rem; margin-top: 0.5rem; border-radius: 50%; background: var(--color-primary); flex-shrink: 0; }
    .timeline-content { flex: 1; padding: 0.75rem; background: var(--color-surface); border-radius: 0.5rem; }
    .timeline-content h4 { font-size: 0.8rem; font-weight: 600; color: var(--color-navy); }
    .timeline-content p { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
    .timeline-content small { font-size: 0.7rem; color: var(--color-text-secondary); margin-top: 0.25rem; display: block; }
    
    .status-badge { display: inline-flex; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 500; }
    .status-packaging { background: #f3f4f6; color: #1f2937; }
    .status-ready_to_ship { background: var(--color-badge-new); color: #1e40af; }
    .status-shipped { background: var(--color-badge-fair); color: #92400e; }
    .status-received { background: var(--color-badge-good); color: #166534; }
    .status-declined { background: var(--color-badge-damaged); color: #991b1b; }
    
    .btn-success { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: var(--color-primary); color: #fff; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; }
    .btn-success:hover { background: var(--color-primary-shade); }
    .btn-danger { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; }
    .btn-danger:hover { background: #fee2e2; }
    
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
