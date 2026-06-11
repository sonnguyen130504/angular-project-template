import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { GalleryStateService } from '../../services/gallery-state.service';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { SpinnerLoaderComponent } from '../spinner-loader/spinner-loader.component';

@Component({
  selector: 'app-component-preview-pane',
  standalone: true,
  imports: [FormsModule, UiBadgeComponent, UiButtonComponent, UiCardComponent, CommandPaletteComponent, SkeletonLoaderComponent, SpinnerLoaderComponent],
  templateUrl: './component-preview-pane.component.html',
})
export class ComponentPreviewPaneComponent {
  public state = inject(GalleryStateService);
}



