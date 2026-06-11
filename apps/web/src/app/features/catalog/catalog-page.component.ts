import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

type ProductCard = {
  name: string;
  category: string;
  price: number;
  stock: string;
  color: string;
  rating: number;
  tag: string;
  image: string;
};

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, PageSectionComponent, PaginatorModule, SelectModule, SliderModule, UiBadgeComponent, UiButtonComponent, UiCardComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
})
export class CatalogPageComponent {
  search = '';
  selectedCategory = 'All';
  selectedStock = 'Any';
  selectedColor = 'Any';
  sort = 'Featured';
  viewMode: 'grid' | 'list' = 'grid';
  priceRange = [20, 220];
  minimumRating = 4.0;
  loading = false;
  quickViewProduct = '';
  readonly wishlist = new Set<string>(['Travel kit']);
  readonly compare = new Set<string>();
  first = 0;
  rows = 6;

  readonly categories = ['All', 'Outerwear', 'Accessories', 'Home', 'Travel'].map((value) => ({ label: value, value }));
  readonly stockOptions = ['Any', 'In stock', 'Low stock', 'Back soon'].map((value) => ({ label: value, value }));
  readonly colorOptions = ['Any', 'Teal', 'Clay', 'Forest', 'Blue', 'Neutral', 'Red'].map((value) => ({ label: value, value }));
  readonly sortOptions = ['Featured', 'Price low', 'Price high', 'Rating'].map((value) => ({ label: value, value }));

  readonly products: ProductCard[] = [
    { name: 'Field Jacket', category: 'Outerwear', price: 128, stock: 'In stock', color: '#214b57', rating: 4.8, tag: 'Teal', image: '/assets/field_jacket_detail.png' },
    { name: 'Travel kit', category: 'Accessories', price: 46, stock: 'Low stock', color: '#9a5e34', rating: 4.6, tag: 'Clay', image: '/assets/calm_commerce_hero.png' },
    { name: 'Market Tote', category: 'Travel', price: 64, stock: 'In stock', color: '#2f6f4e', rating: 4.7, tag: 'Forest', image: '/assets/market_tote_detail.png' },
    { name: 'Desk Tray', category: 'Home', price: 38, stock: 'In stock', color: '#2f5f91', rating: 4.5, tag: 'Blue', image: '/assets/desk_tray_detail.png' },
    { name: 'Utility Cap', category: 'Accessories', price: 32, stock: 'Back soon', color: '#a13d3d', rating: 4.4, tag: 'Red', image: '/assets/calm_commerce_hero.png' },
    { name: 'Weekender', category: 'Travel', price: 186, stock: 'In stock', color: '#5d625d', rating: 4.9, tag: 'Neutral', image: '/assets/market_tote_detail.png' },
    { name: 'Commuter Backpack', category: 'Travel', price: 145, stock: 'In stock', color: '#2f6f4e', rating: 4.8, tag: 'Forest', image: '/assets/market_tote_detail.png' },
    { name: 'Journal Cover', category: 'Accessories', price: 28, stock: 'In stock', color: '#9a5e34', rating: 4.5, tag: 'Clay', image: '/assets/calm_commerce_hero.png' },
    { name: 'Wool Overshirt', category: 'Outerwear', price: 110, stock: 'In stock', color: '#5d625d', rating: 4.7, tag: 'Neutral', image: '/assets/field_jacket_detail.png' },
    { name: 'Ceramic Cup', category: 'Home', price: 24, stock: 'In stock', color: '#9a5e34', rating: 4.6, tag: 'Clay', image: '/assets/calm_commerce_hero.png' },
    { name: 'Organizer Pouch', category: 'Accessories', price: 36, stock: 'Low stock', color: '#214b57', rating: 4.4, tag: 'Teal', image: '/assets/field_jacket_detail.png' },
    { name: 'Rain Shell', category: 'Outerwear', price: 160, stock: 'In stock', color: '#2f5f91', rating: 4.9, tag: 'Blue', image: '/assets/field_jacket_detail.png' }
  ];

  get filteredProducts(): ProductCard[] {
    const term = this.search.trim().toLowerCase();
    const filtered = this.products.filter((product) => {
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesStock = this.selectedStock === 'Any' || product.stock === this.selectedStock;
      const matchesColor = this.selectedColor === 'Any' || product.tag === this.selectedColor;
      const matchesPrice = product.price >= this.priceRange[0] && product.price <= this.priceRange[1];
      const matchesRating = product.rating >= this.minimumRating;
      const matchesSearch = !term || product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
      return matchesCategory && matchesStock && matchesColor && matchesPrice && matchesRating && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (this.sort === 'Price low') return a.price - b.price;
      if (this.sort === 'Price high') return b.price - a.price;
      if (this.sort === 'Rating') return b.rating - a.rating;
      return 0;
    });
  }

  get visibleProducts(): ProductCard[] {
    return this.filteredProducts.slice(this.first, this.first + this.rows);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleWishlist(name: string): void {
    this.wishlist.has(name) ? this.wishlist.delete(name) : this.wishlist.add(name);
  }

  get comparedProducts(): ProductCard[] {
    return this.products.filter(p => this.compare.has(p.name));
  }

  clearCompare(): void {
    this.compare.clear();
  }

  toggleCompare(name: string): void {
    this.compare.has(name) ? this.compare.delete(name) : this.compare.add(name);
  }

  openQuickView(name: string): void {
    this.quickViewProduct = name;
  }

  resetFilters(): void {
    this.search = '';
    this.selectedCategory = 'All';
    this.selectedStock = 'Any';
    this.selectedColor = 'Any';
    this.priceRange = [20, 220];
    this.minimumRating = 4.0;
    this.first = 0;
  }

  pageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
  }
}




