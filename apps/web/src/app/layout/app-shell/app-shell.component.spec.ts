import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows the brand and primary navigation', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.componentInstance.openGroup = 'Commerce';
    fixture.detectChanges();

    const navLinks = fixture.nativeElement.querySelectorAll('nav a');

    expect(fixture.nativeElement.textContent).toContain('Sion Studio');
    expect(navLinks.length).toBe(5);
    expect(fixture.nativeElement.textContent).toContain('Catalog');
  });

  it('shows the workspace navigation group', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    fixture.componentInstance.openGroup = 'Workspace';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Inbox');
    expect(fixture.nativeElement.textContent).toContain('Tasks');
    expect(fixture.nativeElement.textContent).toContain('Assets');
  });

  it('keeps only one nav group open at a time', () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const component = fixture.componentInstance;

    component.toggleGroup('Commerce');
    expect(component.openGroup).toBe('Commerce');

    component.toggleGroup('Operations');
    expect(component.openGroup).toBe('Operations');

    component.closeMenus();
    expect(component.openGroup).toBe('');
  });
});
