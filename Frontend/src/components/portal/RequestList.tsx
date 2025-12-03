import { useEffect, useState } from 'react';
import { fetchMyRequests, RequestEntry } from '../../lib/api';

export function RequestList({ refreshTrigger }: { refreshTrigger: number }) {
    const [requests, setRequests] = useState<RequestEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                setLoading(true);
                const resp = await fetchMyRequests();
                if (resp.success && resp.data) {
                    setRequests(Array.isArray(resp.data) ? resp.data : [resp.data]);
                }
            } catch (error) {
                console.error('Error loading requests', error);
            } finally {
                setLoading(false);
            }
        };
        loadRequests();
    }, [refreshTrigger]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Aprobado</span>;
            case 'rejected':
                return <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Rechazado</span>;
            case 'pending_authorization':
                return <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>En Gerencia</span>;
            case 'pending_admin':
                return <span className="badge" style={{ background: '#ede9fe', color: '#5b21b6' }}>En Administración</span>;
            default:
                return <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>En Jefatura</span>;
        }
    };

    if (loading) return <div>Cargando solicitudes...</div>;

    if (requests.length === 0) {
        return <div style={{ color: '#64748b', fontStyle: 'italic' }}>No has realizado solicitudes.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="cih-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id}>
                            <td>{new Date(req.created_at).toLocaleDateString()}</td>
                            <td style={{ textTransform: 'capitalize' }}>{req.type}</td>
                            <td>{req.description}</td>
                            <td>{getStatusBadge(req.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
