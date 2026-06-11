import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders 404 guidance', () => {
    const fixture = TestBed.createComponent(NotFoundPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Page not found');
  });
});
