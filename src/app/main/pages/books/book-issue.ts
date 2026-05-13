import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StepConfig } from '../../../components/stepper/stepper';
import { BookCopyService } from '../../services/book-copy';
import { AllocationService } from '../../services/allocation';
import { ScanService } from '../../services/scan';
import { ApiService } from '../../services/api.service';
import { BookCopy } from '../../models/book-copy.model';
import { ScanResponse, parseScanArray } from '../../models/scan.model';
import { AuthService } from '../../../auth/services/auth.service';

interface Grade { id: number; school_id: number; name: string; }
interface SubjectItem { id: number; name: string; }
interface Learner { id: number; grade_id: number; first_name: string; last_name: string; created_at: string; }

@Component({
  selector: 'app-book-issue',
  standalone: false,
  templateUrl: './book-issue.html',
  styleUrls: ['./book-issue.css']
})
export class BookIssueComponent implements OnInit, OnDestroy {
  steps: StepConfig[] = [
    { label: 'Grade & Subject' },
    { label: 'Select Learner' },
    { label: 'Find Book' },
    { label: 'Capture Condition' },
    { label: 'AI Analysis' }
  ];
  currentStep = 0;

  // Step 1
  grades: Grade[] = [];
  subjects: SubjectItem[] = [];
  selectedGradeId: number | null = null;
  selectedSubjectId: number | null = null;
  gradesLoading = true;
  subjectsLoading = true;

  // Step 2
  learners: Learner[] = [];
  selectedLearnerId: number | null = null;
  learnerSearch = '';

  // Step 3
  qrCodeInput = '';
  bookCopy: BookCopy | null = null;
  bookCopyError: string | null = null;

  // Step 4
  conditionImage: File | null = null;

  // Step 5
  scanResult: ScanResponse | null = null;
  isAnalyzing = false;

  // General
  isLoading = false;
  schoolId: number | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly api: ApiService,
    private readonly bookCopyService: BookCopyService,
    private readonly allocationService: AllocationService,
    private readonly scanService: ScanService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly zone: NgZone
  ) {}

  ngOnInit(): void {
    // Try cached user first
    const user = this.authService.getCurrentUser();
    if (user) {
      this.schoolId = user.school_id || null;
      this.loadGrades();
      this.loadSubjects();
    } else {
      // Wait for user to load (on refresh, /me call is async)
      this.authService.currentUser$
        .pipe(takeUntil(this.destroy$))
        .subscribe(u => {
          if (u && this.grades.length === 0) {
            this.schoolId = u.school_id || null;
            this.loadGrades();
            this.loadSubjects();
          }
        });
      // Also load grades without school filter as fallback
      this.loadGrades();
      this.loadSubjects();
    }
  }

  loadGrades(): void {
    this.gradesLoading = true;
    const path = this.schoolId
      ? `/schools/${this.schoolId}/grades`
      : '/grade-levels/';

    this.api.get<any>(path, { page_size: 100 }).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.grades = res.items || [];
          this.gradesLoading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.grades = [];
          this.gradesLoading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  loadSubjects(): void {
    this.subjectsLoading = true;
    this.api.get<any>('/subjects/', { page_size: 100 }).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.subjects = res.items || [];
          this.subjectsLoading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.subjects = [];
          this.subjectsLoading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  onStep1Next(): void {
    if (this.selectedGradeId && this.selectedSubjectId) {
      this.currentStep = 1;
      this.loadLearners();
    }
  }

  loadLearners(): void {
    this.api.get<any>('/learners', { grade_id: this.selectedGradeId, page_size: 100 }).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.learners = res.items || [];
          this.cdr.markForCheck();
        });
      },
      error: () => this.learners = []
    });
  }

  get filteredLearners(): Learner[] {
    if (!this.learnerSearch) return this.learners;
    const search = this.learnerSearch.toLowerCase();
    return this.learners.filter(l =>
      `${l.first_name} ${l.last_name}`.toLowerCase().includes(search)
    );
  }

  selectLearner(id: number): void {
    this.selectedLearnerId = id;
  }

  onStep2Next(): void {
    if (this.selectedLearnerId) {
      this.currentStep = 2;
    }
  }

  searchBookByQr(): void {
    if (!this.qrCodeInput.trim()) return;
    this.bookCopyError = null;
    this.isLoading = true;

    this.bookCopyService.getByQrCode(this.qrCodeInput.trim()).subscribe({
      next: (copy) => {
        this.zone.run(() => {
          this.bookCopy = copy;
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.bookCopyError = err.status === 404 ? 'Book copy not found' : 'Error looking up book';
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  onStep3Next(): void {
    if (this.bookCopy) {
      this.currentStep = 3;
    }
  }

  onImageSelected(file: File): void {
    this.conditionImage = file;
  }

  onStep4Next(): void {
    if (this.conditionImage && this.bookCopy) {
      this.currentStep = 4;
      this.runAnalysis();
    }
  }

  runAnalysis(): void {
    if (!this.bookCopy || !this.conditionImage) return;
    this.isAnalyzing = true;

    this.scanService.createScan(this.bookCopy.id, this.conditionImage).subscribe({
      next: (result) => {
        this.zone.run(() => {
          this.scanResult = result;
          this.isAnalyzing = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isAnalyzing = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  issueBook(): void {
    if (!this.bookCopy || !this.selectedLearnerId) return;
    this.isLoading = true;

    this.allocationService.create({
      book_copy_id: this.bookCopy.id,
      learner_id: this.selectedLearnerId,
      scan_image_url: this.scanResult?.scan_image_path || null,
      ai_condition: this.scanResult?.condition || null,
      ai_confidence_score: this.scanResult?.confidence_score || null,
      ai_quality_score: this.scanResult?.ai_quality_score || null,
      ai_issues: this.scanResult?.ai_issues || null,
      ai_suggestions: this.scanResult?.ai_suggestions || null
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/app/books/issue/confirm'], {
          queryParams: {
            learner: this.getSelectedLearnerName(),
            book: this.bookCopy?.qr_code,
            condition: this.scanResult?.condition
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

  getSelectedLearnerName(): string {
    const learner = this.learners.find(l => l.id === this.selectedLearnerId);
    return learner ? `${learner.first_name} ${learner.last_name}` : '';
  }

  getAiIssues(): string[] {
    return parseScanArray(this.scanResult?.ai_issues || null);
  }

  getAiSuggestions(): string[] {
    return parseScanArray(this.scanResult?.ai_suggestions || null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
