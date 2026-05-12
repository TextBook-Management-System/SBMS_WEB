export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  department_id?: number | null;
  school_id?: number | null;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Keep backward compat alias
export type AuthRequest = LoginRequest;
