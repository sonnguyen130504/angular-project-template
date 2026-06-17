import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from '../../shared/services/theme.service';
import { FeedbackWidgetComponent } from '../../shared/ui/feedback-widget/feedback-widget.component';

type NavGroup = {
  label: string;
  description: string;
  links: Array<{ label: string; path: string; exact?: boolean; note: string }>;
};

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FeedbackWidgetComponent],
  templateUrl: './app-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  public themeService = inject(ThemeService);
  
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
      description: 'Shopping, product detail, and cart flows.',
      links: [
        { label: 'Home', path: '/', exact: true, note: 'Template overview' },
        { label: 'Catalog', path: '/catalog', note: 'Filters and listing states' },
        { label: 'Product', path: '/product', note: 'Variants and buy box' },
        { label: '3D Showcase', path: '/3d-showcase', note: 'Interactive 3D viewer' },
        { label: 'Cart', path: '/cart', note: 'Checkout steps and totals' },
      ],
    },
    {
      label: 'Operations',
      description: 'Admin and account surfaces for product apps.',
      links: [
        { label: 'Dashboard', path: '/dashboard', note: 'Metrics, chart, table' },
        { label: 'Settings', path: '/settings', note: 'Tabs and form states' },
        { label: 'Profile', path: '/profile', note: 'Account and activity' },
        { label: 'Billing', path: '/billing', note: 'Plans, invoices, usage' },
        { label: 'Activity Log', path: '/activity-log', note: 'Audit trail and filters' },
        { label: 'Setup', path: '/setup', note: 'Onboarding checklist' },
      ],
    },
    {
      label: 'Workspace',
      description: 'Team work surfaces beyond commerce flows.',
      links: [
        { label: 'Inbox', path: '/inbox', note: 'Message triage and threads' },
        { label: 'Calendar', path: '/calendar', note: 'Schedule and conflicts' },
        { label: 'Tasks', path: '/tasks', note: 'Kanban and list states' },
        { label: 'Team', path: '/team', note: 'Roles and permissions' },
        { label: 'Assets', path: '/assets', note: 'Files and upload states' },
      ],
    },
    {
      label: 'Reference Kit',
      description: 'Reusable UI patterns and states.',
      links: [
        { label: 'Components', path: '/component-gallery', note: 'Controls and feedback' },
        { label: 'Forms', path: '/forms', note: 'Validation patterns' },
        { label: 'Charts', path: '/data-visualization', note: 'Analytics surfaces' },
        { label: 'Motion', path: '/motion-lab', note: 'State motion' },
        { label: 'Empty', path: '/empty-state', note: 'No-data and error states' },
      ],
    },
    {
      label: 'Auth',
      description: 'Entry and recovery screens.',
      links: [
        { label: 'Sign in', path: '/sign-in', note: 'Validation and session states' },
        { label: 'Forgot', path: '/forgot-password', note: 'Recovery flow' },
      ],
    },
  ];
}
