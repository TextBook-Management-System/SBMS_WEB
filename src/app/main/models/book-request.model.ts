export interface BookRequest {
  id: string;
  schoolId: string;
  schoolName: string;
  subjectId: string;
  gradeId: string;
  quantity: number;
  reason: string;
  status: RequestStatus;
  requestedBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';
