import { TestBed } from '@angular/core/testing';
import { CartItemListComponent } from './cart-item-list.component';
import { CartStateService } from '../../services/cart-state.service';
import { provideRouter } from '@angular/router';

import { getTranslocoModule } from '../../../../transloco-testing.module';

describe('CartItemListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemListComponent, getTranslocoModule()],
      providers: [CartStateService, provideRouter([])]
    }).compileComponents();
  });

  it('renders cart items list', () => {
    const fixture = TestBed.createComponent(CartItemListComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Field Jacket');
  });
});
