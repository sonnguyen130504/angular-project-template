import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, viewChild, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-spring-physics-panel',
  standalone: true,
  imports: [
    NgClass,
    DecimalPipe,
    FormsModule,
    SliderModule,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spring-physics-panel.component.html',
})
export class SpringPhysicsPanelComponent implements OnInit, OnDestroy {
  motionIntensity = input(6);
  simulateReducedMotion = input(false);

  // Spring variables
  stiffness = 180;
  damping = 12;
  mass = 1.0;

  handleX = 0;
  handleY = 0;
  velocityX = 0;
  velocityY = 0;
  isDragging = false;
  springCurvePath = '';
  curvePoints: number[] = [];

  private dragStartX = 0;
  private dragStartY = 0;
  private animationFrameId?: number;

  // Magnetic Button state
  magneticContainer = viewChild<ElementRef<HTMLElement>>('magneticContainer');
  magneticButton = viewChild<ElementRef<HTMLElement>>('magneticButton');
  magneticTrail = viewChild<ElementRef<HTMLElement>>('magneticTrail');

  magneticX = 0;
  magneticY = 0;
  magneticVx = 0;
  magneticVy = 0;
  
  trailX = 0;
  trailY = 0;
  trailVx = 0;
  trailVy = 0;

  isHoveringMagnetic = false;
  private magneticFrameId?: number;
  private targetMagneticX = 0;
  private targetMagneticY = 0;

  private readonly ngZone = inject(NgZone);

  ngOnInit(): void {
    this.resetSpring();
    this.updateCurvePlot();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.magneticFrameId) {
      cancelAnimationFrame(this.magneticFrameId);
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

  resetSpring(): void {
    this.handleX = 0;
    this.handleY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.curvePoints = [];
    this.updateCurvePlot();
  }

  triggerImpact(): void {
    if (this.isDragging) return;
    this.playClickSound();
    this.velocityX = (Math.random() - 0.5) * 80;
    this.velocityY = -60 - Math.random() * 40;
    this.curvePoints = [];
    this.startPhysicsLoop();
  }

  onDragStart(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.playClickSound();
    this.isDragging = true;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.dragStartX = clientX - this.handleX;
    this.dragStartY = clientY - this.handleY;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    let newX = clientX - this.dragStartX;
    let newY = clientY - this.dragStartY;

    const maxDrag = 120;
    const distance = Math.sqrt(newX * newX + newY * newY);
    if (distance > maxDrag) {
      newX = (newX / distance) * maxDrag;
      newY = (newY / distance) * maxDrag;
    }

    this.handleX = newX;
    this.handleY = newY;
    this.curvePoints = [];
    this.updateCurvePlot();
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.startPhysicsLoop();
  }

  private startPhysicsLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.ngZone.runOutsideAngular(() => {
      const dt = 0.016;
      const solve = () => {
        if (this.isDragging) return;

        const forceX = -this.stiffness * this.handleX - this.damping * this.velocityX;
        const forceY = -this.stiffness * this.handleY - this.damping * this.velocityY;

        const accX = forceX / this.mass;
        const accY = forceY / this.mass;

        this.velocityX += accX * dt;
        this.velocityY += accY * dt;

        this.handleX += this.velocityX * dt;
        this.handleY += this.velocityY * dt;

        const magnitude = Math.sqrt(this.handleX * this.handleX + this.handleY * this.handleY);
        const sign = this.handleY < 0 ? -1 : 1;
        this.curvePoints.push(magnitude * sign);

        if (this.curvePoints.length > 180) {
          this.curvePoints.shift();
        }

        this.ngZone.run(() => {
          this.updateCurvePlot();
        });

        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        const displacement = Math.sqrt(this.handleX * this.handleX + this.handleY * this.handleY);

        if (speed < 0.2 && displacement < 0.2) {
          this.handleX = 0;
          this.handleY = 0;
          this.velocityX = 0;
          this.velocityY = 0;
          this.animationFrameId = undefined;
        } else {
          this.animationFrameId = requestAnimationFrame(solve);
        }
      };

      this.animationFrameId = requestAnimationFrame(solve);
    });
  }

  private updateCurvePlot(): void {
    if (this.curvePoints.length === 0) {
      this.springCurvePath = 'M 0 50 L 200 50';
      return;
    }

    const width = 200;
    const height = 100;
    const midY = height / 2;
    const step = width / Math.max(1, this.curvePoints.length);

    let path = `M 0 ${midY - this.curvePoints[0] * 0.3}`;
    for (let i = 1; i < this.curvePoints.length; i++) {
      const x = i * step;
      const y = midY - this.curvePoints[i] * 0.3;
      path += ` L ${x} ${y}`;
    }
    this.springCurvePath = path;
  }

