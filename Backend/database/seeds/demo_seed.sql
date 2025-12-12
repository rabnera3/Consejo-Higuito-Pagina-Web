-- Datos de ejemplo para desarrollo local
START TRANSACTION;

-- Departamentos base (solo se crean si no existen)
INSERT INTO departments (name, description)
SELECT 'Dirección Ejecutiva', 'Coordinación general y enlace con las municipalidades.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Dirección Ejecutiva');
SET @dir_ejecutiva_id := (SELECT id FROM departments WHERE name = 'Dirección Ejecutiva' LIMIT 1);

INSERT INTO departments (name, description)
SELECT 'Unidad de Planificación', 'Gestión de proyectos, POA y seguimiento de indicadores.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Unidad de Planificación');
SET @planificacion_id := (SELECT id FROM departments WHERE name = 'Unidad de Planificación' LIMIT 1);

INSERT INTO departments (name, description)
SELECT 'Unidad de Infraestructura', 'Obras, adquisiciones y control de proyectos físicos.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Unidad de Infraestructura');
SET @infraestructura_id := (SELECT id FROM departments WHERE name = 'Unidad de Infraestructura' LIMIT 1);

INSERT INTO departments (name, description)
SELECT 'Unidad Ambiental', 'Monitoreo ambiental y gestión de cuencas.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Unidad Ambiental');
SET @ambiental_id := (SELECT id FROM departments WHERE name = 'Unidad Ambiental' LIMIT 1);

INSERT INTO departments (name, description)
SELECT 'Unidad de Fortalecimiento Municipal', 'Capacitación, talento humano y soporte administrativo.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Unidad de Fortalecimiento Municipal');
SET @fortalecimiento_id := (SELECT id FROM departments WHERE name = 'Unidad de Fortalecimiento Municipal' LIMIT 1);

INSERT INTO departments (name, description)
SELECT 'Recursos Naturales y Ambiente', 'Gestión integral de recursos naturales y adaptación climática.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Recursos Naturales y Ambiente');

INSERT INTO departments (name, description)
SELECT 'Ordenamiento Territorial', 'Planificación del uso del suelo y normativas territoriales.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Ordenamiento Territorial');

INSERT INTO departments (name, description)
SELECT 'Fortalecimiento Institucional', 'Programas de gobernanza, transparencia y capacidades organizacionales.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Fortalecimiento Institucional');

INSERT INTO departments (name, description)
SELECT 'Desarrollo Económico', 'Impulso a emprendimientos, cadenas de valor y empleo local.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Desarrollo Económico');

INSERT INTO departments (name, description)
SELECT 'Infraestructura Social', 'Construcción y mantenimiento de equipamiento comunitario.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Infraestructura Social');

INSERT INTO departments (name, description)
SELECT 'Planificación Territorial', 'Integración de datos territoriales y formulación de planes maestros.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Planificación Territorial');

INSERT INTO departments (name, description)
SELECT 'Seguridad Alimentaria y Nutricional', 'Programas para garantizar acceso y disponibilidad de alimentos.'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Seguridad Alimentaria y Nutricional');

-- Roles (deben existir por la migración inicial)
SET @role_admin_id := (SELECT id FROM roles WHERE slug = 'admin' LIMIT 1);
SET @role_gerente_id := (SELECT id FROM roles WHERE slug = 'gerente' LIMIT 1);
SET @role_jefe_id := (SELECT id FROM roles WHERE slug = 'jefe' LIMIT 1);
SET @role_empleado_id := (SELECT id FROM roles WHERE slug = 'empleado' LIMIT 1);

SET @demo_password := '$2y$10$NdDtHSDAukWB5.NJtgaIz.Uz9Pb4ypgfVb9slH6Q2u8K9AqkUvFxi';

-- Usuarios de prueba (todos comparten la contraseña demo123)
INSERT INTO users (name, email, password_hash, role_id, department_id, status)
VALUES
    ('María Fernández', 'direccion@higuito.local', @demo_password, @role_admin_id, @dir_ejecutiva_id, 'active'),
    ('Luis Alvarado', 'gerencia@higuito.local', @demo_password, @role_gerente_id, @dir_ejecutiva_id, 'active'),
    ('Karla Picado', 'jefe.planificacion@higuito.local', @demo_password, @role_jefe_id, @planificacion_id, 'active'),
    ('Bruno Salas', 'tecnico.ambiente@higuito.local', @demo_password, @role_empleado_id, @ambiental_id, 'active'),
    ('Ana Solano', 'empleado@higuito.local', @demo_password, @role_empleado_id, @fortalecimiento_id, 'active') AS new
ON DUPLICATE KEY UPDATE
    name = new.name,
    password_hash = new.password_hash,
    role_id = new.role_id,
    department_id = new.department_id,
    status = new.status;

SET @user_admin_id := (SELECT id FROM users WHERE email = 'direccion@higuito.local' LIMIT 1);
SET @user_gerente_id := (SELECT id FROM users WHERE email = 'gerencia@higuito.local' LIMIT 1);
SET @user_jefe_id := (SELECT id FROM users WHERE email = 'jefe.planificacion@higuito.local' LIMIT 1);
SET @user_tecnico_id := (SELECT id FROM users WHERE email = 'tecnico.ambiente@higuito.local' LIMIT 1);
SET @user_empleado_id := (SELECT id FROM users WHERE email = 'empleado@higuito.local' LIMIT 1);

-- Expedientes de empleados enlazados al usuario (ID estable para permitir re-ejecución)
INSERT INTO employees (id, user_id, full_name, job_title, department_id, municipio, email, phone, hire_date, vacation_days_balance)
VALUES
    (@user_admin_id, @user_admin_id, 'María Fernández', 'Directora Ejecutiva', @dir_ejecutiva_id, 'Pérez Zeledón', 'direccion@higuito.local', '+506 5550 1001', '2017-01-10', 20),
    (@user_gerente_id, @user_gerente_id, 'Luis Alvarado', 'Gerente General', @dir_ejecutiva_id, 'Pérez Zeledón', 'gerencia@higuito.local', '+506 5550 1002', '2018-04-05', 18),
    (@user_jefe_id, @user_jefe_id, 'Karla Picado', 'Jefa de Planificación', @planificacion_id, 'Buenos Aires', 'jefe.planificacion@higuito.local', '+506 5550 1003', '2019-02-14', 16),
    (@user_tecnico_id, @user_tecnico_id, 'Bruno Salas', 'Técnico Ambiental', @ambiental_id, 'Coto Brus', 'tecnico.ambiente@higuito.local', '+506 5550 1004', '2020-08-24', 12),
    (@user_empleado_id, @user_empleado_id, 'Ana Solano', 'Analista Administrativo', @fortalecimiento_id, 'Dota', 'empleado@higuito.local', '+506 5550 1005', '2021-05-17', 15) AS new
ON DUPLICATE KEY UPDATE
    job_title = new.job_title,
    department_id = new.department_id,
    municipio = new.municipio,
    email = new.email,
    phone = new.phone,
    vacation_days_balance = new.vacation_days_balance;

COMMIT;
