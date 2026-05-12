import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookRequestService } from '../../../services/book-request';
import { BookRequest } from '../../../models/book-request.model';

@Component({
  selector: 'app-request-detail',
  standalone: false,
  templateUrl: './request-detail.html',
  styleUrls: ['./request-detail.css']
})
export class RequestDetailComponent implements OnInit {
  request: BookRequest | undefined;

  constructor(
    private readonly requestService: BookRequestService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestService.getById(id).subscribe(request => {
        this.request = request;
      });
    }
  }

  approveRequest(): void {
    if (this.request) {
      this.requestService.approve(this.request.id, 'Admin').subscribe(updated => {
        this.request = updated;
      });
    }
  }

  rejectRequest(): void {
    if (this.request) {
      this.requestService.reject(this.request.id).subscribe(updated => {
        this.request = updated;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/app/book-requests']);
  }
}
