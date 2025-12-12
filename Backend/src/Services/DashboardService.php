<?php

declare(strict_types=1);

namespace App\Services;

final class DashboardService
{
    /** @var array<string, array<string, mixed>> */
    private array $dashboards = [
        'gerente' => [
            'title' => 'Panel de Gerencia',
            'description' => 'Gestión integral del consejo intermunicipal.',
            'actions' => [
                ['label' => 'Panel Gerente', 'href' => '/panel/gerente', 'desc' => 'KPIs y métricas generales', 'primary' => true],
                ['label' => 'Administrar empleados', 'href' => '/admin/empleados', 'desc' => 'Gestión de personal y solicitudes'],
                ['label' => 'Directorio', 'href' => '/empleados', 'desc' => 'Consulta del equipo'],
                ['label' => 'Unidades', 'href' => '/unidades', 'desc' => 'Organización por departamentos'],
            ],
        ],
        'jefe' => [
            'title' => 'Panel de Jefatura',
            'description' => 'Supervisión de equipos y coordinación departamental.',
            'actions' => [
                ['label' => 'Mi Panel', 'href' => '/panel/jefe', 'desc' => 'Gestión del equipo', 'primary' => true],
                ['label' => 'Directorio', 'href' => '/empleados', 'desc' => 'Información del personal'],
                ['label' => 'Mi perfil', 'href' => '/panel/empleado', 'desc' => 'Datos y solicitudes'],
            ],
        ],
        'empleado' => [
            'title' => 'Mi Espacio',
            'description' => 'Servicios para empleados y atajos personales.',
            'actions' => [
                ['label' => 'Mi perfil', 'href' => '/panel/empleado', 'desc' => 'Ver datos y realizar solicitudes', 'primary' => true],
                ['label' => 'Directorio', 'href' => '/empleados', 'desc' => 'Conoce al equipo'],
            ],
        ],
    ];

    /**
     * @return array<string, mixed>
     */
    public function forRole(?int $roleId, ?string $roleSlug): array
    {
        $key = $roleSlug ?? $this->fallbackRole($roleId);
        return $this->dashboards[$key] ?? $this->dashboards['empleado'];
    }

    private function fallbackRole(?int $roleId): string
    {
        if ($roleId === 1 || $roleId === 2) {
            return 'gerente';
        }

        if ($roleId === 3) {
            return 'jefe';
        }

        return 'empleado';
    }
}
