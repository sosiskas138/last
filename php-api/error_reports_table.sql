-- SQL для создания таблицы error_reports
-- Выполните этот скрипт в PhpMyAdmin

CREATE TABLE IF NOT EXISTS error_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL COMMENT 'Тип сущности: event, ipo, founder, company, financial, ma',
    entity_id VARCHAR(100) NOT NULL COMMENT 'ID сущности',
    entity_title VARCHAR(500) DEFAULT '' COMMENT 'Название сущности для отображения',
    error_type VARCHAR(50) NOT NULL COMMENT 'Тип ошибки: incorrect_date, incorrect_name, incorrect_data, missing_info, duplicate, other',
    description TEXT NOT NULL COMMENT 'Описание ошибки от пользователя',
    contact_email VARCHAR(255) DEFAULT NULL COMMENT 'Email пользователя для связи',
    status ENUM('new', 'in_progress', 'resolved', 'rejected') DEFAULT 'new' COMMENT 'Статус обработки',
    admin_comment TEXT DEFAULT NULL COMMENT 'Комментарий администратора',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Сообщения об ошибках в данных от пользователей';
