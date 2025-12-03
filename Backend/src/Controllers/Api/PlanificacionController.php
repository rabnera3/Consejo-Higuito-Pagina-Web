<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Services\PlanningReminderService;
use Illuminate\Database\Capsule\Manager as DB;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class PlanificacionController
{
    public function index(Request $request, Response $response): Response
    {
        try {
            $plans = DB::table('planificacion_semanal as p')
                ->leftJoin('employees as e', 'p.empleado_id', '=', 'e.id')
                ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
                ->select('p.*', 'e.full_name as empleado_nombre', 'd.name as departamento', 'e.department_id')
                ->orderBy('p.fecha', 'DESC')
                ->get();

            // Check for missing planning days and notify
            $user = $request->getAttribute('user');
            if ($user) {
                (new PlanningReminderService())->checkAndNotify($user);
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $plans
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error al obtener planificación: ' . $e->getMessage()
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function store(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            // Validar si ya existe planificación para este empleado en esta fecha
            $exists = DB::table('planificacion_semanal')
                ->where('empleado_id', $data['empleado_id'])
                ->where('fecha', $data['fecha'])
                ->exists();

            if ($exists) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Ya existe una planificación para esta fecha. Edite la existente o elija otra fecha.'
                ]));

                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            DB::table('planificacion_semanal')->insert([
                'empleado_id' => $data['empleado_id'],
                'fecha' => $data['fecha'],
                'lugar' => $data['lugar'],
                'sector_trabajo' => $data['sector_trabajo'],
                'area' => $data['area'],
                'recursos' => $data['recursos'],
                'linea_servicio' => $data['linea_servicio'],
                'duracion' => $data['duracion'] ?? '',
                'descripcion' => $data['descripcion'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Planificación guardada correctamente'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error al guardar: ' . $e->getMessage()
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $id = $args['id'];
            $data = $request->getParsedBody();

            // Validar si ya existe planificación para este empleado en esta fecha (excluyendo el actual)
            $exists = DB::table('planificacion_semanal')
                ->where('empleado_id', $data['empleado_id'])
                ->where('fecha', $data['fecha'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'Ya existe otra planificación para esta fecha.'
                ]));

                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            DB::table('planificacion_semanal')
                ->where('id', $id)
                ->update([
                    'empleado_id' => $data['empleado_id'],
                    'fecha' => $data['fecha'],
                    'lugar' => $data['lugar'],
                    'sector_trabajo' => $data['sector_trabajo'],
                    'area' => $data['area'],
                    'recursos' => $data['recursos'],
                    'linea_servicio' => $data['linea_servicio'],
                    'duracion' => $data['duracion'] ?? '',
                    'descripcion' => $data['descripcion'],
                    'updated_at' => date('Y-m-d H:i:s')
                ]);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Planificación actualizada'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error al actualizar: ' . $e->getMessage()
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $id = $args['id'];

            DB::table('planificacion_semanal')
                ->where('id', $id)
                ->delete();

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Planificación eliminada'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error al eliminar: ' . $e->getMessage()
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function byEmployee(Request $request, Response $response, array $args): Response
    {
        try {
            $employeeId = $args['id'];

            $plans = DB::table('planificacion_semanal as p')
                ->leftJoin('employees as e', 'p.empleado_id', '=', 'e.id')
                ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
                ->select('p.*', 'e.full_name as empleado_nombre', 'd.name as departamento', 'e.department_id')
                ->where('p.empleado_id', $employeeId)
                ->orderBy('p.fecha', 'DESC')
                ->get();

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $plans
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function byUnit(Request $request, Response $response): Response
    {
        try {
            $user = $request->getAttribute('user');
            if (!$user || !isset($user['department_id'])) {
                $response->getBody()->write(json_encode(['error' => 'Unauthorized or no department assigned']));
                return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
            }

            $departmentId = $user['department_id'];

            $plans = DB::table('planificacion_semanal as p')
                ->leftJoin('employees as e', 'p.empleado_id', '=', 'e.id')
                ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
                ->select('p.*', 'e.full_name as empleado_nombre', 'd.name as departamento', 'e.department_id')
                ->where('e.department_id', $departmentId)
                ->orderBy('p.fecha', 'DESC')
                ->get();

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $plans
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }
}
