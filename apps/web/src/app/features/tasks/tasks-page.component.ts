import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

type TaskStatus = 'Backlog' | 'Doing' | 'Review' | 'Done';

type TaskItem = {
  id: number;
  title: string;
  owner: string;
  status: TaskStatus;
  priority: 'High' | 'Normal' | 'Low';
  type: 'UI' | 'QA' | 'Docs' | 'Data';
  due: string;
  estimate: string;
  comments: number;
  blocked: boolean;
  summary: string;
};

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent {
  viewMode: 'board' | 'list' = 'board';
  priorityFilter: 'All' | TaskItem['priority'] = 'All';
  selectedTaskId = 301;
  readonly columns: TaskStatus[] = ['Backlog', 'Doing', 'Review', 'Done'];
  tasks: TaskItem[] = [
    {
      id: 301,
      title: 'Polish invoice table states',
      owner: 'Nora',
      status: 'Backlog',
      priority: 'High',
      type: 'UI',
      due: 'Today',
      estimate: '3 pts',
      comments: 6,
      blocked: true,
      summary: 'Invoice rows need failed, refunded, and pending states before billing can be reused.',
    },
    {
      id: 302,
      title: 'Add keyboard focus to command menu',
      owner: 'Minh',
      status: 'Doing',
      priority: 'Normal',
      type: 'QA',
      due: 'Jun 10',
      estimate: '2 pts',
      comments: 3,
      blocked: false,
      summary: 'Command search should keep visible focus, close stale menus, and support keyboard paths.',
    },
    {
      id: 303,
      title: 'Review asset empty folder copy',
      owner: 'Ari',
      status: 'Review',
      priority: 'Low',
      type: 'Docs',
      due: 'Jun 11',
      estimate: '1 pt',
      comments: 1,
      blocked: false,
      summary: 'File manager empty copy should explain next action without sounding like documentation.',
    },
    {
      id: 304,
      title: 'Publish setup checklist examples',
      owner: 'Linh',
      status: 'Done',
      priority: 'Normal',
      type: 'UI',
      due: 'Done',
      estimate: '2 pts',
      comments: 4,
      blocked: false,
      summary: 'Setup now has completion, restart, and next-step examples for clone users.',
    },
    {
      id: 305,
      title: 'Model analytics empty chart states',
      owner: 'Nora',
      status: 'Backlog',
      priority: 'High',
      type: 'Data',
      due: 'Tomorrow',
      estimate: '5 pts',
      comments: 8,
      blocked: false,
      summary: 'Charts need loading, no data, and error panels that still preserve layout height.',
    },
    {
      id: 306,
      title: 'Tighten mobile task filters',
      owner: 'Minh',
      status: 'Doing',
      priority: 'Normal',
      type: 'QA',
      due: 'Jun 12',
      estimate: '2 pts',
      comments: 2,
      blocked: false,
      summary: 'Filters should collapse without horizontal overflow and keep tap targets comfortable.',
    },
  ];

  get visibleTasks(): TaskItem[] {
    return this.priorityFilter === 'All' ? this.tasks : this.tasks.filter((task) => task.priority === this.priorityFilter);
  }

  get selectedTask(): TaskItem {
    return this.tasks.find((task) => task.id === this.selectedTaskId) ?? this.visibleTasks[0] ?? this.tasks[0];
  }

  get blockedTasks(): TaskItem[] {
    return this.tasks.filter((task) => task.blocked);
  }

  get completionRate(): number {
    return Math.round((this.tasks.filter((task) => task.status === 'Done').length / this.tasks.length) * 100);
  }

  tasksFor(status: TaskStatus): TaskItem[] {
    return this.visibleTasks.filter((task) => task.status === status);
  }

  moveTask(task: TaskItem, direction: 1 | -1): void {
    const index = this.columns.indexOf(task.status);
    const next = this.columns[index + direction];
    if (!next) return;
    this.tasks = this.tasks.map((item) => item.id === task.id ? { ...item, status: next } : item);
    this.selectedTaskId = task.id;
  }

  selectTask(task: TaskItem): void {
    this.selectedTaskId = task.id;
  }
}



