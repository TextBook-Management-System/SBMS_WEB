import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation';
import { NavItem } from '../../models/nav-item.model';
import { UserRole } from '../../models/role.enum';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [];
  activeRoute = '';
  currentUser: string = '';
  currentUserRole: string = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly navigationService: NavigationService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Default nav items until user loads
    this.navItems = this.navigationService.getNavItemsForRole(UserRole.SchoolAdmin);

    this.activeRoute = this.router.url;
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.activeRoute = event.urlAfterRedirects || event.url;
      });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user?.full_name || 'User';
        this.currentUserRole = this.formatRole(user?.roles?.[0]?.role);
        console.log(user)
        // Update nav items based on actual user role
        const role = this.mapApiRoleToUserRole(user?.roles?.[0]?.role);
        this.navItems = this.navigationService.getNavItemsForRole(role);
      });
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private formatRole(role: string | undefined): string {
    if (!role) return 'User';
    const roleMap: Record<string, string> = {
      'DeptAdmin': 'Department Admin',
      'SchoolAdmin': 'School Admin',
      'Teacher': 'Teacher',
      'Parent': 'Parent'
    };
    return roleMap[role] || role;
  }

  private mapApiRoleToUserRole(role: string | undefined): UserRole {
    switch (role) {
      case 'DeptAdmin': return UserRole.DepartmentAdmin;
      case 'SchoolAdmin': return UserRole.SchoolAdmin;
      case 'Teacher': return UserRole.Teacher;
      case 'Parent': return UserRole.Parent;
      default: return UserRole.SchoolAdmin;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
