import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { RouterLink } from '@angular/router';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { UiStatComponent } from '@app/shared/ui/ui-stat/ui-stat.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

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
  ],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  // Reference Lab interactive state
  labSliderValue = 65;
  labToggleState = true;
  labDensity: 'comfortable' | 'compact' | 'airy' = 'comfortable';
  labAccent: 'clay' | 'teal' = 'clay';
  labRadius: 'soft' | 'none' | 'pill' = 'soft';

  // Simplified Route Directory Groups (linking ONLY to the 2 primary reference pages)
  readonly groups = [
    {
      name: 'Animation Playground & Physics Lab',
      path: '/motion-lab',
      summary: 'Explore elastic character wave physics solvers, direct DOM magnetic buttons, cyber matrix scramblers, and scroll stack cards.',
      highlight: 'Advanced Spring Solvers & FLIP',
    },
    {
      name: 'Interactive Component Gallery',
      path: '/component-gallery',
      summary: 'Tweak code variables using control knobs. Live previews and ready-to-copy HTML & TypeScript snippets for buttons, cards, and modal dialogs.',
      highlight: 'Configurable Code Sandbox',
    },
  ];

  // Quality Gates Specification Grid
  readonly qualityGates = [
    {
      title: 'Performance Motion & Physics',
      desc: 'Tactile spring-based interactions running programmatically outside the Angular Zone to lock 60+ FPS, with instant prefers-reduced-motion fallback.',
      icon: 'pi-bolt',
      tag: 'Animation'
    },
    {
      title: 'Configurable Sandbox API',
      desc: 'Knobs interface to toggle sizes, variants, icons, and state transitions, exposing instantly copy-pasteable HTML/TS markup blocks.',
      icon: 'pi-code',
      tag: 'Reference'
    },
    {
      title: 'AA Contrast Ratio',
      desc: 'All foreground elements meet a minimum 4.5:1 contrast against their background for maximum readability.',
      icon: 'pi-eye',
      tag: 'Accessibility'
    },
    {
      title: 'Responsive Architecture',
      desc: 'Layouts, grid frameworks, and dialog wrappers snap fluidly across standard breakpoints (640px to 1530px).',
      icon: 'pi-mobile',
      tag: 'Layout'
    }
  ];
}





