# Shared UI

This folder is intentionally small.

Use it only for UI or utilities that are reused in more than one feature.

## Suggested contents

- `ui/`: dumb reusable visual primitives.
- `layout/`: shared app framing pieces if the project grows beyond one shell.
- `util/`: tiny helpers with no UI dependency.

## Rule of thumb

- If it is used once, keep it inside the feature.
- If it is used twice, consider shared.
- If it is only a convenience abstraction, leave it out.
