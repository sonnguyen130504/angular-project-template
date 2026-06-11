# Angular Project Template - Global Rules for AI Agents

Welcome! As an AI agent working on this Angular project, you are required to strictly adhere to the following architectural rules and standards. Deviation from these rules is **UNACCEPTABLE**.

---

## 1. File Organization & Modularity (Strict)
Every component MUST have its own dedicated folder and its files MUST be strictly separated.
- **Never use inline templates or styles.**
  - `templateUrl: './component-name.component.html'`
  - `styleUrl: './component-name.component.scss'`
- A standard component directory MUST contain:
  - `component-name.component.ts` (Component Logic only)
  - `component-name.component.html` (Markup only)
  - `component-name.component.scss` (Styling only)
  - `component-name.component.spec.ts` (Unit Tests)
- Use descriptive folders under `apps/web/src/app/features/` or `apps/web/src/app/shared/ui/` depending on the scope.

---

## 2. Preventing "God Pages"
Do not build massive, monolithic pages.
- If a page has complex logic, multiple distinct functional areas, or heavily nested states, break it down into smaller, granular standalone components.
- The parent page should only coordinate data flow and high-level layouts.

---

## 3. Component Styling & Encapsulation
Do not use `ViewEncapsulation.None` to share styles down to children. This causes global CSS leaks that break other components in the application.
- Use `ViewEncapsulation.Emulated` (the Angular default).
- If you must style child components or projected content from a parent, use the `:host ::ng-deep { ... }` wrapping strategy in the parent's SCSS file.
  ```scss
  :host {
    display: block; // Keep host-level styles here
  }

  :host ::ng-deep {
    // Child overrides go here, safely sandboxed to this component tree
    .child-class { ... }
  }
  ```

---

## 4. Unit Testing
Every component MUST have an accompanying `.spec.ts` file.
- Write tests to verify the component rendering, Inputs/Outputs, and core DOM interactions.
- When executing `npm run test`, ensure you monitor the test duration (e.g., using a timer task) and fix any performance bottlenecks or broken tests.

---

## 5. Design Taste
The UI must feel highly premium. Avoid default/basic browser looks.
- Follow `/design-taste-frontend` and `/impeccable` guidelines.
- Build rich, interactive, and beautifully spaced interfaces using modern CSS features.

### 5.1 Required Design Context Before UI Changes
When modifying a page's layout, empty states, workspace shells, or interactive showroom routes, agents MUST read the core project documents first:
- `PRODUCT.md` for product intent, user expectations, and anti-references.
- `DESIGN.md` for the current visual system, spacing logic, and named rules.
- `AGENT_INSTRUCTIONS.md` for architectural and Angular implementation constraints.

### 5.2 Skill Usage Expectations
For substantial UI/UX refinement work, agents should explicitly use the local design skills before making visual changes:
- `impeccable`: primary skill for critique, layout, polish, adapt, onboard, and overall product-UI refinement.
- `design-taste-frontend`: secondary skill for maintaining a strong visual point of view and avoiding generic output.

### 5.3 Workspace Showcase Rules
For interactive showcase pages such as simulators, labs, and template preview routes:
- Keep the main example visible within a typical desktop viewport whenever practical.
- Preserve proportional consistency between the outer workspace canvas and the inner demo shell.
- Treat offline, error, onboarding, and recovery states as full workspace scenarios, not as tiny floating cards inside oversized canvases.
- If an inner area must scroll, restyle the scrollbar so it matches the design system and does not look like raw browser chrome.
- Do not switch to internal scroll mode for minor overflow. First try tightening spacing, shell size, or non-critical vertical padding when the overflow is only slight.

