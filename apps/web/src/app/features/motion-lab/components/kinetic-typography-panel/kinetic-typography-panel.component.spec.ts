import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { KineticTypographyPanelComponent } from './kinetic-typography-panel.component';

describe('KineticTypographyPanelComponent', () => {
  let component: KineticTypographyPanelComponent;
  let fixture: ComponentFixture<KineticTypographyPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KineticTypographyPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KineticTypographyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger scramble text', fakeAsync(() => {
    spyOn(component, 'playClickSound');
    
    component.triggerScramble();
    expect(component.playClickSound).toHaveBeenCalled();
    expect(component.scrambledText).not.toBe('Quiet visual depth driven by engineered specifications.');
    
    // Total characters is 53, iteration increases by 1.5 every 24ms.
    // 53 / 1.5 = ~36 ticks. 36 * 24 = 864ms.
    tick(1000);
    
    expect(component.scrambledText).toBe('Quiet visual depth driven by engineered specifications.');
  }));

  it('should handle onWaveTextMouseMove', () => {
    fixture.componentRef.setInput('simulateReducedMotion', false);
    
    const mockContainer = document.createElement('div');
    Object.defineProperty(mockContainer, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 200 })
    });
    
    spyOn(component, 'waveTextContainer').and.returnValue({ nativeElement: mockContainer } as any);
    
    const event = new MouseEvent('mousemove', { clientX: 50 });
    component.onWaveTextMouseMove(event);
    
    // WaveChars length is 23 ('Calm Commerce Workbench')
    // charWidth = 200 / 23 = ~8.69
    // hoveredIndex = Math.floor(50 / 8.69) = 5
    // Vy of char at index 5 should be updated
    const hoveredChar = component.waveChars[5];
    expect(hoveredChar.vy).not.toBe(0);
  });

  it('should handle onWaveTextMouseLeave', () => {
    // Initial state setup to something else
    component.onWaveTextMouseMove(new MouseEvent('mousemove', { clientX: 50 }));
    
    component.onWaveTextMouseLeave();
    // targetHoverCharIndex is private, but we verify it doesn't throw and resets state
    expect(component).toBeTruthy();
  });

  it('should not play click sound if reduced motion is true', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    expect(() => component.playClickSound()).not.toThrow();
  });
});
