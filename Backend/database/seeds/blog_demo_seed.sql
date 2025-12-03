-- Seed de 3 posts de blog de ejemplo para el Consejo Intermunicipal Higuito
-- Ejecutar después de las migraciones principales

INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    body, 
    cover_image, 
    video_url,
    category,
    tags,
    status, 
    author_id, 
    published_at,
    created_at, 
    updated_at
) VALUES 
(
    'Inauguración del Proyecto de Agua Potable en Cucuyagua',
    'inauguracion-proyecto-agua-potable-cucuyagua',
    'El Consejo Intermunicipal Higuito celebra la inauguración del sistema de agua potable que beneficiará a más de 500 familias en la comunidad de Cucuyagua.',
    '# Inauguración del Proyecto de Agua Potable en Cucuyagua

El pasado sábado 15 de noviembre, el Consejo Intermunicipal Higuito (CIH) llevó a cabo la inauguración oficial del nuevo sistema de agua potable en la comunidad de Cucuyagua, municipio de Copán Ruinas. Este proyecto representa un hito importante en el compromiso del CIH con el desarrollo sostenible de las comunidades del territorio.

## Un sueño hecho realidad

Durante más de dos décadas, las familias de Cucuyagua han enfrentado serios desafíos para acceder a agua potable de calidad. Gracias al esfuerzo conjunto del CIH, las autoridades municipales y la participación activa de la comunidad, hoy se inaugura un sistema moderno que garantiza agua limpia y segura para más de 500 familias.

## Características del proyecto

El sistema incluye:
- Captación de agua de fuentes naturales protegidas
- Red de distribución de 8 kilómetros
- Tanque de almacenamiento con capacidad de 50,000 litros
- Sistema de cloración automático
- 520 conexiones domiciliares

## Impacto en la comunidad

Este proyecto no solo mejora la calidad de vida de las familias, sino que también:
- Reduce enfermedades relacionadas con el agua
- Facilita las actividades productivas locales
- Fortalece la organización comunitaria
- Promueve prácticas de uso sostenible del agua

La alcaldesa de Copán Ruinas, junto con representantes del CIH, destacaron la importancia de este logro y reiteraron el compromiso de seguir trabajando por el bienestar de todas las comunidades del territorio Higuito.',
    '/uploads/blog/proyecto-agua-cucuyagua.jpg',
    NULL,
    'Proyectos',
    'agua potable, Cucuyagua, infraestructura, desarrollo comunitario',
    'published',
    1,
    '2024-11-15 10:00:00',
    NOW(),
    NOW()
),
(
    'Taller de Fortalecimiento Municipal: Planificación Estratégica 2025',
    'taller-fortalecimiento-municipal-planificacion-2025',
    'Más de 40 funcionarios municipales participaron en el taller de planificación estratégica organizado por la Unidad de Fortalecimiento Municipal del CIH.',
    '# Taller de Fortalecimiento Municipal: Planificación Estratégica 2025

La Unidad de Fortalecimiento Municipal del Consejo Intermunicipal Higuito organizó un exitoso taller de tres días sobre planificación estratégica, con la participación de funcionarios de los cinco municipios que conforman el territorio.

## Objetivos del taller

El taller, realizado del 20 al 22 de noviembre en las instalaciones del CIH, tuvo como objetivos principales:

1. **Fortalecer capacidades** en planificación y gestión municipal
2. **Compartir experiencias** entre los diferentes municipios
3. **Establecer lineamientos** para los planes operativos 2025
4. **Promover la coordinación** intermunicipal

## Temas abordados

Durante las tres jornadas, se trabajaron los siguientes módulos:

### Día 1: Diagnóstico y análisis territorial
- Análisis FODA municipal
- Identificación de prioridades
- Recursos disponibles y necesidades

### Día 2: Formulación de planes
- Metodologías de planificación participativa
- Elaboración de planes operativos anuales (POA)
- Presupuestación basada en resultados

### Día 3: Monitoreo y evaluación
- Sistemas de seguimiento de proyectos
- Indicadores de gestión municipal
- Rendición de cuentas y transparencia

## Resultados alcanzados

Al finalizar el taller, cada municipio presentó:
- Un borrador de su POA 2025
- Identificación de proyectos prioritarios
- Compromisos de coordinación intermunicipal
- Plan de seguimiento trimestral

## Próximos pasos

El CIH continuará brindando asistencia técnica a los municipios para la implementación de sus planes, con visitas de seguimiento programadas cada tres meses y apoyo en la gestión de recursos ante cooperantes.',
    '/uploads/blog/taller-planificacion-2025.jpg',
    NULL,
    'Eventos',
    'fortalecimiento municipal, planificación, capacitación, gestión pública',
    'published',
    2,
    '2024-11-23 14:30:00',
    NOW(),
    NOW()
),
(
    'Convocatoria: Programa de Becas para Jóvenes Emprendedores 2025',
    'convocatoria-becas-jovenes-emprendedores-2025',
    'El CIH abre la convocatoria para su programa de becas dirigido a jóvenes con ideas de negocio sostenibles en el territorio Higuito. Plazo hasta el 15 de enero de 2025.',
    '# Convocatoria: Programa de Becas para Jóvenes Emprendedores 2025

La Unidad de Desarrollo Económico del Consejo Intermunicipal Higuito se complace en anunciar la apertura de la **convocatoria para el Programa de Becas para Jóvenes Emprendedores 2025**.

## ¿De qué trata el programa?

Este programa busca apoyar a jóvenes del territorio Higuito que tengan ideas innovadoras y sostenibles de negocio, brindándoles:

- **Capital semilla** de hasta L. 50,000
- **Capacitación empresarial** (6 meses)
- **Mentoría personalizada**
- **Asistencia técnica** durante el primer año
- **Acceso a redes** de emprendimiento

## ¿Quiénes pueden aplicar?

### Requisitos generales
- Tener entre 18 y 35 años
- Residir en alguno de los 5 municipios del territorio Higuito
- Presentar una idea de negocio viable y sostenible
- Disponibilidad para participar en las capacitaciones
- Compromiso de permanecer en el territorio

### Sectores prioritarios
Se dará prioridad a proyectos en:
- **Agricultura sostenible** y agroecología
- **Turismo rural** comunitario
- **Artesanía** y productos locales
- **Servicios ambientales**
- **Tecnología** y economía digital
- **Procesamiento** de productos locales

## ¿Cómo aplicar?

### Documentos requeridos
1. Formulario de aplicación (descargar en www.cih.hn/becas)
2. Copia de identidad
3. Plan de negocio simplificado (formato disponible)
4. Cartas de recomendación (2)
5. Constancia de residencia

### Proceso de selección
1. **Recepción de aplicaciones**: Hasta el 15 de enero 2025
2. **Preselección**: Del 16 al 31 de enero
3. **Entrevistas**: Febrero 2025
4. **Resultados finales**: 1 de marzo 2025

## Información y asesoría

Para más información o asesoría en la elaboración de tu propuesta:

**Unidad de Desarrollo Económico - CIH**
- **Teléfono**: 2651-4000
- **Email**: emprendimiento@cih.hn
- **Oficina**: Copán Ruinas, Centro
- **Horario**: Lunes a viernes, 8:00 am - 4:00 pm

**Sesiones informativas**
Se realizarán sesiones informativas en cada municipio:
- Copán Ruinas: 2 de diciembre, 2:00 pm
- Santa Rita: 4 de diciembre, 2:00 pm
- Cabañas: 6 de diciembre, 2:00 pm
- Cucuyagua: 9 de diciembre, 2:00 pm
- Dulce Nombre: 11 de diciembre, 2:00 pm

---

**¡No pierdas esta oportunidad de hacer realidad tu sueño emprendedor!**

*Este programa cuenta con el apoyo de cooperantes internacionales y busca fortalecer la economía local del territorio Higuito.*',
    '/uploads/blog/convocatoria-becas-emprendedores.jpg',
    NULL,
    'Noticias',
    'emprendimiento, juventud, becas, desarrollo económico, convocatoria',
    'published',
    3,
    '2024-11-24 09:00:00',
    NOW(),
    NOW()
);

-- Verificar la inserción
SELECT id, title, slug, status, published_at FROM blog_posts ORDER BY published_at DESC;
