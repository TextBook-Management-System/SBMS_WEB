import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TransferSuggestion, SchoolBookSummary } from '../models/transfer-suggestion.model';

@Injectable({
  providedIn: 'root'
})
export class AiSuggestionService {
  private mockSuggestions: TransferSuggestion[] = [
    {
      id: '1', destinationSchoolId: '3', destinationSchoolName: 'Hillcrest Combined', subjectId: 'math', gradeId: 'grade-6', totalNeeded: 30, confidence: 87,
      sources: [
        { schoolId: '1', schoolName: 'Greenfield Primary', availableQuantity: 45, suggestedQuantity: 15, bookCondition: 'good' },
        { schoolId: '5', schoolName: 'Riverside High', availableQuantity: 60, suggestedQuantity: 15, bookCondition: 'good' }
      ],
      status: 'pending', createdAt: new Date('2024-03-01')
    },
    {
      id: '2', destinationSchoolId: '4', destinationSchoolName: 'Valley View Primary', subjectId: 'english', gradeId: 'grade-5', totalNeeded: 20, confidence: 92,
      sources: [
        { schoolId: '2', schoolName: 'Sunrise Secondary', availableQuantity: 35, suggestedQuantity: 20, bookCondition: 'new' }
      ],
      status: 'pending', createdAt: new Date('2024-03-05')
    },
    {
      id: '3', destinationSchoolId: '1', destinationSchoolName: 'Greenfield Primary', subjectId: 'science', gradeId: 'grade-4', totalNeeded: 15, confidence: 78,
      sources: [
        { schoolId: '5', schoolName: 'Riverside High', availableQuantity: 40, suggestedQuantity: 15, bookCondition: 'fair' }
      ],
      status: 'accepted', createdAt: new Date('2024-02-20')
    },
  ];

  private mockSummaries: SchoolBookSummary[] = [
    { schoolId: '1', schoolName: 'Greenfield Primary', totalBooks: 1200, totalLearners: 450, ratio: 2.67, surplus: 120, status: 'surplus' },
    { schoolId: '2', schoolName: 'Sunrise Secondary', totalBooks: 1800, totalLearners: 680, ratio: 2.65, surplus: 150, status: 'surplus' },
    { schoolId: '3', schoolName: 'Hillcrest Combined', totalBooks: 900, totalLearners: 520, ratio: 1.73, surplus: -80, status: 'deficit' },
    { schoolId: '4', schoolName: 'Valley View Primary', totalBooks: 1050, totalLearners: 380, ratio: 2.76, surplus: 50, status: 'balanced' },
    { schoolId: '5', schoolName: 'Riverside High', totalBooks: 2100, totalLearners: 720, ratio: 2.92, surplus: 200, status: 'surplus' },
  ];

  getSuggestions(): Observable<TransferSuggestion[]> {
    return of(this.mockSuggestions);
  }

  getSuggestionById(id: string): Observable<TransferSuggestion | undefined> {
    return of(this.mockSuggestions.find(s => s.id === id));
  }

  getSchoolSummaries(): Observable<SchoolBookSummary[]> {
    return of(this.mockSummaries);
  }

  acceptSuggestion(id: string): Observable<TransferSuggestion> {
    const index = this.mockSuggestions.findIndex(s => s.id === id);
    if (index > -1) {
      this.mockSuggestions[index] = { ...this.mockSuggestions[index], status: 'accepted' };
      return of(this.mockSuggestions[index]);
    }
    return of(this.mockSuggestions[0]);
  }

  rejectSuggestion(id: string): Observable<TransferSuggestion> {
    const index = this.mockSuggestions.findIndex(s => s.id === id);
    if (index > -1) {
      this.mockSuggestions[index] = { ...this.mockSuggestions[index], status: 'rejected' };
      return of(this.mockSuggestions[index]);
    }
    return of(this.mockSuggestions[0]);
  }
}
