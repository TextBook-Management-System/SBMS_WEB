import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';
import { Allocation, AllocationCreate } from '../models/allocation.model';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {
  constructor(private readonly api: ApiService) {}

  getAll(params?: { learner_id?: number; book_copy_id?: number; status?: string; page?: number; page_size?: number }): Observable<PaginatedResponse<Allocation>> {
    return this.api.get<PaginatedResponse<Allocation>>('/allocations', params);
  }

  getById(id: number): Observable<Allocation> {
    return this.api.get<Allocation>(`/allocations/${id}`);
  }

  create(allocation: AllocationCreate): Observable<Allocation> {
    return this.api.post<Allocation>('/allocations', allocation);
  }

  returnBook(id: number): Observable<Allocation> {
    return this.api.put<Allocation>(`/allocations/${id}/return`);
  }
}
