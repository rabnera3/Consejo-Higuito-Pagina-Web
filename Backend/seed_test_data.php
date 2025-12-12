<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use Illuminate\Database\Capsule\Manager as DB;

echo "Seeding database...\n";

try {
    // 1. Truncate tables
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    $tables = [
        'roles', 'departments', 'users', 'employees', 
        'planificacion_semanal', 'vacation_requests', 'vacation_approvals', 
        'solicitudes', 'notifications', 'visit_reports', 'visit_report_photos', 'field_logs'
    ];
    foreach ($tables as $table) {
        // Check if table exists before truncating to avoid errors if migrations changed
        if (DB::schema()->hasTable($table)) {
            DB::table($table)->truncate();
            echo "Truncated $table\n";
        }
    }
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

    // 2. Roles
    $roles = [
        ['slug' => 'admin', 'name' => 'Administrador'],
        ['slug' => 'gerente', 'name' => 'Gerente'],
        ['slug' => 'jefe', 'name' => 'Jefe de Unidad'],
        ['slug' => 'tecnico', 'name' => 'Técnico'],
        ['slug' => 'empleado', 'name' => 'Empleado'],
    ];
    DB::table('roles')->insert($roles);
    $roleIds = DB::table('roles')->pluck('id', 'slug');
    echo "Roles inserted.\n";

    // 3. Departments
    $depts = [
        'Gerencia General',
        'Administración y Finanzas',
        'Unidad de Ambiente',
        'Unidad de Planificación',
        'Unidad de Infraestructura',
        'Unidad de Desarrollo Económico',
        'Unidad de Fortalecimiento',
        'Unidad de SAN'
    ];
    foreach ($depts as $d) {
        DB::table('departments')->insert(['name' => $d]);
    }
    $deptIds = DB::table('departments')->pluck('id', 'name');
    echo "Departments inserted.\n";

    // 4. Users & Employees
    $password = password_hash('password', PASSWORD_BCRYPT);

    // Helper to create user+employee
    $global_force_birthday = true; // Flag to force at least one birthday this week

    function createEmployee($name, $email, $roleSlug, $deptName, $roleIds, $deptIds, $password) {
        global $global_force_birthday;
        $roleId = $roleIds[$roleSlug];
        $deptId = $deptIds[$deptName];
        
        $userId = DB::table('users')->insertGetId([
            'name' => $name,
            'email' => $email,
            'password_hash' => $password,
            'role_id' => $roleId,
            'department_id' => $deptId,
            'status' => 'active'
        ]);
        
        // Generate birth date
        if ($global_force_birthday) {
            // Force birthday to be tomorrow so it shows up in "This Week" and "Upcoming"
            $birthDate = date('Y-m-d', strtotime('1995-' . date('m-d', strtotime('+1 day'))));
            $global_force_birthday = false; // Only once
        } else {
            // Random logic
            $isUpcoming = rand(1, 100) <= 30;
            $year = rand(1980, 2000);
            if ($isUpcoming) {
                $month = rand(0, 1) ? 12 : 1; // Dec or Jan
            } else {
                $month = rand(2, 11);
            }
            $day = rand(1, 28);
            $birthDate = "$year-$month-$day";
        }

        $genders = ['Masculino', 'Femenino'];
        $gender = $genders[array_rand($genders)];

        $empId = DB::table('employees')->insertGetId([
            'user_id' => $userId,
            'full_name' => $name,
            'job_title' => ucfirst($roleSlug),
            'department_id' => $deptId,
            'municipio' => 'Santa Rosa de Copán',
            'email' => $email,
            'phone' => '9' . rand(100, 999) . '-' . rand(1000, 9999),
            'cedula' => '0401-' . rand(1980, 2000) . '-' . rand(10000, 99999),
            'address' => 'Barrio El Centro, Santa Rosa de Copán',
            'emergency_contact_name' => 'Familiar de ' . $name,
            'emergency_contact_phone' => '3' . rand(100, 999) . '-' . rand(1000, 9999),
            'employment_status' => 'Activa',
            'hire_date' => date('Y-m-d', strtotime('-' . rand(1, 5) . ' years')),
            'birth_date' => $birthDate,
            'gender' => $gender,
            'vacation_days_balance' => rand(5, 20)
        ]);
        
        return $empId;
    }

    // Admin
    createEmployee('Admin Sistema', 'admin@higuito.org', 'admin', 'Administración y Finanzas', $roleIds, $deptIds, $password);

    // Gerente
    createEmployee('Ana Solano', 'gerencia@higuito.org', 'gerente', 'Gerencia General', $roleIds, $deptIds, $password);

    // Jefes & Staff
    $units = [
        'Unidad de Ambiente' => ['Jefe Ambiente', 'Tecnico Forestal', 'Guardarecursos'],
        'Unidad de Planificación' => ['Jefe Planificacion', 'Arquitecto', 'Topografo'],
        'Unidad de Infraestructura' => ['Jefe Obras', 'Ingeniero Civil', 'Asistente Obras'],
        'Unidad de Desarrollo Económico' => ['Jefe UDEL', 'Promotor Agricola', 'Tecnico Cafe'],
        'Unidad de Fortalecimiento' => ['Jefe Fortalecimiento', 'Capacitador', 'Asistente Social'],
        'Unidad de SAN' => ['Jefe SAN', 'Nutricionista', 'Monitor de Campo']
    ];

    foreach ($units as $deptName => $titles) {
        // First is Jefe
        $jefeName = $titles[0];
        $jefeEmail = strtolower(str_replace(' ', '.', $jefeName)) . '@higuito.org';
        $jefeId = createEmployee($jefeName, $jefeEmail, 'jefe', $deptName, $roleIds, $deptIds, $password);
        
        // Others are Tecnicos/Empleados
        for ($i = 1; $i < count($titles); $i++) {
            $name = $titles[$i];
            $email = strtolower(str_replace(' ', '.', $name)) . '@higuito.org';
            
            // Alternate between 'tecnico' and 'empleado' roles for variety
            $roleSlug = ($i % 2 == 0) ? 'empleado' : 'tecnico';
            
            $empId = createEmployee($name, $email, $roleSlug, $deptName, $roleIds, $deptIds, $password);

            // Add some planning for this employee
            $today = new DateTime();
            // Plan for this week (Mon-Fri)
            $monday = clone $today;
            $monday->modify('this week monday');
            
            for ($d = 0; $d < 5; $d++) {
                $date = clone $monday;
                $date->modify("+$d days");
                
                // Randomly skip some days to test "missing planning" logic
                if (rand(0, 10) > 2) { 
                    DB::table('planificacion_semanal')->insert([
                        'empleado_id' => $empId,
                        'fecha' => $date->format('Y-m-d'),
                        'lugar' => 'Oficina',
                        'sector_trabajo' => 'Trabajo de oficina',
                        'area' => 'Urbana',
                        'recursos' => 'Ninguno',
                        'linea_servicio' => 'Gestión de Información Territorial',
                        'duracion' => '8 horas',
                        'descripcion' => 'Trabajo rutinario de oficina y reuniones.',
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ]);
                }
            }
        }
    }

    echo "Users and Employees inserted.\n";

    // 5. Blog Posts
    echo "Seeding Blog Posts...\n";
    $blogTitles = [
        'Avances en el Proyecto de Reforestación',
        'Taller de Capacitación en Agricultura Sostenible',
        'Inauguración de Obras en Belén Gualcho',
        'Informe de Gestión Ambiental 2024',
        'Celebración del Día del Árbol'
    ];
    
    $adminUser = DB::table('users')->where('email', 'admin@higuito.org')->first();
    
    foreach ($blogTitles as $index => $title) {
        $slug = strtolower(str_replace(' ', '-', $title)) . '-' . uniqid();
        DB::table('blog_posts')->insert([
            'title' => $title,
            'slug' => $slug,
            'excerpt' => 'Resumen breve del artículo sobre ' . $title,
            'body' => '<p>Contenido detallado del artículo sobre ' . $title . '. Lorem ipsum dolor sit amet...</p>',
            'author_id' => $adminUser->id,
            'department_id' => $adminUser->department_id,
            'status' => 'published',
            'category' => 'Noticias',
            'tags' => 'ambiente,desarrollo,comunidad',
            'published_at' => date('Y-m-d H:i:s', strtotime("-$index days")),
            'published_date' => date('Y-m-d', strtotime("-$index days"))
        ]);
    }
    echo "Blog Posts inserted.\n";

    // 6. Vacation Requests
    echo "Seeding Vacation Requests...\n";
    $employees = DB::table('employees')->get();
    foreach ($employees as $emp) {
        if (rand(0, 10) > 7) { // 30% chance
            $start = date('Y-m-d', strtotime('+' . rand(1, 30) . ' days'));
            $end = date('Y-m-d', strtotime($start . ' + ' . rand(1, 5) . ' days'));
            
            // Generate UUID v4
            $uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );

            DB::table('vacation_requests')->insert([
                'id' => $uuid,
                'employee_id' => $emp->id,
                'start_date' => $start,
                'end_date' => $end,
                'days_requested' => rand(1, 5),
                'reason' => 'Vacaciones anuales solicitadas.',
                'state' => 'pendiente_jefe',
                'submitted_at' => date('Y-m-d H:i:s')
            ]);
        }
    }
    echo "Vacation Requests inserted.\n";

    // 7. Notifications
    echo "Seeding Notifications...\n";
    foreach ($employees as $emp) {
        if (rand(0, 10) > 5) {
            DB::table('notifications')->insert([
                'user_id' => $emp->id, // Schema says user_id refs employees(id)
                'type' => 'info',
                'title' => 'Bienvenido al Sistema',
                'message' => 'Su cuenta ha sido creada exitosamente.',
                'read_at' => null,
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }
    echo "Notifications inserted.\n";

    echo "Database seeded successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
