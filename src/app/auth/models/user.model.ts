export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  department_id: number | null;
  school_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithRoles extends User {
  roles: UserRole[];
}

export interface UserRole {
  id: number;
  user_id: number;
  role: RoleName;
}

export type RoleName = 'DeptAdmin' | 'SchoolAdmin' | 'Teacher' | 'Parent';
