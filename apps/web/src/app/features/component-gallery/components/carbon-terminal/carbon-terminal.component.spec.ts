import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CarbonTerminalComponent } from './carbon-terminal.component';

describe('CarbonTerminalComponent', () => {
  let component: CarbonTerminalComponent;
  let fixture: ComponentFixture<CarbonTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonTerminalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy snippet and show toast', fakeAsync(() => {
    const mockClipboard = {
      writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve())
    };
    spyOnProperty(navigator, 'clipboard', 'get').and.returnValue(mockClipboard as any);

    const code = 'const a = 1;';
    component.copySnippet(code);

    // wait for promise to resolve
    tick();

    expect(mockClipboard.writeText).toHaveBeenCalledWith(code);
    expect(component.copiedText).toBe(code);
    expect(component.showCopyToast).toBeTrue();

    // wait for timeout
    tick(2000);

    expect(component.showCopyToast).toBeFalse();
  }));
});
