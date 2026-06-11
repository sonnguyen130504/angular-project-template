import { TestBed } from '@angular/core/testing';
import { ComponentPropertiesKnobsComponent } from './component-properties-knobs.component';
import { GalleryStateService } from '../../services/gallery-state.service';

describe('ComponentPropertiesKnobsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentPropertiesKnobsComponent],
      providers: [GalleryStateService]
    }).compileComponents();
  });

  it('renders properties knobs', () => {
    const fixture = TestBed.createComponent(ComponentPropertiesKnobsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Properties Knobs');
  });
});
