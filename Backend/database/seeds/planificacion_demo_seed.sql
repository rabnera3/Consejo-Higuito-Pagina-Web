-- Seed: planificacion_demo_seed.sql
-- Datos demo para la planificación semanal

-- Limpiar tabla si existe
DELETE FROM planificacion_semanal WHERE id > 0;

-- Resetear auto_increment
ALTER TABLE planificacion_semanal AUTO_INCREMENT = 1;

-- Obtener la fecha del lunes de esta semana
SET @hoy = CURDATE();
SET @lunes = DATE_SUB(@hoy, INTERVAL (WEEKDAY(@hoy)) DAY);
SET @martes = DATE_ADD(@lunes, INTERVAL 1 DAY);
SET @miercoles = DATE_ADD(@lunes, INTERVAL 2 DAY);
SET @jueves = DATE_ADD(@lunes, INTERVAL 3 DAY);
SET @viernes = DATE_ADD(@lunes, INTERVAL 4 DAY);

-- Obtener IDs de empleados (emails actuales de la BD)
SET @emp_admin := (SELECT id FROM employees WHERE email = 'direccion@higuito.local' LIMIT 1);
SET @emp_gerente := (SELECT id FROM employees WHERE email = 'gerencia@higuito.local' LIMIT 1);
SET @emp_jefe := (SELECT id FROM employees WHERE email = 'jefe.planificacion@higuito.local' LIMIT 1);
SET @emp_tecnico := (SELECT id FROM employees WHERE email = 'tecnico.ambiente@higuito.local' LIMIT 1);
SET @emp_empleado := (SELECT id FROM employees WHERE email = 'empleado@higuito.local' LIMIT 1);

-- Verificar que las variables tengan valores (descomentar para debug)
-- SELECT @emp_admin, @emp_gerente, @emp_jefe, @emp_tecnico, @emp_empleado;

-- Solo insertar si el empleado existe
-- Planificación para Directora Ejecutiva (completa - 5 días)
INSERT INTO planificacion_semanal (empleado_id, fecha, lugar, sector_trabajo, area, recursos, linea_servicio, duracion, descripcion)
SELECT @emp_admin, @lunes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Dirección Estratégica', '8 horas', 'Revisión de POA anual y seguimiento a indicadores de gestión institucional'
WHERE @emp_admin IS NOT NULL
UNION ALL
SELECT @emp_admin, @martes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Salón', 'Coordinación Institucional', '8 horas', 'Reunión con jefes de unidad para seguimiento mensual de proyectos'
WHERE @emp_admin IS NOT NULL
UNION ALL
SELECT @emp_admin, @miercoles, 'PÉREZ ZELEDÓN', 'Visita al municipio', 'Urbana', 'Vehículo', 'Gestión Municipal', '6 horas', 'Reunión con alcalde municipal para presentación de proyectos 2026'
WHERE @emp_admin IS NOT NULL
UNION ALL
SELECT @emp_admin, @jueves, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Administración', '8 horas', 'Revisión de estados financieros y aprobación de gastos mensuales'
WHERE @emp_admin IS NOT NULL
UNION ALL
SELECT @emp_admin, @viernes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información', '8 horas', 'Preparación de informe trimestral para junta directiva del consejo'
WHERE @emp_admin IS NOT NULL;

-- Planificación para Gerente General (parcial - 3 días, faltan 2)
INSERT INTO planificacion_semanal (empleado_id, fecha, lugar, sector_trabajo, area, recursos, linea_servicio, duracion, descripcion)
SELECT @emp_gerente, @lunes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión Financiera', '8 horas', 'Análisis de presupuesto y proyección de gastos del trimestre'
WHERE @emp_gerente IS NOT NULL
UNION ALL
SELECT @emp_gerente, @martes, 'BUENOS AIRES', 'Visita al municipio', 'Urbana', 'Vehículo', 'Coordinación Regional', '6 horas', 'Reunión con autoridades municipales para seguimiento de convenios'
WHERE @emp_gerente IS NOT NULL
UNION ALL
SELECT @emp_gerente, @miercoles, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Recursos Humanos', '8 horas', 'Revisión de planilla y evaluación de desempeño del personal'
WHERE @emp_gerente IS NOT NULL;

