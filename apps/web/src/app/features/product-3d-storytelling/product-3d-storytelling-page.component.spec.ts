import { TestBed } from '@angular/core/testing';
import { Product3DStorytellingPageComponent } from './product-3d-storytelling-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('Product3DStorytellingPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Product3DStorytellingPageComponent, getTranslocoModule()],
    }).compileComponents();
  });

  it('renders interactive 3D storytelling slides and text layouts', () => {
    const fixture = TestBed.createComponent(Product3DStorytellingPageComponent);
    fixture.detectChanges();

    const elementText = fixture.nativeElement.textContent;
    expect(elementText).toContain('Aeronaut Suit Model X');
    expect(elementText).toContain('01 / 05');
    expect(elementText).toContain('Anti-Reflective Visor Shield');
    expect(elementText).toContain('Life Support Connection Port');
  });

  it('should render model-viewer element correctly after load completes', () => {
    const fixture = TestBed.createComponent(Product3DStorytellingPageComponent);
    const component = fixture.componentInstance;
    
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('model-viewer')).toBeNull();

    component.onModelLoad();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('model-viewer')).toBeTruthy();
  });

  it('manages loading state correctly', () => {
    const fixture = TestBed.createComponent(Product3DStorytellingPageComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.isLoading()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.loading-overlay')).toBeTruthy();

    component.onModelLoad();
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.loading-overlay')).toBeNull();
  });
});
