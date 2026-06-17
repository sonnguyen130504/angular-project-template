import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, viewChild, signal, computed, ElementRef, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { ModelViewerPanelComponent, Hotspot } from './components/model-viewer-panel/model-viewer-panel.component';
import { ProductSwitcherComponent, ShowcaseProduct } from './components/product-switcher/product-switcher.component';
import { CameraControlsComponent } from './components/camera-controls/camera-controls.component';
import { EnvironmentSwitcherComponent, Environment } from './components/environment-switcher/environment-switcher.component';
import { ThreeDAssetCacheService } from './services/three-d-asset-cache.service';

@Component({
  selector: 'app-product-3d-showcase-page',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CurrencyPipe,
    PageSectionComponent,
    ModelViewerPanelComponent,
    ProductSwitcherComponent,
    CameraControlsComponent,
    EnvironmentSwitcherComponent,
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

  readonly currentHotspots = computed(() => this.productHotspots[this.activeProduct().id] ?? []);
  readonly currentSpecs = computed(() => this.specs[this.activeProduct().id] ?? []);

  constructor(private cacheService: ThreeDAssetCacheService) {
    // Eagerly preload all products
    const urls = this.products.map((p) => p.modelUrl);
    this.cacheService.preloadModels(urls);

    // Reactively update the resolved model URL when activeProduct changes
    effect(() => {
      const activeProd = this.activeProduct();
      this.loadModel(activeProd.modelUrl);
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
    this.activeProduct.set(product);
    this.cameraOrbit.set(this.defaultOrbit);
    this.autoRotate.set(true);
  }

  onCameraChange(orbit: string): void {
    this.cameraOrbit.set(orbit);
  }

  onAutoRotateToggle(enabled: boolean): void {
    this.autoRotate.set(enabled);
  }

  onResetCamera(): void {
    this.cameraOrbit.set(this.defaultOrbit);
    this.autoRotate.set(true);
  }

  onEnvironmentChange(env: Environment): void {
    this.activeEnvironment.set(env.id);
    this.environmentImage.set(env.image);
    this.exposure.set(env.exposure);
  }

  toggleFullscreen(): void {
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
    // Model loaded successfully
  }

  onHotspotClicked(hotspot: Hotspot): void {
    // Hotspot clicked handler
  }
}
