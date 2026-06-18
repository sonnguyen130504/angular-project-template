import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

import { getTranslocoModule } from './transloco-testing.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, getTranslocoModule()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-shell')).toBeTruthy();
  });
});
