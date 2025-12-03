-- Amplía los catálogos de solicitudes para soportar nuevos estados y tipos.
ALTER TABLE requests
    MODIFY COLUMN type ENUM('vacaciones', 'permiso', 'insumos', 'vehiculo', 'otro') NOT NULL,
    MODIFY COLUMN status ENUM('pending_approval', 'pending_authorization', 'pending_admin', 'approved', 'rejected') NOT NULL DEFAULT 'pending_approval';
