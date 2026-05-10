import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearnerService } from '../../../services/learner';
import { Learner } from '../../../models/learner.model';

@Component({
  selector: 'app-learner-list',
  standalone: false,
  templateUrl: './learner-list.html',
  styleUrls: ['./learner-list.css']
})
export class LearnerListComponent implements OnInit {
  learners: Learner[] = [];
  filteredLearners: Learner[] = [];
  paginatedLearners: Learner[] = [];
  searchTerm = '';
  selectedGrade = '';
  grades: string[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private readonly learnerService: LearnerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadLearners();
  }

  loadLearners(): void {
    this.isLoading = true;
    this.learnerService.getAll().subscribe(learners => {
      this.learners = learners;
      this.grades = [...new Set(learners.map(l => l.gradeId))].sort();
      this.applyFilters();
      this.isLoading = false;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilters();
  }

  onGradeFilter(grade: string): void {
    this.selectedGrade = grade;
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.learners;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(l =>
        l.firstName.toLowerCase().includes(term) ||
        l.lastName.toLowerCase().includes(term) ||
        l.idNumber.toLowerCase().includes(term)
      );
    }

    if (this.selectedGrade) {
      result = result.filter(l => l.gradeId === this.selectedGrade);
    }

    this.filteredLearners = result;
    this.updatePagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedLearners = this.filteredLearners.slice(start, start + this.pageSize);
  }

  viewLearner(id: string): void {
    this.router.navigate(['/app/learners', id]);
  }

  editLearner(id: string): void {
    this.router.navigate(['/app/learners', id, 'edit']);
  }

  addLearner(): void {
    this.router.navigate(['/app/learners/new']);
  }

  deleteLearner(id: string): void {
    if (confirm('Are you sure you want to delete this learner?')) {
      this.learnerService.delete(id).subscribe(() => this.loadLearners());
    }
  }
}
