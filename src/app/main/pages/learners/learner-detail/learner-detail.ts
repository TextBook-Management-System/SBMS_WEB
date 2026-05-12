import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LearnerService } from '../../../services/learner';
import { BookService } from '../../../services/book';
import { Learner } from '../../../models/learner.model';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-learner-detail',
  standalone: false,
  templateUrl: './learner-detail.html',
  styleUrls: ['./learner-detail.css']
})
export class LearnerDetailComponent implements OnInit {
  learner: Learner | undefined;
  assignedBooks: Book[] = [];

  constructor(
    private readonly learnerService: LearnerService,
    private readonly bookService: BookService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.learnerService.getById(id).subscribe(learner => {
        this.learner = learner;
        if (learner) {
          this.bookService.getAll().subscribe(books => {
            this.assignedBooks = books.filter(b => b.assignedToLearnerId === learner.id);
          });
        }
      });
    }
  }

  editLearner(): void {
    this.router.navigate(['/app/learners', this.learner?.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/app/learners']);
  }
}
