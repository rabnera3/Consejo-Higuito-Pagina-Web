# Consejo Intermunicipal Higuito — Sitio Web + Portal Interno

Monorepo con:

- **Frontend**: React + TypeScript + Vite (sitio público + portal interno).
- **Backend**: PHP (Slim) + MariaDB/MySQL (API + autenticación por sesión).

---

## Estructura

- `Frontend/`: SPA (público + `/portal/*`).
- `Backend/`: API y servicios (`/api/*`).

---

## Requisitos

- Node.js 18+
- PHP 8.x (recomendado 8.1+)
- Composer 2
- MariaDB/MySQL 10+

---

## Quickstart (desarrollo)

### 1) Base de datos

Ejecutar el archivo de estructura completo:

```bash
mysql -u usuario -p nombre_bd < Backend/database/structure.sql
```

Este archivo crea todas las tablas, roles

Roles vigentes: `admin`, `gerente`, `jefe`, `empleado`.

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
