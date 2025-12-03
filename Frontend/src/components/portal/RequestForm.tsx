import { useState } from 'react';
import { createRequest } from '../../lib/api';

interface RequestFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function RequestForm({ onSuccess, onCancel }: RequestFormProps) {
    const [type, setType] = useState('vacaciones');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Por favor ingrese una descripción.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await createRequest({ type, description });
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Error al crear la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Nueva Solicitud</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tipo de Solicitud</label>
                        <select
                            className="form-control"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="vacaciones">Vacaciones</option>
                            <option value="permiso">Permiso</option>
                            <option value="insumos">Insumos</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Descripción / Detalle</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describa su solicitud..."
                        />
                    </div>

                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn secondary" onClick={onCancel} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn primary" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
