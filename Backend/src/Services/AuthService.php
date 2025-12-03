<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Support\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Carbon;

final class AuthService
{
    private static ?array $currentUser = null;

    public static function attempt(string $email, string $password): ?array
    {
        file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " AuthService: attempt called for $email\n", FILE_APPEND);
        if ($email === '' || $password === '') {
            return null;
        }


        try {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " AuthService: Querying database...\n", FILE_APPEND);
            $user = User::with(['role', 'employee', 'department'])->where('email', $email)->first();
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " AuthService: Query done. User found: " . ($user ? 'yes' : 'no') . "\n", FILE_APPEND);
        } catch (\Throwable $e) {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " AuthService: DB Error: " . $e->getMessage() . "\n", FILE_APPEND);
            throw $e;
        }

        if (!$user || !self::verifyPassword($user, $password)) {
            return null;
        }

        $payload = self::mapUser($user->toArray());
        $payload['role'] = $user->role->slug ?? null;
        $payload['role_name'] = $user->role->name ?? null;
        $payload['role_id'] = $user->role_id;
        $payload['department_id'] = $user->department_id;
        $payload['department_name'] = $user->department->name ?? null;

        self::$currentUser = $payload;

        $user->last_login = Carbon::now();
        $user->save();

        return $payload;
    }

    public static function generateToken(array $user): string
    {
        $secret = Config::get('auth.jwt_secret');
        if (!$secret) {
            throw new \RuntimeException('JWT secret not configured');
        }
        $issuer = Config::get('auth.jwt_issuer', 'cih-backend');
        $ttl = (int) Config::get('auth.jwt_ttl', 3600);
        $now = Carbon::now()->timestamp;

        $payload = [
            'iss' => $issuer,
            'iat' => $now,
            'nbf' => $now,
            'exp' => $now + max(60, $ttl),
            'sub' => $user['id'] ?? null,
            'email' => $user['email'] ?? null,
            'nombre' => $user['nombre'] ?? null,
            'role' => $user['role'] ?? null,
            'role_name' => $user['role_name'] ?? null,
            'department_id' => $user['department_id'] ?? null,
            'department_name' => $user['department_name'] ?? null,
            'employee_id' => $user['employee_id'] ?? null,
            'photo_url' => $user['photo_url'] ?? null,
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }

    public static function validateToken(?string $token): ?array
    {
        if (!$token) {
            return null;
        }

        $secret = Config::get('auth.jwt_secret');
        if (!$secret) {
            return null;
        }

        try {
            $decoded = (array) JWT::decode($token, new Key($secret, 'HS256'));
            $user = [
                'id' => $decoded['sub'] ?? null,
                'email' => $decoded['email'] ?? null,
                'nombre' => $decoded['nombre'] ?? null,
                'role' => $decoded['role'] ?? null,
                'role_name' => $decoded['role_name'] ?? null,
                'department_id' => $decoded['department_id'] ?? null,
                'department_name' => $decoded['department_name'] ?? null,
                'employee_id' => $decoded['employee_id'] ?? null,
                'photo_url' => $decoded['photo_url'] ?? null,
            ];
            self::$currentUser = $user;
            return $user;
        } catch (\Throwable $e) {
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " Token Validation Error: " . $e->getMessage() . "\n", FILE_APPEND);
            return null;
        }
    }

    public static function user(): ?array
    {
        return self::$currentUser;
    }

    public static function setCurrentUser(?array $user): void
    {
        self::$currentUser = $user;
    }

    public static function logout(): void
    {
        self::$currentUser = null;
    }

    private static function mapUser(array $user): array
    {
        return [
            'id' => $user['id'] ?? null,
            'email' => $user['email'] ?? null,
            'nombre' => $user['name'] ?? $user['nombre'] ?? null,
            'role' => $user['role_slug'] ?? null,
            'role_name' => $user['role_name'] ?? null,
            'department_id' => $user['department_id'] ?? null,
            'department_name' => $user['department']['name'] ?? null,
            'employee_id' => $user['employee'] ? (int) $user['employee']['id'] : null,
            'photo_url' => $user['employee']['photo_url'] ?? null,
        ];
    }

    private static function verifyPassword(User $user, string $password): bool
    {
        $stored = (string) ($user->password_hash ?? '');
        if ($stored === '') {
            return false;
        }

        $isValid = false;
        $shouldRehash = false;
        $info = password_get_info($stored);

        if (($info['algo'] ?? 0) !== 0) {
            $isValid = password_verify($password, $stored);
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " AuthService: BCRYPT check. Valid: " . ($isValid ? 'YES' : 'NO') . "\n", FILE_APPEND);
            $shouldRehash = $isValid && password_needs_rehash($stored, PASSWORD_BCRYPT);
        } elseif (preg_match('/^[a-f0-9]{32}$/i', $stored)) {
            // Compatibilidad con hashes MD5 heredados
            $isValid = hash_equals($stored, md5($password));
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " AuthService: MD5 check. Valid: " . ($isValid ? 'YES' : 'NO') . "\n", FILE_APPEND);
            $shouldRehash = $isValid;
        } else {
            // Ultimo recurso: contraseña almacenada en texto plano
            $isValid = hash_equals($stored, $password);
            file_put_contents(__DIR__ . '/../../debug_manual.log', date('Y-m-d H:i:s') . " AuthService: PLAIN check. Valid: " . ($isValid ? 'YES' : 'NO') . "\n", FILE_APPEND);
            $shouldRehash = $isValid;
        }

        if ($isValid && $shouldRehash) {
            $user->password_hash = password_hash($password, PASSWORD_BCRYPT);
            $user->save();
        }

        return $isValid;
    }
}
