<?php
/**
 * Script para insertar blogs de la Unidad SAN directamente
 * Uso: php insert_blogs_san.php
 */

require_once __DIR__ . '/bootstrap/app.php';

use Illuminate\Database\Capsule\Manager as DB;

try {
    echo "=== Insertando Blogs de Unidad SAN ===\n\n";
    
    // Blog 1
    DB::table('blog_posts')->insert([
        'title' => 'Diversificación Productiva: Estrategia de Seguridad Alimentaria',
        'content' => 'La diversificación productiva constituye un cambio estratégico en la estructura agrícola regional, transicionando de la dependencia de un único cultivo hacia un modelo de producción múltiple y sostenible. Este enfoque permite a las familias no solo satisfacer sus necesidades alimentarias locales, sino también generar excedentes destinados a comercialización, lo que se traduce en un retorno económico significativo para el núcleo familiar. A través de esta diversificación se fortalece la resiliencia agrícola, reduce riesgos asociados a fluctuaciones de precios y plagas, y contribuye a la seguridad alimentaria y nutricional de las comunidades.',
        'excerpt' => 'Cambio de la dominancia regional de un solo cultivo a varios cultivos para consumo local y comercialización.',
        'author_id' => 1,
        'status' => 'published',
        'category' => 'Seguridad Alimentaria',
        'tags' => 'diversificación,agricultura,seguridad alimentaria,cultivos',
        'cover_image' => 'blog1',
        'created_at' => '2019-12-05 00:00:00',
        'updated_at' => '2019-12-05 00:00:00'
    ]);
    echo "✓ Blog 1 insertado: Diversificación Productiva\n";
    
    // Blog 2
    DB::table('blog_posts')->insert([
        'title' => 'Entrega de Material Vegetativo para Sistemas Agroforestales',
        'content' => 'En el marco de la iniciativa EUROSAN HIGUITO, con el apoyo financiero de la Unión Europea y el respaldo institucional de los Gobiernos Locales a través de la Unidad Municipal de Seguridad Alimentaria y Nutricional, se ha llevado a cabo la entrega de árboles frutales y material vegetativo de calidad fitosanitaria certificada. Esta acción busca fortalecer la implementación de sistemas agroforestales sostenibles, integrando la producción de frutas con cultivos tradicionales, mejorando la cobertura vegetal del territorio, incrementando la biodiversidad agrícola y generando fuentes adicionales de ingresos para las familias beneficiarias a través de la comercialización de productos de calidad.',
        'excerpt' => 'Entrega de árboles frutales y material vegetativo para fortalecer sistemas agroforestales sostenibles.',
        'author_id' => 1,
        'status' => 'published',
        'category' => 'Seguridad Alimentaria',
        'tags' => 'agroforestería,fruticultura,seguridad alimentaria,desarrollo sostenible',
        'cover_image' => 'blog2',
        'created_at' => '2019-10-28 00:00:00',
        'updated_at' => '2019-10-28 00:00:00'
    ]);
    echo "✓ Blog 2 insertado: Sistemas Agroforestales\n";
    
    // Blog 3
    DB::table('blog_posts')->insert([
        'title' => 'Programa de Apoyo a Productores de Granos Básicos en Municipios Vulnerables',
        'content' => 'Dentro del marco del Convenio de Cooperación establecido entre CESAL, Fundación ETEA, Consejo Intermunicipal Higuito, CDE MIPYME y el Gobierno de Honduras, y financiado por la Agencia Española de Cooperación Internacional para el Desarrollo (AECID), se ha ejecutado el proyecto denominado "Impulso de la competitividad local para reducción de la pobreza en población vulnerable a través de cadenas de valor sostenibles e inclusivas". Como respuesta a los impactos de la pandemia COVID-19 en la economía local, se ha realizado la entrega de fertilizante de calidad agronómica a un total de 216 familias en condición de vulnerabilidad económica, dedicadas principalmente al cultivo de granos básicos en los municipios de Corquín, San Pedro y Cucuyagua. Esta acción contribuye al fortalecimiento de la producción agrícola local, la seguridad alimentaria y el mejoramiento de los ingresos familiares en territorios priorizados.',
        'excerpt' => 'Entrega de fertilizante a 216 familias vulnerables productoras de granos básicos en occidente de Honduras.',
        'author_id' => 1,
        'status' => 'published',
        'category' => 'Seguridad Alimentaria',
        'tags' => 'granos básicos,agricultura,pobreza,desarrollo rural,cooperación internacional',
        'cover_image' => 'blog3',
        'created_at' => '2019-12-05 00:00:00',
        'updated_at' => '2019-12-05 00:00:00'
    ]);
    echo "✓ Blog 3 insertado: Granos Básicos\n";
    
    echo "\n=== Inserción Completada ===\n";
    echo "Total de blogs insertados: 3\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
