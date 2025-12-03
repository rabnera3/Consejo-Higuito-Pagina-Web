<?php

return [
    'name' => env('APP_NAME', 'Consejo Intermunicipal Higuito'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost:8080'),
    'timezone' => env('APP_TIMEZONE', 'America/Tegucigalpa'),
    'locale' => 'es',
    'max_execution_time' => (int) env('APP_MAX_EXECUTION', 1800),
];
