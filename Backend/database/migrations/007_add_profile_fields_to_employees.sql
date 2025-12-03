ALTER TABLE employees
ADD COLUMN address TEXT NULL AFTER phone,
ADD COLUMN emergency_contact_name VARCHAR(255) NULL AFTER address,
ADD COLUMN emergency_contact_phone VARCHAR(50) NULL AFTER emergency_contact_name;
