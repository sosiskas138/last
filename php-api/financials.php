<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

// GET - публичный доступ, остальные требуют авторизации
if ($method !== 'GET') {
    checkAuth();
}

switch ($method) {
    case 'GET':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $companyId = isset($_GET['company_id']) ? $_GET['company_id'] : null;
        
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM financials WHERE id = ?");
            $stmt->execute([$id]);
            $financial = $stmt->fetch();
            
            if ($financial) {
                jsonResponse($financial);
            } else {
                jsonResponse(['error' => 'Financial data not found'], 404);
            }
        } elseif ($companyId) {
            $stmt = $pdo->prepare("SELECT * FROM financials WHERE company_id = ? ORDER BY year DESC, quarter DESC");
            $stmt->execute([$companyId]);
            jsonResponse($stmt->fetchAll());
        } else {
            $stmt = $pdo->query("SELECT * FROM financials ORDER BY company_id, year DESC, quarter DESC");
            jsonResponse($stmt->fetchAll());
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Валидация обязательных полей
        $errors = [];
        if (!$data || !isset($data['company_id']) || empty($data['company_id'])) {
            $errors[] = 'company_id обязателен';
        }
        if (!isset($data['year']) || !is_numeric($data['year']) || $data['year'] < 1990 || $data['year'] > 2030) {
            $errors[] = 'year должен быть числом от 1990 до 2030';
        }
        if (isset($data['quarter']) && $data['quarter'] !== '' && (!is_numeric($data['quarter']) || $data['quarter'] < 1 || $data['quarter'] > 4)) {
            $errors[] = 'quarter должен быть от 1 до 4';
        }
        if (isset($data['revenue']) && $data['revenue'] !== '' && (!is_numeric($data['revenue']) || $data['revenue'] < 0)) {
            $errors[] = 'revenue должен быть положительным числом (млрд ₽)';
        }
        if (isset($data['profit']) && $data['profit'] !== '' && !is_numeric($data['profit'])) {
            $errors[] = 'profit должен быть числом (млн USD)';
        }
        if (isset($data['margin']) && $data['margin'] !== '' && (!is_numeric($data['margin']) || $data['margin'] < -100 || $data['margin'] > 100)) {
            $errors[] = 'margin должен быть от -100 до 100 (%)';
        }
        if (isset($data['store_count']) && $data['store_count'] !== '' && (!is_numeric($data['store_count']) || $data['store_count'] < 0)) {
            $errors[] = 'store_count должен быть положительным целым числом';
        }
        
        if (!empty($errors)) {
            jsonResponse(['error' => implode('; ', $errors)], 400);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO financials (company_id, year, quarter, revenue, profit, margin, store_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        try {
            $stmt->execute([
                $data['company_id'],
                (int)$data['year'],
                isset($data['quarter']) && $data['quarter'] !== '' ? (int)$data['quarter'] : null,
                isset($data['revenue']) && $data['revenue'] !== '' ? (float)$data['revenue'] : null,
                isset($data['profit']) && $data['profit'] !== '' ? (float)$data['profit'] : null,
                isset($data['margin']) && $data['margin'] !== '' ? (float)$data['margin'] : null,
                isset($data['store_count']) && $data['store_count'] !== '' ? (int)$data['store_count'] : null
            ]);
            jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()], 201);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate') !== false) {
                jsonResponse(['error' => 'Данные за этот период уже существуют (компания + год + квартал)'], 400);
            }
            jsonResponse(['error' => 'Failed to create financial data: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id || !$data) {
            jsonResponse(['error' => 'Missing id or data'], 400);
        }
        
        // Валидация
        $errors = [];
        if (isset($data['year']) && (!is_numeric($data['year']) || $data['year'] < 1990 || $data['year'] > 2030)) {
            $errors[] = 'year должен быть числом от 1990 до 2030';
        }
        if (isset($data['quarter']) && $data['quarter'] !== '' && (!is_numeric($data['quarter']) || $data['quarter'] < 1 || $data['quarter'] > 4)) {
            $errors[] = 'quarter должен быть от 1 до 4';
        }
        if (isset($data['revenue']) && $data['revenue'] !== '' && (!is_numeric($data['revenue']) || $data['revenue'] < 0)) {
            $errors[] = 'revenue должен быть положительным числом';
        }
        if (isset($data['margin']) && $data['margin'] !== '' && (!is_numeric($data['margin']) || $data['margin'] < -100 || $data['margin'] > 100)) {
            $errors[] = 'margin должен быть от -100 до 100';
        }
        
        if (!empty($errors)) {
            jsonResponse(['error' => implode('; ', $errors)], 400);
        }
        
        $stmt = $pdo->prepare("
            UPDATE financials SET
                company_id = ?,
                year = ?,
                quarter = ?,
                revenue = ?,
                profit = ?,
                margin = ?,
                store_count = ?
            WHERE id = ?
        ");
        
        try {
            $stmt->execute([
                $data['company_id'],
                (int)$data['year'],
                isset($data['quarter']) && $data['quarter'] !== '' ? (int)$data['quarter'] : null,
                isset($data['revenue']) && $data['revenue'] !== '' ? (float)$data['revenue'] : null,
                isset($data['profit']) && $data['profit'] !== '' ? (float)$data['profit'] : null,
                isset($data['margin']) && $data['margin'] !== '' ? (float)$data['margin'] : null,
                isset($data['store_count']) && $data['store_count'] !== '' ? (int)$data['store_count'] : null,
                $id
            ]);
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate') !== false) {
                jsonResponse(['error' => 'Данные за этот период уже существуют'], 400);
            }
            jsonResponse(['error' => 'Failed to update financial data: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            jsonResponse(['error' => 'Missing id'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM financials WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
