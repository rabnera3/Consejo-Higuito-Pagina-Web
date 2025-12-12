-- Script consolidado de migraciones para inicializar la base de datos
-- Orden: 001 -> 010

-- =============================
-- 001_init.sql
-- =============================
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS roles (
    id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS departments (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id TINYINT UNSIGNED NOT NULL,
    department_id SMALLINT UNSIGNED NULL,
    status ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    full_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(120) NOT NULL,
    department_id SMALLINT UNSIGNED NOT NULL,
    municipio VARCHAR(120) NULL,
    email VARCHAR(120) NULL,
    phone VARCHAR(30) NULL,
    photo_url VARCHAR(255) NULL,
    cedula VARCHAR(30) NULL,
    hire_date DATE NULL,
    vacation_days_balance SMALLINT DEFAULT 15,
    employment_status ENUM('Activa','Vacaciones','Baja') DEFAULT 'Activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vacation_requests (
    id CHAR(36) PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested SMALLINT NOT NULL,
    reason TEXT NULL,
    state ENUM('pendiente_jefe','pendiente_gerencia','pendiente_admin','aprobada','rechazada') NOT NULL DEFAULT 'pendiente_jefe',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vacation_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vacation_approvals (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vacation_request_id CHAR(36) NOT NULL,
    approved_by BIGINT UNSIGNED NOT NULL,
    role_snapshot VARCHAR(32) NOT NULL,
    action ENUM('aprobado','rechazado') NOT NULL,
    comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_approvals_request FOREIGN KEY (vacation_request_id) REFERENCES vacation_requests(id),
    CONSTRAINT fk_approvals_user FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS solicitudes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    type ENUM('Permiso','Inasistencia','Otro') NOT NULL DEFAULT 'Permiso',
    description TEXT NULL,
    state ENUM('Pendiente','Aprobada','Rechazada') NOT NULL DEFAULT 'Pendiente',
    requested_at DATE NOT NULL,
    resolved_at DATE NULL,
    CONSTRAINT fk_solicitudes_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    excerpt VARCHAR(255) NULL,
    body MEDIUMTEXT NOT NULL,
    cover_image VARCHAR(255) NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    status ENUM('draft','published','archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_blog_user FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles (slug, name) VALUES
    ('admin', 'Administrador'),
    ('gerente', 'Gerente'),
    ('jefe', 'Jefe de Unidad'),
    ('empleado', 'Empleado') AS new
ON DUPLICATE KEY UPDATE name = new.name;

-- =============================
-- 002_update_emails.sql
-- =============================
START TRANSACTION;
SET @new_hash := '$2y$10$NdDtHSDAukWB5.NJtgaIz.Uz9Pb4ypgfVb9slH6Q2u8K9AqkUvFxi';
SET @old_hash := '$2y$10$TuiL3A1OurX0dmq1dbjtS.zGvdzGUusvcehppjuGcuuIBkopdNcPO';
UPDATE users SET email = 'direccion@cih.hn', password_hash = @new_hash WHERE email = 'direccion@higuito.local';
UPDATE users SET email = 'gerente@cih.hn', password_hash = @new_hash WHERE email = 'gerencia@higuito.local';
UPDATE users SET email = 'jefe@cih.hn', password_hash = @new_hash WHERE email = 'jefe.planificacion@higuito.local';
UPDATE users SET email = 'tecnico@cih.hn', password_hash = @new_hash WHERE email = 'tecnico.ambiente@higuito.local';
UPDATE users SET email = 'empleado@cih.hn', password_hash = @new_hash WHERE email = 'empleado@higuito.local';
DELETE u1 FROM users u1
JOIN users u2 ON u1.email = u2.email AND u1.id < u2.id;
COMMIT;

-- =============================
-- 003_create_planificacion_table.sql
-- =============================
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
ALTER TABLE planificacion_semanal COMMENT = 'Registro de actividades semanales planificadas por empleado';

-- =============================
-- 004_update_blog_posts_table.sql
-- =============================
SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'blog_posts'
        AND table_schema = DATABASE()
        AND column_name = 'category'
    ) > 0,
    "SELECT 'La columna category ya existe' AS msg",
    "ALTER TABLE blog_posts ADD COLUMN category VARCHAR(50) NULL AFTER status"
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'blog_posts'
        AND table_schema = DATABASE()
        AND column_name = 'tags'
    ) > 0,
    "SELECT 'La columna tags ya existe' AS msg",
    "ALTER TABLE blog_posts ADD COLUMN tags TEXT NULL AFTER category"
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'blog_posts'
        AND table_schema = DATABASE()
        AND column_name = 'video_url'
    ) > 0,
    "SELECT 'La columna video_url ya existe' AS msg",
    "ALTER TABLE blog_posts ADD COLUMN video_url VARCHAR(255) NULL AFTER cover_image"
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'blog_posts'
        AND table_schema = DATABASE()
        AND column_name = 'department_id'
    ) > 0,
    "SELECT 'La columna department_id ya existe' AS msg",
    "ALTER TABLE blog_posts ADD COLUMN department_id INT NULL AFTER author_id"
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @s = (SELECT IF(
    (SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = 'blog_posts'
        AND table_schema = DATABASE()
        AND column_name = 'published_date'
    ) > 0,
    "SELECT 'La columna published_date ya existe' AS msg",
    "ALTER TABLE blog_posts ADD COLUMN published_date DATE NULL AFTER published_at"
));
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE blog_posts bp
INNER JOIN employees e ON bp.author_id = e.id
SET bp.department_id = e.department_id
WHERE bp.department_id IS NULL;

