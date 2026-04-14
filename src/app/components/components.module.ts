import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { FormErrorComponent } from './form-error/form-error.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    FormErrorComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    FormErrorComponent,
    LoadingSpinnerComponent
  ]
})
export class ComponentsModule { }
