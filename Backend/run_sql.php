<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

// Bootstraps dotenv + config + DB (Illuminate Capsule)
require __DIR__ . '/bootstrap/app.php';

use Illuminate\Database\Capsule\Manager as DB;

$path = $argv[1] ?? null;
if (!$path) {
    fwrite(STDERR, "Usage: php run_sql.php <path-to-sql>\n");
    exit(2);
}

$sqlFile = realpath(__DIR__ . DIRECTORY_SEPARATOR . $path) ?: realpath($path);
if (!$sqlFile || !is_file($sqlFile)) {
    fwrite(STDERR, "SQL file not found: {$path}\n");
    exit(2);
}

$sql = file_get_contents($sqlFile);
if ($sql === false) {
    fwrite(STDERR, "Unable to read SQL file: {$sqlFile}\n");
    exit(2);
}

// Remove BOM if present
$sql = preg_replace('/^\xEF\xBB\xBF/', '', $sql);

try {
    DB::connection()->getPdo();
} catch (Throwable $e) {
    fwrite(STDERR, "DB connection failed: " . $e->getMessage() . "\n");
    exit(1);
}

try {
    // Try as a whole (fast path)
    DB::unprepared($sql);
    fwrite(STDOUT, "Executed: {$path}\n");
    exit(0);
} catch (Throwable $e) {
    // Fallback: split on semicolons at line ends (sufficient for our simple migrations)
    $lines = preg_split("/\r\n|\n|\r/", $sql);
    $statements = [];
    $buffer = '';

    foreach ($lines as $line) {
        // Strip full-line comments
        if (preg_match('/^\s*--/', $line)) {
            continue;
        }
        $buffer .= $line . "\n";
        if (preg_match('/;\s*$/', trim($line))) {
            $stmt = trim($buffer);
            $buffer = '';
            if ($stmt !== '') {
                $statements[] = $stmt;
            }
        }
    }

    $buffer = trim($buffer);
    if ($buffer !== '') {
        $statements[] = $buffer;
    }

    try {
        foreach ($statements as $stmt) {
            DB::unprepared($stmt);
        }
        fwrite(STDOUT, "Executed (split mode): {$path}\n");
        exit(0);
    } catch (Throwable $e2) {
        fwrite(STDERR, "SQL execution failed: " . $e2->getMessage() . "\n");
        exit(1);
    }
}
