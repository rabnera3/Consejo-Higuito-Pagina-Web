<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Capsule\Manager as Capsule;
use RuntimeException;

final class Database
{
    public static function boot(array $config): void
    {
        if (empty($config['connections'][$config['default'] ?? ''])) {
            throw new RuntimeException('Database connection is not configured.');
        }

        $connection = $config['connections'][$config['default']];

        $capsule = new Capsule();
        $capsule->addConnection($connection);
        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }
}
