import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { CartStateService } from '../../services/cart-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-item-list',
  standalone: true,
  imports: [CurrencyPipe, UiButtonComponent, UiCardComponent, RouterLink, TranslocoDirective, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-item-list.component.html',
})
export class CartItemListComponent {
  public state = inject(CartStateService);
}


