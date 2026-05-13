import { Component, Input } from '@angular/core';

export interface StepConfig {
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-stepper',
  standalone: false,
  templateUrl: './stepper.html',
  styleUrls: ['./stepper.css']
})
export class StepperComponent {
  @Input() steps: StepConfig[] = [];
  @Input() currentStep = 0;
}
