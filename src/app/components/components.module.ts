import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { FormErrorComponent } from './form-error/form-error.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { StepperComponent } from './stepper/stepper';
import { FileUploadComponent } from './file-upload/file-upload';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    FormErrorComponent,
    LoadingSpinnerComponent,
    PaginatorComponent,
    StepperComponent,
    FileUploadComponent,
  ],
  imports: [CommonModule],
  exports: [
    ButtonComponent,
    InputComponent,
    FormErrorComponent,
    LoadingSpinnerComponent,
    PaginatorComponent,
    StepperComponent,
    FileUploadComponent,
  ],
})
export class ComponentsModule {}
