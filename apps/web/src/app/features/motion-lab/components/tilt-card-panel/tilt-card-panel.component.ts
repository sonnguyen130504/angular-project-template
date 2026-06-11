import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, signal, viewChild, input } from '@angular/core';

@Component({
  selector: 'app-tilt-card-panel',
  standalone: true,
  templateUrl: './tilt-card-panel.component.html',
  styleUrl: './tilt-card-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiltCardPanelComponent {
  motionIntensity = input<'high' | 'medium' | 'low'>('high');
  simulateReducedMotion = input<boolean>(false);

  cardRef = viewChild<ElementRef<HTMLDivElement>>('card');
  
  rotateX = signal(0);
  rotateY = signal(0);
  glareX = signal(50);
  glareY = signal(50);
  isHovered = signal(false);

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const el = this.cardRef()?.nativeElement;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element
    const y = event.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation limits (e.g. max 15 degrees)
    const maxRotation = 15;
    
    // Y rotation depends on X position (left side = negative rotation Y)
    const percentX = (x - centerX) / centerX; // -1 to 1
    // X rotation depends on Y position (top side = positive rotation X)
    const percentY = -((y - centerY) / centerY); // -1 to 1

    if (this.isHovered()) {
      this.rotateY.set(percentX * maxRotation);
      this.rotateX.set(percentY * maxRotation);

      // Glare moves opposite to mouse to simulate light source
      this.glareX.set((x / rect.width) * 100);
      this.glareY.set((y / rect.height) * 100);
    }
  }

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
    this.rotateX.set(0);
    this.rotateY.set(0);
    this.glareX.set(50);
    this.glareY.set(50);
  }
}
