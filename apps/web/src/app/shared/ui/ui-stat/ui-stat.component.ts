import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-stat',
  standalone: true,
  templateUrl: './ui-stat.component.html',
  styleUrl: './ui-stat.component.scss',
})
export class UiStatComponent {
  label = input('');
}
