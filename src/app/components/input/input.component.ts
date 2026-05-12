import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: false,
  template: `
    <div class="input-wrapper">
      <label [for]="id" *ngIf="label" class="input-label">{{ label }}</label>
      <div class="input-container" [class.has-prefix]="prefixIcon" [class.has-suffix]="suffixIcon">
        <span class="input-prefix" *ngIf="prefixIcon">
          <i [class]="prefixIcon"></i>
        </span>
        <ng-content select="[prefix]"></ng-content>
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-required]="required"
          [attr.aria-invalid]="hasError"
          [attr.aria-describedby]="hasError ? id + '-error' : null"
          [class.input-error]="hasError"
          [class.with-prefix]="prefixIcon"
          [class.with-suffix]="suffixIcon"
          class="input-field"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
        <span class="input-suffix" *ngIf="suffixIcon">
          <i [class]="suffixIcon"></i>
        </span>
        <ng-content select="[suffix]"></ng-content>
      </div>
      <app-form-error 
        *ngIf="hasError && errorMessage"
        [id]="id + '-error'"
        [message]="errorMessage">
      </app-form-error>
    </div>
  `,
  styles: [`
    @reference "tailwindcss";

    .input-wrapper { @apply mb-4; }
    .input-label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
    .input-container { @apply relative flex items-center; }

    .input-field {
      @apply w-full text-gray-700 px-3 py-2 border border-gray-200 rounded-lg shadow-sm
             focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
             disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-sm;
      min-height: 44px;
    }

    .input-field.with-prefix { @apply pl-10; }
    .input-field.with-suffix { @apply pr-10; }

    .input-field.input-error { @apply border-red-400 focus:ring-red-500/20 focus:border-red-500; }

    .input-prefix {
      @apply absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10;
    }

    .input-prefix i { @apply text-base; }

    .input-suffix {
      @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10;
    }

    .input-suffix i { @apply text-base; }

    @media (max-width: 767px) {
      .input-field { @apply px-3 py-3 text-base; min-height: 44px; }
      .input-field.with-prefix { @apply pl-10; }
      .input-field.with-suffix { @apply pr-10; }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id!: string;
  @Input() type: string = 'text';
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() hasError = false;
  @Input() errorMessage?: string;
  @Input() ariaLabel?: string;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();
  @Output() focused = new EventEmitter<void>();

  // Form hooks
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private readonly cdr: ChangeDetectorRef) {}

  // --- ControlValueAccessor Implementation ---
  writeValue(value: any): void {
    this.value = value || '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // --- Event Handlers ---
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  onFocus(): void {
    this.focused.emit();
  }
}
