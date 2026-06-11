import { TestBed } from '@angular/core/testing';
import { ComponentGalleryPageComponent } from './component-gallery-page.component';

describe('ComponentGalleryPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentGalleryPageComponent],
    }).compileComponents();
  });

  it('renders the interactive explorer labels', () => {
    const fixture = TestBed.createComponent(ComponentGalleryPageComponent);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Interactive Component Explorer');
    expect(textContent).toContain('Properties Knobs');
    expect(textContent).toContain('Canvas Preview');
    expect(textContent).toContain('workspace-cli');
    expect(textContent).toContain('Product app patterns');
  });

  it('sets default interactive knob properties', () => {
    const fixture = TestBed.createComponent(ComponentGalleryPageComponent);
    const component = fixture.componentInstance;
    expect(component.state.btnVariant).toBe('primary');
    expect(component.state.btnSize).toBe('md');
    expect(component.state.badgeTone).toBe('neutral');
    expect(component.state.cardShadow).toBe('soft');
  });

  it('should apply page styles to explorer sections due to disabled encapsulation', () => {
    const fixture = TestBed.createComponent(ComponentGalleryPageComponent);
    fixture.detectChanges();

    const intro = fixture.nativeElement.querySelector('.explorer-intro');
    expect(intro).toBeTruthy();

    const computed = getComputedStyle(intro);
    expect(computed.paddingBottom).toBe('16px');
  });
});
