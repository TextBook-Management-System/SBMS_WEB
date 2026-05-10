export interface Book {
  id: string;
  title: string;
  isbn: string;
  author: string;
  publisher: string;
  subjectId: string;
  gradeId: string;
  condition: BookCondition;
  schoolId: string;
  isAssigned: boolean;
  assignedToLearnerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookCondition = 'new' | 'good' | 'fair' | 'damaged' | 'lost';
