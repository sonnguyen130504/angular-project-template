import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [CurrencyPipe, PageSectionComponent, UiBadgeComponent, UiButtonComponent],
  templateUrl: './billing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './billing-page.component.scss',
})
export class BillingPageComponent {
  interval: 'monthly' | 'annual' = 'monthly';
  failedPayment = true;
  readonly plans = [
    { name: 'Starter', monthly: 29, annual: 290, current: false },
    { name: 'Growth', monthly: 79, annual: 790, current: true },
    { name: 'Scale', monthly: 149, annual: 1490, current: false },
  ];
  readonly usage = [
    { label: 'Orders', value: 74 },
    { label: 'Seats', value: 62 },
    { label: 'Storage', value: 48 },
  ];
  readonly planFeatures = [
    { label: 'Team seats', Starter: '3', Growth: '12', Scale: '40' },
    { label: 'Automation runs', Starter: '1k', Growth: '20k', Scale: '100k' },
    { label: 'Support SLA', Starter: 'Email', Growth: 'Priority', Scale: 'Dedicated' },
  ];
  readonly invoices = [
    { id: 'INV-2048', date: 'Jun 1, 2026', amount: 79, status: 'Paid' },
    { id: 'INV-2047', date: 'May 1, 2026', amount: 79, status: 'Paid' },
    { id: 'INV-2046', date: 'Apr 1, 2026', amount: 79, status: 'Failed' },
  ];

  toggleInterval(): void {
    this.interval = this.interval === 'monthly' ? 'annual' : 'monthly';
  }

  dismissPaymentWarning(): void {
    this.failedPayment = false;
  }

  price(plan: { monthly: number; annual: number }): number {
    return this.interval === 'monthly' ? plan.monthly : plan.annual;
  }

  get renewalTotal(): number {
    const current = this.plans.find((plan) => plan.current) ?? this.plans[0];
    return this.price(current);
  }
}



