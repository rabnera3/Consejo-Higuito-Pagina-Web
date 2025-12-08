#!/usr/bin/env node

/**
 * Image Responsive Helper
 * 
 * Utilidad para generar código de ResponsiveImage automáticamente
 * 
 * Uso:
 *   npm run responsive-image -- --base "../img/aboutus1" --sizes md,lg
 * 
 * Ejemplo output:
 * <ResponsiveImage
 *   srcBase="../img/aboutus1"
 *   srcSet={{
 *     480: '../img/aboutus1-sm',
 *     768: '../img/aboutus1-md',
 *     1280: '../img/aboutus1-lg',
 *   }}
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 *   alt="Your alt text"
 *   className="w-full h-auto"
 * />
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
let basePath = '';
let includeAllSizes = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--base' && i + 1 < args.length) {
    basePath = args[i + 1];
  } else if (args[i] === '--all') {
    includeAllSizes = true;
  }
}

if (!basePath) {
  console.log(`
🖼️  ResponsiveImage Code Generator

Usage:
  npm run responsive-image -- --base "../img/yourimage" [--all]

Options:
  --base    Path without extension (required)
  --all     Include all sizes (sm, md, lg, xl) instead of default (sm, md, lg)

Examples:
  npm run responsive-image -- --base "../img/aboutus1"
  npm run responsive-image -- --base "../img/carrusel1" --all

Output:
  Generates <ResponsiveImage /> component code
  `);
  process.exit(0);
}

const sizes = includeAllSizes
  ? { 480: 'sm', 768: 'md', 1280: 'lg', 1920: 'xl' }
  : { 480: 'sm', 768: 'md', 1280: 'lg' };

const srcSet = Object.entries(sizes)
  .map(([width, key]) => `    ${width}: '${basePath}-${key}',`)
  .join('\n');

const template = `<ResponsiveImage
  srcBase="${basePath}"
  srcSet={{
${srcSet}
  }}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Your alt text here"
  className="w-full h-auto"
/>`;

console.log('\n📋 Generated ResponsiveImage Code:\n');
console.log(template);
console.log('\n');

// Also suggest the files that should be generated
console.log('📦 Expected files after "npm run optimize-images":');
console.log(`\n  Main formats (AVIF primary, WebP fallback):`);
console.log(`  • ${path.basename(basePath)}.avif`);
Object.values(sizes).forEach(key => {
  console.log(`  • ${path.basename(basePath)}-${key}.avif`);
});

console.log(`\n  Fallback formats (automatic, don't need to reference):`);
console.log(`  • ${path.basename(basePath)}.webp`);
Object.values(sizes).forEach(key => {
  console.log(`  • ${path.basename(basePath)}-${key}.webp`);
});

console.log(`\n  Original formats (kept as final fallback):`);
console.log(`  • ${path.basename(basePath)}.jpg (or .png)`);
Object.values(sizes).forEach(key => {
  console.log(`  • ${path.basename(basePath)}-${key}.jpg`);
});

console.log('\n✅ Copy the code above and paste into your component!\n');
