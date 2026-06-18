import { Component, ChangeDetectionStrategy, signal, viewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';

type Particle = {
  id: string;
  name: string;
  value: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
};

@Component({
  selector: 'app-physics-lab-page',
  standalone: true,
  imports: [UiBadgeComponent],
  templateUrl: './physics-lab-page.component.html',
  styleUrl: './physics-lab-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicsLabPageComponent implements OnInit, OnDestroy {
  readonly viewport = viewChild<ElementRef<HTMLDivElement>>('viewport');

  // Simulation parameters signals
  speedFactor = signal<number>(1.2);
  friction = signal<number>(0.992);
  gravity = signal<number>(60); // Mouse repulsion force radius

  particles = signal<Particle[]>([
    { id: '1', name: 'Angular 20', value: 95, x: 100, y: 150, vx: 1.5, vy: -1.0, radius: 46, color: '#f43f5e', mass: 46 },
    { id: '2', name: 'TypeScript', value: 88, x: 280, y: 80, vx: -1.0, vy: 1.2, radius: 42, color: '#3b82f6', mass: 42 },
    { id: '3', name: 'RxJS Core', value: 74, x: 180, y: 220, vx: 0.8, vy: 0.8, radius: 36, color: '#d946ef', mass: 36 },
    { id: '4', name: 'SCSS Engine', value: 80, x: 380, y: 180, vx: -1.2, vy: -0.5, radius: 40, color: '#ec4899', mass: 40 },
    { id: '5', name: 'Web Audio', value: 65, x: 480, y: 120, vx: 0.5, vy: -1.2, radius: 34, color: '#10b981', mass: 34 },
    { id: '6', name: 'Ngrx Store', value: 50, x: 80, y: 300, vx: -0.6, vy: 0.6, radius: 30, color: '#f59e0b', mass: 30 }
  ]);

  draggedParticle = signal<Particle | null>(null);

  // Mouse anchor repulsion vector coordinates
  private mouseX = -1000;
  private mouseY = -1000;

  private animationFrameId = 0;
  readonly Math = Math;

  ngOnInit(): void {
    this.tickSimulation();

    // Mouse drag global drop listeners
    window.addEventListener('mousemove', this.onParticleDragMove);
    window.addEventListener('mouseup', this.stopParticleDrag);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('mousemove', this.onParticleDragMove);
    window.removeEventListener('mouseup', this.stopParticleDrag);
  }

  private tickSimulation(): void {
    const viewportEl = this.viewport()?.nativeElement;
    if (!viewportEl) {
      this.animationFrameId = requestAnimationFrame(() => this.tickSimulation());
      return;
    }

    const boundsWidth = viewportEl.clientWidth;
    const boundsHeight = viewportEl.clientHeight;
    const items = this.particles();
    const currentFriction = this.friction();
    const currentSpeed = this.speedFactor();
    const repelRadius = this.gravity();

    items.forEach((p) => {
      if (this.draggedParticle() === p) return;

      // 1. Apply speed forces and displacement vectors
      p.x += p.vx * currentSpeed;
      p.y += p.vy * currentSpeed;

      // 2. Resolve wall collisions (boundary bounce)
      if (p.x - p.radius < 0) {
        p.x = p.radius;
        p.vx *= -1;
      } else if (p.x + p.radius > boundsWidth) {
        p.x = boundsWidth - p.radius;
        p.vx *= -1;
      }

      if (p.y - p.radius < 0) {
        p.y = p.radius;
        p.vy *= -1;
      } else if (p.y + p.radius > boundsHeight) {
        p.y = boundsHeight - p.radius;
        p.vy *= -1;
      }

      // 3. Mouse cursor gravity repulsion
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < repelRadius + p.radius) {
        const force = (repelRadius + p.radius - distance) * 0.15;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 0.05;
        p.vy += Math.sin(angle) * force * 0.05;
      }

      // 4. Slow down energy using friction index
      p.vx *= currentFriction;
      p.vy *= currentFriction;
    });

    // 5. Inter-particle Collisions (Elastic vector updates)
    this.resolveNodeCollisions(items);

    // Trigger state change detection
    this.particles.set([...items]);

    this.animationFrameId = requestAnimationFrame(() => this.tickSimulation());
  }

  private resolveNodeCollisions(items: Particle[]): void {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const p1 = items[i];
        const p2 = items[j];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = p1.radius + p2.radius;

        if (distance < minDist) {
          // Resolve overlap to prevent nodes sticking
          const overlap = minDist - distance;
          const nx = dx / distance;
          const ny = dy / distance;

          // Disperse nodes proportionally
          p1.x -= nx * overlap * 0.5;
          p1.y -= ny * overlap * 0.5;
          p2.x += nx * overlap * 0.5;
          p2.y += ny * overlap * 0.5;

          // Elastic collision momentum math formula
          const kx = p1.vx - p2.vx;
          const ky = p1.vy - p2.vy;
          const p = (2 * (nx * kx + ny * ky)) / (p1.mass + p2.mass);

          // Update velocity vectors
          p1.vx -= p * p2.mass * nx;
          p1.vy -= p * p2.mass * ny;
          p2.vx += p * p1.mass * nx;
          p2.vy += p * p1.mass * ny;
        }
      }
    }
  }

  // --- MOUSE CURSOR INTERACTION HOOKS ---

  onViewportMouseMove(event: MouseEvent): void {
    const viewportEl = this.viewport()?.nativeElement;
    if (viewportEl) {
      const rect = viewportEl.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    }
  }

  onViewportMouseLeave(): void {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  // --- PARTICLE DRAGGING GESTURE METHODS ---

  startParticleDrag(event: MouseEvent, p: Particle): void {
    this.draggedParticle.set(p);
    p.vx = 0;
    p.vy = 0;
    event.stopPropagation();
    event.preventDefault();
  }

  private onParticleDragMove = (event: MouseEvent): void => {
    const p = this.draggedParticle();
    const viewportEl = this.viewport()?.nativeElement;

    if (p && viewportEl) {
      const rect = viewportEl.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;

      // Assign coordinates within boundaries
      p.x = Math.max(p.radius, Math.min(viewportEl.clientWidth - p.radius, nextX));
      p.y = Math.max(p.radius, Math.min(viewportEl.clientHeight - p.radius, nextY));
    }
  };

  private stopParticleDrag = (event: MouseEvent): void => {
    const p = this.draggedParticle();
    if (p) {
      // Throw nodes based on release vector
      p.vx = (Math.random() - 0.5) * 5;
      p.vy = (Math.random() - 0.5) * 5;
      this.draggedParticle.set(null);
    }
  };

  // --- PARAMETERS PANEL HANDLERS ---

  updateSpeedFactor(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.speedFactor.set(parseFloat(target.value));
  }

  updateFriction(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.friction.set(parseFloat(target.value));
  }

  updateGravity(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.gravity.set(parseInt(target.value, 10));
  }

  addNewNode(): void {
    const viewportEl = this.viewport()?.nativeElement;
    const width = viewportEl ? viewportEl.clientWidth : 500;
    const height = viewportEl ? viewportEl.clientHeight : 400;

    const names = ['GraphQL', 'WebRTC', 'Fastify', 'Docker', 'K8s', 'Vite', 'Rspack'];
    const colors = ['#84cc16', '#06b6d4', '#6366f1', '#a855f7', '#6b7280', '#14b8a6', '#f43f5e'];

    const randomVal = Math.floor(Math.random() * 50) + 40;
    const randomRadius = Math.floor(randomVal * 0.5);

    const newNode: Particle = {
      id: Math.random().toString(),
      name: names[Math.floor(Math.random() * names.length)],
      value: randomVal,
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      radius: randomRadius,
      color: colors[Math.floor(Math.random() * colors.length)],
      mass: randomRadius
    };

    this.particles.update(list => [...list, newNode]);
  }
}
