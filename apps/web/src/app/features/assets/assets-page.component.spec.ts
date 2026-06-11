import { TestBed } from '@angular/core/testing';
import { AssetsPageComponent } from './assets-page.component';

describe('AssetsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AssetsPageComponent] }).compileComponents();
  });

  it('renders assets and queues an upload', () => {
    const fixture = TestBed.createComponent(AssetsPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.simulateUpload();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Assets');
    expect(component.assets.some((asset) => asset.name === 'new-campaign-image.png')).toBeTrue();
  });
});
