<?php
require __DIR__ . '/vendor/autoload.php';

try {
    $app = require __DIR__ . '/bootstrap/app.php';
    echo "Bootstrap successful\n";
} catch (Throwable $e) {
    echo "Bootstrap failed: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
