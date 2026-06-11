import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({
  template: `
    <div class="test-viewport" style="width: 414px; height: 896px; overflow: auto; border: 1px solid black; position: relative;">
      <!-- This represents the app shell bounding box -->
      <div id="app-root-mock" style="width: 100%; min-height: 100%; display: grid; grid-template-columns: 1fr;">
        <!-- Test elements go here -->
      </div>
    </div>
  `
})
class MockAppShellComponent {}

describe('Responsive Layout & Horizontal Overflow', () => {
  let fixture: ComponentFixture<MockAppShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockAppShellComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockAppShellComponent);
    fixture.detectChanges();
  });

  /**
   * Helper to recursively find any elements that are wider than their parent
   * or the viewport, effectively pinpointing the exact component causing grid blowout.
   */
  function findOverflowingElements(root: HTMLElement, viewportWidth: number): HTMLElement[] {
    const overflowing: HTMLElement[] = [];
    const elements = root.querySelectorAll('*');
    
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      // An element causes blowout if its right bound exceeds the viewport's right bound
      // or if its own scrollWidth is vastly greater than clientWidth (when not explicitly intended to scroll).
      // Here we check if its bounding box extends past the 414px mobile viewport.
      const rect = htmlEl.getBoundingClientRect();
      // We allow a tiny sub-pixel tolerance
      if (rect.right > viewportWidth + 1) {
        // Exclude elements that are intentionally horizontally scrollable
        const style = window.getComputedStyle(htmlEl);
        if (style.overflowX !== 'auto' && style.overflowX !== 'scroll') {
          overflowing.push(htmlEl);
        }
      }
    });
    return overflowing;
  }

  it('should not allow grid blowout to cause horizontal scrolling on mobile viewports (414px)', () => {
    const viewport = fixture.nativeElement.querySelector('.test-viewport');
    const appRoot = fixture.nativeElement.querySelector('#app-root-mock');
    
    // Simulate a component that tries to force a wide layout (e.g., a Kanban board or a long log line)
    // Intentionally omit min-width: 0 on task-main to simulate the failure
    appRoot.innerHTML = `
      <div class="task-workspace" style="display: grid; grid-template-columns: 1fr; min-width: 0;">
        <div class="task-main-mock-failure" style="display: grid;">
          <div class="board" style="display: flex; flex-wrap: nowrap; overflow-x: auto;">
            <div style="min-width: 280px; height: 100px; background: red; flex-shrink: 0;">Col 1</div>
            <div style="min-width: 280px; height: 100px; background: blue; flex-shrink: 0;">Col 2</div>
            <div style="min-width: 280px; height: 100px; background: green; flex-shrink: 0;">Col 3</div>
            <div style="min-width: 280px; height: 100px; background: yellow; flex-shrink: 0;">Col 4</div>
          </div>
        </div>
      </div>
    `;
    
    // Check if the overall viewport is scrolling horizontally
    const isOverflowing = viewport.scrollWidth > viewport.clientWidth;
    
    if (isOverflowing) {
      const culprits = findOverflowingElements(appRoot, 414);
      const culpritDetails = culprits.map(el => \`\${el.tagName.toLowerCase()}.\${el.className}\`).join(', ');
      fail(\`Viewport is overflowing horizontally! Culprit elements pushing the boundary: \${culpritDetails}. Check for missing min-width: 0 on these elements or their parents.\`);
    } else {
      expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
    }
  });

  it('should wrap long text strings instead of blowing out containers', () => {
    const viewport = fixture.nativeElement.querySelector('.test-viewport');
    const appRoot = fixture.nativeElement.querySelector('#app-root-mock');
    
    // Simulating failure by not applying white-space: pre-wrap
    appRoot.innerHTML = `
      <div class="console-box" style="width: 100%; max-width: 100%; background: #000;">
        <pre class="log-line" style="margin: 0;"><code style="color: white;">[ERROR] 2026-06-11T08:00:00Z System fault: Database queries took longer than standard limits to complete and timed out before returning.</code></pre>
      </div>
    `;
    
    if (viewport.scrollWidth > viewport.clientWidth) {
      const culprits = findOverflowingElements(appRoot, 414);
      const culpritDetails = culprits.map(el => \`\${el.tagName.toLowerCase()}.\${el.className}\`).join(', ');
      fail(\`Long text is causing blowout! Culprit elements: \${culpritDetails}. Apply word-break: break-all and white-space: pre-wrap.\`);
    } else {
      expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);
    }
  });
});
