import { Calendar, User, ArrowLeft, Share2, FolderOpen } from 'lucide-react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogApi, BlogPost, API_BASE } from '../lib/api';
import { FadeIn } from '../components/figma/animations';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
      loadRecentPosts();
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogApi.getBySlug(postSlug);
      // La respuesta puede ser un post o un array, tomamos el primer elemento si es array
      const postData = Array.isArray(response.data) ? response.data[0] : response.data;
      setPost(postData || null);
    } catch (err) {
      console.error('Error cargando post:', err);
      setError('Post no encontrado');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPosts = async () => {
    try {
      const response = await blogApi.getAll('published');
      const posts = Array.isArray(response.data) ? response.data : [];
      const sorted = [...posts]
        .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
        .slice(0, 5);
      setRecentPosts(sorted);
    } catch (err) {
      console.error('Error cargando posts recientes:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente */}
      <div className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <FadeIn>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver al blog
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Contenido del artículo */}
          <div className="lg:col-span-2">
            <article>
              {/* Imagen destacada */}
              <FadeIn>
                <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                  <img
                    src={post.cover_image?.startsWith('http') ? post.cover_image : `${API_BASE}${post.cover_image}`}
                    alt={post.title}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1600&auto=format&fit=crop';
                    }}
                  />
                </div>
              </FadeIn>

              {/* Metadata */}
              <FadeIn>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author_name || 'CIH'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>{post.category || 'General'}</span>
                  </div>
                </div>
              </FadeIn>

              {/* Título */}
              <FadeIn>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                  {post.title}
                </h1>
              </FadeIn>

              {/* Video si existe */}
              {post.video_url && (
                <FadeIn>
                  <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                    <div className="relative pb-[56.25%]">
                      <iframe
                        src={post.video_url}
                        title={post.title}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Contenido */}
              <FadeIn>
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              </FadeIn>

              {/* Compartir */}
              <FadeIn>
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Compartir artículo
                    </h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          navigator.clipboard.writeText(url);
                          alert('Enlace copiado al portapapeles');
                        }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        aria-label="Copiar enlace"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        aria-label="Compartir en Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </article>
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
                    {recentPosts.filter(p => p.id !== post.id).slice(0, 4).map((recentPost) => (
                      <li key={recentPost.id}>
                        <Link
                          to={`/blog/${recentPost.slug}`}
                          className="block group"
                        >
                          <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-1">
                            {recentPost.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(recentPost.published_at || recentPost.created_at).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/blog"
                    className="block mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Ver todos los artículos →
                  </Link>
                </div>
              </FadeIn>

              {/* Categorías relacionadas */}
              <FadeIn>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Categoría
                  </h3>
                  <Link
                    to="/blog"
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {post.category}
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
