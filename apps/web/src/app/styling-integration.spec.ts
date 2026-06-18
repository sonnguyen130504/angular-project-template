import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

// 1. Page Components
import { ActivityLogPageComponent } from './features/activity-log/activity-log-page.component';
import { AssetsPageComponent } from './features/assets/assets-page.component';
import { BillingPageComponent } from './features/billing/billing-page.component';
import { CalendarPageComponent } from './features/calendar/calendar-page.component';
import { CartPageComponent } from './features/cart/cart-page.component';
import { CatalogPageComponent } from './features/catalog/catalog-page.component';
import { ComponentGalleryPageComponent } from './features/component-gallery/component-gallery-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { DataVisualizationPageComponent } from './features/data-visualization/data-visualization-page.component';
import { EmptyStatePageComponent } from './features/empty-state/empty-state-page.component';
import { ForgotPasswordPageComponent } from './features/forgot-password/forgot-password-page.component';
import { FormsPageComponent } from './features/forms/forms-page.component';
import { HomePageComponent } from './features/home/home-page.component';
import { InboxPageComponent } from './features/inbox/inbox-page.component';
import { MotionLabPageComponent } from './features/motion-lab/motion-lab-page.component';
import { NotFoundPageComponent } from './features/not-found/not-found-page.component';
import { ProductPageComponent } from './features/product/product-page.component';
import { ProfilePageComponent } from './features/profile/profile-page.component';
import { SettingsPageComponent } from './features/settings/settings-page.component';
import { SetupPageComponent } from './features/setup/setup-page.component';
import { SignInPageComponent } from './features/sign-in/sign-in-page.component';
import { TasksPageComponent } from './features/tasks/tasks-page.component';
import { TeamPageComponent } from './features/team/team-page.component';

// 2. Shared UI Components
import { PageSectionComponent } from './shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from './shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from './shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from './shared/ui/ui-card/ui-card.component';
import { UiStatComponent } from './shared/ui/ui-stat/ui-stat.component';

import { getTranslocoModule } from './transloco-testing.module';

