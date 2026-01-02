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
            $stmt = $pdo->prepare("SELECT * FROM founders WHERE id = ?");
            $stmt->execute([$id]);
            $founder = $stmt->fetch();
            
            if ($founder) {
                // Parse key_contributions as JSON array
                if ($founder['key_contributions']) {
                    $founder['key_contributions'] = json_decode($founder['key_contributions'], true);
                }
                jsonResponse($founder);
            } else {
                jsonResponse(['error' => 'Founder not found'], 404);
            }
        } elseif ($companyId) {
            $stmt = $pdo->prepare("SELECT * FROM founders WHERE company_id = ? ORDER BY name");
            $stmt->execute([$companyId]);
            $founders = $stmt->fetchAll();
            foreach ($founders as &$f) {
                if ($f['key_contributions']) {
                    $f['key_contributions'] = json_decode($f['key_contributions'], true);
                }
            }
            jsonResponse($founders);
        } else {
            $stmt = $pdo->query("SELECT * FROM founders ORDER BY name");
            $founders = $stmt->fetchAll();
            foreach ($founders as &$f) {
                if ($f['key_contributions']) {
                    $f['key_contributions'] = json_decode($f['key_contributions'], true);
                }
            }
            jsonResponse($founders);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['company_id']) || !isset($data['name'])) {
            jsonResponse(['error' => 'Missing required fields'], 400);
        }
        
        $id = $data['id'] ?? uniqid('fnd_');
        $keyContributions = isset($data['key_contributions']) ? json_encode($data['key_contributions'], JSON_UNESCAPED_UNICODE) : null;
        
        $stmt = $pdo->prepare("
            INSERT INTO founders (id, company_id, name, role, period, status, ownership, background, key_contributions, current_activity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        try {
            $stmt->execute([
                $id,
                $data['company_id'],
                $data['name'],
                $data['role'] ?? null,
                $data['period'] ?? null,
                $data['status'] ?? 'active',
                $data['ownership'] ?? null,
                $data['background'] ?? null,
                $keyContributions,
                $data['current_activity'] ?? null
            ]);
            jsonResponse(['success' => true, 'id' => $id], 201);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to create founder: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id || !$data) {
            jsonResponse(['error' => 'Missing id or data'], 400);
        }
        
        $keyContributions = isset($data['key_contributions']) ? json_encode($data['key_contributions'], JSON_UNESCAPED_UNICODE) : null;
        
        $stmt = $pdo->prepare("
            UPDATE founders SET
                company_id = ?,
                name = ?,
                role = ?,
                period = ?,
                status = ?,
                ownership = ?,
                background = ?,
                key_contributions = ?,
                current_activity = ?
            WHERE id = ?
        ");
        
        try {
            $stmt->execute([
                $data['company_id'],
                $data['name'],
                $data['role'] ?? null,
                $data['period'] ?? null,
                $data['status'] ?? 'active',
                $data['ownership'] ?? null,
                $data['background'] ?? null,
                $keyContributions,
                $data['current_activity'] ?? null,
                $id
            ]);
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update founder'], 500);
        }
        break;
        
    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            jsonResponse(['error' => 'Missing id'], 400);
        }
        
        $stmt = $pdo->prepare("DELETE FROM founders WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
