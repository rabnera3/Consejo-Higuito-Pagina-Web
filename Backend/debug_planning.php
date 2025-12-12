<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use Illuminate\Database\Capsule\Manager as DB;

echo "Debugging Planning...\n";

try {
    $count = DB::table('planificacion_semanal')->count();
    echo "Total rows in planificacion_semanal: $count\n";

    $plans = DB::table('planificacion_semanal as p')
        ->leftJoin('employees as e', 'p.empleado_id', '=', 'e.id')
        ->leftJoin('departments as d', 'e.department_id', '=', 'd.id')
        ->select('p.*', 'e.full_name as empleado_nombre', 'd.name as departamento', 'e.department_id')
        ->orderBy('p.fecha', 'DESC')
        ->limit(5)
        ->get();

    echo "Query returned " . count($plans) . " rows (limit 5).\n";
    foreach ($plans as $p) {
        echo "ID: {$p->id}, Fecha: {$p->fecha}, Empleado: {$p->empleado_nombre}\n";
    }

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
