import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

interface FieldLog {
    id: number;
    project_name: string | null;
    log_date: string;
    activity_description: string;
    observations: string | null;
    weather_conditions: string | null;
    created_at: string;
}

export default function FieldLogsPage() {
    const [logs, setLogs] = useState<FieldLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/field-logs');
            if (response.success) {
                setLogs(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar las bitácoras');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="cih-card"><div className="cih-card__body">Cargando bitácoras...</div></div>;
    }

    return (
        <section className="cih-card">
            <div className="cih-card__body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 className="cih-card__title">Bitácora de Campo</h2>
                        <p className="cih-card__subtitle">Registro diario de actividades en campo.</p>
                    </div>
                    <Link to="/portal/bitacora-campo/nuevo" className="cih-btn cih-btn--primary">
                        + Nueva Entrada
                    </Link>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {logs.length === 0 ? (
                    <div className="cih-card">
                        <div className="cih-card__body" style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>No hay entradas en la bitácora.</p>
                            <Link to="/portal/bitacora-campo/nuevo" className="cih-btn cih-btn--primary" style={{ marginTop: '1rem' }}>
                                Crear Primera Entrada
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="cih-grid">
                        {logs.map((log) => (
                            <article className="cih-card" key={log.id}>
                                <div className="cih-card__body">
                                    <h3 className="cih-card__title">
                                        {log.project_name || `Actividad del ${new Date(log.log_date).toLocaleDateString('es-CR')}`}
                                    </h3>
                                    <p className="cih-card__subtitle">
                                        <strong>Fecha:</strong> {new Date(log.log_date).toLocaleDateString('es-CR')}
                                        {log.weather_conditions && <><br /><strong>Clima:</strong> {log.weather_conditions}</>}
                                    </p>
                                    <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                                        <strong>Actividad:</strong> {log.activity_description.substring(0, 100)}...
                                    </p>
                                    {log.observations && (
                                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                                            <strong>Observaciones:</strong> {log.observations.substring(0, 80)}...
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
