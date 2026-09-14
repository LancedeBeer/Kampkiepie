<?php
// mail-relay.php — internal endpoint for KampKiepie GAS booking confirmations
// Called only by KKAdminBackend.gs via UrlFetchApp POST. Not meant for browser use.

header('Content-Type: application/json');

$SHARED_SECRET = 'f61d0f365331b7e9e2cb5462c98e52d9042f44f9a047751f433cf63cfc909b25';
// Must match the MAIL_RELAY_SECRET Script Property in KKAdminBackend.gs

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || !isset($data['secret']) || !hash_equals($SHARED_SECRET, (string)$data['secret'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'unauthorized']);
    exit;
}

$toRaw   = trim((string)($data['to'] ?? ''));
$subject = trim((string)($data['subject'] ?? ''));
$html    = (string)($data['html'] ?? '');
$ccRaw   = trim((string)($data['cc'] ?? ''));
$replyTo = filter_var($data['replyTo'] ?? 'noreply@kampkiepie.co.za', FILTER_VALIDATE_EMAIL);

if (!$toRaw || !$subject || !$html) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'missing fields']);
    exit;
}

// Validate every recipient in a comma-separated "to" list
$toList = array_filter(array_map('trim', explode(',', $toRaw)));
foreach ($toList as $addr) {
    if (!filter_var($addr, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'invalid recipient: ' . $addr]);
        exit;
    }
}
$to = implode(', ', $toList);

$fromAddr = 'noreply@kampkiepie.co.za';
$fromName = 'KampKiepie';

$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = "From: {$fromName} <{$fromAddr}>";
if ($replyTo) $headers[] = "Reply-To: {$replyTo}";

if ($ccRaw) {
    $ccList = array_filter(array_map('trim', explode(',', $ccRaw)));
    $validCc = array_filter($ccList, function($a) { return filter_var($a, FILTER_VALIDATE_EMAIL); });
    if ($validCc) $headers[] = 'Cc: ' . implode(', ', $validCc);
}

$ok = mail($to, $subject, $html, implode("\r\n", $headers));

echo json_encode(['ok' => $ok]);