import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ThemeService } from '../../shared/services/theme.service';
import { FeedbackWidgetComponent } from '../../shared/ui/feedback-widget/feedback-widget.component';
import { LanguageSwitcherComponent } from '../../shared/ui/language-switcher/language-switcher.component';
import { ThreeDAudioService } from '../../features/product-3d-showcase/services/three-d-audio.service';

type NavGroup = {
  label: string;
  key: string;
  links: Array<{ key: string; path: string; exact?: boolean }>;
};

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FeedbackWidgetComponent, LanguageSwitcherComponent, TranslocoDirective],
  templateUrl: './app-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(ThreeDAudioService);
  
  openGroup = '';
  isMobileMenuOpen = false;
  openMobileGroup = '';

  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      this.closeMenus();
      this.closeMobileMenu();
    });
  }

  toggleGroup(group: string): void {
    this.openGroup = this.openGroup === group ? '' : group;
  }

  closeMenus(): void {
    this.openGroup = '';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.openMobileGroup = '';
    }
  }

  toggleMobileGroup(group: string): void {
    this.openMobileGroup = this.openMobileGroup === group ? '' : group;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.openMobileGroup = '';
  }

  readonly navGroups: NavGroup[] = [
    {
      label: 'Commerce',
      key: 'commerce',
      links: [
        { key: 'home', path: '/', exact: true },
        { key: 'catalog', path: '/catalog' },
        { key: 'product', path: '/product' },
        { key: 'cart', path: '/cart' },
      ],
    },
    {
      label: 'Operations',
      key: 'operations',
      links: [
        { key: 'dashboard', path: '/dashboard' },
        { key: 'settings', path: '/settings' },
        { key: 'profile', path: '/profile' },
        { key: 'billing', path: '/billing' },
        { key: 'activityLog', path: '/activity-log' },
        { key: 'setup', path: '/setup' },
      ],
    },
    {
      label: 'Workspace',
      key: 'workspace',
      links: [
        { key: 'inbox', path: '/inbox' },
        { key: 'calendar', path: '/calendar' },
        { key: 'tasks', path: '/tasks' },
        { key: 'team', path: '/team' },
        { key: 'assets', path: '/assets' },
      ],
    },
    {
      label: 'Reference Kit',
      key: 'referenceKit',
      links: [
        { key: 'components', path: '/component-gallery' },
        { key: 'forms', path: '/forms' },
        { key: 'charts', path: '/data-visualization' },
        { key: 'motion', path: '/motion-lab' },
        { key: 'empty', path: '/empty-state' },
      ],
    },
    {
      label: 'Auth',
      key: 'auth',
      links: [
        { key: 'signIn', path: '/sign-in' },
        { key: 'forgot', path: '/forgot-password' },
      ],
    },
    {
      label: 'Interactive',
      key: 'interactive',
      links: [
        { key: 'showcase3d', path: '/3d-showcase' },
        { key: 'storytelling3d', path: '/3d-storytelling' },
        { key: 'tactileSound', path: '/tactile-sound' },
        { key: 'mobileSimulator', path: '/mobile-patterns' },
      ],
    },
  ];
}

