<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\Notification;
use Illuminate\Database\Capsule\Manager as DB;

class PlanningReminderService
{
    public function checkAndNotify(array $user): void
    {
        file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " PlanningReminder: Checking for user {$user['email']} ({$user['role']})\n", FILE_APPEND);

        // Skip for managers who don't need to plan
        if (($user['role'] ?? '') === 'gerente') {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " PlanningReminder: Skipped (gerente)\n", FILE_APPEND);
            return;
        }

        $userId = $user['id'];
        $employeeId = $user['employee_id'] ?? null;

        if (!$employeeId) {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " PlanningReminder: No employee_id for user {$user['email']}\n", FILE_APPEND);
            return;
        }

        $today = new \DateTime();
        
        // Calculate current week's Monday
        // If today is Sunday (0), we want the Monday of the *current* week (6 days ago), 
        // but usually business logic considers Monday as start of week.
        // 'monday this week' works well.
        $monday = new \DateTime('monday this week');
        
        // Generate required dates (Mon-Fri)
        $weekDates = [];
        for ($i = 0; $i < 5; $i++) {
            $d = clone $monday;
            $d->modify("+$i days");
            $weekDates[] = $d->format('Y-m-d');
        }

        // Fetch user's plans for this week
        // We use raw query or model if available. Assuming 'planificacion' table.
        // Let's use DB builder since we don't have a Planificacion model file handy in the context, 
        // or we can check if one exists. 
        // Checking previous file lists, I didn't see a Planificacion model in src/Models, 
        // but the controller uses DB table directly or maybe I missed it.
        // Let's use DB::table('planificacion') for safety.
        
        $existingPlans = DB::table('planificacion_semanal')
            ->where('empleado_id', $employeeId)
            ->whereIn('fecha', $weekDates)
            ->pluck('fecha')
            ->toArray();

        $missingDates = array_diff($weekDates, $existingPlans);
        
        file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " PlanningReminder: Found " . count($missingDates) . " missing dates\n", FILE_APPEND);

        if (empty($missingDates)) {
            return;
        }

        // Check if we already notified this user about THIS week's planning recently
        // To avoid spam, we check if there is an UNREAD notification of type 'planning_reminder'
        // created in the last 24 hours? Or just any unread one?
        // Let's say: if there is ANY unread planning_reminder, don't send another.
        
        $hasUnread = Notification::where('user_id', $userId)
            ->where('type', 'planning_reminder')
            ->whereNull('read_at')
            ->exists();

        if ($hasUnread) {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " PlanningReminder: Skipped (already has unread)\n", FILE_APPEND);
            return;
        }

        file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " PlanningReminder: Creating notification\n", FILE_APPEND);

        // Create notification
        $count = count($missingDates);
        $s = $count === 1 ? '' : 's';
        
        // Format missing dates for display (optional, or just store raw)
        // Let's store them in 'data' so frontend can use them if needed, 
        // but also make a nice message.
        
        Notification::create([
            'user_id' => $userId,
            'type' => 'planning_reminder',
            'title' => 'Recordatorio de Planificación',
            'message' => "Tienes $count día$s pendiente$s de planificación para esta semana.",
            'data' => json_encode(['missing_dates' => array_values($missingDates)]),
            'created_at' => new \DateTime()
        ]);
    }
}
