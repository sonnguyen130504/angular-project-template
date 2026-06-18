import { TestBed } from '@angular/core/testing';
import { MotionLabPageComponent } from './motion-lab-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('MotionLabPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotionLabPageComponent, getTranslocoModule()],
    }).compileComponents();
  });

  it('renders animation playground and parameters', () => {
    const fixture = TestBed.createComponent(MotionLabPageComponent);
    fixture.detectChanges();

    const elementText = fixture.nativeElement.textContent;
    expect(elementText).toContain('Motion Lab & Animation Showcase');
    expect(elementText).toContain('Solver Sandbox');
    expect(elementText).toContain('FLIP Layouts');
    expect(elementText).toContain('Scroll & Stagger');
  });

  it('should apply page styles to nested control controls due to disabled encapsulation', () => {
    const fixture = TestBed.createComponent(MotionLabPageComponent);
    fixture.detectChanges();

    const switchVisual = fixture.nativeElement.querySelector('.toggle-indicator');
    expect(switchVisual).toBeTruthy();
    
    const computed = getComputedStyle(switchVisual);
    expect(computed.position).toBe('relative');
  });
});
