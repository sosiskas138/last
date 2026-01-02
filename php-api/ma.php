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
        $buyer = isset($_GET['buyer']) ? $_GET['buyer'] : null;
        
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM ma_events WHERE id = ?");
            $stmt->execute([$id]);
            $ma = $stmt->fetch();
            
            if ($ma) {
                jsonResponse($ma);
            } else {
                jsonResponse(['error' => 'M&A event not found'], 404);
            }
        } elseif ($buyer) {
            $stmt = $pdo->prepare("SELECT * FROM ma_events WHERE buyer LIKE ? ORDER BY date DESC");
            $stmt->execute(['%' . $buyer . '%']);
            jsonResponse($stmt->fetchAll());
        } else {
            $stmt = $pdo->query("SELECT * FROM ma_events ORDER BY date DESC");
            jsonResponse($stmt->fetchAll());
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Валидация обязательных полей
        $errors = [];
        if (!$data || !isset($data['id']) || empty($data['id'])) {
            $errors[] = 'id обязателен (латиницей, например: magnit-2021-dixy)';
        } elseif (!preg_match('/^[a-z0-9\-_]+$/i', $data['id'])) {
            $errors[] = 'id должен содержать только латиницу, цифры, дефисы и подчёркивания';
        }
        if (!isset($data['date']) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
            $errors[] = 'date должен быть в формате YYYY-MM-DD';
        }
        if (!isset($data['buyer']) || empty(trim($data['buyer']))) {
            $errors[] = 'buyer (покупатель) обязателен';
        }
        if (!isset($data['target']) || empty(trim($data['target']))) {
            $errors[] = 'target (цель) обязателен';
        }
        
        if (!empty($errors)) {
            jsonResponse(['error' => implode('; ', $errors)], 400);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO ma_events (id, date, buyer, target, value, description)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        try {
            $stmt->execute([
                $data['id'],
                $data['date'],
                trim($data['buyer']),
                trim($data['target']),
                $data['value'] ?? null,
                $data['description'] ?? null
            ]);
            jsonResponse(['success' => true, 'id' => $data['id']], 201);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate') !== false) {
                jsonResponse(['error' => 'M&A событие с таким ID уже существует'], 400);
            }
            jsonResponse(['error' => 'Failed to create M&A event: ' . $e->getMessage()], 500);
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
        if (isset($data['date']) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
            $errors[] = 'date должен быть в формате YYYY-MM-DD';
        }
        if (isset($data['buyer']) && empty(trim($data['buyer']))) {
            $errors[] = 'buyer не может быть пустым';
        }
        if (isset($data['target']) && empty(trim($data['target']))) {
            $errors[] = 'target не может быть пустым';
        }
        
        if (!empty($errors)) {
            jsonResponse(['error' => implode('; ', $errors)], 400);
        }
        
        $stmt = $pdo->prepare("
            UPDATE ma_events SET
                date = ?,
                buyer = ?,
                target = ?,
                value = ?,
                description = ?
            WHERE id = ?
        ");
        
        try {
            $stmt->execute([
                $data['date'],
                trim($data['buyer']),
                trim($data['target']),
                $data['value'] ?? null,
                $data['description'] ?? null,
                $id
            ]);
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update M&A event: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            jsonResponse(['error' => 'Missing id'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM ma_events WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
