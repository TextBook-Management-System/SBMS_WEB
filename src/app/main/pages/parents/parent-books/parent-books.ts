import { Component, OnInit } from '@angular/core';
import { BookAssignmentService } from '../../../services/book-assignment';
import { BookService } from '../../../services/book';
import { LearnerService } from '../../../services/learner';
import { BookAssignment } from '../../../models/book-assignment.model';
import { Book } from '../../../models/book.model';
import { Learner } from '../../../models/learner.model';

interface BookAssignmentDisplay {
  assignment: BookAssignment;
  book: Book | undefined;
  learner: Learner | undefined;
}

@Component({
  selector: 'app-parent-books',
  standalone: false,
  templateUrl: './parent-books.html',
  styleUrls: ['./parent-books.css']
})
export class ParentBooksComponent implements OnInit {
  assignments: BookAssignmentDisplay[] = [];
  learners: Learner[] = [];
  isLoading = true;
  selectedFilter: 'all' | 'pending' | 'accepted' | 'returned' | 'declined' = 'all';
  
  showDeclineModal = false;
  showReturnModal = false;
  selectedAssignmentId: string | null = null;
  declineReason = '';
  declineNotes = '';
  returnNotes = '';

  // Mock parent ID - in real app this would come from auth service
  parentId = 'p1';

  constructor(
    private readonly bookAssignmentService: BookAssignmentService,
    private readonly bookService: BookService,
    private readonly learnerService: LearnerService
  ) {}

  ngOnInit(): void {
    this.loadBookAssignments();
  }

  loadBookAssignments(): void {
    this.isLoading = true;
    this.bookAssignmentService.getByParentId(this.parentId).subscribe(assignments => {
      this.assignments = assignments.map(assignment => ({
        assignment,
        book: undefined,
        learner: undefined
      }));
      
      // Load book and learner details
      assignments.forEach((assignment, index) => {
        this.bookService.getById(assignment.bookId).subscribe(book => {
          if (this.assignments[index]) {
            this.assignments[index].book = book;
          }
        });
        
        this.learnerService.getById(assignment.learnerId).subscribe(learner => {
          if (this.assignments[index]) {
            this.assignments[index].learner = learner;
          }
        });
      });
      
      this.isLoading = false;
    });
  }

  getFilteredAssignments(): BookAssignmentDisplay[] {
    if (this.selectedFilter === 'all') {
      return this.assignments;
    }
    return this.assignments.filter(a => a.assignment.status === this.selectedFilter);
  }

  getPendingCount(): number {
    return this.assignments.filter(a => a.assignment.status === 'pending').length;
  }

  getAcceptedCount(): number {
    return this.assignments.filter(a => a.assignment.status === 'accepted').length;
  }

  getDeclinedCount(): number {
    return this.assignments.filter(a => a.assignment.status === 'declined').length;
  }

  getReturnedCount(): number {
    return this.assignments.filter(a => a.assignment.status === 'returned').length;
  }

  openDeclineModal(assignmentId: string): void {
    this.selectedAssignmentId = assignmentId;
    this.showDeclineModal = true;
    this.declineReason = '';
    this.declineNotes = '';
  }

  closeDeclineModal(): void {
    this.showDeclineModal = false;
    this.selectedAssignmentId = null;
  }

  openReturnModal(assignmentId: string): void {
    this.selectedAssignmentId = assignmentId;
    this.showReturnModal = true;
    this.returnNotes = '';
  }

  closeReturnModal(): void {
    this.showReturnModal = false;
    this.selectedAssignmentId = null;
  }

  acceptBook(assignmentId: string): void {
    this.bookAssignmentService.acceptBook(assignmentId).subscribe(() => {
      this.loadBookAssignments();
    });
  }

  declineBook(): void {
    if (this.selectedAssignmentId && this.declineReason) {
      this.bookAssignmentService.declineBook(
        this.selectedAssignmentId, 
        this.declineReason,
        this.declineNotes
      ).subscribe(() => {
        this.loadBookAssignments();
        this.closeDeclineModal();
      });
    }
  }

  returnBook(): void {
    if (this.selectedAssignmentId) {
      this.bookAssignmentService.returnBook(this.selectedAssignmentId).subscribe(() => {
        this.loadBookAssignments();
        this.closeReturnModal();
      });
    }
  }

  reportLost(assignmentId: string): void {
    if (confirm('Are you sure you want to report this book as lost?')) {
      this.bookAssignmentService.reportLost(assignmentId).subscribe(() => {
        this.loadBookAssignments();
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'accepted':
        return 'badge-accepted';
      case 'declined':
        return 'badge-declined';
      case 'returned':
        return 'badge-returned';
      case 'lost':
        return 'badge-lost';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'pi-clock';
      case 'accepted':
        return 'pi-check-circle';
      case 'declined':
        return 'pi-times-circle';
      case 'returned':
        return 'pi-arrow-left';
      case 'lost':
        return 'pi-exclamation-triangle';
      default:
        return '';
    }
  }

  getDeclineReasonLabel(reason: string): string {
    const reasonMap: { [key: string]: string } = {
      duplicate: 'Already Have Duplicate Copy',
      damaged: 'Book Appears Damaged',
      irrelevant: 'Not Relevant for Child',
      accessibility: 'Accessibility Concerns',
      other: 'Other Reason'
    };
    return reasonMap[reason] || reason;
  }

  isAccepted(assignment: BookAssignment): boolean {
    return assignment.status === 'accepted' || assignment.parentResponse?.status === 'accepted';
  }

  canReturnOrReport(status: string): boolean {
    return status === 'accepted';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
