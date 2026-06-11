# Development Guide

This template is intentionally small.

## Add a new feature

- Create a folder under `apps/web/src/app/features/<feature-name>`.
- Keep page-level composition in the feature component.
- Only extract a shared component after it is used in more than one place.

## Add shared UI

- Put truly reusable pieces in `apps/web/src/app/shared`.
- Keep shared UI dumb and composable.
- Prefer plain inputs and content projection over clever abstractions.

## Styling rules

- Component SCSS for layout and section-level styling.
- Global SCSS only for tokens and reset.
- Avoid utility-class frameworks unless the repo explicitly adopts one later.

## Template principle

- The project should feel ready to clone, run, and adapt without first refactoring the architecture.
- If a layer does not have a second use case, keep it local to the feature.
