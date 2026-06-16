import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  host: {
    '[class.full-width]': 'fullWidth()',
  },
  templateUrl: './ui-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  fullWidth = input(false);
  disabled = input(false);
  loading = input(false);
}
