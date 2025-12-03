// Blog data source and helpers for the CIH website
// Keep posts lightweight; images can be remote URLs or local under /src/img.

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: string;
  unit?: string; // Optional: Unidad responsable
  date: string; // ISO date string
  category: string;
  tags?: string[];
  image: string;
  excerpt: string;
  content: string; // HTML content (sanitized at authoring time)
  videoUrl?: string; // Optional YouTube embed URL
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Inauguración del Blog del CIH',
    slug: 'inauguracion-blog-cih',
    author: 'Equipo de Comunicación',
    unit: 'Comunicación Institucional',
    date: '2025-11-01',
    category: 'Noticias',
    tags: ['institucional', 'comunidad'],
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'Lanzamos nuestro nuevo espacio para compartir avances, historias y resultados del territorio Higuito.',
    content: `
      <p>Con entusiasmo presentamos el <strong>nuevo Blog del Consejo Intermunicipal Higuito</strong>. Aquí compartiremos noticias, 
      proyectos, historias y aprendizajes de nuestras Unidades y aliados, con el objetivo de mantener una <em>comunicación cercana y transparente</em> con la ciudadanía.</p>
      <p>Te invitamos a suscribirte y compartir las publicaciones que más te inspiren.</p>
    `,
  },
  {
    id: 2,
    title: 'Avances en Gestión Ambiental Comunitaria',
    slug: 'avances-gestion-ambiental-comunitaria',
    author: 'Unidad de Recursos Naturales y Medio Ambiente',
    unit: 'Unidad Ambiente',
    date: '2025-10-24',
    category: 'Proyectos',
    tags: ['ambiente', 'participación'],
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'Comités locales fortalecen la gestión del recurso hídrico y la educación ambiental.',
    content: `
      <p>La Unidad Ambiente continúa fortaleciendo las capacidades de las comunidades en torno a la <strong>gestión del recurso hídrico</strong>,
      conservación y educación ambiental. Estas acciones se desarrollan en coordinación con municipalidades y actores locales.</p>
      <ul>
        <li>Talleres de sensibilización en centros educativos</li>
        <li>Monitoreo comunitario del recurso hídrico</li>
        <li>Jornadas de reforestación</li>
      </ul>
    `,
  },
  {
    id: 3,
    title: 'Convocatoria a Encuentro de Unidades',
    slug: 'convocatoria-encuentro-unidades',
    author: 'Secretaría Técnica CIH',
    unit: 'Secretaría Técnica',
    date: '2025-10-15',
    category: 'Eventos',
    tags: ['articulación', 'territorio'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'Se invita a liderazgos de todas las Unidades al encuentro trimestral para compartir resultados y coordinar acciones.',
    content: `
      <p>El <strong>encuentro trimestral de Unidades</strong> se realizará la próxima semana en Santa Rosa de Copán. 
      El objetivo es revisar avances, compartir aprendizajes y alinear la planificación del siguiente trimestre.</p>
      <p>¡Les esperamos!</p>
    `,
  },
];

export const categories: string[] = Array.from(new Set(blogPosts.map((p) => p.category)));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRecentPosts(limit = 5): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}
