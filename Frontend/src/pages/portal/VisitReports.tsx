import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

interface VisitReport {
    id: number;
    project_name: string | null;
    location: string;
    visit_date: string;
    objectives: string;
    findings: string;
    agreements: string | null;
    photos: Array<{
        id: number;
        photo_url: string;
        caption: string | null;
    }>;
    created_at: string;
}

interface WeekGroup {
    weekStart: string;
    weekEnd: string;
    reports: VisitReport[];
}

export default function VisitReportsPage() {
    const [reports, setReports] = useState<VisitReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const response = await api.get('/visit-reports');
            if (response.success) {
                setReports(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar los reportes');
        } finally {
            setLoading(false);
        }
    };

    const deleteReport = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este reporte?')) return;

        try {
            const response = await api.delete(`/visit-reports/${id}`);
            if (response.success) {
                setReports(reports.filter(r => r.id !== id));
                if (expandedId === id) setExpandedId(null);
            } else {
                setError(response.message || 'Error al eliminar');
            }
        } catch (err: any) {
            setError(err.message || 'Error al eliminar el reporte');
        }
    };

    const getWeekStart = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    const groupByWeeks = (reports: VisitReport[]): WeekGroup[] => {
        const groups: { [key: string]: VisitReport[] } = {};

        reports.forEach(report => {
            const date = new Date(report.visit_date);
            const weekStart = getWeekStart(new Date(date));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const key = `${weekStart.toISOString().split('T')[0]}_${weekEnd.toISOString().split('T')[0]}`;

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(report);
        });

        return Object.entries(groups).map(([key, reports]) => {
            const [start, end] = key.split('_');
            return {
                weekStart: start,
                weekEnd: end,
                reports: reports.sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())
            };
        }).sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
    };

    if (loading) {
        return <div className="cih-card"><div className="cih-card__body">Cargando reportes...</div></div>;
    }

    const weekGroups = groupByWeeks(reports);

    return (
        <section className="cih-card">
            <div className="cih-card__body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 className="cih-card__title">Reportes de Visita</h2>
                        <p className="cih-card__subtitle">Registro de visitas a campo y comunidades.</p>
                    </div>
                    <Link to="/portal/reportes-visita/nuevo" className="cih-btn cih-btn--primary">
                        + Nuevo Reporte
                    </Link>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {reports.length === 0 ? (
                    <div className="cih-card">
                        <div className="cih-card__body" style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>No hay reportes registrados.</p>
                            <Link to="/portal/reportes-visita/nuevo" className="cih-btn cih-btn--primary" style={{ marginTop: '1rem' }}>
                                Crear Primer Reporte
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div>
                        {weekGroups.map((week, idx) => (
                            <div key={idx} style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#666', borderBottom: '2px solid #e0e0e0', paddingBottom: '0.5rem' }}>
                                    Semana del {new Date(week.weekStart).toLocaleDateString('es-CR')} al {new Date(week.weekEnd).toLocaleDateString('es-CR')}
                                </h3>
                                <div className="cih-grid">
                                    {week.reports.map((report) => (
                                        <article
                                            className="cih-card"
                                            key={report.id}
                                            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                                            onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                        >
                                            <div className="cih-card__body">
                                                <h3 className="cih-card__title">
                                                    {report.project_name || report.location}
                                                    <span style={{ float: 'right', fontSize: '0.9rem', color: '#999' }}>
                                                        {expandedId === report.id ? '▼' : '▶'}
                                                    </span>
                                                </h3>
                                                <p className="cih-card__subtitle">
                                                    <strong>Fecha:</strong> {new Date(report.visit_date).toLocaleDateString('es-CR')}
                                                    <br />
                                                    <strong>Ubicación:</strong> {report.location}
                                                </p>

                                                {expandedId === report.id && (
                                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }} onClick={(e) => e.stopPropagation()}>
                                                        <div style={{ marginBottom: '0.75rem' }}>
                                                            <strong>Objetivos:</strong>
                                                            <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>{report.objectives}</p>
                                                        </div>
                                                        <div style={{ marginBottom: '0.75rem' }}>
                                                            <strong>Hallazgos:</strong>
                                                            <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>{report.findings}</p>
                                                        </div>
                                                        {report.agreements && (
                                                            <div style={{ marginBottom: '0.75rem' }}>
                                                                <strong>Acuerdos:</strong>
                                                                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>{report.agreements}</p>
                                                            </div>
                                                        )}
                                                        {report.photos && report.photos.length > 0 && (
                                                            <div style={{ marginBottom: '0.75rem' }}>
                                                                <strong>Fotografías ({report.photos.length}):</strong>
                                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                                    {report.photos.map((photo, photoIdx) => (
                                                                        <div key={photoIdx}>
                                                                            <img
                                                                                src={`http://localhost:8080${photo.photo_url}`}
                                                                                alt={photo.caption || `Foto ${photoIdx + 1}`}
                                                                                style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                                                            />
                                                                            {photo.caption && (
                                                                                <small style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#666' }}>
                                                                                    {photo.caption}
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '0.5rem' }}>
                                                            <Link
                                                                to={`/portal/reportes-visita/editar/${report.id}`}
                                                                className="cih-btn"
                                                                style={{ background: '#007bff', color: 'white', fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none' }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteReport(report.id); }}
                                                                className="cih-btn"
                                                                style={{ background: '#dc3545', color: 'white', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {expandedId !== report.id && (
                                                    <>
                                                        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#666' }}>
                                                            {report.objectives.substring(0, 80)}...
                                                        </p>
                                                        {report.photos && report.photos.length > 0 && (
                                                            <div style={{ marginTop: '0.5rem' }}>
                                                                <small>📷 {report.photos.length} foto(s)</small>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
