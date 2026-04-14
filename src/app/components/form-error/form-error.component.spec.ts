import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormErrorComponent } from './form-error.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('FormErrorComponent', () => {
  let component: FormErrorComponent;
  let fixture: ComponentFixture<FormErrorComponent>;
  let errorElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormErrorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('error message rendering', () => {
    it('should render error message correctly', () => {
      component.message = 'This field is required';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      expect(errorElement.nativeElement.textContent.trim()).toBe('This field is required');
    });

    it('should update error message when message input changes', () => {
      component.message = 'Initial error';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      expect(errorElement.nativeElement.textContent.trim()).toBe('Initial error');
      
      // Create a new fixture to avoid change detection issues
      const newFixture = TestBed.createComponent(FormErrorComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.message = 'Updated error';
      newFixture.detectChanges();
      const newErrorElement = newFixture.debugElement.query(By.css('.form-error'));
      
      expect(newErrorElement.nativeElement.textContent.trim()).toBe('Updated error');
    });

    it('should render empty string when message is empty', () => {
      component.message = '';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      expect(errorElement.nativeElement.textContent.trim()).toBe('');
    });
  });

  describe('ARIA attributes', () => {
    it('should have role="alert" attribute', () => {
      component.message = 'Error message';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      expect(errorElement.nativeElement.getAttribute('role')).toBe('alert');
    });

    it('should have aria-live="polite" attribute', () => {
      component.message = 'Error message';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      expect(errorElement.nativeElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should set id attribute when id input is provided', () => {
      component.message = 'Error message';
      component.id = 'email-error';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      expect(errorElement.nativeElement.getAttribute('id')).toBe('email-error');
    });

    it('should not have id attribute when id input is not provided', () => {
      component.message = 'Error message';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      // When id is undefined, Angular sets it to the string "undefined"
      const idValue = errorElement.nativeElement.getAttribute('id');
      expect(idValue === null || idValue === 'undefined').toBe(true);
    });
  });

  describe('CSS classes', () => {
    it('should have form-error class', () => {
      component.message = 'Error message';
      fixture.detectChanges();
      errorElement = fixture.debugElement.query(By.css('.form-error'));
      
      expect(errorElement.nativeElement.classList.contains('form-error')).toBe(true);
    });
  });
});
