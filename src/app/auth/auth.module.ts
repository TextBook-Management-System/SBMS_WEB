import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ComponentsModule } from '../components/components.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Layout components
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { ResetPasswordLayoutComponent } from './layouts/reset-password-layout/reset-password-layout.component';

const authRoutes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: LoginLayoutComponent
      }
    ]
  },
  {
    path: 'reset-password',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: ResetPasswordLayoutComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginLayoutComponent,
    ResetPasswordLayoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(authRoutes),
    ComponentsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule { }
