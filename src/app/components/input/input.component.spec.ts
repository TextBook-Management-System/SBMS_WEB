import { TestBed, ComponentFixture } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormErrorComponent } from '../form-error/form-error.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let inputElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent, FormErrorComponent],
      imports: [CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.id = 'test-input';
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input type rendering', () => {
    it('should render with text type by default', () => {
      expect(inputElement.nativeElement.type).toBe('text');
    });

    it('should render with email type', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.type = 'email';
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.type).toBe('email');
    });

    it('should render with password type', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.type = 'password';
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.type).toBe('password');
    });

    it('should render with number type', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.type = 'number';
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.type).toBe('number');
    });
  });

  describe('value change event emission', () => {
    it('should emit valueChange event when input value changes', () => {
      let emittedValue: string | null = null;
      component.valueChange.subscribe((value: string) => {
        emittedValue = value;
      });

      inputElement.nativeElement.value = 'test value';
      inputElement.nativeElement.dispatchEvent(new Event('input'));
      
      expect(emittedValue).toBe('test value');
    });

    it('should update component value when input changes', () => {
      inputElement.nativeElement.value = 'new value';
      inputElement.nativeElement.dispatchEvent(new Event('input'));
      
      expect(component.value).toBe('new value');
    });

    it('should emit empty string when input is cleared', () => {
      let emittedValue: string | null = null;
      component.valueChange.subscribe((value: string) => {
        emittedValue = value;
      });

      inputElement.nativeElement.value = '';
      inputElement.nativeElement.dispatchEvent(new Event('input'));
      
      expect(emittedValue).toBe('');
    });
  });

  describe('error message display', () => {
    it('should not display error message by default', () => {
      const errorElement = fixture.debugElement.query(By.css('app-form-error'));
      expect(errorElement).toBeNull();
    });

    it('should display error message when hasError is true and errorMessage is provided', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = true;
      component.errorMessage = 'This field is required';
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('app-form-error'));
      expect(errorElement).toBeTruthy();
    });

    it('should not display error message when hasError is true but errorMessage is not provided', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = true;
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('app-form-error'));
      expect(errorElement).toBeNull();
    });

    it('should apply error class to input when hasError is true', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = true;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.className).toContain('input-error');
    });

    it('should pass correct id to error component', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = true;
      component.errorMessage = 'Error message';
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('app-form-error'));
      const errorComponent = errorElement.componentInstance as FormErrorComponent;
      expect(errorComponent.id).toBe('test-input-error');
    });
  });

  describe('ARIA attributes', () => {
    it('should set aria-label from label input', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.label = 'Email Address';
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-label')).toBe('Email Address');
    });

    it('should set aria-label from ariaLabel input when provided', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.label = 'Email';
      component.ariaLabel = 'Email Address Input';
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-label')).toBe('Email Address Input');
    });

    it('should set aria-required to true when required is true', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.required = true;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-required')).toBe('true');
    });

    it('should set aria-required to false when required is false', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.required = false;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-required')).toBe('false');
    });

    it('should set aria-invalid to true when hasError is true', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = true;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-invalid to false when hasError is false', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = false;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-invalid')).toBe('false');
    });

    it('should set aria-describedby when hasError is true', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = true;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-describedby')).toBe('test-input-error');
    });

    it('should not set aria-describedby when hasError is false', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.hasError = false;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.getAttribute('aria-describedby')).toBeNull();
    });
  });

  describe('blur event', () => {
    it('should emit blurred event when input loses focus', () => {
      let blurEmitted = false;
      component.blurred.subscribe(() => {
        blurEmitted = true;
      });

      inputElement.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(blurEmitted).toBe(true);
    });

    it('should emit blurred event only once per blur', () => {
      let blurCount = 0;
      component.blurred.subscribe(() => {
        blurCount++;
      });

      inputElement.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(blurCount).toBe(1);
    });
  });

  describe('focus event', () => {
    it('should emit focused event when input gains focus', () => {
      let focusEmitted = false;
      component.focused.subscribe(() => {
        focusEmitted = true;
      });

      inputElement.nativeElement.dispatchEvent(new Event('focus'));
      
      expect(focusEmitted).toBe(true);
    });

    it('should emit focused event only once per focus', () => {
      let focusCount = 0;
      component.focused.subscribe(() => {
        focusCount++;
      });

      inputElement.nativeElement.dispatchEvent(new Event('focus'));
      
      expect(focusCount).toBe(1);
    });
  });

  describe('disabled state', () => {
    it('should not be disabled by default', () => {
      expect(inputElement.nativeElement.disabled).toBe(false);
    });

    it('should be disabled when disabled input is true', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.disabled = true;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.disabled).toBe(true);
    });
  });

  describe('label rendering', () => {
    it('should not render label by default', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeNull();
    });

    it('should render label when label input is provided', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.label = 'Email Address';
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.textContent.trim()).toBe('Email Address');
    });

    it('should associate label with input using for attribute', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.label = 'Email Address';
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.getAttribute('for')).toBe('test-input');
    });
  });

  describe('placeholder', () => {
    it('should have empty placeholder by default', () => {
      expect(inputElement.nativeElement.placeholder).toBe('');
    });

    it('should set placeholder when provided', () => {
      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      component.id = 'test-input';
      component.placeholder = 'Enter your email';
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.placeholder).toBe('Enter your email');
    });
  });
});
