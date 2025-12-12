-- Migración: eliminar rol tecnico (migrar a empleado)
-- Objetivo:
-- 1) Asegurar que el rol 'empleado' exista.
-- 2) Reasignar usuarios con rol 'tecnico' a 'empleado'.
-- 3) Eliminar el rol 'tecnico' si ya no está en uso.

START TRANSACTION;

-- Asegurar rol empleado
INSERT INTO roles (slug, name)
SELECT 'empleado', 'Empleado'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE slug = 'empleado');

SET @role_tecnico := (SELECT id FROM roles WHERE slug = 'tecnico' LIMIT 1);
SET @role_empleado := (SELECT id FROM roles WHERE slug = 'empleado' LIMIT 1);

-- Migrar usuarios
UPDATE users
SET role_id = @role_empleado
WHERE role_id = @role_tecnico
  AND @role_tecnico IS NOT NULL
  AND @role_empleado IS NOT NULL;

-- Eliminar rol tecnico solo si ya no lo usa ningún usuario
DELETE r
FROM roles r
LEFT JOIN users u ON u.role_id = r.id
WHERE r.slug = 'tecnico'
  AND u.id IS NULL;

COMMIT;
