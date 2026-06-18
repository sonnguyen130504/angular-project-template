import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { RouterLink } from '@angular/router';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { UiStatComponent } from '@app/shared/ui/ui-stat/ui-stat.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    PageSectionComponent,
    UiBadgeComponent,
    UiCardComponent,
    UiStatComponent,
    UiButtonComponent,
    FormsModule,
    SliderModule,
    TranslocoDirective,
  ],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private translocoService = inject(TranslocoService);

  // Reference Lab interactive state
  labSliderValue = 65;
  labToggleState = true;
  labDensity: 'comfortable' | 'compact' | 'airy' = 'comfortable';
  labAccent: 'clay' | 'teal' = 'clay';
  labRadius: 'soft' | 'none' | 'pill' = 'soft';

  // Getter to dynamically translate Route Directory Groups
  get groups() {
    return [
      {
        name: this.translocoService.translate('home.groups.animation.name'),
        path: '/motion-lab',
        summary: this.translocoService.translate('home.groups.animation.summary'),
        highlight: this.translocoService.translate('home.groups.animation.highlight'),
      },
      {
        name: this.translocoService.translate('home.groups.gallery.name'),
        path: '/component-gallery',
        summary: this.translocoService.translate('home.groups.gallery.summary'),
        highlight: this.translocoService.translate('home.groups.gallery.highlight'),
      },
    ];
  }

  // Getter to dynamically translate Quality Gates Specification Grid
  get qualityGates() {
    return [
      {
        title: this.translocoService.translate('home.gates.motion.title'),
        desc: this.translocoService.translate('home.gates.motion.desc'),
        icon: 'pi-bolt',
        tag: this.translocoService.translate('home.gates.motion.tag')
      },
      {
        title: this.translocoService.translate('home.gates.sandbox.title'),
        desc: this.translocoService.translate('home.gates.sandbox.desc'),
        icon: 'pi-code',
        tag: this.translocoService.translate('home.gates.sandbox.tag')
      },
      {
        title: this.translocoService.translate('home.gates.contrast.title'),
        desc: this.translocoService.translate('home.gates.contrast.desc'),
        icon: 'pi-eye',
        tag: this.translocoService.translate('home.gates.contrast.tag')
      },
      {
        title: this.translocoService.translate('home.gates.responsive.title'),
        desc: this.translocoService.translate('home.gates.responsive.desc'),
        icon: 'pi-mobile',
        tag: this.translocoService.translate('home.gates.responsive.tag')
      }
    ];
  }
}





