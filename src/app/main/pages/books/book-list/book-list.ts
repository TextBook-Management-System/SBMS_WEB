import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  searchTerm = '';
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private readonly bookService: BookService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getAll().subscribe(books => {
      this.books = books;
      this.filteredBooks = books;
      this.updatePagination();
      this.isLoading = false;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.filteredBooks = this.books.filter(b =>
      b.title.toLowerCase().includes(term.toLowerCase()) ||
      b.isbn.toLowerCase().includes(term.toLowerCase()) ||
      b.author.toLowerCase().includes(term.toLowerCase()) ||
      b.subjectId.toLowerCase().includes(term.toLowerCase())
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
    this.paginatedBooks = this.filteredBooks.slice(start, start + this.pageSize);
  }

  addBook(): void {
    this.router.navigate(['/app/books/new']);
  }

  editBook(id: string): void {
    this.router.navigate(['/app/books', id, 'edit']);
  }

  assignBooks(): void {
    this.router.navigate(['/app/books/assign']);
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.delete(id).subscribe(() => this.loadBooks());
    }
  }
}
