<?php

namespace App\Services;

use App\Models\Request;
use App\Models\Employee;
use App\Models\Notification;
use Carbon\Carbon;

class RequestsService
{
    public function createRequest(array $data): Request
    {
        $request = Request::create([
            'employee_id' => $data['employee_id'],
            'type' => $data['type'],
            'description' => $data['description'],
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'status' => 'pending_approval', // Initial status: Waiting for Chief
        ]);

        // Notify Chief (Jefe) of the employee's department
        $this->notifyChief($request);

        return $request;
    }

    public function getRequestsByEmployee(int $employeeId)
    {
        return Request::where('employee_id', $employeeId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getPendingForChief(int $departmentId)
    {
        return Request::where('status', 'pending_approval')
            ->whereHas('employee', function ($query) use ($departmentId) {
                $query->where('department_id', $departmentId);
            })
            ->with('employee')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function getPendingForManager()
    {
        return Request::where('status', 'pending_authorization')
            ->with('employee')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function getRequestsByUnit(int $departmentId)
    {
        return Request::whereHas('employee', function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
        })
            ->with('employee')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function approveByChief(int $requestId): bool
    {
        $request = Request::find($requestId);
        if (!$request || $request->status !== 'pending_approval') {
            return false;
        }

        $request->status = 'pending_authorization';
        $request->save();

        // Remove pending notifications for chief
        Notification::where('type', 'request_created')
            ->whereJsonContains('data->request_id', $requestId)
            ->delete();

        // Notify Manager
        $this->notifyManager($request);
        // Notify Employee
        $this->notifyEmployee($request, 'Tu solicitud ha sido aprobada por tu jefe y enviada a gerencia.');

        return true;
    }

    public function approveByManager(int $requestId): bool
    {
        $request = Request::with('employee')->find($requestId);
        if (!$request || $request->status !== 'pending_authorization') {
            return false;
        }

        // Calculate and deduct vacation days
        if ($request->type === 'vacaciones' && $request->start_date && $request->end_date) {
            $start = Carbon::parse($request->start_date);
            $end = Carbon::parse($request->end_date);
            
            // Calculate business days (excluding weekends)
            $days = 0;
            $period = \Carbon\CarbonPeriod::create($start, $end);
            foreach ($period as $date) {
                if (!$date->isWeekend()) {
                    $days++;
                }
            }
            
            if ($request->employee) {
                $request->employee->vacation_days_balance -= $days;
                $request->employee->save();
            }
        }

        $request->status = 'approved';
        $request->save();

        // Remove pending notifications for managers
        Notification::where('type', 'request_pending_auth')
            ->whereJsonContains('data->request_id', $requestId)
            ->delete();

        // Notify Administración (informativo)
        $this->notifyAdmin($request);
        // Notify Employee
        $this->notifyEmployee($request, 'Tu solicitud fue autorizada por gerencia. Administración ha sido notificada para seguimiento.');

        return true;
    }

    public function reject(int $requestId, string $reason): bool
    {
        $request = Request::find($requestId);
        if (!$request) {
            return false;
        }

        // Remove pending notifications based on current status
        if ($request->status === 'pending_approval') {
            Notification::where('type', 'request_created')
                ->whereJsonContains('data->request_id', $requestId)
                ->delete();
        } elseif ($request->status === 'pending_authorization') {
            Notification::where('type', 'request_pending_auth')
                ->whereJsonContains('data->request_id', $requestId)
                ->delete();
        }

        $request->status = 'rejected';
        $request->rejection_reason = $reason;
        $request->save();

        // Notify Employee
        $this->notifyEmployee($request, 'Tu solicitud ha sido rechazada. Razón: ' . $reason);

        return true;
    }

    public function getApprovedHistory(?string $startDate, ?string $endDate)
    {
        $query = Request::with('employee')
            ->where('status', 'approved')
            ->orderBy('updated_at', 'desc');

        if ($startDate) {
            $query->where('updated_at', '>=', Carbon::parse($startDate)->startOfDay());
        }

        if ($endDate) {
            $query->where('updated_at', '<=', Carbon::parse($endDate)->endOfDay());
        }

        return $query->get();
    }

    private function notifyChief(Request $request): void
    {
        $employee = Employee::find($request->employee_id);
        if (!$employee || !$employee->department_id)
            return;

        $chiefs = \App\Models\User::whereHas('role', function ($q) {
            $q->where('slug', 'jefe');
        })
            ->where('department_id', $employee->department_id)
            ->get();

        foreach ($chiefs as $chief) {
            Notification::create([
                'user_id' => $chief->id,
                'type' => 'request_created',
                'title' => 'Nueva Solicitud Pendiente',
                'message' => "El empleado {$employee->full_name} ha creado una solicitud de {$request->type}.",
                'data' => ['request_id' => $request->id],
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }

    private function notifyManager(Request $request): void
    {
        $employee = Employee::find($request->employee_id);
        $managers = \App\Models\User::whereHas('role', function ($q) {
            $q->where('slug', 'gerente');
        })->get();

        foreach ($managers as $manager) {
            Notification::create([
                'user_id' => $manager->id,
                'type' => 'request_pending_auth',
                'title' => 'Solicitud Pendiente de Autorización',
                'message' => "Solicitud de {$request->type} de {$employee->full_name} aprobada por jefatura.",
                'data' => ['request_id' => $request->id],
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }

    private function notifyAdmin(Request $request): void
    {
        $employee = Employee::find($request->employee_id);
        $admins = \App\Models\User::whereHas('role', function ($q) {
            $q->whereIn('slug', ['admin', 'administracion']);
        })->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'request_manager_finalized',
                'title' => 'Solicitud autorizada por gerencia',
                'message' => "Solicitud de {$request->type} de {$employee->full_name} fue aprobada y requiere solo seguimiento administrativo.",
                'data' => ['request_id' => $request->id],
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }

    private function notifyEmployee(Request $request, string $message): void
    {
        $employee = Employee::with('user')->find($request->employee_id);
        if (!$employee) {
            return;
        }

        $user = $employee->user;
        if (!$user && $employee->user_id) {
            $user = \App\Models\User::find($employee->user_id);
        }

        if (!$user) {
            $user = \App\Models\User::whereHas('employee', function ($query) use ($employee) {
                $query->where('id', $employee->id);
            })->first();
        }

        if (!$user) {
            return;
        }

        Notification::create([
            'user_id' => $user->id,
            'type' => 'request_update',
            'title' => 'Actualización de Solicitud',
            'message' => $message,
            'data' => ['request_id' => $request->id],
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }
}
