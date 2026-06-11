import { TestBed } from '@angular/core/testing';
import { DataVisualizationPageComponent } from './data-visualization-page.component';

describe('DataVisualizationPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataVisualizationPageComponent],
    }).compileComponents();
  });

  it('renders a chart and list pattern', () => {
    const fixture = TestBed.createComponent(DataVisualizationPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Analytics reference');
    expect(fixture.nativeElement.textContent).toContain('Revenue by channel');
    expect(fixture.nativeElement.textContent).toContain('Customer mix by category');
    expect(fixture.nativeElement.textContent).toContain('Signal queue');
    expect(fixture.nativeElement.textContent).toContain('Segment performance');
  });
});
