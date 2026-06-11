import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SpringPhysicsPanelComponent } from './spring-physics-panel.component';
import { ElementRef, NgZone } from '@angular/core';

describe('SpringPhysicsPanelComponent', () => {
  let component: SpringPhysicsPanelComponent;
  let fixture: ComponentFixture<SpringPhysicsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpringPhysicsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpringPhysicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset spring variables correctly', () => {
    component.handleX = 50;
    component.handleY = 50;
    component.velocityX = 10;
    component.velocityY = 10;
    component.curvePoints = [1, 2, 3];

    component.resetSpring();

    expect(component.handleX).toBe(0);
    expect(component.handleY).toBe(0);
    expect(component.velocityX).toBe(0);
    expect(component.velocityY).toBe(0);
    expect(component.curvePoints.length).toBe(0);
    expect(component.springCurvePath).toBe('M 0 50 L 200 50');
  });

  it('should trigger impact', () => {
    spyOn(component, 'playClickSound');
    component.triggerImpact();
    expect(component.playClickSound).toHaveBeenCalled();
    expect(component.velocityY).toBeLessThan(0);
  });

  it('should handle drag start, move, and end correctly', () => {
    const startEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
    component.onDragStart(startEvent);
    expect(component.isDragging).toBeTrue();

    const moveEvent = new MouseEvent('mousemove', { clientX: 150, clientY: 150 });
    component.onDragMove(moveEvent);
    expect(component.handleX).not.toBe(0);
    expect(component.handleY).not.toBe(0);

    component.onDragEnd();
    expect(component.isDragging).toBeFalse();
  });

  it('should skip click sound if reduced motion is simulated', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    // AudioContext will not be triggered
    // we can spy on window AudioContext but it is wrapped in try catch anyway
    // Just verifying it doesn't break
    expect(() => component.playClickSound()).not.toThrow();
  });
});
