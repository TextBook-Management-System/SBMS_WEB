import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolService } from '../../../services/school';
import { School } from '../../../models/school.model';

@Component({
  selector: 'app-school-list',
  standalone: false,
  templateUrl: './school-list.html',
  styleUrls: ['./school-list.css']
})
export class SchoolListComponent implements OnInit {
  schools: School[] = [];
  filteredSchools: School[] = [];
  paginatedSchools: School[] = [];
  searchTerm = '';
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private readonly schoolService: SchoolService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.isLoading = true;
    this.schoolService.getAll().subscribe(schools => {
      this.schools = schools;
      this.filteredSchools = schools;
      this.updatePagination();
      this.isLoading = false;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.filteredSchools = this.schools.filter(s =>
      s.name.toLowerCase().includes(term.toLowerCase()) ||
      s.code.toLowerCase().includes(term.toLowerCase()) ||
      s.district.toLowerCase().includes(term.toLowerCase())
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
    this.paginatedSchools = this.filteredSchools.slice(start, start + this.pageSize);
  }

  viewSchool(id: string): void {
    this.router.navigate(['/app/schools', id]);
  }

  editSchool(id: string): void {
    this.router.navigate(['/app/schools', id, 'edit']);
  }

  deleteSchool(id: string): void {
    if (confirm('Are you sure you want to delete this school?')) {
      this.schoolService.delete(id).subscribe(() => this.loadSchools());
    }
  }

  addSchool(): void {
    this.router.navigate(['/app/schools/new']);
  }
}
