const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/web/src/app');
const i18nDir = path.join(__dirname, '../apps/web/src/assets/i18n');

let hasErrors = false;

// 1. Compare JSON keys
function getKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys = keys.concat(getKeys(v, p));
    } else {
      keys.push(p);
    }
  }
  return keys;
}

const enPath = path.join(i18nDir, 'en.json');
const viPath = path.join(i18nDir, 'vi.json');

const enKeys = getKeys(JSON.parse(fs.readFileSync(enPath, 'utf8')));
const viKeys = getKeys(JSON.parse(fs.readFileSync(viPath, 'utf8')));

const missingInVi = enKeys.filter(k => !viKeys.includes(k));
const missingInEn = viKeys.filter(k => !enKeys.includes(k));

if (missingInVi.length > 0) {
  console.error('[i18n Error] Missing keys in vi.json:', missingInVi);
  hasErrors = true;
}
if (missingInEn.length > 0) {
  console.error('[i18n Error] Missing keys in en.json:', missingInEn);
  hasErrors = true;
}

// 2. Scan HTML files for untranslated text
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = findHtmlFiles(srcDir);

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Exclude style and script tags
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, ' ');
  
  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, ' ');
  
  // Remove Angular control flow keywords
  content = content.replace(/@(if|else|for|switch|case|default|empty)[^{]*\{/g, ' ');
  content = content.replace(/\}/g, ' ');
  
  // Remove Angular interpolations {{ ... }} across multiple lines
  content = content.replace(/\{\{[\s\S]*?\}\}/gm, ' ');
  
  // Clean up whitespace
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  for (let line of lines) {
    // Ignore brand names, EN/VI
    if (/^(Sion Studio|Vanguard Labs|EN|VI|let t|\|)$/.test(line)) continue;
    
    // Basic heuristic: contains letters, isn't just symbols/numbers
    if (/[a-zA-Z]{2,}/.test(line)) {
      // Check if the remaining line still contains {{ (meaning our regex failed to strip)
      if (line.includes('{{')) continue;
      
      console.error(`[i18n Error] Untranslated text found in ${path.relative(process.cwd(), file)}: "${line}"`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error('\ni18n checks failed!');
  process.exit(1);
} else {
  console.log('i18n checks passed! All texts appear to be translated and JSON files are synced.');
  process.exit(0);
}
