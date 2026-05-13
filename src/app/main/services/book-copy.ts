import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PaginatedResponse } from './api.service';
import { BookCopy, BookCopyCreate, BookCondition } from '../models/book-copy.model';

@Injectable({
  providedIn: 'root'
})
export class BookCopyService {
  constructor(private readonly api: ApiService) {}

  getAll(params?: { school_id?: number; book_id?: number; page?: number; page_size?: number }): Observable<PaginatedResponse<BookCopy>> {
    return this.api.get<PaginatedResponse<BookCopy>>('/book-copies', params);
  }

  getById(id: number): Observable<BookCopy> {
    return this.api.get<BookCopy>(`/book-copies/${id}`);
  }

  getByQrCode(qrCode: string): Observable<BookCopy> {
    return this.api.get<BookCopy>(`/book-copies/qr/${qrCode}`);
  }

  create(bookCopy: BookCopyCreate): Observable<BookCopy> {
    return this.api.post<BookCopy>('/book-copies', bookCopy);
  }

  updateCondition(id: number, condition: BookCondition): Observable<BookCopy> {
    return this.api.put<BookCopy>(`/book-copies/${id}/condition`, { condition });
  }
}
