import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { CartStateService } from '../../services/cart-state.service';

@Component({
  selector: 'app-cart-order-summary',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, UiCardComponent],
  templateUrl: './cart-order-summary.component.html',
})
export class CartOrderSummaryComponent {
  public state = inject(CartStateService);
}

