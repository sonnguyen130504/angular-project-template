import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

type CalendarEvent = {
  id: number;
  title: string;
  owner: string;
  date: string;
  time: string;
  room: string;
  conflict: boolean;
  type: 'Meeting' | 'Review' | 'Hold';
  duration: string;
  attendees: number;
};

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [DatePipe, FormsModule, PageSectionComponent, UiBadgeComponent, UiButtonComponent],
  templateUrl: './calendar-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './calendar-page.component.scss',
})
export class CalendarPageComponent {
  selectedDate = '2026-06-09';
  selectedEventId = 201;

  readonly days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  readonly slots = ['09:00', '10:30', '13:00', '15:30'];
  readonly events: CalendarEvent[] = [
    { id: 201, title: 'Launch readiness', owner: 'Operations', date: '2026-06-09', time: '09:00', room: 'Studio A', conflict: false, type: 'Meeting', duration: '45m', attendees: 6 },
    { id: 202, title: 'Inventory review', owner: 'Warehouse', date: '2026-06-09', time: '10:30', room: 'Ops room', conflict: true, type: 'Review', duration: '30m', attendees: 4 },
    { id: 203, title: 'Design QA', owner: 'Product', date: '2026-06-10', time: '13:00', room: 'Remote', conflict: false, type: 'Review', duration: '60m', attendees: 5 },
    { id: 204, title: 'Support retro', owner: 'Support', date: '2026-06-11', time: '15:30', room: 'Studio B', conflict: false, type: 'Meeting', duration: '45m', attendees: 7 },
    { id: 205, title: 'Quiet focus block', owner: 'Design', date: '2026-06-12', time: '13:00', room: 'Focus', conflict: false, type: 'Hold', duration: '120m', attendees: 1 },
  ];

  readonly rooms = [
    { name: 'Studio A', load: 72 },
    { name: 'Ops room', load: 88 },
    { name: 'Remote', load: 42 },
  ];

  get visibleEvents(): CalendarEvent[] {
    return this.events.filter((event) => event.date === this.selectedDate);
  }

  get selectedEvent(): CalendarEvent | undefined {
    return this.events.find((event) => event.id === this.selectedEventId) ?? this.visibleEvents[0];
  }

  eventFor(day: string, slot: string): CalendarEvent | undefined {
    const dateByDay: Record<string, string> = {
      Mon: '2026-06-08',
      Tue: '2026-06-09',
      Wed: '2026-06-10',
      Thu: '2026-06-11',
      Fri: '2026-06-12',
    };
    return this.events.find((event) => event.date === dateByDay[day] && event.time === slot);
  }

  selectEvent(event: CalendarEvent): void {
    this.selectedEventId = event.id;
  }

  shiftSelected(): void {
    const selected = this.selectedEvent;
    if (!selected) return;
    selected.time = selected.time === '10:30' ? '13:00' : '10:30';
    selected.conflict = false;
  }
}



