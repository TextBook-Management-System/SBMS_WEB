import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LearnerService } from '../../../services/learner';

@Component({
  selector: 'app-learner-form',
  standalone: false,
  templateUrl: './learner-form.html',
  styleUrls: ['./learner-form.css']
})
export class LearnerFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  learnerId: string | null = null;
  isLoading = false;

  grades = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6', 'grade-7', 'grade-8', 'grade-9', 'grade-10', 'grade-11', 'grade-12'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly learnerService: LearnerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      gradeId: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.learnerId = this.route.snapshot.paramMap.get('id');
    if (this.learnerId) {
      this.isEdit = true;
      this.loadLearner(this.learnerId);
    }
  }

  loadLearner(id: string): void {
    this.learnerService.getById(id).subscribe(learner => {
      if (learner) {
        this.form.patchValue({
          ...learner,
          dateOfBirth: new Date(learner.dateOfBirth).toISOString().split('T')[0]
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;

      const request = this.isEdit
        ? this.learnerService.update(this.learnerId!, data)
        : this.learnerService.create(data);

      request.subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/app/learners']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/app/learners']);
  }
}
