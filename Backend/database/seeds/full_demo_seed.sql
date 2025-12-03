-- Seed de datos completos para entorno de desarrollo CIH
-- Ejecutar después de correr todas las migraciones.
-- Este script limpia tablas clave y rellena datos de muestra coherentes.

START TRANSACTION;

-- =====================================================
-- Limpiar tablas dependientes (orden seguro por FK)
-- =====================================================
DELETE FROM visit_report_photos;
DELETE FROM visit_reports;
DELETE FROM field_logs;
DELETE FROM requests;
DELETE FROM notifications;
DELETE FROM planificacion_semanal;
DELETE FROM vacation_approvals;
DELETE FROM vacation_requests;
DELETE FROM solicitudes;
DELETE FROM blog_posts;
DELETE FROM employees;
DELETE FROM users;
DELETE FROM departments;

ALTER TABLE departments AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE employees AUTO_INCREMENT = 1;
ALTER TABLE blog_posts AUTO_INCREMENT = 1;
ALTER TABLE solicitudes AUTO_INCREMENT = 1;
ALTER TABLE vacation_approvals AUTO_INCREMENT = 1;
ALTER TABLE planificacion_semanal AUTO_INCREMENT = 1;
ALTER TABLE notifications AUTO_INCREMENT = 1;
ALTER TABLE requests AUTO_INCREMENT = 1;
ALTER TABLE visit_reports AUTO_INCREMENT = 1;
ALTER TABLE visit_report_photos AUTO_INCREMENT = 1;
ALTER TABLE field_logs AUTO_INCREMENT = 1;

-- =====================================================
-- Catálogos base
-- =====================================================
INSERT INTO departments (name, description) VALUES
    ('Dirección Ejecutiva', 'Coordinación general, enlace institucional y supervisión estratégica.'),
    ('Unidad de Planificación', 'Gestión de POA, indicadores y formulación de proyectos.'),
    ('Unidad de Infraestructura', 'Gestión de obras físicas e interventoría técnica.'),
    ('Unidad Ambiental', 'Monitoreo ambiental, manejo de cuencas y educación ambiental.'),
    ('Unidad de Fortalecimiento Municipal', 'Capacitación, recursos humanos y soporte administrativo.'),
    ('Recursos Naturales y Ambiente', 'Gestión integral de recursos naturales y adaptación climática.'),
    ('Ordenamiento Territorial', 'Planificación del uso del suelo y normativas territoriales.'),
    ('Fortalecimiento Institucional', 'Gobernanza, transparencia y fortalecimiento organizacional.'),
    ('Desarrollo Económico', 'Impulso a emprendimientos, cadenas de valor y empleo local.'),
    ('Infraestructura Social', 'Construcción y mantenimiento de equipamiento comunitario.'),
    ('Planificación Territorial', 'Integración de datos y formulación de planes maestros territoriales.'),
    ('Seguridad Alimentaria y Nutricional', 'Garantizar acceso y disponibilidad de alimentos en el territorio.');

SET @dept_direccion := (SELECT id FROM departments WHERE name = 'Dirección Ejecutiva' LIMIT 1);
SET @dept_planificacion := (SELECT id FROM departments WHERE name = 'Unidad de Planificación' LIMIT 1);
SET @dept_infra := (SELECT id FROM departments WHERE name = 'Unidad de Infraestructura' LIMIT 1);
SET @dept_ambiental := (SELECT id FROM departments WHERE name = 'Unidad Ambiental' LIMIT 1);
SET @dept_fortalecimiento := (SELECT id FROM departments WHERE name = 'Unidad de Fortalecimiento Municipal' LIMIT 1);
SET @dept_recursos := (SELECT id FROM departments WHERE name = 'Recursos Naturales y Ambiente' LIMIT 1);
SET @dept_ordenamiento := (SELECT id FROM departments WHERE name = 'Ordenamiento Territorial' LIMIT 1);
SET @dept_fort_inst := (SELECT id FROM departments WHERE name = 'Fortalecimiento Institucional' LIMIT 1);
SET @dept_desarrollo := (SELECT id FROM departments WHERE name = 'Desarrollo Económico' LIMIT 1);
SET @dept_infra_social := (SELECT id FROM departments WHERE name = 'Infraestructura Social' LIMIT 1);
SET @dept_plan_territorial := (SELECT id FROM departments WHERE name = 'Planificación Territorial' LIMIT 1);
SET @dept_seguridad := (SELECT id FROM departments WHERE name = 'Seguridad Alimentaria y Nutricional' LIMIT 1);

