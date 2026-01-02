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
            $stmt = $pdo->prepare("SELECT * FROM ipo WHERE id = ?");
            $stmt->execute([$id]);
            $ipo = $stmt->fetch();
            
            if ($ipo) {
                jsonResponse($ipo);
            } else {
                jsonResponse(['error' => 'IPO not found'], 404);
            }
        } elseif ($companyId) {
            $stmt = $pdo->prepare("SELECT * FROM ipo WHERE company_id = ? ORDER BY date DESC");
            $stmt->execute([$companyId]);
            jsonResponse($stmt->fetchAll());
        } else {
            $stmt = $pdo->query("SELECT * FROM ipo ORDER BY date DESC");
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
        if (!isset($data['type']) || !in_array($data['type'], ['ipo', 'spo'])) {
            $errors[] = 'type должен быть ipo или spo';
        }
        if (!isset($data['date']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
            $errors[] = 'date должен быть в формате YYYY-MM-DD';
        }
        
        if (!empty($errors)) {
            jsonResponse(['error' => implode('; ', $errors)], 400);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO ipo (company_id, type, date, valuation, raised, revenue, shares, exchange, ticker, price, prospectus, market_position)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        try {
            $stmt->execute([
                $data['company_id'],
                $data['type'],
                $data['date'],
                $data['valuation'] ?? null,
                $data['raised'] ?? null,
                $data['revenue'] ?? null,
                $data['shares'] ?? null,
                $data['exchange'] ?? null,
                $data['ticker'] ?? null,
                $data['price'] ?? null,
                $data['prospectus'] ?? null,
                $data['market_position'] ?? null
            ]);
            jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()], 201);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to create IPO: ' . $e->getMessage()], 500);
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
        if (isset($data['type']) && !in_array($data['type'], ['ipo', 'spo'])) {
            $errors[] = 'type должен быть ipo или spo';
        }
        if (isset($data['date']) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
            $errors[] = 'date должен быть в формате YYYY-MM-DD';
        }
        
        if (!empty($errors)) {
            jsonResponse(['error' => implode('; ', $errors)], 400);
        }
        
        $stmt = $pdo->prepare("
            UPDATE ipo SET
                company_id = ?,
                type = ?,
                date = ?,
                valuation = ?,
                raised = ?,
                revenue = ?,
                shares = ?,
                exchange = ?,
                ticker = ?,
                price = ?,
                prospectus = ?,
                market_position = ?
            WHERE id = ?
        ");
        
        try {
            $stmt->execute([
                $data['company_id'],
                $data['type'],
                $data['date'],
                $data['valuation'] ?? null,
                $data['raised'] ?? null,
                $data['revenue'] ?? null,
                $data['shares'] ?? null,
                $data['exchange'] ?? null,
                $data['ticker'] ?? null,
                $data['price'] ?? null,
                $data['prospectus'] ?? null,
                $data['market_position'] ?? null,
                $id
            ]);
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update IPO: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            jsonResponse(['error' => 'Missing id'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM ipo WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
