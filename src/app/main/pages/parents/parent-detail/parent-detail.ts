import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParentService } from '../../../services/parent';
import { LearnerService } from '../../../services/learner';
import { Parent } from '../../../models/parent.model';
import { Learner } from '../../../models/learner.model';

@Component({
  selector: 'app-parent-detail',
  standalone: false,
  templateUrl: './parent-detail.html',
  styleUrls: ['./parent-detail.css']
})
export class ParentDetailComponent implements OnInit {
  parent: Parent | undefined;
  linkedLearners: Learner[] = [];

  constructor(
    private readonly parentService: ParentService,
    private readonly learnerService: LearnerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.parentService.getById(id).subscribe(parent => {
        this.parent = parent;
        if (parent) {
          this.learnerService.getByParent(parent.id).subscribe(learners => {
            this.linkedLearners = learners;
          });
        }
      });
    }
  }

  editParent(): void {
    this.router.navigate(['/app/parents', this.parent?.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/app/parents']);
  }
}
