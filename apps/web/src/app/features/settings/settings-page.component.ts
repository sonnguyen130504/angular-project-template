import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { UiStatComponent } from '@app/shared/ui/ui-stat/ui-stat.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [FormsModule, RouterLink, PageSectionComponent, UiBadgeComponent, UiButtonComponent, UiCardComponent, UiStatComponent],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
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
  savedMessage = 'No unsaved changes';

  saveSettings(): void {
    this.savedMessage = `${this.storeName} settings saved.`;
  }
}





