CREATE TABLE IF NOT EXISTS `visit_reports` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `employee_id` BIGINT UNSIGNED NOT NULL,
    `project_name` VARCHAR(255) NULL,
    `location` VARCHAR(255) NOT NULL,
    `visit_date` DATE NOT NULL,
    `objectives` TEXT NOT NULL,
    `findings` TEXT NOT NULL,
    `agreements` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `visit_report_photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `visit_report_id` INT NOT NULL,
    `photo_url` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`visit_report_id`) REFERENCES `visit_reports`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `field_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `employee_id` BIGINT UNSIGNED NOT NULL,
    `project_name` VARCHAR(255) NULL,
    `log_date` DATE NOT NULL,
    `activity_description` TEXT NOT NULL,
    `observations` TEXT NULL,
    `weather_conditions` VARCHAR(100) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
