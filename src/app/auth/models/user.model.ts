export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  schoolId?: string;
  createdAt: Date;
}
