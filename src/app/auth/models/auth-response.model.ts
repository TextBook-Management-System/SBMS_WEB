import { User } from './user.model';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
}

// Keep backward compat alias
export type AuthResponse = TokenResponse;
