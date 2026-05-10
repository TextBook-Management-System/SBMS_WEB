import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  standalone: false,
  templateUrl: './teacher-list.html',
  styleUrls: ['./teacher-list.css']
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  paginatedTeachers: Teacher[] = [];
  searchTerm = '';
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private readonly teacherService: TeacherService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.teacherService.getAll().subscribe(teachers => {
      this.teachers = teachers;
      this.filteredTeachers = teachers;
      this.updatePagination();
      this.isLoading = false;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.filteredTeachers = this.teachers.filter(t =>
      t.firstName.toLowerCase().includes(term.toLowerCase()) ||
      t.lastName.toLowerCase().includes(term.toLowerCase()) ||
      t.email.toLowerCase().includes(term.toLowerCase()) ||
      t.staffNumber.toLowerCase().includes(term.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedTeachers = this.filteredTeachers.slice(start, start + this.pageSize);
  }

  editTeacher(id: string): void {
    this.router.navigate(['/app/teachers', id, 'edit']);
  }

  addTeacher(): void {
    this.router.navigate(['/app/teachers/new']);
  }

  assignTeacher(): void {
    this.router.navigate(['/app/teachers/assign']);
  }

  deleteTeacher(id: string): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.delete(id).subscribe(() => this.loadTeachers());
    }
  }

  getSubjects(teacher: Teacher): string {
    return [...new Set(teacher.assignments.map(a => a.subjectId))].join(', ');
  }
}
