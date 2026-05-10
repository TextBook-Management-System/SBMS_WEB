import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParentService } from '../../../services/parent';
import { Parent } from '../../../models/parent.model';

@Component({
  selector: 'app-parent-list',
  standalone: false,
  templateUrl: './parent-list.html',
  styleUrls: ['./parent-list.css']
})
export class ParentListComponent implements OnInit {
  parents: Parent[] = [];
  filteredParents: Parent[] = [];
  paginatedParents: Parent[] = [];
  searchTerm = '';
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private readonly parentService: ParentService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadParents();
  }

  loadParents(): void {
    this.isLoading = true;
    this.parentService.getAll().subscribe(parents => {
      this.parents = parents;
      this.filteredParents = parents;
      this.updatePagination();
      this.isLoading = false;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.filteredParents = this.parents.filter(p =>
      p.firstName.toLowerCase().includes(term.toLowerCase()) ||
      p.lastName.toLowerCase().includes(term.toLowerCase()) ||
      p.email.toLowerCase().includes(term.toLowerCase()) ||
      p.idNumber.toLowerCase().includes(term.toLowerCase())
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
    this.paginatedParents = this.filteredParents.slice(start, start + this.pageSize);
  }

  viewParent(id: string): void {
    this.router.navigate(['/app/parents', id]);
  }

  editParent(id: string): void {
    this.router.navigate(['/app/parents', id, 'edit']);
  }

  addParent(): void {
    this.router.navigate(['/app/parents/new']);
  }

  deleteParent(id: string): void {
    if (confirm('Are you sure you want to delete this parent?')) {
      this.parentService.delete(id).subscribe(() => this.loadParents());
    }
  }
}
