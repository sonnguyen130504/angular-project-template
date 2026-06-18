import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { TranslocoDirective } from '@jsverse/transloco';

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
  imports: [FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent, TranslocoDirective],
  templateUrl: './tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      title: 'task1.title',
      owner: 'Nora',
      status: 'Backlog',
      priority: 'High',
      type: 'UI',
      due: 'due.today',
      estimate: '3 pts',
      comments: 6,
      blocked: true,
      summary: 'task1.summary',
    },
    {
      id: 302,
      title: 'task2.title',
      owner: 'Minh',
      status: 'Doing',
      priority: 'Normal',
      type: 'QA',
      due: 'Jun 10',
      estimate: '2 pts',
      comments: 3,
      blocked: false,
      summary: 'task2.summary',
    },
    {
      id: 303,
      title: 'task3.title',
      owner: 'Ari',
      status: 'Review',
      priority: 'Low',
      type: 'Docs',
      due: 'Jun 11',
      estimate: '1 pt',
      comments: 1,
      blocked: false,
      summary: 'task3.summary',
    },
    {
      id: 304,
      title: 'task4.title',
      owner: 'Linh',
      status: 'Done',
      priority: 'Normal',
      type: 'UI',
      due: 'due.done',
      estimate: '2 pts',
      comments: 4,
      blocked: false,
      summary: 'task4.summary',
    },
    {
      id: 305,
      title: 'task5.title',
      owner: 'Nora',
      status: 'Backlog',
      priority: 'High',
      type: 'Data',
      due: 'due.tomorrow',
      estimate: '5 pts',
      comments: 8,
      blocked: false,
      summary: 'task5.summary',
    },
    {
      id: 306,
      title: 'task6.title',
      owner: 'Minh',
      status: 'Doing',
      priority: 'Normal',
      type: 'QA',
      due: 'Jun 12',
      estimate: '2 pts',
      comments: 2,
      blocked: false,
      summary: 'task6.summary',
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