describe('Global Styling Integration Verification', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [
        provideRouter([]),
        provideNoopAnimations()
      ]
    }).compileComponents();
  });

  // Helper to verify component styling
  function verifyStyle(component: any, selector: string, property: string, expectedValue: string) {
    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector(selector);
    expect(element).toBeTruthy(`Selector "${selector}" not found in component ${component.name}`);
    const computed = getComputedStyle(element);
    expect(computed.getPropertyValue(property)).toBe(expectedValue, `Style mismatch in ${component.name} on ${selector} for property ${property}`);
  }

  describe('Feature Pages', () => {
    it('ActivityLogPageComponent imports styling correctly', () => {
      verifyStyle(ActivityLogPageComponent, '.log-brief', 'display', 'flex');
    });

    it('AssetsPageComponent imports styling correctly', () => {
      verifyStyle(AssetsPageComponent, '.assets-brief', 'display', 'flex');
    });

    it('BillingPageComponent imports styling correctly', () => {
      verifyStyle(BillingPageComponent, '.billing-brief', 'display', 'flex');
    });

    it('CalendarPageComponent imports styling correctly', () => {
      verifyStyle(CalendarPageComponent, '.calendar-brief', 'display', 'flex');
    });

    it('CartPageComponent imports styling correctly', () => {
      verifyStyle(CartPageComponent, '.summary-card', 'padding', '24px');
    });

    it('CatalogPageComponent imports styling correctly', () => {
      verifyStyle(CatalogPageComponent, '.catalog-shell', 'display', 'grid');
    });

    it('ComponentGalleryPageComponent imports styling correctly', () => {
      verifyStyle(ComponentGalleryPageComponent, '.explorer-intro', 'padding-bottom', '16px');
    });

    it('DashboardPageComponent imports styling correctly', () => {
      verifyStyle(DashboardPageComponent, '.bento-grid', 'display', 'grid');
    });

    it('DataVisualizationPageComponent imports styling correctly', () => {
      verifyStyle(DataVisualizationPageComponent, '.kpi-strip', 'display', 'flex');
    });

    it('EmptyStatePageComponent imports styling correctly', () => {
      verifyStyle(EmptyStatePageComponent, '.intro-bar', 'display', 'flex');
    });

    it('ForgotPasswordPageComponent imports styling correctly', () => {
      verifyStyle(ForgotPasswordPageComponent, '.auth-form-pane', 'padding', '40px');
    });

    it('FormsPageComponent imports styling correctly', () => {
      verifyStyle(FormsPageComponent, '.stepper-indicator-row', 'display', 'flex');
    });

    it('HomePageComponent imports styling correctly', () => {
      verifyStyle(HomePageComponent, '.hero-content', 'display', 'flex');
    });

    it('InboxPageComponent imports styling correctly', () => {
      verifyStyle(InboxPageComponent, '.inbox-brief', 'display', 'flex');
    });

    it('MotionLabPageComponent imports styling correctly', () => {
      verifyStyle(MotionLabPageComponent, '.playground-header-row', 'display', 'grid');
    });

    it('NotFoundPageComponent imports styling correctly', () => {
      verifyStyle(NotFoundPageComponent, '.not-found-hero', 'display', 'flex');
    });

    it('ProductPageComponent imports styling correctly', () => {
      verifyStyle(ProductPageComponent, '.product-layout', 'display', 'grid');
    });

    it('ProfilePageComponent imports styling correctly', () => {
      verifyStyle(ProfilePageComponent, '.profile-layout', 'display', 'grid');
    });

    it('SettingsPageComponent imports styling correctly', () => {
      verifyStyle(SettingsPageComponent, '.settings-layout', 'display', 'grid');
    });

    it('SetupPageComponent imports styling correctly', () => {
      verifyStyle(SetupPageComponent, '.setup-hero', 'display', 'flex');
    });

    it('SignInPageComponent imports styling correctly', () => {
      verifyStyle(SignInPageComponent, '.auth-form-pane', 'padding', '40px');
    });

    it('TasksPageComponent imports styling correctly', () => {
      verifyStyle(TasksPageComponent, '.task-brief', 'display', 'flex');
    });

    it('TeamPageComponent imports styling correctly', () => {
      verifyStyle(TeamPageComponent, '.team-brief', 'display', 'flex');
    });

    it('CatalogPageComponent add-btn has responsive full width', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      fixture.detectChanges();
      const addBtn = fixture.nativeElement.querySelector('.add-btn');
      expect(addBtn).toBeTruthy();
      expect(addBtn.classList.contains('full-width')).toBeTrue();
    });

    it('EmptyStatePageComponent search container has responsive maximum height constraint', () => {
      const fixture = TestBed.createComponent(EmptyStatePageComponent);
      const component = fixture.componentInstance;
      component.activeStateId = 'no-results';
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('.search-layout-container');
      expect(container).toBeTruthy();
      const computed = getComputedStyle(container);
      expect(computed.maxHeight).toBe('410px');
    });
  });

  describe('Shared UI Components', () => {
    it('PageSectionComponent imports styling correctly', () => {
      verifyStyle(PageSectionComponent, '.section', 'padding-top', '22px');
    });

    it('UiBadgeComponent imports styling correctly', () => {
      verifyStyle(UiBadgeComponent, 'span', 'font-weight', '800');
    });

    it('UiButtonComponent imports styling correctly', () => {
      verifyStyle(UiButtonComponent, 'button', 'font-weight', '800');
    });

    it('UiCardComponent imports styling correctly', () => {
      const fixture = TestBed.createComponent(UiCardComponent);
      fixture.detectChanges();
      const computed = getComputedStyle(fixture.nativeElement);
      expect(computed.display).toBe('block');
    });

    it('UiStatComponent imports styling correctly', () => {
      verifyStyle(UiStatComponent, '.stat', 'padding', '18px');
    });
  });
});
