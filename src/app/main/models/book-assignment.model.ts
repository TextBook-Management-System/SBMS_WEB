export interface BookAssignment {
  id: string;
  bookId: string;
  learnerId: string;
  parentId: string;
  assignedBy: string;
  assignedDate: Date;
  status: BookAssignmentStatus;
  parentResponse?: BookAssignmentResponse;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type BookAssignmentStatus = 'pending' | 'accepted' | 'declined' | 'returned' | 'lost';

export interface BookAssignmentResponse {
  status: 'accepted' | 'declined';
  respondedAt: Date;
  respondedBy: string;
  declineReason?: string;
  notes?: string;
}

export type DeclineReason = 'duplicate' | 'damaged' | 'irrelevant' | 'accessibility' | 'other';

export const DECLINE_REASONS: { value: DeclineReason; label: string }[] = [
  { value: 'duplicate', label: 'Already Have Duplicate Copy' },
  { value: 'damaged', label: 'Book Appears Damaged' },
  { value: 'irrelevant', label: 'Not Relevant for Child' },
  { value: 'accessibility', label: 'Accessibility Concerns' },
  { value: 'other', label: 'Other Reason' }
];
