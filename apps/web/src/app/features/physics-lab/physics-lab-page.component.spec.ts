import { TestBed } from '@angular/core/testing';
import { PhysicsLabPageComponent } from './physics-lab-page.component';

describe('PhysicsLabPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicsLabPageComponent],
    }).compileComponents();
  });

  it('renders simulation parameters', () => {
    const fixture = TestBed.createComponent(PhysicsLabPageComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Physics-based Data Playground');
    expect(text).toContain('Simulation Configurations');
    expect(text).toContain('Speed Factor');
    expect(fixture.componentInstance.particles().length).toBe(6);
  });

  it('adds a new particle node correctly', () => {
    const fixture = TestBed.createComponent(PhysicsLabPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.particles().length).toBe(6);

    component.addNewNode();
    fixture.detectChanges();
    expect(component.particles().length).toBe(7);
  });

  it('updates parameters correctly when slider inputs emit changes', () => {
    const fixture = TestBed.createComponent(PhysicsLabPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const mockSpeedEvent = {
      target: { value: '2.0' }
    } as unknown as Event;

    component.updateSpeedFactor(mockSpeedEvent);
    expect(component.speedFactor()).toBe(2.0);

    const mockFrictionEvent = {
      target: { value: '0.985' }
    } as unknown as Event;

    component.updateFriction(mockFrictionEvent);
    expect(component.friction()).toBe(0.985);

    const mockGravityEvent = {
      target: { value: '80' }
    } as unknown as Event;

    component.updateGravity(mockGravityEvent);
    expect(component.gravity()).toBe(80);
  });
});
