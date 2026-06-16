import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

type ThreadStatus = 'Unread' | 'Waiting' | 'Archived';

type InboxThread = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  status: ThreadStatus;
  priority: 'High' | 'Normal';
  time: string;
  channel: 'Email' | 'Chat' | 'System';
  assignee: string;
  sla: string;
  tags: string[];
};

@Component({
  selector: 'app-inbox-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent],
  templateUrl: './inbox-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './inbox-page.component.scss',
})
export class InboxPageComponent {
  filter: 'All' | ThreadStatus = 'All';
  query = '';
  selectedId = 101;

  threads: InboxThread[] = [
    { id: 101, from: 'Mina Tran', subject: 'Return label request', preview: 'Customer needs a prepaid label before pickup closes.', status: 'Unread', priority: 'High', time: '09:42', channel: 'Email', assignee: 'Nora', sla: '42m left', tags: ['Returns', 'Shipping'] },
    { id: 102, from: 'Warehouse', subject: 'Low stock confirmation', preview: 'Travel Kit count is confirmed at 18 units.', status: 'Waiting', priority: 'Normal', time: '08:15', channel: 'System', assignee: 'Minh', sla: '2h left', tags: ['Inventory'] },
    { id: 103, from: 'Design QA', subject: 'Catalog image notes', preview: 'Three product cards need alternate image crops.', status: 'Unread', priority: 'Normal', time: 'Yesterday', channel: 'Chat', assignee: 'Ari', sla: 'Tomorrow', tags: ['Catalog', 'QA'] },
    { id: 104, from: 'Support Bot', subject: 'Refund macro updated', preview: 'New refund copy is ready for agent review.', status: 'Archived', priority: 'Normal', time: 'Mon', channel: 'System', assignee: 'Support', sla: 'Closed', tags: ['Macro'] },
  ];

  readonly macros = ['Send return label', 'Ask for order number', 'Escalate to warehouse'];
  readonly filterOptions: ('All' | ThreadStatus)[] = ['All', 'Unread', 'Waiting', 'Archived'];

  get counts(): Record<'All' | ThreadStatus, number> {
    return {
      All: this.threads.length,
      Unread: this.threads.filter((thread) => thread.status === 'Unread').length,
      Waiting: this.threads.filter((thread) => thread.status === 'Waiting').length,
      Archived: this.threads.filter((thread) => thread.status === 'Archived').length,
    };
  }

  get filteredThreads(): InboxThread[] {
    const normalized = this.query.trim().toLowerCase();
    return this.threads.filter((thread) => {
      const matchesFilter = this.filter === 'All' || thread.status === this.filter;
      const matchesQuery = !normalized || `${thread.from} ${thread.subject} ${thread.preview}`.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }

  get selectedThread(): InboxThread | undefined {
    return this.threads.find((thread) => thread.id === this.selectedId) ?? this.filteredThreads[0];
  }

  get highPriorityCount(): number {
    return this.threads.filter((thread) => thread.priority === 'High').length;
  }

  setFilter(filter: 'All' | ThreadStatus): void {
    this.filter = filter;
    this.selectedId = this.filteredThreads[0]?.id ?? this.selectedId;
  }

  selectThread(thread: InboxThread): void {
    this.selectedId = thread.id;
  }

  archiveSelected(): void {
    this.threads = this.threads.map((thread) =>
      thread.id === this.selectedThread?.id ? { ...thread, status: 'Archived' } : thread,
    );
  }

  markRead(): void {
    this.threads = this.threads.map((thread) =>
      thread.id === this.selectedThread?.id ? { ...thread, status: 'Waiting' } : thread,
    );
  }
}



