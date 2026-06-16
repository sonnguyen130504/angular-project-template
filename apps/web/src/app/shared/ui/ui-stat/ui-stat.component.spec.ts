import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiStatComponent } from './ui-stat.component';

@Component({
  standalone: true,
  imports: [UiStatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-ui-stat label="Plan">Starter</app-ui-stat>',
})
class HostComponent {}

describe('UiStatComponent', () => {
  it('renders the label and projected value', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Plan');
    expect(fixture.nativeElement.textContent).toContain('Starter');
  });
});
