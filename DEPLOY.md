# 🚀 Guía de Despliegue - Consejo Intermunicipal Higuito

Esta guía explica cómo desplegar la aplicación completa (Frontend + Backend + Base de Datos) en Hostinger u otro proveedor de hosting compartido.

---

## 📋 Requisitos Previos

### En tu máquina local:
- Node.js 18+ instalado
- PHP 8.1+ instalado
- Composer instalado
- Git instalado

### En el hosting:
- PHP 8.1 o superior
- MySQL 5.7+ o MariaDB 10.3+
- Soporte para `.htaccess` (mod_rewrite habilitado)
- Acceso FTP o File Manager
- SSL/HTTPS habilitado (recomendado)

---

## 📁 Estructura de Archivos en el Servidor

```
public_html/
├── index.html          ← Frontend (React)
├── assets/             ← JS, CSS compilados
├── .htaccess           ← Redirecciones SPA
└── api/                ← Backend (PHP)
    ├── index.php
    ├── .htaccess
    ├── uploads/
    └── ...
```

**Alternativa con subdominio:**
```
public_html/           ← Frontend
api.tudominio.com/     ← Backend (subdominio separado)
```

---

## 🗄️ Paso 1: Configurar Base de Datos

### 1.1 Crear base de datos en Hostinger

1. Ir a **hPanel** → **Bases de datos** → **MySQL**
2. Crear nueva base de datos:
   - Nombre: `u123456789_higuito` (ejemplo)
   - Usuario: `u123456789_admin`
   - Contraseña: (generar una segura)
3. **Guardar** estas credenciales

### 1.2 Importar esquema de la base de datos

1. Ir a **phpMyAdmin** desde hPanel
2. Seleccionar la base de datos creada
3. Ir a **Importar**
4. Subir el archivo: `Backend/database/migrations/000_full_schema.sql`
5. Ejecutar la importación

### 1.3 (Opcional) Importar datos de demostración

```sql
-- Ejecutar en phpMyAdmin si necesitas datos de prueba
SOURCE Backend/database/seeds/full_demo_seed.sql;
```

---

## ⚙️ Paso 2: Configurar Backend (PHP)

### 2.1 Crear archivo de configuración

Crear archivo `Backend/.env` con las credenciales de producción:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456789_higuito
DB_USERNAME=u123456789_admin
DB_PASSWORD=TuContraseñaSegura123!

# Configuración de la aplicación
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tudominio.com

# JWT Secret (generar uno único)
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura-de-al-menos-32-caracteres

# CORS - dominios permitidos
CORS_ORIGIN=https://tudominio.com
```

> ⚠️ **Importante**: Nunca subas el archivo `.env` a Git. Créalo directamente en el servidor.

### 2.2 Generar JWT Secret seguro

Ejecutar en terminal local para generar un secret:
```bash
php -r "echo bin2hex(random_bytes(32));"
```

### 2.3 Subir archivos del Backend

**Opción A - Via FTP:**
1. Conectar con FileZilla u otro cliente FTP
2. Subir carpeta `Backend/` a `public_html/api/` o directorio deseado

**Opción B - Via File Manager:**
1. Comprimir carpeta `Backend/` en ZIP
2. Subir via File Manager
3. Extraer en el servidor

### 2.4 Estructura final del Backend

```
public_html/api/
├── .env                 ← Configuración (crear en servidor)
├── .htaccess            ← Ya incluido
├── index.php            ← Punto de entrada
├── composer.json
├── bootstrap/
├── config/
├── database/
├── routes/
├── src/
└── vendor/              ← Dependencias PHP
```

### 2.5 Instalar dependencias PHP

Si tienes acceso SSH:
```bash
cd public_html/api
composer install --no-dev --optimize-autoloader
```

Si NO tienes SSH:
- Ejecutar `composer install` localmente
- Subir la carpeta `vendor/` completa

### 2.6 Configurar permisos

```bash
# Si tienes SSH
chmod -R 755 public_html/api
chmod -R 777 public_html/api/public/uploads
```

Si no tienes SSH, usar File Manager para dar permisos 755/777.

---

## 🎨 Paso 3: Configurar Frontend (React)

### 3.1 Crear archivo de entorno de producción

Crear `Frontend/.env.production`:

```env
VITE_API_BASE=https://tudominio.com/api
```

> Ajustar la URL según dónde esté tu backend

### 3.2 Construir el Frontend

```bash
cd Frontend
npm install
npm run build
```

Esto generará la carpeta `dist/` con:
- `index.html`
- `assets/` (JS, CSS, imágenes)
- `.htaccess` (configurado para SPA)

### 3.3 Subir archivos del Frontend

Subir **el contenido** de `Frontend/dist/` a `public_html/`:

```
public_html/
├── index.html
├── assets/
│   ├── *.js
│   ├── *.css
│   └── *.avif
└── .htaccess
```

> ⚠️ Subir el **contenido** de dist/, no la carpeta dist/ en sí.

---

## 🔒 Paso 4: Configurar SSL/HTTPS

### En Hostinger:
1. Ir a **hPanel** → **SSL**
2. Activar **SSL Gratuito** (Let's Encrypt)
3. Esperar propagación (puede tomar 10-30 minutos)

### Forzar HTTPS (agregar a .htaccess del Frontend):

```apache
# Forzar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## ✅ Paso 5: Verificación

