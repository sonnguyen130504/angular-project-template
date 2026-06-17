import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('exposes the expected number of routes', () => {
    expect(appRoutes.length).toBe(27);
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
