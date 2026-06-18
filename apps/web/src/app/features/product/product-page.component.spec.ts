import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductPageComponent } from './product-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('ProductPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ProductPageComponent, getTranslocoModule()],
    }).compileComponents();
  });

  it('renders product detail content', () => {
    const fixture = TestBed.createComponent(ProductPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Product detail');
    expect(fixture.nativeElement.textContent).toContain('Field Jacket');
    expect(fixture.nativeElement.textContent).toContain('Frequently bought together');
  });

  it('updates quantity total', () => {
    const fixture = TestBed.createComponent(ProductPageComponent);
    const component = fixture.componentInstance;

    component.increment();
    fixture.detectChanges();

    expect(component.quantity).toBe(2);
    expect(component.total).toBe(256);
  });
});
