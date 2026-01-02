<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    jsonResponse(['error' => 'Missing credentials'], 400);
}

if ($data['username'] === ADMIN_USER && $data['password'] === ADMIN_PASS) {
    jsonResponse([
        'success' => true,
        'token' => base64_encode($data['username'] . ':' . $data['password'])
    ]);
} else {
    jsonResponse(['error' => 'Invalid credentials'], 401);
}
