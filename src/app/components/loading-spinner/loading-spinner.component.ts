import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="spinner" [attr.aria-label]="ariaLabel || 'Loading'"></div>
  `,
  styles: [`
    @reference "tailwindcss";

    .spinner { @apply inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin; }

    @media (max-width: 767px) {
      .spinner { @apply w-4 h-4 border-2; }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() ariaLabel?: string;
}
