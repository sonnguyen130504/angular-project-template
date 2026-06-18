import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { UiStatComponent } from '@app/shared/ui/ui-stat/ui-stat.component';
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent, UiCardComponent, UiStatComponent, TranslocoDirective],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  private transloco = inject(TranslocoService);
  marketingEmails = true;
  orderSms = false;
  readonly payments = ['visa4242', 'backup1188'];
  readonly orders = [
    { id: '#1048', item: 'fieldJacket', total: '$248', status: 'delivered' },
    { id: '#1039', item: 'marketTote', total: '$64', status: 'inTransit' },
    { id: '#1021', item: 'travelKit', total: '$46', status: 'returned' },
  ];
  sessions = [
    { device: 'Chrome on Windows', location: 'Ho Chi Minh City', current: true },
    { device: 'Safari on iPhone', location: 'Singapore', current: false },
    { device: 'Edge on Windows', location: 'Da Nang', current: false },
  ];
  readonly addresses = ['home', 'office'];
  readonly wishlist = ['utilityCap', 'careSpray', 'packableTote'];
  readonly activity = ['profileUpdated', 'passwordChanged', 'wishlistItemBack'];
  savedMessage = '';

  saveProfile(): void {
    this.savedMessage = this.transloco.translate('profile.savedMessage');
    setTimeout(() => {
      this.savedMessage = '';
    }, 3000);
  }

  revokeSession(device: string): void {
    this.sessions = this.sessions.filter((session) => session.current || session.device !== device);
  }
}