### 5.4 Global Surface Rules
Apply the same logic to all pages, panels, lists, menus, and stateful components, not just showcase routes:
- **The Strict-Footprint Rule:** When designing a gallery of interchangeable system states (e.g., empty states, error states), force a strictly identical container `width` and `height` across all variants. The UI should feel like a rock-solid canvas where only the internal content swaps. Do not let containers jitter or adapt height dynamically.
- **The Smart-Swapping Rule:** To avoid triggering scrollbars when dynamic content appears (like a success message after an action), intelligently swap out or hide existing non-critical elements (like a console error log or a giant decorative icon) rather than lazily stacking new elements and forcing the container to grow/scroll.
- **The Absolute-Alignment Rule:** Ensure universal alignment for key interactive elements across different states. Instead of relying on container-level centering (which shifts buttons vertically depending on content), use `margin-top: auto` or similar techniques to push action buttons to an absolute bottom baseline.
- Prefer reducing non-critical spacing, helper-text gaps, and secondary padding before introducing nested scroll containers.
- If a list or stacked surface only overflows slightly, tighten row density first instead of enabling scroll immediately.
- Preserve proportional balance between parent containers and child panels so inner content never feels visually stranded.
- Keep scrollbars styled and quiet across all premium product surfaces, including sidebars, result lists, tables, logs, and stacked menus.
- In compound surfaces, model persistent controls and changing content as separate stable sections. A search section should remain fixed while the result section swaps between populated, empty, loading, or filtered states.
- When stabilizing layouts, prefer elastic constraints like `clamp()`, `%`, `min()` and `max()` over hard fixed widths or heights unless a truly fixed control size is necessary (e.g. for the Strict-Footprint rule).
- **Grid Blowout Prevention:** Always apply `min-width: 0` to direct children of a CSS Grid layout (e.g., `grid-template-columns: 1fr`). This prevents the implicit `min-content` sizing from forcing the grid to overflow the mobile viewport when rendering wide elements like code blocks, tables, or kanban boards.
- **Bulletproof Horizontal Scrolling:** For scrollable regions like Kanban boards or tabs on mobile, DO NOT use CSS Grid. Instead, use Flexbox (`display: flex; flex-wrap: nowrap; overflow-x: auto;`) with `flex-shrink: 0` on the child elements. This guarantees reliable touch-scrolling behavior.
- **Long String Wrapping:** In narrow viewports, explicitly tame long, unbroken strings (like server error logs, raw hashes, or URLs) by applying `word-break: break-all` and `white-space: pre-wrap`. Never let a string push the app shell beyond `100vw`.

### 5.5 Dark Theme Handling (REQUIRED)
- **Styling:** When creating or modifying a UI component, you MUST always implement styles for both Light and Dark themes simultaneously. Do not leave the dark theme implementation for later. Use the `.dark-theme` wrapper (or CSS custom properties mapped to theme tokens) to ensure the component looks impeccable in dark mode.
- **Testing:** Unit tests (`.spec.ts` files) MUST include test cases to verify that dark theme behaviors (like class bindings, component inputs, or background tokens) apply correctly.

---

## 6. Angular Modern Syntax (Angular 17+/20) — MANDATORY

This project targets **Angular 20** and must use only the latest recommended APIs. The following rules are strictly enforced.

### 6.1 Signal-based Inputs & Outputs (REQUIRED)
**FORBIDDEN — Never use decorator-based inputs/outputs:**
```typescript
// ❌ BANNED — old decorator API
@Input() title = '';
@Input() disabled = false;
@Output() clicked = new EventEmitter<void>();
```
**REQUIRED — Always use signal-based APIs:**
```typescript
// ✅ CORRECT — signal-based
import { input, output } from '@angular/core';
title = input('');
disabled = input(false);
clicked = output<void>();
```
- Use `input.required<T>()` for required inputs: `name = input.required<string>()`
- Use `output()` instead of `EventEmitter` + `@Output`
- In templates, always call signal inputs as functions: `{{ title() }}`, `[prop]="value()"`

### 6.2 Signal-based Queries (REQUIRED)
**FORBIDDEN:**
```typescript
// ❌ BANNED
@ViewChild('myEl') myEl?: ElementRef;
@ContentChild(MyComponent) child?: MyComponent;
@ViewChildren(MyDir) items!: QueryList<MyDir>;
```
**REQUIRED:**
```typescript
// ✅ CORRECT
import { viewChild, contentChild, viewChildren } from '@angular/core';
myEl = viewChild<ElementRef>('myEl');
child = contentChild(MyComponent);
items = viewChildren(MyDir);
// Usage: this.myEl()?.nativeElement
```

