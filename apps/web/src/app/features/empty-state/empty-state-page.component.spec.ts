import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EmptyStatePageComponent } from './empty-state-page.component';

describe('EmptyStatePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStatePageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders simulator panels and header labels', () => {
    const fixture = TestBed.createComponent(EmptyStatePageComponent);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Empty & Error State Simulator');
    expect(textContent).toContain('Select System State');
    expect(textContent).toContain('Active State Workspace');
  });

  it('toggles interactive simulation selections', () => {
    const fixture = TestBed.createComponent(EmptyStatePageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.activeStateId).toBe('no-data');

    component.selectState('offline');
    expect(component.activeStateId).toBe('offline');

    component.selectState('onboarding');
    expect(component.activeStateId).toBe('onboarding');
    expect(component.onboardingStep).toBe(1);
  });
});
