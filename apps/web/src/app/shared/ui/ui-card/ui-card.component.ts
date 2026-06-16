import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  templateUrl: './ui-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ui-card.component.scss',
})
export class UiCardComponent {}
