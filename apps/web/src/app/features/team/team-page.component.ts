import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco';

type Member = {
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited';
};

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent, TranslocoDirective],
  templateUrl: './team-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './team-page.component.scss',
})
export class TeamPageComponent {
  private transloco = inject(TranslocoService);
  inviteEmail = '';
  inviteState = this.transloco.translate('team.noInviteDrafted');
  roleFilter: 'All' | Member['role'] = 'All';
  members: Member[] = [
    { name: 'Mina Tran', email: 'mina@example.com', role: 'Owner', status: 'Active' },
    { name: 'Noor Ali', email: 'noor@example.com', role: 'Admin', status: 'Active' },
    { name: 'Liam Wood', email: 'liam@example.com', role: 'Editor', status: 'Active' },
    { name: 'An Le', email: 'an@example.com', role: 'Viewer', status: 'Invited' },
  ];

  readonly permissions = [
    { label: 'manageBilling', Owner: true, Admin: false, Editor: false, Viewer: false },
    { label: 'publishCatalog', Owner: true, Admin: true, Editor: true, Viewer: false },
    { label: 'viewAnalytics', Owner: true, Admin: true, Editor: true, Viewer: true },
    { label: 'inviteTeammates', Owner: true, Admin: true, Editor: false, Viewer: false },
    { label: 'exportAuditLog', Owner: true, Admin: true, Editor: false, Viewer: false },
  ];

  readonly accessReviews = [
    { label: 'ownerActionsLocked', detail: 'ownerDowngradeDetail' },
    { label: 'viewerInvitePending', detail: 'invitePendingDetail' },
  ];

  get visibleMembers(): Member[] {
    return this.roleFilter === 'All' ? this.members : this.members.filter((member) => member.role === this.roleFilter);
  }

  get pendingInvites(): number {
    return this.members.filter((member) => member.status === 'Invited').length;
  }

  countRole(role: Member['role']): number {
    return this.members.filter((member) => member.role === role).length;
  }

  sendInvite(): void {
    if (!this.inviteEmail.includes('@')) {
      this.inviteState = this.transloco.translate('team.enterValidEmail');
      return;
    }
    this.members = [...this.members, { name: this.transloco.translate('team.pendingUser'), email: this.inviteEmail, role: 'Viewer', status: 'Invited' }];
    this.inviteState = this.transloco.translate('team.inviteSentTo', { email: this.inviteEmail });
    this.inviteEmail = '';
  }
}
