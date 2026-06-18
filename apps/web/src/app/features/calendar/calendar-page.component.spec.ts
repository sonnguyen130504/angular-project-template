import { TestBed } from '@angular/core/testing';
import { CalendarPageComponent } from './calendar-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('CalendarPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CalendarPageComponent, getTranslocoModule()] }).compileComponents();
  });

  it('renders schedule content and resolves a conflict', () => {
    const fixture = TestBed.createComponent(CalendarPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.selectEvent(component.events[1]);
    component.shiftSelected();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Calendar');
    expect(component.selectedEvent?.conflict).toBeFalse();
  });
});
