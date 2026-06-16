import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ui-badge',
  standalone: true,
  host: {
    '[class.positive]': 'tone() === "positive"',
    '[class.negative]': 'tone() === "negative"',
    '[class.warning]': 'tone() === "warning"',
    '[class.info]': 'tone() === "info"',
  },
  templateUrl: './ui-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ui-badge.component.scss',
})
export class UiBadgeComponent {
  tone = input<'default' | 'positive' | 'negative' | 'warning' | 'info' | 'neutral'>('default');
}

