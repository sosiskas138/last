<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration - ИЗМЕНИТЕ ЭТИ ДАННЫЕ
define('DB_HOST', 'localhost');
define('DB_NAME', 'retail_db');
define('DB_USER', 'retail_user');
define('DB_PASS', 'your_password');

// Admin credentials - ИЗМЕНИТЕ ЭТИ ДАННЫЕ
define('ADMIN_USER', 'admin');
define('ADMIN_PASS', 'admin123');

function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }
}

// Alias for mysqli connection (used by import/export)
function getDbConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $conn->set_charset('utf8mb4');
        if ($conn->connect_error) {
            throw new Exception('Connection failed');
        }
        return $conn;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }
}

function checkAuth() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];

    // Some servers (FastCGI/Apache) don't pass Authorization into getallheaders
    $auth = '';
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $auth = $headers['authorization'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    if (strpos($auth, 'Basic ') === 0) {
        $credentials = base64_decode(substr($auth, 6));
        if ($credentials !== false && strpos($credentials, ':') !== false) {
            list($user, $pass) = explode(':', $credentials, 2);

            if ($user === ADMIN_USER && $pass === ADMIN_PASS) {
                return true;
            }
        }
    }

    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Alias for checkAuth that returns boolean
function isAuthorized() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];

    $auth = '';
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $auth = $headers['authorization'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    if (strpos($auth, 'Basic ') === 0) {
        $credentials = base64_decode(substr($auth, 6));
        if ($credentials !== false && strpos($credentials, ':') !== false) {
            list($user, $pass) = explode(':', $credentials, 2);
            return ($user === ADMIN_USER && $pass === ADMIN_PASS);
        }
    }

    return false;
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function sendResponse($data, $code = 200) {
    jsonResponse($data, $code);
}

function sendError($message, $code = 400) {
    jsonResponse(['error' => $message, 'success' => false], $code);
}

function sanitize($value) {
    if ($value === null) return null;
    return trim((string)$value);
}
