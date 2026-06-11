import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiBadgeComponent } from './ui-badge.component';

@Component({
  standalone: true,
  imports: [UiBadgeComponent],
  template: '<app-ui-badge>In stock</app-ui-badge>',
})
class HostComponent {}

describe('UiBadgeComponent', () => {
  it('projects badge text', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('In stock');
  });
});
