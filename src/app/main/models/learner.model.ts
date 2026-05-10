export interface Learner {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  gradeId: string;
  schoolId: string;
  parentId?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  createdAt: Date;
  updatedAt: Date;
}
