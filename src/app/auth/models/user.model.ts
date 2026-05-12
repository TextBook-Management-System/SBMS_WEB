export interface User {
  id: number;
  email: string;
  full_name: string;
  id_number: string | null;
  gender: string | null;
  date_of_birth: string | null;
  is_active: boolean;
  role: string;
  department_id: number | null;
  school_id: number | null;
  created_at: string;
  updated_at: string;
}

// Keep for backward compat — UserWithRoles is now just User since /me returns role directly
export type UserWithRoles = User;

export interface UserRole {
  id: number;
  user_id: number;
  role: RoleName;
}

export type RoleName = 'DeptAdmin' | 'SchoolAdmin' | 'Teacher' | 'Parent';
