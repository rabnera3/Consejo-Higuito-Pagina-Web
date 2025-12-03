<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\EmployeesService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Views\Twig;

final class EmployeesController
{
    private EmployeesService $service;

    public function __construct(EmployeesService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, Response $response): Response
    {
        $query = $request->getQueryParams();
        $selectedFilters = [
            'q' => trim((string) ($query['q'] ?? '')),
            'municipio' => $query['municipio'] ?? '',
            'departamento' => $query['departamento'] ?? '',
            'sort' => $query['sort'] ?? 'az',
            'scope' => $query['scope'] ?? 'all',
        ];

        $results = $this->service->listEmployees($selectedFilters);
        $filterOptions = $this->service->filters();

        $view = Twig::fromRequest($request);

        return $view->render($response, 'empleados/index.twig', [
            'title' => 'Directorio de Empleados',
            'filters' => [
                'municipios' => $filterOptions['municipios'] ?? [],
                'departamentos' => $filterOptions['departamentos'] ?? [],
                'selected' => $selectedFilters,
            ],
            'results' => $results,
        ]);
    }
}
