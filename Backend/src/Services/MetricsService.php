<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Builder;

final class MetricsService
{
    /**
     * @return array<string, int>
     */
    public function getSummary(): array
    {
        return [
            'employees_total' => $this->countFrom('employees'),
            'vacations_pending' => $this->countFrom('vacation_requests', fn ($query) => $query->whereIn('state', ['pendiente_jefe', 'pendiente_gerencia', 'pendiente_admin'])),
            'departments_total' => $this->countFrom('departments'),
            'users_total' => $this->countFrom('users'),
        ];
    }

    private function countFrom(string $table, ?callable $constraint = null): int
    {
        if (!$this->schema()->hasTable($table)) {
            return 0;
        }

        $query = Capsule::table($table);
        if ($constraint) {
            $constraint($query);
        }

        return (int) $query->count();
    }

    private function schema(): Builder
    {
        return Capsule::schema();
    }
}
