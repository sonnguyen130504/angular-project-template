import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

type AssetItem = {
  name: string;
  folder: string;
  type: string;
  size: string;
  status: 'Ready' | 'Processing';
};

@Component({
  selector: 'app-assets-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent],
  templateUrl: './assets-page.component.html',
  styleUrl: './assets-page.component.scss',
})
export class AssetsPageComponent {
  selectedFolder = 'Product';
  selectedAssetName = 'field-jacket-front.png';
  uploadState = 'Drop files here or choose an asset.';
  readonly folders = ['Product', 'Brand', 'Invoices', 'Empty folder'];
  assets: AssetItem[] = [
    { name: 'field-jacket-front.png', folder: 'Product', type: 'PNG', size: '1.4 MB', status: 'Ready' },
    { name: 'market-tote-detail.png', folder: 'Product', type: 'PNG', size: '980 KB', status: 'Ready' },
    { name: 'brand-lockup.svg', folder: 'Brand', type: 'SVG', size: '24 KB', status: 'Ready' },
    { name: 'invoice-template.pdf', folder: 'Invoices', type: 'PDF', size: '240 KB', status: 'Processing' },
  ];

  get visibleAssets(): AssetItem[] {
    return this.assets.filter((asset) => asset.folder === this.selectedFolder);
  }

  get selectedAsset(): AssetItem | undefined {
    return this.assets.find((asset) => asset.name === this.selectedAssetName) ?? this.visibleAssets[0];
  }

  get processingAssets(): AssetItem[] {
    return this.assets.filter((asset) => asset.status === 'Processing');
  }

  get totalSizeLabel(): string {
    return '2.6 MB indexed';
  }

  folderCount(folder: string): number {
    return this.assets.filter((asset) => asset.folder === folder).length;
  }

  selectFolder(folder: string): void {
    this.selectedFolder = folder;
    this.selectedAssetName = this.visibleAssets[0]?.name ?? '';
  }

  selectAsset(asset: AssetItem): void {
    this.selectedAssetName = asset.name;
  }

  simulateUpload(): void {
    this.assets = [...this.assets, { name: 'new-campaign-image.png', folder: this.selectedFolder, type: 'PNG', size: '640 KB', status: 'Processing' }];
    this.uploadState = `Upload queued in ${this.selectedFolder}.`;
  }
}



