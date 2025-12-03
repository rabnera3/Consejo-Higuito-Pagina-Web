import sharp from 'sharp';
import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Encuentra todas las imágenes JPG/PNG en src/img (recursivamente)
function findImages(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext) && stat.size > 100 * 1024) { // >100KB
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

async function optimizeImage(inputPath) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const relativePath = inputPath.replace(projectRoot + '\\', '');
  
  try {
    const stats = statSync(inputPath);
    const sizeBefore = (stats.size / 1024).toFixed(2);
    
    console.log(`Converting ${relativePath} (${sizeBefore} KB)...`);
    
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const statsAfter = statSync(outputPath);
    const sizeAfter = (statsAfter.size / 1024).toFixed(2);
    const reduction = ((1 - statsAfter.size / stats.size) * 100).toFixed(1);
    
    console.log(`✓ Created ${outputPath.replace(projectRoot + '\\', '')} (${sizeAfter} KB, ${reduction}% reduction)\n`);
  } catch (err) {
    console.error(`✗ Error converting ${relativePath}:`, err.message);
  }
}

async function optimizeAllImages() {
  const imgDir = join(projectRoot, 'src', 'img');
  const images = findImages(imgDir);
  
  console.log(`Found ${images.length} images to optimize (>100KB)\n`);
  
  for (const imagePath of images) {
    await optimizeImage(imagePath);
  }
  
  console.log('\n✓ All images optimized!');
}

optimizeAllImages().catch(err => console.error('Error:', err));
