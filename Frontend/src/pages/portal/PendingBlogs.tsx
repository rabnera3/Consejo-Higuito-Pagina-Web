import { useState, useEffect } from 'react';
import { blogApi, BlogPost } from '../../lib/api';

export default function PendingBlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [showRequestChanges, setShowRequestChanges] = useState(false);
    const [changeReason, setChangeReason] = useState('');

    useEffect(() => {
        loadPendingPosts();
    }, []);

    const loadPendingPosts = async () => {
        try {
            setLoading(true);
            // Fetch all posts with status 'draft'
            const response = await blogApi.getAll('draft');
            setPosts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error cargando posts pendientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (id: number) => {
        if (!confirm('¿Estás seguro de publicar este post?')) return;
        try {
            await blogApi.update(id, { status: 'published' });
            alert('Post publicado exitosamente');
            setSelectedPost(null); // Close modal if open
            await loadPendingPosts();
        } catch (error) {
            console.error('Error publicando post:', error);
            alert('Error al publicar el post');
        }
    };

    const handleRequestChanges = async () => {
        if (!selectedPost) return;
        if (!changeReason.trim()) {
            alert('Debes ingresar un motivo para solicitar cambios.');
            return;
        }
        try {
            await blogApi.requestChanges(selectedPost.id, changeReason);
            alert('Solicitud de cambios enviada exitosamente');
            setShowRequestChanges(false);
            setChangeReason('');
            setSelectedPost(null);
            await loadPendingPosts();
        } catch (error) {
            console.error('Error solicitando cambios:', error);
            alert('Error al solicitar cambios');
        }
    };

    if (loading) {
        return <div className="cih-section-stack"><p>Cargando...</p></div>;
    }

    return (
        <div className="cih-section-stack">
            <div className="cih-header">
                <h1 className="cih-header__title">Blogs Pendientes de Aprobación</h1>
                <p className="cih-header__description">
                    Revisa y publica los borradores creados por las jefaturas.
                </p>
            </div>

            <div className="cih-card">
                <div className="cih-card__body">
                    <div className="cih-table-wrap">
                        <table className="cih-table">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Unidad</th>
                                    <th>Fecha Creación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--cih-muted)' }}>
                                            No hay blogs pendientes de aprobación.
                                        </td>
                                    </tr>
                                ) : (
                                    posts.map(post => (
                                        <tr key={post.id}>
                                            <td>{post.title}</td>
                                            <td>{post.author_name || 'Desconocido'}</td>
                                            <td>{post.department_name || 'N/A'}</td>
                                            <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="cih-btn"
                                                        onClick={() => {
                                                            setSelectedPost(post);
                                                            setShowRequestChanges(false);
                                                            setChangeReason('');
                                                        }}
                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                                                    >
                                                        Ver
                                                    </button>
                                                    <button
                                                        className="cih-btn"
                                                        onClick={() => handlePublish(post.id)}
                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#d1fae5' }}
                                                    >
                                                        Publicar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {selectedPost && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Vista Previa</h2>
                            <button
                                onClick={() => setSelectedPost(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {selectedPost.cover_image && (
                                <img
                                    src={selectedPost.cover_image.startsWith('http') ? selectedPost.cover_image : `http://localhost:8080${selectedPost.cover_image}`}
                                    alt={selectedPost.title}
                                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1.5rem' }}
                                />
                            )}

                            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                                {selectedPost.title}
                            </h1>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                                <span>📅 {new Date(selectedPost.published_date || selectedPost.created_at).toLocaleDateString()}</span>
                                <span>👤 {selectedPost.author_name}</span>
                                <span>🏢 {selectedPost.department_name}</span>
                            </div>

                            <div style={{ marginBottom: '1.5rem', fontStyle: 'italic', color: '#475569', borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
                                {selectedPost.excerpt}
                            </div>

                            <div style={{ lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-wrap' }}>
                                {selectedPost.body}
                            </div>
                        </div>

                        {showRequestChanges ? (
                            <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff7ed' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9a3412' }}>Solicitar Cambios</h3>
                                <textarea
                                    className="cih-input"
                                    value={changeReason}
                                    onChange={(e) => setChangeReason(e.target.value)}
                                    placeholder="Describe los cambios necesarios..."
                                    rows={3}
                                    style={{ width: '100%', marginBottom: '1rem' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button
                                        className="cih-btn"
                                        onClick={() => setShowRequestChanges(false)}
                                        style={{ backgroundColor: 'white', border: '1px solid #cbd5e1' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="cih-btn"
                                        onClick={handleRequestChanges}
                                        style={{ backgroundColor: '#ea580c', color: 'white', borderColor: '#ea580c' }}
                                    >
                                        Enviar Solicitud
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f8fafc' }}>
                                <button
                                    className="cih-btn"
                                    onClick={() => setShowRequestChanges(true)}
                                    style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#ea580c', borderColor: '#ea580c' }}
                                >
                                    Solicitar Cambios
                                </button>
                                <button
                                    className="cih-btn"
                                    onClick={() => setSelectedPost(null)}
                                    style={{ backgroundColor: 'white', border: '1px solid #cbd5e1' }}
                                >
                                    Cerrar
                                </button>
                                <button
                                    className="cih-btn"
                                    onClick={() => handlePublish(selectedPost.id)}
                                    style={{ backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#d1fae5' }}
                                >
                                    Aprobar y Publicar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
