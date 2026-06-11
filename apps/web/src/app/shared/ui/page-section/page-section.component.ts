import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-section',
  standalone: true,
  templateUrl: './page-section.component.html',
  styleUrl: './page-section.component.scss',
})
export class PageSectionComponent {
  title = input('');
  subtitle = input('');
}
