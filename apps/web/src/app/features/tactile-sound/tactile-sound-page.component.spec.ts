import { TestBed } from '@angular/core/testing';
import { TactileSoundPageComponent } from './tactile-sound-page.component';

describe('TactileSoundPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TactileSoundPageComponent],
    }).compileComponents();
  });

  it('renders interactive waveform visualizer elements and sandbox parameters', () => {
    const fixture = TestBed.createComponent(TactileSoundPageComponent);
    fixture.detectChanges();

    const elementText = fixture.nativeElement.textContent;
    expect(elementText).toContain('Tactile Sound Laboratory');
    expect(elementText).toContain('Waveform Visualizer');
    expect(elementText).toContain('Custom Synth Sandbox');
    expect(elementText).toContain('Standard Interaction Presets');
    expect(elementText).toContain('Keyboard Sound Simulator');
  });

  it('should trigger canvas rendering context correctly', () => {
    const fixture = TestBed.createComponent(TactileSoundPageComponent);
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });
});
