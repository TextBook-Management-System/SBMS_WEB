import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { School } from '../models/school.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private readonly API_URL = '/api/schools';

  // Mock data for development
  private mockSchools: School[] = [
    { id: '1', name: 'Greenfield Primary', code: 'GP001', address: '123 Main St', district: 'Central', province: 'Gauteng', contactNumber: '011-555-0101', email: 'info@greenfield.edu', principalName: 'Mrs. Nkosi', totalLearners: 450, totalBooks: 1200, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Sunrise Secondary', code: 'SS002', address: '456 Oak Ave', district: 'Central', province: 'Gauteng', contactNumber: '011-555-0102', email: 'info@sunrise.edu', principalName: 'Mr. Mokoena', totalLearners: 680, totalBooks: 1800, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Hillcrest Combined', code: 'HC003', address: '789 Hill Rd', district: 'North', province: 'Gauteng', contactNumber: '011-555-0103', email: 'info@hillcrest.edu', principalName: 'Dr. Pillay', totalLearners: 520, totalBooks: 900, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'Valley View Primary', code: 'VV004', address: '321 Valley Dr', district: 'South', province: 'Gauteng', contactNumber: '011-555-0104', email: 'info@valleyview.edu', principalName: 'Mrs. Dlamini', totalLearners: 380, totalBooks: 1050, createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'Riverside High', code: 'RH005', address: '654 River Ln', district: 'East', province: 'Gauteng', contactNumber: '011-555-0105', email: 'info@riverside.edu', principalName: 'Mr. Van der Merwe', totalLearners: 720, totalBooks: 2100, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: 'Oakwood Academy', code: 'OA006', address: '12 Oak Blvd', district: 'West', province: 'Gauteng', contactNumber: '011-555-0106', email: 'info@oakwood.edu', principalName: 'Mrs. Mahlangu', totalLearners: 560, totalBooks: 1400, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', name: 'Northgate Primary', code: 'NP007', address: '88 North Rd', district: 'North', province: 'Gauteng', contactNumber: '011-555-0107', email: 'info@northgate.edu', principalName: 'Mr. Sithole', totalLearners: 410, totalBooks: 980, createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: 'Eastside Secondary', code: 'ES008', address: '45 East St', district: 'East', province: 'Gauteng', contactNumber: '011-555-0108', email: 'info@eastside.edu', principalName: 'Mrs. Botha', totalLearners: 750, totalBooks: 2200, createdAt: new Date(), updatedAt: new Date() },
    { id: '9', name: 'Southfield High', code: 'SH009', address: '99 South Ave', district: 'South', province: 'Gauteng', contactNumber: '011-555-0109', email: 'info@southfield.edu', principalName: 'Mr. Zulu', totalLearners: 620, totalBooks: 1650, createdAt: new Date(), updatedAt: new Date() },
    { id: '10', name: 'Westpark Combined', code: 'WC010', address: '33 West Dr', district: 'West', province: 'Gauteng', contactNumber: '011-555-0110', email: 'info@westpark.edu', principalName: 'Dr. Mthembu', totalLearners: 490, totalBooks: 1300, createdAt: new Date(), updatedAt: new Date() },
    { id: '11', name: 'Kingsway Primary', code: 'KP011', address: '77 Kings Rd', district: 'Central', province: 'Gauteng', contactNumber: '011-555-0111', email: 'info@kingsway.edu', principalName: 'Mrs. Ndlovu', totalLearners: 340, totalBooks: 870, createdAt: new Date(), updatedAt: new Date() },
    { id: '12', name: 'Lakeside Academy', code: 'LA012', address: '55 Lake View', district: 'North', province: 'Gauteng', contactNumber: '011-555-0112', email: 'info@lakeside.edu', principalName: 'Mr. Pretorius', totalLearners: 580, totalBooks: 1550, createdAt: new Date(), updatedAt: new Date() },
    { id: '13', name: 'Mountain View High', code: 'MV013', address: '101 Mountain Rd', district: 'East', province: 'Gauteng', contactNumber: '011-555-0113', email: 'info@mountainview.edu', principalName: 'Mrs. Khumalo', totalLearners: 690, totalBooks: 1900, createdAt: new Date(), updatedAt: new Date() },
    { id: '14', name: 'Pinewood Secondary', code: 'PS014', address: '22 Pine Ln', district: 'South', province: 'Gauteng', contactNumber: '011-555-0114', email: 'info@pinewood.edu', principalName: 'Mr. Govender', totalLearners: 530, totalBooks: 1250, createdAt: new Date(), updatedAt: new Date() },
    { id: '15', name: 'Thornhill Primary', code: 'TP015', address: '66 Thorn St', district: 'West', province: 'Gauteng', contactNumber: '011-555-0115', email: 'info@thornhill.edu', principalName: 'Mrs. Molefe', totalLearners: 420, totalBooks: 1100, createdAt: new Date(), updatedAt: new Date() },
    { id: '16', name: 'Crescent Park High', code: 'CP016', address: '44 Crescent Ave', district: 'Central', province: 'Gauteng', contactNumber: '011-555-0116', email: 'info@crescentpark.edu', principalName: 'Dr. Naidoo', totalLearners: 810, totalBooks: 2400, createdAt: new Date(), updatedAt: new Date() },
    { id: '17', name: 'Willow Glen Combined', code: 'WG017', address: '18 Willow Way', district: 'North', province: 'Gauteng', contactNumber: '011-555-0117', email: 'info@willowglen.edu', principalName: 'Mr. Maseko', totalLearners: 470, totalBooks: 1150, createdAt: new Date(), updatedAt: new Date() },
    { id: '18', name: 'Sunnydale Primary', code: 'SD018', address: '90 Sunny Rd', district: 'East', province: 'Gauteng', contactNumber: '011-555-0118', email: 'info@sunnydale.edu', principalName: 'Mrs. Tshabalala', totalLearners: 360, totalBooks: 920, createdAt: new Date(), updatedAt: new Date() },
  ];

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<School[]> {
    // TODO: Replace with HTTP call
    return of(this.mockSchools);
  }

  getById(id: string): Observable<School | undefined> {
    return of(this.mockSchools.find(s => s.id === id));
  }

  create(school: Partial<School>): Observable<School> {
    const newSchool: School = {
      ...school as School,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockSchools.push(newSchool);
    return of(newSchool);
  }

  update(id: string, school: Partial<School>): Observable<School> {
    const index = this.mockSchools.findIndex(s => s.id === id);
    if (index > -1) {
      this.mockSchools[index] = { ...this.mockSchools[index], ...school, updatedAt: new Date() };
      return of(this.mockSchools[index]);
    }
    return of(school as School);
  }

  delete(id: string): Observable<void> {
    this.mockSchools = this.mockSchools.filter(s => s.id !== id);
    return of(undefined);
  }
}
