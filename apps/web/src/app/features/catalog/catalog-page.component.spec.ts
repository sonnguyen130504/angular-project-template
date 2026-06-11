import { TestBed } from '@angular/core/testing';
import { CatalogPageComponent } from './catalog-page.component';

describe('CatalogPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
    }).compileComponents();
  });

  it('renders filterable catalog content', () => {
    const fixture = TestBed.createComponent(CatalogPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Shop listing');
    expect(fixture.nativeElement.textContent).toContain('Travel kit');
    expect(fixture.componentInstance.filteredProducts.length).toBe(12);
  });

  it('filters products by category', () => {
    const fixture = TestBed.createComponent(CatalogPageComponent);
    const component = fixture.componentInstance;

    component.selectedCategory = 'Accessories';
    component.minimumRating = 4;
    fixture.detectChanges();

    expect(component.filteredProducts.map((product) => product.name)).toEqual([
      'Travel kit',
      'Utility Cap',
      'Journal Cover',
      'Organizer Pouch',
    ]);
  });
});
