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

/** Helper to parse the JSON string arrays from the API */
export function parseScanArray(jsonStr: string | null): string[] {
  if (!jsonStr) return [];
  try { return JSON.parse(jsonStr); } catch { return []; }
}
