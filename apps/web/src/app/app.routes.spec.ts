import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { appRoutes } from './app.routes';
import { getTranslocoModule } from './transloco-testing.module';

describe('App Routing', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [
        provideRouter(appRoutes),
        provideLocationMocks()
      ]
    }).compileComponents();
  });

  it('keeps the fallback route last', () => {
    expect(appRoutes.at(-1)?.path).toBe('**');
  });

  it('exposes the product app reference routes', () => {
    const paths = appRoutes.map((route) => route.path);

    expect(paths).toContain('inbox');
    expect(paths).toContain('calendar');
    expect(paths).toContain('tasks');
    expect(paths).toContain('team');
    expect(paths).toContain('billing');
    expect(paths).toContain('assets');
    expect(paths).toContain('activity-log');
    expect(paths).toContain('setup');
  });
});
