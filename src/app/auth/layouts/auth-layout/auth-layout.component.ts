import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css'],
  standalone: false
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  title = '';
  subtitle = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.updateTitle();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.updateTitle());
  }

  private updateTitle(): void {
    const url = this.router.url;
    if (url.includes('login')) {
      this.title = 'Welcome back';
      this.subtitle = 'Enter your credentials to access your account';
    } else if (url.includes('reset-password')) {
      this.title = 'Reset password';
      this.subtitle = 'Enter your email and we\'ll send you a reset link';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
