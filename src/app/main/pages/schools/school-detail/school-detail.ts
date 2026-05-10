import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolService } from '../../../services/school';
import { School } from '../../../models/school.model';

@Component({
  selector: 'app-school-detail',
  standalone: false,
  templateUrl: './school-detail.html',
  styleUrls: ['./school-detail.css']
})
export class SchoolDetailComponent implements OnInit {
  school: School | undefined;

  constructor(
    private readonly schoolService: SchoolService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.schoolService.getById(id).subscribe(school => {
        this.school = school;
      });
    }
  }

  editSchool(): void {
    this.router.navigate(['/app/schools', this.school?.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/app/schools']);
  }
}
