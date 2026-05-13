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
    .package-form-container { padding: 1rem 1.5rem; }
    .form-header { margin-bottom: 1.5rem; }
    .form-header h2 { font-size: 1.25rem; font-weight: 700; color: var(--color-navy); }
    .form-header p { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px; }
    
    .steps-indicator { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
    .step { display: flex; flex-direction: column; align-items: center; }
    .step span { width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--color-border-light); color: var(--color-navy); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.85rem; }
    .step.active span { background: var(--color-primary); color: #fff; }
    .step.completed span { background: var(--color-primary); color: #fff; }
    .step p { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 0.4rem; }
    
    .form-step { background: #fff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid var(--color-border-light); }
    .form-group { margin-bottom: 0.75rem; }
    .form-group label { display: block; font-size: 0.8rem; font-weight: 500; color: var(--color-navy); margin-bottom: 0.25rem; }
    .form-control { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-light); border-radius: 0.5rem; font-size: 0.85rem; }
    .form-control:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }
    
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    
    .books-table { margin-top: 1rem; overflow-x: auto; }
    table { width: 100%; font-size: 0.8rem; }
    th { padding: 0.5rem 1rem; text-align: left; font-size: 0.7rem; font-weight: 600; background: var(--color-navy); color: #fff; text-transform: uppercase; }
    td { padding: 0.5rem 1rem; border-bottom: 1px solid var(--color-border-light); }
    
    .total-books { margin-top: 0.75rem; font-size: 0.9rem; font-weight: 600; color: var(--color-navy); }
    .empty-message { text-align: center; padding: 2rem 0; color: var(--color-text-secondary); font-size: 0.85rem; }
    
    .qr-section { text-align: center; }
    .qr-section h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--color-navy); }
    .qr-preview { margin-top: 1rem; display: flex; flex-direction: column; align-items: center; }
    .qr-preview img { width: 10rem; height: 10rem; border: 2px solid var(--color-border-light); border-radius: 0.5rem; }
    .qr-preview p { margin-top: 0.5rem; font-size: 0.8rem; color: var(--color-text-secondary); }
    
    .summary { margin: 0.75rem 0; }
    .summary h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--color-navy); }
    .summary-item { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border-light); font-size: 0.85rem; }
    .summary-item label { font-weight: 500; color: var(--color-navy); }
    
    .form-actions { display: flex; gap: 0.5rem; margin-top: 1.25rem; }
    .btn-primary { padding: 0.5rem 1rem; background: var(--color-primary); color: #fff; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; }
    .btn-primary:hover { background: var(--color-primary-shade); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { padding: 0.5rem 1rem; background: var(--color-surface); color: var(--color-navy); border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; }
    .btn-secondary:hover { background: var(--color-border-light); }
    .btn-success { padding: 0.5rem 1rem; background: var(--color-primary); color: #fff; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 500; }
    .btn-success:hover { background: var(--color-primary-shade); }
    .btn-danger-small { padding: 0.2rem 0.5rem; font-size: 0.75rem; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 0.25rem; }
    .btn-danger-small:hover { background: #fee2e2; }
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
