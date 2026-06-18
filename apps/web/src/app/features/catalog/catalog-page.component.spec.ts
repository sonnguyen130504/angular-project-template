import { TestBed } from '@angular/core/testing';
import { CatalogPageComponent } from './catalog-page.component';

import { getTranslocoModule } from '../../transloco-testing.module';

describe('CatalogPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPageComponent, getTranslocoModule()],
    }).compileComponents();
  });

  it('renders filterable catalog content', () => {
    const fixture = TestBed.createComponent(CatalogPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Shop listing');
    expect(fixture.nativeElement.textContent).toContain('Travel kit');
    expect(fixture.componentInstance.filteredProducts.length).toBe(12);
  });

  it('filters products by category', () => {
    const fixture = TestBed.createComponent(CatalogPageComponent);
    const component = fixture.componentInstance;

    component.selectedCategory = 'Accessories';
    component.minimumRating = 4;
    fixture.detectChanges();

    expect(component.filteredProducts.map((product) => product.name)).toEqual([
      'Travel kit',
      'Utility Cap',
      'Journal Cover',
      'Organizer Pouch',
    ]);
  });

  describe('Spatial Infinite Canvas', () => {
    it('calculates product coordinates correctly', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      const component = fixture.componentInstance;

      // X coordinate for price = 120 should be 0
      expect(component.getProductX(120)).toBe(0);
      // X coordinate for price = 128 should be (128 - 120) * 4.8 = 38.4
      expect(component.getProductX(128)).toBeCloseTo(38.4);

      // Y coordinate for rating = 4.5 should be 0
      expect(component.getProductY(4.5)).toBe(0);
      // Y coordinate for rating = 4.8 should be (4.8 - 4.5) * -500 = -150
      expect(component.getProductY(4.8)).toBeCloseTo(-150);
    });

    it('zooms in and out within constraints', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      const component = fixture.componentInstance;

      expect(component.zoom).toBe(1.0);

      component.zoomIn();
      expect(component.zoom).toBe(1.15);

      component.zoomOut();
      expect(component.zoom).toBe(1.0);

      // Zoom out multiple times to check min zoom limit (0.4)
      for (let i = 0; i < 10; i++) {
        component.zoomOut();
      }
      expect(component.zoom).toBe(0.4);

      // Zoom in multiple times to check max zoom limit (2.0)
      for (let i = 0; i < 15; i++) {
        component.zoomIn();
      }
      expect(component.zoom).toBe(2.0);
    });

    it('resets zoom and pan values', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      const component = fixture.componentInstance;

      component.zoom = 1.8;
      component.panX = 150;
      component.panY = -200;

      component.resetZoom();

      expect(component.zoom).toBe(1.0);
      expect(component.panX).toBe(0);
      expect(component.panY).toBe(0);
    });

    it('handles mouse wheel zoom events correctly', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      const component = fixture.componentInstance;

      const mockEventScrollUp = {
        preventDefault: jasmine.createSpy('preventDefault'),
        deltaY: -100,
      } as unknown as WheelEvent;

      component.onCanvasWheel(mockEventScrollUp);
      expect(mockEventScrollUp.preventDefault).toHaveBeenCalled();
      expect(component.zoom).toBe(1.08);

      const mockEventScrollDown = {
        preventDefault: jasmine.createSpy('preventDefault'),
        deltaY: 100,
      } as unknown as WheelEvent;

      component.onCanvasWheel(mockEventScrollDown);
      expect(mockEventScrollDown.preventDefault).toHaveBeenCalled();
      expect(component.zoom).toBe(1.0);
    });

    it('handles pan drag via mouse mouse down/move/up events', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      const component = fixture.componentInstance;

      const mockDownEvent = {
        button: 0,
        clientX: 100,
        clientY: 150,
        preventDefault: jasmine.createSpy('preventDefault'),
        target: document.createElement('div'),
      } as unknown as MouseEvent;

      component.onCanvasMouseDown(mockDownEvent);
      expect(mockDownEvent.preventDefault).toHaveBeenCalled();
      expect(component.isDragging).toBeTrue();

      const mockMoveEvent = {
        clientX: 120,
        clientY: 170,
      } as unknown as MouseEvent;

      component.onCanvasMouseMove(mockMoveEvent);
      // panX = clientX - (startX - currentPanX) => 120 - (100 - 0) = 20
      // panY = clientY - (startY - currentPanY) => 170 - (150 - 0) = 20
      expect(component.panX).toBe(20);
      expect(component.panY).toBe(20);

      component.onCanvasMouseUp();
      expect(component.isDragging).toBeFalse();

      // Mouse move when not dragging should not change pan coordinates
      const mockMoveEvent2 = {
        clientX: 200,
        clientY: 200,
      } as unknown as MouseEvent;
      component.onCanvasMouseMove(mockMoveEvent2);
      expect(component.panX).toBe(20);
      expect(component.panY).toBe(20);
    });

    it('ignores drag if initiated on interactive card elements or non-left buttons', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      const component = fixture.componentInstance;

      const button = document.createElement('button');
      const mockDownEvent = {
        button: 0,
        clientX: 100,
        clientY: 150,
        preventDefault: jasmine.createSpy('preventDefault'),
        target: button,
      } as unknown as MouseEvent;

      component.onCanvasMouseDown(mockDownEvent);
      expect(mockDownEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.isDragging).toBeFalse();

      // Right click drag should be ignored
      const container = document.createElement('div');
      const mockRightClickEvent = {
        button: 2,
        clientX: 100,
        clientY: 150,
        preventDefault: jasmine.createSpy('preventDefault'),
        target: container,
      } as unknown as MouseEvent;

      component.onCanvasMouseDown(mockRightClickEvent);
      expect(mockRightClickEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.isDragging).toBeFalse();
    });

    it('handles touch drag events for touchscreens', () => {
      const fixture = TestBed.createComponent(CatalogPageComponent);
      const component = fixture.componentInstance;

      const container = document.createElement('div');
      const mockTouchStart = {
        target: container,
        touches: [{ clientX: 100, clientY: 150 }],
      } as unknown as TouchEvent;

      component.onCanvasTouchStart(mockTouchStart);
      expect(component.isDragging).toBeTrue();

      const mockTouchMove = {
        touches: [{ clientX: 110, clientY: 130 }],
      } as unknown as TouchEvent;

      component.onCanvasTouchMove(mockTouchMove);
      expect(component.panX).toBe(10);
      expect(component.panY).toBe(-20);

      component.onCanvasTouchEnd();
      expect(component.isDragging).toBeFalse();
    });
  });
});
