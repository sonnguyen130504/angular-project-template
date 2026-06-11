import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

type Member = {
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited';
};

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.scss',
})
export class TeamPageComponent {
  inviteEmail = '';
  inviteState = 'No invite drafted';
  roleFilter: 'All' | Member['role'] = 'All';
  members: Member[] = [
    { name: 'Mina Tran', email: 'mina@example.com', role: 'Owner', status: 'Active' },
    { name: 'Noor Ali', email: 'noor@example.com', role: 'Admin', status: 'Active' },
    { name: 'Liam Wood', email: 'liam@example.com', role: 'Editor', status: 'Active' },
    { name: 'An Le', email: 'an@example.com', role: 'Viewer', status: 'Invited' },
  ];

  readonly permissions = [
    { label: 'Manage billing', Owner: true, Admin: false, Editor: false, Viewer: false },
    { label: 'Publish catalog', Owner: true, Admin: true, Editor: true, Viewer: false },
    { label: 'View analytics', Owner: true, Admin: true, Editor: true, Viewer: true },
    { label: 'Invite teammates', Owner: true, Admin: true, Editor: false, Viewer: false },
    { label: 'Export audit log', Owner: true, Admin: true, Editor: false, Viewer: false },
  ];

  readonly accessReviews = [
    { label: 'Owner actions locked', detail: 'Owner role cannot be downgraded from this table.' },
    { label: 'Viewer invite pending', detail: 'An Le has not accepted the workspace invite.' },
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
      this.inviteState = 'Enter a valid email before sending.';
      return;
    }
    this.members = [...this.members, { name: 'Pending user', email: this.inviteEmail, role: 'Viewer', status: 'Invited' }];
    this.inviteState = `Invite sent to ${this.inviteEmail}.`;
    this.inviteEmail = '';
  }
}



