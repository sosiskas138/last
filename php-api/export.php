<?php
// Suppress PHP errors from being output
error_reporting(0);
ini_set('display_errors', 0);

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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

// Get parameters
$tables = isset($_GET['tables']) ? explode(',', $_GET['tables']) : [];
$format = $_GET['format'] ?? 'xlsx';
$dateFrom = $_GET['date_from'] ?? null;
$dateTo = $_GET['date_to'] ?? null;
$status = $_GET['status'] ?? null;

// Validate parameters
$allowedTables = ['companies', 'events', 'founders', 'ipo', 'financials', 'ma_events'];
$tables = array_filter($tables, function($t) use ($allowedTables) {
    return in_array(trim($t), $allowedTables);
});

if (empty($tables)) {
    sendError('No valid tables specified');
}

if (!in_array($format, ['xlsx', 'csv'])) {
    sendError('Invalid format. Use xlsx or csv');
}

// Connect to database
$conn = getDbConnection();

// Prepare export data
$exportData = [];

foreach ($tables as $table) {
    $table = trim($table);
    $data = exportTable($conn, $table, $dateFrom, $dateTo, $status);
    $exportData[$table] = $data;
}

$conn->close();

// Generate file
if ($format === 'csv') {
    // For CSV, we'll export the first table only or create a ZIP
    $firstTable = array_keys($exportData)[0];
    $data = $exportData[$firstTable];
    
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="export_' . $firstTable . '_' . date('Y-m-d') . '.csv"');
    
    $output = fopen('php://output', 'w');
    
    // UTF-8 BOM for Excel compatibility
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    if (!empty($data)) {
        // Headers
        fputcsv($output, array_keys($data[0]));
        
        // Data rows
        foreach ($data as $row) {
            fputcsv($output, array_values($row));
        }
    }
    
    fclose($output);
} else {
    // XLSX format - use simple XML approach (works without external libraries)
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="export_' . date('Y-m-d') . '.xlsx"');
    
    // Create a simple XLSX file structure
    outputXLSX($exportData);
}

function exportTable($conn, $table, $dateFrom, $dateTo, $status) {
    $data = [];
    $sql = "";
    
    switch ($table) {
        case 'companies':
            $sql = "SELECT id, name, parent_company, color, status, acquired_by, acquired_year, created_at, updated_at FROM companies";
            $conditions = [];
            if ($status && $status !== 'all') {
                $conditions[] = "status = '" . $conn->real_escape_string($status) . "'";
            }
            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY name";
            break;
            
        case 'events':
            $sql = "SELECT id, company_id, date, title, description, category, subcategory, created_at, updated_at FROM events";
            $conditions = [];
            if ($dateFrom) {
                $conditions[] = "date >= '" . $conn->real_escape_string($dateFrom) . "'";
            }
            if ($dateTo) {
                $conditions[] = "date <= '" . $conn->real_escape_string($dateTo) . "'";
            }
            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY date DESC";
            break;
            
        case 'founders':
            $sql = "SELECT id, company_id, name, role, period, status, ownership, background, current_activity, created_at, updated_at FROM founders";
            $conditions = [];
            if ($status && $status !== 'all') {
                $conditions[] = "status = '" . $conn->real_escape_string($status) . "'";
            }
            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY company_id, name";
            break;
            
        case 'ipo':
            $sql = "SELECT id, company_id, type, date, valuation, raised, revenue, shares, exchange, ticker, price, prospectus, market_position, created_at, updated_at FROM ipo";
            $conditions = [];
            if ($dateFrom) {
                $conditions[] = "date >= '" . $conn->real_escape_string($dateFrom) . "'";
            }
            if ($dateTo) {
                $conditions[] = "date <= '" . $conn->real_escape_string($dateTo) . "'";
            }
            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY date DESC";
            break;
            
        case 'financials':
            $sql = "SELECT id, company_id, year, quarter, revenue, profit, margin, store_count, created_at, updated_at FROM financials";
            $conditions = [];
            if ($dateFrom) {
                $year = substr($dateFrom, 0, 4);
                $conditions[] = "year >= " . intval($year);
            }
            if ($dateTo) {
                $year = substr($dateTo, 0, 4);
                $conditions[] = "year <= " . intval($year);
            }
            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY company_id, year DESC, quarter DESC";
            break;
            
        case 'ma_events':
            $sql = "SELECT id, date, buyer, target, value, description, created_at, updated_at FROM ma_events";
            $conditions = [];
            if ($dateFrom) {
                $conditions[] = "date >= '" . $conn->real_escape_string($dateFrom) . "'";
            }
            if ($dateTo) {
                $conditions[] = "date <= '" . $conn->real_escape_string($dateTo) . "'";
            }
            if (!empty($conditions)) {
                $sql .= " WHERE " . implode(' AND ', $conditions);
            }
            $sql .= " ORDER BY date DESC";
            break;
    }
    
    $result = $conn->query($sql);
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    
    return $data;
}

function outputXLSX($exportData) {
    // Simple XLSX generation using XML
    $zipFile = tempnam(sys_get_temp_dir(), 'xlsx');
    $zip = new ZipArchive();
    $zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE);
    
    // [Content_Types].xml
    $contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
    <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
    <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>';
    
    $sheetIndex = 1;
    foreach ($exportData as $table => $data) {
        $contentTypes .= '
    <Override PartName="/xl/worksheets/sheet' . $sheetIndex . '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
        $sheetIndex++;
    }
    
    $contentTypes .= '
