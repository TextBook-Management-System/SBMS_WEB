import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AiSuggestionService {
  constructor(private readonly api: ApiService) {}

  /**
   * GET /api/v1/suggestions/department/{department_id}
   * Get AI suggestions for a specific department
   */
  getDepartmentSuggestions(departmentId: number): Observable<any> {
    return this.api.get<any>(`/suggestions/department/${departmentId}`);
  }

  /**
   * GET /api/v1/suggestions/
   * Get distribution suggestions
   */
  getDistributionSuggestions(): Observable<any[]> {
    return this.api.get<any[]>('/suggestions/');
  }

  /**
   * GET /api/v1/suggestions/shortages
   * Get school shortages
   */
  getSchoolShortages(): Observable<any[]> {
    return this.api.get<any[]>('/suggestions/shortages');
  }
}
