<?php
require_once 'config.php';

// Initialize DB connection
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

// POST - public access for creating error reports
// PUT/DELETE - requires authentication

switch ($method) {
    case 'GET':
        // Check auth for viewing reports
        checkAuth();
        
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $pdo->prepare("SELECT * FROM error_reports WHERE id = ?");
            $stmt->execute([$id]);
            $report = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($report) {
                jsonResponse($report);
            } else {
                jsonResponse(['error' => 'Report not found'], 404);
            }
        } elseif (isset($_GET['status'])) {
            $status = $_GET['status'];
            $stmt = $pdo->prepare("SELECT * FROM error_reports WHERE status = ? ORDER BY created_at DESC");
            $stmt->execute([$status]);
            jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            $stmt = $pdo->query("SELECT * FROM error_reports ORDER BY created_at DESC");
            jsonResponse($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        // Public access - anyone can report an error
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['entity_type']) || !isset($data['entity_id']) || !isset($data['error_type']) || !isset($data['description'])) {
            jsonResponse(['error' => 'Missing required fields: entity_type, entity_id, error_type, description'], 400);
        }
        
        $validEntityTypes = ['event', 'ipo', 'founder', 'company', 'financial', 'ma'];
        if (!in_array($data['entity_type'], $validEntityTypes)) {
            jsonResponse(['error' => 'Invalid entity_type'], 400);
        }
        
        $validErrorTypes = ['incorrect_date', 'incorrect_name', 'incorrect_data', 'missing_info', 'duplicate', 'other'];
        if (!in_array($data['error_type'], $validErrorTypes)) {
            jsonResponse(['error' => 'Invalid error_type'], 400);
        }
        
        try {
            $stmt = $pdo->prepare("
                INSERT INTO error_reports (entity_type, entity_id, entity_title, error_type, description, contact_email, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())
            ");
            $stmt->execute([
                $data['entity_type'],
                $data['entity_id'],
                $data['entity_title'] ?? '',
                $data['error_type'],
                $data['description'],
                $data['contact_email'] ?? null
            ]);
            
            $id = $pdo->lastInsertId();
            jsonResponse(['success' => true, 'id' => $id, 'message' => 'Error report created']);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to create error report: ' . $e->getMessage()], 500);
        }
        break;

    case 'PUT':
        checkAuth();
        
        if (!isset($_GET['id'])) {
            jsonResponse(['error' => 'Missing id parameter'], 400);
        }
        
        $id = intval($_GET['id']);
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            jsonResponse(['error' => 'Invalid JSON data'], 400);
        }
        
        $fields = [];
        $values = [];
        
        if (isset($data['status'])) {
            $validStatuses = ['new', 'in_progress', 'resolved', 'rejected'];
            if (!in_array($data['status'], $validStatuses)) {
                jsonResponse(['error' => 'Invalid status'], 400);
            }
            $fields[] = 'status = ?';
            $values[] = $data['status'];
        }
        
        if (isset($data['admin_comment'])) {
            $fields[] = 'admin_comment = ?';
            $values[] = $data['admin_comment'];
        }
        
        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }
        
        $fields[] = 'updated_at = NOW()';
        $values[] = $id;
        
        try {
            $sql = "UPDATE error_reports SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($values);
            
            if ($stmt->rowCount() === 0) {
                jsonResponse(['error' => 'Report not found or no changes made'], 404);
            }
            
            jsonResponse(['success' => true, 'message' => 'Error report updated']);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to update error report: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        checkAuth();
        
        if (!isset($_GET['id'])) {
            jsonResponse(['error' => 'Missing id parameter'], 400);
        }
        
        $id = intval($_GET['id']);
        
        try {
            $stmt = $pdo->prepare("DELETE FROM error_reports WHERE id = ?");
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() === 0) {
                jsonResponse(['error' => 'Report not found'], 404);
            }
            
            jsonResponse(['success' => true, 'message' => 'Error report deleted']);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'Failed to delete error report: ' . $e->getMessage()], 500);
        }
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
