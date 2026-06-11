---
name: Angular Project Template
description: A restrained commerce-style Angular template built for fast cloning and easy extension.
colors:
  bg: "#f4f5f2"
  surface: "#fffdf8"
  surface-2: "#eef2ed"
  ink: "#14110f"
  muted: "#5d625d"
  line: "#e4d8c9"
  accent: "#9a5e34"
  accent-2: "#214b57"
  success: "#2f6f4e"
  warning: "#9a6a1f"
  danger: "#a13d3d"
  info: "#2f5f91"
typography:
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "16px"
  xl: "22px"
spacing:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "999px"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "999px"
    padding: "12px 18px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  page-section:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0px"
---

# Design System: Angular Project Template

## Overview

**Creative North Star: "The Calm Commerce Workshop"**

This system is meant to feel like a focused product workbench: practical tools, clear labels, and enough warmth to make the interface feel considered without turning decorative. The palette stays restrained, the layout stays readable, and the component language stays deliberately small so the template remains easy to clone, extend, and maintain.

It explicitly rejects the most common AI template tells: SaaS-gray monotony, glassmorphism as a default effect, repetitive card grids, and overbuilt design systems that add more abstraction than value. The point is not to impress with complexity, it is to make the starting point trustworthy and easy to keep using.

**Key Characteristics:**
- Restrained, commerce-friendly, and readable at a glance.
- Neutral surface tones with a grounded ink contrast and sparse warm accents.
- Simple component vocabulary that stays reusable.
- Clear hierarchy over decoration.

## Colors

The palette is neutral with a light warm accent. It avoids letting beige become the whole identity. Accent colors stay secondary to structure, not the other way around.

### Primary
- **Clay Accent** (`#9a5e34`): Used for brand moments, emphasis, and subtle warmth in the UI.
- **Deep Teal Accent** (`#214b57`): Used as the cooler counterpoint for secondary emphasis, contrast, and occasional visual balance.

### Neutral
- **Neutral Background** (`#f4f5f2`): Global page background, chosen to feel calm without reading as a beige theme.
- **Soft Surface** (`#fffdf8`): Primary container background for cards and shell surfaces.
- **Cool Surface Tint** (`#eef2ed`): Secondary surface layer for toolbars, states, and section separation.
- **Ink** (`#14110f`): Main text and primary UI contrast color.
- **Muted Ink** (`#645c53`): Supporting text, helper copy, and de-emphasized labels.
- **Line** (`#e4d8c9`): Borders, dividers, and subtle structure lines.

### Named Rules
**The Surface-First Rule.** The interface earns depth through layered surfaces, not through heavy decoration.

**The Accent-Rarity Rule.** Accent color should feel intentional and sparse. If everything is emphasized, nothing is.

**The Layout-Consistency-First Rule.** When refining screens, preserve a shared spacing rhythm, stable container proportions, and matched background geometry before adding new visual treatment. UI/UX consistency is the first priority, especially across workspace-style sections and simulator canvases.

**The Desktop-Fit Rule.** Primary page content should fit within a typical desktop viewport whenever the surface is meant to be reviewed or acted on at a glance. Reduce vertical excess before shrinking important content, and avoid forcing users to scroll just to understand the main surface.

**The Workspace-Proportion Rule.** Inner panels, demo shells, cards, and task surfaces must feel proportionally related to their parent container. Avoid tiny floating blocks inside oversized canvases unless the pattern is intentionally modal or intentionally compact.

**The State-Environment Rule.** Empty, error, offline, onboarding, recovery, and system-feedback states should feel like complete product scenarios, not isolated decorative cards. Background, shell size, content density, and actions should read as one coherent environment.

**The Scrollbar-Polish Rule.** If scrolling is necessary inside any product surface, the scrollbar must be visually integrated with the design system: thin, quiet, rounded, and palette-aligned. Default heavy browser scrollbars should be treated as unfinished UI.

**The Scroll-Threshold Rule.** Do not switch a surface into internal scroll mode just because it overflows by a small amount. If the layout can be tightened slightly without harming readability or hierarchy, reduce the overflow first. Internal scrolling should be reserved for meaningfully dense content, not tiny leftover spill.

**The Density-First Adjustment Rule.** Before adding overflow behavior, first adjust low-risk density levers in this order: non-critical gaps, secondary padding, helper-text spacing, item row density, then container height. Do not compress primary actions or main labels prematurely.

