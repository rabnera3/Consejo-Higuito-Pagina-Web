#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * Converts all WebP/JPG/PNG images to AVIF format and creates responsive versions
 * Maintains original files as fallback
 * 
 * Usage:
 *   npm run optimize-images
 * 
 * Requirements:
 *   npm install --save-dev sharp
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const SRC_DIRS = [
  path.join(__dirname, '../src/img'),
  path.join(__dirname, '../../public/img'),
];

const RESPONSIVE_SIZES = {
  sm: 480,    // Mobile
  md: 768,    // Tablet
  lg: 1280,   // Desktop
  xl: 1920,   // Large desktop
};

const AVIF_QUALITY = 50;     // AVIF quality (1-100)
const WEBP_QUALITY = 75;     // WebP quality (1-100)
const SKIP_EXTENSIONS = ['.svg'];
const SUPPORTED_INPUT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

let processedCount = 0;
let skippedCount = 0;

async function convertImage(inputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    
    // Skip if not a supported format
    if (!SUPPORTED_INPUT.includes(ext)) {
      return;
    }

    const dir = path.dirname(inputPath);
    const basename = path.basename(inputPath, ext);
    const basePath = path.join(dir, basename);

    console.log(`\n📸 Processing: ${basename}${ext}`);

    // Read image
    let image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    // 1. Convert to AVIF (full size)
    console.log(`  → Converting to AVIF (${width}x${height})`);
    await image
      .avif({ quality: AVIF_QUALITY })
      .toFile(`${basePath}.avif`);

    // 2. Create responsive AVIF versions
    for (const [sizeKey, sizeValue] of Object.entries(RESPONSIVE_SIZES)) {
      if (width > sizeValue) {
        const aspect = height / width;
        const responsiveHeight = Math.round(sizeValue * aspect);
        
        console.log(`  → AVIF ${sizeKey} (${sizeValue}x${responsiveHeight})`);
        
        await sharp(inputPath)
          .resize(sizeValue, responsiveHeight, { fit: 'cover', withoutEnlargement: true })
          .avif({ quality: AVIF_QUALITY })
          .toFile(`${basePath}-${sizeKey}.avif`);
      }
    }

    // 3. Convert to WebP (full size) - for fallback
    // Only if input is NOT WebP to avoid overwriting
    if (ext !== '.webp') {
      console.log(`  → Converting to WebP (${width}x${height})`);
      await sharp(inputPath)
        .webp({ quality: WEBP_QUALITY })
        .toFile(`${basePath}.webp`);

      // 4. Create responsive WebP versions
      for (const [sizeKey, sizeValue] of Object.entries(RESPONSIVE_SIZES)) {
        if (width > sizeValue) {
          const aspect = height / width;
          const responsiveHeight = Math.round(sizeValue * aspect);
          
          console.log(`  → WebP ${sizeKey} (${sizeValue}x${responsiveHeight})`);
          
          await sharp(inputPath)
            .resize(sizeValue, responsiveHeight, { fit: 'cover', withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toFile(`${basePath}-${sizeKey}.webp`);
        }
      }
    } else {
      console.log(`  → Skipping WebP conversion (input is WebP)`);
    }

    processedCount++;
    console.log(`  ✅ Done`);

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.')) {
        // Recursively process subdirectories
        await processDirectory(filePath);
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        
        // Skip already converted files
        if (file.includes('-sm.') || file.includes('-md.') || file.includes('-lg.') || file.includes('-xl.')) {
          skippedCount++;
          continue;
        }

        // Skip SVG and other non-image formats
        if (SKIP_EXTENSIONS.includes(ext)) {
          skippedCount++;
          continue;
        }

        // Skip if already AVIF (don't reconvert)
        if (ext === '.avif') {
          skippedCount++;
          continue;
        }

        await convertImage(filePath);
      }
    }
  } catch (error) {
    console.error(`Directory error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting Image Optimization...\n');
  console.log(`📁 Directories to process:`);
  SRC_DIRS.forEach(dir => {
    console.log(`  • ${dir}`);
  });
  
  console.log(`\n⚙️  Configuration:`);
  console.log(`  • AVIF Quality: ${AVIF_QUALITY}`);
  console.log(`  • WebP Quality: ${WEBP_QUALITY}`);
  console.log(`  • Responsive Sizes:`, RESPONSIVE_SIZES);

  // Check if directories exist
  for (const dir of SRC_DIRS) {
    if (fs.existsSync(dir)) {
      await processDirectory(dir);
    } else {
      console.log(`⚠️  Skipping non-existent directory: ${dir}`);
    }
  }

  console.log(`\n\n✨ Optimization Complete!`);
  console.log(`  • Processed: ${processedCount} images`);
  console.log(`  • Skipped: ${skippedCount} files`);
  console.log(`\n📊 Generated Files:`);
  console.log(`  • .avif (Primary format - best compression)`);
  console.log(`  • -sm.avif, -md.avif, -lg.avif (Responsive versions)`);
  console.log(`  • .webp (Fallback - good browser support)`);
  console.log(`  • -sm.webp, -md.webp, -lg.webp (Responsive fallback)`);
  console.log(`  • Original .jpg/.png (Final fallback)\n`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
