import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { AiSuggestionService } from '../../../services/ai-suggestion';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-suggestion-dashboard',
  standalone: false,
  templateUrl: './suggestion-dashboard.html',
  styleUrls: ['./suggestion-dashboard.css']
})
export class SuggestionDashboardComponent implements OnInit {
  suggestions: any = null;
  isLoading = false;
  loadError: string | null = null;
  hasGenerated = false;
  departmentId: number | null = null;

  constructor(
    private readonly aiService: AiSuggestionService,
    private readonly authService: AuthService,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.departmentId = user?.department_id || 1; // Default to 1 if not set
  }

  generateSuggestions(): void {
    if (!this.departmentId) return;
    this.isLoading = true;
    this.loadError = null;

    this.aiService.getDepartmentSuggestions(this.departmentId).subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.suggestions = data;
          this.isLoading = false;
          this.hasGenerated = true;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadError = 'Failed to generate AI suggestions. Please try again.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  formatMarkdown(text: string): string {
    // Convert **bold** to <strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
