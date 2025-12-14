-- Estructura Definitiva de la Base de Datos
-- Fecha: 14 de Diciembre, 2025
-- Este archivo unifica todas las migraciones anteriores (000-014) en una sola estructura limpia.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- =============================================================================
-- 1. Tablas Principales (Roles, Departamentos, Usuarios, Empleados)
-- =============================================================================

-- Tabla: roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
    `id` TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(32) NOT NULL UNIQUE,
    `name` VARCHAR(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: departments
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
    `id` SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `description` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role_id` TINYINT UNSIGNED NOT NULL,
    `department_id` SMALLINT UNSIGNED NULL,
    `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
    CONSTRAINT `fk_users_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: employees
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `job_title` VARCHAR(120) NOT NULL,
    `department_id` SMALLINT UNSIGNED NOT NULL,
    `municipio` VARCHAR(120) NULL,
    `email` VARCHAR(120) NULL,
    `phone` VARCHAR(30) NULL,
    `address` TEXT NULL,
    `emergency_contact_name` VARCHAR(255) NULL,
    `emergency_contact_phone` VARCHAR(50) NULL,
    `photo_url` VARCHAR(255) NULL,
    `cedula` VARCHAR(30) NULL,
    `hire_date` DATE NULL,
    `birth_date` DATE NULL,
    `gender` VARCHAR(20) NULL,
    `vacation_days_balance` SMALLINT DEFAULT 15,
    `employment_status` ENUM('Activa','Vacaciones','Baja') DEFAULT 'Activa',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    CONSTRAINT `fk_employees_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. Tablas de Contenido y Planificación
-- =============================================================================

-- Tabla: blog_posts
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(160) NOT NULL UNIQUE,
    `excerpt` VARCHAR(255) NULL,
    `body` MEDIUMTEXT NOT NULL,
    `cover_image` VARCHAR(255) NULL,
    `video_url` VARCHAR(255) NULL,
    `author_id` BIGINT UNSIGNED NOT NULL,
    `department_id` INT NULL,
    `status` ENUM('draft','published','archived') DEFAULT 'draft',
    `category` VARCHAR(50) NULL,
    `tags` TEXT NULL,
    `published_at` TIMESTAMP NULL,
    `published_date` DATE NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_blog_user` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: planificacion_semanal
DROP TABLE IF EXISTS `planificacion_semanal`;
CREATE TABLE `planificacion_semanal` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `empleado_id` BIGINT UNSIGNED NOT NULL,
    `fecha` DATE NOT NULL,
    `lugar` ENUM(
        'Belen Gualcho Ocotepeque', 'Corquin Copán', 'Cucuyagua Copán', 'Dolores Copán',
        'La Unión Copán', 'San Agustín Copán', 'San José Copán', 'Trinidad Copán',
        'Veracruz Copán', 'Talgua Lempira', 'Santa Rosa de Copán', 'San Pedro Copán',
        'Concepción Copán', 'San Juan de Opoa Copán', 'Oficina', 'Vacaciones',
        'Otro Municipio', 'Permiso'
    ) NOT NULL,
    `sector_trabajo` ENUM('Trabajo de oficina', 'Trabajo de casa', 'Visita al municipio') NOT NULL,
    `area` ENUM('Urbana', 'Rural', 'N/A') DEFAULT 'N/A',
    `recursos` ENUM('Salón', 'Vehículo', 'Materiales', 'Equipo', 'Ninguno') DEFAULT 'Ninguno',
    `linea_servicio` ENUM(
        'Asistencia Técnica para el Desarrollo de Capacidades',
        'Acompañamiento en instrumentos de planificacion y normativa',
        'Formulación de Estudios',
        'Gestión de Información Territorial',
        'Promoción, Socialización y Sencibilización',
        'Capacitación',
        'Gestion de Programas -Proyectos'
    ) NOT NULL,
    `duracion` VARCHAR(100),
    `descripcion` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_planificacion_employee` FOREIGN KEY (`empleado_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE,
    INDEX `idx_empleado` (`empleado_id`),
    INDEX `idx_fecha` (`fecha`),
    INDEX `idx_sector` (`sector_trabajo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `planificacion_semanal` COMMENT = 'Registro de actividades semanales planificadas por empleado';

-- =============================================================================
-- 3. Tablas de Solicitudes y Notificaciones
-- =============================================================================

-- Tabla: notifications
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `data` JSON DEFAULT NULL,
    `read_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
);
CREATE INDEX `idx_notifications_user_id` ON `notifications`(`user_id`);
CREATE INDEX `idx_notifications_read_at` ON `notifications`(`read_at`);

-- Tabla: requests (Unificada)
DROP TABLE IF EXISTS `requests`;
CREATE TABLE `requests` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `employee_id` BIGINT UNSIGNED NOT NULL,
    `type` ENUM('vacaciones', 'permiso', 'insumos', 'vehiculo', 'otro') NOT NULL,
    `description` TEXT NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `status` ENUM('pending_approval', 'pending_authorization', 'pending_admin', 'approved', 'rejected') NOT NULL DEFAULT 'pending_approval',
    `rejection_reason` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
);

-- Tablas Legacy (Mantenidas por compatibilidad si existen datos, considerar migrar a requests)
-- vacation_requests
DROP TABLE IF EXISTS `vacation_requests`;
CREATE TABLE `vacation_requests` (
    `id` CHAR(36) PRIMARY KEY,
    `employee_id` BIGINT UNSIGNED NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `days_requested` SMALLINT NOT NULL,
    `reason` TEXT NULL,
    `state` ENUM('pendiente_jefe','pendiente_gerencia','pendiente_admin','aprobada','rechazada') NOT NULL DEFAULT 'pendiente_jefe',
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_vacation_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- vacation_approvals
DROP TABLE IF EXISTS `vacation_approvals`;
CREATE TABLE `vacation_approvals` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `vacation_request_id` CHAR(36) NOT NULL,
    `approved_by` BIGINT UNSIGNED NOT NULL,
    `role_snapshot` VARCHAR(32) NOT NULL,
    `action` ENUM('aprobado','rechazado') NOT NULL,
    `comment` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_approvals_request` FOREIGN KEY (`vacation_request_id`) REFERENCES `vacation_requests`(`id`),
    CONSTRAINT `fk_approvals_user` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- solicitudes
DROP TABLE IF EXISTS `solicitudes`;
CREATE TABLE `solicitudes` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `employee_id` BIGINT UNSIGNED NOT NULL,
    `type` ENUM('Permiso','Inasistencia','Otro') NOT NULL DEFAULT 'Permiso',
    `description` TEXT NULL,
    `state` ENUM('Pendiente','Aprobada','Rechazada') NOT NULL DEFAULT 'Pendiente',
    `requested_at` DATE NOT NULL,
    `resolved_at` DATE NULL,
    CONSTRAINT `fk_solicitudes_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 4. Datos Iniciales (Seeds)
-- =============================================================================

-- Roles 
INSERT INTO `roles` (`slug`, `name`) VALUES
    ('admin', 'Administrador'),
    ('gerente', 'Gerente'),
    ('jefe', 'Jefe de Unidad'),
    ('empleado', 'Empleado')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

SET foreign_key_checks = 1;
