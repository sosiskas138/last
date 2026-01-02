<?php
/**
 * Утилита для удаления всех таблиц базы данных
 * 
 * ⚠️ ВНИМАНИЕ: Этот скрипт полностью удаляет все таблицы и данные из базы данных!
 * Используйте его только если вы хотите пересоздать базу данных с нуля.
 * 
 * После выполнения этого скрипта выполните install.php для пересоздания таблиц.
 * 
 * Удаляет следующие таблицы:
 * - events, founders, financials, ipo (зависимые от companies)
 * - ma_events, error_reports (независимые)
 * - companies (основная таблица)
 */

require_once 'config.php';

// Удаление всех таблиц базы данных
$pdo = getDB();

// Список всех таблиц в правильном порядке удаления
// Сначала удаляем таблицы с внешними ключами, затем независимые, затем основную
$tables = [
    'events',           // Зависит от companies
    'founders',         // Зависит от companies
    'financials',       // Зависит от companies
    'ipo',              // Зависит от companies
    'ma_events',         // Независимая
    'error_reports',    // Независимая
    'companies',        // Основная таблица (удаляем последней)
];

$success = true;
$messages = [];
$droppedTables = [];

// Отключаем проверку внешних ключей для безопасного удаления
try {
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $messages[] = "Foreign key checks disabled";
} catch (PDOException $e) {
    $success = false;
    $messages[] = "Error disabling foreign key checks: " . $e->getMessage();
}

// Удаляем каждую таблицу
foreach ($tables as $table) {
    try {
        // Проверяем, существовала ли таблица до удаления
        $checkBeforeStmt = $pdo->prepare("SHOW TABLES LIKE ?");
        $checkBeforeStmt->execute([$table]);
        $existedBefore = $checkBeforeStmt->rowCount() > 0;
        
        // Удаляем таблицу
        $stmt = $pdo->prepare("DROP TABLE IF EXISTS `{$table}`");
        $stmt->execute();
        
        // Проверяем, что таблица удалена
        $checkAfterStmt = $pdo->prepare("SHOW TABLES LIKE ?");
        $checkAfterStmt->execute([$table]);
        $existsAfter = $checkAfterStmt->rowCount() > 0;
        
        if ($existedBefore && !$existsAfter) {
            $droppedTables[] = $table;
            $messages[] = "Table '{$table}' dropped successfully";
        } elseif (!$existedBefore) {
            $messages[] = "Table '{$table}' was not found (already deleted or never existed)";
        } else {
            $messages[] = "Warning: Table '{$table}' still exists after drop attempt";
            $success = false;
        }
    } catch (PDOException $e) {
        $success = false;
        $messages[] = "Error dropping table '{$table}': " . $e->getMessage();
    }
}

// Включаем проверку внешних ключей обратно
try {
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    $messages[] = "Foreign key checks re-enabled";
} catch (PDOException $e) {
    $success = false;
    $messages[] = "Error re-enabling foreign key checks: " . $e->getMessage();
}

// Проверяем, остались ли какие-то таблицы
$remainingTables = [];
try {
    $stmt = $pdo->query("SHOW TABLES");
    $remainingTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($remainingTables) > 0) {
        $messages[] = "Warning: The following tables still exist: " . implode(', ', $remainingTables);
    } else {
        $messages[] = "All tables have been successfully removed from the database";
    }
} catch (PDOException $e) {
    $messages[] = "Could not check remaining tables: " . $e->getMessage();
}

jsonResponse([
    'success' => $success,
    'dropped_tables' => $droppedTables,
    'messages' => $messages,
    'summary' => [
        'total_tables_attempted' => count($tables),
        'tables_dropped' => count($droppedTables),
        'all_removed' => count($remainingTables) === 0
    ]
]);

