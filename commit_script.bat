@echo off
git update-ref -d HEAD
git reset

git add .editorconfig .gitignore angular.json package.json package-lock.json tsconfig.json tsconfig.base.json apps/web/tsconfig.app.json apps/web/tsconfig.json apps/web/tsconfig.spec.json
git commit -S -m "chore: initialize angular workspace and config"

git add .github/ .agents/ skills-lock.json commit_script.bat
git commit -S -m "chore: add workflow configs and utility scripts"

git add README.md PRODUCT.md DESIGN.md AGENT_INSTRUCTIONS.md docs/ LICENSE
git commit -S -m "docs: add AI and product guidelines"

git add apps/web/src/styles.scss apps/web/src/index.html apps/web/src/main.ts apps/web/src/app/app.component.html apps/web/src/app/app.component.scss apps/web/src/app/app.component.ts apps/web/src/app/app.routes.ts apps/web/src/app/layout/ apps/web/src/app/shared/
git commit -S -m "feat: scaffold base layout and shared UI components"

git add apps/web/src/app/features/ apps/web/public/
git commit -S -m "feat: implement application features"

git add karma.conf.js apps/web/src/test.ts apps/web/src/app/styling-integration.spec.ts apps/web/src/app/responsive-layout.spec.ts apps/web/src/app/responsive.spec.ts
git commit -S -m "test: add integration tests and setups"

git add .
git commit -S -m "chore: add remaining files"
