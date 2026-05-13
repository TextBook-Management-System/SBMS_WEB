import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StepConfig } from '../../../components/stepper/stepper';
import { BookCopyService } from '../../services/book-copy';
import { AllocationService } from '../../services/allocation';
import { ScanService } from '../../services/scan';
import { BookCopy } from '../../models/book-copy.model';
import { Allocation } from '../../models/allocation.model';
import { ReturnComparisonResponse } from '../../models/scan.model';

@Component({
  selector: 'app-book-return',
  standalone: false,
  templateUrl: './book-return.html',
  styleUrls: ['./book-return.css']
})
export class BookReturnComponent {
  steps: StepConfig[] = [
    { label: 'Scan Book' },
    { label: 'Capture Condition' },
    { label: 'AI Comparison' }
  ];
  currentStep = 0;

  // Step 1
  qrCodeInput = '';
  bookCopy: BookCopy | null = null;
  activeAllocation: Allocation | null = null;
  bookCopyError: string | null = null;
  isLoading = false;

  // Step 2
  conditionImage: File | null = null;

  // Step 3
  comparisonResult: ReturnComparisonResponse | null = null;
  isAnalyzing = false;
  analysisError: string | null = null;

  constructor(
    private readonly bookCopyService: BookCopyService,
    private readonly allocationService: AllocationService,
    private readonly scanService: ScanService,
    private readonly router: Router,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  // Step 1: Scan/Enter QR
  searchBookByQr(): void {
    if (!this.qrCodeInput.trim()) return;
    this.bookCopyError = null;
    this.isLoading = true;

    this.bookCopyService.getByQrCode(this.qrCodeInput.trim()).subscribe({
      next: (copy) => {
        this.zone.run(() => {
          this.bookCopy = copy;
          this.allocationService.getAll({ book_copy_id: copy.id, status: 'active' }).subscribe({
            next: (res) => {
              this.zone.run(() => {
                if (res.items.length > 0) {
                  this.activeAllocation = res.items[0];
                } else {
                  this.bookCopyError = 'No active allocation found for this book copy';
                }
                this.isLoading = false;
                this.cdr.detectChanges();
              });
            },
            error: () => {
              this.zone.run(() => {
                this.bookCopyError = 'Error checking allocation status';
                this.isLoading = false;
                this.cdr.detectChanges();
              });
            }
          });
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.bookCopyError = err.status === 404 ? 'Book copy not found' : 'Error looking up book';
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onStep1Next(): void {
    if (this.bookCopy && this.activeAllocation) {
      this.currentStep = 1;
    }
  }

  // Step 2: Capture condition
  onImageSelected(file: File): void {
    this.conditionImage = file;
  }

  onStep2Next(): void {
    if (this.conditionImage && this.activeAllocation) {
      this.currentStep = 2;
      this.runComparison();
    }
  }

  // Step 3: AI Comparison using POST /scans/return-comparison
  runComparison(): void {
    if (!this.activeAllocation || !this.conditionImage) return;
    this.isAnalyzing = true;
    this.analysisError = null;

    this.scanService.returnComparison(this.activeAllocation.id, this.conditionImage).subscribe({
      next: (result) => {
        this.zone.run(() => {
          this.comparisonResult = result;
          this.isAnalyzing = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isAnalyzing = false;
          this.analysisError = 'AI comparison failed. Please try again.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  // Final: Process return
  returnBook(): void {
    if (!this.activeAllocation) return;
    this.isLoading = true;

    this.allocationService.returnBook(this.activeAllocation.id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.router.navigate(['/app/books/return/confirm'], {
            queryParams: {
              book: this.bookCopy?.qr_code,
              condition: this.comparisonResult?.condition_after,
              previousCondition: this.comparisonResult?.condition_before,
              damageDetected: this.comparisonResult?.damage_detected,
              chargeLearner: this.comparisonResult?.charge_learner
            }
          });
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
