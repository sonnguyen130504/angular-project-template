import { TestBed } from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('DashboardPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, getTranslocoModule()],
    }).compileComponents();
  });

  it('renders dashboard metrics', () => {
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Revenue');
    expect(fixture.nativeElement.textContent).toContain('Orders');
    expect(fixture.nativeElement.textContent).toContain('Channel Mix');
    expect(fixture.nativeElement.textContent).toContain('Conversion Funnel');
    expect(fixture.nativeElement.textContent).toContain('Exception Queue');
    expect(fixture.nativeElement.textContent).toContain('Recent Orders');
  });
});
