import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.initializeAuth();
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<AuthResponse> {
    const request: AuthRequest = { email, password };
    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        this.storeToken(response.token, rememberMe);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  private storeToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  logout(): void {
    this.clearToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again later.';
    
    if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.status === 0 || error.status === 504) {
      errorMessage = 'Unable to connect. Please try again.';
    } else if (error.status >= 500) {
      errorMessage = 'An error occurred. Please try again later.';
    }
    
    console.error('Authentication error:', error);
    return throwError(() => ({ ...error, message: errorMessage }));
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      this.validateToken(token).subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          this.clearToken();
          this.isAuthenticatedSubject.next(false);
        }
      });
    }
  }

  private validateToken(token: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/validate`);
  }
}
