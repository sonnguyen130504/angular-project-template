import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-page-section',
  standalone: true,
  templateUrl: './page-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-section.component.scss',
})
export class PageSectionComponent {
  title = input('');
  subtitle = input('');
}
