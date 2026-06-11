import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

type ActivitySeverity = 'Info' | 'Warning' | 'Critical';

type ActivityEntry = {
  actor: string;
  action: string;
  target: string;
  severity: ActivitySeverity;
  time: string;
  source: 'Catalog' | 'Security' | 'Billing' | 'Automation';
  detail: string;
};

@Component({
  selector: 'app-activity-log-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent],
  templateUrl: './activity-log-page.component.html',
  styleUrl: './activity-log-page.component.scss',
})
export class ActivityLogPageComponent {
  actorFilter = 'All';
  exportState = 'Ready to export filtered events.';
  readonly actors = ['All', 'Mina', 'Noor', 'System'];
  readonly entries: ActivityEntry[] = [
    { actor: 'Mina', action: 'Updated product price', target: 'Field Jacket', severity: 'Info', time: '09:44', source: 'Catalog', detail: 'Price changed from $118 to $128 and published to the storefront.' },
    { actor: 'System', action: 'Blocked risky order', target: '#1046', severity: 'Critical', time: '09:12', source: 'Security', detail: 'Order matched velocity and card mismatch rules before fulfillment.' },
    { actor: 'Noor', action: 'Changed role', target: 'Liam Wood', severity: 'Warning', time: 'Yesterday', source: 'Security', detail: 'Role changed from Viewer to Editor. Review export access.' },
    { actor: 'System', action: 'Synced invoice', target: 'INV-2048', severity: 'Info', time: 'Mon', source: 'Billing', detail: 'Invoice was synchronized after payment confirmation.' },
  ];

  get severityCounts(): Record<ActivitySeverity, number> {
    return {
      Critical: this.visibleEntries.filter((entry) => entry.severity === 'Critical').length,
      Warning: this.visibleEntries.filter((entry) => entry.severity === 'Warning').length,
      Info: this.visibleEntries.filter((entry) => entry.severity === 'Info').length,
    };
  }

  get visibleEntries(): ActivityEntry[] {
    return this.actorFilter === 'All' ? this.entries : this.entries.filter((entry) => entry.actor === this.actorFilter);
  }

  exportLog(): void {
    this.exportState = `Export prepared for ${this.visibleEntries.length} events.`;
  }
}



