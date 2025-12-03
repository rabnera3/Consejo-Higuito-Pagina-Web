<?php

declare(strict_types=1);

use App\Middleware\CorsMiddleware;
use App\Support\Config;
use App\Support\Database;
use Dotenv\Dotenv;
use Slim\Factory\AppFactory;

$rootPath = dirname(__DIR__);

if (file_exists($rootPath . '/.env')) {
    Dotenv::createImmutable($rootPath)->safeLoad();
}

Config::load(config_path());
Database::boot(Config::get('database'));

date_default_timezone_set(Config::get('app.timezone', 'UTC'));

$maxExecution = (int) Config::get('app.max_execution_time', 180);
if ($maxExecution <= 0) {
    // 0 en set_time_limit significa ilimitado; permitimos configurarlo vía env
    set_time_limit(0);
    ini_set('max_execution_time', '0');
} else {
    set_time_limit($maxExecution);
    ini_set('max_execution_time', (string) $maxExecution);
}

$app = AppFactory::create();

// Middleware stack
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();

// Middleware para servir archivos estáticos desde /uploads
$app->add(function ($request, $handler) {
    $path = $request->getUri()->getPath();
    
    // Si la ruta empieza con /uploads, servir el archivo directamente
    if (strpos($path, '/uploads/') === 0) {
        $filePath = __DIR__ . '/../public' . $path;
        
        if (file_exists($filePath) && is_file($filePath)) {
            $response = new \Slim\Psr7\Response();
            $mimeType = mime_content_type($filePath);
            $fileStream = fopen($filePath, 'rb');
            
            $response = $response
                ->withHeader('Content-Type', $mimeType)
                ->withHeader('Content-Length', (string) filesize($filePath))
                ->withBody(new \Slim\Psr7\Stream($fileStream));
            
            return $response;
        }
    }
    
    return $handler->handle($request);
});



// Error middleware
$app->addErrorMiddleware(
    Config::get('app.debug', false),
    true,
    true
);

// CORS global (incluye OPTIONS y 401 de cualquier ruta /api)
// Se agrega AL FINAL para que se ejecute PRIMERO (antes que el ErrorMiddleware)
// y pueda agregar headers incluso a las respuestas de error (500, 404, etc)
$app->add(new CorsMiddleware());

// Load API routes
(require $rootPath . '/routes/api.php')($app);

return $app;
