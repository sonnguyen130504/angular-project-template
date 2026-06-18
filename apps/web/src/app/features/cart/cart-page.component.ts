import { Component, inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { StepperModule } from 'primeng/stepper';
import { CartItemListComponent } from './components/cart-item-list/cart-item-list.component';
import { CartOrderSummaryComponent } from './components/cart-order-summary/cart-order-summary.component';
import { CartStateService } from './services/cart-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    PageSectionComponent,
    StepperModule,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    CartItemListComponent,
    CartOrderSummaryComponent,
    RouterLink,
    TranslocoDirective,
    TranslocoPipe
],
  providers: [CartStateService],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CartPageComponent {
  public state = inject(CartStateService);
}




