import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  throwError,
  BehaviorSubject
} from 'rxjs';

import {
  catchError,
  filter,
  take,
  switchMap
} from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private readonly refreshTokenSubject =
    new BehaviorSubject<string | null>(null);

  constructor(
    private readonly authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    /**
     * NEVER attach token to auth endpoints
     */
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req);
    }

    const token = this.authService.getAccessToken();

    let authReq = req;

    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        /**
         * Handle unauthorized errors
         */
        if (
          error.status === 401 &&
          !req.url.includes('/auth/refresh')
        ) {
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    /**
     * First request triggers refresh
     */
    if (!this.isRefreshing) {

      this.isRefreshing = true;

      this.refreshTokenSubject.next(null);

      const refreshToken =
        this.authService.getRefreshToken();

      if (!refreshToken) {

        this.isRefreshing = false;

        this.authService.logout();

        return throwError(() =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'No refresh token'
          })
        );
      }

      return this.authService.refreshToken().pipe(

        switchMap((response) => {

          this.isRefreshing = false;

          this.refreshTokenSubject.next(
            response.access_token
          );

          /**
           * Retry original request
           */
          return next.handle(
            this.addTokenHeader(
              request,
              response.access_token
            )
          );
        }),

        catchError((err) => {

          this.isRefreshing = false;

          this.authService.logout();

          return throwError(() => err);
        })
      );
    }

    /**
     * Queue requests while refreshing
     */
    return this.refreshTokenSubject.pipe(

      filter((token) => token !== null),

      take(1),

      switchMap((token) =>
        next.handle(
          this.addTokenHeader(
            request,
            token!
          )
        )
      )
    );
  }

  private addTokenHeader(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private isAuthEndpoint(url: string): boolean {

    return (
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh')
    );
  }
}