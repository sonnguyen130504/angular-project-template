import { Component, ElementRef, OnDestroy, OnInit, viewChild, ChangeDetectionStrategy, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ThreeDAudioService } from '../product-3d-showcase/services/three-d-audio.service';

type SlidePreset = {
  title: string;
  subtitle: string;
  description: string;
  theta: number; // degrees
  phi: number; // degrees
  radius: number; // meters
  targetX: number;
  targetY: number;
  targetZ: number;
};

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-product-3d-storytelling-page',
  standalone: true,
  imports: [TranslocoDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-3d-storytelling-page.component.html',
  styleUrl: './product-3d-storytelling-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Product3DStorytellingPageComponent implements OnInit, OnDestroy {
  public audio = inject(ThreeDAudioService);

  readonly viewerRef = viewChild<ElementRef>('viewer');
  readonly scrollContainerRef = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  readonly modelUrl = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
  readonly posterUrl = '/assets/3d-showcase/helmet_poster.png';

  readonly slides: SlidePreset[] = [
    {
      title: 'Aeronaut Suit Model X',
      subtitle: 'The Next Generation Spacecraft Uniform',
      description: 'Explore the immersive, scroll-driven interactive catalog detailing advanced material engineering and structural design.',
      theta: 0, phi: 75, radius: 5.5, targetX: 0, targetY: 0, targetZ: 0
    },
    {
      title: 'Anti-Reflective Visor Shield',
      subtitle: 'Premium Optical Clarity',
      description: 'The reinforced polycarbonate visor offers panoramic field of view, equipped with dynamic thermal grids and solar glare shielding.',
      theta: 45, phi: 60, radius: 3.2, targetX: 0, targetY: 0.2, targetZ: 0.2
    },
    {
      title: 'Multi-layered PBR Carbon Shell',
      subtitle: 'High Impact Defense Armor',
      description: 'Advanced thermal regulation layers paired with ultra-light carbon composites ensure safety under extreme pressure variance.',
      theta: 90, phi: 80, radius: 4.5, targetX: 0, targetY: 0, targetZ: 0
    },
    {
      title: 'Life Support Connection Port',
      subtitle: 'Integrated Oxygen Flow Circulation',
      description: 'Located at the lower spine connection, the oxygen circulation control module features rapid locks and electronic indicators.',
      theta: 180, phi: 110, radius: 3.8, targetX: 0, targetY: -0.15, targetZ: -0.1
    },
    {
      title: 'Showcase Call to Action',
      subtitle: 'Ready for Launch',
      description: 'Select your preferred custom variants in the material configurator or proceed to simulation settings.',
      theta: 270, phi: 75, radius: 5.5, targetX: 0, targetY: 0, targetZ: 0
    }
  ];

  activeSlideIndex = signal<number>(0);
  isLoading = signal<boolean>(true);
  
  // Interactive HUD Data Signals
  systemIntegrity = signal<number>(100);
  oxygenLevel = signal<number>(99);
  pressureStatus = signal<string>('1.00 atm');
  glowColor = signal<string>('rgba(56, 189, 248, 0.15)'); // Glow theme color
  hudActive = signal<boolean>(true);

  // Current interpolated state values
  private currentTheta = 0;
  private currentPhi = 75;
  private currentRadius = 5.5;
  private currentTargetX = 0;
  private currentTargetY = 0;
  private currentTargetZ = 0;

  // Target values based on scroll
  private targetTheta = 0;
  private targetPhi = 75;
  private targetRadius = 5.5;
  private targetTargetX = 0;
  private targetTargetY = 0;
  private targetTargetZ = 0;

  private animationFrameId: number | null = null;
  private lastActiveIndex = 0;

  ngOnInit(): void {
    // Start interpolation loop
    this.tickInterpolation();

    // Trigger visualizer resolution after a short delay (1.2s) to ensure loading HUD exhibits correct behavior
    setTimeout(() => {
      this.onModelLoad();
    }, 1200);
  }

  onModelLoad(): void {
    this.isLoading.set(false);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onScroll(event: Event): void {
    const container = event.target as HTMLElement;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return;

    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    this.updateCameraTargets(progress);
  }

  private updateCameraTargets(progress: number): void {
    const totalSegments = this.slides.length - 1;
    const rawIndex = progress * totalSegments;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(rawIndex));
    const segmentProgress = rawIndex - segmentIndex;

    const startSlide = this.slides[segmentIndex];
    const endSlide = this.slides[segmentIndex + 1];

    // Determine current general active index for audio triggers & slide indicators
    const resolvedIndex = Math.round(rawIndex);
    if (resolvedIndex !== this.lastActiveIndex) {
      this.lastActiveIndex = resolvedIndex;
      this.activeSlideIndex.set(resolvedIndex);
      this.audio.playTick(); // Play tactile click when crossing slide thresholds
      
      // Update interactive HUD specs based on current storytelling beat
      switch(resolvedIndex) {
        case 0:
          this.systemIntegrity.set(100);
          this.oxygenLevel.set(99);
          this.pressureStatus.set('1.00 atm');
          this.glowColor.set('rgba(56, 189, 248, 0.15)'); // Cyan
          break;
        case 1:
          this.systemIntegrity.set(97);
          this.oxygenLevel.set(98);
          this.pressureStatus.set('0.98 atm');
          this.glowColor.set('rgba(168, 85, 247, 0.15)'); // Purple (Visor focal check)
          break;
        case 2:
          this.systemIntegrity.set(100);
          this.oxygenLevel.set(96);
          this.pressureStatus.set('1.05 atm');
          this.glowColor.set('rgba(16, 185, 129, 0.15)'); // Green (Composite Shell protection)
          break;
        case 3:
          this.systemIntegrity.set(93);
          this.oxygenLevel.set(95);
          this.pressureStatus.set('0.85 atm');
          this.glowColor.set('rgba(239, 68, 68, 0.15)'); // Red (Flow port pressure scan)
          break;
        case 4:
          this.systemIntegrity.set(100);
          this.oxygenLevel.set(100);
          this.pressureStatus.set('1.00 atm');
          this.glowColor.set('rgba(245, 158, 11, 0.15)'); // Amber (Ready for launch)
          break;
      }
    }

    // Interpolate orbit angles
    this.targetTheta = this.lerp(startSlide.theta, endSlide.theta, segmentProgress);
    this.targetPhi = this.lerp(startSlide.phi, endSlide.phi, segmentProgress);
    this.targetRadius = this.lerp(startSlide.radius, endSlide.radius, segmentProgress);

    // Interpolate target positions
    this.targetTargetX = this.lerp(startSlide.targetX, endSlide.targetX, segmentProgress);
    this.targetTargetY = this.lerp(startSlide.targetY, endSlide.targetY, segmentProgress);
    this.targetTargetZ = this.lerp(startSlide.targetZ, endSlide.targetZ, segmentProgress);
  }

  private lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
  }

  private tickInterpolation(): void {
    // Smooth lerp update toward target values at 60fps
    this.currentTheta = this.lerp(this.currentTheta, this.targetTheta, 0.1);
    this.currentPhi = this.lerp(this.currentPhi, this.targetPhi, 0.1);
    this.currentRadius = this.lerp(this.currentRadius, this.targetRadius, 0.1);
    this.currentTargetX = this.lerp(this.currentTargetX, this.targetTargetX, 0.1);
    this.currentTargetY = this.lerp(this.currentTargetY, this.targetTargetY, 0.1);
    this.currentTargetZ = this.lerp(this.currentTargetZ, this.targetTargetZ, 0.1);

    const viewer = this.viewerRef()?.nativeElement;
    if (viewer) {
      // Apply attributes directly for high-performance updates
      viewer.setAttribute('camera-orbit', `${this.currentTheta}deg ${this.currentPhi}deg ${this.currentRadius}m`);
      viewer.setAttribute('camera-target', `${this.currentTargetX}m ${this.currentTargetY}m ${this.currentTargetZ}m`);
    }

    this.animationFrameId = requestAnimationFrame(() => this.tickInterpolation());
  }

  scrollToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;

    const container = this.scrollContainerRef()?.nativeElement;
    const isMobile = !container || container.clientHeight === 0;

    if (isMobile) {
      // Mobile tap-nav: directly update camera targets since there's no scroll interaction
      const progress = index / (this.slides.length - 1);
      this.updateCameraTargets(progress);
      this.activeSlideIndex.set(index);
    } else {
      // Desktop: let the smooth scroll of the container trigger onScroll to update the camera
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll > 0) {
        const scrollDest = (index / (this.slides.length - 1)) * maxScroll;
        container.scrollTo({
          top: scrollDest,
          behavior: 'smooth'
        });
      }
    }
  }
}
