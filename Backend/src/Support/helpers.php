<?php

declare(strict_types=1);

if (!function_exists('env')) {
    function env(string $key, $default = null)
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? $default;

        if (!is_string($value)) {
            return $value;
        }

        $normalized = strtolower($value);

        switch ($normalized) {
            case 'true':
            case '(true)':
                return true;
            case 'false':
            case '(false)':
                return false;
            case 'empty':
            case '(empty)':
                return '';
            case 'null':
            case '(null)':
                return null;
            default:
                return $value;
        }
    }
}

if (!function_exists('base_path')) {
    function base_path(string $path = ''): string
    {
        $base = dirname(__DIR__, 2);
        return $path ? $base . DIRECTORY_SEPARATOR . ltrim($path, DIRECTORY_SEPARATOR) : $base;
    }
}

if (!function_exists('config_path')) {
    function config_path(string $path = ''): string
    {
        $config = base_path('config');
        return $path ? $config . DIRECTORY_SEPARATOR . ltrim($path, DIRECTORY_SEPARATOR) : $config;
    }
}

if (!function_exists('storage_path')) {
    function storage_path(string $path = ''): string
    {
        $storage = base_path('storage');
        return $path ? $storage . DIRECTORY_SEPARATOR . ltrim($path, DIRECTORY_SEPARATOR) : $storage;
    }
}

if (!function_exists('public_path')) {
    function public_path(string $path = ''): string
    {
        $public = base_path('public');
        return $path ? $public . DIRECTORY_SEPARATOR . ltrim($path, DIRECTORY_SEPARATOR) : $public;
    }
}
