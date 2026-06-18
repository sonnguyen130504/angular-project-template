import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ForgotPasswordPageComponent } from './forgot-password-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('ForgotPasswordPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPageComponent, getTranslocoModule()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders recovery layout elements', () => {
    const fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Recover Credentials');
    expect(textContent).toContain('Workstation Recovery');
  });

  it('shows submitted OTP verification state', () => {
    const fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    const component = fixture.componentInstance;

    component.submit();
    fixture.detectChanges();

    expect(component.submitted).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Security Verification');
  });
});
