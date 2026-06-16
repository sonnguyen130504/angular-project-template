import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ui-stat',
  standalone: true,
  templateUrl: './ui-stat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ui-stat.component.scss',
})
export class UiStatComponent {
  label = input('');
}
