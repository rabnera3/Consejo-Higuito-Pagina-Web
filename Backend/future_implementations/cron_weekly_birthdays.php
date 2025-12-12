<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use Illuminate\Database\Capsule\Manager as DB;
use Carbon\Carbon;

// Set locale to Spanish
Carbon::setLocale('es');

echo "Checking for weekly birthdays...\n";

// 1. Get current week range
$now = Carbon::now();
$startOfWeek = $now->copy()->startOfWeek(); // Monday
$endOfWeek = $now->copy()->endOfWeek();     // Sunday

echo "Week: " . $startOfWeek->toDateString() . " to " . $endOfWeek->toDateString() . "\n";

// 2. Find employees with birthdays this week
$employees = DB::table('employees')
    ->whereNotNull('birth_date')
    ->where('employment_status', 'Activa')
    ->get();

$birthdays = [];

// Create a period for the current week to compare against
$period = \Carbon\CarbonPeriod::create($startOfWeek, $endOfWeek);

foreach ($employees as $emp) {
    try {
        $bday = Carbon::parse($emp->birth_date);
        
        foreach ($period as $date) {
            if ($date->month === $bday->month && $date->day === $bday->day) {
                $birthdays[] = [
                    'name' => $emp->full_name,
                    'date' => $date->copy(),
                    'day_name' => $date->locale('es')->dayName
                ];
            }
        }
    } catch (\Exception $e) {
        continue;
    }
}

if (empty($birthdays)) {
    echo "No birthdays this week.\n";
    exit;
}

// Sort birthdays by date
usort($birthdays, function($a, $b) {
    return $a['date']->timestamp <=> $b['date']->timestamp;
});

// 3. Construct Message
$msg = "🎉 ¡Cumpleaños de esta semana! 🎂\n\n";
foreach ($birthdays as $b) {
    $msg .= "• " . $b['name'] . " - " . ucfirst($b['day_name']) . " " . $b['date']->format('d/m') . "\n";
}

echo "Message:\n$msg\n";

// 4. Send to all active employees
$activeEmployees = DB::table('employees')->where('employment_status', 'Activa')->pluck('id');

$count = 0;
foreach ($activeEmployees as $empId) {
    // Check duplicate for this week to avoid spam
    $exists = DB::table('notifications')
        ->where('user_id', $empId)
        ->where('type', 'birthday_alert')
        ->where('created_at', '>=', $startOfWeek->toDateTimeString())
        ->exists();

    if (!$exists) {
        DB::table('notifications')->insert([
            'user_id' => $empId,
            'type' => 'birthday_alert',
            'title' => '🎂 Cumpleaños de la Semana',
            'message' => $msg,
            'created_at' => Carbon::now(),
            'read_at' => null
        ]);
        $count++;
    }
}

echo "Sent $count notifications.\n";
