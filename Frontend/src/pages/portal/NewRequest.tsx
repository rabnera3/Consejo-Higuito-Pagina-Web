import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createRequest, RequestEntry } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const REQUEST_TYPES: Array<{ value: RequestEntry['type']; label: string }> = [
    { value: 'vacaciones', label: 'Vacaciones' },
    { value: 'permiso', label: 'Permiso / Ausencia' },
    { value: 'insumos', label: 'Materiales / Equipo' },
    { value: 'vehiculo', label: 'Vehículo / Transporte' },
    { value: 'otro', label: 'Otro' },
];

const requiresDateRange = (type: RequestEntry['type']) => type === 'vacaciones' || type === 'permiso';

export default function NewRequestPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = user?.role ?? '';
    const isManager = role === 'gerente' || role === 'gerencia';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        type: REQUEST_TYPES[0].value,
        description: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!window.confirm('¿Está seguro que desea enviar esta solicitud?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            let finalDescription = formData.description;
            let startDate = undefined;
            let endDate = undefined;

            if (requiresDateRange(formData.type as RequestEntry['type'])) {
                if (!formData.startDate || !formData.endDate) {
                    setError('Por favor seleccione las fechas');
                    setLoading(false);
                    return;
                }
                // Keep description clean, but we can still append context if needed.
                // For now, let's just use the description field for the "Reason/Motivo"
                finalDescription = formData.reason || formData.description;
                startDate = formData.startDate;
                endDate = formData.endDate;
            } else {
                if (!formData.description) {
                    setError('Por favor describa su solicitud');
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                type: formData.type as RequestEntry['type'],
                description: finalDescription,
                start_date: startDate,
                end_date: endDate
            };

            const response = await createRequest(payload);

            if (response.success) {
                alert('Solicitud enviada exitosamente.');
                navigate('/portal/solicitudes');
            } else {
                setError('Error al crear la solicitud');
            }
        } catch (err: any) {
            setError(err.message || 'Error al crear la solicitud');
        } finally {
            setLoading(false);
        }
    };

    if (isManager) {
        return <Navigate to="/portal/solicitudes" replace />;
    }

    return (
        <section className="cih-card">
            <div className="cih-card__body">
                <h2 className="cih-card__title">Nueva Solicitud</h2>
                <p className="cih-card__subtitle">Complete el formulario para enviar su solicitud.</p>

                {error && <div className="alert alert-danger" style={{ marginTop: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    <div className="form-group">
                        <label htmlFor="type">Tipo de Solicitud</label>
                        <select
                            id="type"
                            name="type"
                            className="form-control"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            {REQUEST_TYPES.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {requiresDateRange(formData.type as RequestEntry['type']) ? (
                        <>
                            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="startDate">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        className="form-control"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="endDate">Fecha Fin</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        className="form-control"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reason">Motivo</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    className="form-control"
                                    rows={3}
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    placeholder="Describa el motivo..."
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describa detalladamente su solicitud..."
                                required
                            />
                        </div>
                    )}

                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="cih-btn"
                            onClick={() => navigate('/portal/solicitudes')}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cih-btn cih-btn--primary"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
