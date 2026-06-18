import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePageComponent } from './home-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('HomePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent, getTranslocoModule()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the home hero and template signals', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sion Studio v1.0');
    expect(fixture.nativeElement.textContent).toContain('Crafted animation labs');
    expect(fixture.nativeElement.textContent).toContain('Template Architecture');
    expect(fixture.nativeElement.textContent).toContain('Animation Lab');
    expect(fixture.nativeElement.textContent).toContain('Component gallery');
  });
});
