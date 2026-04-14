import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css'],
  standalone: false
})
export class LoginLayoutComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  passwordVisible = false;
  authError: string | null = null;
  showRememberMe = true;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.checkExistingAuth();
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.authError = null;

      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login(email, password, rememberMe)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.handleLoginSuccess(),
          error: (error) => this.handleLoginError(error)
        });
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  get emailErrors(): string | null {
    const control = this.loginForm.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'Email is required';
      if (control.errors?.['email']) return 'Please enter a valid email';
    }
    return null;
  }

  get passwordErrors(): string | null {
    const control = this.loginForm.get('password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'Password is required';
    }
    return null;
  }

  private handleLoginSuccess(): void {
    this.isLoading = false;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigate([returnUrl]);
  }

  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.authError = error.message || 'An error occurred. Please try again later.';
  }

  private checkExistingAuth(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
