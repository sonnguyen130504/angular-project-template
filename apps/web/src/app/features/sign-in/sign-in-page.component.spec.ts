import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignInPageComponent } from './sign-in-page.component';

describe('SignInPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders sign-in split layout and slide carousel text', () => {
    const fixture = TestBed.createComponent(SignInPageComponent);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Welcome back');
    expect(textContent).toContain('Calm Commerce Workbench');
  });

  it('validates submit readiness', fakeAsync(() => {
    const fixture = TestBed.createComponent(SignInPageComponent);
    const component = fixture.componentInstance;

    component.password = 'short';
    fixture.detectChanges();
    tick();
    expect(component.canSubmit).toBeFalse();

    component.password = 'long-enough';
    fixture.detectChanges();
    tick();
    expect(component.canSubmit).toBeTrue();
  }));
});
