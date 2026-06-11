import { Component, ElementRef, viewChild, input } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-scroll-stagger-panel',
  standalone: true,
  imports: [
    FormsModule,
    SliderModule,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent
],
  templateUrl: './scroll-stagger-panel.component.html',
})
export class ScrollStaggerPanelComponent {
  motionIntensity = input(6);
  simulateReducedMotion = input(false);

  staggerDelay = 80;
  staggerItems = [
    { title: 'Initialize Environment', desc: 'Configuring canvas elements, buffers, and shaders.' },
    { title: 'Evaluate Physics Engine', desc: 'Solving constraint matrices and applying drag coefficient calculations.' },
    { title: 'Compute Spring Vector', desc: "Calculating displacement paths based on Hooke's Law." },
    { title: 'Render Frame Pipeline', desc: 'Flushing layout trees and composition layers.' },
  ];
  staggerVisible = true;

  scrollFeed = viewChild<ElementRef<HTMLElement>>('scrollFeed');
  scrollCards = [
    { title: 'Phase 01: System Audit', desc: 'Deconstruct layout structures, visual density, and identify layout bottlenecks.', tag: 'Analysis' },
    { title: 'Phase 02: Token Calibration', desc: 'Establish core color variables, custom curves, and responsive typography scales.', tag: 'Design' },
    { title: 'Phase 03: Physics Solver Integration', desc: 'Implement spring equations and multi-threaded calculations for complex UI states.', tag: 'Engineering' },
    { title: 'Phase 04: Component Hardening', desc: 'Apply prefers-reduced-motion fallbacks, keyboard controls, and WCAG AA audits.', tag: 'Production' }
  ];

  playClickSound(): void {
    if (this.simulateReducedMotion()) return;
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
      // AudioContext fails if browser blocks audio
    }
  }

  replayStagger(): void {
    this.playClickSound();
    this.staggerVisible = false;
    setTimeout(() => {
      this.staggerVisible = true;
    }, 50);
  }

  onScrollFeed(): void {
    if (this.simulateReducedMotion()) return;

    const container = this.scrollFeed()?.nativeElement;
    if (!container) return;

    const cards = container.querySelectorAll('.scroll-stack-card');
    const scrollTop = container.scrollTop;

    cards.forEach((card: any) => {
      const cardTop = card.offsetTop;
      const relativeTop = cardTop - scrollTop;

      if (relativeTop < 24) {
        const progress = Math.min(1, Math.max(0, -relativeTop / 180));
        const scale = 1 - progress * 0.08 * (this.motionIntensity() / 6);
        const opacity = 1 - progress * 0.55;
        const translateY = progress * 14;

        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        card.style.opacity = opacity.toString();
        card.style.filter = `brightness(${1 - progress * 0.25})`;
      } else {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.filter = '';
      }
    });
  }
}