-- Planificación para Jefa de Planificación (parcial - 2 días, faltan 3)
INSERT INTO planificacion_semanal (empleado_id, fecha, lugar, sector_trabajo, area, recursos, linea_servicio, duracion, descripcion)
SELECT @emp_jefe, @lunes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Planificación Estratégica', '8 horas', 'Actualización de matriz de planificación operativa anual (POA)'
WHERE @emp_jefe IS NOT NULL
UNION ALL
SELECT @emp_jefe, @jueves, 'COTO BRUS', 'Visita al municipio', 'Rural', 'Vehículo', 'Seguimiento de Proyectos', '8 horas', 'Supervisión de avance de proyecto de desarrollo comunitario'
WHERE @emp_jefe IS NOT NULL;

-- Planificación para Técnico Ambiental (completa - 5 días)
INSERT INTO planificacion_semanal (empleado_id, fecha, lugar, sector_trabajo, area, recursos, linea_servicio, duracion, descripcion)
SELECT @emp_tecnico, @lunes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión Ambiental', '8 horas', 'Elaboración de informe mensual de monitoreo de cuencas hidrográficas'
WHERE @emp_tecnico IS NOT NULL
UNION ALL
SELECT @emp_tecnico, @martes, 'BUENOS AIRES', 'Visita al municipio', 'Rural', 'Vehículo', 'Monitoreo Ambiental', '8 horas', 'Inspección de proyecto de reforestación en microcuenca Río Grande'
WHERE @emp_tecnico IS NOT NULL
UNION ALL
SELECT @emp_tecnico, @miercoles, 'COTO BRUS', 'Visita al municipio', 'Rural', 'Vehículo', 'Educación Ambiental', '6 horas', 'Taller de educación ambiental con grupos comunitarios'
WHERE @emp_tecnico IS NOT NULL
UNION ALL
SELECT @emp_tecnico, @jueves, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Análisis Técnico', '8 horas', 'Análisis de calidad de agua y preparación de informes técnicos'
WHERE @emp_tecnico IS NOT NULL
UNION ALL
SELECT @emp_tecnico, @viernes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Planificación Ambiental', '8 horas', 'Diseño de plan de manejo de residuos sólidos para la región'
WHERE @emp_tecnico IS NOT NULL;

-- Planificación para Analista Administrativo (crítico - solo 1 día, faltan 4)
INSERT INTO planificacion_semanal (empleado_id, fecha, lugar, sector_trabajo, area, recursos, linea_servicio, duracion, descripcion)
SELECT @emp_empleado, @lunes, 'OFICINA', 'Trabajo de oficina', 'N/A', 'Equipo', 'Administración', '8 horas', 'Procesamiento de documentación administrativa y archivo digital'
WHERE @emp_empleado IS NOT NULL;

-- Verificar resultados
SELECT 
    COUNT(*) as total_registros,
    COUNT(DISTINCT empleado_id) as empleados_con_planificacion,
    MIN(fecha) as fecha_inicio,
    MAX(fecha) as fecha_fin
FROM planificacion_semanal;

SELECT 
    e.full_name,
    e.job_title,
    COUNT(p.id) as dias_planificados,
    (5 - COUNT(p.id)) as dias_pendientes,
    CASE 
        WHEN COUNT(p.id) = 5 THEN '✓ Completa'
        WHEN COUNT(p.id) >= 3 THEN '⚠ Parcial'
        WHEN COUNT(p.id) >= 1 THEN '⚠ Crítico'
        ELSE '✗ Sin planificar'
    END as estado
FROM employees e
LEFT JOIN planificacion_semanal p ON e.id = p.empleado_id 
    AND p.fecha BETWEEN @lunes AND @viernes
GROUP BY e.id, e.full_name, e.job_title
ORDER BY dias_planificados ASC;
