import { TestBed } from '@angular/core/testing';
import { ComponentPreviewPaneComponent } from './component-preview-pane.component';
import { GalleryStateService } from '../../services/gallery-state.service';

describe('ComponentPreviewPaneComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentPreviewPaneComponent],
      providers: [GalleryStateService]
    }).compileComponents();
  });

  it('renders the preview pane', () => {
    const fixture = TestBed.createComponent(ComponentPreviewPaneComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Canvas Preview');
  });
});
