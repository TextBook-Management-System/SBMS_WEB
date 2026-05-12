export interface TransferSuggestion {
  id: string;
  destinationSchoolId: string;
  destinationSchoolName: string;
  subjectId: string;
  gradeId: string;
  totalNeeded: number;
  sources: TransferSource[];
  confidence: number; // 0-100
  status: 'pending' | 'accepted' | 'rejected' | 'executed';
  createdAt: Date;
}

export interface TransferSource {
  schoolId: string;
  schoolName: string;
  availableQuantity: number;
  suggestedQuantity: number;
  bookCondition: string;
}

export interface SchoolBookSummary {
  schoolId: string;
  schoolName: string;
  totalBooks: number;
  totalLearners: number;
  ratio: number; // books per learner
  surplus: number; // positive = excess, negative = deficit
  status: 'surplus' | 'balanced' | 'deficit';
}
