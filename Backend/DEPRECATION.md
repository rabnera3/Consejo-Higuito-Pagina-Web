# Deprecación de la Interfaz Legacy (Backend)

La antigua capa visual basada en múltiples archivos HTML y scripts planos dentro de `Backend/` (por ejemplo `panel-gerente.html`, `dashboard.html`, `empleados.html`) ha sido reemplazada por el portal React ubicado en `Frontend/`.

## Alcance
- Los archivos HTML legacy se conservan solo como referencia temporal.
- No se aceptan nuevas funcionalidades UI en esta carpeta.
- Los estilos y componentes deben desarrollarse en `Frontend/src/`.

## Razones de la Migración
1. **Arquitectura moderna**: React + TypeScript permiten reutilización, pruebas y escalabilidad.
2. **Separación de responsabilidades**: El backend Slim provee APIs REST/JSON; el frontend consume y renderiza.
3. **Build optimizado**: Vite genera bundles eficientes, con soporte para code splitting y hot reload.
4. **Mantenibilidad**: Un único origen de verdad para roles, navegación y estado (AuthContext).

## Qué Hacer Ahora
| Necesidad | Acción |
|-----------|-------|
| Nuevo endpoint de datos | Implementar ruta en `routes/api.php` y controlador en `src/Controllers` |
| Ajuste visual | Modificar componente React correspondiente en `Frontend/src/` |
| Cambio en lógica de roles | Actualizar contexto/auth/utilidades en el frontend y, si aplica, claims en API |
| Semilla de datos demo | Actualizar scripts en `database/seeds` |
| Estilos globales | Editar `Frontend/src/styles/*.css` |

## Plan de Retiro
1. Marcar los HTML legacy como obsoletos con banners comentados.
2. Verificar que ningún flujo de autenticación redirija a `Backend/*.html`.
3. Remover archivos legacy tras confirmar cobertura de funcionalidades en el SPA.

## Convenio de Rutas API
Ejemplos propuestos (pendiente de implementación/ajuste):
- `GET /api/empleados` -> Lista de empleados (paginación futura `?page=`)
- `GET /api/unidades` -> Unidades/Departamentos
- `POST /api/solicitudes` -> Crear solicitud (vacaciones, permiso)
- `GET /api/solicitudes?estado=pending` -> Filtrar estado

Estructura JSON debe ser estable; versionar cambios significativos (`/api/v1/...`).

## Buenas Prácticas
- Usar `password_hash` y `password_verify` para credenciales reales.
- Centralizar validaciones y sanitización (middleware Slim).
- CORS mínimo; preferir same-origin cuando el frontend se despliegue bajo el mismo dominio.

---
**Última actualización:** Migración documentada el 2025-11-23.
