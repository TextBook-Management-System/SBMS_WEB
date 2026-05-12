import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ComponentsModule } from '../components/components.module';

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
    // AuthService and AuthGuard are providedIn: 'root' — do NOT re-provide here
    // or it creates a separate instance for this lazy-loaded module
  ]
})
export class AuthModule { }
