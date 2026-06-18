const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/web/src/app');

let hasErrors = false;

function findScssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findScssFiles(filePath, fileList);
    } else if (filePath.endsWith('.scss')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const scssFiles = findScssFiles(srcDir);

// Regex to find hex colors, rgb/rgba, or basic color keywords (excluding variables)
const hardcodedColorRegex = /:\s*(#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|black\b|white\b)[^;]*;/gi;

for (const file of scssFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  let match;
  while ((match = hardcodedColorRegex.exec(content)) !== null) {
    // Ignore cases where they are part of a variable definition or comment
    // In a strict check, any hardcoded color in a component SCSS is a red flag for dark mode.
    console.error(`[Dark Mode Error] Hardcoded color found in ${path.relative(process.cwd(), file)}: "${match[1]}"`);
    console.error('  -> Replace with a theme CSS variable (e.g., var(--surface-1), var(--ink)) to support dark mode.');
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\nDark Mode checks failed! Hardcoded colors will not invert when data-theme="dark" is active.');
  process.exit(1);
} else {
  console.log('Dark Mode checks passed! All component styles rely on theme variables.');
  process.exit(0);
}
