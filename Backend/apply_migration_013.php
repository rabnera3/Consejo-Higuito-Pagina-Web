<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use Illuminate\Database\Capsule\Manager as DB;

try {
    DB::statement("ALTER TABLE requests ADD COLUMN start_date DATE NULL AFTER description");
    DB::statement("ALTER TABLE requests ADD COLUMN end_date DATE NULL AFTER start_date");
    echo "Migration applied successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
