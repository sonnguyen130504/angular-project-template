import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, viewChild, signal, computed, ElementRef, effect } from '@angular/core';
import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { ModelViewerPanelComponent, Hotspot, MaterialProps } from './components/model-viewer-panel/model-viewer-panel.component';
import { ProductSwitcherComponent, ShowcaseProduct } from './components/product-switcher/product-switcher.component';
import { CameraControlsComponent } from './components/camera-controls/camera-controls.component';
import { EnvironmentSwitcherComponent, Environment } from './components/environment-switcher/environment-switcher.component';
import { ThreeDAssetCacheService } from './services/three-d-asset-cache.service';
import { ThreeDAudioService } from './services/three-d-audio.service';

export type CustomizerColor = {
  name: string;
  rgba: [number, number, number, number];
  hex: string;
};

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-product-3d-showcase-page',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CurrencyPipe,
    DecimalPipe,
    TitleCasePipe,
    PageSectionComponent,
    ModelViewerPanelComponent,
    ProductSwitcherComponent,
    CameraControlsComponent,
    EnvironmentSwitcherComponent,
    TranslocoDirective
  ],
  templateUrl: './product-3d-showcase-page.component.html',
  styleUrl: './product-3d-showcase-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Product3DShowcasePageComponent {
  readonly showcaseContainer = viewChild<ElementRef>('showcaseContainer');

  readonly defaultOrbit = '45deg 55deg 4m';

  // All mutable UI state as signals for OnPush compatibility
  readonly cameraOrbit = signal(this.defaultOrbit);
  readonly autoRotate = signal(true);
  readonly isFullscreen = signal(false);
  readonly activeEnvironment = signal<string>('neutral');
  readonly environmentImage = signal('');
  readonly exposure = signal(1);

  // Cache & Loading states
  readonly resolvedModelUrl = signal<string>('');
  readonly isModelDownloading = signal<boolean>(false);
  readonly modelDownloadProgress = signal<number>(0);

  // Material Customizer State
  readonly customizations = signal<Record<string, Record<string, MaterialProps>>>({});
  readonly selectedPart = signal<string>('');
  
  // Shoe variant styling state
  readonly selectedVariant = signal<string>('midnight');

  // Mute state exposing from audio service
  readonly isMuted = this.audioService.isMuted;

  readonly premiumColors: CustomizerColor[] = [
    { name: 'Titanium Silver', rgba: [0.8, 0.8, 0.82, 1], hex: '#cccccc' },
    { name: 'Obsidian Black', rgba: [0.1, 0.1, 0.12, 1], hex: '#1a1a1a' },
    { name: 'Sunset Orange', rgba: [0.95, 0.35, 0.15, 1], hex: '#f25a24' },
    { name: 'Midnight Navy', rgba: [0.1, 0.2, 0.4, 1], hex: '#1a3366' },
    { name: 'Forest Green', rgba: [0.15, 0.35, 0.2, 1], hex: '#265933' },
    { name: 'Sakura Pink', rgba: [0.95, 0.65, 0.7, 1], hex: '#f2a6b2' },
  ];

  readonly products: ShowcaseProduct[] = [
    {
      id: 'astronaut',
      name: 'Astronaut Figurine',
      tagline: 'Collectible space explorer',
      price: 128,
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      posterUrl: '/assets/3d-showcase/astronaut_poster.png',
      accent: 'var(--accent)',
    },
    {
      id: 'helmet',
      name: 'Damaged Helmet',
      tagline: 'Sci-fi battle helmet',
      price: 256,
      modelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
      posterUrl: '/assets/3d-showcase/helmet_poster.png',
      accent: '#2f6f4e',
    },
    {
      id: 'shoe',
      name: 'Air Max Runner',
      tagline: 'Premium athletic footwear',
      price: 189,
      modelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
      posterUrl: '/assets/3d-showcase/shoe_poster.png',
      accent: '#9a5e34',
    },
  ];

  readonly activeProduct = signal<ShowcaseProduct>(this.products[0]);

  // Hotspot positions matched to actual model coordinate systems
  readonly productHotspots: Record<string, Hotspot[]> = {
    astronaut: [
      { name: 'visor', position: '0m 1.55m 0.15m', normal: '0 0.3 1', label: 'Reflective Visor', description: 'Gold-coated polycarbonate shield' },
      { name: 'suit', position: '0.25m 0.95m 0.18m', normal: '1 0 0.5', label: 'Pressure Suit', description: 'Multi-layer insulation fabric' },
      { name: 'pack', position: '0m 1.1m -0.2m', normal: '0 0 -1', label: 'Life Support', description: 'Portable life support system' },
    ],
    helmet: [
      { name: 'visor', position: '0m 0.05m 0.15m', normal: '0 0 1', label: 'Visor', description: 'Gold-tinted reflective visor' },
      { name: 'damage', position: '0.08m 0.12m -0.05m', normal: '1 0.5 -0.5', label: 'Damage', description: 'Battle-scarred composite plating' },
    ],
    shoe: [
      { name: 'sole', position: '0m 0.01m 0.04m', normal: '0 -1 0.3', label: 'Air Max Sole', description: 'Visible Air cushioning unit' },
      { name: 'upper', position: '0m 0.09m 0.02m', normal: '0 1 0.5', label: 'Flyknit Upper', description: 'Breathable engineered knit' },
    ],
  };

  readonly specs: Record<string, { label: string; value: string }[]> = {
    astronaut: [
      { label: 'Height', value: '32 cm' },
      { label: 'Weight', value: '340 g' },
      { label: 'Material', value: 'PBR Resin' },
      { label: 'Articulation', value: '12 points' },
      { label: 'Scale', value: '1:12' },
    ],
    helmet: [
      { label: 'Origin', value: 'Sci-fi Sample' },
      { label: 'Material', value: 'Corroded Metal' },
      { label: 'Weight', value: '1.2 kg' },
      { label: 'Visor', value: 'Gold-tinted Glass' },
      { label: 'Condition', value: 'Battle damaged' },
    ],
    shoe: [
      { label: 'Size Range', value: 'US 6–13' },
      { label: 'Weight', value: '295 g' },
      { label: 'Upper', value: 'Flyknit Mesh' },
      { label: 'Sole', value: 'Air Max Unit' },
      { label: 'Colorway', value: 'Midnight Teal' },
    ],
  };

  // Define customizable parts globally (which maps directly to GLB materials)
  readonly productCustomizableParts: Record<string, { label: string; name: string }[]> = {
    astronaut: [{ label: 'Astronaut Suit', name: 'Astronaut_mat' }],
    helmet: [{ label: 'Helmet Shell', name: 'Material_MR' }],
    shoe: [{ label: 'Entire Shoe base', name: 'phong1SG' }],
  };

  // Supported built-in variants for KHR_materials_variants (like for the shoe)
  readonly shoeVariants = ['midnight', 'beach', 'street'];

  readonly currentHotspots = computed(() => this.productHotspots[this.activeProduct().id] ?? []);
  readonly currentSpecs = computed(() => this.specs[this.activeProduct().id] ?? []);
  readonly currentParts = computed(() => this.productCustomizableParts[this.activeProduct().id] ?? []);
  
  // Customization mapping resolver
  readonly currentCustomization = computed(() => this.customizations()[this.activeProduct().id] ?? {});

  // Get active configurations for selected part
  readonly selectedPartProps = computed(() => {
    const part = this.selectedPart();
    return this.currentCustomization()[part] ?? { roughness: 0.5, metallic: 0.5 };
  });

  constructor(
    private cacheService: ThreeDAssetCacheService,
    private audioService: ThreeDAudioService
  ) {
    // Eagerly preload all products
    const urls = this.products.map((p) => p.modelUrl);
    this.cacheService.preloadModels(urls);

    // Reactively update the resolved model URL when activeProduct changes
    effect(() => {
      const activeProd = this.activeProduct();
      this.loadModel(activeProd.modelUrl);
      
      // Auto-select first customizable part of new active product
      const parts = this.productCustomizableParts[activeProd.id] ?? [];
      if (parts.length > 0) {
        this.selectedPart.set(parts[0].name);
      } else {
        this.selectedPart.set('');
      }

      // Reset shoe variant if we switch to the shoe
      if (activeProd.id === 'shoe') {
        this.selectedVariant.set('midnight');
      }
    }, { allowSignalWrites: true });
  }

  private async loadModel(url: string): Promise<void> {
    this.isModelDownloading.set(true);
    this.modelDownloadProgress.set(0);

    const progressTrackingInterval = setInterval(() => {
      const progress = this.cacheService.downloadProgress()[url] ?? 0;
      this.modelDownloadProgress.set(progress);
    }, 50);

    try {
      const resolved = await this.cacheService.getOrCacheAsset(url);
      this.resolvedModelUrl.set(resolved);
    } catch (err) {
      console.error('Failed to load 3D model:', err);
      this.resolvedModelUrl.set(url); // Fallback to original URL
    } finally {
      clearInterval(progressTrackingInterval);
      this.isModelDownloading.set(false);
    }
  }

  onProductSelected(product: ShowcaseProduct): void {
    if (product.id === this.activeProduct().id) return;
    this.audioService.playClick();
    this.activeProduct.set(product);
    this.cameraOrbit.set(this.defaultOrbit);
    this.autoRotate.set(true);
  }

  onCameraChange(orbit: string): void {
    this.audioService.playClick();
    this.cameraOrbit.set(orbit);
  }

  onAutoRotateToggle(enabled: boolean): void {
    this.audioService.playClick();
    this.autoRotate.set(enabled);
  }

  onResetCamera(): void {
    this.audioService.playClick();
    this.cameraOrbit.set(this.defaultOrbit);
    this.autoRotate.set(true);
  }

  onEnvironmentChange(env: Environment): void {
    this.audioService.playClick();
    this.activeEnvironment.set(env.id);
    this.environmentImage.set(env.image);
    this.exposure.set(env.exposure);
  }

  toggleFullscreen(): void {
    this.audioService.playClick();
    const container = this.showcaseContainer()?.nativeElement;
    if (!container) return;

    if (!this.isFullscreen()) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    this.isFullscreen.update((v) => !v);

    // Listen for fullscreen exit via ESC key
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullscreen.set(false);
      }
    }, { once: true });
  }

  onModelLoaded(): void {
    // Play success chime when 3D assets are fully loaded in WebGL
    this.audioService.playSuccess();
  }

  onHotspotClicked(hotspot: Hotspot): void {
    this.audioService.playClick();
  }

  // Audio actions
  toggleMute(): void {
    this.audioService.toggleMute();
  }

  playTick(): void {
    this.audioService.playTick();
  }

  playClick(): void {
    this.audioService.playClick();
  }

  // Variant Switcher (for KHR_materials_variants)
  onVariantSelected(variant: string): void {
    this.audioService.playClick();
    this.selectedVariant.set(variant);
    
    // Clear custom colors on this shoe so the variant texture displays properly
    const productId = this.activeProduct().id;
    this.customizations.update((cust) => {
      return {
        ...cust,
        [productId]: {},
      };
    });
  }

  // Customizer actions
  onPartSelected(partName: string): void {
    this.audioService.playClick();
    this.selectedPart.set(partName);
  }

  isSameColor(c1: any, c2: any): boolean {
    if (!c1 || !c2) return false;
    return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3];
  }

  onColorSelected(color: CustomizerColor): void {
    this.audioService.playClick();
    const productId = this.activeProduct().id;
    const part = this.selectedPart();
    if (!part) return;

    this.customizations.update((cust) => {
      const prodCust = cust[productId] ?? {};
      const partCust = prodCust[part] ?? {};
      return {
        ...cust,
        [productId]: {
          ...prodCust,
          [part]: {
            ...partCust,
            color: color.rgba,
          },
        },
      };
    });
  }

  onRoughnessChanged(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const val = parseFloat(inputEl.value);
    const productId = this.activeProduct().id;
    const part = this.selectedPart();
    if (!part) return;

    this.customizations.update((cust) => {
      const prodCust = cust[productId] ?? {};
      const partCust = prodCust[part] ?? {};
      return {
        ...cust,
        [productId]: {
          ...prodCust,
          [part]: {
            ...partCust,
            roughness: val,
          },
        },
      };
    });
  }

  onMetallicChanged(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const val = parseFloat(inputEl.value);
    const productId = this.activeProduct().id;
    const part = this.selectedPart();
    if (!part) return;

    this.customizations.update((cust) => {
      const prodCust = cust[productId] ?? {};
      const partCust = prodCust[part] ?? {};
      return {
        ...cust,
        [productId]: {
          ...prodCust,
          [part]: {
            ...partCust,
            metallic: val,
          },
        },
      };
    });
  }
}
