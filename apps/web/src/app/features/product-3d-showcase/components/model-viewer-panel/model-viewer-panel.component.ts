import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, input, output, ElementRef, viewChild, AfterViewInit, effect, signal } from '@angular/core';

export type Hotspot = {
  name: string;
  position: string;
  normal: string;
  label: string;
  description: string;
};

@Component({
  selector: 'app-model-viewer-panel',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './model-viewer-panel.component.html',
  styleUrl: './model-viewer-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelViewerPanelComponent implements AfterViewInit {
  modelUrl = input.required<string>();
  posterUrl = input<string>('');
  cameraOrbit = input<string>('45deg 55deg 4m');
  environmentImage = input<string>('');
  autoRotate = input<boolean>(true);
  hotspots = input<Hotspot[]>([]);
  shadowIntensity = input<number>(1);
  exposure = input<number>(1);

  modelLoaded = output<void>();
  hotspotClicked = output<Hotspot>();

  readonly viewerRef = viewChild<ElementRef>('viewer');

  activeHotspot: Hotspot | null = null;
  readonly isLoading = signal(true);

  constructor() {
    // Reactively sync auto-rotate and camera-orbit to the model-viewer element
    effect(() => {
      const viewer = this.viewerRef()?.nativeElement;
      if (!viewer) return;

      const shouldRotate = this.autoRotate();
      if (shouldRotate) {
        viewer.setAttribute('auto-rotate', '');
      } else {
        viewer.removeAttribute('auto-rotate');
      }
    });

    effect(() => {
      const viewer = this.viewerRef()?.nativeElement;
      if (!viewer) return;
      viewer.setAttribute('camera-orbit', this.cameraOrbit());
    });

    // Reset loading state when modelUrl changes
    effect(() => {
      this.modelUrl();
      this.isLoading.set(true);
    });
  }

  ngAfterViewInit(): void {
    const viewer = this.viewerRef()?.nativeElement;
    if (viewer) {
      viewer.addEventListener('load', () => {
        this.isLoading.set(false);
        this.modelLoaded.emit();
      });
    }
  }

  onHotspotClick(hotspot: Hotspot): void {
    this.activeHotspot = this.activeHotspot === hotspot ? null : hotspot;
    this.hotspotClicked.emit(hotspot);
  }
}
