import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ComponentsModule } from '../components/components.module';
import { AuthGuard } from '../auth/guards/auth.guard';

// Layout components
import { MainLayoutComponent } from './main-layout/main-layout.component';

// Page components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';

const mainRoutes: Routes = [
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
  {
    path: 'home',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    MainLayoutComponent,
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes),
    ComponentsModule
  ]
})
export class MainModule { }
