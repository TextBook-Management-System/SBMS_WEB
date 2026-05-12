import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password-layout',
  standalone: false,
  template: `
    <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
      <app-input
        id="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        formControlName="email"
        [hasError]="!!emailErrors"
        [errorMessage]="emailErrors || undefined"
        [required]="true">
      </app-input>

      <app-form-error 
        *ngIf="resetError"
        [message]="resetError">
      </app-form-error>

      <app-button
        type="submit"
        variant="primary"
        [disabled]="!resetForm.valid"
        [loading]="isLoading">
        Send Reset Link
      </app-button>

      <div class="auth-links">
        <a routerLink="/auth/login">Back to Login</a>
      </div>
    </form>
  `,
  styleUrls: ['./reset-password-layout.component.css']
})
export class ResetPasswordLayoutComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  resetError: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.resetForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.resetError = null;
      // Placeholder implementation for reset password logic
      console.log('Reset password for:', this.resetForm.value.email);
      setTimeout(() => {
        this.isLoading = false;
        this.resetError = 'Reset password functionality not yet implemented';
      }, 1000);
    }
  }

  get emailErrors(): string | null {
    const control = this.resetForm.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'Email is required';
      if (control.errors?.['email']) return 'Please enter a valid email';
    }
    return null;
  }
}
