import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-button',
  standalone: false,
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)">
      @if (loading) {
        <span class="loading-spinner"></span>
      }
      <span [class.hidden]="loading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    @reference "tailwindcss";

    .btn {
      @apply px-4 w-full py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 min-h-[44px];
      @apply text-sm md:text-base;
    }

    .btn-primary {
      @apply text-white disabled:cursor-not-allowed;
      background-color: var(--color-primary);
    }
    .btn-primary:hover:not(:disabled) { background-color: var(--color-primary-shade); }
    .btn-primary:disabled { opacity: 0.6; }

    .btn-secondary { @apply bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed; }
    .btn-danger { @apply bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed; }
    .btn-loading { @apply cursor-wait; }
    .loading-spinner { @apply inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin; }
    .hidden { @apply invisible; }

    @media (max-width: 767px) {
      .btn { @apply w-full px-3 py-3 text-sm; min-height: 44px; }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): string {
    const base = 'btn';
    const variantClass = `btn-${this.variant}`;
    const loadingClass = this.loading ? 'btn-loading' : '';
    return `${base} ${variantClass} ${loadingClass}`.trim();
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
