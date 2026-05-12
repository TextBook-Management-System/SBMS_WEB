import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: false,
  template: `
    <div 
      [id]="id"
      class="form-error"
      role="alert"
      aria-live="polite">
      {{ message }}
    </div>
  `,
  styles: [`
    @reference "tailwindcss";

    .form-error { @apply text-sm text-red-600 mt-1; }

    @media (max-width: 767px) {
      .form-error { @apply text-sm text-red-600 mt-1; }
    }
  `]
})
export class FormErrorComponent {
  @Input() id?: string;
  @Input() message!: string;
}
