import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { User, UserWithRoles } from '../../auth/models/user.model';

interface PageMeta {
  title: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  currentUser: UserWithRoles | null = null;
  sidebarCollapsed = false;
  pageTitle = 'Dashboard';
  pageIcon = 'pi pi-home';
  pageDescription = 'Overview of your system';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.currentUser = user);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.updatePageMeta());

    this.updatePageMeta();
  }

  toggleMobileSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private updatePageMeta(): void {
    const url = this.router.url;
    const metaMap: Record<string, PageMeta> = {
      '/app/dashboard': { title: 'Dashboard', icon: 'pi pi-home', description: 'System overview and key metrics' },
      '/app/schools': { title: 'Schools', icon: 'pi pi-building', description: 'Manage district schools' },
      '/app/book-requests': { title: 'Book Requests', icon: 'pi pi-inbox', description: 'Review and manage requests' },
      '/app/inventory': { title: 'Inventory', icon: 'pi pi-box', description: 'Book stock levels by school' },
      '/app/ai-suggestions': { title: 'AI Suggestions', icon: 'pi pi-sparkles', description: 'Smart transfer recommendations' },
      '/app/books': { title: 'Books', icon: 'pi pi-book', description: 'Manage textbook records' },
      '/app/learners': { title: 'Learners', icon: 'pi pi-users', description: 'Manage learner records' },
      '/app/parents': { title: 'Parents', icon: 'pi pi-user-plus', description: 'Parent/guardian management' },
      '/app/teachers': { title: 'Teachers', icon: 'pi pi-id-card', description: 'Teacher records and assignments' },
      '/app/reports': { title: 'Reports', icon: 'pi pi-chart-bar', description: 'Generate and export reports' }
    };

    for (const [path, meta] of Object.entries(metaMap)) {
      if (url.startsWith(path)) {
        this.pageTitle = meta.title;
        this.pageIcon = meta.icon;
        this.pageDescription = meta.description;
        return;
      }
    }
    this.pageTitle = 'Dashboard';
    this.pageIcon = 'pi pi-home';
    this.pageDescription = 'System overview and key metrics';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
