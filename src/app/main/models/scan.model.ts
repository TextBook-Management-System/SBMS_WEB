export interface ScanResponse {
  id: number;
  book_copy_id: number;
  ai_model_id: number;
  condition: string;
  confidence_score: number;
  verified_condition: string | null;
  ai_issues: string | null;       // JSON string array
  ai_suggestions: string | null;  // JSON string array
  ai_quality_score: number | null;
  scan_image_path: string;
  scanned_at: string;
}

export interface ReturnComparisonResponse {
  allocation_id: number;
  book_copy_id: number;
  learner_id: number;
  allocation_image_url: string | null;
  return_image_url: string | null;
  condition_before: string;
  condition_after: string;
  quality_score_before: number | null;
  quality_score_after: number | null;
  condition_changed: boolean;
  damage_detected: boolean;
  new_issues: string[];
  comparison_summary: string;
  suggestions: string[];
  charge_learner: boolean;
}

/** Helper to parse the JSON string arrays from the API */
export function parseScanArray(jsonStr: string | null): string[] {
  if (!jsonStr) return [];
  try { return JSON.parse(jsonStr); } catch { return []; }
}
