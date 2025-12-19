<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use App\Models\Role;

final class EmployeesService
{
    /**
     * Opciones para selects de filtro.
     */
    public function filters(): array
    {
        $municipios = Employee::query()
            ->whereNotNull('municipio')
            ->distinct()
            ->orderBy('municipio')
            ->pluck('municipio')
            ->filter()
            ->values()
            ->all();

        $departamentos = Department::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(static fn ($department) => [
                'id' => (int) $department->id,
                'name' => $department->name,
            ])
            ->all();

        $estados = Employee::query()
            ->whereNotNull('employment_status')
            ->distinct()
            ->orderBy('employment_status')
            ->pluck('employment_status')
            ->filter()
            ->values()
            ->all();

        return [
            'municipios' => $municipios,
            'departamentos' => $departamentos,
            'estados' => $estados,
        ];
    }

    /**
     * Devuelve listado filtrado de colaboradores.
     */
    public function listEmployees(array $filters, ?array $user = null): array
    {
        $query = Employee::query()->with('department');
        $scope = $filters['scope'] ?? 'all';
        unset($filters['scope']);
        $appliedScopedFilter = false;

        $search = trim((string) ($filters['q'] ?? ''));
        if ($search !== '') {
            $query->where(static function ($builder) use ($search): void {
                $builder->where('full_name', 'like', "%{$search}%")
                    ->orWhere('job_title', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['municipio'])) {
            $query->where('municipio', $filters['municipio']);
        }

        if (!empty($filters['departamento'])) {
            $query->where('department_id', (int) $filters['departamento']);
            $appliedScopedFilter = true;
        }

        if (!$appliedScopedFilter && $scope !== 'all' && $user && !empty($user['department_id'])) {
            $query->where('department_id', (int) $user['department_id']);
        }

        $sort = $filters['sort'] ?? 'az';
        $query->orderBy('full_name', $sort === 'za' ? 'desc' : 'asc');

        return $query->get()->map(function (Employee $employee): array {
            return [
                'id' => $employee->id,
                'nombre' => $employee->full_name,
                'rol' => $employee->job_title,
                'telefono' => $employee->phone,
                'municipio' => $employee->municipio,
                'departamento' => $employee->department->name ?? null,
                'departamentoId' => $employee->department_id ? (int) $employee->department_id : null,
                'estado' => $employee->employment_status ?? 'Activa',
                'email' => $employee->email,
                'foto' => $employee->photo_url,
                'cedula' => $employee->cedula,
                'diasVacaciones' => $employee->vacation_days_balance,
                'fechaIngreso' => $employee->hire_date,
                'fechaNacimiento' => $employee->birth_date,
            ];
        })->all();
    }

    /**
     * Obtiene un empleado por ID.
     */
    public function getEmployeeById(int $id): ?array
    {
        $employee = Employee::query()->with('department')->find($id);

        if (!$employee) {
            return null;
        }

        return [
            'id' => $employee->id,
            'nombre' => $employee->full_name,
            'rol' => $employee->job_title,
            'telefono' => $employee->phone,
            'municipio' => $employee->municipio,
            'departamento' => $employee->department->name ?? null,
            'estado' => $employee->employment_status ?? 'Activa',
            'email' => $employee->email,
            'foto' => $employee->photo_url,
            'address' => $employee->address,
            'emergency_contact_name' => $employee->emergency_contact_name,
            'emergency_contact_phone' => $employee->emergency_contact_phone,
            'fecha_nacimiento' => $employee->birth_date,
            'genero' => $employee->gender,
            'dni' => $employee->cedula,
            'fecha_contratacion' => $employee->hire_date,
            'dias_vacaciones' => $employee->vacation_days_balance,
        ];
    }
    public function updateEmployee(int $id, array $data): bool
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return false;
        }

        $fillable = ['phone', 'municipio', 'photo_url', 'address', 'emergency_contact_name', 'emergency_contact_phone', 'birth_date', 'gender', 'cedula', 'job_title'];
        $updateData = array_intersect_key($data, array_flip($fillable));

        // Sanitize birth_date
        if (isset($updateData['birth_date']) && $updateData['birth_date'] === '') {
            $updateData['birth_date'] = null;
        }

        // Map dni to cedula if present in input but not yet in updateData
        if (isset($data['dni'])) {
            $updateData['cedula'] = $data['dni'];
        }

        if (empty($updateData)) {
            return true; // Nothing to update
        }

        return $employee->update($updateData);
    }

    public function uploadPhoto(int $id, $file): string
    {
        $employee = Employee::find($id);
        if (!$employee) {
            throw new \RuntimeException('Empleado no encontrado');
        }

        if ($file->getError() !== UPLOAD_ERR_OK) {
            throw new \RuntimeException('Error en la subida del archivo');
        }

        $filename = sprintf(
            'profile_%d_%s.%s',
            $id,
            uniqid(),
            pathinfo($file->getClientFilename(), PATHINFO_EXTENSION)
        );

        $uploadDir = __DIR__ . '/../../public/uploads/profiles';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $file->moveTo($uploadDir . DIRECTORY_SEPARATOR . $filename);
        
        $photoUrl = '/uploads/profiles/' . $filename;
        $employee->update(['photo_url' => $photoUrl]);

        return $photoUrl;
    }

    /**
     * Crear un nuevo empleado con su usuario asociado
     */
    public function createEmployee(array $data): array
    {
        // Verificar si el email ya existe
        $existingUser = User::where('email', $data['email'])->first();
        if ($existingUser) {
            throw new \RuntimeException('Ya existe un usuario con ese correo electrónico');
        }

        // Obtener rol (por defecto 'empleado')
        $roleName = $data['role'] ?? 'empleado';
        $role = Role::where('slug', $roleName)->orWhere('name', $roleName)->first();
        if (!$role) {
            $role = Role::where('slug', 'empleado')->first();
        }

        // Crear usuario
        $user = User::create([
            'name' => $data['full_name'],
            'email' => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role_id' => $role->id,
            'department_id' => !empty($data['department_id']) ? (int) $data['department_id'] : null,
            'status' => 'active',
        ]);

        // Crear empleado
        $employee = Employee::create([
            'user_id' => $user->id,
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'job_title' => $data['job_title'] ?? null,
            'department_id' => !empty($data['department_id']) ? (int) $data['department_id'] : null,
            'municipio' => $data['municipio'] ?? null,
            'phone' => $data['phone'] ?? null,
            'cedula' => $data['cedula'] ?? null,
            'hire_date' => $data['hire_date'] ?? date('Y-m-d'),
            'employment_status' => 'Activa',
            'vacation_days_balance' => 0,
        ]);

        return [
            'id' => $employee->id,
            'user_id' => $user->id,
            'nombre' => $employee->full_name,
            'email' => $employee->email,
            'rol' => $role->name,
        ];
    }
}
