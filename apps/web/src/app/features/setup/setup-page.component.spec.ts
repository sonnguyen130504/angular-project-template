import { TestBed } from '@angular/core/testing';
import { SetupPageComponent } from './setup-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('SetupPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SetupPageComponent, getTranslocoModule()] }).compileComponents();
  });

  it('renders setup checklist and completes the active step', () => {
    const fixture = TestBed.createComponent(SetupPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.activeStepId = 2;
    component.completeActive();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Setup checklist');
    expect(component.steps[1].done).toBeTrue();
  });
});
