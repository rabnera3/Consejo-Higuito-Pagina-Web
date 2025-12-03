import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    fetchMyRequests,
    fetchRequestsByUnit,
    fetchPendingRequestsForChief,
    fetchPendingRequestsForManager,
    fetchApprovedRequestsHistory,
    approveRequestByChief,
    approveRequestByManager,
    rejectRequest,
    RequestEntry,
} from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

type TabId = 'my' | 'unit' | 'approvals';
type ApprovalScope = 'chief' | 'manager' | null;
type HistoryRange = '7' | '30' | '90' | '365';

export default function RequestsPage() {
    const { user } = useAuth();
    const role = user?.role ?? '';
    const isChief = role === 'jefe' || role === 'jefatura';
    const isManager = role === 'gerente' || role === 'gerencia';
    const isAdmin = role === 'admin';
    const canViewUnit = isChief;
    const showMyRequestsTab = !(isManager || isAdmin);
    const approvalScope: ApprovalScope = isManager ? 'manager' : isChief ? 'chief' : null;

    const tabs = useMemo(() => {
        const base: Array<{ id: TabId; label: string; description: string }> = [];
        if (showMyRequestsTab) {
            base.push({ id: 'my', label: 'Mis solicitudes', description: 'Historial y seguimiento personal.' });
        }
        if (canViewUnit) {
            base.push({ id: 'unit', label: 'Mi unidad', description: 'Solicitudes creadas por tu equipo.' });
        }
        if (approvalScope) {
            const labels: Record<Exclude<ApprovalScope, null>, string> = {
                chief: 'Pendientes de jefatura',
                manager: 'Pendientes de gerencia',
            };
            base.push({ id: 'approvals', label: labels[approvalScope], description: 'Aprueba o rechaza solicitudes pendientes.' });
        }
        return base;
    }, [canViewUnit, approvalScope, showMyRequestsTab]);

    const [activeTab, setActiveTab] = useState<TabId>(tabs[0]?.id ?? 'my');
    useEffect(() => {
        if (!tabs.some((tab) => tab.id === activeTab) && tabs.length > 0) {
            setActiveTab(tabs[0].id);
        }
    }, [tabs, activeTab]);

    const [requests, setRequests] = useState<RequestEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);
    const [adminHistoryRange, setAdminHistoryRange] = useState<HistoryRange>('30');
    const [adminHistoryEntries, setAdminHistoryEntries] = useState<RequestEntry[]>([]);
    const [adminHistoryLoading, setAdminHistoryLoading] = useState(false);
    const [adminHistoryError, setAdminHistoryError] = useState('');

    const hasTabs = tabs.length > 0;

    useEffect(() => {
        if (!hasTabs) {
            setRequests([]);
            setLoading(false);
            return;
        }

        let cancelled = false;
        const loadRequests = async () => {
            setLoading(true);
            setErrorMessage('');
            try {
                let response;
                if (activeTab === 'unit') {
                    response = await fetchRequestsByUnit();
                } else if (activeTab === 'approvals') {
                    if (approvalScope === 'chief') response = await fetchPendingRequestsForChief();
                    else if (approvalScope === 'manager') response = await fetchPendingRequestsForManager();
                    else response = { success: true, data: [] } as const;
                } else {
                    response = await fetchMyRequests();
                }

                if (cancelled) return;

                if (response.success && response.data) {
                    const data = Array.isArray(response.data) ? response.data : [response.data];
                    setRequests(data);
                } else {
                    setRequests([]);
                    if (response?.message) {
                        setErrorMessage(response.message);
                    }
                }
            } catch (error: any) {
                if (!cancelled) {
                    setRequests([]);
                    setErrorMessage(error?.message || 'Error al cargar solicitudes');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadRequests();
        return () => {
            cancelled = true;
        };
    }, [activeTab, approvalScope, refreshToken, hasTabs]);

    const computeDateRange = useCallback((range: HistoryRange) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - Number(range) + 1);
        const toISO = (date: Date) => date.toISOString().slice(0, 10);
        return { start: toISO(start), end: toISO(end) };
    }, []);

    const loadAdminHistory = useCallback(async (range: HistoryRange) => {
        if (!isAdmin) {
            setAdminHistoryEntries([]);
            setAdminHistoryError('');
            return;
        }

        setAdminHistoryLoading(true);
        setAdminHistoryError('');
        try {
            const { start, end } = computeDateRange(range);
            const resp = await fetchApprovedRequestsHistory({ start, end });
            if (resp.success && resp.data) {
                const data = Array.isArray(resp.data) ? resp.data : [resp.data];
                setAdminHistoryEntries(data);
            } else {
                setAdminHistoryEntries([]);
                setAdminHistoryError(resp.message || 'No se pudo obtener el historial.');
            }
        } catch (error: any) {
            setAdminHistoryEntries([]);
            setAdminHistoryError(error?.message || 'No se pudo obtener el historial.');
        } finally {
            setAdminHistoryLoading(false);
        }
    }, [computeDateRange, isAdmin]);

    useEffect(() => {
        if (!isAdmin) return;
        loadAdminHistory(adminHistoryRange);
    }, [isAdmin, adminHistoryRange, loadAdminHistory]);

    const formatDate = (value: string) => {
        try {
            return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(value));
        } catch (error) {
            return value;
        }
    };

    const getStatusBadge = (status: RequestEntry['status']) => {
        const badges: Record<RequestEntry['status'], { label: string; bg: string; color: string }> = {
            pending_approval: { label: 'Pendiente jefatura', bg: '#fff3cd', color: '#92400e' },
            pending_authorization: { label: 'Pendiente gerencia', bg: '#cce5ff', color: '#004085' },
            pending_admin: { label: 'Pendiente administración', bg: '#ede9fe', color: '#5b21b6' },
            approved: { label: 'Aprobada', bg: '#d1fae5', color: '#065f46' },
            rejected: { label: 'Rechazada', bg: '#fee2e2', color: '#991b1b' },
        };
        const badge = badges[status];
        return (
            <span
                className="badge"
                style={{
                    background: badge.bg,
                    color: badge.color,
                    textTransform: 'none',
                }}
            >
                {badge.label}
            </span>
        );
    };

    const describeType = (type: string) => {
        const map: Record<string, string> = {
            vacation: 'Vacaciones',
            vacaciones: 'Vacaciones',
            leave: 'Permiso',
            permiso: 'Permiso',
            materials: 'Materiales',
            insumos: 'Materiales',
            vehicle: 'Vehículo',
            vehiculo: 'Vehículo',
            other: 'Otro',
        };
        return map[type] || type;
    };

    const approvalLabels: Record<Exclude<ApprovalScope, null>, string> = {
        chief: 'jefatura',
        manager: 'gerencia',
    };

    const handleApprove = async (id: number) => {
        if (!approvalScope) return;
        const scopeLabel = approvalLabels[approvalScope];
        if (!confirm(`¿Aprobar esta solicitud como ${scopeLabel}?`)) return;
        try {
            setProcessingId(id);
            const approveFn = approvalScope === 'chief'
                ? approveRequestByChief
                : approveRequestByManager;
            const resp = await approveFn(id);
            if (!resp.success) {
                alert(resp.message || 'No se pudo aprobar la solicitud.');
            }
            setRefreshToken((token) => token + 1);
        } catch (error: any) {
            alert(error?.message || 'Error al aprobar la solicitud.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: number) => {
        if (!approvalScope) return;
        const reason = window.prompt('Describe la razón del rechazo:');
        if (!reason) return;
        try {
            setProcessingId(id);
            const resp = await rejectRequest(id, reason);
            if (!resp.success) {
                alert(resp.message || 'No se pudo rechazar la solicitud.');
            }
            setRefreshToken((token) => token + 1);
        } catch (error: any) {
            alert(error?.message || 'Error al rechazar la solicitud.');
        } finally {
            setProcessingId(null);
        }
    };

    const showEmployeeColumn = activeTab !== 'my';
    const showActions = activeTab === 'approvals' && !!approvalScope;

    const headerSubtitle = (() => {
        if (showMyRequestsTab) {
            return 'Crea, consulta y aprueba solicitudes desde un solo lugar.';
        }
        if (approvalScope === 'manager') {
            return 'Autorizaciones ejecutivas pendientes de tu revisión.';
        }
        if (approvalScope === 'chief') {
            return 'Da seguimiento a las solicitudes creadas por tu unidad.';
        }
        if (isAdmin) {
            return 'Administración recibe notificaciones automáticas cuando gerencia finaliza las solicitudes.';
        }
        return 'Consulta el estado de las solicitudes disponibles.';
    })();

    const showAdminNotice = isAdmin && !approvalScope && !showMyRequestsTab && !canViewUnit;

    return (
        <section className="cih-card" aria-labelledby="requests-title">
            <div className="cih-card__body">
                <header className="cih-card__header">
                    <div>
                        <h2 className="cih-card__title" id="requests-title">Centro de solicitudes</h2>
                        <p className="cih-card__subtitle">{headerSubtitle}</p>
                    </div>
                    {showMyRequestsTab && (
                        <Link to="/portal/solicitudes/nueva" className="cih-btn cih-btn--primary">
                            Nueva solicitud
                        </Link>
                    )}
                </header>

                {showAdminNotice && (
                    <div className="cih-alert" role="status" style={{ marginBottom: '1rem' }}>
                        Administración solo recibe alertas informativas; no se requieren aprobaciones manuales.
                    </div>
                )}

                {isAdmin && (
                    <div className="cih-card" style={{ marginBottom: '1.25rem' }}>
                        <div className="cih-card__body">
                            <div className="cih-card__header" style={{ alignItems: 'flex-start' }}>
                                <div>
                                    <h3 className="cih-card__title">Solicitudes aprobadas</h3>
                                    <p className="cih-card__subtitle">Listado informativo de solicitudes que ya cuentan con aprobación gerencial.</p>
                                </div>
                                <label className="cih-helper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Mostrar últimos
                                    <select
                                        value={adminHistoryRange}
                                        onChange={(e) => setAdminHistoryRange(e.target.value as HistoryRange)}
                                        className="form-control"
                                        style={{ width: '140px' }}
                                    >
                                        <option value="7">7 días</option>
                                        <option value="30">30 días</option>
                                        <option value="90">90 días</option>
                                        <option value="365">12 meses</option>
                                    </select>
                                </label>
                            </div>

                            {adminHistoryError && !adminHistoryLoading && (
                                <div className="cih-alert cih-alert--error" role="alert" style={{ marginBottom: '0.75rem' }}>
                                    {adminHistoryError}
                                </div>
                            )}

                            {adminHistoryLoading && <p className="cih-helper">Cargando historial…</p>}
                            {!adminHistoryLoading && !adminHistoryEntries.length && !adminHistoryError && (
                                <p className="cih-empty">No hay solicitudes aprobadas en este periodo.</p>
                            )}

                            {adminHistoryEntries.length > 0 && (
                                <div className="cih-table-wrap">
                                    <table className="cih-table">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Colaborador</th>
                                                <th>Tipo</th>
                                                <th>Descripción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adminHistoryEntries.map((entry) => (
                                                <tr key={`${entry.id}-${entry.updated_at ?? entry.created_at}`}>
                                                    <td data-label="Fecha">{formatDate(entry.updated_at ?? entry.created_at)}</td>
                                                    <td data-label="Colaborador">{entry.employee?.full_name || '—'}</td>
                                                    <td data-label="Tipo">{describeType(entry.type)}</td>
                                                    <td data-label="Descripción">
                                                        <p style={{ margin: 0 }}>{entry.description}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {hasTabs && (
                    <>
                        <nav role="tablist" aria-label="Secciones de solicitudes" className="cih-tabs" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    id={`requests-tab-${tab.id}`}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    aria-controls="requests-panel"
                                    type="button"
                                    className={`cih-btn ${activeTab === tab.id ? 'cih-btn--primary' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        <section
                            role="tabpanel"
                            id="requests-panel"
                            aria-labelledby={`requests-tab-${activeTab}`}
                            style={{ marginTop: '1rem' }}
                        >
                            <p className="cih-helper" style={{ marginBottom: '1rem' }}>
                                {tabs.find((tab) => tab.id === activeTab)?.description}
                            </p>

                            <div role="status" aria-live="polite" style={{ minHeight: '1.5rem', marginBottom: '0.5rem', color: errorMessage ? '#b91c1c' : '#475569' }}>
                                {loading
                                    ? 'Cargando solicitudes…'
                                    : errorMessage || `${requests.length} ${requests.length === 1 ? 'registro' : 'registros'} encontrados.`}
                            </div>

                            {loading ? (
                                <div className="text-center" style={{ padding: '2rem 0' }}>Cargando información…</div>
                            ) : requests.length === 0 ? (
                                <div className="cih-empty" role="alert">No hay solicitudes para esta vista.</div>
                            ) : (
                                <div className="cih-table-wrap" role="region" aria-live="polite">
                                    <table className="cih-table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Fecha</th>
                                                {showEmployeeColumn && <th scope="col">Empleado</th>}
                                                <th scope="col">Tipo</th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col">Estado</th>
                                                {showActions && <th scope="col" className="cih-text-right">Acciones</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((request) => (
                                                <tr key={request.id}>
                                                    <td data-label="Fecha">{formatDate(request.created_at)}</td>
                                                    {showEmployeeColumn && (
                                                        <td data-label="Empleado">{request.employee?.full_name || '—'}</td>
                                                    )}
                                                    <td data-label="Tipo">{describeType(request.type)}</td>
                                                    <td data-label="Descripción">
                                                        <p style={{ margin: 0 }}>{request.description}</p>
                                                        {request.rejection_reason && (
                                                            <small style={{ color: '#b91c1c' }}>Motivo rechazo: {request.rejection_reason}</small>
                                                        )}
                                                    </td>
                                                    <td data-label="Estado">{getStatusBadge(request.status)}</td>
                                                    {showActions && (
                                                        <td className="cih-text-right" data-label="Acciones">
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                                                <button
                                                                    type="button"
                                                                    className="cih-btn cih-btn--primary"
                                                                    onClick={() => handleApprove(request.id)}
                                                                    disabled={processingId === request.id}
                                                                    aria-label={`Aprobar solicitud de ${request.employee?.full_name || 'colaborador'}`}
                                                                >
                                                                    Aprobar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="cih-btn"
                                                                    onClick={() => handleReject(request.id)}
                                                                    disabled={processingId === request.id}
                                                                    aria-label={`Rechazar solicitud de ${request.employee?.full_name || 'colaborador'}`}
                                                                >
                                                                    Rechazar
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </section>
    );
}
