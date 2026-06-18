import { TestBed } from '@angular/core/testing';
import { BillingPageComponent } from './billing-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('BillingPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BillingPageComponent, getTranslocoModule()] }).compileComponents();
  });

  it('renders billing plans and toggles interval', () => {
    const fixture = TestBed.createComponent(BillingPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.toggleInterval();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Billing');
    expect(component.interval).toBe('annual');
  });
});
