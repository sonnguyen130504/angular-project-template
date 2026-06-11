import { TestBed } from '@angular/core/testing';
import { ActivityLogPageComponent } from './activity-log-page.component';

describe('ActivityLogPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ActivityLogPageComponent] }).compileComponents();
  });

  it('renders audit log and exports filtered events', () => {
    const fixture = TestBed.createComponent(ActivityLogPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.actorFilter = 'System';
    component.exportLog();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Activity log');
    expect(component.exportState).toContain('2 events');
  });
});
