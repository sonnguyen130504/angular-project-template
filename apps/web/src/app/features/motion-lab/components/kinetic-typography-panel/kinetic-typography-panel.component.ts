import { Component, ElementRef, OnDestroy, viewChild, input, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-kinetic-typography-panel',
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent
],
  templateUrl: './kinetic-typography-panel.component.html',
})
export class KineticTypographyPanelComponent implements OnDestroy {
  motionIntensity = input(6);
  simulateReducedMotion = input(false);
  
  private readonly cdr = inject(ChangeDetectorRef);

  stiffness = 180;
  damping = 12;
  mass = 1.0;

  waveTextContainer = viewChild<ElementRef<HTMLElement>>('waveTextContainer');
  waveTextString = 'Calm Commerce Workbench';
  waveChars = Array.from(this.waveTextString).map((char, index) => ({
    char,
    index,
    y: 0,
    vy: 0
  }));
  private waveFrameId?: number;
  private targetHoverCharIndex = -1;

  scrambledText = 'Hover or click the trigger below to execute scrambler verification.';
  private scrambleIntervalId?: any;

  ngOnDestroy(): void {
    if (this.waveFrameId) {
      cancelAnimationFrame(this.waveFrameId);
    }
    if (this.scrambleIntervalId) {
      clearInterval(this.scrambleIntervalId);
    }
  }

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

  onWaveTextMouseMove(event: MouseEvent): void {
    if (this.simulateReducedMotion()) return;

    const container = this.waveTextContainer()?.nativeElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;

    const charWidth = rect.width / this.waveChars.length;
    const hoveredIndex = Math.floor(relativeX / charWidth);

    if (hoveredIndex !== this.targetHoverCharIndex) {
      this.targetHoverCharIndex = hoveredIndex;

      this.waveChars.forEach((char) => {
        const distance = Math.abs(char.index - hoveredIndex);
        if (distance <= 2) {
          const strength = 1 - distance * 0.45;
          const force = -28 * strength * (this.motionIntensity() / 6);
          char.vy = force;
        }
      });

      this.startWavePhysicsLoop();
    }
  }

  onWaveTextMouseLeave(): void {
    this.targetHoverCharIndex = -1;
  }

  private startWavePhysicsLoop(): void {
    if (this.waveFrameId) return;

    // Run solver outside Angular's main tree for high speed performance
    // and manually map positions to typography element styles
    const dt = 0.016;
    const solve = () => {
      let hasMovement = false;

      this.waveChars.forEach((char) => {
        const force = -this.stiffness * char.y - this.damping * char.vy;
        const acc = force / this.mass;

        char.vy += acc * dt;
        char.y += char.vy * dt;

        const span = document.querySelector(`[data-char-idx="${char.index}"]`) as HTMLElement;
        if (span) {
          span.style.transform = `translateY(${char.y}px)`;
        }

        const speed = Math.abs(char.vy);
        const displacement = Math.abs(char.y);
        if (speed > 0.15 || displacement > 0.15) {
          hasMovement = true;
        }
      });

      if (!hasMovement) {
        this.waveChars.forEach((char) => {
          char.y = 0;
          char.vy = 0;
          const span = document.querySelector(`[data-char-idx="${char.index}"]`) as HTMLElement;
          if (span) span.style.transform = '';
        });
        this.waveFrameId = undefined;
      } else {
        this.waveFrameId = requestAnimationFrame(solve);
      }
    };

    this.waveFrameId = requestAnimationFrame(solve);
  }

  triggerScramble(): void {
    this.playClickSound();
    if (this.scrambleIntervalId) {
      clearInterval(this.scrambleIntervalId);
    }

    const target = 'Quiet visual depth driven by engineered specifications.';
    const glyphs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let iteration = 0;

    this.scrambleIntervalId = setInterval(() => {
      this.scrambledText = target
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return target[index];
          }
          if (char === ' ') return ' ';
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      this.cdr.markForCheck();

      if (iteration >= target.length) {
        clearInterval(this.scrambleIntervalId);
        this.scrambleIntervalId = undefined;
      }

      iteration += 1.5;
    }, 24);
  }
}



