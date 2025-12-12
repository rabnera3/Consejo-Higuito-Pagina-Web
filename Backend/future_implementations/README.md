# Implementaciones Futuras

Esta carpeta contiene scripts y funcionalidades que están planificadas para ser implementadas en el futuro o que requieren configuración adicional del servidor (como Cron Jobs).

## Notificaciones de Cumpleaños Semanales

**Archivo:** `cron_weekly_birthdays.php`

Este script está diseñado para ejecutarse automáticamente una vez a la semana (por ejemplo, los lunes a las 8:00 AM).

### Funcionalidad:
1.  Calcula el rango de fechas de la semana actual (Lunes a Domingo).
2.  Busca empleados activos que cumplan años dentro de ese rango.
3.  Genera un mensaje de resumen con los cumpleañeros.
4.  Envía una notificación interna a **todos** los empleados activos.

### Cómo configurar (Producción):

**En Linux (Crontab):**
```bash
# Editar crontab
crontab -e

# Agregar la siguiente línea para ejecutar cada lunes a las 8:00 AM
0 8 * * 1 /usr/bin/php /ruta/al/proyecto/Backend/future_implementations/cron_weekly_birthdays.php >> /var/log/cron_birthdays.log 2>&1
```

**En Windows (Programador de Tareas):**
1.  Crear una nueva tarea básica.
2.  Desencadenador: Semanalmente (Lunes).
3.  Acción: Iniciar un programa.
    *   Programa/Script: `php.exe` (o la ruta completa a php.exe)
    *   Argumentos: `C:\ruta\al\proyecto\Backend\future_implementations\cron_weekly_birthdays.php`

### Requisitos Previos:
*   Asegurarse de que las dependencias de Composer estén instaladas (`vendor/autoload.php`).
*   Configurar correctamente el archivo `bootstrap/app.php` si se mueve el script de ubicación.
