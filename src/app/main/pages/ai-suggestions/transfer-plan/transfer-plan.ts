import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AiSuggestionService } from '../../../services/ai-suggestion';

@Component({
  selector: 'app-transfer-plan',
  standalone: false,
  templateUrl: './transfer-plan.html',
  styleUrls: ['./transfer-plan.css']
})
export class TransferPlanComponent implements OnInit {
  suggestion: any = null;
  isLoading = true;

  constructor(
    private readonly aiService: AiSuggestionService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Load all suggestions and find by index/id
      this.aiService.getDistributionSuggestions().subscribe({
        next: (suggestions) => {
          this.zone.run(() => {
            this.suggestion = suggestions.find((s: any) => s.id == id) || suggestions[Number(id)] || null;
            this.isLoading = false;
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.zone.run(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  acceptPlan(): void {
    // Placeholder
  }

  rejectPlan(): void {
    // Placeholder
  }

  goBack(): void {
    this.router.navigate(['/app/ai-suggestions']);
  }
}
