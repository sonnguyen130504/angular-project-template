import { Component, inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { DialogModule } from 'primeng/dialog';
import { CarbonTerminalComponent } from './components/carbon-terminal/carbon-terminal.component';
import { ComponentPropertiesKnobsComponent } from './components/component-properties-knobs/component-properties-knobs.component';
import { ComponentPreviewPaneComponent } from './components/component-preview-pane/component-preview-pane.component';
import { GalleryStateService } from './services/gallery-state.service';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-component-gallery-page',
  standalone: true,
  imports: [
    DialogModule,
    PageSectionComponent,
    UiBadgeComponent,
    UiButtonComponent,
    CarbonTerminalComponent,
    ComponentPropertiesKnobsComponent,
    ComponentPreviewPaneComponent,
    TranslocoDirective
  ],
  providers: [GalleryStateService],
  templateUrl: './component-gallery-page.component.html',
  styleUrl: './component-gallery-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ComponentGalleryPageComponent {
  public state = inject(GalleryStateService);
}



