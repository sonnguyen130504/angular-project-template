import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiCardComponent } from './ui-card.component';

@Component({
  standalone: true,
  imports: [UiCardComponent],
  template: '<app-ui-card><span>Card body</span></app-ui-card>',
})
class HostComponent {}

describe('UiCardComponent', () => {
  it('projects content into the card host', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Card body');
  });
});
