const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/web/src/app/features');

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

for (const file of scssFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Ignore empty or extremely small SCSS files
  if (content.trim().length < 10) continue;

  const isResponsive = /@media|flex|grid|clamp\(|%|vw|vh/i.test(content);
  
  if (!isResponsive) {
    console.warn(`[Responsive Warning] Component styling may not be responsive in ${path.relative(process.cwd(), file)}`);
    console.warn('  -> Ensure you are using relative units (%, vw) or modern layout primitives (flex, grid).');
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\nResponsive checks flagged warnings. Please review the components above.');
  process.exit(1);
} else {
  console.log('Responsive checks passed! All component styles use flexible layout tokens.');
  process.exit(0);
}