### 5.1 Probar Frontend
1. Visitar `https://tudominio.com`
2. Verificar que carga la página principal
3. Navegar entre páginas (verificar que no da 404)

### 5.2 Probar Backend
1. Visitar `https://tudominio.com/api/health` (si existe endpoint)
2. O probar login desde el frontend

### 5.3 Probar Base de Datos
1. Intentar login con usuario de prueba
2. Verificar que los datos se cargan correctamente

---

## 🔧 Solución de Problemas

### Error 500 en Backend
```apache
# Agregar a .htaccess para ver errores
php_flag display_errors on
php_value error_reporting E_ALL
```

### Rutas SPA no funcionan (404 en refresh)
Verificar que `.htaccess` está presente y `mod_rewrite` está habilitado.

### CORS errors
Verificar que `CORS_ORIGIN` en `.env` del backend coincide exactamente con el dominio del frontend.

### Imágenes AVIF no cargan
Verificar que el servidor tiene el tipo MIME configurado:
```apache
AddType image/avif .avif
```

### Error de conexión a BD
- Verificar credenciales en `.env`
- En Hostinger, el host suele ser `localhost` o `127.0.0.1`
- Verificar que el usuario tiene permisos sobre la base de datos

### Uploads no funcionan
```bash
chmod 777 public_html/api/public/uploads
chmod 777 public_html/api/public/uploads/blog
chmod 777 public_html/api/public/uploads/profiles
```

---

## 📝 Checklist de Despliegue

- [ ] Base de datos creada en hosting
- [ ] Esquema SQL importado
- [ ] Backend subido a `/api/`
- [ ] `.env` del backend configurado con credenciales
- [ ] `composer install` ejecutado (o vendor/ subido)
- [ ] Permisos de carpeta uploads configurados
- [ ] Frontend construido con `npm run build`
- [ ] Contenido de `dist/` subido a `public_html/`
- [ ] SSL/HTTPS activado
- [ ] Probado login y navegación
- [ ] Probado carga de imágenes y datos

---

## 🔄 Actualizaciones Futuras

### Actualizar Frontend:
```bash
cd Frontend
npm run build
# Subir contenido de dist/ reemplazando archivos
```

### Actualizar Backend:
```bash
# Subir archivos modificados (excepto .env y uploads/)
# Si hay nuevas dependencias:
composer install --no-dev
```

### Migraciones de BD:
```bash
# Ejecutar nuevos archivos SQL en phpMyAdmin
# Backend/database/migrations/XXX_nueva_migracion.sql
```

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs de error en hPanel → Logs
2. Verificar configuración de PHP (versión 8.1+)
3. Contactar soporte de Hostinger para temas de servidor

---

**Última actualización:** Diciembre 2024
