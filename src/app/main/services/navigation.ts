import { Injectable } from '@angular/core';
import { NavItem } from '../models/nav-item.model';
import { UserRole } from '../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/app/dashboard',
      roles: [UserRole.DepartmentAdmin, UserRole.SchoolAdmin, UserRole.Teacher, UserRole.Parent]
    },
    {
      label: 'Schools',
      icon: 'pi pi-building',
      route: '/app/schools',
      roles: [UserRole.DepartmentAdmin]
    },
    {
      label: 'Book Requests',
      icon: 'pi pi-inbox',
      route: '/app/book-requests',
      roles: [UserRole.DepartmentAdmin, UserRole.SchoolAdmin]
    },
    {
      label: 'Inventory',
      icon: 'pi pi-box',
      route: '/app/inventory',
      roles: [UserRole.DepartmentAdmin]
    },
    {
      label: 'AI Suggestions',
      icon: 'pi pi-sparkles',
      route: '/app/ai-suggestions',
      roles: [UserRole.DepartmentAdmin]
    },
    {
      label: 'Book Packages',
      icon: 'pi pi-send',
      route: '/app/packages',
      roles: [UserRole.DepartmentAdmin, UserRole.SchoolAdmin]
    },
    {
      label: 'Books',
      icon: 'pi pi-book',
      route: '/app/books',
      roles: [UserRole.SchoolAdmin, UserRole.Teacher]
    },
    {
      label: 'Issue Book',
      icon: 'pi pi-upload',
      route: '/app/books/issue',
      roles: [UserRole.SchoolAdmin, UserRole.Teacher]
    },
    {
      label: 'Return Book',
      icon: 'pi pi-download',
      route: '/app/books/return',
      roles: [UserRole.SchoolAdmin, UserRole.Teacher]
    },
    {
      label: 'Learners',
      icon: 'pi pi-users',
      route: '/app/learners',
      roles: [UserRole.SchoolAdmin, UserRole.Teacher]
    },
    {
      label: 'Parents',
      icon: 'pi pi-user-plus',
      route: '/app/parents',
      roles: [UserRole.SchoolAdmin]
    },
    {
      label: 'Children\'s Books',
      icon: 'pi pi-book',
      route: '/app/parents/books',
      roles: [UserRole.Parent]
    },
    {
      label: 'Teachers',
      icon: 'pi pi-id-card',
      route: '/app/teachers',
      roles: [UserRole.SchoolAdmin, UserRole.DepartmentAdmin]
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      route: '/app/reports',
      roles: [UserRole.DepartmentAdmin, UserRole.SchoolAdmin]
    }
  ];

  getNavItemsForRole(role: UserRole): NavItem[] {
    return this.navItems.filter(item => item.roles.includes(role));
  }

  getAllNavItems(): NavItem[] {
    return this.navItems;
  }
}
