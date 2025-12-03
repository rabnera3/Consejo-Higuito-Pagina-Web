import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';

interface PhotoUpload {
    url: string;
    caption: string;
    file?: File;
}

export default function EditVisitReportPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const [formData, setFormData] = useState({
        project_name: '',
        location: '',
        visit_date: '',
        objectives: '',
        findings: '',
        agreements: '',
    });

    const [photos, setPhotos] = useState<PhotoUpload[]>([]);

    useEffect(() => {
        loadReport();
    }, [id]);

    const loadReport = async () => {
        try {
            setLoadingData(true);
            const response = await api.get(`/visit-reports/${id}`);
            if (response.success && response.data) {
                const report = response.data;
                setFormData({
                    project_name: report.project_name || '',
                    location: report.location,
                    visit_date: report.visit_date,
                    objectives: report.objectives,
                    findings: report.findings,
                    agreements: report.agreements || '',
                });
                if (report.photos && report.photos.length > 0) {
                    setPhotos(report.photos.map((p: any) => ({
                        url: p.photo_url,
                        caption: p.caption || ''
                    })));
                }
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar el reporte');
        } finally {
            setLoadingData(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingPhoto(true);
        setError('');

        try {
            const uploadedPhotos: PhotoUpload[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('photo', file);

                const response = await api.postFormData('/visit-reports/upload-photo', formData);

                if (response.success) {
                    uploadedPhotos.push({
                        url: response.url,
                        caption: '',
                        file: file
                    });
                }
            }

            setPhotos([...photos, ...uploadedPhotos]);
        } catch (err: any) {
            setError(err.message || 'Error al subir las fotos');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const updatePhotoCaption = (index: number, caption: string) => {
        const updated = [...photos];
        updated[index].caption = caption;
        setPhotos(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.location || !formData.visit_date || !formData.objectives || !formData.findings) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                photos: photos.map(p => ({ url: p.url, caption: p.caption }))
            };

            const response = await api.put(`/visit-reports/${id}`, payload);

            if (response.success) {
                navigate('/portal/reportes-visita');
            } else {
                setError(response.message || 'Error al actualizar el reporte');
            }
        } catch (err: any) {
            setError(err.message || 'Error al actualizar el reporte');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="cih-card"><div className="cih-card__body">Cargando reporte...</div></div>;
    }

    return (
        <section className="cih-card">
            <div className="cih-card__body">
                <h2 className="cih-card__title">Editar Reporte de Visita</h2>
                <p className="cih-card__subtitle">Actualiza la información del reporte.</p>

                <div className="alert" style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', color: '#856404' }}>
                    <strong>⚠️ Importante:</strong> Para que su reporte sea válido debe incluir fotografías que respalden los hallazgos.
                </div>

                {error && <div className="alert alert-danger" style={{ marginTop: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    <div className="form-group">
                        <label htmlFor="project_name">Nombre del Proyecto (Opcional)</label>
                        <input
                            type="text"
                            id="project_name"
                            name="project_name"
                            className="form-control"
                            value={formData.project_name}
                            onChange={handleInputChange}
                            placeholder="Ej: Mejoramiento Camino Rural"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Ubicación *</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="form-control"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Ej: Comunidad El Higuito, Pérez Zeledón"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="visit_date">Fecha de Visita *</label>
                        <input
                            type="date"
                            id="visit_date"
                            name="visit_date"
                            className="form-control"
                            value={formData.visit_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="objectives">Objetivos de la Visita *</label>
                        <textarea
                            id="objectives"
                            name="objectives"
                            className="form-control"
                            rows={3}
                            value={formData.objectives}
                            onChange={handleInputChange}
                            placeholder="Describe los objetivos de la visita..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="findings">Hallazgos *</label>
                        <textarea
                            id="findings"
                            name="findings"
                            className="form-control"
                            rows={4}
                            value={formData.findings}
                            onChange={handleInputChange}
                            placeholder="Describe los hallazgos y observaciones..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="agreements">Acuerdos / Compromisos</label>
                        <textarea
                            id="agreements"
                            name="agreements"
                            className="form-control"
                            rows={3}
                            value={formData.agreements}
                            onChange={handleInputChange}
                            placeholder="Acuerdos alcanzados con la comunidad..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Fotografías</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                            className="form-control"
                        />
                        {uploadingPhoto && <small>Subiendo fotos...</small>}
                    </div>

                    {photos.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <strong>Fotos cargadas ({photos.length})</strong>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                                {photos.map((photo, index) => (
                                    <div key={index} style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }}>
                                        <img
                                            src={`http://localhost:8080${photo.url}`}
                                            alt={`Foto ${index + 1}`}
                                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Descripción (opcional)"
                                            value={photo.caption}
                                            onChange={(e) => updatePhotoCaption(index, e.target.value)}
                                            style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.85rem', padding: '0.25rem' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.85rem', padding: '0.25rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="cih-btn"
                            onClick={() => navigate('/portal/reportes-visita')}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cih-btn cih-btn--primary"
                            disabled={loading || uploadingPhoto}
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Reporte'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
