<?php
require_once __DIR__ . '/New folder/core/connect.php';
$st = $conn->query("DESCRIBE account");
$cols = [];
while ($r = $st->fetch(PDO::FETCH_ASSOC)) {
    $cols[] = $r['Field'] . ' (' . $r['Type'] . ')';
}
echo implode("\n", $cols);
unlink(__FILE__);
