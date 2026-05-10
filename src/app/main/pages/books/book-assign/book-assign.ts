import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book';
import { LearnerService } from '../../../services/learner';
import { Book } from '../../../models/book.model';
import { Learner } from '../../../models/learner.model';

@Component({
  selector: 'app-book-assign',
  standalone: false,
  templateUrl: './book-assign.html',
  styleUrls: ['./book-assign.css']
})
export class BookAssignComponent implements OnInit {
  availableBooks: Book[] = [];
  learners: Learner[] = [];
  selectedBookId = '';
  selectedLearnerId = '';
  isLoading = false;

  constructor(
    private readonly bookService: BookService,
    private readonly learnerService: LearnerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.bookService.getAll().subscribe(books => {
      this.availableBooks = books.filter(b => !b.isAssigned);
    });
    this.learnerService.getAll().subscribe(learners => {
      this.learners = learners;
    });
  }

  assignBook(): void {
    if (this.selectedBookId && this.selectedLearnerId) {
      this.isLoading = true;
      this.bookService.assign(this.selectedBookId, this.selectedLearnerId).subscribe(() => {
        this.isLoading = false;
        this.availableBooks = this.availableBooks.filter(b => b.id !== this.selectedBookId);
        this.selectedBookId = '';
        this.selectedLearnerId = '';
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/app/books']);
  }
}
