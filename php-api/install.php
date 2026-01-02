<?php
require_once 'config.php';

// Создание таблиц базы данных
$pdo = getDB();

$queries = [
    // Таблица компаний
    "CREATE TABLE IF NOT EXISTS companies (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parent_company VARCHAR(255),
        logo VARCHAR(500),
        color VARCHAR(50) NOT NULL,
        status ENUM('active', 'inactive', 'acquired') DEFAULT 'active',
        acquired_by VARCHAR(255),
        acquired_year INT,
        story_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    // Таблица событий
    "CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(50) PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    // Таблица основателей
    "CREATE TABLE IF NOT EXISTS founders (
        id VARCHAR(50) PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        period VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        ownership VARCHAR(100),
        background TEXT,
        key_contributions TEXT,
        current_activity TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    // Таблица финансовых данных
    "CREATE TABLE IF NOT EXISTS financials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        quarter INT,
        revenue DECIMAL(15,2),
        profit DECIMAL(15,2),
        margin DECIMAL(5,2),
        store_count INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        UNIQUE KEY unique_period (company_id, year, quarter)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    // Таблица IPO
    "CREATE TABLE IF NOT EXISTS ipo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id VARCHAR(50) NOT NULL,
        type ENUM('ipo', 'spo') NOT NULL,
        date DATE NOT NULL,
        valuation VARCHAR(100),
        raised VARCHAR(100),
        revenue VARCHAR(100),
        shares VARCHAR(100),
        exchange VARCHAR(100),
        ticker VARCHAR(50),
        price VARCHAR(100),
        prospectus VARCHAR(500),
        market_position TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    
    // Таблица M&A
    "CREATE TABLE IF NOT EXISTS ma_events (
        id VARCHAR(50) PRIMARY KEY,
        date DATE NOT NULL,
        buyer VARCHAR(255) NOT NULL,
        target VARCHAR(255) NOT NULL,
        value VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

$success = true;
$messages = [];

foreach ($queries as $query) {
    try {
        $pdo->exec($query);
        $messages[] = "Table created successfully";
    } catch (PDOException $e) {
        $success = false;
        $messages[] = "Error: " . $e->getMessage();
    }
}

jsonResponse([
    'success' => $success,
    'messages' => $messages
]);
