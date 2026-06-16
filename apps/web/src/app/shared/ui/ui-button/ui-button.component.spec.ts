import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './ui-button.component';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<app-ui-button>Save changes</app-ui-button>',
})
class HostComponent {}

describe('UiButtonComponent', () => {
  it('renders projected content', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Save changes');
  });
});
