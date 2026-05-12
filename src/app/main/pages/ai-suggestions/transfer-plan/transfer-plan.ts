import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AiSuggestionService } from '../../../services/ai-suggestion';
import { TransferSuggestion } from '../../../models/transfer-suggestion.model';

@Component({
  selector: 'app-transfer-plan',
  standalone: false,
  templateUrl: './transfer-plan.html',
  styleUrls: ['./transfer-plan.css']
})
export class TransferPlanComponent implements OnInit {
  suggestion: TransferSuggestion | undefined;

  constructor(
    private readonly aiService: AiSuggestionService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.aiService.getSuggestionById(id).subscribe(suggestion => {
        this.suggestion = suggestion;
      });
    }
  }

  acceptPlan(): void {
    if (this.suggestion) {
      this.aiService.acceptSuggestion(this.suggestion.id).subscribe(updated => {
        this.suggestion = updated;
      });
    }
  }

  rejectPlan(): void {
    if (this.suggestion) {
      this.aiService.rejectSuggestion(this.suggestion.id).subscribe(updated => {
        this.suggestion = updated;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/app/ai-suggestions']);
  }
}
