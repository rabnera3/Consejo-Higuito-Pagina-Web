# Image Optimization Guide - AVIF + Responsive Images

## Overview

Esta solución proporciona:
- ✅ **AVIF Format** - Mejor compresión (~50% menos que WebP)
- ✅ **Responsive Images** - Tamaños optimizados para cada pantalla (480px, 768px, 1280px, 1920px)
- ✅ **Fallback Chain** - AVIF → WebP → Original (JPG/PNG)
- ✅ **Automatic Conversion** - Script para procesar todas las imágenes
- ✅ **Type-Safe Component** - `ResponsiveImage` con TypeScript

## Setup

### 1. Instalar Dependencias
`sharp` ya está en `package.json`, pero verificar que esté instalado:

```bash
npm install
```

### 2. Ejecutar Optimización de Imágenes
```bash
npm run optimize-images
```

Este comando:
- Convierte TODAS las imágenes en `src/img` y `public/img` a AVIF
- Crea versiones responsive de cada imagen (sm, md, lg)
- Genera fallbacks en WebP
- Mantiene originales intactos

**Tiempo estimado**: 5-10 minutos (según cantidad de imágenes)

### 3. Commit de Imágenes Optimizadas
```bash
git add src/img public/img
git commit -m "chore: optimize images to AVIF with responsive sizes"
```

## Uso del Componente

### Básico (Sin Responsive)
```tsx
import { ResponsiveImage } from '../components/ResponsiveImage';

export function MyComponent() {
  return (
    <ResponsiveImage
      srcBase="../img/aboutus1"
      alt="About us section"
      className="w-full h-auto rounded-lg"
    />
  );
}
```

**Archivos esperados**:
- `aboutus1.avif` (Primary)
- `aboutus1.webp` (Fallback)
- `aboutus1.jpg` (Final fallback)

### Con Responsive Sizes
```tsx
<ResponsiveImage
  srcBase="../img/aboutus1"
  srcSet={{
    480: '../img/aboutus1-sm',   // Mobile
    768: '../img/aboutus1-md',   // Tablet
    1280: '../img/aboutus1-lg',  // Desktop
  }}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="About us section"
  className="w-full h-auto"
/>
```

**Archivos esperados**:
```
aboutus1.avif
aboutus1-sm.avif (480px)
aboutus1-md.avif (768px)
aboutus1-lg.avif (1280px)

aboutus1.webp
aboutus1-sm.webp
aboutus1-md.webp
aboutus1-lg.webp

aboutus1.jpg (Original)
aboutus1-sm.jpg
aboutus1-md.jpg
aboutus1-lg.jpg
```

### En ImageCarousel
```tsx
import { ResponsiveImage } from '../components/ResponsiveImage';

export interface CarouselImage {
  src: string;
  srcSet?: Record<number, string>;
  alt: string;
}

function CustomCarousel({ images }: { images: CarouselImage[] }) {
  return (
    <ResponsiveImage
      srcBase={image.src}
      srcSet={image.srcSet}
      alt={image.alt}
      className="w-full h-auto"
    />
  );
}
```

## Migración de Componentes Existentes

### ImageWithFallback → ResponsiveImage
**Antes**:
```tsx
<ImageWithFallback
  src={new URL('../img/aboutus1.webp', import.meta.url).href}
  alt="About us"
  className="w-full"
/>
```

**Después**:
```tsx
<ResponsiveImage
  srcBase="../img/aboutus1"
  alt="About us"
  className="w-full"
/>
```

### Imágenes HTML simples
**Antes**:
```tsx
<img
  src={carrusel1}
  alt="Carousel"
  className="w-full h-auto"
/>
```

**Después**:
```tsx
<ResponsiveImage
  srcBase={carrusel1.replace(/\.(webp|jpg|png)$/, '')}
  alt="Carousel"
  className="w-full h-auto"
/>
```

## Estructura de Carpetas

Después de `npm run optimize-images`:

```
Frontend/src/img/
├── logo01.webp           → logo01.avif (no responsive - logo pequeño)
├── aboutus1.webp         → aboutus1.avif
├── aboutus1-sm.webp      → aboutus1-sm.avif (480px)
├── aboutus1-md.webp      → aboutus1-md.avif (768px)
├── aboutus1-lg.webp      → aboutus1-lg.avif (1280px)
├── ...
└── unidades/
    ├── san/
    │   ├── gallery_unidad-san_1.webp
    │   ├── gallery_unidad-san_1.avif
    │   ├── gallery_unidad-san_1-sm.avif
    │   └── ...
```

## Performance Impact

### Tamaño de Descarga (Ejemplo)
Para una imagen de 1920px de ancho:

