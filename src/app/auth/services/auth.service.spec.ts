import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth-response.model';
import * as fc from 'fast-check';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Token Storage', () => {
    it('should store token in localStorage when rememberMe is true', () => {
      const mockResponse: AuthResponse = {
        token: 'test-token-123',
        user: { id: '1', email: 'test@example.com', name: 'Test User', roles: [], createdAt: new Date() },
        expiresIn: 3600
      };

      service.login('test@example.com', 'password', true).subscribe();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      expect(localStorage.getItem('auth_token')).toBe('test-token-123');
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });

    it('should store token in sessionStorage when rememberMe is false', () => {
      const mockResponse: AuthResponse = {
        token: 'test-token-456',
        user: { id: '1', email: 'test@example.com', name: 'Test User', roles: [], createdAt: new Date() },
        expiresIn: 3600
      };

      service.login('test@example.com', 'password', false).subscribe();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      expect(sessionStorage.getItem('auth_token')).toBe('test-token-456');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should retrieve token from localStorage using getToken', () => {
      localStorage.setItem('auth_token', 'local-token');
      
      const token = service.getToken();
      
      expect(token).toBe('local-token');
    });

    it('should retrieve token from sessionStorage using getToken', () => {
      sessionStorage.setItem('auth_token', 'session-token');
      
      const token = service.getToken();
      
      expect(token).toBe('session-token');
    });

    it('should prioritize localStorage over sessionStorage in getToken', () => {
      localStorage.setItem('auth_token', 'local-token');
      sessionStorage.setItem('auth_token', 'session-token');
      
      const token = service.getToken();
      
      expect(token).toBe('local-token');
    });

    it('should return null when no token exists', () => {
      const token = service.getToken();
      
      expect(token).toBeNull();
    });

    it('should clear token from both storages using clearToken', () => {
      localStorage.setItem('auth_token', 'local-token');
      sessionStorage.setItem('auth_token', 'session-token');
      
      service.clearToken();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });

    it('should clear token from localStorage only', () => {
      localStorage.setItem('auth_token', 'local-token');
      
      service.clearToken();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should clear token from sessionStorage only', () => {
      sessionStorage.setItem('auth_token', 'session-token');
      
      service.clearToken();
      
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should clear token from storage', () => {
      localStorage.setItem('auth_token', 'test-token');
      
      service.logout();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });

    it('should reset currentUser$ to null', (done) => {
      // First set a user
      const mockResponse: AuthResponse = {
        token: 'test-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User', roles: [], createdAt: new Date() },
        expiresIn: 3600
      };

      service.login('test@example.com', 'password', false).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      // Now logout and verify currentUser$ emits null
      service.logout();
      
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });

    it('should reset isAuthenticated$ to false', (done) => {
      // First authenticate
      const mockResponse: AuthResponse = {
        token: 'test-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User', roles: [], createdAt: new Date() },
        expiresIn: 3600
      };

      service.login('test@example.com', 'password', false).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      // Now logout and verify isAuthenticated$ emits false
      service.logout();
      
      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(false);
        done();
      });
    });

    it('should clear all authentication state', (done) => {
      // First authenticate
      const mockResponse: AuthResponse = {
        token: 'test-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User', roles: [], createdAt: new Date() },
        expiresIn: 3600
      };

      service.login('test@example.com', 'password', true).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);

      // Verify authenticated state
      expect(localStorage.getItem('auth_token')).toBe('test-token');

      // Logout
      service.logout();

      // Verify all state is cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('auth_token')).toBeNull();
      
      let userChecked = false;
      let authChecked = false;
      
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        userChecked = true;
        if (userChecked && authChecked) done();
      });
      
      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(false);
        authChecked = true;
        if (userChecked && authChecked) done();
      });
    });
  });

  describe('Property-Based Tests', () => {
    describe('Property 4: Token Storage Based on Remember Me', () => {
      /**
       * **Validates: Requirements 8.2, 8.3**
       * 
       * Property: For any authentication token and rememberMe boolean value,
       * the AuthService SHALL store the token in localStorage when rememberMe is true
       * and in sessionStorage when rememberMe is false.
       */
      it('should store tokens in correct storage based on rememberMe flag', () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 1 }), // Generate random token strings
            fc.boolean(), // Generate random rememberMe values
            (token, rememberMe) => {
              // Clear storage before each property test iteration
              localStorage.clear();
              sessionStorage.clear();

              // Create mock response with the generated token
              const mockResponse: AuthResponse = {
                token: token,
                user: { 
                  id: '1', 
                  email: 'test@example.com', 
                  name: 'Test User', 
                  roles: [], 
                  createdAt: new Date() 
                },
                expiresIn: 3600
              };

              // Call login with the rememberMe flag
              service.login('test@example.com', 'password', rememberMe).subscribe();

              // Flush the HTTP request
              const req = httpMock.expectOne('/api/auth/login');
              req.flush(mockResponse);

              // Verify token is stored in the correct location
              if (rememberMe) {
                // When rememberMe is true, token should be in localStorage
                expect(localStorage.getItem('auth_token')).toBe(token);
                expect(sessionStorage.getItem('auth_token')).toBeNull();
              } else {
                // When rememberMe is false, token should be in sessionStorage
                expect(sessionStorage.getItem('auth_token')).toBe(token);
                expect(localStorage.getItem('auth_token')).toBeNull();
              }

              // Clean up for next iteration
              localStorage.clear();
              sessionStorage.clear();
            }
          ),
          { numRuns: 100 } // Run 100 iterations with random inputs
        );
      });

      it('should store tokens in localStorage for any token when rememberMe is true', () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 1 }),
            (token) => {
              localStorage.clear();
              sessionStorage.clear();

              const mockResponse: AuthResponse = {
                token: token,
                user: { 
                  id: '1', 
                  email: 'test@example.com', 
                  name: 'Test User', 
                  roles: [], 
                  createdAt: new Date() 
                },
                expiresIn: 3600
              };

              service.login('test@example.com', 'password', true).subscribe();

              const req = httpMock.expectOne('/api/auth/login');
              req.flush(mockResponse);

              expect(localStorage.getItem('auth_token')).toBe(token);
              expect(sessionStorage.getItem('auth_token')).toBeNull();

              localStorage.clear();
              sessionStorage.clear();
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should store tokens in sessionStorage for any token when rememberMe is false', () => {
        fc.assert(
          fc.property(
            fc.string({ minLength: 1 }),
            (token) => {
              localStorage.clear();
              sessionStorage.clear();

              const mockResponse: AuthResponse = {
                token: token,
                user: { 
                  id: '1', 
                  email: 'test@example.com', 
                  name: 'Test User', 
                  roles: [], 
                  createdAt: new Date() 
                },
                expiresIn: 3600
              };

              service.login('test@example.com', 'password', false).subscribe();

              const req = httpMock.expectOne('/api/auth/login');
              req.flush(mockResponse);

              expect(sessionStorage.getItem('auth_token')).toBe(token);
              expect(localStorage.getItem('auth_token')).toBeNull();

              localStorage.clear();
              sessionStorage.clear();
            }
          ),
          { numRuns: 100 }
        );
      });
    });
  });
});