**The List-Surface Rule.** Lists, menus, result groups, and stacked controls should remain readable without unnecessary scrolling. A list surface should first attempt to fit by slightly tightening row density before falling back to an internal scrollbar.

**The Shared-State-Frame Rule.** Variations of the same surface should preserve the same internal layout frame whenever possible. If a screen changes from populated to empty, loading, filtered, or failed, keep the shell, key anchors, and body proportions stable, then swap the content inside that frame.

**The Fixed-Anchor Rule.** Persistent controls such as search bars, filter rows, tabs, toolbars, and primary headers should remain in a fixed position when a surface changes state. State changes should happen in the content region below or beside them, not by pushing those anchors to new coordinates.

**The Stable-Section Rule.** When one surface contains multiple functional sections, such as a toolbar section and a results section, those sections should keep their own stable footprint across state changes. One section changing state should not resize or reposition the other.

**The Elastic-Constraint Rule.** Prefer constrained fluid sizing over hard fixed values. Use relationships such as `min()`, `max()`, `clamp()`, percentage bounds, and container-relative sizing so surfaces stay consistent without becoming rigid.

**The Fixed-Baseline Exception Rule.** When a surface must preserve strict visual consistency across rapid state changes, it is acceptable to give persistent sections and repeated rows a fixed baseline size. Use this selectively for anchors such as search bars, result regions, and list rows, while keeping the outer surface responsive.

**The Strict-Footprint Rule.** When designing a gallery of interchangeable system states (e.g., empty states, error states, disconnected modes), force a strictly identical container `width` and `height` across all variants. The UI should feel like a rock-solid, unchanging canvas where only the internal content swaps, preventing the card from jittering or adapting height when navigating between states.

**The Smart-Swapping Rule.** To avoid triggering scrollbars when dynamic content appears (like a success message after an action), intelligently swap out or hide existing non-critical elements (like a console error log or a giant decorative icon) rather than lazily stacking new elements and forcing the container to grow.

**The Absolute-Alignment Rule.** Ensure universal alignment for key interactive elements across different states. Instead of relying on container-level centering (which shifts buttons up or down depending on content length), use `margin-top: auto` or similar techniques to push action buttons to an absolute bottom baseline. This guarantees buttons sit on the exact same horizon across all screens.

## Typography

