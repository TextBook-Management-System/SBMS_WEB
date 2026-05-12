export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  staffNumber: string;
  schoolId: string;
  assignments: TeacherAssignment[];
  userId?: string; // linked auth user account
  createdAt: Date;
  updatedAt: Date;
}

export interface TeacherAssignment {
  gradeId: string;
  subjectId: string;
}
