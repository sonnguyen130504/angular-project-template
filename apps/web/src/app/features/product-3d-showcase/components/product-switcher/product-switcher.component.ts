import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type ShowcaseProduct = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  modelUrl: string;
  posterUrl: string;
  accent: string;
};

@Component({
  selector: 'app-product-switcher',
  standalone: true,
  templateUrl: './product-switcher.component.html',
  styleUrl: './product-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSwitcherComponent {
  products = input.required<ShowcaseProduct[]>();
  activeId = input.required<string>();
  productSelected = output<ShowcaseProduct>();

  selectProduct(product: ShowcaseProduct): void {
    this.productSelected.emit(product);
  }
}
