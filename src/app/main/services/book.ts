import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private mockBooks: Book[] = [
    { id: '1', title: 'Mathematics Grade 4', isbn: '978-0-123456-01', author: 'J. Smith', publisher: 'SA Education Press', subjectId: 'math', gradeId: 'grade-4', condition: 'new', schoolId: '1', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', title: 'English Home Language Gr 8', isbn: '978-0-123456-02', author: 'L. Johnson', publisher: 'Oxford SA', subjectId: 'english', gradeId: 'grade-8', condition: 'good', schoolId: '2', isAssigned: true, assignedToLearnerId: '1', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', title: 'Natural Sciences Gr 6', isbn: '978-0-123456-03', author: 'P. Naidoo', publisher: 'Pearson SA', subjectId: 'science', gradeId: 'grade-6', condition: 'fair', schoolId: '3', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', title: 'Social Sciences Gr 5', isbn: '978-0-123456-04', author: 'M. Khumalo', publisher: 'Via Afrika', subjectId: 'history', gradeId: 'grade-5', condition: 'damaged', schoolId: '4', isAssigned: true, assignedToLearnerId: '2', createdAt: new Date(), updatedAt: new Date() },
    { id: '5', title: 'Mathematics Grade 10', isbn: '978-0-123456-05', author: 'R. Sobukwe', publisher: 'SA Education Press', subjectId: 'math', gradeId: 'grade-10', condition: 'good', schoolId: '5', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', title: 'Life Sciences Gr 11', isbn: '978-0-123456-06', author: 'T. Mbeki', publisher: 'Maskew Miller', subjectId: 'science', gradeId: 'grade-11', condition: 'new', schoolId: '2', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', title: 'Afrikaans Eerste Taal Gr 7', isbn: '978-0-123456-07', author: 'A. Brink', publisher: 'NB Publishers', subjectId: 'afrikaans', gradeId: 'grade-7', condition: 'good', schoolId: '1', isAssigned: true, assignedToLearnerId: '3', createdAt: new Date(), updatedAt: new Date() },
    { id: '8', title: 'Physical Sciences Gr 12', isbn: '978-0-123456-08', author: 'D. Malan', publisher: 'Pearson SA', subjectId: 'physics', gradeId: 'grade-12', condition: 'fair', schoolId: '3', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '9', title: 'Geography Gr 9', isbn: '978-0-123456-09', author: 'S. Cele', publisher: 'Oxford SA', subjectId: 'geography', gradeId: 'grade-9', condition: 'new', schoolId: '5', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '10', title: 'Technology Gr 8', isbn: '978-0-123456-10', author: 'K. Patel', publisher: 'Via Afrika', subjectId: 'technology', gradeId: 'grade-8', condition: 'good', schoolId: '4', isAssigned: true, assignedToLearnerId: '4', createdAt: new Date(), updatedAt: new Date() },
    { id: '11', title: 'IsiZulu Home Language Gr 3', isbn: '978-0-123456-11', author: 'N. Buthelezi', publisher: 'Shuter & Shooter', subjectId: 'isizulu', gradeId: 'grade-3', condition: 'damaged', schoolId: '1', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '12', title: 'Economic Management Gr 10', isbn: '978-0-123456-12', author: 'F. Moyo', publisher: 'SA Education Press', subjectId: 'ems', gradeId: 'grade-10', condition: 'good', schoolId: '2', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '13', title: 'Creative Arts Gr 6', isbn: '978-0-123456-13', author: 'B. Ngcobo', publisher: 'Maskew Miller', subjectId: 'arts', gradeId: 'grade-6', condition: 'new', schoolId: '3', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '14', title: 'Life Orientation Gr 11', isbn: '978-0-123456-14', author: 'W. Dube', publisher: 'Oxford SA', subjectId: 'lo', gradeId: 'grade-11', condition: 'fair', schoolId: '5', isAssigned: true, assignedToLearnerId: '5', createdAt: new Date(), updatedAt: new Date() },
    { id: '15', title: 'Accounting Gr 12', isbn: '978-0-123456-15', author: 'C. Louw', publisher: 'Pearson SA', subjectId: 'accounting', gradeId: 'grade-12', condition: 'good', schoolId: '4', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '16', title: 'Mathematics Grade 7', isbn: '978-0-123456-16', author: 'J. Smith', publisher: 'SA Education Press', subjectId: 'math', gradeId: 'grade-7', condition: 'new', schoolId: '1', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '17', title: 'English FAL Gr 5', isbn: '978-0-123456-17', author: 'H. Adams', publisher: 'Oxford SA', subjectId: 'english', gradeId: 'grade-5', condition: 'good', schoolId: '2', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
    { id: '18', title: 'History Gr 10', isbn: '978-0-123456-18', author: 'T. Mandela', publisher: 'Via Afrika', subjectId: 'history', gradeId: 'grade-10', condition: 'damaged', schoolId: '3', isAssigned: false, createdAt: new Date(), updatedAt: new Date() },
  ];

  getAll(): Observable<Book[]> {
    return of(this.mockBooks);
  }

  getById(id: string): Observable<Book | undefined> {
    return of(this.mockBooks.find(b => b.id === id));
  }

  create(book: Partial<Book>): Observable<Book> {
    const newBook: Book = {
      ...book as Book,
      id: Date.now().toString(),
      isAssigned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockBooks.push(newBook);
    return of(newBook);
  }

  update(id: string, book: Partial<Book>): Observable<Book> {
    const index = this.mockBooks.findIndex(b => b.id === id);
    if (index > -1) {
      this.mockBooks[index] = { ...this.mockBooks[index], ...book, updatedAt: new Date() };
      return of(this.mockBooks[index]);
    }
    return of(book as Book);
  }

  assign(bookId: string, learnerId: string): Observable<Book> {
    return this.update(bookId, { isAssigned: true, assignedToLearnerId: learnerId });
  }

  unassign(bookId: string): Observable<Book> {
    return this.update(bookId, { isAssigned: false, assignedToLearnerId: undefined });
  }

  delete(id: string): Observable<void> {
    this.mockBooks = this.mockBooks.filter(b => b.id !== id);
    return of(undefined);
  }
}
