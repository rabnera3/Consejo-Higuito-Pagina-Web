<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;
use App\Support\Config;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteContext;
use Slim\Views\Twig;

final class AuthController
{
    public function showLogin(Request $request, Response $response): Response
    {
        $view = Twig::fromRequest($request);

        return $view->render($response, 'auth/login.twig', [
            'title' => 'Iniciar sesión',
            'appName' => Config::get('app.name'),
            'user' => AuthService::user(),
        ]);
    }

    public function authenticate(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if (!AuthService::attempt($email, $password)) {
            $view = Twig::fromRequest($request);

            return $view->render($response->withStatus(422), 'auth/login.twig', [
                'title' => 'Iniciar sesión',
                'appName' => Config::get('app.name'),
                'error' => 'Credenciales inválidas. Verifica tu correo institucional y contraseña.',
                'email' => $email,
            ]);
        }

        $routeParser = RouteContext::fromRequest($request)->getRouteParser();

        return $response
            ->withHeader('Location', $routeParser->urlFor('dashboard'))
            ->withStatus(302);
    }

    public function logout(Request $request, Response $response): Response
    {
        AuthService::logout();
        $routeParser = RouteContext::fromRequest($request)->getRouteParser();

        return $response
            ->withHeader('Location', $routeParser->urlFor('login'))
            ->withStatus(302);
    }
}
