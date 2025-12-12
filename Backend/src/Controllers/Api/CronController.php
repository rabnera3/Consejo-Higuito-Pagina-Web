<?php

namespace App\Controllers\Api;

use Illuminate\Database\Capsule\Manager as DB;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Notification;

class CronController
{
    public function closeWeeklyPlanning(Request $request, Response $response): Response
    {
        try {
            // 1. Determine Week Range (Monday to Friday of current week)
            $today = new \DateTime();
            $dayOfWeek = $today->format('N'); // 1 (Mon) to 7 (Sun)
            
            // Calculate Monday of this week
            $monday = clone $today;
            $monday->modify('-' . ($dayOfWeek - 1) . ' days');
            
            $weekDates = [];
            for ($i = 0; $i < 5; $i++) {
                $d = clone $monday;
                $d->modify('+' . $i . ' days');
                $weekDates[] = $d->format('Y-m-d');
            }

            // 2. Get all active employees (excluding Managers)
            $employees = DB::table('employees')
                ->join('users', 'employees.user_id', '=', 'users.id')
                ->join('roles', 'users.role_id', '=', 'roles.id')
                ->where('roles.slug', '!=', 'gerente')
                ->where('employees.employment_status', 'Activa')
                ->select('employees.id', 'employees.full_name', 'employees.department_id', 'employees.user_id')
                ->get();

            $countFilled = 0;

            foreach ($employees as $emp) {
                // Check existing plans for this week
                $existingPlans = DB::table('planificacion_semanal')
                    ->where('empleado_id', $emp->id)
                    ->whereIn('fecha', $weekDates)
                    ->pluck('fecha')
                    ->toArray();

                $missingDates = array_diff($weekDates, $existingPlans);

                if (!empty($missingDates)) {
                    // Fill missing dates
                    foreach ($missingDates as $date) {
                        DB::table('planificacion_semanal')->insert([
                            'empleado_id' => $emp->id,
                            'fecha' => $date,
                            'lugar' => 'N/A',
                            'sector_trabajo' => 'N/A',
                            'area' => 'N/A',
                            'recursos' => 'Ninguno',
                            'linea_servicio' => 'N/A',
                            'duracion' => 'N/A',
                            'descripcion' => 'No llenó planificación esta semana',
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ]);
                    }
                    $countFilled++;

                    // Notify Unit Head
                    // Find Jefe of this department
                    $jefe = DB::table('users')
                        ->join('roles', 'users.role_id', '=', 'roles.id')
                        ->where('users.department_id', $emp->department_id)
                        ->where('roles.slug', 'jefe')
                        ->select('users.id')
                        ->first();

                    if ($jefe) {
                        Notification::create([
                            'user_id' => $jefe->id,
                            'title' => 'Planificación Incompleta',
                            'message' => "El colaborador {$emp->full_name} no completó su planificación semanal. Se ha rellenado automáticamente.",
                            'type' => 'warning',
                            'data' => ['link' => "/portal/planificacion"]
                        ]);
                    }
                }
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => "Proceso completado. Se rellenaron planificaciones para {$countFilled} empleados."
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error en proceso cron: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
