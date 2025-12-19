<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Services\EmployeesService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class EmployeesController
{
    private EmployeesService $service;

    public function __construct()
    {
        $this->service = new EmployeesService();
    }

    public function index(Request $request, Response $response): Response
    {
        $query = $request->getQueryParams();
        $filters = [
            'q' => trim((string) ($query['q'] ?? '')),
            'municipio' => $query['municipio'] ?? '',
            'departamento' => $query['departamento'] ?? '',
            'sort' => $query['sort'] ?? 'az',
            'scope' => $query['scope'] ?? 'all',
        ];

        /** @var array|null $user */
        $user = $request->getAttribute('user');

        $results = $this->service->listEmployees($filters, $user);
        $filterOptions = $this->service->filters();

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => [
                'employees' => $results,
                'filters' => $filterOptions,
            ],
        ]));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    /**
     * Crear nuevo empleado - Solo gerente puede crear
     */
    public function create(Request $request, Response $response): Response
    {
        /** @var array|null $user */
        $user = $request->getAttribute('user');
        
        // Verificar que solo gerente puede crear empleados
        $allowedRoles = ['gerente', 'gerencia'];
        if (!$user || !in_array($user['role'] ?? '', $allowedRoles)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Solo el gerente puede crear empleados'
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(403);
        }

        $data = (array) $request->getParsedBody();

        // Validaciones básicas
        $requiredFields = ['full_name', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => "El campo {$field} es requerido"
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
        }

        // Validar email formato
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'El formato del email no es válido'
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        try {
            $result = $this->service->createEmployee($data);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Empleado creado exitosamente',
                'data' => $result
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $id = (int) ($args['id'] ?? 0);

        if ($id <= 0) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'ID inválido',
            ]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        }

        $employee = $this->service->getEmployeeById($id);

        if (!$employee) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Empleado no encontrado',
            ]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(404);
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => $employee,
        ]));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }
    public function update(Request $request, Response $response, array $args): Response
    {
        $id = (int) ($args['id'] ?? 0);
        $data = (array) $request->getParsedBody();

        // Basic validation
        if ($id <= 0) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'ID inválido']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        try {
            $success = $this->service->updateEmployee($id, $data);

            if ($success) {
                $response->getBody()->write(json_encode(['success' => true, 'message' => 'Perfil actualizado']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
            }

            $response->getBody()->write(json_encode(['success' => false, 'message' => 'No se pudo actualizar el perfil']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        } catch (\Exception $e) {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " Update Error: " . $e->getMessage() . "\n", FILE_APPEND);
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function uploadPhoto(Request $request, Response $response, array $args): Response
    {
        $id = (int) ($args['id'] ?? 0);
        $files = $request->getUploadedFiles();

        if (empty($files['image'])) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'No se envió ninguna imagen']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        try {
            $photoUrl = $this->service->uploadPhoto($id, $files['image']);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Foto actualizada',
                'data' => ['photo_url' => $photoUrl]
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Exception $e) {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " Upload Error: " . $e->getMessage() . "\n", FILE_APPEND);
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
