export interface Allocation {
  id: number;
  book_copy_id: number;
  learner_id: number;
  status: 'active' | 'returned';
  allocation_date: string;
  return_date: string | null;
  scan_image_url: string | null;
  ai_condition: string | null;
  ai_confidence_score: number | null;
  ai_quality_score: number | null;
  ai_issues: string | null;
  ai_suggestions: string | null;
}

export interface AllocationCreate {
  book_copy_id: number;
  learner_id: number;
  scan_image_url?: string | null;
  ai_condition?: string | null;
  ai_confidence_score?: number | null;
  ai_quality_score?: number | null;
  ai_issues?: string | null;
  ai_suggestions?: string | null;
}
