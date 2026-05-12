import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Learner } from '../models/learner.model';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  private mockLearners: Learner[] = [
    { id: '1', firstName: 'Thabo', lastName: 'Molefe', idNumber: '0901015012083', gradeId: 'grade-4', schoolId: '1', parentId: '1', dateOfBirth: new Date('2009-01-01'), gender: 'male', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', firstName: 'Naledi', lastName: 'Sithole', idNumber: '1003125034087', gradeId: 'grade-8', schoolId: '2', parentId: '2', dateOfBirth: new Date('2010-03-12'), gender: 'female', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', firstName: 'Sipho', lastName: 'Dlamini', idNumber: '0806205078081', gradeId: 'grade-6', schoolId: '3', parentId: '3', dateOfBirth: new Date('2008-06-20'), gender: 'male', createdAt: new Date(), updatedAt: new Date() },
    { id: '4', firstName: 'Amahle', lastName: 'Nkosi', idNumber: '1105155092084', gradeId: 'grade-5', schoolId: '4', parentId: '4', dateOfBirth: new Date('2011-05-15'), gender: 'female', createdAt: new Date(), updatedAt: new Date() },
    { id: '5', firstName: 'Liam', lastName: 'Van der Merwe', idNumber: '0712085045082', gradeId: 'grade-10', schoolId: '5', parentId: '5', dateOfBirth: new Date('2007-12-08'), gender: 'male', createdAt: new Date(), updatedAt: new Date() },
  ];

  getAll(): Observable<Learner[]> {
    return of(this.mockLearners);
  }

  getById(id: string): Observable<Learner | undefined> {
    return of(this.mockLearners.find(l => l.id === id));
  }

  getBySchool(schoolId: string): Observable<Learner[]> {
    return of(this.mockLearners.filter(l => l.schoolId === schoolId));
  }

  getByParent(parentId: string): Observable<Learner[]> {
    return of(this.mockLearners.filter(l => l.parentId === parentId));
  }

  create(learner: Partial<Learner>): Observable<Learner> {
    const newLearner: Learner = {
      ...learner as Learner,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockLearners.push(newLearner);
    return of(newLearner);
  }

  update(id: string, learner: Partial<Learner>): Observable<Learner> {
    const index = this.mockLearners.findIndex(l => l.id === id);
    if (index > -1) {
      this.mockLearners[index] = { ...this.mockLearners[index], ...learner, updatedAt: new Date() };
      return of(this.mockLearners[index]);
    }
    return of(learner as Learner);
  }

  delete(id: string): Observable<void> {
    this.mockLearners = this.mockLearners.filter(l => l.id !== id);
    return of(undefined);
  }
}
