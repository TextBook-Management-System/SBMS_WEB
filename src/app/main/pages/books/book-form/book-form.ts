import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../../services/book';

@Component({
  selector: 'app-book-form',
  standalone: false,
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.css']
})
export class BookFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  bookId: string | null = null;
  isLoading = false;

  subjects = ['math', 'english', 'science', 'history', 'geography', 'technology'];
  grades = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6', 'grade-7', 'grade-8', 'grade-9', 'grade-10', 'grade-11', 'grade-12'];
  conditions = ['new', 'good', 'fair', 'damaged'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly bookService: BookService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      author: ['', [Validators.required]],
      publisher: ['', [Validators.required]],
      subjectId: ['', [Validators.required]],
      gradeId: ['', [Validators.required]],
      condition: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEdit = true;
      this.loadBook(this.bookId);
    }
  }

  loadBook(id: string): void {
    this.bookService.getById(id).subscribe(book => {
      if (book) {
        this.form.patchValue(book);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;

      const request = this.isEdit
        ? this.bookService.update(this.bookId!, data)
        : this.bookService.create(data);

      request.subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/app/books']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/app/books']);
  }
}
