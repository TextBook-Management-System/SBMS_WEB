import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BookPackageService } from '../../services/book-package';
import { BookPackage } from '../../models/book-package.model';

@Component({
  selector: 'app-book-packages',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="packages-container">
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">Book Package Management</h2>
          <p class="page-desc">Create, track, and manage book shipments between schools</p>
        </div>
        <button class="btn-primary" (click)="createNewPackage()">
          <i class="pi pi-plus"></i> New Package
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs-section">
        <div class="tab-buttons">
          <button [class.active]="activeTab === 'all'" (click)="activeTab = 'all'" class="tab-btn">
            All Packages
          </button>
          <button [class.active]="activeTab === 'outgoing'" (click)="activeTab = 'outgoing'" class="tab-btn">
            Outgoing Shipments
          </button>
          <button [class.active]="activeTab === 'incoming'" (click)="activeTab = 'incoming'" class="tab-btn">
            Incoming Shipments
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Status:</label>
          <select [(ngModel)]="selectedStatus" class="filter-select">
            <option value="">All Status</option>
            <option value="packaging">Packaging</option>
            <option value="ready_to_ship">Ready to Ship</option>
            <option value="shipped">Shipped</option>
            <option value="received">Received</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      <!-- Packages Table -->
      <div class="packages-table" *ngIf="filteredPackages.length > 0">
        <table>
          <thead>
            <tr>
              <th>Package #</th>
              <th>From</th>
              <th>To</th>
              <th>Books</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let pkg of filteredPackages">
              <td class="package-number">{{ pkg.packageNumber }}</td>
              <td>{{ pkg.originSchoolName }}</td>
              <td>{{ pkg.destinationSchoolName }}</td>
              <td class="books-count">{{ pkg.totalBooks }}</td>
              <td>
                <span [class]="'status-badge ' + getStatusClass(pkg.status)">
                  {{ formatStatus(pkg.status) }}
                </span>
              </td>
              <td>{{ pkg.createdAt | date: 'short' }}</td>
              <td class="actions-cell">
                <button (click)="viewPackage(pkg.id)" class="btn-icon" title="View Details">
                  <i class="pi pi-eye"></i>
                </button>
                <button (click)="editPackage(pkg.id)" class="btn-icon" title="Edit" *ngIf="pkg.status === 'packaging'">
                  <i class="pi pi-pencil"></i>
                </button>
                <button (click)="printQR(pkg.id)" class="btn-icon" title="Print QR" *ngIf="pkg.qrCode">
                  <i class="pi pi-print"></i>
                </button>
                <button (click)="shipPackage(pkg.id)" class="btn-icon" title="Ship" *ngIf="pkg.status === 'ready_to_ship'">
                  <i class="pi pi-send"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="filteredPackages.length === 0">
        <i class="pi pi-inbox"></i>
        <p>No packages found</p>
      </div>
    </div>
  `,
  styles: [`
    .packages-container { padding: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
    .header-left { flex: 1; }
    .page-title { font-size: 1.875rem; font-weight: bold; color: #1f2937; }
    .page-desc { color: #6b7280; margin-top: 0.25rem; }
    .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #2563eb; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-primary:hover { background-color: #1d4ed8; }
    
    .tabs-section { margin-bottom: 1.5rem; }
    .tab-buttons { display: flex; gap: 0.5rem; border-bottom: 1px solid #e5e7eb; }
    .tab-btn { padding: 0.75rem 1rem; border-bottom: 2px solid transparent; color: #6b7280; transition: color 0.2s; }
    .tab-btn:hover { color: #374151; }
    .tab-btn.active { border-bottom: 2px solid #2563eb; color: #2563eb; }
    
    .filters-section { margin-bottom: 1.5rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.5rem; }
    .filter-group { display: flex; align-items: center; gap: 0.75rem; }
    .filter-select { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
    
    .packages-table { overflow-x: auto; }
    table { width: 100%; }
    thead { background-color: #f3f4f6; }
    th { padding: 0.75rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; color: #374151; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
    
    .status-badge { display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .status-packaging { background-color: #f3f4f6; color: #1f2937; }
    .status-ready_to_ship { background-color: #dbeafe; color: #1e40af; }
    .status-shipped { background-color: #fed7aa; color: #9a3412; }
    .status-in_transit { background-color: #fef3c7; color: #92400e; }
    .status-received { background-color: #dcfce7; color: #166534; }
    .status-declined { background-color: #fee2e2; color: #991b1b; }
    
    .actions-cell { display: flex; gap: 0.5rem; }
    .btn-icon { padding: 0.5rem; border-radius: 0.5rem; color: #6b7280; transition: background-color 0.2s; }
    .btn-icon:hover { background-color: #f3f4f6; }
    
    .empty-state { text-align: center; padding: 3rem 0; color: #6b7280; }
    .empty-state i { font-size: 3rem; margin-bottom: 1rem; display: block; }
  `]
})
export class BookPackagesComponent implements OnInit {
  packages: BookPackage[] = [];
  filteredPackages: BookPackage[] = [];
  activeTab: 'all' | 'outgoing' | 'incoming' = 'all';
  selectedStatus: string = '';

  constructor(private packageService: BookPackageService, private router: Router) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe(packages => {
      this.packages = packages;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = this.packages;
    
    if (this.selectedStatus) {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }
    
    this.filteredPackages = filtered;
  }

  createNewPackage(): void {
    this.router.navigate(['/main/packages/new']);
  }

  viewPackage(id: string): void {
    this.router.navigate(['/main/packages', id]);
  }

  editPackage(id: string): void {
    this.router.navigate(['/main/packages', id, 'edit']);
  }

  printQR(id: string): void {
    this.router.navigate(['/main/packages', id, 'qr-print']);
  }

  shipPackage(id: string): void {
    this.packageService.markAsShipped(id).subscribe(() => {
      this.loadPackages();
    });
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toUpperCase();
  }

  getStatusClass(status: string): string {
    return 'status-' + status;
  }
}
