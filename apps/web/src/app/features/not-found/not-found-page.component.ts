import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, PageSectionComponent, UiButtonComponent],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {}


