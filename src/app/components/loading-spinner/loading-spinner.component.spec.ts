import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let spinnerElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    spinnerElement = fixture.debugElement.query(By.css('.spinner'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ARIA label', () => {
    it('should render with default ARIA label "Loading"', () => {
      expect(spinnerElement.nativeElement.getAttribute('aria-label')).toBe('Loading');
    });

    it('should render with custom ARIA label when provided', () => {
      // Set ariaLabel before first detectChanges
      fixture = TestBed.createComponent(LoadingSpinnerComponent);
      component = fixture.componentInstance;
      component.ariaLabel = 'Processing request';
      fixture.detectChanges();
      spinnerElement = fixture.debugElement.query(By.css('.spinner'));
      
      expect(spinnerElement.nativeElement.getAttribute('aria-label')).toBe('Processing request');
    });

    it('should use default label when ariaLabel is empty string', () => {
      // Set ariaLabel to empty string before first detectChanges
      fixture = TestBed.createComponent(LoadingSpinnerComponent);
      component = fixture.componentInstance;
      component.ariaLabel = '';
      fixture.detectChanges();
      spinnerElement = fixture.debugElement.query(By.css('.spinner'));
      
      expect(spinnerElement.nativeElement.getAttribute('aria-label')).toBe('Loading');
    });
  });

  describe('spinner element', () => {
    it('should render spinner element', () => {
      expect(spinnerElement).toBeTruthy();
    });

    it('should have spinner class', () => {
      expect(spinnerElement.nativeElement.classList.contains('spinner')).toBe(true);
    });
  });
});