SET @role_admin := (SELECT id FROM roles WHERE slug = 'admin' LIMIT 1);
SET @role_gerente := (SELECT id FROM roles WHERE slug = 'gerente' LIMIT 1);
SET @role_jefe := (SELECT id FROM roles WHERE slug = 'jefe' LIMIT 1);
SET @role_tecnico := (SELECT id FROM roles WHERE slug = 'tecnico' LIMIT 1);
SET @role_empleado := (SELECT id FROM roles WHERE slug = 'empleado' LIMIT 1);

SET @demo_password := '$2y$10$NdDtHSDAukWB5.NJtgaIz.Uz9Pb4ypgfVb9slH6Q2u8K9AqkUvFxi';
SET @now := NOW();

-- =====================================================
-- Usuarios básicos
-- =====================================================
INSERT INTO users (name, email, password_hash, role_id, department_id, status, created_at, updated_at) VALUES
    ('María Fernández', 'direccion@cih.hn', @demo_password, @role_admin, @dept_direccion, 'active', @now, @now),
    ('Luis Alvarado', 'gerente@cih.hn', @demo_password, @role_gerente, @dept_direccion, 'active', @now, @now),
    ('Karla Picado', 'jefe@cih.hn', @demo_password, @role_jefe, @dept_planificacion, 'active', @now, @now),
    ('Bruno Salas', 'tecnico@cih.hn', @demo_password, @role_tecnico, @dept_ambiental, 'active', @now, @now),
    ('Ana Solano', 'empleado@cih.hn', @demo_password, @role_empleado, @dept_fortalecimiento, 'active', @now, @now);

SET @user_admin := (SELECT id FROM users WHERE email = 'direccion@cih.hn' LIMIT 1);
SET @user_gerente := (SELECT id FROM users WHERE email = 'gerente@cih.hn' LIMIT 1);
SET @user_jefe := (SELECT id FROM users WHERE email = 'jefe@cih.hn' LIMIT 1);
SET @user_tecnico := (SELECT id FROM users WHERE email = 'tecnico@cih.hn' LIMIT 1);
SET @user_empleado := (SELECT id FROM users WHERE email = 'empleado@cih.hn' LIMIT 1);

