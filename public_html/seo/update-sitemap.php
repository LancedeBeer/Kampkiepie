<?php
/**
 * KampKiepie – Sitemap file updater
 * Called by admin.html (superadmin only) after generating sitemap XML via GAS.
 * Secured by a shared secret stored in config.txt (sitemap_secret key).
 *
 * Usage: POST with fields:
 *   key  – must match sitemap_secret in config.txt
 *   xml  – the full sitemap XML string
 *   file – optional filename, defaults to sitemap-resorts.xml
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ── Read the secret from config.txt ─────────────────────────────────────────
$configFile = __DIR__ . '/config.txt';
$secret = '';
if (file_exists($configFile)) {
    foreach (file($configFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), 'sitemap_secret') === 0) {
            $parts = explode(':', $line, 2);
            if (isset($parts[1])) $secret = trim($parts[1]);
            break;
        }
    }
}

if (empty($secret)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'sitemap_secret not configured in config.txt']);
    exit;
}

// ── Validate the request ─────────────────────────────────────────────────────
$providedKey = $_POST['key'] ?? '';
if (!hash_equals($secret, $providedKey)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorised']);
    exit;
}

$xml = $_POST['xml'] ?? '';
if (empty(trim($xml))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No XML content provided']);
    exit;
}

// Only allow safe filenames
$allowedFiles = ['sitemap-resorts.xml', 'sitemap.xml'];
$filename = $_POST['file'] ?? 'sitemap-resorts.xml';
if (!in_array($filename, $allowedFiles, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid filename']);
    exit;
}

// ── Write the file ───────────────────────────────────────────────────────────
$targetPath = __DIR__ . '/' . $filename;
$bytes = file_put_contents($targetPath, $xml);

if ($bytes === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not write ' . $filename . ' — check folder permissions']);
    exit;
}

echo json_encode([
    'success'  => true,
    'file'     => $filename,
    'bytes'    => $bytes,
    'updated'  => date('Y-m-d H:i:s T')
]);