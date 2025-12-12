<?php

declare(strict_types=1);

use App\Controllers\Api\AuthController;
use App\Controllers\Api\BlogController;
use App\Controllers\Api\EmployeesController;
use App\Controllers\Api\PlanificacionController;
use App\Controllers\Api\NotificationController;
use App\Controllers\Api\RequestsController;
use App\Controllers\Api\FieldController;
use App\Controllers\Api\CronController;
use App\Middleware\CorsMiddleware;
use App\Middleware\OptionalAuthMiddleware;
use App\Middleware\RequireAuthMiddleware;
use Slim\App;

return static function (App $app): void {
    $responseFactory = $app->getResponseFactory();
    $requireAuth = new RequireAuthMiddleware($responseFactory);
    $optionalAuth = new OptionalAuthMiddleware();

    $authController = new AuthController();
    $blogController = new BlogController();
    $employeesController = new EmployeesController();
    $planificacionController = new PlanificacionController();
    $notificationController = new NotificationController();
    $requestsController = new RequestsController();
    $fieldController = new FieldController();
    $cronController = new CronController();

    // Root endpoint to advertise API
    $app->get('/', function ($request, $response) {
        $response->getBody()->write(json_encode([
            'name' => 'Consejo Higuito API',
            'version' => '1.0.0',
            'status' => 'ok',
            'endpoints' => [
                'POST /api/auth/login',
                'POST /api/auth/logout',
                'GET  /api/auth/me',
                'GET  /api/empleados',
                'GET  /api/empleados/{id}'
            ]
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Preflight OPTIONS para cualquier ruta (devuelve 204 con headers CORS)
    $app->options('/{any:.*}', function ($request, $response) {
        // Slim crea response; solo status 204 sin cuerpo
        return $response->withStatus(204);
    });

    // API group (CORS ahora es global)
    $app->group('/api', function ($group) use ($authController, $blogController, $employeesController, $planificacionController, $notificationController, $requestsController, $fieldController, $cronController, $requireAuth, $optionalAuth, $app) {
        // Public routes
        $group->post('/auth/login', [$authController, 'login']);
        $group->post('/cron/close-planning', [$cronController, 'closeWeeklyPlanning']);

        // Blog public routes (leer posts publicados)
        $group->get('/blog', [$blogController, 'index'])->add($optionalAuth);
        $group->get('/blog/{id}', [$blogController, 'show'])->add($optionalAuth);
        $group->get('/blog/slug/{slug}', [$blogController, 'showBySlug'])->add($optionalAuth);

        // Protected routes
        $group->group('', function ($protected) use ($authController, $blogController, $employeesController, $planificacionController, $notificationController, $requestsController, $fieldController) {
            $protected->post('/auth/logout', [$authController, 'logout']);
            $protected->get('/auth/me', [$authController, 'me']);
            $protected->get('/empleados', [$employeesController, 'index']);

            $protected->get('/empleados/{id}', [$employeesController, 'show']);
            $protected->put('/empleados/{id}', [$employeesController, 'update']);
            $protected->post('/empleados/{id}/foto', [$employeesController, 'uploadPhoto']);

            // Blog protected routes (crear, editar, eliminar)
            $protected->post('/blog', [$blogController, 'create']);
            $protected->put('/blog/{id}', [$blogController, 'update']);
            $protected->delete('/blog/{id}', [$blogController, 'delete']);
            $protected->post('/blog/upload', [$blogController, 'uploadImage']);
            $protected->post('/blog/{id}/request-changes', [$blogController, 'requestChanges']);

            // Planificación routes
            $protected->get('/planificacion', [$planificacionController, 'index']);
            $protected->get('/planificacion/my-unit', [$planificacionController, 'byUnit']);
            $protected->post('/planificacion', [$planificacionController, 'store']);
            $protected->put('/planificacion/{id}', [$planificacionController, 'update']);
            $protected->delete('/planificacion/{id}', [$planificacionController, 'delete']);
            $protected->get('/planificacion/empleado/{id}', [$planificacionController, 'byEmployee']);

            // Notification routes
            $protected->get('/notifications', [$notificationController, 'index']);
            $protected->post('/notifications/{id}/read', [$notificationController, 'markAsRead']);
            $protected->post('/notifications/read-all', [$notificationController, 'markAllAsRead']);
            $protected->delete('/notifications/delete-all', [$notificationController, 'deleteAll']);

            // Field routes
            $protected->get('/visit-reports', [$fieldController, 'listVisitReports']);
            $protected->get('/visit-reports/{id}', [$fieldController, 'getVisitReport']);
            $protected->post('/visit-reports', [$fieldController, 'createVisitReport']);
            $protected->put('/visit-reports/{id}', [$fieldController, 'updateVisitReport']);
            $protected->post('/visit-reports/upload-photo', [$fieldController, 'uploadVisitPhoto']);
            $protected->delete('/visit-reports/{id}', [$fieldController, 'deleteVisitReport']);
            $protected->get('/field-logs', [$fieldController, 'listFieldLogs']);
            $protected->post('/field-logs', [$fieldController, 'createFieldLog']);
            $protected->delete('/field-logs/{id}', [$fieldController, 'deleteFieldLog']);

            // Requests routes
            $protected->get('/requests/my', [$requestsController, 'getMyRequests']);
            $protected->post('/requests', [$requestsController, 'create']);
            $protected->get('/requests/pending-chief', [$requestsController, 'getPendingForChief']);
            $protected->get('/requests/pending-manager', [$requestsController, 'getPendingForManager']);
            $protected->get('/requests/manager/history', [$requestsController, 'getManagerHistory']);
            $protected->get('/requests/unit', [$requestsController, 'getByUnit']);
            $protected->put('/requests/{id}/approve-chief', [$requestsController, 'approveByChief']);
            $protected->put('/requests/{id}/approve-manager', [$requestsController, 'approveByManager']);
            $protected->put('/requests/{id}/reject', [$requestsController, 'reject']);
        })->add($requireAuth);
    });

    // Ruta de depuración para listar TODAS las rutas registradas
    $app->get('/api/_debug/routes', function ($request, $response) use ($app) {
        $routes = [];
        foreach ($app->getRouteCollector()->getRoutes() as $r) {
            $routes[] = [
                'methods' => $r->getMethods(),
                'pattern' => $r->getPattern(),
                'name' => $r->getName(),
            ];
        }
        $response->getBody()->write(json_encode([
            'success' => true,
            'count' => count($routes),
            'routes' => $routes,
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Fallback para rutas no definidas (excluye OPTIONS, ya manejado arriba)
    $app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{any:.*}', function ($request, $response) {
        $path = $request->getUri()->getPath();
        // If it looks like an API route but not defined
        if (strpos($path, '/api/') === 0 || $path === '/api') {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Endpoint no encontrado',
                'path' => $path
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }
        // Otherwise show short help pointing to root
        $response->getBody()->write(json_encode([
            'success' => false,
            'message' => 'Ruta no encontrada. Visita / para listado de endpoints.'
        ]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
    });
};
