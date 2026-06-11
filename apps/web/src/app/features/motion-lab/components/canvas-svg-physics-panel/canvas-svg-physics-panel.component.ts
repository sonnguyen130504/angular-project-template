import { Component, ElementRef, NgZone, OnDestroy, AfterViewInit, viewChild, input, inject } from '@angular/core';
import { NgClass, UpperCasePipe } from '@angular/common';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-canvas-svg-physics-panel',
  standalone: true,
  imports: [
    NgClass,
    UpperCasePipe,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
  ],
  templateUrl: './canvas-svg-physics-panel.component.html',
})
export class CanvasSvgPhysicsPanelComponent implements AfterViewInit, OnDestroy {
  motionIntensity = input(6);
  simulateReducedMotion = input(false);

  physicsCanvasEl = viewChild<ElementRef<HTMLCanvasElement>>('physicsCanvasEl');
  particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
  private canvasFrameId?: number;

  playState: 'play' | 'pause' = 'play';

  private readonly ngZone = inject(NgZone);

  ngAfterViewInit(): void {
    // Small timeout ensures element bounds are parsed before grid calibration
    setTimeout(() => {
      this.initCanvasPhysics();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.canvasFrameId) {
      cancelAnimationFrame(this.canvasFrameId);
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

  initCanvasPhysics(): void {
    const canvas = this.physicsCanvasEl()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = 240;

    this.particles = [];
    const colors = ['#9a5e34', '#214b57', '#2f6f4e', '#2f5f91', '#7a4d00'];
    
    // Spawn 8 initial particles with random vectors
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: 40 + Math.random() * (canvas.width - 80),
        y: 40 + Math.random() * (canvas.height - 80),
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
        radius: 12 + Math.random() * 8,
        color: colors[i % colors.length]
      });
    }

    if (this.canvasFrameId) {
      cancelAnimationFrame(this.canvasFrameId);
    }

    const dt = 0.016;
    const gravity = 150 * (this.motionIntensity() / 6);
    const bounce = -0.78;
    const friction = 0.992;

    const updateLoop = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.vy += gravity * dt;
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx *= bounce;
        } else if (p.x + p.radius > canvas.width) {
          p.x = canvas.width - p.radius;
          p.vx *= bounce;
        }

        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy *= bounce;
        } else if (p.y + p.radius > canvas.height) {
          p.y = canvas.height - p.radius;
          p.vy *= bounce;
        }

        // Particle-to-Particle collisions
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = p.radius + p2.radius;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            p.x -= nx * overlap * 0.5;
            p.y -= ny * overlap * 0.5;
            p2.x += nx * overlap * 0.5;
            p2.y += ny * overlap * 0.5;

            const kx = p.vx - p2.vx;
            const ky = p.vy - p2.vy;
            const vn = kx * nx + ky * ny;

            if (vn > 0) {
              const impulse = (2 * vn) / 2;
              p.vx -= nx * impulse * 0.95;
              p.vy -= ny * impulse * 0.95;
              p2.vx += nx * impulse * 0.95;
              p2.vy += ny * impulse * 0.95;
            }
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(20, 17, 15, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      this.canvasFrameId = requestAnimationFrame(updateLoop);
    };

    this.ngZone.runOutsideAngular(() => {
      this.canvasFrameId = requestAnimationFrame(updateLoop);
    });
  }

  addParticle(event: MouseEvent): void {
    const canvas = this.physicsCanvasEl()?.nativeElement;
    if (!canvas) return;

    this.playClickSound();

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const colors = ['#9a5e34', '#214b57', '#2f6f4e', '#2f5f91', '#7a4d00'];
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 200,
      vy: -100 - Math.random() * 150,
      radius: 12 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)]
    });

    if (this.particles.length > 25) {
      this.particles.shift();
    }
  }

  clearCanvasPhysics(): void {
    this.playClickSound();
    this.particles = [];
  }

  togglePlayState(): void {
    this.playClickSound();
    this.playState = this.playState === 'play' ? 'pause' : 'play';
  }
}



