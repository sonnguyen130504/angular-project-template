import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScrollStaggerPanelComponent } from './scroll-stagger-panel.component';

describe('ScrollStaggerPanelComponent', () => {
  let component: ScrollStaggerPanelComponent;
  let fixture: ComponentFixture<ScrollStaggerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollStaggerPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollStaggerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replay stagger', fakeAsync(() => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    
    component.replayStagger();
    expect(component.staggerVisible).toBeFalse();
    
    tick(50);
    
    expect(component.staggerVisible).toBeTrue();
  }));

  it('should skip DOM manipulation if reduced motion is true on scroll', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    
    // This will return early without error
    component.onScrollFeed();
    expect(component).toBeTruthy();
  });

  it('should handle onScrollFeed when container exists', () => {
    fixture.componentRef.setInput('simulateReducedMotion', false);
    
    // Mock the DOM elements
    const mockCard = document.createElement('div');
    mockCard.classList.add('scroll-stack-card');
    
    // We override offsetTop using defineProperty since it's read-only
    Object.defineProperty(mockCard, 'offsetTop', { value: 10 });
    
    const mockContainer = document.createElement('div');
    mockContainer.appendChild(mockCard);
    
    // Set scrollTop
    Object.defineProperty(mockContainer, 'scrollTop', { value: 50, writable: true });
    
    spyOn(component, 'scrollFeed').and.returnValue({ nativeElement: mockContainer } as any);
    
    component.onScrollFeed();
    
    // Validate that styles were applied since relativeTop (10 - 50 = -40) < 24
    expect(mockCard.style.transform).toContain('scale');
  });

  it('should reset styles when relativeTop >= 24', () => {
    fixture.componentRef.setInput('simulateReducedMotion', false);
    
    const mockCard = document.createElement('div');
    mockCard.classList.add('scroll-stack-card');
    mockCard.style.transform = 'scale(0.5)';
    
    Object.defineProperty(mockCard, 'offsetTop', { value: 100 });
    
    const mockContainer = document.createElement('div');
    mockContainer.appendChild(mockCard);
    
    Object.defineProperty(mockContainer, 'scrollTop', { value: 50, writable: true });
    
    spyOn(component, 'scrollFeed').and.returnValue({ nativeElement: mockContainer } as any);
    
    component.onScrollFeed();
    
    // Validate that styles were reset since relativeTop (100 - 50 = 50) >= 24
    expect(mockCard.style.transform).toBe('');
  });
});
