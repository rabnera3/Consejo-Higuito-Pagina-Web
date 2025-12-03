import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function NewFieldLogPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        project_name: '',
        log_date: new Date().toISOString().split('T')[0],
        activity_description: '',
        observations: '',
        weather_conditions: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.log_date || !formData.activity_description) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/field-logs', formData);

            if (response.success) {
                navigate('/portal/bitacora-campo');
            } else {
                setError(response.message || 'Error al crear la entrada');
            }
        } catch (err: any) {
            setError(err.message || 'Error al crear la entrada');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="cih-card">
            <div className="cih-card__body">
                <h2 className="cih-card__title">Nueva Entrada de Bitácora</h2>
                <p className="cih-card__subtitle">Registra las actividades diarias en campo.</p>

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
                            placeholder="Ej: Acueducto Comunal"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="log_date">Fecha *</label>
                        <input
                            type="date"
                            id="log_date"
                            name="log_date"
                            className="form-control"
                            value={formData.log_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="activity_description">Descripción de Actividad *</label>
                        <textarea
                            id="activity_description"
                            name="activity_description"
                            className="form-control"
                            rows={4}
                            value={formData.activity_description}
                            onChange={handleInputChange}
                            placeholder="Describe las actividades realizadas hoy..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="weather_conditions">Condiciones Climáticas</label>
                        <select
                            id="weather_conditions"
                            name="weather_conditions"
                            className="form-control"
                            value={formData.weather_conditions}
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Soleado">Soleado</option>
                            <option value="Parcialmente Nublado">Parcialmente Nublado</option>
                            <option value="Nublado">Nublado</option>
                            <option value="Lluvia Ligera">Lluvia Ligera</option>
                            <option value="Lluvia Fuerte">Lluvia Fuerte</option>
                            <option value="Tormenta">Tormenta</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="observations">Observaciones Adicionales</label>
                        <textarea
                            id="observations"
                            name="observations"
                            className="form-control"
                            rows={3}
                            value={formData.observations}
                            onChange={handleInputChange}
                            placeholder="Notas adicionales, incidentes, o hallazgos relevantes..."
                        />
                    </div>

                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="cih-btn"
                            onClick={() => navigate('/portal/bitacora-campo')}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cih-btn cih-btn--primary"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Entrada'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
