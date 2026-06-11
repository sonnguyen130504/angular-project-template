import { TestBed } from '@angular/core/testing';
import { CartOrderSummaryComponent } from './cart-order-summary.component';
import { CartStateService } from '../../services/cart-state.service';

describe('CartOrderSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartOrderSummaryComponent],
      providers: [CartStateService]
    }).compileComponents();
  });

  it('renders order summary', () => {
    const fixture = TestBed.createComponent(CartOrderSummaryComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Order Summary');
  });
});
