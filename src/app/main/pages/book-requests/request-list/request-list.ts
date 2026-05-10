import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookRequestService } from '../../../services/book-request';
import { BookRequest } from '../../../models/book-request.model';

@Component({
  selector: 'app-request-list',
  standalone: false,
  templateUrl: './request-list.html',
  styleUrls: ['./request-list.css']
})
export class RequestListComponent implements OnInit {
  requests: BookRequest[] = [];
  filteredRequests: BookRequest[] = [];
  paginatedRequests: BookRequest[] = [];
  searchTerm = '';
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private readonly requestService: BookRequestService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.requestService.getAll().subscribe(requests => {
      this.requests = requests;
      this.filteredRequests = requests;
      this.updatePagination();
      this.isLoading = false;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.filteredRequests = this.requests.filter(r =>
      r.schoolName.toLowerCase().includes(term.toLowerCase()) ||
      r.subjectId.toLowerCase().includes(term.toLowerCase()) ||
      r.status.toLowerCase().includes(term.toLowerCase())
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
    this.paginatedRequests = this.filteredRequests.slice(start, start + this.pageSize);
  }

  viewRequest(id: string): void {
    this.router.navigate(['/app/book-requests', id]);
  }

  addRequest(): void {
    this.router.navigate(['/app/book-requests/new']);
  }

  approveRequest(id: string): void {
    this.requestService.approve(id, 'Admin').subscribe(() => this.loadRequests());
  }

  rejectRequest(id: string): void {
    this.requestService.reject(id).subscribe(() => this.loadRequests());
  }

  deleteRequest(id: string): void {
    if (confirm('Are you sure you want to delete this request?')) {
      this.requestService.delete(id).subscribe(() => this.loadRequests());
    }
  }
}
