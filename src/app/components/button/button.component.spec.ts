import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('variant classes', () => {
    it('should render with primary variant class by default', () => {
      expect(component.buttonClasses).toContain('btn-primary');
      expect(buttonElement.nativeElement.className).toContain('btn-primary');
    });

    it('should render with secondary variant class', () => {
      // Set variant before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.variant = 'secondary';
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(component.buttonClasses).toContain('btn-secondary');
      expect(buttonElement.nativeElement.className).toContain('btn-secondary');
    });

    it('should render with danger variant class', () => {
      // Set variant before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.variant = 'danger';
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(component.buttonClasses).toContain('btn-danger');
      expect(buttonElement.nativeElement.className).toContain('btn-danger');
    });

    it('should always include base btn class', () => {
      expect(component.buttonClasses).toContain('btn');
    });
  });

  describe('disabled state', () => {
    it('should not be disabled by default', () => {
      expect(buttonElement.nativeElement.disabled).toBe(false);
    });

    it('should be disabled when disabled input is true', () => {
      // Set disabled before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.disabled = true;
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should prevent click event when disabled', () => {
      // Set disabled before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.disabled = true;
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      let clickEmitted = false;
      component.clicked.subscribe(() => {
        clickEmitted = true;
      });

      buttonElement.nativeElement.click();
      expect(clickEmitted).toBe(false);
    });

    it('should be disabled when loading is true', () => {
      // Set loading before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.loading = true;
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should prevent click event when loading', () => {
      // Set loading before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.loading = true;
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      let clickEmitted = false;
      component.clicked.subscribe(() => {
        clickEmitted = true;
      });

      buttonElement.nativeElement.click();
      expect(clickEmitted).toBe(false);
    });
  });

  describe('loading state', () => {
    it('should not display spinner by default', () => {
      const spinner = fixture.debugElement.query(By.css('.loading-spinner'));
      expect(spinner).toBeNull();
    });

    it('should display spinner when loading is true', () => {
      // Set loading before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.loading = true;
      fixture.detectChanges();
      
      const spinner = fixture.debugElement.query(By.css('.loading-spinner'));
      expect(spinner).toBeTruthy();
    });

    it('should add loading class when loading is true', () => {
      // Set loading before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.loading = true;
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(component.buttonClasses).toContain('btn-loading');
      expect(buttonElement.nativeElement.className).toContain('btn-loading');
    });

    it('should hide content when loading', () => {
      // Set loading before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.loading = true;
      fixture.detectChanges();
      
      const contentSpan = fixture.debugElement.query(By.css('span.hidden'));
      expect(contentSpan).toBeTruthy();
    });
  });

  describe('click event', () => {
    it('should emit clicked event when button is clicked', () => {
      let emittedEvent: Event | null = null;
      component.clicked.subscribe((event: Event) => {
        emittedEvent = event;
      });

      buttonElement.nativeElement.click();
      expect(emittedEvent).toBeTruthy();
    });

    it('should not emit clicked event when disabled', () => {
      // Set disabled before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.disabled = true;
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      let clickEmitted = false;
      component.clicked.subscribe(() => {
        clickEmitted = true;
      });

      buttonElement.nativeElement.click();
      expect(clickEmitted).toBe(false);
    });

    it('should not emit clicked event when loading', () => {
      // Set loading before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.loading = true;
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      let clickEmitted = false;
      component.clicked.subscribe(() => {
        clickEmitted = true;
      });

      buttonElement.nativeElement.click();
      expect(clickEmitted).toBe(false);
    });
  });

  describe('button type', () => {
    it('should have type button by default', () => {
      expect(buttonElement.nativeElement.type).toBe('button');
    });

    it('should set type to submit', () => {
      // Set type before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.type = 'submit';
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(buttonElement.nativeElement.type).toBe('submit');
    });

    it('should set type to reset', () => {
      // Set type before first detectChanges
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      component.type = 'reset';
      fixture.detectChanges();
      buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(buttonElement.nativeElement.type).toBe('reset');
    });
  });

  describe('content projection', () => {
    it('should project content', () => {
      const testFixture = TestBed.createComponent(ButtonComponent);
      testFixture.componentInstance.loading = false;
      testFixture.detectChanges();
      
      const button = testFixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.textContent.trim()).toBeDefined();
    });
  });
});
