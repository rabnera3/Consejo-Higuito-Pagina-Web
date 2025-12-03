import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchPlanificacionByEmployee, PlanificacionEntry } from '../../lib/api';
import { RequestList } from './RequestList';

export function EmployeeDashboard() {
    const { user } = useAuth();
    const [todayPlan, setTodayPlan] = useState<PlanificacionEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [missingPlanning, setMissingPlanning] = useState(false);

    useEffect(() => {
        const loadPlan = async () => {
            if (user?.employee_id) {
                try {
                    const resp = await fetchPlanificacionByEmployee(user.employee_id);
                    if (resp.success && resp.data) {
                        const today = new Date().toISOString().split('T')[0];
                        const plan = resp.data.find((p) => p.fecha === today);
                        setTodayPlan(plan || null);

                        // Check for missing planning in current week (Mon-Fri)
                        const now = new Date();
                        const day = now.getDay(); // 0=Sun, 1=Mon, ...
                        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
                        const monday = new Date(now.setDate(diff));

                        const weekDates = [];
                        for (let i = 0; i < 5; i++) {
                            const d = new Date(monday);
                            d.setDate(monday.getDate() + i);
                            weekDates.push(d.toISOString().split('T')[0]);
                        }

                        const plannedDates = resp.data.map(p => p.fecha);
                        const isMissing = weekDates.some(d => !plannedDates.includes(d));
                        setMissingPlanning(isMissing);
                    }
                } catch (error) {
                    console.error('Error loading plan', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadPlan();
    }, [user]);

    return (
        <div className="dashboard-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* Welcome & Actions Card */}
            <section className="cih-card">
                <div className="cih-card__body">
                    <h2 className="cih-card__title">Bienvenido, {user?.nombre}</h2>
                    <p className="cih-card__subtitle" style={{ marginBottom: '1.5rem' }}>
                        Gestiona tus actividades y solicitudes desde aquí.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/portal/solicitudes" className="btn primary">
                            Ver Solicitudes
                        </Link>
                        {user?.role === 'tecnico' && (
                            <Link to="/portal/tecnico" className="btn secondary">
                                Panel de Campo
                            </Link>
                        )}
                        <Link to="/portal/directorio" className="btn secondary">
                            Ver Directorio
                        </Link>
                    </div>
                </div>
            </section>

            {/* Today's Plan Card */}
            <section className="cih-card">
                <div className="cih-card__body">
                    <h3 className="cih-card__title">Planificación de Hoy</h3>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : todayPlan ? (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Actividad:</strong> {todayPlan.descripcion}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Lugar:</strong> {todayPlan.lugar}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Horario:</strong> {todayPlan.duracion || 'No especificado'}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                                    {todayPlan.linea_servicio}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '2rem 0', textAlign: 'center', color: '#64748b' }}>
                            <p>No tienes actividades planificadas para hoy.</p>
                        </div>
                    )}

                    {missingPlanning && (
                        <div className="alert alert-warning" style={{ marginTop: '1.5rem', background: '#fff3cd', color: '#856404', padding: '0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', border: '1px solid #ffeeba' }}>
                            <strong>Atención:</strong> Te falta completar tu planificación de esta semana.
                        </div>
                    )}
                </div>
            </section>

            {/* Requests List Card */}
            <section className="cih-card" style={{ gridColumn: '1 / -1' }}>
                <div className="cih-card__body">
                    <h3 className="cih-card__title">Mis Solicitudes</h3>
                    <RequestList refreshTrigger={0} />
                </div>
            </section>
        </div>
    );
}
