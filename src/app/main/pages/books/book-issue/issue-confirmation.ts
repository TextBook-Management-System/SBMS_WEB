import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-issue-confirmation',
  standalone: false,
  templateUrl: './issue-confirmation.html',
  styleUrls: ['./issue-confirmation.css']
})
export class IssueConfirmationComponent implements OnInit {
  learnerName = '';
  bookQr = '';
  condition = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.learnerName = params['learner'] || '';
    this.bookQr = params['book'] || '';
    this.condition = params['condition'] || '';
  }

  goToBooks(): void {
    this.router.navigate(['/app/books']);
  }

  issueAnother(): void {
    this.router.navigate(['/app/books/issue']);
  }
}
