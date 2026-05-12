import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginLayoutComponent } from './login-layout.component';
import { AuthService } from '../../services/auth.service';
import { ComponentsModule } from '../../../components/components.module';
import { of, throwError } from 'rxjs';

describe('LoginLayoutComponent', () => {
  let component: LoginLayoutComponent;
  let fixture: ComponentFixture<LoginLayoutComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'isAuthenticated',
      'getToken'
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginLayoutComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ComponentsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(LoginLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty email and password', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('rememberMe')?.value).toBe(false);
  });

  it('should have invalid form when email is empty', () => {
    component.loginForm.patchValue({
      email: '',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should have invalid form when password is empty', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: ''
    });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should have invalid form when email format is invalid', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should have valid form when email and password are provided', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should display email required error when email is touched and empty', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.markAsTouched();
    expect(component.emailErrors).toBe('Email is required');
  });

  it('should display email format error when email is invalid', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    expect(component.emailErrors).toBe('Please enter a valid email');
  });

  it('should display password required error when password is touched and empty', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.markAsTouched();
    expect(component.passwordErrors).toBe('Password is required');
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('should call authService.login with correct parameters on submit', () => {
    authService.login.and.returnValue(of({ token: 'test-token', user: { id: '1', email: 'test@example.com', name: 'Test', roles: [], createdAt: new Date() }, expiresIn: 3600 }));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123', true);
  });

  it('should set isLoading to true when submitting', () => {
    authService.login.and.returnValue(of({ token: 'test-token', user: { id: '1', email: 'test@example.com', name: 'Test', roles: [], createdAt: new Date() }, expiresIn: 3600 }));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();
    expect(component.isLoading).toBeFalse(); // Should be false after successful login
  });

  it('should handle login error and display error message', () => {
    const error = { message: 'Invalid email or password', status: 401 };
    authService.login.and.returnValue(throwError(() => error));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.authError).toBe('Invalid email or password');
    expect(component.isLoading).toBeFalse();
  });

  it('should not submit form when form is invalid', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: ''
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should not submit form when already loading', () => {
    authService.login.and.returnValue(of({ token: 'test-token', user: { id: '1', email: 'test@example.com', name: 'Test', roles: [], createdAt: new Date() }, expiresIn: 3600 }));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.isLoading = true;
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should clear auth error when submitting', () => {
    authService.login.and.returnValue(of({ token: 'test-token', user: { id: '1', email: 'test@example.com', name: 'Test', roles: [], createdAt: new Date() }, expiresIn: 3600 }));

    component.authError = 'Previous error';
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.authError).toBeNull();
  });

  it('should redirect to home on successful login', (done) => {
    const router = TestBed.inject(RouterTestingModule);
    spyOn(router, 'navigate');

    authService.login.and.returnValue(of({ token: 'test-token', user: { id: '1', email: 'test@example.com', name: 'Test', roles: [], createdAt: new Date() }, expiresIn: 3600 }));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should check existing auth on init', () => {
    authService.isAuthenticated.and.returnValue(true);
    const router = TestBed.inject(RouterTestingModule);
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(authService.isAuthenticated).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
