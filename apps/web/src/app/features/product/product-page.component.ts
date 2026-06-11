import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

type ProductImage = {
  label: string;
  color: string;
  note: string;
  image: string;
};

type RelatedProduct = {
  name: string;
  price: number;
  accent: string;
  image: string;
};

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    AccordionModule,
    CurrencyPipe,
    DialogModule,
    PageSectionComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    FormsModule,
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  readonly price = 128;
  readonly lowStockThreshold = 4;
  readonly colors = [
    { label: 'Deep teal', value: '#214b57', stock: 3 },
    { label: 'Clay', value: '#9a5e34' },
    { label: 'Forest', value: '#2f6f4e', stock: 12 },
  ];
  readonly sizes = ['XS', 'S', 'M', 'L', 'XL'];
  readonly images: ProductImage[] = [
    { label: 'Front View', color: '#214b57', note: 'Structured front profile', image: '/assets/field_jacket_detail.png' },
    { label: 'Fabric Detail', color: '#8b6f4f', note: 'Heavy cotton canvas weave', image: '/assets/calm_commerce_hero.png' },
    { label: 'Pack View', color: '#2f6f4e', note: 'Compact folded travel setup', image: '/assets/market_tote_detail.png' },
  ];
  readonly recommendations: RelatedProduct[] = [
    { name: 'Travel kit', price: 46, accent: 'var(--accent-2)', image: '/assets/calm_commerce_hero.png' },
    { name: 'Market tote', price: 64, accent: 'var(--accent)', image: '/assets/market_tote_detail.png' },
    { name: 'Desk tray', price: 38, accent: '#2f5f91', image: '/assets/desk_tray_detail.png' },
  ];
  
  bundle = [
    { name: 'Field Jacket', price: 128, included: true, disabled: true },
    { name: 'Travel kit', price: 46, included: true, disabled: false },
    { name: 'Care spray', price: 18, included: false, disabled: false },
  ];

  selectedColor = this.colors[0].value;
  selectedSize = 'M';
  selectedImage = this.images[0];
  quantity = 1;
  previewOpen = false;
  addedToCart = false;
  isAdding = false;

  get total(): number {
    return this.price * this.quantity;
  }

  get selectedColorName(): string {
    return this.colors.find((color) => color.value === this.selectedColor)?.label ?? 'Custom';
  }

  get selectedStock(): number {
    return this.colors.find((color) => color.value === this.selectedColor)?.stock ?? 8;
  }

  get bundleTotal(): number {
    const sum = this.bundle.filter((item) => item.included).reduce((total, item) => total + item.price, 0);
    // Bundle discount: 10% off if multiple items are checked
    const checkedCount = this.bundle.filter((item) => item.included).length;
    return checkedCount > 1 ? sum * 0.9 : sum;
  }

  increment(): void {
    this.quantity += 1;
  }

  decrement(): void {
    this.quantity = Math.max(this.quantity - 1, 1);
  }

  selectImage(image: ProductImage): void {
    this.selectedImage = image;
  }

  toggleBundleItem(index: number): void {
    if (this.bundle[index].disabled) return;
    this.bundle[index].included = !this.bundle[index].included;
  }

  addToCart(): void {
    if (this.isAdding) return;
    this.isAdding = true;
    setTimeout(() => {
      this.isAdding = false;
      this.addedToCart = true;
      setTimeout(() => {
        this.addedToCart = false;
      }, 3000);
    }, 800);
  }
}




