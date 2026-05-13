import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';
import { ScanResponse, ReturnComparisonResponse } from '../models/scan.model';
import { BookCondition } from '../models/book-copy.model';

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  constructor(private readonly api: ApiService) {}

  createScan(bookCopyId: number, scanImage: File): Observable<ScanResponse> {
    const formData = new FormData();
    formData.append('book_copy_id', bookCopyId.toString());
    formData.append('scan_image', scanImage);
    return this.api.upload<ScanResponse>('/scans', formData);
  }

  /**
   * POST /api/v1/scans/return-comparison
   * Compares the book condition at issue vs return.
   */
  returnComparison(allocationId: number, returnImage: File): Observable<ReturnComparisonResponse> {
    const formData = new FormData();
    formData.append('allocation_id', allocationId.toString());
    formData.append('return_image', returnImage);
    return this.api.upload<ReturnComparisonResponse>('/scans/return-comparison', formData);
  }

  getById(id: number): Observable<ScanResponse> {
    return this.api.get<ScanResponse>(`/scans/${id}`);
  }

  verifyScan(id: number, verifiedCondition: BookCondition): Observable<ScanResponse> {
    return this.api.put<ScanResponse>(`/scans/${id}/verify`, { verified_condition: verifiedCondition });
  }

  getScansByBookCopy(bookCopyId: number, params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<ScanResponse>> {
    return this.api.get<PaginatedResponse<ScanResponse>>(`/book-copies/${bookCopyId}/scans`, params);
  }
}