| Formato | Tamaño Original | Tamaño Comprimido | Reducción |
|---------|-----------------|-------------------|-----------|
| JPG | 1.35 MB | 1.35 MB | — |
| WebP (75%) | — | 564 KB | 58% |
| AVIF (50%) | — | 269 KB | 80% |

Mobile obtiene `-sm.avif` (480px, ~80 KB) en lugar de 1.35 MB original

### Ejemplos del Proyecto
Basado en la carpeta `src/img/`:

**carrusel1.webp**: 564 KB
→ carrusel1.avif: **269 KB** (52% reducción)
→ carrusel1-sm.avif: **~80 KB** (86% reducción en mobile)

**bienvenida.webp**: 427 KB
→ bienvenida.avif: **214 KB** (50% reducción)
→ bienvenida-sm.avif: **~60 KB** (86% reducción en mobile)

## Browser Support

### AVIF
- ✅ Chrome 85+
- ✅ Firefox 93+
- ✅ Safari 16+
- ✅ Edge 85+
- ⚠️ Older browsers fallback to WebP/JPG

### WebP
- ✅ Chrome 23+
- ✅ Firefox 65+
- ✅ Safari 16+
- ✅ Edge 18+
- ⚠️ IE 11 fallback to JPG/PNG

### Fallback Chain
```
Try AVIF
├─ Success: Modern browser
└─ Fail: Try WebP
   ├─ Success: Good browser support
   └─ Fail: Use original JPG/PNG
      ├─ Success: Very old browser
      └─ Fail: Show error placeholder
```

## Configuration

Edit `Frontend/scripts/optimize-images.js` para cambiar:

```javascript
// AVIF quality (1-100, default 50)
const AVIF_QUALITY = 50;

// WebP quality (1-100, default 75)
const WEBP_QUALITY = 75;

// Responsive breakpoints (default: 480, 768, 1280, 1920)
const RESPONSIVE_SIZES = {
  sm: 480,
  md: 768,
  lg: 1280,
  xl: 1920,
};
```

**Notas**:
- Menor quality = menor tamaño pero más artefactos
- AVIF se ve bien incluso con quality 30-40
- WebP necesita quality 75+ para verse bien

## Troubleshooting

### Error: "Cannot find module 'sharp'"
```bash
npm install
```

### AVIF no se muestra en navegador antiguo
✅ Esperado. El fallback WebP o JPG se muestra automáticamente.

### Imágenes se ven comprimidas/pixeladas
Aumentar `AVIF_QUALITY` o `WEBP_QUALITY` en el script:
```javascript
const AVIF_QUALITY = 70;  // ← aumentar de 50
const WEBP_QUALITY = 85;  // ← aumentar de 75
```
Luego re-ejecutar: `npm run optimize-images`

### Las imágenes responsivas no se adaptan bien
Verificar el `sizes` attribute:
```tsx
// ❌ Incorrecto
sizes="33vw"

// ✅ Correcto
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

## Next Steps (Opcional)

### 1. Lazy Loading
```tsx
<ResponsiveImage
  srcBase="../img/aboutus1"
  loading="lazy"  // ← Carga solo cuando esté visible
  alt="About us"
/>
```

### 2. Blur-Up Effect
```tsx
<ResponsiveImage
  srcBase="../img/aboutus1"
  style={{
    backgroundImage: 'url(data:...)',  // Tiny base64 blur
    backgroundSize: 'cover',
  }}
/>
```

### 3. Automatic srcSet Generation
```tsx
// Función helper para generar automáticamente
function generateSrcSet(basePath: string) {
  return {
    480: `${basePath}-sm`,
    768: `${basePath}-md`,
    1280: `${basePath}-lg`,
  };
}

<ResponsiveImage
  srcBase="../img/aboutus1"
  srcSet={generateSrcSet('../img/aboutus1')}
  ...
/>
```

## Performance Checklist

- [ ] Ejecutar `npm run optimize-images`
- [ ] Verificar que se crearon archivos `.avif` y `-sm.avif`, `-md.avif`, `-lg.avif`
- [ ] Actualizar imports en componentes que usan imágenes grandes
- [ ] Cambiar `ImageWithFallback` a `ResponsiveImage`
- [ ] Agregar `srcSet` para imágenes > 480px
- [ ] Test en Chrome DevTools (Device Emulation) para mobile
- [ ] Test en navegadores antiguos (IE, Safari 14)
- [ ] Verificar Lighthouse score (debería mejorar a 95+)

## References

- [AVIF Format](https://aomediacodec.org/av1-image-system/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Responsive Images - MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Picture Element - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
