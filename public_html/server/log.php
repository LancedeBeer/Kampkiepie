<?php
// log.php — KampKiepie deck access logger
// Upload to the same directory as deck.html on fridgehosting.
// Appends one line per access to deck_log.txt in the same folder.

header('Access-Control-Allow-Origin: *');   // allow the deck to call this cross-origin if needed
header('Content-Type: text/plain');

$resort = isset($_GET['resort']) ? trim($_GET['resort']) : '';

if ($resort === '') {
    http_response_code(204);  // no payload, nothing to log
    exit;
}

$log_file = __DIR__ . '/deck_log.txt';
$line     = date('Y-m-d H:i:s') . "\t" . $resort . PHP_EOL;

file_put_contents($log_file, $line, FILE_APPEND | LOCK_EX);

http_response_code(200);
echo 'ok';