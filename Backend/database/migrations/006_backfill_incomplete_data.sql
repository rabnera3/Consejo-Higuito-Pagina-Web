-- Backfill incomplete data with default values

-- Update duracion
UPDATE planificacion_semanal 
SET duracion = '8 horas' 
WHERE duracion IS NULL OR duracion = '';

-- Update lugar
UPDATE planificacion_semanal 
SET lugar = 'Oficina' 
WHERE lugar IS NULL OR lugar = '';

-- Update sector_trabajo
UPDATE planificacion_semanal 
SET sector_trabajo = 'Trabajo de oficina' 
WHERE sector_trabajo IS NULL OR sector_trabajo = '';

-- Update area
UPDATE planificacion_semanal 
SET area = 'N/A' 
WHERE area IS NULL OR area = '';

-- Update recursos
UPDATE planificacion_semanal 
SET recursos = 'Ninguno' 
WHERE recursos IS NULL OR recursos = '';

-- Update linea_servicio
UPDATE planificacion_semanal 
SET linea_servicio = 'Gestión de Información Territorial' 
WHERE linea_servicio IS NULL OR linea_servicio = '';
