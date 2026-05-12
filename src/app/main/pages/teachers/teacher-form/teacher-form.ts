import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherService } from '../../../services/teacher';

@Component({
  selector: 'app-teacher-form',
  standalone: false,
  templateUrl: './teacher-form.html',
  styleUrls: ['./teacher-form.css']
})
export class TeacherFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  teacherId: string | null = null;
  isLoading = false;

  schools = [
    { id: '1', name: 'Greenfield Primary' },
    { id: '2', name: 'Sunrise Secondary' },
    { id: '3', name: 'Hillcrest Combined' },
    { id: '4', name: 'Valley View Primary' },
    { id: '5', name: 'Riverside High' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly teacherService: TeacherService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      staffNumber: ['', [Validators.required]],
      schoolId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.teacherId = this.route.snapshot.paramMap.get('id');
    if (this.teacherId) {
      this.isEdit = true;
      this.loadTeacher(this.teacherId);
    }
  }

  loadTeacher(id: string): void {
    this.teacherService.getById(id).subscribe(teacher => {
      if (teacher) {
        this.form.patchValue(teacher);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;

      const request = this.isEdit
        ? this.teacherService.update(this.teacherId!, data)
        : this.teacherService.create(data);

      request.subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/app/teachers']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/app/teachers']);
  }
}
