<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use App\Models\User;

echo "Checking user with department_id = 6...\n";

// Try to find a user with department_id 6
$user = User::with('department')->where('department_id', 6)->first();

if ($user) {
    echo "User Found: " . $user->name . " (ID: " . $user->id . ")\n";
    echo "Department ID: " . $user->department_id . "\n";
    if ($user->department) {
        echo "Department Name: " . $user->department->name . "\n";
    } else {
        echo "Department relation is NULL. Check if department with ID 6 exists in 'departments' table.\n";
    }
} else {
    echo "No user found with department_id 6.\n";
}