  onMagneticMouseMove(event: MouseEvent): void {
    if (this.simulateReducedMotion()) return;

    const container = this.magneticContainer()?.nativeElement;
    const button = this.magneticButton()?.nativeElement;
    if (!container || !button) return;

    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.left + rect.width / 2;
    const containerCenterY = rect.top + rect.height / 2;

    const dx = event.clientX - containerCenterX;
    const dy = event.clientY - containerCenterY;

    const intensityFactor = this.motionIntensity() / 6;
    const maxPull = 45 * intensityFactor;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 140) {
      this.isHoveringMagnetic = true;
      const pull = Math.min(dist, 140);
      const strength = (pull / 140) * maxPull;
      this.targetMagneticX = (dx / dist) * strength;
      this.targetMagneticY = (dy / dist) * strength;
      this.startMagneticPhysicsLoop();
    } else {
      this.onMagneticMouseLeave();
    }
  }

  onMagneticMouseLeave(): void {
    this.isHoveringMagnetic = false;
    this.targetMagneticX = 0;
    this.targetMagneticY = 0;
    this.startMagneticPhysicsLoop();
  }

  private startMagneticPhysicsLoop(): void {
    if (this.magneticFrameId) return;

    this.ngZone.runOutsideAngular(() => {
      const dt = 0.016;
      const solve = () => {
        const targetX = this.isHoveringMagnetic ? this.targetMagneticX : 0;
        const targetY = this.isHoveringMagnetic ? this.targetMagneticY : 0;

        // Button Physics
        const forceX = -this.stiffness * (this.magneticX - targetX) - this.damping * this.magneticVx;
        const forceY = -this.stiffness * (this.magneticY - targetY) - this.damping * this.magneticVy;

        const accX = forceX / this.mass;
        const accY = forceY / this.mass;

        this.magneticVx += accX * dt;
        this.magneticVy += accY * dt;

        this.magneticX += this.magneticVx * dt;
        this.magneticY += this.magneticVy * dt;

        // Lagging Pointer Trail Physics
        const trailStiffness = 95;
        const trailDamping = 10;
        const trailForceX = -trailStiffness * (this.trailX - targetX) - trailDamping * this.trailVx;
        const trailForceY = -trailStiffness * (this.trailY - targetY) - trailDamping * this.trailVy;

        const trailAccX = trailForceX / this.mass;
        const trailAccY = trailForceY / this.mass;

        this.trailVx += trailAccX * dt;
        this.trailVy += trailAccY * dt;

        this.trailX += this.trailVx * dt;
        this.trailY += this.trailVy * dt;

        const button = this.magneticButton()?.nativeElement;
        const trail = this.magneticTrail()?.nativeElement;

        if (button) {
          button.style.transform = `translate(${this.magneticX}px, ${this.magneticY}px)`;
        }
        if (trail) {
          trail.style.transform = `translate(${this.trailX}px, ${this.trailY}px)`;
        }

        const speed = Math.sqrt(this.magneticVx * this.magneticVx + this.magneticVy * this.magneticVy);
        const displacement = Math.sqrt(
          (this.magneticX - targetX) * (this.magneticX - targetX) +
          (this.magneticY - targetY) * (this.magneticY - targetY)
        );

        const trailSpeed = Math.sqrt(this.trailVx * this.trailVx + this.trailVy * this.trailVy);
        const trailDisplacement = Math.sqrt(
          (this.trailX - targetX) * (this.trailX - targetX) +
          (this.trailY - targetY) * (this.trailY - targetY)
        );

        if (!this.isHoveringMagnetic && speed < 0.2 && displacement < 0.2 && trailSpeed < 0.2 && trailDisplacement < 0.2) {
          this.magneticX = 0;
          this.magneticY = 0;
          this.magneticVx = 0;
          this.magneticVy = 0;
          this.trailX = 0;
          this.trailY = 0;
          this.trailVx = 0;
          this.trailVy = 0;
          if (button) button.style.transform = '';
          if (trail) trail.style.transform = '';
          this.magneticFrameId = undefined;
        } else {
          this.magneticFrameId = requestAnimationFrame(solve);
        }
      };

      this.magneticFrameId = requestAnimationFrame(solve);
    });
  }
}