### 6.3 No CommonModule (REQUIRED)
**FORBIDDEN:**
```typescript
// ❌ BANNED — CommonModule is a legacy barrel module
import { CommonModule } from '@angular/common';
imports: [CommonModule]
```
**REQUIRED — import only what you use:**
```typescript
// ✅ CORRECT — standalone pipes only, directives are built-in
import { CurrencyPipe, DatePipe, AsyncPipe, DecimalPipe } from '@angular/common';
```
> `ngClass`, `ngStyle`, and built-in control flow (`@if`, `@for`, `@switch`, `@defer`) work without any import in standalone Angular 17+ components.

### 6.4 Control Flow Syntax (REQUIRED)
**FORBIDDEN — old structural directives as attribute selectors:**
```html
<!-- ❌ BANNED -->
<div *ngIf="show">...</div>
<li *ngFor="let item of items; trackBy: trackFn">...</li>
<div [ngSwitch]="state"><span *ngSwitchCase="'a'">A</span></div>
```
**REQUIRED — built-in control flow blocks:**
```html
<!-- ✅ CORRECT -->
@if (show) { <div>...</div> }
@for (item of items; track item.id) { <li>...</li> }
@switch (state) { @case ('a') { <span>A</span> } }
@defer { <heavy-component /> }
```

### 6.5 Inject Function (REQUIRED)
**FORBIDDEN:**
```typescript
// ❌ BANNED — constructor injection
constructor(private router: Router, private http: HttpClient) {}
```
**REQUIRED:**
```typescript
// ✅ CORRECT — inject() function in class field or ngOnInit
import { inject } from '@angular/core';
private router = inject(Router);
private http = inject(HttpClient);
```
> Exception: `super()` calls in extended classes may still need a constructor signature.

### 6.6 Standalone Components (REQUIRED)
**FORBIDDEN:**
```typescript
// ❌ BANNED — NgModule-based components
@NgModule({ declarations: [MyComponent] })
```
**REQUIRED:**
```typescript
// ✅ CORRECT — all components must be standalone
@Component({ standalone: true, imports: [...] })
```
Every component, directive, and pipe in this project MUST be `standalone: true`. NgModules must NOT be created.

### 6.7 Signals for State (REQUIRED where applicable)
Use `signal()`, `computed()`, and `effect()` for reactive component state instead of plain class properties + manual change detection triggers.
```typescript
import { signal, computed, effect } from '@angular/core';
count = signal(0);
doubled = computed(() => this.count() * 2);

constructor() {
  effect(() => console.log('count changed:', this.count()));
}
```

### 6.8 takeUntilDestroyed (REQUIRED for Observables)
When subscribing to Observables in components, ALWAYS unsubscribe safely using:
```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.someObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(...);
}
```
**NEVER** use the manual `ngOnDestroy` + `Subject` + `takeUntil` pattern for subscription cleanup.

### 6.9 No `ngOnDestroy` for Subscriptions (REQUIRED)
Only use `ngOnDestroy` for truly non-Observable teardown (e.g., `cancelAnimationFrame`, DOM event listeners not managed by Angular). Observable cleanup MUST use `takeUntilDestroyed`.

---

## 7. Banned APIs & Patterns Summary

| ❌ Banned | ✅ Required Replacement |
|-----------|------------------------|
| `@Input()` decorator | `input()` signal function |
| `@Output()` + `EventEmitter` | `output()` signal function |
| `@ViewChild()` decorator | `viewChild()` signal function |
| `@ViewChildren()` decorator | `viewChildren()` signal function |
| `@ContentChild()` decorator | `contentChild()` signal function |
| `CommonModule` import | Import only specific standalone pipes |
| `*ngIf`, `*ngFor`, `*ngSwitch` | `@if`, `@for`, `@switch` blocks |
| Constructor injection | `inject()` function |
| NgModule declarations | Standalone components with `imports: []` |
| `Subject` + `takeUntil` for destroy | `takeUntilDestroyed(destroyRef)` |
| `standalone: false` | `standalone: true` always |
| Inline `template:` in `@Component` | Separate `.html` file via `templateUrl:` |
| Inline `styles:` in `@Component` | Separate `.scss` file via `styleUrl:` |

---

Please consult these rules before adding new features or refactoring existing code.
