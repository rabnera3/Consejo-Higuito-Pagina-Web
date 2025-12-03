# Consejo Intermunicipal Higuito - Sitio Web

Sitio web oficial del Consejo Intermunicipal Higuito, organización que promueve el desarrollo sostenible y la gestión ambiental en la región de Santa Rosa de Copán, Honduras.

## 🚀 Comenzar

### Prerequisitos

- Node.js 18+ instalado
- npm, pnpm o yarn

### Instalación

1. Clonar el repositorio
2. Instalar las dependencias:

```bash
npm install
```

### Desarrollo

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:5173`

### Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Vista Previa de Producción

```bash
npm run preview
```

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework UI con code splitting y lazy loading
- **TypeScript** - Tipado estático
- **Vite 6** - Build tool y dev server ultrarrápido
- **Tailwind CSS 3** - Framework CSS utility-first
- **Framer Motion** - Animaciones fluidas y performantes
- **React Router 6** - Navegación SPA
- **Radix UI** - Componentes accesibles y sin estilos
- **Lucide React** - Íconos modernos

## 📁 Estructura del Proyecto

```
project/
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes UI reutilizables (shadcn/ui)
│   │   ├── figma/        # Componentes auxiliares
│   │   ├── Navbar.tsx    # Navegación principal
│   │   ├── Footer.tsx    # Footer minimal
│   │   └── ...           # Secciones de homepage
│   ├── pages/            # Páginas del sitio (lazy-loaded)
│   │   ├── Home.tsx      # Página de inicio
│   │   ├── About.tsx     # Nosotros
│   │   ├── Unidad*.tsx   # Páginas de unidades (8)
│   │   ├── Blog.tsx      # Listado de blog
│   │   ├── BlogPost.tsx  # Post individual
│   │   └── Contacto.tsx  # Contacto y descargas
│   ├── data/             # Fuentes de datos
│   │   └── blogPosts.ts  # Posts del blog
│   ├── types/            # Tipos TypeScript
│   ├── styles/           # Estilos globales
│   ├── img/              # Imágenes locales
│   ├── App.tsx           # Componente principal con rutas
│   └── main.tsx          # Punto de entrada
├── public/               # Archivos estáticos
├── dist/                 # Build output (generado)
└── index.html            # HTML base
```

## 🌐 Páginas y Rutas

- `/` - Inicio
- `/nosotros` - Acerca del CIH
- `/nosotros/filosofia` - Filosofía institucional
- `/nosotros/socios` - Socios y alianzas
- `/nosotros/calidad` - Sistemas de calidad
- `/unidades/ambiente` - Unidad de Recursos Naturales y Medio Ambiente
- `/unidades/ordenamiento` - Unidad de Ordenamiento Territorial
- `/unidades/fortalecimiento` - Unidad de Fortalecimiento Municipal
- `/unidades/desarrollo-economico` - Unidad de Desarrollo Económico
- `/unidades/infraestructura` - Unidad de Infraestructura Social
- `/unidades/planificacion` - Unidad de Planificación Estratégica
- `/unidades/san` - Unidad de Seguridad Alimentaria y Nutricional
- `/unidades/monitoreo` - Unidad de Monitoreo y Seguimiento
- `/lineas-servicio` - Líneas de Servicio del CIH
- `/blog` - Blog institucional
- `/blog/:slug` - Post individual del blog
- `/contacto` - Contacto y descargas

## ⚡ Optimizaciones

- **Code Splitting**: Todas las páginas se cargan bajo demanda (React.lazy)
- **Vendor Chunking**: Librerías separadas en chunks (react, router, motion, radix, lucide)
- **Tree Shaking**: Eliminación de código no utilizado
- **Image Optimization**: Compresión automática de imágenes estáticas
- **CSS Purging**: Tailwind elimina clases no usadas en producción

## 🎨 Diseño

- Patrón de diseño unificado en todas las páginas de Unidades
- Gradientes y animaciones consistentes
- Componentes reutilizables de shadcn/ui
- Footer minimal y limpio
- Responsive design mobile-first

## 📝 Blog

El sistema de blog usa una fuente de datos local (`src/data/blogPosts.ts`) con:
- Interface TypeScript para posts
- Filtros por categoría
- Sidebar con posts recientes, archivos y categorías
- Soporte para contenido HTML y videos embebidos
- Botones de compartir en redes sociales

## 📞 Contacto

**Consejo Intermunicipal Higuito**

- 📍 Santa Rosa de Copán, Colonia Centenario, 2da calle, 5ta avenida
- 📧 info@consejohiguito.hn
- ☎️ +504 2662-6682 / +504 2662-6610 / +504 2662-7035

## 📄 Licencia

Copyright © 2025 Consejo Intermunicipal Higuito. Todos los derechos reservados.
