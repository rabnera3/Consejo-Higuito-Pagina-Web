<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\AuthService;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Routing\RouteContext;

final class RequireAuthMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $responseFactory;

    public function __construct(ResponseFactoryInterface $responseFactory)
    {
        $this->responseFactory = $responseFactory;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = AuthService::user();
        if (!$user) {
            $token = $this->extractToken($request);
            file_put_contents(__DIR__ . '/../../debug_auth.log', date('Y-m-d H:i:s') . " Token extracted: " . ($token ? 'YES' : 'NO') . "\n", FILE_APPEND);
            if ($token) {
                $user = AuthService::validateToken($token);
            }
        }

        if (!$user) {
            $response = $this->responseFactory->createResponse();

            // Check if this is an API request
            $path = $request->getUri()->getPath();
            if (strpos($path, '/api/') === 0) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'message' => 'No autenticado. Por favor inicia sesión.',
                ]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(401);
            }

            // For non-API requests, redirect to login
            $routeParser = RouteContext::fromRequest($request)->getRouteParser();
            return $response
                ->withHeader('Location', $routeParser->urlFor('login'))
                ->withStatus(302);
        }

        // Añadir el usuario al request como atributo para que esté disponible en los controladores
        $request = $request->withAttribute('user', $user);

        return $handler->handle($request);
    }

    private function extractToken(ServerRequestInterface $request): ?string
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader) {
            return null;
        }

        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }
}
