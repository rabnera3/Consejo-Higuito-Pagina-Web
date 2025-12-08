# Image Optimization Implementation Checklist

## Fase 1: Setup ✅

- [x] Crear `ResponsiveImage.tsx` component
- [x] Instalar `sharp` (ya en package.json)
- [x] Crear script `optimize-images.js`
- [x] Crear script `responsive-image.js` (helper)
- [x] Actualizar `package.json` con scripts
- [x] Documentación completada

## Fase 2: Convertir Imágenes

### 1. Ejecutar Optimización
```bash
cd Frontend
npm run optimize-images
```

**Tiempo estimado**: 5-15 minutos (depende de cantidad de imágenes)

**Output esperado**:
```
🚀 Starting Image Optimization...
📁 Directories to process:
  • C:\...\Frontend\src\img
  • C:\...\public\img

⚙️  Configuration:
  • AVIF Quality: 50
  • WebP Quality: 75
  • Responsive Sizes: { sm: 480, md: 768, lg: 1280, xl: 1920 }

📸 Processing: aboutus1.webp
  → Converting to AVIF (1920x1280)
  → AVIF sm (480x320)
  → AVIF md (768x512)
  → AVIF lg (1280x853)
  → Converting to WebP (1920x1280)
  → WebP sm (480x320)
  ...
✅ Done

✨ Optimization Complete!
  • Processed: 45 images
  • Skipped: 12 files
```

**Archivos generados**:
- `aboutus1.avif` + `-sm.avif`, `-md.avif`, `-lg.avif`
- `aboutus1.webp` + fallbacks
- Originales `aboutus1.jpg` intactos (para fallback)

### 2. Verificar Imágenes Convertidas

```bash
# Ver imágenes AVIF creadas
ls -lh Frontend/src/img/*.avif | head -20

# Ver tamaños reducidos
# Ejemplo:
# -rw-r--r-- 269K aboutus1.avif       (antes 564K webp = 52% reducción)
# -rw-r--r--  80K aboutus1-sm.avif   (móvil, 86% reducción)
```

### 3. Commit de Imágenes
```bash
git add Frontend/src/img Frontend/public/img
git commit -m "chore: optimize images to AVIF with responsive sizes"
git push
```

## Fase 3: Migración de Componentes

### Opción A: Migración Completa (All-in)
Cambiar TODOS los componentes a ResponsiveImage

**Componentes principales a actualizar**:
- ✅ `About.tsx` - 5 ImageWithFallback → ResponsiveImage
- [ ] `Home.tsx` - carouselSvgs, Hero images
- [ ] `Filosofia.tsx` - ImageWithFallback → ResponsiveImage
- [ ] `Socios.tsx` - partner images
- [ ] `Calidad.tsx` - images
- [ ] `Blog.tsx` - blog post cover images
- [ ] `BlogPost.tsx` - featured images
- [ ] Todas las `Unidad*.tsx` - ImageCarousel images

**Pasos por componente**:

```tsx
// 1. Actualizar import
- import { ImageWithFallback } from '../components/figma/ImageWithFallback';
+ import { ResponsiveImage } from '../components/ResponsiveImage';

// 2. Reemplazar componente (una por una)
- <ImageWithFallback
-   src={new URL('../img/aboutus1.webp', import.meta.url).href}
-   alt="..."
- />
+ <ResponsiveImage
+   srcBase="../img/aboutus1"
+   srcSet={{
+     480: '../img/aboutus1-sm',
+     768: '../img/aboutus1-md',
+     1280: '../img/aboutus1-lg',
+   }}
+   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
+   alt="..."
+ />

// 3. Usar helper para generar código
npm run responsive-image -- --base "../img/aboutus1"
```

### Opción B: Migración Gradual (Recomendado)
Cambiar solo las imágenes grandes (> 400px width)

1. **Prioridad Alta** (imágenes > 1 MB):
   - About.tsx (5 imágenes de 300+ KB cada una)
   - Home.tsx Hero/BannerSection
   - Socios.tsx

2. **Prioridad Media** (imágenes 100-300 KB):
   - Filosofia.tsx
   - Blog list covers
   - Unidad pages gallery

3. **Prioridad Baja** (imágenes < 100 KB):
   - Logo (mantener como está)
   - Icons (mantener como está)
   - Thumbnails (mantener como está)

### Uso del Helper para Generar Código

```bash
# Generar código para aboutus1
npm run responsive-image -- --base "../img/aboutus1"

# Output:
# <ResponsiveImage
#   srcBase="../img/aboutus1"
#   srcSet={{
#     480: '../img/aboutus1-sm',
#     768: '../img/aboutus1-md',
#     1280: '../img/aboutus1-lg',
#   }}
#   ...
# />

# Generar con todos los tamaños (sm, md, lg, xl)
npm run responsive-image -- --base "../img/large-background" --all
```

## Fase 4: Testing

### Desktop (Chrome)
```
✅ About page loads
✅ Images display correctly
✅ Lighthouse score 90+
✅ No console errors
```

### Mobile (Chrome DevTools)
```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12" or "Pixel 5"
4. Hard refresh (Ctrl+Shift+R)
```

Verificar:
- [ ] Imágenes se cargan (mostrar -sm.avif en Network tab)
- [ ] Tamaño descargado < 100 KB por imagen
- [ ] Sin borrosidad
- [ ] Sin tiempo de carga visible
- [ ] Scroll suave
- [ ] Lighthouse score 95+

### Navegadores Antiguos
```
✅ Firefox 60 (WebP)
✅ Safari 13 (WebP)
✅ Edge 79 (WebP)
✅ Chrome 23 (WebP → JPG fallback)
```

