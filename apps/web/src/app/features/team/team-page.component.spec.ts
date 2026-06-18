import { TestBed } from '@angular/core/testing';
import { TeamPageComponent } from './team-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('TeamPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TeamPageComponent, getTranslocoModule()] }).compileComponents();
  });

  it('renders team members and sends an invite', () => {
    const fixture = TestBed.createComponent(TeamPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.inviteEmail = 'new@example.com';
    component.sendInvite();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Team');
    expect(component.members.length).toBe(5);
  });
});
