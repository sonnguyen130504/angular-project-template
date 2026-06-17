import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ThreeDAudioService } from '../../services/three-d-audio.service';

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

  constructor(public audio: ThreeDAudioService) {}

  selectProduct(product: ShowcaseProduct): void {
    this.audio.playClick();
    this.productSelected.emit(product);
  }
}
