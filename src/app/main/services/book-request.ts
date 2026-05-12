import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookRequest } from '../models/book-request.model';

@Injectable({
  providedIn: 'root'
})
export class BookRequestService {
  private mockRequests: BookRequest[] = [
    { id: '1', schoolId: '1', schoolName: 'Greenfield Primary', subjectId: 'math', gradeId: 'grade-4', quantity: 50, reason: 'New intake of learners requires additional textbooks', status: 'pending', requestedBy: 'Mrs. Nkosi', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-01') },
    { id: '2', schoolId: '2', schoolName: 'Sunrise Secondary', subjectId: 'english', gradeId: 'grade-8', quantity: 30, reason: 'Damaged books need replacement', status: 'approved', requestedBy: 'Mr. Mokoena', approvedBy: 'Admin Dept', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-20') },
    { id: '3', schoolId: '3', schoolName: 'Hillcrest Combined', subjectId: 'science', gradeId: 'grade-6', quantity: 25, reason: 'Curriculum change requires new edition', status: 'rejected', requestedBy: 'Dr. Pillay', createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-15') },
    { id: '4', schoolId: '4', schoolName: 'Valley View Primary', subjectId: 'history', gradeId: 'grade-5', quantity: 40, reason: 'School expansion - new classrooms added', status: 'fulfilled', requestedBy: 'Mrs. Dlamini', approvedBy: 'Admin Dept', createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-02-01') },
    { id: '5', schoolId: '5', schoolName: 'Riverside High', subjectId: 'math', gradeId: 'grade-10', quantity: 60, reason: 'Insufficient books for current learner count', status: 'pending', requestedBy: 'Mr. Van der Merwe', createdAt: new Date('2024-03-10'), updatedAt: new Date('2024-03-10') },
  ];

  getAll(): Observable<BookRequest[]> {
    return of(this.mockRequests);
  }

  getById(id: string): Observable<BookRequest | undefined> {
    return of(this.mockRequests.find(r => r.id === id));
  }

  create(request: Partial<BookRequest>): Observable<BookRequest> {
    const newRequest: BookRequest = {
      ...request as BookRequest,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockRequests.push(newRequest);
    return of(newRequest);
  }

  update(id: string, request: Partial<BookRequest>): Observable<BookRequest> {
    const index = this.mockRequests.findIndex(r => r.id === id);
    if (index > -1) {
      this.mockRequests[index] = { ...this.mockRequests[index], ...request, updatedAt: new Date() };
      return of(this.mockRequests[index]);
    }
    return of(request as BookRequest);
  }

  approve(id: string, approvedBy: string): Observable<BookRequest> {
    return this.update(id, { status: 'approved', approvedBy });
  }

  reject(id: string): Observable<BookRequest> {
    return this.update(id, { status: 'rejected' });
  }

  delete(id: string): Observable<void> {
    this.mockRequests = this.mockRequests.filter(r => r.id !== id);
    return of(undefined);
  }
}
