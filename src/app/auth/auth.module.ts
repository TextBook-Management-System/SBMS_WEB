import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ComponentsModule } from '../components/components.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

// Layout components
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { ResetPasswordLayoutComponent } from './layouts/reset-password-layout/reset-password-layout.component';

const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginLayoutComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordLayoutComponent
      },
      {
        path:'',
        redirectTo:"login",
        pathMatch:"full"
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
    AuthGuard
  ]
})
export class AuthModule { }