-- =====================================================
-- Expedientes de empleados (uno a uno con usuarios)
-- =====================================================
INSERT INTO employees (
    id,
    user_id,
    full_name,
    job_title,
    department_id,
    municipio,
    email,
    phone,
    photo_url,
    cedula,
    hire_date,
    vacation_days_balance,
    employment_status,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    birth_date,
    gender,
    created_at,
    updated_at
) VALUES
    (@user_admin, @user_admin, 'María Fernández', 'Directora Ejecutiva', @dept_direccion, 'Santa Rosa de Copán', 'direccion@cih.hn', '+504 3200-1001', '/uploads/profiles/admin.jpg', '0501-1982-00123', '2017-01-10', 20, 'Activa', 'Barrio El Centro, Santa Rosa de Copán', 'Jorge Fernández', '+504 3200-9001', '1982-03-17', 'Femenino', @now, @now),
    (@user_gerente, @user_gerente, 'Luis Alvarado', 'Gerente General', @dept_direccion, 'San Pedro Copán', 'gerente@cih.hn', '+504 3200-1002', '/uploads/profiles/gerente.jpg', '0405-1980-00045', '2018-04-05', 18, 'Activa', 'Col. Las Flores, San Pedro Copán', 'Paola Díaz', '+504 3200-9002', '1980-07-08', 'Masculino', @now, @now),
    (@user_jefe, @user_jefe, 'Karla Picado', 'Jefa de Planificación', @dept_planificacion, 'Trinidad Copán', 'jefe@cih.hn', '+504 3200-1003', '/uploads/profiles/jefa.jpg', '0312-1986-00456', '2019-02-14', 16, 'Activa', 'Barrio La Gruta, Trinidad Copán', 'Rosa Picado', '+504 3200-9003', '1986-09-21', 'Femenino', @now, @now),
    (@user_tecnico, @user_tecnico, 'Bruno Salas', 'Técnico Ambiental', @dept_ambiental, 'Corquin Copán', 'tecnico@cih.hn', '+504 3200-1004', '/uploads/profiles/tecnico.jpg', '0507-1991-00234', '2020-08-24', 12, 'Activa', 'Barrio Suyapa, Corquin Copán', 'María Salas', '+504 3200-9004', '1991-11-12', 'Masculino', @now, @now),
    (@user_empleado, @user_empleado, 'Ana Solano', 'Analista Administrativo', @dept_fortalecimiento, 'Veracruz Copán', 'empleado@cih.hn', '+504 3200-1005', '/uploads/profiles/analista.jpg', '0603-1994-00654', '2021-05-17', 15, 'Activa', 'Residencial El Bosque, Veracruz Copán', 'Carlos Solano', '+504 3200-9005', '1994-01-29', 'Femenino', @now, @now);

SET @emp_admin := (SELECT id FROM employees WHERE email = 'direccion@cih.hn' LIMIT 1);
SET @emp_gerente := (SELECT id FROM employees WHERE email = 'gerente@cih.hn' LIMIT 1);
SET @emp_jefe := (SELECT id FROM employees WHERE email = 'jefe@cih.hn' LIMIT 1);
SET @emp_tecnico := (SELECT id FROM employees WHERE email = 'tecnico@cih.hn' LIMIT 1);
SET @emp_empleado := (SELECT id FROM employees WHERE email = 'empleado@cih.hn' LIMIT 1);

-- =====================================================
-- Solicitudes internas
-- =====================================================
INSERT INTO solicitudes (employee_id, type, description, state, requested_at, resolved_at) VALUES
    (@emp_empleado, 'Permiso', 'Permiso de medio día para diligencias personales.', 'Aprobada', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
    (@emp_tecnico, 'Inasistencia', 'Reporte de inasistencia por visita de campo extendida.', 'Pendiente', DATE_SUB(CURDATE(), INTERVAL 2 DAY), NULL);

-- =====================================================
-- Vacaciones y aprobaciones
-- =====================================================
INSERT INTO vacation_requests (id, employee_id, start_date, end_date, days_requested, reason, state, submitted_at, last_updated) VALUES
    ('11111111-1111-1111-1111-111111111111', @emp_jefe, DATE_ADD(CURDATE(), INTERVAL 14 DAY), DATE_ADD(CURDATE(), INTERVAL 19 DAY), 5, 'Vacaciones planificadas posterior al cierre del POA.', 'aprobada', DATE_SUB(CURDATE(), INTERVAL 3 DAY), @now),
    ('22222222-2222-2222-2222-222222222222', @emp_empleado, DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 33 DAY), 3, 'Visita familiar fuera del municipio.', 'pendiente_admin', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY));

