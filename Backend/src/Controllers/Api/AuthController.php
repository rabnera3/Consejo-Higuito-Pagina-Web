<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController
{
    public function login(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();


        if (empty($data)) {
            $raw = (string) $request->getBody();
            if ($raw !== '') {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $data = $decoded;
                }
            }
        }
        $email = trim((string) ($data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if (empty($email) || empty($password)) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Email y contraseña son requeridos',
                'debug' => [
                    'raw_fallback_used' => empty((array) $request->getParsedBody()),
                    'content_type' => $request->getHeaderLine('Content-Type'),
                ],
            ]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        }

        $user = AuthService::attempt($email, $password);
        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Credenciales inválidas',
            ]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }
        $token = AuthService::generateToken($user);

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Autenticación exitosa',
            'token' => $token,
            'user' => [
                'id' => $user['id'] ?? null,
                'email' => $user['email'] ?? null,
                'nombre' => $user['nombre'] ?? null,
                'role' => $user['role'] ?? null,
                'role_name' => $user['role_name'] ?? null,
                'department_id' => $user['department_id'] ?? null,
                'employee_id' => $user['employee_id'] ?? null,
                'photo_url' => $user['photo_url'] ?? null,
            ],
        ]));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function logout(Request $request, Response $response): Response
    {
        AuthService::logout();

        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente',
        ]));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function me(Request $request, Response $response): Response
    {
        $user = AuthService::user();

        if (!$user) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'message' => 'Usuario no autenticado',
            ]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }

        // Fetch fresh user data from DB to ensure photo_url and other fields are up to date
        $dbUser = \App\Models\User::with(['role', 'employee', 'department'])->find($user['id']);

        if ($dbUser) {
            $payload = [
                'id' => $dbUser->id,
                'email' => $dbUser->email,
                'nombre' => $dbUser->name ?? $dbUser->nombre,
                'role' => $dbUser->role->slug ?? null,
                'role_name' => $dbUser->role->name ?? null,
                'department_id' => $dbUser->department_id,
                'department_name' => $dbUser->department->name ?? null,
                'employee_id' => $dbUser->employee ? (int) $dbUser->employee->id : null,
                'photo_url' => $dbUser->employee->photo_url ?? null,
            ];
        } else {
            $payload = $user; // Fallback to token data
        }

        $response->getBody()->write(json_encode([
            'success' => true,
            'user' => $payload,
        ]));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }
}
