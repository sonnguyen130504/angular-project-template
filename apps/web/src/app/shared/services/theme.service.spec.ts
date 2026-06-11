import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme from light to dark', () => {
    service.theme.set('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    service.theme.set('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should set data-theme attribute on documentElement when theme changes', () => {
    service.theme.set('dark');
    // Allow effect to run
    TestBed.flushEffects();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    service.theme.set('light');
    TestBed.flushEffects();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should check that theme variables are defined in the document styles', () => {
    const computed = getComputedStyle(document.documentElement);
    // Check that our soft theme-aware variables are accessible
    expect(computed.getPropertyValue('--bg')).toBeTruthy();
    expect(computed.getPropertyValue('--surface')).toBeTruthy();
    expect(computed.getPropertyValue('--ink')).toBeTruthy();
  });
});
