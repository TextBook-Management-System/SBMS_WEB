import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookPackageService } from '../../services/book-package';
import { BookPackage, BookPackageItem, BookCondition, BookPackageStatus } from '../../models/book-package.model';

@Component({
  selector: 'app-package-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="package-form-container">
      <div class="form-header">
        <h2>{{ isEdit ? 'Edit Package' : 'Create New Package' }}</h2>
        <p>{{ getStepDescription() }}</p>
      </div>

      <!-- Step Indicator -->
      <div class="steps-indicator">
        <div [class.active]="currentStep === 1" [class.completed]="currentStep > 1" class="step">
          <span>1</span>
          <p>Package Info</p>
        </div>
        <div [class.active]="currentStep === 2" [class.completed]="currentStep > 2" class="step">
          <span>2</span>
          <p>Add Books</p>
        </div>
        <div [class.active]="currentStep === 3" [class.completed]="currentStep > 3" class="step">
          <span>3</span>
          <p>Generate QR</p>
        </div>
        <div [class.active]="currentStep === 4" class="step">
          <span>4</span>
          <p>Confirm</p>
        </div>
      </div>

      <!-- Step 1: Package Info -->
      <div *ngIf="currentStep === 1" class="form-step">
        <div class="form-group">
          <label>Destination School:</label>
          <select [(ngModel)]="formData.destinationSchoolId" class="form-control">
            <option value="">Select School</option>
            <option value="s2">East Valley Middle School</option>
            <option value="s3">North Park Elementary</option>
            <option value="s4">South Ridge High</option>
          </select>
        </div>

        <div class="form-group">
          <label>Notes (Optional):</label>
          <textarea [(ngModel)]="formData.notes" class="form-control" rows="4" placeholder="Add package notes..."></textarea>
        </div>

        <div class="form-actions">
          <button (click)="goBack()" class="btn-secondary">Cancel</button>
          <button (click)="nextStep()" class="btn-primary" [disabled]="!formData.destinationSchoolId">Next</button>
        </div>
      </div>

      <!-- Step 2: Add Books -->
      <div *ngIf="currentStep === 2" class="form-step">
        <div class="book-search">
          <div class="form-group">
            <label>ISBN / Barcode:</label>
            <input [(ngModel)]="searchISBN" class="form-control" placeholder="Enter ISBN or scan barcode..." />
            <button (click)="addBook()" class="btn-primary mt-2">Add Book</button>
          </div>
        </div>

        <!-- Books Table -->
        <div class="books-table" *ngIf="hasItems">
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Qty</th>
                <th>Condition</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of currentPackage?.items">
                <td>{{ item.isbn }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.condition }}</td>
                <td>
                  <button (click)="removeItem(item.id)" class="btn-danger-small">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="total-books">Total Books: {{ currentPackage?.totalBooks }}</p>
        </div>

        <div *ngIf="!hasItems" class="empty-message">
          <p>No books added yet. Search and add books above.</p>
        </div>

        <div class="form-actions">
          <button (click)="previousStep()" class="btn-secondary">Back</button>
          <button (click)="nextStep()" class="btn-primary" [disabled]="!hasItems">Next</button>
        </div>
      </div>

      <!-- Step 3: Generate QR -->
      <div *ngIf="currentStep === 3" class="form-step">
        <div class="qr-section">
          <h3>Generate QR Code</h3>
          <p>Click the button below to generate a QR code for this package.</p>
          <button (click)="generateQR()" class="btn-primary" *ngIf="!currentPackage?.qrCode">Generate QR Code</button>
          
          <div class="qr-preview" *ngIf="currentPackage?.qrCode">
            <img [src]="currentPackage?.qrCode" alt="QR Code" />
            <p>Package #: {{ currentPackage?.packageNumber }}</p>
            <p>To: {{ currentPackage?.destinationSchoolName }}</p>
            <button (click)="printQR()" class="btn-secondary mt-4">
              <i class="pi pi-print"></i> Print QR
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button (click)="previousStep()" class="btn-secondary">Back</button>
          <button (click)="nextStep()" class="btn-primary" [disabled]="!currentPackage?.qrCode">Next</button>
        </div>
      </div>

      <!-- Step 4: Confirm & Ship -->
      <div *ngIf="currentStep === 4" class="form-step">
        <div class="summary">
          <h3>Package Summary</h3>
          <div class="summary-item">
            <label>Package #:</label>
            <span>{{ currentPackage?.packageNumber }}</span>
          </div>
          <div class="summary-item">
            <label>To:</label>
            <span>{{ currentPackage?.destinationSchoolName }}</span>
          </div>
          <div class="summary-item">
            <label>Total Books:</label>
            <span>{{ currentPackage?.totalBooks }}</span>
          </div>
          <div class="summary-item">
            <label>Status:</label>
            <span>{{ currentPackage?.status }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button (click)="previousStep()" class="btn-secondary">Back</button>
          <button (click)="finishPackaging()" class="btn-success">Mark as Ready to Ship</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .package-form-container { padding: 1.5rem; max-width: 56rem; margin: 0 auto; }
    .form-header { margin-bottom: 2rem; }
    .form-header h2 { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
    .form-header p { color: #6b7280; margin-top: 0.25rem; }
    
    .steps-indicator { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .step { display: flex; flex-direction: column; align-items: center; }
    .step span { width: 2.5rem; height: 2.5rem; border-radius: 50%; background-color: #d1d5db; color: #1f2937; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .step.active span { background-color: #2563eb; color: white; }
    .step.completed span { background-color: #16a34a; color: white; }
    .step p { font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem; }
    
    .form-step { background-color: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
    .form-control { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
    .form-control:focus { outline: none; border-color: #3b82f6; }
    
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    
    .books-table { margin-top: 1.5rem; overflow-x: auto; }
    table { width: 100%; }
    th { padding: 0.5rem 1rem; text-align: left; font-size: 0.875rem; font-weight: 600; background-color: #f3f4f6; }
    td { padding: 0.5rem 1rem; border-bottom: 1px solid #e5e7eb; }
    
    .total-books { margin-top: 1rem; font-size: 1.125rem; font-weight: 600; color: #1f2937; }
    .empty-message { text-align: center; padding: 2rem 0; color: #6b7280; }
    
    .qr-section { text-align: center; }
    .qr-section h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
    .qr-preview { margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; }
    .qr-preview img { width: 12rem; height: 12rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; }
    .qr-preview p { margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280; }
    
    .summary { margin: 0.75rem 0; }
    .summary h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
    .summary-item { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb; }
    .summary-item label { font-weight: 500; color: #374151; }
    
    .form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
    .btn-primary { padding: 0.5rem 1rem; background-color: #2563eb; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-primary:hover { background-color: #1d4ed8; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { padding: 0.5rem 1rem; background-color: #d1d5db; color: #1f2937; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-secondary:hover { background-color: #9ca3af; }
    .btn-success { padding: 0.5rem 1rem; background-color: #16a34a; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
    .btn-success:hover { background-color: #15803d; }
    .btn-danger-small { padding: 0.25rem 0.5rem; font-size: 0.875rem; background-color: #dc2626; color: white; border-radius: 0.25rem; transition: background-color 0.2s; }
    .btn-danger-small:hover { background-color: #b91c1c; }
  `]
})
export class PackageFormComponent implements OnInit {
  currentStep: number = 1;
  isEdit: boolean = false;
  currentPackage: BookPackage | null = null;
  formData = {
    destinationSchoolId: '',
    notes: ''
  };
  searchISBN: string = '';

  get hasItems(): boolean {
    return !!this.currentPackage?.items?.length;
  }

  // Mock books database
  mockBooks: any[] = [
    { isbn: '978-0-123456-78-9', title: 'Biology 101', author: 'Dr. Smith', condition: 'excellent' },
    { isbn: '978-0-987654-32-1', title: 'Chemistry Basics', author: 'Prof. Johnson', condition: 'good' },
    { isbn: '978-0-555555-55-5', title: 'Mathematics Grade 8', author: 'Dr. Williams', condition: 'fair' },
    { isbn: '978-0-444444-44-4', title: 'History & Culture', author: 'Dr. Brown', condition: 'good' }
  ];

  constructor(private packageService: BookPackageService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.packageService.getPackageById(params['id']).subscribe(pkg => {
          if (pkg) {
            this.currentPackage = pkg;
          }
        });
      } else {
        this.createNewPackage();
      }
    });
  }

  createNewPackage(): void {
    this.currentPackage = {
      id: `pkg-temp-${Date.now()}`,
      packageNumber: '',
      originSchoolId: 's1',
      originSchoolName: 'Central High School',
      destinationSchoolId: '',
      destinationSchoolName: '',
      status: BookPackageStatus.PACKAGING,
      createdBy: 'admin1',
      createdAt: new Date(),
      totalBooks: 0,
      items: []
    };
  }

  getStepDescription(): string {
    const descriptions = [
      'Select destination school',
      'Add books to the package',
      'Generate QR code',
      'Review and confirm'
    ];
    return descriptions[this.currentStep - 1];
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.formData.destinationSchoolId = this.currentPackage?.destinationSchoolId || '';
    }
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addBook(): void {
    if (!this.searchISBN) return;
    
    const book = this.mockBooks.find(b => b.isbn.includes(this.searchISBN));
    if (book && this.currentPackage) {
      this.packageService.addItemToPackage(this.currentPackage.id, {
        bookId: `b-${Date.now()}`,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        quantity: 1,
        condition: book.condition as BookCondition
      }).subscribe(pkg => {
        if (pkg) {
          this.currentPackage = pkg;
          this.searchISBN = '';
        }
      });
    }
  }

  removeItem(itemId: string): void {
    if (this.currentPackage) {
      this.packageService.removeItemFromPackage(this.currentPackage.id, itemId).subscribe(pkg => {
        if (pkg) {
          this.currentPackage = pkg;
        }
      });
    }
  }

  generateQR(): void {
    if (this.currentPackage) {
      this.packageService.generateQRCode(this.currentPackage.id).subscribe(result => {
        if (this.currentPackage) {
          this.currentPackage.qrCode = result.qrCode;
        }
      });
    }
  }

  printQR(): void {
    window.print();
  }

  finishPackaging(): void {
    if (this.currentPackage) {
      this.packageService.markAsReadyToShip(this.currentPackage.id).subscribe(() => {
        this.router.navigate(['/main/packages']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/main/packages']);
  }
}
