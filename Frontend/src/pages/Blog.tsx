import { Calendar, User, FolderOpen, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogApi, BlogPost, API_BASE } from '../lib/api';
import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Solo cargar posts publicados para la página pública
      const response = await blogApi.getAll('published');
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error cargando posts:', err);
      setError('Error al cargar los posts del blog');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPosts = selectedCategory === 'Todos' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);
  
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
    .slice(0, 5);
  
  // Get unique categories from posts
  const categories = ['Todos', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
  
  // Get archives (unique months/years from posts)
  const archives = [...new Set(posts.map(post => {
    const date = new Date(post.published_at || post.created_at);
    return `${date.toLocaleDateString('es', { month: 'long' })} ${date.getFullYear()}`;
  }))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadPosts}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Noticias, proyectos y actualizaciones del Consejo Intermunicipal Higuito
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Columna principal - Posts */}
          <div className="lg:col-span-2">
            {/* Filtros de categoría */}
            <FadeIn className="mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('Todos')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'Todos'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                {categories.filter((c): c is string => c !== 'Todos' && c !== null).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Grid de posts */}
            <Stagger key={selectedCategory} className="space-y-8">
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={itemVariant}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="md:flex">
                      {/* Imagen */}
                      <div className="md:w-2/5 lg:w-1/3">
                        <img
                          src={post.cover_image?.startsWith('http') ? post.cover_image : `${API_BASE}${post.cover_image}`}
                          alt={post.title}
                          className="w-full h-64 md:h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1600&auto=format&fit=crop';
                          }}
                        />
                      </div>
                      
                      {/* Contenido */}
                      <div className="p-6 md:w-3/5 lg:w-2/3">
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{post.author_name || 'CIH'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FolderOpen className="w-4 h-4" />
                            <span>{post.category || 'General'}</span>
                          </div>
                        </div>

                        {/* Título */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Extracto */}
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Botón leer más */}
                        <div className="flex items-center gap-2 text-green-600 font-semibold group">
                          <span>Leer más</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </Stagger>

            {/* Mensaje si no hay posts */}
            {filteredPosts.length === 0 && (
              <FadeIn>
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No hay artículos en esta categoría.
                  </p>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              
              {/* Entradas recientes */}
              <FadeIn>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Entradas recientes
                  </h3>
                  <ul className="space-y-4">
                    {recentPosts.map((post) => (
                      <li key={post.id}>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="block group"
                        >
                          <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(post.published_at || post.created_at).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* Archivos */}
              <FadeIn>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Archivos
                  </h3>
                  <ul className="space-y-2">
                    {archives.map((archive, index) => (
                      <li key={index}>
                        <button className="text-gray-700 hover:text-green-600 transition-colors text-left w-full">
                          {archive}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* Categorías */}
              <FadeIn>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Categorías
                  </h3>
                  <ul className="space-y-2">
                    {categories.filter((c): c is string => c !== 'Todos' && c !== null).map((category) => {
                      const count = posts.filter(post => post.category === category).length;
                      return (
                        <li key={category}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className="text-gray-700 hover:text-green-600 transition-colors text-left w-full flex items-center justify-between"
                          >
                            <span>{category}</span>
                            <span className="text-sm text-gray-500">({count})</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
