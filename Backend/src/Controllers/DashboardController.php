<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;
use App\Services\DashboardService;
use App\Services\MetricsService;
use App\Support\Config;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Views\Twig;

final class DashboardController
{
    private DashboardService $dashboardService;
    private MetricsService $metricsService;

    public function __construct(DashboardService $dashboardService, MetricsService $metricsService)
    {
        $this->dashboardService = $dashboardService;
        $this->metricsService = $metricsService;
    }

    public function index(Request $request, Response $response): Response
    {
        $view = Twig::fromRequest($request);
        $user = AuthService::user();

        $dashboard = $this->dashboardService->forRole($user['role_id'] ?? null, $user['role_slug'] ?? null);
        $metrics = $this->metricsService->getSummary();

        return $view->render($response, 'dashboard.twig', [
            'title' => 'Panel principal',
            'appName' => Config::get('app.name'),
            'user' => $user,
            'dashboard' => $dashboard,
            'metrics' => $metrics,
        ]);
    }
}
