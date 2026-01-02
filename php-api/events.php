<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

if ($method !== 'GET') {
    checkAuth();
}

switch ($method) {
    case 'GET':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $companyId = isset($_GET['company_id']) ? $_GET['company_id'] : null;
        
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
            $stmt->execute([$id]);
            $event = $stmt->fetch();
            
            if ($event) {
                jsonResponse($event);
            } else {
                jsonResponse(['error' => 'Event not found'], 404);
            }
        } elseif ($companyId) {
            $stmt = $pdo->prepare("SELECT * FROM events WHERE company_id = ? ORDER BY date DESC");
            $stmt->execute([$companyId]);
            jsonResponse($stmt->fetchAll());
        } else {
            $stmt = $pdo->query("SELECT * FROM events ORDER BY date DESC");
            jsonResponse($stmt->fetchAll());
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['company_id']) || !isset($data['title']) || !isset($data['date']) || !isset($data['category'])) {
            jsonResponse(['error' => 'Missing required fields'], 400);
        }
        
        $id = $data['id'] ?? uniqid('evt_');
        
        $stmt = $pdo->prepare("
            INSERT INTO events (id, company_id, date, title, description, category, subcategory)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        try {
            $stmt->execute([
                $id,
                $data['company_id'],
                $data['date'],
                $data['title'],
                $data['description'] ?? null,
                $data['category'],
                $data['subcategory'] ?? null
            ]);
            jsonResponse(['success' => true, 'id' => $id], 201);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to create event: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id || !$data) {
            jsonResponse(['error' => 'Missing id or data'], 400);
        }
        
        $stmt = $pdo->prepare("
            UPDATE events SET
                company_id = ?,
                date = ?,
                title = ?,
                description = ?,
                category = ?,
                subcategory = ?
            WHERE id = ?
        ");
        
        try {
            $stmt->execute([
                $data['company_id'],
                $data['date'],
                $data['title'],
                $data['description'] ?? null,
                $data['category'],
                $data['subcategory'] ?? null,
                $id
            ]);
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update event'], 500);
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            jsonResponse(['error' => 'Missing id'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
