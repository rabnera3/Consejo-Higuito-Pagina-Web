import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { blogApi, BlogPost } from '../lib/api';
import '../styles/portal.css';

export default function BlogManager() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    cover_image: '',
    status: 'draft' as 'draft' | 'published'
  });

  const canManageBlog = user && ['admin', 'gerente', 'jefe'].includes(user.role || '');

  useEffect(() => {
    if (canManageBlog) {
      loadPosts();
    }
  }, [statusFilter, canManageBlog]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await blogApi.getAll(statusFilter === 'all' ? 'published' : statusFilter as any);
      setPosts(Array.isArray(response.data) ? response.data : response.data ? [response.data] : []);
    } catch (err: any) {
      console.error('Error cargando posts:', err);
      setError(err.message || 'Error al cargar posts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generar slug desde el título
    if (name === 'title' && !editingPost) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: slug.substring(0, 160) }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      const response = await blogApi.uploadImage(file);

      setFormData(prev => ({
        ...prev,
        cover_image: response.data?.url || ''
      }));
    } catch (err: any) {
      console.error('Error subiendo imagen:', err);
      alert(err.message || 'Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.body.trim()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      if (editingPost) {
        await blogApi.update(editingPost.id, formData);
      } else {
        await blogApi.create(formData);
      }
      
      setShowForm(false);
      setEditingPost(null);
      resetForm();
      loadPosts();
    } catch (err: any) {
      console.error('Error guardando post:', err);
      alert(err.message || 'Error al guardar post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      body: post.body,
      cover_image: post.cover_image || '',
      status: post.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este post? Esta acción no se puede deshacer.')) return;
    
    try {
      await blogApi.delete(id);
      loadPosts();
    } catch (err: any) {
      console.error('Error eliminando post:', err);
      alert(err.message || 'Error al eliminar post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      cover_image: '',
      status: 'draft'
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!canManageBlog) {
    return (
      <div className="cih-section-stack">
        <div className="cih-card">
          <div className="cih-card__body">
            <p style={{ color: 'var(--cih-muted)' }}>No tienes permisos para gestionar el blog.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cih-section-stack">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--cih-muted)' }}>
          Cargando posts...
        </div>
      </div>
    );
  }

  return (
    <div className="cih-section-stack">
      {/* DEBUG MARKER */}
      <div style={{ 
        background: '#fef2f2', 
        border: '2px solid #dc2626', 
        padding: '1rem', 
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        fontWeight: 'bold',
        color: '#dc2626'
      }}>
        ⚠️ ESTE ES BlogManager - SI VES ESTO, ESTÁ CARGANDO EL COMPONENTE INCORRECTO
      </div>
      
      <div className="cih-card">
        <div className="cih-card__body">
          <div className="cih-card__header">
            <div>
              <h2 className="cih-card__title">Gestión del Blog (BlogManager)</h2>
              <p className="cih-card__subtitle">Administra los posts del blog institucional</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cih-select"
                style={{ width: 'auto' }}
              >
                <option value="all">Todos</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
                <option value="archived">Archivados</option>
              </select>
              <button 
                className="cih-btn cih-btn--primary" 
                onClick={() => {
                  setShowForm(true);
                  setEditingPost(null);
                  resetForm();
                }}
              >
                + Nuevo Post
              </button>
            </div>
          </div>

          {error && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              background: '#fef2f2', 
              border: '1px solid #fecaca',
              color: 'var(--cih-danger)',
              marginTop: '1rem'
            }}>
              {error}
            </div>
          )}

          {showForm && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1.5rem', 
              border: '1px solid var(--cih-border)', 
              borderRadius: '1rem',
              background: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--cih-text)' }}>
                  {editingPost ? 'Editar Post' : 'Nuevo Post'}
                </h3>
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    resetForm();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'var(--cih-muted)',
                    padding: '0.25rem',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="cih-form">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="cih-form__group">
                    <label htmlFor="title" className="cih-form__label">Título *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      placeholder="Título claro y descriptivo"
                      className="cih-input"
                    />
                  </div>

                  <div className="cih-form__group">
                    <label htmlFor="status" className="cih-form__label">Estado *</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="cih-select"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                </div>

                <div className="cih-form__group">
                  <label htmlFor="slug" className="cih-form__label">Slug (URL) *</label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    pattern="[a-z0-9\-]+"
                    placeholder="se-genera-automaticamente"
                    className="cih-input"
                  />
                  <small className="cih-helper">Solo minúsculas, números y guiones. Se genera automáticamente del título.</small>
                </div>

                <div className="cih-form__group">
                  <label htmlFor="excerpt" className="cih-form__label">Resumen / Extracto *</label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    minLength={30}
                    rows={3}
                    placeholder="Breve resumen del contenido (mínimo 30 caracteres)"
                    className="cih-input"
                    style={{ resize: 'vertical' }}
                  />
                  <small className="cih-helper">{formData.excerpt.length} caracteres</small>
                </div>

                <div className="cih-form__group">
                  <label htmlFor="body" className="cih-form__label">Contenido *</label>
                  <textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    required
                    rows={12}
                    placeholder="Contenido completo del post. Soporta Markdown básico: **negrita**, _itálica_, # encabezados, - listas"
                    className="cih-input"
                    style={{ resize: 'vertical', fontFamily: 'monospace' }}
                  />
                  <small className="cih-helper">{formData.body.length} caracteres</small>
                </div>

                <div className="cih-form__group">
                  <label htmlFor="cover_image_file" className="cih-form__label">Imagen de portada</label>
                  <input
                    type="file"
                    id="cover_image_file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="cih-input"
                  />
                  <small className="cih-helper">Formato recomendado: horizontal (16:9). Máximo 5MB.</small>
                  {uploadingImage && <p className="cih-helper" style={{ marginTop: '0.5rem' }}>Subiendo imagen...</p>}
                  {formData.cover_image && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      <img 
                        src={`http://localhost:8080${formData.cover_image}`}
                        alt="Preview" 
                        style={{ 
                          maxWidth: '300px', 
                          height: 'auto', 
                          borderRadius: '0.75rem',
                          border: '1px solid var(--cih-border)'
                        }}
                      />
                      <button 
                        type="button"
                        className="cih-btn"
                        onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                      >
                        Quitar imagen
                      </button>
                    </div>
                  )}
                </div>

                <div className="cih-form__actions">
                  <button 
                    type="button" 
                    className="cih-btn" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="cih-btn cih-btn--primary">
                    {editingPost ? 'Actualizar Post' : 'Publicar Post'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="cih-table-wrap" style={{ marginTop: '1.5rem' }}>
            <table className="cih-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Autor</th>
                  <th>Fecha</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--cih-muted)', padding: '2rem' }}>
                      No hay posts disponibles
                    </td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id}>
                      <td>
                        <div>
                          <strong>{post.title}</strong>
                          {post.cover_image && <span style={{ marginLeft: '0.5rem' }}>📷</span>}
                          <div style={{ fontSize: '0.875rem', color: 'var(--cih-muted)', marginTop: '0.25rem' }}>
                            {(post.excerpt || '').substring(0, 80)}...
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="cih-chip" 
                          style={{ 
                            background: post.status === 'published' ? '#d1fae5' : 
                                       post.status === 'draft' ? '#fef3c7' : '#f3f4f6',
                            color: post.status === 'published' ? '#065f46' : 
                                   post.status === 'draft' ? '#92400e' : '#374151'
                          }}
                        >
                          {post.status === 'published' ? 'Publicado' : 
                           post.status === 'draft' ? 'Borrador' : 'Archivado'}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div>{post.author_name}</div>
                          {post.department_name && (
                            <small style={{ color: 'var(--cih-muted)' }}>{post.department_name}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <small>{formatDate(post.published_at || post.created_at)}</small>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="cih-btn"
                            onClick={() => handleEdit(post)}
                            title="Editar"
                            style={{ padding: '0.4rem 0.75rem' }}
                          >
                            ✏️
                          </button>
                          <button 
                            className="cih-btn"
                            onClick={() => handleDelete(post.id)}
                            title="Eliminar"
                            style={{ padding: '0.4rem 0.75rem', borderColor: 'var(--cih-danger)', color: 'var(--cih-danger)' }}
                          >
                            🗑️
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
    </div>
  );
}
