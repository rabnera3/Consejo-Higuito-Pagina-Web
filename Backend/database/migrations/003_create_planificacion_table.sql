-- Migration: 003_create_planificacion_table.sql
-- Tabla de Planificación Semanal para el Consejo Intermunicipal Higuito

CREATE TABLE IF NOT EXISTS planificacion_semanal (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT UNSIGNED NOT NULL,
    fecha DATE NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    sector_trabajo VARCHAR(255) NOT NULL,
    area ENUM('N/A', 'Urbana', 'Rural') DEFAULT 'N/A',
    recursos ENUM('Ninguno', 'Vehículo', 'Salón', 'Equipo') DEFAULT 'Ninguno',
    linea_servicio VARCHAR(255) NOT NULL,
    duracion VARCHAR(100),
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_planificacion_employee FOREIGN KEY (empleado_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_empleado (empleado_id),
    INDEX idx_fecha (fecha),
    INDEX idx_sector (sector_trabajo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar comentarios
ALTER TABLE planificacion_semanal COMMENT = 'Registro de actividades semanales planificadas por empleado';
