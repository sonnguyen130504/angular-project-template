import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { GalleryStateService } from '../../services/gallery-state.service';

@Component({
  selector: 'app-component-properties-knobs',
  standalone: true,
  imports: [FormsModule, UiButtonComponent],
  templateUrl: './component-properties-knobs.component.html',
})
export class ComponentPropertiesKnobsComponent {
  public state = inject(GalleryStateService);
}

