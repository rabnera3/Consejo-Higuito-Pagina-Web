import { useState, useEffect } from 'react';
import { blogApi, BlogPost, API_BASE, fetchDepartments, Department } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function BlogNuevoPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    cover_image: '',
    video_url: '',
    category: 'Noticias',
    tags: '',
    published_date: new Date().toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'published',
    department_id: user?.department_id || 0
  });

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'gerente';

  useEffect(() => {
    loadPosts();
    if (isAdminOrManager) {
      loadDepartments();
    }
  }, [isAdminOrManager]);

  const loadDepartments = async () => {
    try {
      const response = await fetchDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Error cargando departamentos:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll('all');
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error cargando posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (formData.title.length < 8) {
      alert('El título debe tener al menos 8 caracteres');
      return;
    }

    if (formData.excerpt.length < 30) {
      alert('El resumen debe tener al menos 30 caracteres');
      return;
    }

    try {
      // Si hay imagen para subir
      let imageUrl = formData.cover_image;
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadResponse = await blogApi.uploadImage(imageFile);
          console.log('Upload response:', uploadResponse);

          // La respuesta es { success: true, data: { url: '/uploads/blog/...' } }
          if (uploadResponse.success && uploadResponse.data?.url) {
            imageUrl = uploadResponse.data.url;
          } else {
            throw new Error('Respuesta de upload inválida');
          }
          setUploadingImage(false);
        } catch (uploadError) {
          setUploadingImage(false);
          console.error('Error subiendo imagen:', uploadError);
          alert('Error al subir la imagen: ' + (uploadError instanceof Error ? uploadError.message : 'Error desconocido'));
          return; // No continuar si falla el upload
        }
      }

      const dataToSend = {
        ...formData,
        cover_image: imageUrl,
        // Si no es admin/gerente, forzar status draft y su propio departamento (aunque el backend también lo protege)
        status: isAdminOrManager ? formData.status : 'draft',
        department_id: isAdminOrManager ? formData.department_id : user?.department_id
      };

      if (editingPost) {
        await blogApi.update(editingPost.id, dataToSend);
        alert('Post actualizado exitosamente');
      } else {
        await blogApi.create(dataToSend);
        alert('Post creado exitosamente');
      }

      // Limpiar formulario
      setEditingPost(null);
      setImageFile(null);
      setImagePreview('');
      setFormData({
        title: '',
        excerpt: '',
        body: '',
        cover_image: '',
        video_url: '',
        category: 'Noticias',
        tags: '',
        published_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        department_id: user?.department_id || 0
      });

      // Recargar lista de posts
      await loadPosts();
    } catch (error) {
      console.error('Error guardando post:', error);
      alert('Error al guardar el post: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setImageFile(null); // Limpiar archivo seleccionado
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      body: post.body,
      cover_image: post.cover_image || '',
      video_url: post.video_url || '',
      category: post.category || 'Noticias',
      tags: post.tags || '',
      published_date: post.published_date || new Date().toISOString().split('T')[0],
      status: post.status,
      department_id: post.department_id || user?.department_id || 0
    });

    // Mostrar vista previa de imagen existente
    if (post.cover_image) {
      // Si la imagen ya tiene http/https, usarla directamente
      // Si no, agregar el API_BASE para mostrarla
      const imageUrl = post.cover_image.startsWith('http')
        ? post.cover_image
        : `${API_BASE}${post.cover_image}`;

      setImagePreview(imageUrl);
    } else {
      setImagePreview('');
    }

    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este post?')) return;
    try {
      await blogApi.delete(id);
      alert('Post eliminado exitosamente');
      await loadPosts();
    } catch (error) {
      console.error('Error eliminando post:', error);
      alert('Error al eliminar el post: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      title: '',
      excerpt: '',
      body: '',
      cover_image: '',
      video_url: '',
      category: 'Noticias',
      tags: '',
      published_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      department_id: user?.department_id || 0
    });
  };

  if (loading) {
    return <div className="cih-section-stack"><p>Cargando...</p></div>;
  }

  return (
    <div className="cih-section-stack">
      {/* Header */}
      <div className="cih-header">
        <h1 className="cih-header__title">Nuevo Post del Blog</h1>
        <p className="cih-header__description">
          Formulario claro y sencillo para publicar contenido. Tu unidad se completa automáticamente.
        </p>
      </div>

      {/* Form Card */}
      <div className="cih-card">
        <div className="cih-card__body">

          <form onSubmit={handleSubmit} className="cih-form">
            {/* Información Básica */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--cih-text)' }}>Información básica</h3>

              <div className="cih-form__group">
                <label htmlFor="titulo" className="cih-form__label">Título *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  className="cih-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  minLength={8}
                />
                <small className="cih-helper">Debe ser claro y descriptivo (mínimo 8 caracteres)</small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cih-form__group">
                  <label htmlFor="unidad-display" className="cih-form__label">Unidad</label>
                  {isAdminOrManager ? (
                    <select
                      id="unidad-display"
                      className="cih-select"
                      value={formData.department_id}
                      onChange={(e) => setFormData({ ...formData, department_id: Number(e.target.value) })}
                    >
                      <option value={0}>Seleccionar unidad...</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="unidad-display"
                      className="cih-input"
                      value={user?.department_name || 'Sin unidad'}
                      readOnly
                      title="Unidad a la que perteneces"
                      style={{ backgroundColor: '#f8fafc' }}
                    />
                  )}
                  <small className="cih-helper">
                    {isAdminOrManager ? 'Puedes asignar el post a cualquier unidad.' : 'Se usa automáticamente tu unidad.'}
                  </small>
                </div>

                <div className="cih-form__group">
                  <label htmlFor="categoria" className="cih-form__label">Categoría *</label>
                  <select
                    id="categoria"
                    name="categoria"
                    className="cih-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    title="Categoría del post"
                  >
                    <option value="Noticias">Noticias</option>
                    <option value="Proyectos">Proyectos</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Comunidad">Comunidad</option>
                  </select>
                </div>
              </div>

              <div className="cih-form__group">
                <label htmlFor="tags" className="cih-form__label">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  className="cih-input"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="agua, participación, género"
                />
              </div>

              <div className="cih-form__group">
                <label htmlFor="imagenFile" className="cih-form__label">Imagen del post</label>
                <input
                  type="file"
                  id="imagenFile"
                  className="cih-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small className="cih-helper">Puedes subir una imagen desde tu computadora. Formato horizontal recomendado.</small>

                {/* Vista previa de imagen */}
                {imagePreview && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#64748b' }}>
                      {editingPost && !imageFile ? '📷 Imagen actual del post:' : '✨ Vista previa:'}
                    </p>
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '0.5rem',
                        border: '2px solid var(--cih-border)',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Error cargando imagen:', imagePreview);
                        e.currentTarget.style.border = '2px solid red';
                        e.currentTarget.alt = '❌ Error al cargar imagen';
                      }}
                    />
                    <small style={{ display: 'block', marginTop: '0.5rem', color: '#64748b' }}>
                      {imagePreview.startsWith('data:') ? 'Imagen desde computadora' : imagePreview}
                    </small>
                  </div>
                )}
              </div>

              <div className="cih-form__group">
                <label htmlFor="video" className="cih-form__label">URL de Video (YouTube opcional)</label>
                <input
                  type="url"
                  id="video"
                  name="video"
                  className="cih-input"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div className="cih-form__group">
                <label htmlFor="estado" className="cih-form__label" title="Estado de publicación">Estado *</label>
                <select
                  id="estado"
                  name="estado"
                  className="cih-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                  required
                  disabled={!isAdminOrManager}
                  style={!isAdminOrManager ? { backgroundColor: '#f8fafc', cursor: 'not-allowed' } : {}}
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
                {!isAdminOrManager && (
                  <small className="cih-helper">Solo los administradores pueden publicar directamente.</small>
                )}
              </div>

              <div className="cih-form__group">
                <label htmlFor="fecha" className="cih-form__label">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  className="cih-input"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contenido */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--cih-text)' }}>Contenido</h3>

              <div className="cih-form__group">
                <label htmlFor="excerpt" className="cih-form__label">Resumen / Extracto *</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  className="cih-input"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  required
                  minLength={30}
                  placeholder="Pequeño resumen introductorio del contenido..."
                  style={{ resize: 'vertical' }}
                />
                <small className="cih-helper">Mínimo ~30 caracteres</small>
              </div>

              <div className="cih-form__group">
                <label htmlFor="contenido" className="cih-form__label">Contenido *</label>
                <textarea
                  id="contenido"
                  name="contenido"
                  className="cih-input"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={12}
                  required
                  placeholder="Escribe el texto del post. Si conoces Markdown, también puedes usar **negrita**, _itálica_, encabezados (#) y listas (-)"
                  style={{ resize: 'vertical' }}
                />
                <small className="cih-helper">
                  Tip: Puedes escribir texto normal. Opcionalmente, soporta: encabezados (#), negrita ** **, itálica _ _, listas -, enlaces [texto](url)
                </small>
              </div>
            </div>

            <div className="cih-form__actions">
              <button
                type="button"
                className="cih-btn"
                onClick={handleCancel}
                disabled={uploadingImage}
              >
                Limpiar
              </button>
              <button
                type="submit"
                id="btn-guardar-post"
                className="cih-btn cih-btn--primary"
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Subiendo imagen...' : (editingPost ? 'Actualizar' : 'Guardar') + ' Post'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Posts guardados */}
      <div className="cih-card" style={{ marginTop: '3rem' }}>
        <div className="cih-card__body">
          <h2 className="cih-card__title" style={{ marginBottom: '1.5rem' }}>Posts guardados</h2>
          <div className="cih-table-wrap">
            <table className="cih-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--cih-muted)' }}>
                      No hay posts guardados
                    </td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td>{new Date(post.published_date || post.created_at).toLocaleDateString()}</td>
                      <td>
                        <span
                          className="cih-chip"
                          style={{
                            background: post.status === 'published' ? '#d1fae5' : '#fef3c7',
                            color: post.status === 'published' ? '#065f46' : '#92400e'
                          }}
                        >
                          {post.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td>{post.department_name || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="cih-btn"
                            onClick={() => handleEdit(post)}
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                          >
                            Editar
                          </button>
                          <button
                            className="cih-btn"
                            onClick={() => handleDelete(post.id)}
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderColor: 'var(--cih-danger)', color: 'var(--cih-danger)' }}
                          >
                            Eliminar
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
