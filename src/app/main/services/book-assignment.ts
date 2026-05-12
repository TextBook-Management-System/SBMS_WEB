import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookAssignment } from '../models/book-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class BookAssignmentService {
  private mockAssignments: BookAssignment[] = [
    {
      id: 'a1',
      bookId: '2',
      learnerId: '1',
      parentId: 'p1',
      assignedBy: 'teacher1',
      assignedDate: new Date(2026, 4, 5),
      status: 'pending',
      createdAt: new Date(2026, 4, 5),
      updatedAt: new Date(2026, 4, 5)
    },
    {
      id: 'a2',
      bookId: '4',
      learnerId: '2',
      parentId: 'p1',
      assignedBy: 'teacher2',
      assignedDate: new Date(2026, 4, 3),
      status: 'accepted',
      parentResponse: {
        status: 'accepted',
        respondedAt: new Date(2026, 4, 4),
        respondedBy: 'parent1'
      },
      createdAt: new Date(2026, 4, 3),
      updatedAt: new Date(2026, 4, 4)
    },
    {
      id: 'a3',
      bookId: '7',
      learnerId: '3',
      parentId: 'p1',
      assignedBy: 'teacher1',
      assignedDate: new Date(2026, 4, 1),
      status: 'declined',
      parentResponse: {
        status: 'declined',
        respondedAt: new Date(2026, 4, 2),
        respondedBy: 'parent1',
        declineReason: 'duplicate'
      },
      createdAt: new Date(2026, 4, 1),
      updatedAt: new Date(2026, 4, 2)
    },
    {
      id: 'a4',
      bookId: '10',
      learnerId: '2',
      parentId: 'p1',
      assignedBy: 'teacher2',
      assignedDate: new Date(2026, 3, 28),
      status: 'returned',
      parentResponse: {
        status: 'accepted',
        respondedAt: new Date(2026, 3, 29),
        respondedBy: 'parent1'
      },
      returnDate: new Date(2026, 5, 10),
      createdAt: new Date(2026, 3, 28),
      updatedAt: new Date(2026, 5, 10)
    }
  ];

  getByParentId(parentId: string): Observable<BookAssignment[]> {
    return of(this.mockAssignments.filter(a => a.parentId === parentId));
  }

  getById(id: string): Observable<BookAssignment | undefined> {
    return of(this.mockAssignments.find(a => a.id === id));
  }

  acceptBook(assignmentId: string, notes?: string): Observable<BookAssignment> {
    const assignment = this.mockAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.status = 'accepted';
      assignment.parentResponse = {
        status: 'accepted',
        respondedAt: new Date(),
        respondedBy: assignment.parentId,
        notes
      };
      assignment.updatedAt = new Date();
    }
    return of(assignment as BookAssignment);
  }

  declineBook(assignmentId: string, reason: string, notes?: string): Observable<BookAssignment> {
    const assignment = this.mockAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.status = 'declined';
      assignment.parentResponse = {
        status: 'declined',
        respondedAt: new Date(),
        respondedBy: assignment.parentId,
        declineReason: reason,
        notes
      };
      assignment.updatedAt = new Date();
    }
    return of(assignment as BookAssignment);
  }

  returnBook(assignmentId: string): Observable<BookAssignment> {
    const assignment = this.mockAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.status = 'returned';
      assignment.returnDate = new Date();
      assignment.updatedAt = new Date();
    }
    return of(assignment as BookAssignment);
  }

  reportLost(assignmentId: string): Observable<BookAssignment> {
    const assignment = this.mockAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      assignment.status = 'lost';
      assignment.updatedAt = new Date();
    }
    return of(assignment as BookAssignment);
  }
}
