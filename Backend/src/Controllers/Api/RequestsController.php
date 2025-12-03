<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Services\RequestsService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class RequestsController
{
    private RequestsService $service;

    public function __construct()
    {
        $this->service = new RequestsService();
    }

    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $user = $request->getAttribute('user');

        // Handle user as array (from JWT) or object
        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        if (!$employeeId) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'Usuario no asociado a un empleado']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $data['employee_id'] = $employeeId;

        try {
            $newRequest = $this->service->createRequest($data);
            $response->getBody()->write(json_encode(['success' => true, 'data' => $newRequest]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getMyRequests(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');

        $employeeId = is_array($user) ? ($user['employee_id'] ?? null) : ($user->employee_id ?? null);

        if (!$employeeId) {
            $response->getBody()->write(json_encode(['success' => false, 'data' => []]));
            return $response->withHeader('Content-Type', 'application/json');
        }

        try {
            $requests = $this->service->getRequestsByEmployee($employeeId);
            $response->getBody()->write(json_encode(['success' => true, 'data' => $requests]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getPendingForChief(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');

        // TODO: Validate if user is a Chief (Jefe) and get their department_id
        // For now, assuming department_id is passed or derived from user
        $departmentId = is_array($user) ? ($user['department_id'] ?? 0) : ($user->department_id ?? 0);

        $requests = $this->service->getPendingForChief($departmentId);
        $response->getBody()->write(json_encode(['success' => true, 'data' => $requests]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getPendingForManager(Request $request, Response $response): Response
    {
        // TODO: Validate if user is Manager (Gerente)
        $requests = $this->service->getPendingForManager();
        $response->getBody()->write(json_encode(['success' => true, 'data' => $requests]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getByUnit(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $departmentId = is_array($user) ? ($user['department_id'] ?? 0) : ($user->department_id ?? 0);

        if (!$departmentId) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => 'No department assigned']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $requests = $this->service->getRequestsByUnit($departmentId);
        $response->getBody()->write(json_encode(['success' => true, 'data' => $requests]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function approveByChief(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        try {
            $success = $this->service->approveByChief($id);

            if ($success) {
                $response->getBody()->write(json_encode(['success' => true, 'message' => 'Aprobado por Jefatura']));
            } else {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'No se pudo aprobar']));
                return $response->withStatus(400);
            }
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function approveByManager(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        try {
            $success = $this->service->approveByManager($id);

            if ($success) {
                $response->getBody()->write(json_encode(['success' => true, 'message' => 'Autorizado por Gerencia']));
            } else {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'No se pudo autorizar']));
                return $response->withStatus(400);
            }
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function reject(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $data = $request->getParsedBody();
        $reason = $data['reason'] ?? 'Sin razón especificada';

        try {
            $success = $this->service->reject($id, $reason);

            if ($success) {
                $response->getBody()->write(json_encode(['success' => true, 'message' => 'Solicitud rechazada']));
            } else {
                $response->getBody()->write(json_encode(['success' => false, 'message' => 'No se pudo rechazar']));
                return $response->withStatus(400);
            }
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getManagerHistory(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $start = $params['start'] ?? null;
        $end = $params['end'] ?? null;

        try {
            $history = $this->service->getApprovedHistory($start, $end);
            $response->getBody()->write(json_encode(['success' => true, 'data' => $history]));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode(['success' => false, 'message' => $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
