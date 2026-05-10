import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AiSuggestionService } from '../../../services/ai-suggestion';
import { TransferSuggestion, SchoolBookSummary } from '../../../models/transfer-suggestion.model';

@Component({
  selector: 'app-suggestion-dashboard',
  standalone: false,
  templateUrl: './suggestion-dashboard.html',
  styleUrls: ['./suggestion-dashboard.css']
})
export class SuggestionDashboardComponent implements OnInit {
  suggestions: TransferSuggestion[] = [];
  summaries: SchoolBookSummary[] = [];
  isLoading = true;

  get surplusCount(): number {
    return this.summaries.filter(s => s.status === 'surplus').length;
  }

  get deficitCount(): number {
    return this.summaries.filter(s => s.status === 'deficit').length;
  }

  get pendingCount(): number {
    return this.suggestions.filter(s => s.status === 'pending').length;
  }

  constructor(
    private readonly aiService: AiSuggestionService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.aiService.getSuggestions().subscribe(suggestions => {
      this.suggestions = suggestions;
      this.isLoading = false;
    });
    this.aiService.getSchoolSummaries().subscribe(summaries => {
      this.summaries = summaries;
    });
  }

  viewTransferPlan(id: string): void {
    this.router.navigate(['/app/ai-suggestions/transfer', id]);
  }

  acceptSuggestion(id: string): void {
    this.aiService.acceptSuggestion(id).subscribe(() => this.loadData());
  }

  rejectSuggestion(id: string): void {
    this.aiService.rejectSuggestion(id).subscribe(() => this.loadData());
  }
}