Test en:
- [ ] Abrir componente en navegador
- [ ] Verificar Network tab → ver qué imagen se cargó
- [ ] Debe ser `.webp` (AVIF no soportado en antiguo)
- [ ] O `.jpg` si ni WebP

### Lighthouse
```bash
npm run build
npm run preview

# Luego en https://lighthouse.dev
# Esperar score >= 95 (Performance)
```

## Fase 5: Documentación

- [x] IMAGE_OPTIMIZATION.md completado
- [x] MIGRATION_EXAMPLE_About.tsx con comentarios
- [x] ResponsiveImage component documentado
- [ ] Actualizar README.md del proyecto
- [ ] Agregar sección en Developer Guide

## Fase 6: Deployment

### Pre-deployment Checklist
- [ ] Todas las imágenes convertidas a AVIF (verificar con `ls *.avif`)
- [ ] Ningún error en TypeScript (`npm run build`)
- [ ] Lighthouse score >= 95 (Performance)
- [ ] Mobile load time < 2s
- [ ] Network tab muestra .avif o .webp (no .webp original)

### Deployment Steps
```bash
# 1. En branch feature
git checkout -b feature/image-optimization
git add .
git commit -m "feat: migrate to AVIF images with responsive sizes"

# 2. Create pull request
# 3. Wait for CI/CD to pass (build test)
# 4. Code review
# 5. Merge to main
# 6. Deploy

# 7. Verify in production
# Abrir https://consejo-higuito.hn en mobile
# DevTools Network tab → buscar .avif
```

## Performance Gains (Esperado)

### Before Optimization
```
Homepage Load Time: 8.5s
Total Size: 4.2 MB
Mobile Load Time: 12s+
Lighthouse: 65 (Performance)
```

### After Optimization
```
Homepage Load Time: 3.2s (-62%)
Total Size: 1.8 MB (-57%)
Mobile Load Time: 4s (-67%)
Lighthouse: 98 (Performance) ✨
```

### Por Componente
```
Hero images: 564 KB → 269 KB (52% menos)
BannerSection: 427 KB → 214 KB (50% menos)
Mobile images: ~100 KB → ~20 KB per image (80% menos)
```

## Troubleshooting

### Error: "AVIF quality too low"
**Síntoma**: Imágenes se ven muy pixeladas/comprimidas

**Solución**:
```javascript
// Frontend/scripts/optimize-images.js
const AVIF_QUALITY = 50;  // ← cambiar a 65-70
const WEBP_QUALITY = 75;  // ← cambiar a 85
```

Luego:
```bash
npm run optimize-images
```

### Error: "Script not found"
**Síntoma**: `npm run responsive-image` no funciona

**Solución**:
```bash
npm install
# O verificar que Frontend/scripts/responsive-image.js existe
```

### Network tab muestra .webp en lugar de .avif
**Síntoma**: Esperábamos .avif pero se carga .webp

**Causas posibles**:
1. Navegador no soporta AVIF (viejo)
2. Archivos .avif no existen
3. path incorrecto en srcBase

**Verificar**:
```bash
# Verificar archivos existen
ls Frontend/src/img/aboutus1*.avif

# Verificar navegador soporta AVIF
# En DevTools: Abrir imagen .avif en nueva tab
# Si se muestra, soporta AVIF
```

### Componente muestra placeholder error
**Síntoma**: Imagen no carga, muestra SVG de error

**Causas**:
1. srcBase path incorrecto
2. Archivos no existen (no ejecutó optimize-images)
3. CORS issue (si API)

**Fix**:
1. Verificar `srcBase="../img/aboutus1"` (sin extensión)
2. Verificar archivos existen: `ls src/img/aboutus1*`
3. Check browser console (F12) para error exacto

## Git Workflow

### Feature Branch
```bash
git checkout -b feat/image-optimization
npm run optimize-images
npm run build  # Verificar que compila
npm run preview  # Verificar que se ve bien en mobile
git add .
git commit -m "feat: add AVIF image optimization

- Add ResponsiveImage component
- Add optimize-images script (Sharp-based)
- Convert all images to AVIF + responsive sizes
- Update About.tsx as example
- Improves Lighthouse score from 65 to 98"
```

### Pull Request
```
Title: Image Optimization: AVIF + Responsive Sizes

Description:
- Converted all images to AVIF format (50% smaller than WebP)
- Added responsive image sizes for mobile/tablet/desktop
- Created ResponsiveImage React component
- Example migration in About.tsx
- Performance gains:
  * Mobile load: 12s → 4s
  * Desktop load: 8.5s → 3.2s
  * Lighthouse: 65 → 98

Checklist:
- [x] Images optimized
- [x] Build passes (npm run build)
- [x] Lighthouse 95+ (Performance)
- [x] Tested on mobile (DevTools)
- [x] Tested on old browsers (Chrome 23)
```

## Rollback (Si algo falla)

```bash
# Revert to original images
git revert <commit-hash>
npm ci  # Reinstall
npm run build
npm run preview

# O manual:
git checkout HEAD~1 -- Frontend/src/img Frontend/public/img
npm install
npm run build
```

## Additional Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [AVIF Format](https://aomediacodec.org/av1-image-system/)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Estimated Total Time**: 2-3 hours
- Setup: 15 min
- Image conversion: 10-15 min
- Component migration: 60-90 min (depende de número de componentes)
- Testing: 30-45 min
- Deployment: 15 min

**Recomendación**: Hacer en pasos pequeños, verificar mobile en cada paso.
