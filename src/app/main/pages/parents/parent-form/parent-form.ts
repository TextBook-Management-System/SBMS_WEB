import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ParentService } from '../../../services/parent';

@Component({
  selector: 'app-parent-form',
  standalone: false,
  templateUrl: './parent-form.html',
  styleUrls: ['./parent-form.css']
})
export class ParentFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  parentId: string | null = null;
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly parentService: ParentService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.parentId = this.route.snapshot.paramMap.get('id');
    if (this.parentId) {
      this.isEdit = true;
      this.loadParent(this.parentId);
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  loadParent(id: string): void {
    this.parentService.getById(id).subscribe(parent => {
      if (parent) {
        this.form.patchValue(parent);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;

      const request = this.isEdit
        ? this.parentService.update(this.parentId!, data)
        : this.parentService.create(data);

      request.subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/app/parents']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/app/parents']);
  }
}
