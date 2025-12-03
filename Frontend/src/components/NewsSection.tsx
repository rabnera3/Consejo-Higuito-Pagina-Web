import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Stagger, itemVariant } from './figma/animations';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { blogService, BlogPost } from '../services/blogService';

export function NewsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getRecentPosts();
        // Sort by date just in case, though backend does it too
        const sorted = data.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        setPosts(sorted.slice(0, 3));
      } catch (error) {
        console.error('Failed to load blog posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Helper to get full image URL
  const getImageUrl = (path: string | null) => {
    if (!path) return 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&q=80&w=800'; // Default fallback
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  if (loading) {
    return (
      <section id="noticias" className="py-16 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // If no posts, hide section or show empty state? User wants real data. 
  // If empty, maybe just show nothing or a message. Let's show the section but with a message if empty.
  if (posts.length === 0) {
    return null; // Hide if no news
  }

  return (
    <section id="noticias" className="py-16 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="border-l-4 border-green-600 pl-4 mb-10">
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-gray-800">Noticias recientes</motion.h2>
        </div>

        <Stagger className="grid md:grid-cols-3 gap-6 mb-8 max-w-md mx-auto md:max-w-none">
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariant}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
            >
              <Link to={`/blog/${post.slug}`} className="block h-full flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="h-full w-full"
                  >
                    <ImageWithFallback
                      src={getImageUrl(post.cover_image)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="mb-3 text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <span className="text-sm font-medium text-green-600 group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                    Leer más &rarr;
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </Stagger>

        <div className="text-center">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/blog">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                VER MÁS NOTICIAS
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

