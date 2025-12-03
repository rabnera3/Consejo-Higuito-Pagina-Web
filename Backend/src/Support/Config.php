<?php

declare(strict_types=1);

namespace App\Support;

final class Config
{
    /** @var array<string, mixed> */
    private static array $items = [];

    public static function load(string $configDir): void
    {
        if (!is_dir($configDir)) {
            return;
        }

        foreach (glob(rtrim($configDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . '*.php') as $file) {
            $key = basename($file, '.php');
            self::$items[$key] = require $file;
        }
    }

    public static function get(string $key, $default = null)
    {
        $segments = explode('.', $key);
        $value = self::$items;

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }

            $value = $value[$segment];
        }

        return $value;
    }
}
