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
        
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM companies WHERE id = ?");
            $stmt->execute([$id]);
            $company = $stmt->fetch();
            
            if ($company) {
                jsonResponse($company);
            } else {
                jsonResponse(['error' => 'Company not found'], 404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM companies ORDER BY name");
            jsonResponse($stmt->fetchAll());
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['id']) || !isset($data['name']) || !isset($data['color'])) {
            jsonResponse(['error' => 'Missing required fields'], 400);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO companies (id, name, parent_company, logo, color, status, acquired_by, acquired_year, story_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        try {
            $stmt->execute([
                $data['id'],
                $data['name'],
                $data['parent_company'] ?? null,
                $data['logo'] ?? null,
                $data['color'],
                $data['status'] ?? 'active',
                $data['acquired_by'] ?? null,
                $data['acquired_year'] ?? null,
                $data['story_url'] ?? null
            ]);
            jsonResponse(['success' => true, 'id' => $data['id']], 201);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to create company'], 500);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id || !$data) {
            jsonResponse(['error' => 'Missing id or data'], 400);
        }
        
        $stmt = $pdo->prepare("
            UPDATE companies SET
                name = ?,
                parent_company = ?,
                logo = ?,
                color = ?,
                status = ?,
                acquired_by = ?,
                acquired_year = ?,
                story_url = ?
            WHERE id = ?
        ");
        
        try {
            $stmt->execute([
                $data['name'],
                $data['parent_company'] ?? null,
                $data['logo'] ?? null,
                $data['color'],
                $data['status'] ?? 'active',
                $data['acquired_by'] ?? null,
                $data['acquired_year'] ?? null,
                $data['story_url'] ?? null,
                $id
            ]);
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update company'], 500);
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            jsonResponse(['error' => 'Missing id'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM companies WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