**Body Font:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`
**Label Font:** Same family, with slightly stronger weight and tighter scale.

**Character:** Neutral, highly legible, and quietly premium. The typography should support fast scanning and make the template easy to repurpose for different commerce-style products.

### Hierarchy
- **Body** (`400`, `1rem`, `1.5`): Default reading text, helper text, and page copy. Keep line length comfortable and avoid dense blocks.
- **Label** (`600`, `0.875rem`, `1.2`): Buttons, small metadata, section subtitles, and compact UI labels.

### Named Rules
**The Readable-First Rule.** If type needs special styling to be understood, it is too decorative for this template.

## Elevation

This system uses light ambient shadowing plus strong tonal layering. Surfaces should feel softly lifted, not floating. Depth comes from surface contrast, border tone, and one restrained shadow vocabulary, not from dramatic blur.

### Shadow Vocabulary
- **Soft Ambient Lift** (`0 24px 80px rgba(20, 17, 15, 0.08)`): Used on the shell, cards, and larger container moments where a subtle lift improves clarity.

### Named Rules
**The Quiet Depth Rule.** Elevation supports structure. It never becomes the headline.

## Components

The component language is small by design: rounded pills for actions, soft cards for content, and light framing for page sections. The template should feel easy to read, not overdesigned.

### Buttons
- **Shape:** Fully rounded pill shape (`999px`) for friendliness and high recognizability.
- **Primary:** Dark ink background with surface text, compact horizontal padding, used for the strongest action on a screen.
- **Secondary:** Surface background with ink text and a light border, used for secondary actions or quieter choices.
- **Hover / Focus:** Keep transitions subtle and state changes immediate, with no bounce or elastic motion.

### PrimeNG
- **Role:** Use PrimeNG Community for complex Angular UX such as charts, tables, tabs, overlays, tooltips, date picker, select, slider, paginator, skeleton, progress, and toast.
- **Boundary:** Do not replace page composition with PrimeNG. Layout, spacing, typography, and visual polish stay in Angular component SCSS.
- **Style Rule:** PrimeNG components must inherit template tokens so they feel native to the kit.

### Cards
- **Corner Style:** Medium rounded corners (`22px`) to keep surfaces soft without drifting into toy-like rounding.
- **Background:** Soft surface tone with subtle separation from the page background.
- **Shadow Strategy:** One restrained ambient shadow only, used sparingly.
- **Internal Padding:** Comfortable content padding (`24px`) for scanning and reuse.
- **Container Role:** Cards inside larger panels should respect the proportions of the parent layout and not feel visually stranded.

### Page Sections
- **Style:** Minimal framing wrapper for headings, subtitles, and page content blocks.
- **Behavior:** Keep it structural rather than decorative. It should organize content, not compete with it.
- **Viewport Fit:** For surface-led pages, tighten heading and intro spacing before compromising the primary interactive canvas or task area.

### Lists & Menus
- **Density:** Row density may tighten slightly to preserve viewport fit, but titles, selection affordances, and primary values must remain easy to scan.
- **Overflow Policy:** Internal scrolling is a fallback, not a default. Use it only after spacing and row-density adjustments no longer preserve a balanced layout.
- **Surface Quality:** Scrollable lists must still feel premium, with integrated scrollbar styling and consistent row framing.
- **State Consistency:** Filtered, empty, loading, and populated variants of the same list should keep the same search region, content frame, and proportional footprint whenever practical.
- **Anchor Stability:** Search inputs and filter controls must not jump vertically or resize the overall surface when the result state changes.
- **Section Separation:** Search/filter anchors and result content should be modeled as distinct but coordinated sections, each with its own stable size behavior.
- **Baseline Stability:** When consistency is more important than flexibility, search sections, result sections, and repeated rows may use fixed baseline heights or widths inside an otherwise responsive shell.

### Navigation
- **Style:** Inline top navigation with clear active state and subdued inactive links.
- **Mobile Treatment:** Allow horizontal wrapping or scrolling rather than collapsing into a heavy menu pattern too early.

### Signature Component
- **App Shell:** A sticky, pill-shaped top bar with brand block, primary navigation, and consistent spacing. It sets the tone for the whole template without dominating the page.

## Do's and Don'ts

### Do:
- **Do** keep the visual hierarchy simple and readable on first load.
- **Do** use the shared card, button, and section primitives as the base for new pages.
- **Do** preserve the warm surface palette and strong ink contrast.
- **Do** keep the app shell lightweight so new routes are easy to add.
- **Do** use subtle state changes instead of decorative motion.
- **Do** treat workspace previews as proportioned layout systems, not just centered content cards.
- **Do** verify that offline and failure states still feel intentional, stable, and readable inside the shared workspace shell.
- **Do** polish any required internal scroll areas so they feel native to the template.
- **Do** prefer small spacing, shell, or content adjustments before introducing internal scroll behavior.
- **Do** let list items tighten slightly before forcing a list or menu into scroll mode.
- **Do** preserve strong scanability for titles, values, and actions while making density adjustments.
- **Do** keep state changes inside a shared surface frame so the layout does not visually jump between variants.
- **Do** use elastic constraints instead of over-relying on fixed pixel sizes when stabilizing UI sections.
- **Do** apply `min-width: 0` to CSS Grid children to prevent implicit minimum sizing from causing entire grids to overflow the mobile viewport horizontally (Grid Blowout).
- **Do** build horizontal scrolling regions (like kanban boards and tabs) using `display: flex; flex-wrap: nowrap; overflow-x: auto;` combined with `flex-shrink: 0` on children to guarantee bulletproof touch interactions.
- **Do** forcefully wrap long unbroken strings (like server error logs) using `word-break: break-all` and `white-space: pre-wrap` on narrow screens.

### Don't:
- **Don't** use SaaS-gray defaults that make the template feel generic.
- **Don't** lean on glassmorphism as a default effect.
- **Don't** build identical card grids just to fill space.
- **Don't** over-round cards or inputs until they feel cartoonish.
- **Don't** introduce extra abstraction layers unless reuse is already real.
- **Don't** make dark mode the default aesthetic.
- **Don't** leave oversized empty canvas regions around undersized simulator content.
- **Don't** ship raw browser scrollbars inside premium showcase surfaces unless there is a strong platform reason.
- **Don't** introduce scroll mode for a surface that only overflows by a trivial amount.
- **Don't** let helper text, oversized padding, or decorative empty space be the reason a list or panel starts scrolling.
- **Don't** rebuild the internal structure of the same surface for each state unless the change in behavior genuinely requires a new layout.
- **Don't** let one section of a compound surface resize another section just because its state changed.
