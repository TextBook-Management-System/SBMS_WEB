import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Teacher, TeacherAssignment } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private mockTeachers: Teacher[] = [
    { id: '1', firstName: 'Sarah', lastName: 'Botha', email: 'sarah.botha@greenfield.edu', phone: '082-555-1001', staffNumber: 'STF001', schoolId: '1', assignments: [{ gradeId: 'grade-4', subjectId: 'math' }, { gradeId: 'grade-5', subjectId: 'math' }], createdAt: new Date(), updatedAt: new Date() },
    { id: '2', firstName: 'James', lastName: 'Mthembu', email: 'james.mthembu@sunrise.edu', phone: '083-555-1002', staffNumber: 'STF002', schoolId: '2', assignments: [{ gradeId: 'grade-8', subjectId: 'english' }, { gradeId: 'grade-9', subjectId: 'english' }], createdAt: new Date(), updatedAt: new Date() },
    { id: '3', firstName: 'Fatima', lastName: 'Patel', email: 'fatima.patel@hillcrest.edu', phone: '084-555-1003', staffNumber: 'STF003', schoolId: '3', assignments: [{ gradeId: 'grade-6', subjectId: 'science' }], createdAt: new Date(), updatedAt: new Date() },
    { id: '4', firstName: 'Willem', lastName: 'Pretorius', email: 'willem.p@valleyview.edu', phone: '085-555-1004', staffNumber: 'STF004', schoolId: '4', assignments: [{ gradeId: 'grade-5', subjectId: 'history' }, { gradeId: 'grade-6', subjectId: 'history' }], createdAt: new Date(), updatedAt: new Date() },
    { id: '5', firstName: 'Lindiwe', lastName: 'Zulu', email: 'lindiwe.zulu@riverside.edu', phone: '086-555-1005', staffNumber: 'STF005', schoolId: '5', assignments: [{ gradeId: 'grade-10', subjectId: 'math' }, { gradeId: 'grade-11', subjectId: 'math' }], createdAt: new Date(), updatedAt: new Date() },
  ];

  getAll(): Observable<Teacher[]> {
    return of(this.mockTeachers);
  }

  getById(id: string): Observable<Teacher | undefined> {
    return of(this.mockTeachers.find(t => t.id === id));
  }

  getBySchool(schoolId: string): Observable<Teacher[]> {
    return of(this.mockTeachers.filter(t => t.schoolId === schoolId));
  }

  create(teacher: Partial<Teacher>): Observable<Teacher> {
    const newTeacher: Teacher = {
      ...teacher as Teacher,
      id: Date.now().toString(),
      assignments: teacher.assignments || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTeachers.push(newTeacher);
    return of(newTeacher);
  }

  update(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    const index = this.mockTeachers.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTeachers[index] = { ...this.mockTeachers[index], ...teacher, updatedAt: new Date() };
      return of(this.mockTeachers[index]);
    }
    return of(teacher as Teacher);
  }

  assignSubjects(id: string, assignments: TeacherAssignment[]): Observable<Teacher> {
    return this.update(id, { assignments });
  }

  delete(id: string): Observable<void> {
    this.mockTeachers = this.mockTeachers.filter(t => t.id !== id);
    return of(undefined);
  }
}
