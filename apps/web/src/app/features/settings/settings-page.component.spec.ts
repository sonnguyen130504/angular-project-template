import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsPageComponent } from './settings-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('SettingsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPageComponent, getTranslocoModule()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders account settings content', () => {
    const fixture = TestBed.createComponent(SettingsPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('A complete account area with tabs, toggles, and guardrail states.');
    expect(fixture.nativeElement.textContent).toContain('Brand and theme');
  });

  it('updates preview state from component fields', () => {
    const fixture = TestBed.createComponent(SettingsPageComponent);
    const component = fixture.componentInstance;

    component.storeName = 'Studio Supply';
    component.compactMode = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Studio Supply');
    expect(fixture.nativeElement.textContent).toContain('Comfortable mode enabled');
  });
});
