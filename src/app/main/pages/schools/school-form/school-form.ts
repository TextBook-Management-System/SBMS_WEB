import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolService } from '../../../services/school';

@Component({
  selector: 'app-school-form',
  standalone: false,
  templateUrl: './school-form.html',
  styleUrls: ['./school-form.css']
})
export class SchoolFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  schoolId: string | null = null;
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly schoolService: SchoolService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      address: ['', [Validators.required]],
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      principalName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.schoolId = this.route.snapshot.paramMap.get('id');
    if (this.schoolId) {
      this.isEdit = true;
      this.loadSchool(this.schoolId);
    }
  }

  loadSchool(id: string): void {
    this.schoolService.getById(id).subscribe(school => {
      if (school) {
        this.form.patchValue(school);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;

      const request = this.isEdit
        ? this.schoolService.update(this.schoolId!, data)
        : this.schoolService.create(data);

      request.subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/app/schools']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/app/schools']);
  }
}
