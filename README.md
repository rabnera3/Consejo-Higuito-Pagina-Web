# Consejo Intermunicipal Higuito — Sitio Web + Portal Interno

Monorepo con:

- **Frontend**: React + TypeScript + Vite (sitio público + portal interno).
- **Backend**: PHP (Slim) + MariaDB/MySQL (API + autenticación por sesión).

Guía de uso del portal: ver [GUIA_USUARIO_PORTAL.md](GUIA_USUARIO_PORTAL.md).

---

## Estructura

- `Frontend/`: SPA (público + `/portal/*`).
- `Backend/`: API y servicios (`/api/*`).
- `imagenes_consejohiguito/`: repositorio de imágenes fuente.

---

## Requisitos

- Node.js 18+
- PHP 7.4+ (recomendado 8.x)
- Composer 2
- MariaDB/MySQL 10+

---

## Quickstart (desarrollo)

### 1) Base de datos

Opción A (fresh install “todo en uno”):

- Ejecutar: `Backend/database/migrations/000_full_schema.sql`

Opción B (por archivos):

- Ejecutar: `Backend/database/migrations/001_init.sql`
- (Opcional) Ejecutar seeds demo:
  - `Backend/database/seeds/demo_seed.sql` (local)
  - `Backend/database/seeds/full_demo_seed.sql` (más completo)

Roles vigentes: `admin`, `gerente`/`gerencia`, `jefe`/`jefatura`, `empleado`.

### 2) Backend (API)

```bash
cd Backend
composer install
composer start
```

Servidor: `http://localhost:8080`

Variables esperadas (si usas `.env`):

- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=cih_backend`
- `DB_USERNAME=<tu_usuario>`
- `DB_PASSWORD=<tu_password>`

### 3) Frontend (sitio + portal)

```bash
cd Frontend
npm install
npm run dev
```

Sitio: `http://localhost:5173`

Portal: `http://localhost:5173/portal/login`

---

## Operación del Portal (resumen)

- **Directorio**: consulta de empleados.
- **Planificación**: planificación semanal (vista lista y semanal).
- **Solicitudes**: creación y aprobación por etapas (jefatura → gerencia → administración).
- **Blogs**: creación y pendientes (roles con permiso según menú del portal).

Detalle paso a paso: ver [GUIA_USUARIO_PORTAL.md](GUIA_USUARIO_PORTAL.md).
