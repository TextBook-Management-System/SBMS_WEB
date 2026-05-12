import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Parent } from '../models/parent.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private mockParents: Parent[] = [
    { id: '1', firstName: 'David', lastName: 'Molefe', email: 'david.molefe@email.com', phone: '082-555-0101', idNumber: '7801015012083', address: '12 Oak Street, Sandton', learnerIds: ['1'], createdAt: new Date(), updatedAt: new Date() },
    { id: '2', firstName: 'Grace', lastName: 'Sithole', email: 'grace.sithole@email.com', phone: '083-555-0202', idNumber: '8003125034087', address: '45 Pine Ave, Randburg', learnerIds: ['2'], createdAt: new Date(), updatedAt: new Date() },
    { id: '3', firstName: 'John', lastName: 'Dlamini', email: 'john.dlamini@email.com', phone: '084-555-0303', idNumber: '7506205078081', address: '78 Elm Rd, Midrand', learnerIds: ['3'], createdAt: new Date(), updatedAt: new Date() },
    { id: '4', firstName: 'Nomsa', lastName: 'Nkosi', email: 'nomsa.nkosi@email.com', phone: '085-555-0404', idNumber: '8205155092084', address: '23 Birch Lane, Centurion', learnerIds: ['4'], createdAt: new Date(), updatedAt: new Date() },
    { id: '5', firstName: 'Pieter', lastName: 'Van der Merwe', email: 'pieter.vdm@email.com', phone: '086-555-0505', idNumber: '7712085045082', address: '56 Maple Dr, Pretoria', learnerIds: ['5'], createdAt: new Date(), updatedAt: new Date() },
  ];

  getAll(): Observable<Parent[]> {
    return of(this.mockParents);
  }

  getById(id: string): Observable<Parent | undefined> {
    return of(this.mockParents.find(p => p.id === id));
  }

  create(parent: Partial<Parent>): Observable<Parent> {
    const newParent: Parent = {
      ...parent as Parent,
      id: Date.now().toString(),
      learnerIds: parent.learnerIds || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockParents.push(newParent);
    return of(newParent);
  }

  update(id: string, parent: Partial<Parent>): Observable<Parent> {
    const index = this.mockParents.findIndex(p => p.id === id);
    if (index > -1) {
      this.mockParents[index] = { ...this.mockParents[index], ...parent, updatedAt: new Date() };
      return of(this.mockParents[index]);
    }
    return of(parent as Parent);
  }

  delete(id: string): Observable<void> {
    this.mockParents = this.mockParents.filter(p => p.id !== id);
    return of(undefined);
  }
}
