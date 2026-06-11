import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { SpringPhysicsPanelComponent } from './components/spring-physics-panel/spring-physics-panel.component';
import { MicroInteractionsPanelComponent } from './components/micro-interactions-panel/micro-interactions-panel.component';
import { FlipLayoutPanelComponent } from './components/flip-layouts-panel/flip-layouts-panel.component';
import { ScrollStaggerPanelComponent } from './components/scroll-stagger-panel/scroll-stagger-panel.component';
import { KineticTypographyPanelComponent } from './components/kinetic-typography-panel/kinetic-typography-panel.component';
import { CanvasSvgPhysicsPanelComponent } from './components/canvas-svg-physics-panel/canvas-svg-physics-panel.component';
import { TiltCardPanelComponent } from './components/tilt-card-panel/tilt-card-panel.component';

type MotionLabTab = 'physics' | 'interactions' | 'flip' | 'scroll' | 'typography' | 'canvas' | 'advanced';

@Component({
  selector: 'app-motion-lab-page',
  standalone: true,
  imports: [
    FormsModule,
    SliderModule,
    PageSectionComponent,
    SpringPhysicsPanelComponent,
    MicroInteractionsPanelComponent,
    FlipLayoutPanelComponent,
    ScrollStaggerPanelComponent,
    KineticTypographyPanelComponent,
    CanvasSvgPhysicsPanelComponent,
    TiltCardPanelComponent
],
  templateUrl: './motion-lab-page.component.html',
  styleUrl: './motion-lab-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MotionLabPageComponent {
  // Shell configurations shared down to modular panels
  activeTab: MotionLabTab = 'physics';
  motionIntensity = 6;
  simulateReducedMotion = false;

  playClickSound(): void {
    if (this.simulateReducedMotion) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(920, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.025, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // AudioContext fails silently if browser blocks audio
    }
  }

  switchTab(tab: MotionLabTab): void {
    this.playClickSound();
    this.activeTab = tab;
  }
}

