-- Migración para insertar 3 nuevos blogs de la Unidad SAN (Seguridad Alimentaria y Nutricional)
-- Fechas: Dic 5, 2019 y Oct 28, 2019
-- Ejecución: Copiar y pegar en phpMyAdmin o ejecutar con mysql

-- Insertar los 3 blogs directamente
INSERT INTO blog_posts (
    title, 
    slug,
    excerpt, 
    body,
    cover_image,
    author_id, 
    status, 
    category, 
    tags, 
    created_at, 
    updated_at
) VALUES 

('Diversificación Productiva: Estrategia de Seguridad Alimentaria', 
'diversificacion-productiva-estrategia-seguridad-alimentaria',
'Cambio de la dominancia regional de un solo cultivo a varios cultivos para consumo local y comercialización.', 
'La diversificación productiva constituye un cambio estratégico en la estructura agrícola regional, transicionando de la dependencia de un único cultivo hacia un modelo de producción múltiple y sostenible. Este enfoque permite a las familias no solo satisfacer sus necesidades alimentarias locales, sino también generar excedentes destinados a comercialización, lo que se traduce en un retorno económico significativo para el núcleo familiar. A través de esta diversificación se fortalece la resiliencia agrícola, reduce riesgos asociados a fluctuaciones de precios y plagas, y contribuye a la seguridad alimentaria y nutricional de las comunidades.', 
'/uploads/blog/blog1.jpg', 
1, 
'published', 
'Seguridad Alimentaria', 
'diversificación,agricultura,seguridad alimentaria,cultivos', 
'2019-12-05 00:00:00', 
'2019-12-05 00:00:00'),

('Entrega de Material Vegetativo para Sistemas Agroforestales', 
'entrega-material-vegetativo-sistemas-agroforestales',
'Entrega de árboles frutales y material vegetativo para fortalecer sistemas agroforestales sostenibles.', 
'En el marco de la iniciativa EUROSAN HIGUITO, con el apoyo financiero de la Unión Europea y el respaldo institucional de los Gobiernos Locales a través de la Unidad Municipal de Seguridad Alimentaria y Nutricional, se ha llevado a cabo la entrega de árboles frutales y material vegetativo de calidad fitosanitaria certificada. Esta acción busca fortalecer la implementación de sistemas agroforestales sostenibles, integrando la producción de frutas con cultivos tradicionales, mejorando la cobertura vegetal del territorio, incrementando la biodiversidad agrícola y generando fuentes adicionales de ingresos para las familias beneficiarias a través de la comercialización de productos de calidad.', 
'/uploads/blog/blog2.jpg', 
1, 
'published', 
'Seguridad Alimentaria', 
'agroforestería,fruticultura,seguridad alimentaria,desarrollo sostenible', 
'2019-10-28 00:00:00', 
'2019-10-28 00:00:00'),

('Programa de Apoyo a Productores de Granos Básicos en Municipios Vulnerables', 
'programa-apoyo-productores-granos-basicos',
'Entrega de fertilizante a 216 familias vulnerables productoras de granos básicos en occidente de Honduras.', 
'Dentro del marco del Convenio de Cooperación establecido entre CESAL, Fundación ETEA, Consejo Intermunicipal Higuito, CDE MIPYME y el Gobierno de Honduras, y financiado por la Agencia Española de Cooperación Internacional para el Desarrollo (AECID), se ha ejecutado el proyecto denominado "Impulso de la competitividad local para reducción de la pobreza en población vulnerable a través de cadenas de valor sostenibles e inclusivas". Como respuesta a los impactos de la pandemia COVID-19 en la economía local, se ha realizado la entrega de fertilizante de calidad agronómica a un total de 216 familias en condición de vulnerabilidad económica, dedicadas principalmente al cultivo de granos básicos en los municipios de Corquín, San Pedro y Cucuyagua. Esta acción contribuye al fortalecimiento de la producción agrícola local, la seguridad alimentaria y el mejoramiento de los ingresos familiares en territorios priorizados.', 
'/uploads/blog/blog3.jpg', 
1, 
'published', 
'Seguridad Alimentaria', 
'granos básicos,agricultura,pobreza,desarrollo rural,cooperación internacional', 
'2019-12-05 00:00:00', 
'2019-12-05 00:00:00');
