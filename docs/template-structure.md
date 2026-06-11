# Template Structure

This repository is intended to stay clone-friendly while providing complete, usable page references.

## App layout

- `apps/web/src/index.html`: Angular app host page.
- `apps/web/src/main.ts`: bootstrap entrypoint.
- `apps/web/src/app/app.component.ts`: minimal root shell.
- `apps/web/src/app/layout/*`: shared app shell / framing.
- `apps/web/src/app/features/*`: routed or page-level features.
- `apps/web/src/app/shared/*`: reusable UI and utilities.
- `apps/web/src/styles.scss`: small global resets only.
- PrimeNG Community: selected complex UX components, not the default layout system.

## Pages in the template

- `home`
- `catalog`
- `product`
- `cart`
- `settings`
- `sign-in`
- `empty-state`
- `dashboard`
- `component-gallery`
- `forms`
- `data-visualization`
- `motion-lab`
- `profile`
- `forgot-password`
- `not-found`

## Rules

- Keep styling in component SCSS, not global CSS files.
- Prefer SCSS and native Angular state for simple UI.
- Use PrimeNG for complex controls such as charts, tables, overlays, tabs, date picker, select, skeleton, progress, and pagination.
- Prefer feature folders over a giant monolithic component.
- Avoid overengineering. Add abstractions only when a second use case exists.
- Keep template defaults simple so another developer can clone and run with minimal setup.

## Current starting point

- The template currently ships with multiple complete routes and page examples.
- The structure is ready to extend without changing the root bootstrap.
