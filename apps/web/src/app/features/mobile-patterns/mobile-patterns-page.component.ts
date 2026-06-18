import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MobileSimulatorComponent } from '@app/shared/ui/mobile-simulator/mobile-simulator.component';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-mobile-patterns-page',
  standalone: true,
  imports: [MobileSimulatorComponent, TranslocoDirective],
  templateUrl: './mobile-patterns-page.component.html',
  styleUrl: './mobile-patterns-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobilePatternsPageComponent {
  private sanitizer = inject(DomSanitizer);

  patterns = [
    { id: 'tasks', name: 'Kanban Board', description: 'Bulletproof horizontal scroll', path: '/tasks' },
    { id: 'cart', name: 'Mobile Cart', description: 'Stacked layout and order summary', path: '/cart' },
    { id: 'settings', name: 'Settings', description: 'Form wrapping and controls', path: '/settings' },
    { id: 'catalog', name: 'Catalog', description: 'Grid to list adaptation', path: '/catalog' },
    { id: 'data-visualization', name: 'Data Viz', description: 'Responsive charts and switchers', path: '/data-visualization' }
  ];

  activePatternId = signal(this.patterns[0].id);

  activePattern = computed(() => {
    return this.patterns.find(p => p.id === this.activePatternId()) || this.patterns[0];
  });

  iframeUrl = computed(() => {
    // We use DOM sanitizer to safely bind the route path to the iframe src
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.activePattern().path);
  });

  selectPattern(id: string) {
    this.activePatternId.set(id);
  }
}
