import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, PageSectionComponent, UiButtonComponent, TranslocoDirective],
  templateUrl: './not-found-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {}


