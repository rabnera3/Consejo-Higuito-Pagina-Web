-- Migración para añadir campos adicionales a la tabla blog_posts
-- Ejecutar en phpMyAdmin (MariaDB)

-- Primero verificar si las columnas ya existen
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

-- Actualizar departamento de posts existentes basado en el autor
UPDATE blog_posts bp
INNER JOIN employees e ON bp.author_id = e.id
SET bp.department_id = e.department_id
WHERE bp.department_id IS NULL;
