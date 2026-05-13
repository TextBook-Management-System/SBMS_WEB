import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StepConfig } from '../../../components/stepper/stepper';
import { BookCopyService } from '../../services/book-copy';
import { AllocationService } from '../../services/allocation';
import { ScanService } from '../../services/scan';
import { BookCopy } from '../../models/book-copy.model';
import { Allocation } from '../../models/allocation.model';
import { ScanResponse, parseScanArray } from '../../models/scan.model';

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
    { label: 'AI Analysis' }
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
  scanResult: ScanResponse | null = null;
  isAnalyzing = false;

  constructor(
    private readonly bookCopyService: BookCopyService,
    private readonly allocationService: AllocationService,
    private readonly scanService: ScanService,
    private readonly router: Router
  ) {}

  // Step 1: Scan/Enter QR
  searchBookByQr(): void {
    if (!this.qrCodeInput.trim()) return;
    this.bookCopyError = null;
    this.isLoading = true;

    this.bookCopyService.getByQrCode(this.qrCodeInput.trim()).subscribe({
      next: (copy) => {
        this.bookCopy = copy;
        // Find active allocation for this book copy
        this.allocationService.getAll({ book_copy_id: copy.id, status: 'active' }).subscribe({
          next: (res) => {
            if (res.items.length > 0) {
              this.activeAllocation = res.items[0];
            } else {
              this.bookCopyError = 'No active allocation found for this book copy';
            }
            this.isLoading = false;
          },
          error: () => {
            this.bookCopyError = 'Error checking allocation status';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.bookCopyError = err.status === 404 ? 'Book copy not found' : 'Error looking up book';
        this.isLoading = false;
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
    if (this.conditionImage && this.bookCopy) {
      this.currentStep = 2;
      this.runAnalysis();
    }
  }

  // Step 3: AI Analysis
  runAnalysis(): void {
    if (!this.bookCopy || !this.conditionImage) return;
    this.isAnalyzing = true;

    this.scanService.createScan(this.bookCopy.id, this.conditionImage).subscribe({
      next: (result) => {
        this.scanResult = result;
        this.isAnalyzing = false;
      },
      error: () => {
        this.isAnalyzing = false;
      }
    });
  }

  // Final: Process return
  returnBook(): void {
    if (!this.activeAllocation) return;
    this.isLoading = true;

    this.allocationService.returnBook(this.activeAllocation.id).subscribe({
      next: () => {
        // Update book condition based on scan
        if (this.bookCopy && this.scanResult) {
          this.bookCopyService.updateCondition(this.bookCopy.id, this.scanResult.condition as any).subscribe();
        }
        this.isLoading = false;
        this.router.navigate(['/app/books/return/confirm'], {
          queryParams: {
            book: this.bookCopy?.qr_code,
            condition: this.scanResult?.condition,
            previousCondition: this.bookCopy?.condition
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  getAiIssues(): string[] {
    return parseScanArray(this.scanResult?.ai_issues || null);
  }

  getAiSuggestions(): string[] {
    return parseScanArray(this.scanResult?.ai_suggestions || null);
  }
}
