ALTER TABLE requests ADD COLUMN start_date DATE NULL AFTER description;
ALTER TABLE requests ADD COLUMN end_date DATE NULL AFTER start_date;
