import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, input, output, ElementRef, viewChild, AfterViewInit, effect, signal } from '@angular/core';

export type Hotspot = {
  name: string;
  position: string;
  normal: string;
  label: string;
  description: string;
};

export type MaterialProps = {
  color?: [number, number, number, number];
  roughness?: number;
  metallic?: number;
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
  customization = input<Record<string, MaterialProps>>({});
  variantName = input<string | null>(null);

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

    // Apply material customization reactively
    effect(() => {
      this.applyCustomizations().catch((err) =>
        console.error('Error in customizations effect:', err)
      );
    });

    // Apply active design variant reactively
    effect(() => {
      const viewer = this.viewerRef()?.nativeElement;
      const variant = this.variantName();
      if (!viewer) return;
      
      // Update variant attribute directly on the DOM element
      if (variant) {
        viewer.setAttribute('variant-name', variant);
      } else {
        viewer.removeAttribute('variant-name');
      }
    });
  }

  ngAfterViewInit(): void {
    const viewer = this.viewerRef()?.nativeElement;
    if (viewer) {
      const handleLoad = () => {
        this.isLoading.set(false);
        this.applyCustomizations().catch((err) =>
          console.error('Error applying customizations on load:', err)
        );
        this.modelLoaded.emit();
      };

      if (viewer.loaded || (viewer.model && viewer.model.materials)) {
        handleLoad();
      } else {
        viewer.addEventListener('load', handleLoad);
      }
    }
  }

  async applyCustomizations(): Promise<void> {
    const viewer = this.viewerRef()?.nativeElement;
    const custom = this.customization();
    if (!viewer || !viewer.model || !viewer.model.materials) return;

    for (const [materialName, props] of Object.entries(custom)) {
      // Find material by name (standard case-insensitive search)
      const material = viewer.model.materials.find(
        (m: any) => m.name.toLowerCase() === materialName.toLowerCase()
      );

      if (!material) continue;

      try {
        if (typeof material.ensureLoaded === 'function') {
          await material.ensureLoaded();
        }

        if (props.color) {
          // Clear texture to let solid color show
          if (
            material.pbrMetallicRoughness.baseColorTexture &&
            material.pbrMetallicRoughness.baseColorTexture.texture
          ) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(null);
          }
          material.pbrMetallicRoughness.setBaseColorFactor(props.color);
        }
        if (props.roughness !== undefined) {
          material.pbrMetallicRoughness.setRoughnessFactor(props.roughness);
        }
        if (props.metallic !== undefined) {
          material.pbrMetallicRoughness.setMetallicFactor(props.metallic);
        }
      } catch (err) {
        console.error('Error applying customization to material:', materialName, err);
      }
    }
  }

  onHotspotClick(hotspot: Hotspot): void {
    this.activeHotspot = this.activeHotspot === hotspot ? null : hotspot;
    this.hotspotClicked.emit(hotspot);
  }
}
