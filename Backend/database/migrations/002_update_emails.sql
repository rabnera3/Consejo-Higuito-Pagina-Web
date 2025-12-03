-- Migration 002: Actualizar correos @higuito.local a @cih.hn y forzar hash demo123
-- EJECUTAR SOLO UNA VEZ EN DESARROLLO. Respaldar antes de aplicar.
START TRANSACTION;

-- Nuevo hash bcrypt para la contraseña demo123 (generado con PHP password_hash)
SET @new_hash := '$2y$10$NdDtHSDAukWB5.NJtgaIz.Uz9Pb4ypgfVb9slH6Q2u8K9AqkUvFxi';

-- Opcional: registrar el hash antiguo para detectar usuarios que aún lo usan
SET @old_hash := '$2y$10$TuiL3A1OurX0dmq1dbjtS.zGvdzGUusvcehppjuGcuuIBkopdNcPO';

-- Actualizar cada usuario si existe con el correo antiguo
UPDATE users SET email = 'direccion@cih.hn', password_hash = @new_hash WHERE email = 'direccion@higuito.local';
UPDATE users SET email = 'gerente@cih.hn', password_hash = @new_hash WHERE email = 'gerencia@higuito.local';
UPDATE users SET email = 'jefe@cih.hn', password_hash = @new_hash WHERE email = 'jefe.planificacion@higuito.local';
UPDATE users SET email = 'tecnico@cih.hn', password_hash = @new_hash WHERE email = 'tecnico.ambiente@higuito.local';
UPDATE users SET email = 'empleado@cih.hn', password_hash = @new_hash WHERE email = 'empleado@higuito.local';

-- Limpiar posibles duplicados (si ya insertaste nuevos registros con @cih.hn antes de migrar)
-- Mantiene el más reciente (mayor id) y elimina el antiguo.
DELETE u1 FROM users u1
JOIN users u2 ON u1.email = u2.email AND u1.id < u2.id;

COMMIT;

-- Rollback manual (solo ejemplo; reemplazar con los ids reales si necesitas revertir)
-- START TRANSACTION;
-- UPDATE users SET email = 'direccion@higuito.local' WHERE email = 'direccion@cih.hn';
-- UPDATE users SET email = 'gerencia@higuito.local' WHERE email = 'gerente@cih.hn';
-- UPDATE users SET email = 'jefe.planificacion@higuito.local' WHERE email = 'jefe@cih.hn';
-- UPDATE users SET email = 'tecnico.ambiente@higuito.local' WHERE email = 'tecnico@cih.hn';
-- UPDATE users SET email = 'empleado@higuito.local' WHERE email = 'empleado@cih.hn';
-- COMMIT;