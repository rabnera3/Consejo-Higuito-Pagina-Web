import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const svgFiles = [
  'src/img/svg/carrusel1.svg',
  'src/img/svg/carrusel2.svg',
  'src/img/svg/carrusel3.svg',
  'src/img/svg/carrusel4.svg'
];

async function convertToWebP() {
  for (const svgPath of svgFiles) {
    const fullPath = join(projectRoot, svgPath);
    const outputPath = fullPath.replace('.svg', '.webp');
    const svgBuffer = readFileSync(fullPath);
    
    console.log(`Converting ${svgPath}...`);
    
    await sharp(svgBuffer, { density: 150 })
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    console.log(`✓ Created ${outputPath}`);
  }
}

convertToWebP()
  .then(() => console.log('\n✓ All carousel images converted to WebP!'))
  .catch(err => console.error('Error:', err));
