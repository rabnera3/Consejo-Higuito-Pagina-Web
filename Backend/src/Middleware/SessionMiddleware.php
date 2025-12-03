<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class SessionMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        // Skip session bootstrap for CORS preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            return $handler->handle($request);
        }

        if (session_status() !== PHP_SESSION_ACTIVE) {
            $options = [
                'name' => 'cih_session',
                'cookie_lifetime' => 60 * 60 * 4,
                'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
                'cookie_httponly' => true,
                'cookie_samesite' => 'Lax',
            ];

            session_start($options);
        }

        return $handler->handle($request);
    }
}
