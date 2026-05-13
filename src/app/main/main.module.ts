import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';
import { AuthGuard } from '../auth/guards/auth.guard';

// Layout & Sidebar
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from './components/sidebar/sidebar';

// Pages - Dashboard
import { DashboardComponent } from './pages/dashboard/dashboard.component';

// Pages - Schools
import { SchoolListComponent } from './pages/schools/school-list/school-list';
import { SchoolFormComponent } from './pages/schools/school-form/school-form';
import { SchoolDetailComponent } from './pages/schools/school-detail/school-detail';

// Pages - Book Requests
import { RequestListComponent } from './pages/book-requests/request-list/request-list';
import { RequestFormComponent } from './pages/book-requests/request-form/request-form';
import { RequestDetailComponent } from './pages/book-requests/request-detail/request-detail';

// Pages - Inventory
import { InventoryListComponent } from './pages/inventory/inventory-list/inventory-list';
import { InventoryPrintComponent } from './pages/inventory/inventory-print/inventory-print';

// Pages - Books
import { BookListComponent } from './pages/books/book-list/book-list';
import { BookFormComponent } from './pages/books/book-form/book-form';
import { BookAssignComponent } from './pages/books/book-assign/book-assign';

// Pages - Learners
import { LearnerListComponent } from './pages/learners/learner-list/learner-list';
import { LearnerFormComponent } from './pages/learners/learner-form/learner-form';
import { LearnerDetailComponent } from './pages/learners/learner-detail/learner-detail';

// Pages - Parents
import { ParentListComponent } from './pages/parents/parent-list/parent-list';
import { ParentFormComponent } from './pages/parents/parent-form/parent-form';
import { ParentDetailComponent } from './pages/parents/parent-detail/parent-detail';
import { ParentBooksComponent } from './pages/parents/parent-books/parent-books';

// Pages - Teachers
import { TeacherListComponent } from './pages/teachers/teacher-list/teacher-list';
import { TeacherFormComponent } from './pages/teachers/teacher-form/teacher-form';
import { TeacherAssignComponent } from './pages/teachers/teacher-assign/teacher-assign';

// Pages - Reports
import { ReportListComponent } from './pages/reports/report-list/report-list';
import { ReportViewComponent } from './pages/reports/report-view/report-view';

// Pages - AI Suggestions
import { SuggestionDashboardComponent } from './pages/ai-suggestions/suggestion-dashboard/suggestion-dashboard';
import { TransferPlanComponent } from './pages/ai-suggestions/transfer-plan/transfer-plan';
import { BookIssueComponent } from './pages/books/book-issue';
import { IssueConfirmationComponent } from './pages/books/book-issue/issue-confirmation';
import { BookReturnComponent } from './pages/books/book-return';
import { ReturnConfirmationComponent } from './pages/books/book-return/return-confirmation';

const mainRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Schools (DepartmentAdmin)
      { path: 'schools', component: SchoolListComponent },
      { path: 'schools/new', component: SchoolFormComponent },
      { path: 'schools/:id', component: SchoolDetailComponent },
      { path: 'schools/:id/edit', component: SchoolFormComponent },

      // Book Requests (DepartmentAdmin, SchoolAdmin)
      { path: 'book-requests', component: RequestListComponent },
      { path: 'book-requests/new', component: RequestFormComponent },
      { path: 'book-requests/:id', component: RequestDetailComponent },
      { path: 'book-requests/:id/edit', component: RequestFormComponent },

      // Inventory (DepartmentAdmin)
      { path: 'inventory', component: InventoryListComponent },
      { path: 'inventory/print', component: InventoryPrintComponent },

      // AI Suggestions (DepartmentAdmin)
      { path: 'ai-suggestions', component: SuggestionDashboardComponent },
      { path: 'ai-suggestions/transfer/:id', component: TransferPlanComponent },

      // Books (SchoolAdmin, Teacher)
      { path: 'books', component: BookListComponent },
      { path: 'books/new', component: BookFormComponent },
      { path: 'books/:id/edit', component: BookFormComponent },
      { path: 'books/assign', component: BookAssignComponent },
      { path: 'books/issue', component: BookIssueComponent },
      { path: 'books/issue/confirm', component: IssueConfirmationComponent },
      { path: 'books/return', component: BookReturnComponent },
      { path: 'books/return/confirm', component: ReturnConfirmationComponent },

      // Learners (SchoolAdmin, Teacher)
      { path: 'learners', component: LearnerListComponent },
      { path: 'learners/new', component: LearnerFormComponent },
      { path: 'learners/:id', component: LearnerDetailComponent },
      { path: 'learners/:id/edit', component: LearnerFormComponent },

      // Parents (SchoolAdmin)
      { path: 'parents', component: ParentListComponent },
      { path: 'parents/new', component: ParentFormComponent },
      { path: 'parents/books', component: ParentBooksComponent },
      { path: 'parents/:id', component: ParentDetailComponent },
      { path: 'parents/:id/edit', component: ParentFormComponent },

      // Teachers (SchoolAdmin, DepartmentAdmin)
      { path: 'teachers', component: TeacherListComponent },
      { path: 'teachers/new', component: TeacherFormComponent },
      { path: 'teachers/:id/edit', component: TeacherFormComponent },
      { path: 'teachers/assign', component: TeacherAssignComponent },

      // Reports (DepartmentAdmin, SchoolAdmin)
      { path: 'reports', component: ReportListComponent },
      { path: 'reports/:id', component: ReportViewComponent },

      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    DashboardComponent,
    SchoolListComponent,
    SchoolFormComponent,
    SchoolDetailComponent,
    RequestListComponent,
    RequestFormComponent,
    RequestDetailComponent,
    InventoryListComponent,
    InventoryPrintComponent,
    BookListComponent,
    BookFormComponent,
    BookAssignComponent,
    LearnerListComponent,
    LearnerFormComponent,
    LearnerDetailComponent,
    ParentListComponent,
    ParentFormComponent,
    ParentDetailComponent,
    ParentBooksComponent,
    TeacherListComponent,
    TeacherFormComponent,
    TeacherAssignComponent,
    ReportListComponent,
    ReportViewComponent,
    SuggestionDashboardComponent,
    TransferPlanComponent,
    BookIssueComponent,
    IssueConfirmationComponent,
    BookReturnComponent,
    ReturnConfirmationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(mainRoutes),
    ComponentsModule,
  ],
})
export class MainModule {}
