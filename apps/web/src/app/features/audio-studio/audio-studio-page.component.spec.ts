import { TestBed } from '@angular/core/testing';
import { AudioStudioPageComponent } from './audio-studio-page.component';

describe('AudioStudioPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioStudioPageComponent],
    }).compileComponents();
  });

  it('renders skeuomorphic controls', () => {
    const fixture = TestBed.createComponent(AudioStudioPageComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Soundscape Synthesizer S-01');
    expect(text).toContain('Power');
    expect(text).toContain('Frequency');
    expect(fixture.componentInstance.powerOn()).toBeFalse();
  });

  it('toggles power state cleanly', () => {
    const fixture = TestBed.createComponent(AudioStudioPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.powerOn()).toBeFalse();

    component.togglePower();
    fixture.detectChanges();
    expect(component.powerOn()).toBeTrue();

    component.togglePower();
    fixture.detectChanges();
    expect(component.powerOn()).toBeFalse();
  });

  it('applies preset tuning parameters', () => {
    const fixture = TestBed.createComponent(AudioStudioPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const relaxPreset = component.presets[1]; // Relax
    component.applyPreset(relaxPreset);

    expect(component.activePreset()).toBe('Relax');
    expect(component.frequency()).toBe(165);
    expect(component.masterVolume()).toBe(0.2);
    expect(component.selectedOscType()).toBe('triangle');
  });

  it('calculates dial angle rotations correctly', () => {
    const fixture = TestBed.createComponent(AudioStudioPageComponent);
    const component = fixture.componentInstance;

    // Center rotation for 50% volume (0.5 * 100 = 50)
    // Percentage = 0.5. Angle = -135 + (0.5 * 270) = 0deg
    expect(component.getKnobRotation(50)).toBe(0);

    // Min boundary rotation for 0% volume
    expect(component.getKnobRotation(0)).toBe(-135);

    // Max boundary rotation for 100% volume
    expect(component.getKnobRotation(100)).toBe(135);
  });

  it('renders tactile soundboard panel', () => {
    const fixture = TestBed.createComponent(AudioStudioPageComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Tactile Soundboard');
    expect(text).toContain('Keyboard click');
    expect(text).toContain('Tibetan bowl');
  });
});
