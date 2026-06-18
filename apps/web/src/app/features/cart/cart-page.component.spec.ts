import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartPageComponent } from './cart-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('CartPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPageComponent, getTranslocoModule()],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders cart items and totals', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Shopping Bag');
    expect(text).toContain('Field Jacket');
    expect(text).toContain('Travel Kit');
    expect(text).toContain('$220'); // Subtotal
    expect(text).toContain('$226'); // Grand Total
    expect(text).toContain('Customize your order');
  });

  it('updates quantity when incrementing and decrementing', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.state.increment(1);
    fixture.detectChanges();
    expect(component.state.items.find((item) => item.id === 1)?.quantity).toBe(2);
    expect(component.state.subtotal).toBe(348);

    component.state.decrement(1);
    fixture.detectChanges();
    expect(component.state.items.find((item) => item.id === 1)?.quantity).toBe(1);
    expect(component.state.subtotal).toBe(220);
  });

  it('shows the empty state when all items are removed', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.state.remove(1);
    component.state.remove(2);
    fixture.detectChanges();

    expect(component.state.items.length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Your shopping bag is empty');
  });

  it('should apply styles to nested sub-components due to disabled encapsulation', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    fixture.detectChanges();

    const summaryCard = fixture.nativeElement.querySelector('.summary-card');
    expect(summaryCard).toBeTruthy();
    
    // Verify style rule application by inspecting computed styles
    const computed = getComputedStyle(summaryCard);
    expect(computed.padding).toBe('24px');
  });
});
