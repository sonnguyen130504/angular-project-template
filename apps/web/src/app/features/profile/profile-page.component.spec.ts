import { TestBed } from '@angular/core/testing';
import { ProfilePageComponent } from './profile-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('ProfilePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent, getTranslocoModule()],
    }).compileComponents();
  });

  it('renders profile content', () => {
    const fixture = TestBed.createComponent(ProfilePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Profile');
    expect(fixture.nativeElement.textContent).toContain('Editable details');
    expect(fixture.nativeElement.textContent).toContain('#1048');
    expect(fixture.nativeElement.textContent).toContain('Wishlist');
  });
});
