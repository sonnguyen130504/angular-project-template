import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { UiStatComponent } from '@app/shared/ui/ui-stat/ui-stat.component';
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [FormsModule, RouterLink, PageSectionComponent, UiBadgeComponent, UiButtonComponent, UiCardComponent, UiStatComponent, TranslocoDirective],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  private transloco = inject(TranslocoService);
  activeTab: 'general' | 'notifications' | 'security' | 'billing' | 'integrations' | 'danger' = 'general';
  storeName = 'Sion Studio';
  supportEmail = 'support@sion.test';
  compactMode = true;
  orderAlerts = true;
  productAlerts = false;
  twoFactor = true;
  invoiceEmails = true;
  slackSync = true;
  githubSync = false;
  deletionArmed = false;
  savedMessage = this.transloco.translate('settings.noUnsavedChanges');

  saveSettings(): void {
    this.savedMessage = this.transloco.translate('settings.settingsSaved', { name: this.storeName });
  }
}
