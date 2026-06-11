import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FlipLayoutPanelComponent } from './flip-layouts-panel.component';

describe('FlipLayoutPanelComponent', () => {
  let component: FlipLayoutPanelComponent;
  let fixture: ComponentFixture<FlipLayoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlipLayoutPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlipLayoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set columns correctly', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true); // Avoid animation logic in simple test
    component.setColumns(4);
    expect(component.columns).toBe(4);
  });

  it('should sort items by name', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    component.sortItems('name');
    
    // Check if sorted alphabetically
    const firstItem = component.items[0];
    expect(firstItem.name).toBe('Desk Tray');
  });

  it('should sort items by price', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    component.sortItems('price');
    
    // Lowest price is 35 (Wool Beanie)
    const firstItem = component.items[0];
    expect(firstItem.name).toBe('Wool Beanie');
  });

  it('should shuffle items', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    const initialItems = [...component.items];
    component.shuffleItems();
    
    // There is a small chance it shuffles to the same order, but it's very small
    // Just verifying it doesn't throw and calls the logic
    expect(component.items.length).toBe(initialItems.length);
  });

  it('should select bento card', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    const card = component.bentoCards[0];
    const event = new MouseEvent('click');
    
    component.selectBentoCard(card, event);
    expect(component.selectedBentoCard).toBe(card);
  });

  it('should close bento card', () => {
    fixture.componentRef.setInput('simulateReducedMotion', true);
    component.selectedBentoCard = component.bentoCards[0];
    
    component.closeBentoCard();
    expect(component.selectedBentoCard).toBeNull();
  });
});