INSERT INTO vacation_approvals (vacation_request_id, approved_by, role_snapshot, action, comment, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', @user_gerente, 'gerente', 'aprobado', 'Planificación confirmada por gerencia.', @now),
    ('11111111-1111-1111-1111-111111111111', @user_admin, 'admin', 'aprobado', 'Aprobación final dirección ejecutiva.', @now),
    ('22222222-2222-2222-2222-222222222222', @user_jefe, 'jefe', 'aprobado', 'Revisión de jefatura completada, pendiente administración.', @now);

-- =====================================================
-- Planificación semanal actual
-- =====================================================
SET @hoy := CURDATE();
SET @lunes := DATE_SUB(@hoy, INTERVAL WEEKDAY(@hoy) DAY);
SET @martes := DATE_ADD(@lunes, INTERVAL 1 DAY);
SET @miercoles := DATE_ADD(@lunes, INTERVAL 2 DAY);
SET @jueves := DATE_ADD(@lunes, INTERVAL 3 DAY);
SET @viernes := DATE_ADD(@lunes, INTERVAL 4 DAY);

INSERT INTO planificacion_semanal (empleado_id, fecha, lugar, sector_trabajo, area, recursos, linea_servicio, duracion, descripcion) VALUES
    (@emp_admin, @lunes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información Territorial', '8 horas', 'Revisión integral de indicadores y POA institucional.'),
    (@emp_admin, @martes, 'Santa Rosa de Copán', 'Visita al municipio', 'Urbana', 'Vehículo', 'Gestion de Programas -Proyectos', '6 horas', 'Sesión de seguimiento con alcaldes y jefes de unidad.'),
    (@emp_admin, @miercoles, 'Oficina', 'Trabajo de oficina', 'N/A', 'Salón', 'Capacitación', '8 horas', 'Facilitación de taller interno de liderazgo.'),
    (@emp_admin, @jueves, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Acompañamiento en instrumentos de planificacion y normativa', '8 horas', 'Actualización de reglamentos internos y manuales.'),
    (@emp_admin, @viernes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Asistencia Técnica para el Desarrollo de Capacidades', '6 horas', 'Coaching individual para jefaturas de unidad.'),

    (@emp_gerente, @lunes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestion de Programas -Proyectos', '8 horas', 'Evaluación financiera mensual de programas en ejecución.'),
    (@emp_gerente, @martes, 'Corquin Copán', 'Visita al municipio', 'Urbana', 'Vehículo', 'Acompañamiento en instrumentos de planificacion y normativa', '7 horas', 'Reunión con corporación municipal para validar presupuestos.'),
    (@emp_gerente, @miercoles, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información Territorial', '8 horas', 'Consolidación de reportes operativos para junta directiva.'),
    (@emp_gerente, @jueves, 'San Pedro Copán', 'Visita al municipio', 'Urbana', 'Vehículo', 'Gestion de Programas -Proyectos', '6 horas', 'Supervisión de obras de infraestructura vial.'),
    (@emp_gerente, @viernes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Salón', 'Capacitación', '5 horas', 'Sesión de retroalimentación con equipo administrativo.'),

    (@emp_jefe, @lunes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Acompañamiento en instrumentos de planificacion y normativa', '8 horas', 'Actualización de matriz de planificación operativa.'),
    (@emp_jefe, @martes, 'Trinidad Copán', 'Visita al municipio', 'Rural', 'Vehículo', 'Asistencia Técnica para el Desarrollo de Capacidades', '7 horas', 'Asistencia técnica para formular proyectos productivos.'),
    (@emp_jefe, @miercoles, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información Territorial', '6 horas', 'Análisis de datos territoriales para POA 2026.'),
    (@emp_jefe, @jueves, 'Oficina', 'Trabajo de oficina', 'N/A', 'Salón', 'Capacitación', '8 horas', 'Capacitación interna sobre metodologías de monitoreo.'),
    (@emp_jefe, @viernes, 'Santa Rosa de Copán', 'Visita al municipio', 'Urbana', 'Vehículo', 'Gestion de Programas -Proyectos', '6 horas', 'Revisión de proyectos priorizados con cooperantes.'),

    (@emp_tecnico, @lunes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información Territorial', '8 horas', 'Procesamiento de datos de monitoreo de cuencas.'),
    (@emp_tecnico, @martes, 'Cucuyagua Copán', 'Visita al municipio', 'Rural', 'Vehículo', 'Asistencia Técnica para el Desarrollo de Capacidades', '8 horas', 'Capacitación sobre prácticas de conservación de suelos.'),
    (@emp_tecnico, @miercoles, 'San Agustín Copán', 'Visita al municipio', 'Rural', 'Vehículo', 'Promoción, Socialización y Sencibilización', '7 horas', 'Jornadas educativas con comités ambientales.'),
    (@emp_tecnico, @jueves, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información Territorial', '8 horas', 'Elaboración de mapas temáticos y fichas técnicas.'),
    (@emp_tecnico, @viernes, 'Dolores Copán', 'Visita al municipio', 'Rural', 'Vehículo', 'Gestion de Programas -Proyectos', '6 horas', 'Seguimiento a proyectos de agua y saneamiento.'),

    (@emp_empleado, @lunes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información Territorial', '8 horas', 'Actualización de base documental y archivos digitales.'),
    (@emp_empleado, @martes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Materiales', 'Capacitación', '6 horas', 'Preparación logística para talleres territoriales.'),
    (@emp_empleado, @miercoles, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Asistencia Técnica para el Desarrollo de Capacidades', '8 horas', 'Soporte administrativo a capacitaciones en curso.'),
    (@emp_empleado, @jueves, 'Santa Rosa de Copán', 'Visita al municipio', 'Urbana', 'Vehículo', 'Gestion de Programas -Proyectos', '6 horas', 'Entrega de insumos y actas a municipalidades.'),
    (@emp_empleado, @viernes, 'Oficina', 'Trabajo de oficina', 'N/A', 'Equipo', 'Gestión de Información Territorial', '7 horas', 'Integración de reportes semanales para gerencia.');

-- =====================================================
-- Blog institucional
-- =====================================================
INSERT INTO blog_posts (
    title,
    slug,
    excerpt,
    body,
    cover_image,
    video_url,
    author_id,
    status,
    department_id,
    category,
    tags,
    published_at,
    published_date,
    created_at,
    updated_at
) VALUES
    (
        'Proyecto de Agua Potable fortalece a Cucuyagua',
        'proyecto-agua-potable-cucuyagua',
        'Se concluyó el sistema de agua potable que beneficiará a más de 500 familias del territorio Higuito.',
        'El Consejo Intermunicipal Higuito inauguró el sistema de agua potable en Cucuyagua Copán, con red de distribución de 8 km y tanque de 50 mil litros. El proyecto fue ejecutado con participación comunitaria y acompañamiento técnico del CIH.',
        '/uploads/blog/proyecto-agua-cucuyagua.jpg',
        NULL,
        @user_tecnico,
        'published',
        @dept_ambiental,
        'Proyectos',
        'agua potable,infraestructura,saneamiento',
        DATE_SUB(@now, INTERVAL 10 DAY),
        DATE(@now),
        @now,
        @now
    ),
    (
        'Planificación Estratégica 2025 lista para aprobación',
        'planificacion-estrategica-2025',
        'La Unidad de Planificación concluyó la formulación del POA 2025 con enfoque territorial.',
        'Durante tres semanas el equipo multidisciplinario consolidó proyectos prioritarios, indicadores y matriz de riesgos. El documento pasa a consulta de la junta directiva y alcaldías asociadas.',
        '/uploads/blog/planificacion-2025.jpg',
        NULL,
        @user_jefe,
        'published',
        @dept_planificacion,
        'Noticias',
        'planificacion,POA,territorio',
        DATE_SUB(@now, INTERVAL 7 DAY),
        DATE_SUB(CURDATE(), INTERVAL 7 DAY),
        @now,
        @now
    ),
    (
        'Nueva flota de motocicletas para visitas técnicas',
        'nueva-flota-motocicletas',
        'Se entregaron motocicletas y equipo de protección para agilizar el acompañamiento municipal.',
        'La dirección ejecutiva del CIH entregó cinco motocicletas y kits de seguridad al equipo técnico ambiental e infraestructura. La inversión permitirá ampliar la cobertura de visitas a comunidades rurales.',
        '/uploads/blog/flota-motocicletas.jpg',
        NULL,
        @user_admin,
        'published',
        @dept_direccion,
        'Comunicados',
        'movilidad,logistica,infraestructura',
        DATE_SUB(@now, INTERVAL 3 DAY),
        DATE_SUB(CURDATE(), INTERVAL 3 DAY),
        @now,
        @now
    );

-- =====================================================
-- Notificaciones recientes
-- =====================================================
INSERT INTO notifications (user_id, type, title, message, data, read_at, created_at) VALUES
    (@emp_admin, 'system', 'Planificación semanal consolidada', 'Tu planificación semanal está completa y lista para aprobación.', '{"link":"/app/planificacion"}', NULL, @now),
    (@emp_tecnico, 'alert', 'Sube fotos de visita de campo', 'Recuerda adjuntar al menos 3 fotografías por visita registrada.', '{"link":"/app/visitas"}', NULL, @now),
    (@emp_empleado, 'reminder', 'Actualiza los expedientes del personal', 'Hay 4 expedientes con información pendiente.', '{"link":"/app/empleados"}', NULL, @now);

-- =====================================================
-- Solicitudes operativas (requests)
-- =====================================================
INSERT INTO requests (employee_id, type, description, status, rejection_reason, created_at, updated_at) VALUES
    (@emp_jefe, 'insumos', 'Material didáctico para talleres territoriales.', 'pending_authorization', NULL, @now, @now),
    (@emp_tecnico, 'permiso', 'Permiso para uso de vehículo asignado durante misión en Cucuyagua.', 'approved', NULL, DATE_SUB(@now, INTERVAL 1 DAY), @now),
    (@emp_empleado, 'vacaciones', 'Solicitud de vacaciones por 3 días en marzo.', 'pending_approval', NULL, @now, @now);

-- =====================================================
-- Visitas de campo y bitácoras
-- =====================================================
INSERT INTO visit_reports (id, employee_id, project_name, location, visit_date, objectives, findings, agreements, created_at, updated_at) VALUES
    (1, @emp_tecnico, 'Monitoreo Microcuenca Higuito', 'Cucuyagua Copán', DATE_SUB(@hoy, INTERVAL 3 DAY), 'Evaluar caudales y estado de reforestación.', 'Caudales estables, se requiere reforzar cercas vivas.', 'Alcaldía proveerá 500 estacas de madero negro.', @now, @now),
    (2, @emp_gerente, 'Supervisión de Centro Comunitario', 'Santa Rosa de Copán', DATE_SUB(@hoy, INTERVAL 2 DAY), 'Verificar avance físico y calidad de obra.', 'Avance del 65% con observaciones menores.', 'Contratista corregirá acabados antes del 30 del mes.', @now, @now);

INSERT INTO visit_report_photos (id, visit_report_id, photo_url, caption, created_at) VALUES
    (1, 1, '/uploads/visit_photos/microcuenca_1.jpg', 'Equipo midiendo caudal en punto crítico.', @now),
    (2, 1, '/uploads/visit_photos/microcuenca_2.jpg', 'Zona reforestada a orillas del río.', @now),
    (3, 2, '/uploads/visit_photos/centro_comunitario_1.jpg', 'Vista general de la obra comunitaria.', @now);

INSERT INTO field_logs (id, employee_id, project_name, log_date, activity_description, observations, weather_conditions, created_at, updated_at) VALUES
    (1, @emp_tecnico, 'Programa Agua Segura', DATE_SUB(@hoy, INTERVAL 4 DAY), 'Seguimiento a comités de agua y medición de cloro residual.', 'Comunidades mantienen niveles adecuados.', 'Parcialmente nublado', @now, @now),
    (2, @emp_jefe, 'Plan Estratégico 2025', DATE_SUB(@hoy, INTERVAL 1 DAY), 'Sesión de validación del plan estratégico con jefaturas.', 'Se incorporaron nuevos indicadores de resiliencia.', 'Soleado', @now, @now);

COMMIT;
