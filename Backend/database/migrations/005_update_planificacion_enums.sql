-- Migration: 005_update_planificacion_enums.sql
-- Actualizar tabla de Planificación Semanal con ENUMs estrictos

ALTER TABLE planificacion_semanal
MODIFY COLUMN lugar ENUM(
    'Belen Gualcho Ocotepeque', 
    'Corquin Copán', 
    'Cucuyagua Copán', 
    'Dolores Copán', 
    'La Unión Copán', 
    'San Agustín Copán', 
    'San José Copán', 
    'Trinidad Copán', 
    'Veracruz Copán', 
    'Talgua Lempira', 
    'Santa Rosa de Copán', 
    'San Pedro Copán', 
    'Concepción Copán', 
    'San Juan de Opoa Copán', 
    'Oficina', 
    'Vacaciones', 
    'Otro Municipio', 
    'Permiso'
) NOT NULL,
MODIFY COLUMN sector_trabajo ENUM(
    'Trabajo de oficina', 
    'Trabajo de casa', 
    'Visita al municipio'
) NOT NULL,
MODIFY COLUMN area ENUM(
    'Urbana', 
    'Rural', 
    'N/A'
) DEFAULT 'N/A',
MODIFY COLUMN recursos ENUM(
    'Salón', 
    'Vehículo', 
    'Materiales', 
    'Equipo', 
    'Ninguno'
) DEFAULT 'Ninguno',
MODIFY COLUMN linea_servicio ENUM(
    'Asistencia Técnica para el Desarrollo de Capacidades', 
    'Acompañamiento en instrumentos de planificacion y normativa', 
    'Formulación de Estudios', 
    'Gestión de Información Territorial', 
    'Promoción, Socialización y Sencibilización', 
    'Capacitación', 
    'Gestion de Programas -Proyectos'
) NOT NULL;
