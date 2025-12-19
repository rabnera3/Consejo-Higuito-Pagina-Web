<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Models\Department;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class DepartmentController
{
    /**
     * Lista todos los departamentos/unidades
     */
    public function index(Request $request, Response $response): Response
    {
        try {
            $departments = Department::orderBy('name', 'asc')->get(['id', 'name', 'description']);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $departments->toArray(),
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Throwable $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Error al obtener departamentos',
            ]));

            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
