import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CanvasSvgPhysicsPanelComponent } from './canvas-svg-physics-panel.component';

describe('CanvasSvgPhysicsPanelComponent', () => {
  let component: CanvasSvgPhysicsPanelComponent;
  let fixture: ComponentFixture<CanvasSvgPhysicsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasSvgPhysicsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasSvgPhysicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize canvas physics and spawn 8 particles', fakeAsync(() => {
    const mockCanvas = document.createElement('canvas');
    spyOn(component, 'physicsCanvasEl').and.returnValue({ nativeElement: mockCanvas } as any);
    
    // Reset particles just to be sure
    component.particles = [];
    
    component.initCanvasPhysics();
    expect(component.particles.length).toBe(8);
  }));

  it('should add a particle on click', () => {
    const mockCanvas = document.createElement('canvas');
    Object.defineProperty(mockCanvas, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0 })
    });
    spyOn(component, 'physicsCanvasEl').and.returnValue({ nativeElement: mockCanvas } as any);
    
    component.particles = [];
    const event = new MouseEvent('click', { clientX: 100, clientY: 100 });
    
    spyOn(component, 'playClickSound');
    component.addParticle(event);
    
    expect(component.playClickSound).toHaveBeenCalled();
    expect(component.particles.length).toBe(1);
    expect(component.particles[0].x).toBe(100);
    expect(component.particles[0].y).toBe(100);
  });

  it('should limit particles to 25', () => {
    const mockCanvas = document.createElement('canvas');
    Object.defineProperty(mockCanvas, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0 })
    });
    spyOn(component, 'physicsCanvasEl').and.returnValue({ nativeElement: mockCanvas } as any);
    
    component.particles = new Array(25).fill({ x: 0, y: 0, vx: 0, vy: 0, radius: 10, color: 'red' });
    
    const event = new MouseEvent('click');
    component.addParticle(event);
    
    expect(component.particles.length).toBe(25);
  });

  it('should clear canvas physics', () => {
    component.particles = [{ x: 10, y: 10, vx: 0, vy: 0, radius: 10, color: 'red' }];
    spyOn(component, 'playClickSound');
    
    component.clearCanvasPhysics();
    
    expect(component.playClickSound).toHaveBeenCalled();
    expect(component.particles.length).toBe(0);
  });

  it('should toggle play state', () => {
    component.playState = 'play';
    spyOn(component, 'playClickSound');
    
    component.togglePlayState();
    
    expect(component.playClickSound).toHaveBeenCalled();
    expect(component.playState).toBe('pause');
    
    component.togglePlayState();
    expect(component.playState).toBe('play');
  });
});
