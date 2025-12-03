CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    type ENUM('vacaciones', 'permiso', 'insumos', 'otro') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending_approval', 'pending_authorization', 'approved', 'rejected') DEFAULT 'pending_approval',
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
