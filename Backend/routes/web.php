<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\EmployeesController;
use App\Controllers\HomeController;
use App\Middleware\RedirectIfAuthenticatedMiddleware;
use App\Middleware\RequireAuthMiddleware;
use App\Services\DashboardService;
use App\Services\EmployeesService;
use App\Services\MetricsService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\App;
use Slim\Psr7\Stream;

return static function (App $app): void {
    $homeController = new HomeController();
    $authController = new AuthController();
    $dashboardController = new DashboardController(new DashboardService(), new MetricsService());
    $employeesController = new EmployeesController(new EmployeesService());

    $responseFactory = $app->getResponseFactory();
    $requireAuth = new RequireAuthMiddleware($responseFactory);
    $redirectIfAuth = new RedirectIfAuthenticatedMiddleware($responseFactory);

    $app->get('/assets/{path:.*}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) {
        $relativePath = str_replace(['\\', '..'], ['/', ''], $args['path'] ?? '');
        $relativePath = ltrim($relativePath, '/');

        $assetRoot = public_path('assets');
        $fullPath = realpath($assetRoot . DIRECTORY_SEPARATOR . $relativePath);

        if ($fullPath === false || strpos($fullPath, $assetRoot) !== 0 || !is_file($fullPath)) {
            return $response->withStatus(404);
        }

        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'webp' => 'image/webp',
        ];

        $stream = new Stream(fopen($fullPath, 'rb'));

        return $response
            ->withHeader('Content-Type', $mimeTypes[$extension] ?? 'application/octet-stream')
            ->withHeader('Cache-Control', 'public, max-age=604800')
            ->withBody($stream);
    });

    $app->get('/', [$homeController, 'index'])->setName('home');

    $app->get('/dashboard', [$dashboardController, 'index'])
        ->setName('dashboard')
        ->add($requireAuth);

    $app->get('/empleados', [$employeesController, 'index'])
        ->setName('employees.index')
        ->add($requireAuth);

    $app->get('/login', [$authController, 'showLogin'])
        ->setName('login')
        ->add($redirectIfAuth);
    $app->post('/login', [$authController, 'authenticate'])
        ->setName('login.authenticate');
    $app->get('/logout', [$authController, 'logout'])->setName('logout');
};
