-- Genera usuarios con rol de jefe para cada departamento sin un responsable asignado.
START TRANSACTION;

SET @role_jefe_id := (SELECT id FROM roles WHERE slug = 'jefe' LIMIT 1);
SET @demo_password := '$2y$10$NdDtHSDAukWB5.NJtgaIz.Uz9Pb4ypgfVb9slH6Q2u8K9AqkUvFxi'; -- "demo123"

-- Crear usuarios de jefatura donde falten
INSERT INTO users (name, email, password_hash, role_id, department_id, status)
SELECT CONCAT('Jefe de ', d.name) AS name,
       CONCAT('jefe', d.id, '@higuito.local') AS email,
       @demo_password,
       @role_jefe_id,
       d.id,
       'active'
FROM departments d
WHERE NOT EXISTS (
    SELECT 1
    FROM users u
    WHERE u.department_id = d.id AND u.role_id = @role_jefe_id
);

-- Crear registros en employees para los nuevos jefes
INSERT INTO employees (user_id, full_name, job_title, department_id, email, hire_date, vacation_days_balance)
SELECT u.id,
       u.name,
       CONCAT('Jefe de ', d.name) AS job_title,
       d.id,
       u.email,
       CURDATE(),
       15
FROM users u
JOIN departments d ON d.id = u.department_id
WHERE u.role_id = @role_jefe_id
  AND NOT EXISTS (
        SELECT 1 FROM employees e WHERE e.user_id = u.id
  );

COMMIT;
