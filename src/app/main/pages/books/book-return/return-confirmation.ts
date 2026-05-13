import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-return-confirmation',
  standalone: false,
  templateUrl: './return-confirmation.html',
  styleUrls: ['./return-confirmation.css']
})
export class ReturnConfirmationComponent implements OnInit {
  bookQr = '';
  condition = '';
  previousCondition = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.bookQr = params['book'] || '';
    this.condition = params['condition'] || '';
    this.previousCondition = params['previousCondition'] || '';
  }

  goToBooks(): void {
    this.router.navigate(['/app/books']);
  }

  returnAnother(): void {
    this.router.navigate(['/app/books/return']);
  }
}