-- =============================
-- 005_update_planificacion_enums.sql
-- =============================
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

-- =============================
-- 006_backfill_incomplete_data.sql
-- =============================
UPDATE planificacion_semanal
SET duracion = '8 horas'
WHERE duracion IS NULL OR duracion = '';

UPDATE planificacion_semanal
SET lugar = 'Oficina'
WHERE lugar IS NULL OR lugar = '';

UPDATE planificacion_semanal
SET sector_trabajo = 'Trabajo de oficina'
WHERE sector_trabajo IS NULL OR sector_trabajo = '';

UPDATE planificacion_semanal
SET area = 'N/A'
WHERE area IS NULL OR area = '';

UPDATE planificacion_semanal
SET recursos = 'Ninguno'
WHERE recursos IS NULL OR recursos = '';

UPDATE planificacion_semanal
SET linea_servicio = 'Gestión de Información Territorial'
WHERE linea_servicio IS NULL OR linea_servicio = '';

-- =============================
-- 007_add_profile_fields_to_employees.sql
-- =============================
ALTER TABLE employees
ADD COLUMN address TEXT NULL AFTER phone,
ADD COLUMN emergency_contact_name VARCHAR(255) NULL AFTER address,
ADD COLUMN emergency_contact_phone VARCHAR(50) NULL AFTER emergency_contact_name;

-- =============================
-- 007_create_notifications_table.sql
-- =============================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON DEFAULT NULL,
    read_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- =============================
-- 008_add_birth_date_gender_to_employees.sql
-- =============================
ALTER TABLE employees ADD COLUMN birth_date DATE NULL;
ALTER TABLE employees ADD COLUMN gender VARCHAR(20) NULL;

-- =============================
-- 009_create_requests_table.sql
-- =============================
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    type ENUM('vacaciones', 'permiso', 'insumos', 'otro') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending_approval', 'pending_authorization', 'approved', 'rejected') DEFAULT 'pending_approval',
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- =============================
-- 010_create_field_tables.sql
-- =============================
CREATE TABLE IF NOT EXISTS visit_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    project_name VARCHAR(255) NULL,
    location VARCHAR(255) NOT NULL,
    visit_date DATE NOT NULL,
    objectives TEXT NOT NULL,
    findings TEXT NOT NULL,
    agreements TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS visit_report_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_report_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_report_id) REFERENCES visit_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS field_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NOT NULL,
    project_name VARCHAR(255) NULL,
    log_date DATE NOT NULL,
    activity_description TEXT NOT NULL,
    observations TEXT NULL,
    weather_conditions VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
