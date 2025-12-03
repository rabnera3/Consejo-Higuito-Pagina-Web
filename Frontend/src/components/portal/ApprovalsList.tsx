import { useEffect, useState } from 'react';
import {
    fetchPendingRequestsForChief,
    fetchPendingRequestsForManager,
    approveRequestByChief,
    approveRequestByManager,
    rejectRequest,
    RequestEntry
} from '../../lib/api';

interface ApprovalsListProps {
    role: 'chief' | 'manager';
}

export function ApprovalsList({ role }: ApprovalsListProps) {
    const [requests, setRequests] = useState<RequestEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<number | null>(null);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const fetchFn = role === 'chief'
                ? fetchPendingRequestsForChief
                : fetchPendingRequestsForManager;
            const resp = await fetchFn();
            if (resp.success && resp.data) {
                setRequests(Array.isArray(resp.data) ? resp.data : [resp.data]);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error('Error loading approvals', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [role]);

    const handleApprove = async (id: number) => {
        if (!confirm('¿Está seguro de aprobar esta solicitud?')) return;

        try {
            setProcessing(id);
            const approveFn = role === 'chief'
                ? approveRequestByChief
                : approveRequestByManager;
            const resp = await approveFn(id);
            if (resp.success) {
                alert('Solicitud aprobada correctamente.');
                loadRequests();
            } else {
                alert('Error: ' + resp.message);
            }
        } catch (error: any) {
            alert('Error al aprobar: ' + error.message);
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt('Ingrese la razón del rechazo:');
        if (!reason) return;

        try {
            setProcessing(id);
            const resp = await rejectRequest(id, reason);
            if (resp.success) {
                alert('Solicitud rechazada.');
                loadRequests();
            } else {
                alert('Error: ' + resp.message);
            }
        } catch (error: any) {
            alert('Error al rechazar: ' + error.message);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div>Cargando solicitudes pendientes...</div>;

    if (requests.length === 0) {
        return <div style={{ padding: '1rem', color: '#64748b', fontStyle: 'italic' }}>No hay solicitudes pendientes de aprobación.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="cih-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Empleado</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id}>
                            <td>{new Date(req.created_at).toLocaleDateString()}</td>
                            <td>{req.employee?.full_name || 'Desconocido'}</td>
                            <td style={{ textTransform: 'capitalize' }}>{req.type}</td>
                            <td>{req.description}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn primary small"
                                        onClick={() => handleApprove(req.id)}
                                        disabled={processing === req.id}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        className="btn secondary small"
                                        onClick={() => handleReject(req.id)}
                                        disabled={processing === req.id}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' }}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