</Types>';
    $zip->addFromString('[Content_Types].xml', $contentTypes);
    
    // _rels/.rels
    $rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>';
    $zip->addFromString('_rels/.rels', $rels);
    
    // xl/_rels/workbook.xml.rels
    $wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>';
    
    $sheetIndex = 1;
    foreach ($exportData as $table => $data) {
        $wbRels .= '
    <Relationship Id="rId' . ($sheetIndex + 2) . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' . $sheetIndex . '.xml"/>';
        $sheetIndex++;
    }
    
    $wbRels .= '
</Relationships>';
    $zip->addFromString('xl/_rels/workbook.xml.rels', $wbRels);
    
    // Collect all strings for shared strings
    $allStrings = [];
    $stringIndex = [];
    
    foreach ($exportData as $table => $data) {
        if (!empty($data)) {
            foreach (array_keys($data[0]) as $header) {
                if (!isset($stringIndex[$header])) {
                    $stringIndex[$header] = count($allStrings);
                    $allStrings[] = $header;
                }
            }
            foreach ($data as $row) {
                foreach ($row as $value) {
                    $strVal = (string)$value;
                    if (!is_numeric($value) && !isset($stringIndex[$strVal])) {
                        $stringIndex[$strVal] = count($allStrings);
                        $allStrings[] = $strVal;
                    }
                }
            }
        }
    }
    
    // xl/sharedStrings.xml
    $sharedStrings = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' . count($allStrings) . '" uniqueCount="' . count($allStrings) . '">';
    
    foreach ($allStrings as $str) {
        $sharedStrings .= '<si><t>' . htmlspecialchars($str, ENT_XML1, 'UTF-8') . '</t></si>';
    }
    
    $sharedStrings .= '</sst>';
    $zip->addFromString('xl/sharedStrings.xml', $sharedStrings);
    
    // xl/styles.xml
    $styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
    <fonts count="2">
        <font><sz val="11"/><name val="Calibri"/></font>
        <font><b/><sz val="11"/><name val="Calibri"/></font>
    </fonts>
    <fills count="2">
        <fill><patternFill patternType="none"/></fill>
        <fill><patternFill patternType="gray125"/></fill>
    </fills>
    <borders count="1">
        <border><left/><right/><top/><bottom/><diagonal/></border>
    </borders>
    <cellStyleXfs count="1">
        <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
    </cellStyleXfs>
    <cellXfs count="2">
        <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
        <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    </cellXfs>
</styleSheet>';
    $zip->addFromString('xl/styles.xml', $styles);
    
    // xl/workbook.xml
    $workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <sheets>';
    
    $sheetIndex = 1;
    $tableLabels = [
        'companies' => 'Компании',
        'events' => 'События',
        'founders' => 'Основатели',
        'ipo' => 'IPO-SPO',
        'financials' => 'Финансы',
        'ma_events' => 'MA-сделки'
    ];
    
    foreach ($exportData as $table => $data) {
        $label = $tableLabels[$table] ?? $table;
        $workbook .= '
        <sheet name="' . htmlspecialchars($label, ENT_XML1, 'UTF-8') . '" sheetId="' . $sheetIndex . '" r:id="rId' . ($sheetIndex + 2) . '"/>';
        $sheetIndex++;
    }
    
    $workbook .= '
    </sheets>
</workbook>';
    $zip->addFromString('xl/workbook.xml', $workbook);
    
    // Create worksheets
    $sheetIndex = 1;
    foreach ($exportData as $table => $data) {
        $sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
    <sheetData>';
        
        if (!empty($data)) {
            $headers = array_keys($data[0]);
            $colCount = count($headers);
            $rowCount = count($data) + 1;
            
            // Header row
            $sheet .= '<row r="1">';
            foreach ($headers as $colIdx => $header) {
                $colLetter = getColumnLetter($colIdx);
                $strIdx = $stringIndex[$header];
                $sheet .= '<c r="' . $colLetter . '1" t="s" s="1"><v>' . $strIdx . '</v></c>';
            }
            $sheet .= '</row>';
            
            // Data rows
            foreach ($data as $rowIdx => $row) {
                $rowNum = $rowIdx + 2;
                $sheet .= '<row r="' . $rowNum . '">';
                $colIdx = 0;
                foreach ($row as $value) {
                    $colLetter = getColumnLetter($colIdx);
                    $cellRef = $colLetter . $rowNum;
                    
                    if (is_numeric($value)) {
                        $sheet .= '<c r="' . $cellRef . '"><v>' . $value . '</v></c>';
                    } else {
                        $strVal = (string)$value;
                        $strIdx = $stringIndex[$strVal] ?? 0;
                        $sheet .= '<c r="' . $cellRef . '" t="s"><v>' . $strIdx . '</v></c>';
                    }
                    $colIdx++;
                }
                $sheet .= '</row>';
            }
        }
        
        $sheet .= '
    </sheetData>
</worksheet>';
        
        $zip->addFromString('xl/worksheets/sheet' . $sheetIndex . '.xml', $sheet);
        $sheetIndex++;
    }
    
    $zip->close();
    
    // Output the file
    readfile($zipFile);
    unlink($zipFile);
}

function getColumnLetter($index) {
    $letter = '';
    while ($index >= 0) {
        $letter = chr(($index % 26) + 65) . $letter;
        $index = floor($index / 26) - 1;
    }
    return $letter;
}
