import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiStatComponent } from '@app/shared/ui/ui-stat/ui-stat.component';

type OrderRow = {
  id: string;
  customer: string;
  channel: string;
  total: string;
  status: string;
  risk: string;
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    ChartModule,
    FormsModule,
    PageSectionComponent,
    ProgressBarModule,
    TableModule,
    ToastModule,
    TooltipModule,
    UiBadgeComponent,
    UiButtonComponent,
    UiStatComponent,
  ],
  providers: [MessageService],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  selectedRange = 'Last 7 days';
  selectedChannel = 'All channels';
  showSkeleton = false;
  statusFilter = 'All';

  readonly ranges = ['Today', 'Last 7 days', 'Last 30 days', 'Quarter'];
  readonly channels = ['All channels', 'Online store', 'Retail pickup', 'Marketplace'];
  readonly statuses = ['All', 'Paid', 'Packing', 'Review'];
  readonly metrics = [
    { label: 'Revenue', value: '$24.8k', delta: '+12.4%', tone: 'up' },
    { label: 'Orders', value: '384', delta: '+8.1%', tone: 'up' },
    { label: 'Conversion', value: '4.2%', delta: '-0.3%', tone: 'down' },
    { label: 'Returns', value: '1.1%', delta: 'stable', tone: 'flat' },
  ];
  readonly chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [42, 58, 51, 72, 68, 91, 88],
        borderColor: '#214b57',
        backgroundColor: 'rgba(33, 75, 87, 0.14)',
        tension: 0.38,
        fill: true,
      },
    ],
  };

  readonly chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(20, 17, 15, 0.08)',
        },
      },
    },
  };

  readonly orders: OrderRow[] = [
    { id: '#1048', customer: 'Mina Tran', channel: 'Online store', total: '$248', status: 'Paid', risk: 'Low' },
    { id: '#1047', customer: 'Liam Wood', channel: 'Retail pickup', total: '$128', status: 'Packing', risk: 'Medium' },
    { id: '#1046', customer: 'Noor Ali', channel: 'Online store', total: '$384', status: 'Review', risk: 'High' },
    { id: '#1045', customer: 'An Le', channel: 'Marketplace', total: '$92', status: 'Paid', risk: 'Low' },
  ];

  readonly activity = [
    { label: 'Promo CALM10 used 18 times', tone: 'positive' },
    { label: 'Travel Kit stock is below target', tone: 'warning' },
    { label: 'Checkout conversion rose 4.2%', tone: 'info' },
  ];

  readonly channelsOverview = [
    { name: 'Online store', value: '$18.2k', share: 64, tone: 'strong' },
    { name: 'Retail pickup', value: '$4.1k', share: 18, tone: 'stable' },
    { name: 'Marketplace', value: '$2.5k', share: 10, tone: 'watch' },
  ];

  readonly funnel = [
    { stage: 'Sessions', value: '18.4k', rate: 100 },
    { stage: 'Product views', value: '9.6k', rate: 52 },
    { stage: 'Add to cart', value: '2.1k', rate: 22 },
    { stage: 'Checkout', value: '884', rate: 9 },
    { stage: 'Paid orders', value: '384', rate: 4 },
  ];

  readonly alerts = [
    { label: 'Travel Kit needs reorder before Friday', level: 'High', owner: 'Inventory' },
    { label: '3 reviewed orders waiting for fraud decision', level: 'Medium', owner: 'Ops' },
    { label: 'Express pickup SLA is below target', level: 'Medium', owner: 'Fulfillment' },
  ];

  readonly serviceLevels = [
    { label: 'Payment success', value: 97 },
    { label: 'Ship within SLA', value: 86 },
    { label: 'Support first reply', value: 74 },
  ];

  readonly inventory = [
    { item: 'Travel Kit', value: 22, status: 'Reorder' },
    { item: 'Field Jacket', value: 64, status: 'Healthy' },
    { item: 'Market Tote', value: 38, status: 'Watch' },
  ];

  get filteredOrders(): OrderRow[] {
    return this.statusFilter === 'All' ? this.orders : this.orders.filter((order) => order.status === this.statusFilter);
  }

  private readonly messages = inject(MessageService);

  refresh(): void {
    this.showSkeleton = true;
    window.setTimeout(() => {
      this.showSkeleton = false;
    }, 500);
    this.messages.add({
      severity: 'success',
      summary: 'Dashboard refreshed',
      detail: `${this.selectedRange} metrics refreshed for ${this.selectedChannel}.`,
    });
  }
}




