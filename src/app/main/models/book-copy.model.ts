export interface BookCopy {
  id: number;
  book_id: number;
  school_id: number;
  qr_code: string;
  condition: BookCondition;
  created_at: string;
}

export type BookCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'unusable';

export interface BookCopyCreate {
  book_id: number;
  school_id: number;
  qr_code: string;
}
