import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SchoolInventory {
  schoolId: string;
  schoolName: string;
  totalBooks: number;
  newCount: number;
  goodCount: number;
  fairCount: number;
  damagedCount: number;
  lostCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private mockInventory: SchoolInventory[] = [
    { schoolId: '1', schoolName: 'Greenfield Primary', totalBooks: 1200, newCount: 300, goodCount: 500, fairCount: 250, damagedCount: 100, lostCount: 50 },
    { schoolId: '2', schoolName: 'Sunrise Secondary', totalBooks: 1800, newCount: 450, goodCount: 750, fairCount: 350, damagedCount: 180, lostCount: 70 },
    { schoolId: '3', schoolName: 'Hillcrest Combined', totalBooks: 900, newCount: 150, goodCount: 400, fairCount: 200, damagedCount: 100, lostCount: 50 },
    { schoolId: '4', schoolName: 'Valley View Primary', totalBooks: 1050, newCount: 250, goodCount: 450, fairCount: 200, damagedCount: 100, lostCount: 50 },
    { schoolId: '5', schoolName: 'Riverside High', totalBooks: 2100, newCount: 600, goodCount: 850, fairCount: 400, damagedCount: 180, lostCount: 70 },
  ];

  getAll(): Observable<SchoolInventory[]> {
    return of(this.mockInventory);
  }

  getBySchool(schoolId: string): Observable<SchoolInventory | undefined> {
    return of(this.mockInventory.find(i => i.schoolId === schoolId));
  }

  getTotals(): Observable<SchoolInventory> {
    const totals: SchoolInventory = {
      schoolId: 'all',
      schoolName: 'All Schools',
      totalBooks: this.mockInventory.reduce((sum, i) => sum + i.totalBooks, 0),
      newCount: this.mockInventory.reduce((sum, i) => sum + i.newCount, 0),
      goodCount: this.mockInventory.reduce((sum, i) => sum + i.goodCount, 0),
      fairCount: this.mockInventory.reduce((sum, i) => sum + i.fairCount, 0),
      damagedCount: this.mockInventory.reduce((sum, i) => sum + i.damagedCount, 0),
      lostCount: this.mockInventory.reduce((sum, i) => sum + i.lostCount, 0),
    };
    return of(totals);
  }
}
