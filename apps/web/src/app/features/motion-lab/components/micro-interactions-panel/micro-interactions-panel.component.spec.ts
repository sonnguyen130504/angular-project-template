import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MicroInteractionsPanelComponent } from './micro-interactions-panel.component';

describe('MicroInteractionsPanelComponent', () => {
  let component: MicroInteractionsPanelComponent;
  let fixture: ComponentFixture<MicroInteractionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroInteractionsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MicroInteractionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset request state', () => {
    component.requestState = 'success';
    component.requestErrorMsg = 'Error';
    component.requestItems = [{ name: 'Test', category: 'Cat', price: '$10' }];

    component.resetRequest();

    expect(component.requestState).toBe('idle');
    expect(component.requestErrorMsg).toBe('');
    expect(component.requestItems.length).toBe(0);
  });

  it('should trigger request and handle success or error', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.5); // Force success condition (> 0.2)
    
    component.triggerRequest();
    expect(component.requestState).toBe('loading');

    tick(1800);

    expect(component.requestState).toBe('success');
    expect(component.requestItems.length).toBe(3);
  }));

  it('should trigger request and handle error', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.1); // Force error condition (<= 0.2)
    
    component.triggerRequest();
    expect(component.requestState).toBe('loading');

    tick(1800);

    expect(component.requestState).toBe('error');
    expect(component.requestErrorMsg).toContain('Server connection timeout');
  }));

  it('should not trigger request if already loading', () => {
    component.requestState = 'loading';
    spyOn(component, 'playClickSound');
    
    component.triggerRequest();
    
    expect(component.playClickSound).not.toHaveBeenCalled();
  });
});
