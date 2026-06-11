# 🚀 Angular Project Template

Welcome to the **Angular Project Template**! 

## 📖 Introduction
This is a ready-to-use Angular UI starter kit designed specifically for commerce-style and dashboard applications. 

The goal of this template is to help Angular developers, frontend engineers, and small teams **clone and start building immediately**. Instead of spending hours setting up boilerplate, routing, and basic UI components, you can focus right away on your core product logic.

## 🎯 Purpose & Benefits
- **Fast Kick-off:** Provides a clean, lightweight, and scalable project structure from day one.
- **Practical & Ready-to-use:** Ships with over 15 sample routed pages (Home, Catalog, Product, Cart, Dashboard, Profile, etc.), a responsive app shell, and shared UI primitives.
- **Flexible Styling:** Uses component-level SCSS for precise layout styling and global SCSS strictly for design tokens and resets. You are not locked into heavy utility-class frameworks.
- **Optimized UX:** Integrates selected PrimeNG Community components for complex UI elements (like charts, tables, date pickers) to ensure the best accessibility and user experience without reinventing the wheel.

## 🏗 Project Structure
The repository is organized following a feature-based architecture to keep the codebase maintainable:

- `apps/web/src/app/app.component.ts`: The minimal root router shell.
- `apps/web/src/app/layout/`: App shell and shared framing components.
- `apps/web/src/app/features/`: Independent, routed page-level features.
- `apps/web/src/app/shared/`: Truly reusable UI primitives and shared utilities.
- `apps/web/src/styles.scss`: Global styling, CSS variables/tokens, and resets.
- `primeng`: We use PrimeNG specifically for complex data-dense components.

## 🚀 How to Use the Template

1. **Clone this repository:**
   ```bash
   git clone <your-repo-url>
   ```
2. **Install dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 🛠 How to Extend
- To add a new page, create a feature folder under `apps/web/src/app/features/<feature-name>`.
- Keep page composition local to its feature until a piece of UI is genuinely reused across different pages.
- Move repeated UI blocks into `apps/web/src/app/shared`.
- Avoid adding unnecessary architectural layers unless they solve a real repeatability problem.

---

Thank you for stopping by and checking out this template. I hope it helps many developers save time, learn something new, and build amazing products! ✨
