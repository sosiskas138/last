<?php
// Suppress PHP errors from being output - always return JSON
error_reporting(0);
ini_set('display_errors', 0);

// Set JSON content type early
header('Content-Type: application/json; charset=utf-8');

require_once 'config.php';

// Handle CORS and authorization
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Require authentication
if (!isAuthorized()) {
    sendError('Unauthorized', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Get JSON input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Invalid JSON: ' . json_last_error_msg());
}

if (!$input || !isset($input['table']) || !isset($input['data'])) {
    sendError('Invalid input: table and data required');
}

$table = $input['table'];
$data = $input['data'];

// Validate table name
$allowedTables = ['companies', 'events', 'founders', 'ipo', 'financials', 'ma_events'];
if (!in_array($table, $allowedTables)) {
    sendError('Invalid table name');
}

// Connect to database
$conn = getDbConnection();
$imported = 0;
$skipped = 0;
$errors = [];

// Process each row
foreach ($data as $index => $row) {
    try {
        $result = importRow($conn, $table, $row, $index);
        if ($result === true) {
            $imported++;
        } else {
            $skipped++;
        }
    } catch (Exception $e) {
        $errors[] = [
            'row' => $index + 2,
            'message' => $e->getMessage()
        ];
    }
}

$conn->close();

sendResponse([
    'success' => true,
    'imported' => $imported,
    'skipped' => $skipped,
    'errors' => $errors
]);

function importRow($conn, $table, $row, $index) {
    switch ($table) {
        case 'companies':
            return importCompany($conn, $row);
        case 'events':
            return importEvent($conn, $row);
        case 'founders':
            return importFounder($conn, $row);
        case 'ipo':
            return importIPO($conn, $row);
        case 'financials':
            return importFinancial($conn, $row);
        case 'ma_events':
            return importMA($conn, $row);
        default:
            throw new Exception('Unknown table');
    }
}

function importCompany($conn, $row) {
    $id = sanitize($row['id'] ?? '');
    $name = sanitize($row['name'] ?? '');
    $color = sanitize($row['color'] ?? '#000000');
    $status = sanitize($row['status'] ?? 'active');
    $parent_company = isset($row['parent_company']) && $row['parent_company'] !== '' ? sanitize($row['parent_company']) : null;
    $acquired_by = isset($row['acquired_by']) && $row['acquired_by'] !== '' ? sanitize($row['acquired_by']) : null;
    $acquired_year = isset($row['acquired_year']) && $row['acquired_year'] !== '' ? (int)$row['acquired_year'] : null;

    if (empty($id) || empty($name)) {
        throw new Exception('ID and name are required');
    }

    $sql = "INSERT INTO companies (id, name, parent_company, color, status, acquired_by, acquired_year)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                parent_company = VALUES(parent_company),
                color = VALUES(color),
                status = VALUES(status),
                acquired_by = VALUES(acquired_by),
                acquired_year = VALUES(acquired_year),
                updated_at = CURRENT_TIMESTAMP";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssi', $id, $name, $parent_company, $color, $status, $acquired_by, $acquired_year);
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    return true;
}

function importEvent($conn, $row) {
    $id = isset($row['id']) && $row['id'] !== '' ? sanitize($row['id']) : null;
    $company_id = sanitize($row['company_id'] ?? '');
    $date = sanitize($row['date'] ?? '');
    $title = sanitize($row['title'] ?? '');
    $category = sanitize($row['category'] ?? '');
    $description = isset($row['description']) && $row['description'] !== '' ? sanitize($row['description']) : null;
    $subcategory = isset($row['subcategory']) && $row['subcategory'] !== '' ? sanitize($row['subcategory']) : null;

    if (empty($company_id) || empty($date) || empty($title) || empty($category)) {
        throw new Exception('company_id, date, title and category are required');
    }

    if ($id) {
        $sql = "INSERT INTO events (id, company_id, date, title, description, category, subcategory)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    company_id = VALUES(company_id),
                    date = VALUES(date),
                    title = VALUES(title),
                    description = VALUES(description),
                    category = VALUES(category),
                    subcategory = VALUES(subcategory),
                    updated_at = CURRENT_TIMESTAMP";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssssss', $id, $company_id, $date, $title, $description, $category, $subcategory);
    } else {
        $sql = "INSERT INTO events (company_id, date, title, description, category, subcategory)
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssss', $company_id, $date, $title, $description, $category, $subcategory);
    }
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    return true;
}

function importFounder($conn, $row) {
    $id = isset($row['id']) && $row['id'] !== '' ? sanitize($row['id']) : null;
    $company_id = sanitize($row['company_id'] ?? '');
    $name = sanitize($row['name'] ?? '');
    $status = sanitize($row['status'] ?? 'active');
    $role = isset($row['role']) && $row['role'] !== '' ? sanitize($row['role']) : null;
    $period = isset($row['period']) && $row['period'] !== '' ? sanitize($row['period']) : null;
    $ownership = isset($row['ownership']) && $row['ownership'] !== '' ? sanitize($row['ownership']) : null;
    $background = isset($row['background']) && $row['background'] !== '' ? sanitize($row['background']) : null;
    $current_activity = isset($row['current_activity']) && $row['current_activity'] !== '' ? sanitize($row['current_activity']) : null;

    if (empty($company_id) || empty($name)) {
        throw new Exception('company_id and name are required');
    }

    if ($id) {
        $sql = "INSERT INTO founders (id, company_id, name, role, period, status, ownership, background, current_activity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    company_id = VALUES(company_id),
                    name = VALUES(name),
                    role = VALUES(role),
                    period = VALUES(period),
                    status = VALUES(status),
                    ownership = VALUES(ownership),
                    background = VALUES(background),
                    current_activity = VALUES(current_activity),
                    updated_at = CURRENT_TIMESTAMP";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssssssss', $id, $company_id, $name, $role, $period, $status, $ownership, $background, $current_activity);
    } else {
        $sql = "INSERT INTO founders (company_id, name, role, period, status, ownership, background, current_activity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssssss', $company_id, $name, $role, $period, $status, $ownership, $background, $current_activity);
    }
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    return true;
}

function importIPO($conn, $row) {
    $id = isset($row['id']) && $row['id'] !== '' ? sanitize($row['id']) : null;
    $company_id = sanitize($row['company_id'] ?? '');
    $type = strtolower(sanitize($row['type'] ?? 'ipo'));
    $date = sanitize($row['date'] ?? '');
    $valuation = isset($row['valuation']) && $row['valuation'] !== '' ? sanitize($row['valuation']) : null;
    $raised = isset($row['raised']) && $row['raised'] !== '' ? sanitize($row['raised']) : null;
    $revenue = isset($row['revenue']) && $row['revenue'] !== '' ? sanitize($row['revenue']) : null;
    $shares = isset($row['shares']) && $row['shares'] !== '' ? sanitize($row['shares']) : null;
    $exchange = isset($row['exchange']) && $row['exchange'] !== '' ? sanitize($row['exchange']) : null;
    $ticker = isset($row['ticker']) && $row['ticker'] !== '' ? sanitize($row['ticker']) : null;
    $price = isset($row['price']) && $row['price'] !== '' ? sanitize($row['price']) : null;
    $prospectus = isset($row['prospectus']) && $row['prospectus'] !== '' ? sanitize($row['prospectus']) : null;
    $market_position = isset($row['market_position']) && $row['market_position'] !== '' ? sanitize($row['market_position']) : null;

    if (empty($company_id) || empty($date)) {
        throw new Exception('company_id and date are required');
    }

    if ($id) {
        $sql = "INSERT INTO ipo (id, company_id, type, date, valuation, raised, revenue, shares, exchange, ticker, price, prospectus, market_position)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    company_id = VALUES(company_id),
                    type = VALUES(type),
                    date = VALUES(date),
                    valuation = VALUES(valuation),
                    raised = VALUES(raised),
                    revenue = VALUES(revenue),
                    shares = VALUES(shares),
                    exchange = VALUES(exchange),
                    ticker = VALUES(ticker),
                    price = VALUES(price),
                    prospectus = VALUES(prospectus),
                    market_position = VALUES(market_position),
                    updated_at = CURRENT_TIMESTAMP";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssssssssssss', $id, $company_id, $type, $date, $valuation, $raised, $revenue, $shares, $exchange, $ticker, $price, $prospectus, $market_position);
    } else {
        $sql = "INSERT INTO ipo (company_id, type, date, valuation, raised, revenue, shares, exchange, ticker, price, prospectus, market_position)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssssssssss', $company_id, $type, $date, $valuation, $raised, $revenue, $shares, $exchange, $ticker, $price, $prospectus, $market_position);
    }
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    return true;
}

function importFinancial($conn, $row) {
    $id = isset($row['id']) && $row['id'] !== '' ? sanitize($row['id']) : null;
    $company_id = sanitize($row['company_id'] ?? '');
    $year = (int)($row['year'] ?? 0);
    $quarter = isset($row['quarter']) && $row['quarter'] !== '' ? (int)$row['quarter'] : null;
    $revenue = isset($row['revenue']) && $row['revenue'] !== '' ? (float)$row['revenue'] : null;
    $profit = isset($row['profit']) && $row['profit'] !== '' ? (float)$row['profit'] : null;
    $margin = isset($row['margin']) && $row['margin'] !== '' ? (float)$row['margin'] : null;
    $store_count = isset($row['store_count']) && $row['store_count'] !== '' ? (int)$row['store_count'] : null;

    if (empty($company_id) || $year < 1990) {
        throw new Exception('company_id and valid year are required');
    }

    if ($id) {
        $sql = "INSERT INTO financials (id, company_id, year, quarter, revenue, profit, margin, store_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    company_id = VALUES(company_id),
                    year = VALUES(year),
                    quarter = VALUES(quarter),
                    revenue = VALUES(revenue),
                    profit = VALUES(profit),
                    margin = VALUES(margin),
                    store_count = VALUES(store_count),
                    updated_at = CURRENT_TIMESTAMP";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssiiiddi', $id, $company_id, $year, $quarter, $revenue, $profit, $margin, $store_count);
    } else {
        $sql = "INSERT INTO financials (company_id, year, quarter, revenue, profit, margin, store_count)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('siidddi', $company_id, $year, $quarter, $revenue, $profit, $margin, $store_count);
    }
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    return true;
}

function importMA($conn, $row) {
    $id = sanitize($row['id'] ?? '');
    $date = sanitize($row['date'] ?? '');
    $buyer = sanitize($row['buyer'] ?? '');
    $target = sanitize($row['target'] ?? '');
    $value = isset($row['value']) && $row['value'] !== '' ? sanitize($row['value']) : null;
    $description = isset($row['description']) && $row['description'] !== '' ? sanitize($row['description']) : null;

    if (empty($id) || empty($date) || empty($buyer) || empty($target)) {
        throw new Exception('id, date, buyer and target are required');
    }

    $sql = "INSERT INTO ma_events (id, date, buyer, target, value, description)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                date = VALUES(date),
                buyer = VALUES(buyer),
                target = VALUES(target),
                value = VALUES(value),
                description = VALUES(description),
                updated_at = CURRENT_TIMESTAMP";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssss', $id, $date, $buyer, $target, $value, $description);
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    return true;
}
