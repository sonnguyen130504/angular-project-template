import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { UiStatComponent } from '@app/shared/ui/ui-stat/ui-stat.component';

@Component({
  selector: 'app-data-visualization-page',
  standalone: true,
  imports: [ChartModule, FormsModule, PageSectionComponent, TableModule, UiBadgeComponent, UiCardComponent, UiStatComponent],
  templateUrl: './data-visualization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './data-visualization-page.component.scss',
})
export class DataVisualizationPageComponent {
  readonly rangeOptions = ['Last 6 months', 'Year to date', 'Rolling 12 months'];
  selectedRange = this.rangeOptions[0];
  chartState: 'ready' | 'loading' | 'empty' | 'error' = 'ready';

  readonly salesChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [18, 22, 28, 24, 34, 42],
        backgroundColor: '#214b57',
        borderRadius: 8,
      },
      {
        label: 'Margin',
        data: [8, 11, 13, 12, 18, 21],
        backgroundColor: '#2f6f4e',
        borderRadius: 8,
      },
    ],
  };

  readonly mixChart = {
    labels: ['Outerwear', 'Accessories', 'Travel', 'Home'],
    datasets: [
      {
        data: [38, 26, 22, 14],
        backgroundColor: ['#214b57', '#9a5e34', '#2f6f4e', '#2f5f91'],
      },
    ],
  };

  readonly revenueLineChart = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Online',
        data: [12, 18, 16, 24, 28, 33],
        borderColor: '#235565',
        backgroundColor: 'rgba(35, 85, 101, 0.12)',
        tension: 0.38,
        fill: true,
      },
      {
        label: 'Retail',
        data: [8, 9, 11, 10, 14, 16],
        borderColor: '#2f6f4e',
        backgroundColor: 'rgba(47, 111, 78, 0.08)',
        tension: 0.38,
        fill: true,
      },
    ],
  };

  readonly stackedChart = {
    labels: ['Outerwear', 'Accessories', 'Travel', 'Home'],
    datasets: [
      { label: 'New', data: [16, 14, 11, 7], backgroundColor: '#235565', borderRadius: 8 },
      { label: 'Returning', data: [22, 12, 11, 7], backgroundColor: '#2f6f4e', borderRadius: 8 },
    ],
  };

  readonly chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  readonly stackedOptions = {
    ...this.chartOptions,
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, border: { display: false }, grid: { color: 'rgba(35, 85, 101, 0.1)' } },
    },
  };

  readonly anomalies = [
    { label: 'Marketplace revenue dipped below baseline', level: 'Watch', value: '-8%' },
    { label: 'Accessories margin outperformed forecast', level: 'Strong', value: '+11%' },
    { label: 'Home category has low sample size', level: 'Low data', value: '14%' },
  ];

  readonly rows = [
    { segment: 'Returning customers', revenue: '$18.4k', change: '+12%', health: 'Strong', healthTone: 'strong', share: '72%' },
    { segment: 'New customers', revenue: '$9.8k', change: '+6%', health: 'Stable', healthTone: 'stable', share: '44%' },
    { segment: 'Wholesale', revenue: '$6.2k', change: '-2%', health: 'Watch', healthTone: 'watch', share: '28%' },
  ];

  setChartState(state: typeof this.chartState): void {
    this.chartState = state;
  }
}




