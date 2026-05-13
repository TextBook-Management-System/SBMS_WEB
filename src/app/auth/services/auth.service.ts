import {
  Injectable,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  throwError,
  of
} from 'rxjs';

import {
  tap,
  catchError,
  switchMap
} from 'rxjs/operators';

import {
  User,
  UserWithRoles
} from '../models/user.model';

import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest
} from '../models/auth-request.model';

import {
  TokenResponse,
  AccessTokenResponse
} from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_URL =
    'https://sbms-engine.vercel.app/api/v1';

  private readonly API_URL =
    `${this.BASE_URL}/auth`;

  private readonly ACCESS_TOKEN_KEY =
    'access_token';

  private readonly REFRESH_TOKEN_KEY =
    'refresh_token';

  private readonly USER_KEY =
    'current_user';

  private readonly isBrowser: boolean;

  private readonly currentUserSubject =
    new BehaviorSubject<UserWithRoles | null>(null);

  private readonly isAuthenticatedSubject =
    new BehaviorSubject<boolean>(false);

  public readonly currentUser$ =
    this.currentUserSubject.asObservable();

  public readonly isAuthenticated$ =
    this.isAuthenticatedSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {

    this.isBrowser =
      isPlatformBrowser(platformId);

    this.initializeAuth();
  }

  login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Observable<TokenResponse> {

    const request: LoginRequest = {
      email,
      password
    };

    return this.http
      .post<TokenResponse>(
        `${this.API_URL}/login`,
        request
      )
      .pipe(

        tap((response) => {

          this.storeTokens(
            response,
            rememberMe
          );

          this.isAuthenticatedSubject.next(true);
        }),

        switchMap((response) => {

          return this.http
            .get<UserWithRoles>(
              `${this.API_URL}/me`
            )
            .pipe(

              tap((user) =>
                this.setCurrentUser(user)
              ),

              catchError(() => of(null)),

              switchMap(() => of(response))
            );
        }),

        catchError((error) =>
          this.handleAuthError(error)
        )
      );
  }

  register(
    request: RegisterRequest
  ): Observable<User> {

    return this.http
      .post<User>(
        `${this.API_URL}/register`,
        request
      )
      .pipe(
        catchError((error) =>
          this.handleAuthError(error)
        )
      );
  }

  refreshToken(): Observable<AccessTokenResponse> {

    const refreshToken =
      this.getRefreshToken();

    if (!refreshToken) {

      return throwError(() =>
        new Error(
          'No refresh token available'
        )
      );
    }

    const request: RefreshTokenRequest = {
      refresh_token: refreshToken
    };

    return this.http
      .post<AccessTokenResponse>(
        `${this.API_URL}/refresh`,
        request
      )
      .pipe(

        tap((response) => {

          this.storeAccessToken(
            response.access_token
          );

          this.isAuthenticatedSubject.next(true);
        }),

        catchError((error) => {

          this.logout();

          return throwError(() => error);
        })
      );
  }

  logoutFromServer(): Observable<any> {

    return this.http
      .post(
        `${this.API_URL}/logout`,
        {}
      )
      .pipe(

        tap(() => this.clearSession()),

        catchError(() => {

          this.clearSession();

          return throwError(() =>
            new Error('Logout failed')
          );
        })
      );
  }

  logout(): void {
    this.clearSession();
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  getToken(): string | null {
    return this.getAccessToken();
  }

  getAccessToken(): string | null {

    if (!this.isBrowser) {
      return null;
    }

    return (
      localStorage.getItem(
        this.ACCESS_TOKEN_KEY
      ) ||
      sessionStorage.getItem(
        this.ACCESS_TOKEN_KEY
      )
    );
  }

  getRefreshToken(): string | null {

    if (!this.isBrowser) {
      return null;
    }

    return (
      localStorage.getItem(
        this.REFRESH_TOKEN_KEY
      ) ||
      sessionStorage.getItem(
        this.REFRESH_TOKEN_KEY
      )
    );
  }

  getCurrentUser():
    | UserWithRoles
    | null {

    return this.currentUserSubject.value;
  }

  loadCurrentUser(): void {

    if (!this.getAccessToken()) {
      return;
    }

    this.http
      .get<UserWithRoles>(
        `${this.API_URL}/me`
      )
      .subscribe({

        next: (user) => {
          this.setCurrentUser(user);
        },

        error: (err) => {
          console.error(
            'Failed to load user',
            err
          );
        }
      });
  }

  private setCurrentUser(
    user: UserWithRoles
  ): void {

    this.currentUserSubject.next(user);

    if (this.isBrowser) {

      localStorage.setItem(
        this.USER_KEY,
        JSON.stringify(user)
      );
    }
  }

  private getCachedUser():
    | UserWithRoles
    | null {

    if (!this.isBrowser) {
      return null;
    }

    const cached =
      localStorage.getItem(
        this.USER_KEY
      );

    if (cached) {

      try {

        return JSON.parse(cached);

      } catch {

        return null;
      }
    }

    return null;
  }

  private storeTokens(
    response: TokenResponse,
    rememberMe: boolean
  ): void {

    if (!this.isBrowser) {
      return;
    }

    const storage =
      rememberMe
        ? localStorage
        : sessionStorage;

    storage.setItem(
      this.ACCESS_TOKEN_KEY,
      response.access_token
    );

    storage.setItem(
      this.REFRESH_TOKEN_KEY,
      response.refresh_token
    );
  }

  private storeAccessToken(
    token: string
  ): void {

    if (!this.isBrowser) {
      return;
    }

    if (
      localStorage.getItem(
        this.ACCESS_TOKEN_KEY
      )
    ) {

      localStorage.setItem(
        this.ACCESS_TOKEN_KEY,
        token
      );

    } else {

      sessionStorage.setItem(
        this.ACCESS_TOKEN_KEY,
        token
      );
    }
  }

  private clearSession(): void {

    if (this.isBrowser) {

      localStorage.removeItem(
        this.ACCESS_TOKEN_KEY
      );

      localStorage.removeItem(
        this.REFRESH_TOKEN_KEY
      );

      localStorage.removeItem(
        this.USER_KEY
      );

      sessionStorage.removeItem(
        this.ACCESS_TOKEN_KEY
      );

      sessionStorage.removeItem(
        this.REFRESH_TOKEN_KEY
      );
    }

    this.currentUserSubject.next(null);

    this.isAuthenticatedSubject.next(false);
  }

  clearToken(): void {
    this.clearSession();
  }

  private handleAuthError(
    error: any
  ): Observable<never> {

    let errorMessage =
      'An error occurred. Please try again later.';

    const status =
      error?.status || 0;

    if (status === 401) {

      errorMessage =
        error?.error?.detail ||
        'Invalid email or password';

    } else if (status === 409) {

      errorMessage =
        error?.error?.detail ||
        'A user with this email already exists';

    } else if (status === 422) {

      const detail =
        error?.error?.detail;

      if (
        Array.isArray(detail) &&
        detail.length > 0
      ) {

        errorMessage = detail
          .map((d: any) => d.msg)
          .join('. ');

      } else if (
        typeof detail === 'string'
      ) {

        errorMessage = detail;

      } else {

        errorMessage =
          'Please check your input and try again.';
      }

    } else if (
      status === 0 ||
      status === 504
    ) {

      errorMessage =
        'Unable to connect. Please try again.';

    } else if (status >= 500) {

      errorMessage =
        'Server error. Please try again later.';
    }

    return throwError(() => ({
      status,
      message: errorMessage
    }));
  }

  private initializeAuth(): void {

    if (!this.isBrowser) {
      return;
    }

    const token =
      this.getAccessToken();

    if (token) {

      this.isAuthenticatedSubject.next(true);

      /**
       * Restore cached user instantly
       */
      const cachedUser =
        this.getCachedUser();

      if (cachedUser) {

        this.currentUserSubject.next(
          cachedUser
        );
      }

      /**
       * Delay user refresh slightly
       * to avoid Angular hydration race
       */
      setTimeout(() => {
        this.loadCurrentUser();
      });
    }
  }
}