import { Component, ChangeDetectionStrategy, signal, viewChild, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { ThreeDAudioService } from '../product-3d-showcase/services/three-d-audio.service';

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

type Link = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
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
  private audio = inject(ThreeDAudioService);

  // Simulation parameters signals
  speedFactor = signal<number>(1.2);
  friction = signal<number>(0.992);
  gravity = signal<number>(60); // Repulsion radius

  // Mode and spring controls
  mouseMode = signal<'repel' | 'attract' | 'create'>('repel');
  enableSprings = signal<boolean>(true);
  springStrength = signal<number>(0.03);
  collisionSoundVolume = signal<number>(0.12);

  particles = signal<Particle[]>([
    { id: '1', name: 'Angular 20', value: 95, x: 100, y: 150, vx: 1.5, vy: -1.0, radius: 46, color: '#f43f5e', mass: 46 },
    { id: '2', name: 'TypeScript', value: 88, x: 280, y: 80, vx: -1.0, vy: 1.2, radius: 42, color: '#3b82f6', mass: 42 },
    { id: '3', name: 'RxJS Core', value: 74, x: 180, y: 220, vx: 0.8, vy: 0.8, radius: 36, color: '#d946ef', mass: 36 },
    { id: '4', name: 'SCSS Engine', value: 80, x: 380, y: 180, vx: -1.2, vy: -0.5, radius: 40, color: '#ec4899', mass: 40 },
    { id: '5', name: 'Web Audio', value: 65, x: 480, y: 120, vx: 0.5, vy: -1.2, radius: 34, color: '#10b981', mass: 34 },
    { id: '6', name: 'Ngrx Store', value: 50, x: 80, y: 300, vx: -0.6, vy: 0.6, radius: 30, color: '#f59e0b', mass: 30 }
  ]);

  links = signal<Link[]>([]);
  draggedParticle = signal<Particle | null>(null);

  // Mouse anchor vector coordinates
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

  private playCollisionSound(value: number, velocity: number): void {
    if (this.collisionSoundVolume() <= 0) return;
    // Frequency mapped to node value: smaller node (lower radius / lower value) = higher pitch
    const baseFreq = 200 + (100 - value) * 5;
    const finalVolume = Math.min(this.collisionSoundVolume(), velocity * 0.05);
    if (finalVolume > 0.005) {
      this.audio.playCustom('sine', baseFreq, 0.06, finalVolume);
    }
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
    const activeLinks: Link[] = [];

    // 1. Spring force resolution
    if (this.enableSprings()) {
      const maxSpringDist = 160;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const p1 = items[i];
          const p2 = items[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxSpringDist) {
            const springForce = (dist - 120) * this.springStrength() * 0.01;
            const angle = Math.atan2(dy, dx);
            const fx = Math.cos(angle) * springForce;
            const fy = Math.sin(angle) * springForce;

            if (this.draggedParticle() !== p1) {
              p1.vx += fx;
              p1.vy += fy;
            }
            if (this.draggedParticle() !== p2) {
              p2.vx -= fx;
              p2.vy -= fy;
            }

            activeLinks.push({
              id: `${p1.id}-${p2.id}`,
              x1: p1.x,
              y1: p1.y,
              x2: p2.x,
              y2: p2.y,
              color: p1.color
            });
          }
        }
      }
    }

    this.links.set(activeLinks);

    // 2. Individual physics tick
    items.forEach((p) => {
      if (this.draggedParticle() === p) return;

      p.x += p.vx * currentSpeed;
      p.y += p.vy * currentSpeed;

      // Wall collision resolution with beep trigger
      if (p.x - p.radius < 0) {
        p.x = p.radius;
        const vel = Math.abs(p.vx);
        p.vx *= -1;
        this.playCollisionSound(p.value, vel);
      } else if (p.x + p.radius > boundsWidth) {
        p.x = boundsWidth - p.radius;
        const vel = Math.abs(p.vx);
        p.vx *= -1;
        this.playCollisionSound(p.value, vel);
      }

      if (p.y - p.radius < 0) {
        p.y = p.radius;
        const vel = Math.abs(p.vy);
        p.vy *= -1;
        this.playCollisionSound(p.value, vel);
      } else if (p.y + p.radius > boundsHeight) {
        p.y = boundsHeight - p.radius;
        const vel = Math.abs(p.vy);
        p.vy *= -1;
        this.playCollisionSound(p.value, vel);
      }

      // Cursor attract vs repel mode logic
      if (this.mouseMode() === 'repel' || this.mouseMode() === 'attract') {
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repelRadius + p.radius) {
          const force = (repelRadius + p.radius - distance) * 0.15;
          const angle = Math.atan2(dy, dx);
          const dir = this.mouseMode() === 'attract' ? -1 : 1;
          p.vx += Math.cos(angle) * force * 0.05 * dir;
          p.vy += Math.sin(angle) * force * 0.05 * dir;
        }
      }

      p.vx *= currentFriction;
      p.vy *= currentFriction;
    });

    // 3. Elastic inter-node collisions
    this.resolveNodeCollisions(items);

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
          const overlap = minDist - distance;
          const nx = dx / distance;
          const ny = dy / distance;

          p1.x -= nx * overlap * 0.5;
          p1.y -= ny * overlap * 0.5;
          p2.x += nx * overlap * 0.5;
          p2.y += ny * overlap * 0.5;

          const kx = p1.vx - p2.vx;
          const ky = p1.vy - p2.vy;
          const p = (2 * (nx * kx + ny * ky)) / (p1.mass + p2.mass);

          p1.vx -= p * p2.mass * nx;
          p1.vy -= p * p2.mass * ny;
          p2.vx += p * p1.mass * nx;
          p2.vy += p * p1.mass * ny;

          const relativeVelocity = Math.sqrt(kx * kx + ky * ky);
          this.playCollisionSound((p1.value + p2.value) / 2, relativeVelocity);
        }
      }
    }
  }

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

  onViewportClick(event: MouseEvent): void {
    if (this.mouseMode() !== 'create') return;
    const viewportEl = this.viewport()?.nativeElement;
    if (!viewportEl) return;

    // Check if clicked directly on a node to avoid creating a new one on top
    const target = event.target as HTMLElement;
    if (target.closest('.physics-node')) return;

    const rect = viewportEl.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const names = ['GraphQL', 'WebRTC', 'Fastify', 'Docker', 'K8s', 'Vite', 'Rspack', 'Pinia', 'Svelte', 'Solid'];
    const colors = ['#84cc16', '#06b6d4', '#6366f1', '#a855f7', '#6b7280', '#14b8a6', '#f43f5e', '#e11d48', '#ff781f', '#3b82f6'];

    const randomVal = Math.floor(Math.random() * 50) + 40;
    const randomRadius = Math.floor(randomVal * 0.5);

    const newNode: Particle = {
      id: Math.random().toString(),
      name: names[Math.floor(Math.random() * names.length)],
      value: randomVal,
      x: clickX,
      y: clickY,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      radius: randomRadius,
      color: colors[Math.floor(Math.random() * colors.length)],
      mass: randomRadius
    };

    this.particles.update(list => [...list, newNode]);
    this.playCollisionSound(randomVal, 2.0);
  }

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

      p.x = Math.max(p.radius, Math.min(viewportEl.clientWidth - p.radius, nextX));
      p.y = Math.max(p.radius, Math.min(viewportEl.clientHeight - p.radius, nextY));
    }
  };

  private stopParticleDrag = (event: MouseEvent): void => {
    const p = this.draggedParticle();
    if (p) {
      p.vx = (Math.random() - 0.5) * 5;
      p.vy = (Math.random() - 0.5) * 5;
      this.draggedParticle.set(null);
    }
  };

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

  updateSpringStrength(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.springStrength.set(parseFloat(target.value));
  }

  updateSoundVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.collisionSoundVolume.set(parseFloat(target.value));
  }

  setMouseMode(mode: 'repel' | 'attract' | 'create'): void {
    this.mouseMode.set(mode);
  }

  toggleSprings(): void {
    this.enableSprings.update(v => !v);
  }

  addNewNode(): void {
    const viewportEl = this.viewport()?.nativeElement;
    const width = viewportEl ? viewportEl.clientWidth : 500;
    const height = viewportEl ? viewportEl.clientHeight : 400;

    const names = ['GraphQL', 'WebRTC', 'Fastify', 'Docker', 'K8s', 'Vite', 'Rspack', 'Pinia', 'Svelte', 'Solid'];
    const colors = ['#84cc16', '#06b6d4', '#6366f1', '#a855f7', '#6b7280', '#14b8a6', '#f43f5e', '#e11d48', '#ff781f', '#3b82f6'];

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
    this.playCollisionSound(randomVal, 2.0);
  }

  clearAll(): void {
    this.particles.set([]);
  }
}
