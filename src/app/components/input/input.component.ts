import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: false,
  template: `
    <div class="input-wrapper">
      <label [for]="id" *ngIf="label" class="input-label">{{ label }}</label>
      <div class="input-container">
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
          class="input-field"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
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
    .input-label { @apply block text-sm font-medium text-gray-700 mb-1; }
    .input-container { @apply relative; }
    .input-field { @apply w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 text-base; min-height: 44px; }
    .input-field.input-error { @apply border-red-500 focus:ring-red-500 focus:border-red-500; }
    @media (max-width: 767px) { .input-field { @apply px-3 py-3 text-base; min-height: 44px; } }
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
  // INITIALIZE default value here to prevent NG0100 (undefined -> 'password')
  @Input() type: string = 'text'; 
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() hasError = false;
  @Input() errorMessage?: string;
  @Input() ariaLabel?: string;
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();
  @Output() focused = new EventEmitter<void>();

  // Form hooks
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // --- ControlValueAccessor Implementation ---
  writeValue(value: any): void {
    this.value = value || '';
    this.cdr.markForCheck(); // Safety for Change Detection
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
    this.onChange(this.value); // Sends value to FormGroup
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched(); // Marks control as 'touched' for validation
    this.blurred.emit();
  }

  onFocus(): void {
    this.focused.emit();
  }
}