import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-micro-interactions-panel',
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './micro-interactions-panel.component.html',
})
export class MicroInteractionsPanelComponent {
  simulateReducedMotion = input(false);

  requestState: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  requestErrorMsg = '';
  requestItems: Array<{ name: string; category: string; price: string }> = [];

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

  triggerRequest(): void {
    if (this.requestState === 'loading') return;

    this.playClickSound();
    this.requestState = 'loading';
    this.requestErrorMsg = '';
    this.requestItems = [];

    setTimeout(() => {
      if (Math.random() > 0.2) {
        this.requestItems = [
          { name: 'Linen Chore Jacket', category: 'Apparel', price: '$180' },
          { name: 'Leather Card Case', category: 'Accessories', price: '$45' },
          { name: 'Brass Key Ring', category: 'Accessories', price: '$28' },
        ];
        this.requestState = 'success';
      } else {
        this.requestErrorMsg = 'Server connection timeout. Please check your config parameters.';
        this.requestState = 'error';
      }
      this.playClickSound();
    }, 1800);
  }

  resetRequest(): void {
    this.playClickSound();
    this.requestState = 'idle';
    this.requestErrorMsg = '';
    this.requestItems = [];
  }
}



