# Backend PHP (Slim + MariaDB)

Motor de API y servicios. La interfaz visual (portal interno y login) fue migrada al proyecto `Frontend/` (React + Vite). Los antiguos HTML/JS estáticos en `Backend/` están DEPRECADOS.

> Nota: Lee `DEPRECATION.md` para detalles de la transición y qué archivos no deben modificarse ya.

## Requisitos

- PHP 7.4+
- Composer 2
- MariaDB/MySQL 10+

## Instalación

```bash
cd Backend
composer install
```


## Migraciones y datos demo

Ejecuta los scripts directamente en tu instancia MariaDB para crear el esquema y los usuarios de prueba:

```sql
SOURCE database/migrations/001_init.sql;
SOURCE database/seeds/demo_seed.sql;
```

La contraseña de todos los usuarios demo es `demo123`.

| Rol        | Nombre             | Usuario / Correo                   |
|------------|--------------------|------------------------------------|
| Admin      | María Fernández    | `direccion@cih.hn`                 |
| Gerencia   | Luis Alvarado      | `gerente@cih.hn`                   |
| Jefa       | Karla Picado       | `jefe@cih.hn`                      |
| Técnico    | Bruno Salas        | `tecnico@cih.hn`                   |
| Empleado   | Ana Solano         | `empleado@cih.hn`                  |

## Servidor local

```bash
cd Backend
composer start
```

Se levanta `http://localhost:8080` apuntando al front controller `public/index.php`.

## Próximos pasos

1. Crear usuarios reales en la tabla `users` con contraseña `password_hash` (usa `password_hash('demo123 Exponer endpoints REST/JSON estables para consumo del portal React (`/api/empleados`, `/api/unidades`, `/api/solicitudes`, etc.).
3. Mantener `public/` como document root en producción y ejecutar `composer install --no-dev` en el servidor.