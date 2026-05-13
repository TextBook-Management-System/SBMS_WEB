import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../../auth/services/auth.service';

interface BookCopyInfo {
  id: number;
  qr_code: string;
  condition: string;
  book_title: string;
  book_isbn: string;
}

interface AcknowledgementInfo {
  id: number;
  status: string;
  reason: string | null;
  created_at: string;
}

interface AllocationInfo {
  id: number;
  status: string;
  allocation_date: string;
  return_date: string | null;
  scan_image_url: string | null;
  ai_condition: string | null;
  ai_quality_score: number | null;
  book_copy: BookCopyInfo;
  acknowledgements: AcknowledgementInfo[];
}

interface LearnerWithAllocations {
  id: number;
  first_name: string;
  last_name: string;
  grade_id: number;
  grade_name: string;
  school_name: string;
  allocations: AllocationInfo[];
}

interface ParentChildrenResponse {
  parent_id: number;
  learners: LearnerWithAllocations[];
}

@Component({
  selector: 'app-parent-books',
  standalone: false,
  templateUrl: './parent-books.html',
  styleUrls: ['./parent-books.css']
})
export class ParentBooksComponent implements OnInit {
  data: ParentChildrenResponse | null = null;
  selectedChild: LearnerWithAllocations | null = null;
  isLoading = true;
  loadError: string | null = null;
  selectedTab: 'all' | 'active' | 'returned' | 'pending' | 'rejected' = 'all';

  // Reject modal
  showRejectModal = false;
  selectedAckId: number | null = null;
  rejectReason = '';
  isSubmitting = false;

  parentId: number | null = null;

  constructor(
    private readonly api: ApiService,
    private readonly authService: AuthService,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.parentId = user.id;
      this.loadData();
    } else {
      this.authService.currentUser$.subscribe(u => {
        if (u && !this.parentId) {
          this.parentId = u.id;
          this.loadData();
        }
      });
    }
  }

  loadData(): void {
    if (!this.parentId) return;
    this.isLoading = true;
    this.loadError = null;

    this.api.get<ParentChildrenResponse>(`/learners/parent/${this.parentId}/children`).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.data = res;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadError = 'Could not load data. Please try again.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  get children(): LearnerWithAllocations[] {
    return this.data?.learners || [];
  }

  selectChild(child: LearnerWithAllocations): void {
    this.selectedChild = child;
    this.selectedTab = 'all';
  }

  backToChildren(): void {
    this.selectedChild = null;
    this.selectedTab = 'all';
  }

  get filteredAllocations(): AllocationInfo[] {
    if (!this.selectedChild) return [];
    const allocs = this.selectedChild.allocations;
    switch (this.selectedTab) {
      case 'active': return allocs.filter(a => a.status === 'active');
      case 'returned': return allocs.filter(a => a.status === 'returned');
      case 'pending': return allocs.filter(a => a.acknowledgements.length === 0 || a.acknowledgements.some(ack => ack.status === 'pending'));
      case 'rejected': return allocs.filter(a => a.acknowledgements.some(ack => ack.status === 'rejected'));
      default: return allocs;
    }
  }

  getTabCount(tab: string): number {
    if (!this.selectedChild) return 0;
    const allocs = this.selectedChild.allocations;
    switch (tab) {
      case 'active': return allocs.filter(a => a.status === 'active').length;
      case 'returned': return allocs.filter(a => a.status === 'returned').length;
      case 'pending': return allocs.filter(a => a.acknowledgements.length === 0 || a.acknowledgements.some(ack => ack.status === 'pending')).length;
      case 'rejected': return allocs.filter(a => a.acknowledgements.some(ack => ack.status === 'rejected')).length;
      default: return allocs.length;
    }
  }

  // Accept — if no ack exists, create one first then accept
  acceptAcknowledgement(allocationId: number): void {
    const alloc = this.selectedChild?.allocations.find(a => a.id === allocationId);
    if (!alloc) return;

    const pendingAck = alloc.acknowledgements.find(a => a.status === 'pending');
    if (pendingAck) {
      this.api.put<any>(`/acknowledgements/${pendingAck.id}/accept`).subscribe({
        next: () => {
          this.zone.run(() => {
            pendingAck.status = 'accepted';
            this.cdr.detectChanges();
          });
        }
      });
    } else {
      // No ack exists — create then accept
      this.api.post<any>('/acknowledgements', { allocation_id: allocationId }).subscribe({
        next: (newAck: any) => {
          this.api.put<any>(`/acknowledgements/${newAck.id}/accept`).subscribe({
            next: () => {
              this.zone.run(() => {
                alloc.acknowledgements.push({ id: newAck.id, status: 'accepted', reason: null, created_at: new Date().toISOString() });
                this.cdr.detectChanges();
              });
            }
          });
        }
      });
    }
  }

  // Reject — store allocation ID, resolve ack on submit
  openRejectModal(allocationId: number): void {
    this.selectedAckId = allocationId;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedAckId = null;
  }

  submitReject(): void {
    if (!this.selectedAckId || !this.rejectReason.trim()) return;
    this.isSubmitting = true;

    const alloc = this.selectedChild?.allocations.find(a => a.id === this.selectedAckId);
    if (!alloc) { this.isSubmitting = false; return; }

    const pendingAck = alloc.acknowledgements.find(a => a.status === 'pending');

    const doReject = (ackId: number) => {
      this.api.put<any>(`/acknowledgements/${ackId}/reject`, { reason: this.rejectReason.trim() }).subscribe({
        next: () => {
          this.zone.run(() => {
            const ack = alloc.acknowledgements.find(a => a.id === ackId);
            if (ack) { ack.status = 'rejected'; ack.reason = this.rejectReason.trim(); }
            else { alloc.acknowledgements.push({ id: ackId, status: 'rejected', reason: this.rejectReason.trim(), created_at: new Date().toISOString() }); }
            this.isSubmitting = false;
            this.closeRejectModal();
            this.cdr.detectChanges();
          });
        },
        error: () => { this.zone.run(() => { this.isSubmitting = false; this.cdr.detectChanges(); }); }
      });
    };

    if (pendingAck) {
      doReject(pendingAck.id);
    } else {
      // Create ack first then reject
      this.api.post<any>('/acknowledgements', { allocation_id: this.selectedAckId }).subscribe({
        next: (newAck: any) => doReject(newAck.id),
        error: () => { this.zone.run(() => { this.isSubmitting = false; this.cdr.detectChanges(); }); }
      });
    }
  }

  private updateAckStatus(ackId: number, status: string, reason?: string): void {
    if (!this.selectedChild) return;
    for (const alloc of this.selectedChild.allocations) {
      const ack = alloc.acknowledgements.find(a => a.id === ackId);
      if (ack) {
        ack.status = status;
        if (reason) ack.reason = reason;
        break;
      }
    }
  }

  getPendingAck(alloc: AllocationInfo): AcknowledgementInfo | undefined {
    return alloc.acknowledgements.find(a => a.status === 'pending');
  }

  /**
   * If acknowledgements array is empty, the allocation is considered pending (needs parent action).
   */
  isPendingAction(alloc: AllocationInfo): boolean {
    if (alloc.acknowledgements.length === 0) return true;
    return alloc.acknowledgements.some(a => a.status === 'pending');
  }

  getLatestAck(alloc: AllocationInfo): AcknowledgementInfo | undefined {
    if (alloc.acknowledgements.length === 0) return undefined;
    return alloc.acknowledgements[alloc.acknowledgements.length - 1];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}
