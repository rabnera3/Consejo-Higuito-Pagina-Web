import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EmployeeSummary,
  PlanificacionEntry,
  RequestEntry,
  fetchEmployees,
  fetchPendingRequestsForManager,
  fetchPlanificacion,
  fetchApprovedRequestsHistory,
  isApiHalted,
  resetApiFailureState,
} from '../../lib/api';

type HistoryRange = '7' | '30' | '90' | '365';

export default function PortalManagerPanelPage() {
  const [requestsPreview, setRequestsPreview] = useState<RequestEntry[]>([]);
  const [upcomingPlan, setUpcomingPlan] = useState<PlanificacionEntry[]>([]);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    upcomingActivities: 0,
    totalEmployees: 0,
    unitsWithStaff: 0,
  });
  const [requestsError, setRequestsError] = useState('');
  const [planError, setPlanError] = useState('');
  const [historyEntries, setHistoryEntries] = useState<RequestEntry[]>([]);
  const [historyRange, setHistoryRange] = useState<HistoryRange>('30');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [halted, setHalted] = useState(false);

  const loadPanelData = useCallback(async () => {
    if (isApiHalted()) {
      setHalted(true);
      setError('Peticiones suspendidas tras múltiples fallos.');
      return;
    }

    setLoading(true);
    setError('');
    setRequestsError('');
    setPlanError('');
    setHalted(false);

    try {
      const [employeesResp, requestsResp, planResp] = await Promise.all([
        fetchEmployees({ sort: 'az' }),
        fetchPendingRequestsForManager(),
        fetchPlanificacion(),
      ]);

      let totalEmployees = 0;
      let unitsWithStaff = 0;
      if (employeesResp.success) {
        const dataset = Array.isArray(employeesResp.data?.employees) ? employeesResp.data.employees : [];
        totalEmployees = dataset.length;
        const headcount = dataset.reduce<Record<string, number>>((acc, employee: EmployeeSummary) => {
          const unit = (employee.departamento || 'Sin unidad').trim() || 'Sin unidad';
          acc[unit] = (acc[unit] || 0) + 1;
          return acc;
        }, {});
        unitsWithStaff = Object.keys(headcount).length;
      } else {
        setError(employeesResp?.message || 'No se pudo cargar el personal.');
      }

      let pendingRequests = 0;
      if (requestsResp.success) {
        const list = Array.isArray(requestsResp.data) ? requestsResp.data : requestsResp.data ? [requestsResp.data] : [];
        pendingRequests = list.length;
        setRequestsPreview(list.slice(0, 5));
        setRequestsError('');
      } else {
        setRequestsPreview([]);
        setRequestsError(requestsResp?.message || 'No se pudo cargar la bandeja de gerencia.');
      }

      let activitiesNextWeek: PlanificacionEntry[] = [];
      if (planResp.success) {
        const entries = Array.isArray(planResp.data) ? planResp.data : planResp.data ? [planResp.data] : [];
        const now = new Date();
        const limit = new Date();
        limit.setDate(limit.getDate() + 7);
        activitiesNextWeek = entries
          .filter((entry) => {
            const date = new Date(entry.fecha);
            return date >= now && date <= limit;
          })
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .slice(0, 5);
        setUpcomingPlan(activitiesNextWeek);
        setPlanError('');
      } else {
        setUpcomingPlan([]);
        setPlanError(planResp?.message || 'No se pudo cargar la planificación.');
      }

      setStats({
        pendingRequests,
        upcomingActivities: activitiesNextWeek.length,
        totalEmployees,
        unitsWithStaff,
      });
      setLastUpdated(new Date().toISOString());
    } catch (err: any) {
      setError(err?.message || 'Error al cargar el panel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPanelData();
  }, [loadPanelData]);

  useEffect(() => {
    const onHalt = () => {
      setHalted(true);
      setError('Peticiones suspendidas tras múltiples fallos.');
    };
    const onResume = () => {
      setHalted(false);
      setError('');
      loadPanelData();
    };
    window.addEventListener('api:halt', onHalt);
    window.addEventListener('api:resumed', onResume);
    return () => {
      window.removeEventListener('api:halt', onHalt);
      window.removeEventListener('api:resumed', onResume);
    };
  }, [loadPanelData]);

  const handleRetry = () => {
    resetApiFailureState();
    loadPanelData();
  };

  const computeDateRange = (range: string) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - Number(range) + 1);
    const toISO = (date: Date) => date.toISOString().slice(0, 10);
    return { start: toISO(start), end: toISO(end) };
  };

  const loadHistory = useCallback(async (range: HistoryRange) => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const { start, end } = computeDateRange(range);
      const resp = await fetchApprovedRequestsHistory({ start, end });
      if (resp.success) {
        const data = Array.isArray(resp.data) ? resp.data : resp.data ? [resp.data] : [];
        setHistoryEntries(data);
      } else {
        setHistoryEntries([]);
        setHistoryError(resp.message || 'No se pudo obtener el historial.');
      }
    } catch (err: any) {
      setHistoryEntries([]);
      setHistoryError(err?.message || 'No se pudo obtener el historial.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(historyRange);
  }, [historyRange, loadHistory]);

  const formattedUpdatedAt = lastUpdated
    ? new Intl.DateTimeFormat('es-CR', { hour: '2-digit', minute: '2-digit' }).format(new Date(lastUpdated))
    : '—';

  const describeType = (type: RequestEntry['type']) => {
    const map: Record<string, string> = {
      vacaciones: 'Vacaciones',
      permiso: 'Permiso',
      insumos: 'Materiales',
      vehiculo: 'Vehículo',
      otro: 'Otro',
    };
    return map[type] || type;
  };

  const describePlanRow = (entry: PlanificacionEntry) => (
    `${entry.lugar || entry.area || 'Sin ubicación'}${entry.linea_servicio ? ` · ${entry.linea_servicio}` : ''}`
  );

  const kpis = [
    {
      label: 'Solicitudes pendientes',
      value: stats.pendingRequests.toString(),
      helper: 'Esperando firma de gerencia',
    },
    {
      label: 'Actividades próximas (7 días)',
      value: stats.upcomingActivities.toString(),
      helper: 'Planificación ejecutiva',
    },
    {
      label: 'Colaboradores activos',
      value: stats.totalEmployees.toString(),
      helper: `${stats.unitsWithStaff} unidades con personal`,
    },
  ];

  return (
    <section className="cih-card" aria-labelledby="portal-manager-title">
      <div className="cih-card__body">
        <div className="cih-card__header">
          <div>
            <h2 className="cih-card__title" id="portal-manager-title">Panel Gerencial</h2>
            <p className="cih-card__subtitle">
              Resumen ejecutado en tiempo real con la información disponible en la base de datos institucional.
            </p>
            <p className="cih-helper">Actualizado a las {formattedUpdatedAt}</p>
          </div>
          <button className="cih-btn cih-btn--primary" type="button" onClick={loadPanelData}>Actualizar</button>
        </div>

        <div className="cih-kpi-grid">
          {kpis.map((goal) => (
            <div className="cih-kpi" key={goal.label}>
              <p className="cih-kpi__label">{goal.label}</p>
              <p className="cih-kpi__value">{goal.value}</p>
              <p className="cih-helper">{goal.helper}</p>
            </div>
          ))}
        </div>

        <div className="cih-section-grid">
          <div className="cih-card">
            <div className="cih-card__body">
              <div className="cih-card__header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h3 className="cih-card__title">Solicitudes más recientes</h3>
                  <p className="cih-card__subtitle">Revisa las cinco peticiones que aún esperan resolución.</p>
                </div>
                <Link to="/portal/solicitudes" className="cih-btn cih-btn--ghost">Abrir bandeja</Link>
              </div>

              {requestsError && !loading && (
                <div className="cih-alert cih-alert--error" role="alert" style={{ marginBottom: '0.75rem' }}>
                  {requestsError}
                </div>
              )}

              {loading && <p className="cih-helper">Cargando solicitudes...</p>}
              {!loading && !requestsPreview.length && !requestsError && (
                <p className="cih-empty">No hay solicitudes pendientes de gerencia.</p>
              )}

              {requestsPreview.length > 0 && (
                <div className="cih-table-wrap">
                  <table className="cih-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Colaborador</th>
                        <th>Tipo</th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestsPreview.map((request) => (
                        <tr key={request.id}>
                          <td data-label="Fecha">
                            {new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(request.created_at))}
                          </td>
                          <td data-label="Colaborador">{request.employee?.full_name || '—'}</td>
                          <td data-label="Tipo">{describeType(request.type)}</td>
                          <td data-label="Detalle">
                            <p style={{ margin: 0 }}>{request.description}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="cih-card">
            <div className="cih-card__body">
              <div className="cih-card__header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h3 className="cih-card__title">Agenda próxima semana</h3>
                  <p className="cih-card__subtitle">Eventos y desplazamientos programados en los próximos 7 días.</p>
                </div>
                <Link to="/portal/planificacion" className="cih-btn cih-btn--ghost">Ver todo</Link>
              </div>

              {planError && !loading && (
                <div className="cih-alert cih-alert--error" role="alert" style={{ marginBottom: '0.75rem' }}>
                  {planError}
                </div>
              )}

              {loading && <p className="cih-helper">Cargando agenda...</p>}
              {!loading && !upcomingPlan.length && !planError && (
                <p className="cih-empty">No hay actividades programadas para la próxima semana.</p>
              )}

              {upcomingPlan.length > 0 && (
                <div className="cih-table-wrap">
                  <table className="cih-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Equipo</th>
                        <th>Actividad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingPlan.map((entry) => (
                        <tr key={`${entry.id}-${entry.fecha}`}>
                          <td data-label="Fecha">
                            {new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(entry.fecha))}
                          </td>
                          <td data-label="Equipo">{entry.empleado_nombre || entry.area || '—'}</td>
                          <td data-label="Actividad">{describePlanRow(entry)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="cih-card" style={{ marginTop: '1.5rem' }}>
          <div className="cih-card__body">
            <div className="cih-card__header" style={{ alignItems: 'flex-start' }}>
              <div>
                <h3 className="cih-card__title">Solicitudes aprobadas</h3>
                <p className="cih-card__subtitle">Resumen de solicitudes ya autorizadas por gerencia dentro del rango elegido.</p>
              </div>
              <label className="cih-helper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Mostrar últimos
                <select
                  value={historyRange}
                  onChange={(e) => setHistoryRange(e.target.value as HistoryRange)}
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

            {historyError && !historyLoading && (
              <div className="cih-alert cih-alert--error" role="alert" style={{ marginBottom: '0.75rem' }}>
                {historyError}
              </div>
            )}

            {historyLoading && <p className="cih-helper">Cargando historial…</p>}
            {!historyLoading && !historyEntries.length && !historyError && (
              <p className="cih-empty">No hay aprobaciones registradas en este periodo.</p>
            )}

            {historyEntries.length > 0 && (
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
                    {historyEntries.map((entry) => (
                      <tr key={`${entry.id}-${entry.updated_at}`}
                      >
                        <td data-label="Fecha">
                          {new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(entry.updated_at ?? entry.created_at))}
                        </td>
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

        {(error || halted) && (
          <div
            role="alert"
            style={{
              marginTop: '1.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#7f1d1d',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{error || 'Servicio detenido temporalmente.'}</span>
            <button className="cih-btn cih-btn--ghost" type="button" onClick={handleRetry}>Reintentar</button>
          </div>
        )}
      </div>
    </section>
  );
}
