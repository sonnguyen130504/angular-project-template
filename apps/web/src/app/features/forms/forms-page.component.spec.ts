import { TestBed } from '@angular/core/testing';
import { FormsPageComponent } from './forms-page.component';

describe('FormsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsPageComponent],
    }).compileComponents();
  });

  it('renders form wizard and progress steps', () => {
    const fixture = TestBed.createComponent(FormsPageComponent);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Form Wizard & Validation');
    expect(textContent).toContain('Account details');
    expect(textContent).toContain('Secure Password');
  });

  it('runs validation checks and transitions steps', () => {
    const fixture = TestBed.createComponent(FormsPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.currentFormStep).toBe(1);
    expect(component.passwordStrengthScore).toBe(0);

    component.password = 'abc123XYZ!';
    expect(component.passwordStrengthScore).toBe(4);
    expect(component.passwordStrengthLabel).toBe('Excellent');
  });
});
