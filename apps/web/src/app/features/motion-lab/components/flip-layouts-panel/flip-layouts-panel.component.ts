import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

interface LabItem {
  id: number;
  name: string;
  category: string;
  color: string;
  price: string;
}

@Component({
  selector: 'app-flip-layouts-panel',
  standalone: true,
  imports: [
    NgClass,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
  ],
  templateUrl: './flip-layouts-panel.component.html',
})
export class FlipLayoutPanelComponent {
  motionIntensity = input(6);
  simulateReducedMotion = input(false);

  columns = 3;
  items: LabItem[] = [
    { id: 1, name: 'Field Jacket', category: 'Outerwear', color: '#214b57', price: '$220' },
    { id: 2, name: 'Market Tote', category: 'Accessories', color: '#2f6f4e', price: '$85' },
    { id: 3, name: 'Desk Tray', category: 'Home', color: '#9a5e34', price: '$65' },
    { id: 4, name: 'Wool Beanie', category: 'Accessories', color: '#645c53', price: '$35' },
    { id: 5, name: 'Shell Parka', category: 'Outerwear', color: '#2f5f91', price: '$290' },
    { id: 6, name: 'Utility Pouch', category: 'Accessories', color: '#9a6a1f', price: '$45' },
  ];

  bentoCards = [
    {
      id: 1,
      title: 'Modular Architecture',
      size: 'large',
      desc: "Sion Studio leverages Angular's latest standalone features for peak modular performance.",
      image: 'bento_arch',
      color: '#214b57',
      details: 'Every component in Sion Studio is designed to be standalone, lightweight, and fully tree-shakeable. By eliminating complex inheritance hierarchies, developers can reuse components across apps instantly.'
    },
    {
      id: 2,
      title: 'Fine Grain Transitions',
      size: 'medium',
      desc: 'Custom physics solvers run outside the main change detection tree to prevent lag.',
      image: 'bento_transitions',
      color: '#9a5e34',
      details: 'By running custom animation loops outside the Angular Zone, we prevent unnecessary component re-renders. This ensures that even complex spring math executes at a locked 60fps or higher.'
    },
    {
      id: 3,
      title: 'Calm Palette',
      size: 'small',
      desc: 'A neutral, high-contrast theme optimized for professional workflow dashboards.',
      image: 'bento_palette',
      color: '#2f6f4e',
      details: 'The Sion design system rejects visually noisy UI trends. It provides a grounded off-white layout background balanced with warm clay accents and cold deep teals, keeping cognitive load low.'
    },
    {
      id: 4,
      title: 'Tactile Response',
      size: 'medium',
      desc: 'Buttons and interactive surfaces respond with micro-scale adjustments and coordinate-linked offsets. This creates a satisfying, physical response on tap and drag states.'
    }
  ];
  selectedBentoCard: any = null;

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

  shuffleItems(): void {
    this.playClickSound();
    this.animateFlip(() => {
      this.items = [...this.items].sort(() => Math.random() - 0.5);
    });
  }

  sortItems(by: 'name' | 'price'): void {
    this.playClickSound();
    this.animateFlip(() => {
      if (by === 'name') {
        this.items = [...this.items].sort((a, b) => a.name.localeCompare(b.name));
      } else {
        this.items = [...this.items].sort((a, b) => {
          const priceA = parseFloat(a.price.replace('$', ''));
          const priceB = parseFloat(b.price.replace('$', ''));
          return priceA - priceB;
        });
      }
    });
  }

  setColumns(count: number): void {
    this.playClickSound();
    this.animateFlip(() => {
      this.columns = count;
    });
  }

  private animateFlip(updateStateCallback: () => void): void {
    if (this.simulateReducedMotion()) {
      updateStateCallback();
      return;
    }

    const elements = document.querySelectorAll('.shuffle-item');
    const firstRects = new Map<string, DOMRect>();
    elements.forEach((el) => {
      const id = el.getAttribute('data-id');
      if (id) {
        firstRects.set(id, el.getBoundingClientRect());
      }
    });

    updateStateCallback();

    requestAnimationFrame(() => {
      const lastElements = document.querySelectorAll('.shuffle-item');
      lastElements.forEach((el) => {
        const id = el.getAttribute('data-id');
        if (!id) return;

        const firstRect = firstRects.get(id);
        const lastRect = el.getBoundingClientRect();

        if (firstRect) {
          const deltaX = firstRect.left - lastRect.left;
          const deltaY = firstRect.top - lastRect.top;

          const htmlEl = el as HTMLElement;
          htmlEl.style.transition = 'none';
          htmlEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          htmlEl.offsetHeight;

          const duration = 240 + this.motionIntensity() * 15;
          htmlEl.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          htmlEl.style.transform = '';
        }
      });
    });
  }

  selectBentoCard(card: any, event: MouseEvent): void {
    this.playClickSound();
    if (this.simulateReducedMotion()) {
      this.selectedBentoCard = card;
      return;
    }

    const cardEl = event.currentTarget as HTMLElement;
    const firstRect = cardEl.getBoundingClientRect();

    this.selectedBentoCard = card;

    setTimeout(() => {
      const overlayEl = document.querySelector('.bento-detail-overlay') as HTMLElement;
      if (!overlayEl) return;

      const lastRect = overlayEl.getBoundingClientRect();

      const deltaX = firstRect.left - lastRect.left;
      const deltaY = firstRect.top - lastRect.top;
      const deltaW = firstRect.width / lastRect.width;
      const deltaH = firstRect.height / lastRect.height;

      overlayEl.style.transformOrigin = 'top left';
      overlayEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
      overlayEl.style.opacity = '0';
      overlayEl.style.transition = 'none';

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      overlayEl.offsetHeight;

      overlayEl.style.transition = 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1), opacity 360ms ease';
      overlayEl.style.transform = '';
      overlayEl.style.opacity = '1';
    }, 0);
  }

  closeBentoCard(): void {
    this.playClickSound();
    if (!this.selectedBentoCard || this.simulateReducedMotion()) {
      this.selectedBentoCard = null;
      return;
    }

    const overlayEl = document.querySelector('.bento-detail-overlay') as HTMLElement;
    const originalCardEl = document.querySelector(`[data-bento-id="${this.selectedBentoCard.id}"]`) as HTMLElement;

    if (!overlayEl || !originalCardEl) {
      this.selectedBentoCard = null;
      return;
    }

    const firstRect = overlayEl.getBoundingClientRect();
    const lastRect = originalCardEl.getBoundingClientRect();

    const deltaX = lastRect.left - firstRect.left;
    const deltaY = lastRect.top - firstRect.top;
    const deltaW = lastRect.width / firstRect.width;
    const deltaH = lastRect.height / firstRect.height;

    overlayEl.style.transition = 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease';
    overlayEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
    overlayEl.style.opacity = '0';

    setTimeout(() => {
      this.selectedBentoCard = null;
    }, 320);
  }
}



