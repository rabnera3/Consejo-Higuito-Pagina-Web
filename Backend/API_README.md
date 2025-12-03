# API Backend - Consejo Intermunicipal Higuito

## Descripción

Backend convertido a API REST para servir al frontend React. Endpoints JSON.

## Configuración

1. Instalar dependencias:
```bash
composer install
```

2. Configurar `.env`:
```env
DB_HOST=localhost
DB_NAME=cih_db
DB_USER=root
DB_PASS=
APP_DEBUG=true
APP_TIMEZONE=America/Tegucigalpa
```

3. Iniciar servidor:
```bash
composer start
```

El servidor correrá en `http://localhost:8080`

## Endpoints API

### Autenticación

#### POST `/api/auth/login`
Iniciar sesión con credenciales.

**Request Body:**
```json
{
  "email": "gerente@cih.hn",
  "password": "12345"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "user": {
    "id": 1,
    "email": "gerente@cih.hn",
    "nombre": "Usuario Gerente",
    "role": "gerente"
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

#### POST `/api/auth/logout`
Cerrar sesión (requiere autenticación).

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

#### GET `/api/auth/me`
Obtener datos del usuario autenticado.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "gerente@cih.hn",
    "nombre": "Usuario Gerente",
    "role": "gerente"
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Usuario no autenticado"
}
```

---

### Empleados

#### GET `/api/empleados`
Listar empleados con filtros opcionales (requiere autenticación).

**Query Parameters:**
- `q` (opcional): Búsqueda por nombre
- `municipio` (opcional): Filtrar por municipio
- `departamento` (opcional): Filtrar por departamento
- `sort` (opcional): Orden (`az`, `za`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "jperez@cih.hn",
        "municipio": "Gracias",
        "departamento": "Planificación"
      }
    ],
    "filters": {
      "municipios": ["Gracias", "La Esperanza"],
      "departamentos": ["Planificación", "SAN"]
    }
  }
}
```

---

#### GET `/api/empleados/{id}`
Obtener detalles de un empleado específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "message": "Endpoint en desarrollo"
  }
}
```

---

## CORS

El middleware CORS permite peticiones desde:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:3000`
- `http://127.0.0.1:5173`

Para producción, agregar dominios en `src/Middleware/CorsMiddleware.php`.

## Sesiones

La autenticación se maneja mediante sesiones PHP. El frontend debe enviar cookies en las peticiones usando `credentials: 'include'` en fetch.

