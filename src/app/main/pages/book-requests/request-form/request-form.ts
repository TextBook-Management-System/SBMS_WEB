import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookRequestService } from '../../../services/book-request';

@Component({
  selector: 'app-request-form',
  standalone: false,
  templateUrl: './request-form.html',
  styleUrls: ['./request-form.css']
})
export class RequestFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  requestId: string | null = null;
  isLoading = false;

  schools = [
    { id: '1', name: 'Greenfield Primary' },
    { id: '2', name: 'Sunrise Secondary' },
    { id: '3', name: 'Hillcrest Combined' },
    { id: '4', name: 'Valley View Primary' },
    { id: '5', name: 'Riverside High' },
  ];

  subjects = ['math', 'english', 'science', 'history', 'geography', 'technology'];
  grades = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6', 'grade-7', 'grade-8', 'grade-9', 'grade-10', 'grade-11', 'grade-12'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly requestService: BookRequestService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      schoolId: ['', [Validators.required]],
      subjectId: ['', [Validators.required]],
      gradeId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      reason: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id');
    if (this.requestId) {
      this.isEdit = true;
      this.loadRequest(this.requestId);
    }
  }

  loadRequest(id: string): void {
    this.requestService.getById(id).subscribe(request => {
      if (request) {
        this.form.patchValue(request);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;
      const school = this.schools.find(s => s.id === data.schoolId);
      data.schoolName = school?.name || '';
      data.requestedBy = 'Current User';

      const request = this.isEdit
        ? this.requestService.update(this.requestId!, data)
        : this.requestService.create(data);

      request.subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/app/book-requests']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/app/book-requests']);
  }
}
