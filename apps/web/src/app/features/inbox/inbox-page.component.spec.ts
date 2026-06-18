import { TestBed } from '@angular/core/testing';
import { InboxPageComponent } from './inbox-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('InboxPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InboxPageComponent, getTranslocoModule()] }).compileComponents();
  });

  it('renders inbox triage content and filters unread threads', () => {
    const fixture = TestBed.createComponent(InboxPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.setFilter('Unread');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Inbox');
    expect(component.filteredThreads.every((thread) => thread.status === 'Unread')).toBeTrue();
  });
});
