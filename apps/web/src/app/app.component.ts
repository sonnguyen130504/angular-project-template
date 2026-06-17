import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { ThreeDAssetCacheService } from './features/product-3d-showcase/services/three-d-asset-cache.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private cache = inject(ThreeDAssetCacheService);

  readonly preloadingAssets = [
    'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb'
  ];

  ngOnInit(): void {
    // Eagerly prefetch 3D models into offline Cache API index immediately at startup
    this.cache.preloadModels(this.preloadingAssets);
  }
}
