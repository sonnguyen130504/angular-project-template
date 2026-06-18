import { TestBed } from '@angular/core/testing';
import { TasksPageComponent } from './tasks-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('TasksPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TasksPageComponent, getTranslocoModule()] }).compileComponents();
  });

  it('renders task board and moves a task forward', () => {
    const fixture = TestBed.createComponent(TasksPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.moveTask(component.tasks[0], 1);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tasks');
    expect(component.tasks[0].status).toBe('Doing');
  });
});
