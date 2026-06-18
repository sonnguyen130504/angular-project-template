import { Routes } from '@angular/router';
import { Product3DShowcasePageComponent } from '@app/features/product-3d-showcase/product-3d-showcase-page.component';
import { Product3DStorytellingPageComponent } from '@app/features/product-3d-storytelling/product-3d-storytelling-page.component';
import { TactileSoundPageComponent } from '@app/features/tactile-sound/tactile-sound-page.component';
import { AudioStudioPageComponent } from '@app/features/audio-studio/audio-studio-page.component';
import { PhysicsLabPageComponent } from '@app/features/physics-lab/physics-lab-page.component';
import { HomePageComponent } from '@app/features/home/home-page.component';
import { MobilePatternsPageComponent } from '@app/features/mobile-patterns/mobile-patterns-page.component';
import { CatalogPageComponent } from '@app/features/catalog/catalog-page.component';
import { ProductPageComponent } from '@app/features/product/product-page.component';
import { CartPageComponent } from '@app/features/cart/cart-page.component';
import { SettingsPageComponent } from '@app/features/settings/settings-page.component';
import { NotFoundPageComponent } from '@app/features/not-found/not-found-page.component';
import { SignInPageComponent } from '@app/features/sign-in/sign-in-page.component';
import { EmptyStatePageComponent } from '@app/features/empty-state/empty-state-page.component';
import { DashboardPageComponent } from '@app/features/dashboard/dashboard-page.component';
import { ForgotPasswordPageComponent } from '@app/features/forgot-password/forgot-password-page.component';
import { ProfilePageComponent } from '@app/features/profile/profile-page.component';
import { ComponentGalleryPageComponent } from '@app/features/component-gallery/component-gallery-page.component';
import { FormsPageComponent } from '@app/features/forms/forms-page.component';
import { DataVisualizationPageComponent } from '@app/features/data-visualization/data-visualization-page.component';
import { MotionLabPageComponent } from '@app/features/motion-lab/motion-lab-page.component';
import { InboxPageComponent } from '@app/features/inbox/inbox-page.component';
import { CalendarPageComponent } from '@app/features/calendar/calendar-page.component';
import { TasksPageComponent } from '@app/features/tasks/tasks-page.component';
import { TeamPageComponent } from '@app/features/team/team-page.component';
import { BillingPageComponent } from '@app/features/billing/billing-page.component';
import { AssetsPageComponent } from '@app/features/assets/assets-page.component';
import { ActivityLogPageComponent } from '@app/features/activity-log/activity-log-page.component';
import { SetupPageComponent } from '@app/features/setup/setup-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'mobile-patterns',
    component: MobilePatternsPageComponent,
  },
  {
    path: 'catalog',
    component: CatalogPageComponent,
  },
  {
    path: 'product',
    component: ProductPageComponent,
  },
  {
    path: '3d-showcase',
    component: Product3DShowcasePageComponent,
  },
  {
    path: '3d-storytelling',
    component: Product3DStorytellingPageComponent,
  },
  {
    path: 'tactile-sound',
    component: TactileSoundPageComponent,
  },
  {
    path: 'audio-studio',
    component: AudioStudioPageComponent,
  },
  {
    path: 'physics-lab',
    component: PhysicsLabPageComponent,
  },
  {
    path: 'cart',
    component: CartPageComponent,
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
  },
  {
    path: 'sign-in',
    component: SignInPageComponent,
  },
  {
    path: 'empty-state',
    component: EmptyStatePageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'component-gallery',
    component: ComponentGalleryPageComponent,
  },
  {
    path: 'forms',
    component: FormsPageComponent,
  },
  {
    path: 'data-visualization',
    component: DataVisualizationPageComponent,
  },
  {
    path: 'motion-lab',
    component: MotionLabPageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
  },
  {
    path: 'inbox',
    component: InboxPageComponent,
  },
  {
    path: 'calendar',
    component: CalendarPageComponent,
  },
  {
    path: 'tasks',
    component: TasksPageComponent,
  },
  {
    path: 'team',
    component: TeamPageComponent,
  },
  {
    path: 'billing',
    component: BillingPageComponent,
  },
  {
    path: 'assets',
    component: AssetsPageComponent,
  },
  {
    path: 'activity-log',
    component: ActivityLogPageComponent,
  },
  {
    path: 'setup',
    component: SetupPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
