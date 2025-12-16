import { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchPlanificacionByEmployee } from '../../lib/api';
import { EmployeeDashboard } from './EmployeeDashboard';
import { NotificationsCard } from './NotificationsCard';

type DashboardRole = 'admin' | 'gerente' | 'jefe' | 'empleado';

type Action = {
  label: string;
  description: string;
  href: string;
  primary?: boolean;
  icon?: string;
};

type DashboardDefinition = {
  title: string;
  description: string;
  actions: Action[];
};

const dashboards: Record<DashboardRole, DashboardDefinition> = {
  admin: {
    title: 'Panel de Administración',
    description: 'Gestión completa del sistema: empleados, blog, planificación y solicitudes.',
    actions: [
      { label: 'Gestionar Empleados', href: '/portal/admin', description: 'Crear, editar y administrar usuarios del sistema', primary: true, icon: '👥' },
      { label: 'Blogs Pendientes', href: '/portal/blog-pendientes', description: 'Revisar y aprobar publicaciones', icon: '📝' },
      { label: 'Planificación', href: '/portal/planificacion', description: 'Ver planificación de todos los empleados', icon: '📅' },
      { label: 'Solicitudes', href: '/portal/solicitudes', description: 'Gestionar solicitudes pendientes', icon: '📋' },
      { label: 'Directorio', href: '/portal/directorio', description: 'Directorio completo del personal', icon: '📖' },
    ],
  },
  gerente: {
    title: 'Panel de Gerencia',
    description: 'Supervisión general del equipo, aprobaciones y coordinación institucional.',
    actions: [
      { label: 'Mi Panel', href: '/portal/gerencia', description: 'Estadísticas y resumen ejecutivo', primary: true, icon: '📊' },
      { label: 'Gestionar Empleados', href: '/portal/admin', description: 'Administrar personal del consejo', icon: '👥' },
      { label: 'Blogs Pendientes', href: '/portal/blog-pendientes', description: 'Aprobar publicaciones', icon: '📝' },
      { label: 'Planificación', href: '/portal/planificacion', description: 'Revisar agenda del equipo', icon: '📅' },
      { label: 'Directorio', href: '/portal/directorio', description: 'Información del personal', icon: '📖' },
    ],
  },
  jefe: {
    title: 'Panel de Jefatura',
    description: 'Control de equipo y coordinación departamental con alertas pendientes.',
    actions: [
      { label: 'Mi Panel', href: '/portal/jefatura', description: 'Gestión de equipo y tareas', primary: true, icon: '📋' },
      { label: 'Crear Publicación', href: '/portal/blog-nuevo', description: 'Redactar nuevas noticias', icon: '✍️' },
      { label: 'Planificación', href: '/portal/planificacion', description: 'Mi agenda semanal', icon: '📅' },
      { label: 'Directorio', href: '/portal/directorio', description: 'Información del personal', icon: '📖' },
      { label: 'Mi Perfil', href: '/portal/empleado', description: 'Datos personales y solicitudes', icon: '👤' },
    ],
  },
  empleado: {
    title: 'Mi Espacio',
    description: 'Servicios personales, vacaciones, permisos y seguimiento de solicitudes.',
    actions: [
      { label: 'Mi Perfil', href: '/portal/empleado', description: 'Datos personales y trámites', primary: true, icon: '👤' },
      { label: 'Planificación', href: '/portal/planificacion', description: 'Mi agenda semanal', icon: '📅' },
      { label: 'Nueva Solicitud', href: '/portal/solicitudes/nueva', description: 'Solicitar permisos o vacaciones', icon: '📝' },
      { label: 'Directorio', href: '/portal/directorio', description: 'Información del equipo', icon: '📖' },
    ],
  },
};

export function PortalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rawRole = (user?.role ?? 'empleado') as string;
  const role: DashboardRole = rawRole === 'admin'
    ? 'admin'
    : rawRole === 'jefe' || rawRole === 'jefatura'
      ? 'jefe'
      : rawRole === 'gerente' || rawRole === 'gerencia'
        ? 'gerente'
        : 'empleado';
  const dashboard = useMemo(() => dashboards[role] || dashboards.empleado, [role]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    if (role === 'admin' || role === 'gerente') return;
    if (!user?.employee_id) return;

    const checkPlanning = async () => {
      const now = new Date();
      const day = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

      // Wednesday (3)
      if (day === 3) {
        try {
          const resp = await fetchPlanificacionByEmployee(Number(user.employee_id));
          if (resp.success && Array.isArray(resp.data)) {
             // Calculate current week range (Monday to Friday)
             const d = new Date();
             const dayNum = d.getDay() || 7;
             d.setHours(0,0,0,0);
             d.setDate(d.getDate() + 4 - dayNum);
             const weekStart = new Date(d);
             weekStart.setDate(weekStart.getDate() - 3); // Monday
             const weekEnd = new Date(d);
             weekEnd.setDate(weekEnd.getDate() + 1); // Friday

             const currentWeekPlans = resp.data.filter((p: any) => {
                const pDate = new Date(p.fecha);
                return pDate >= weekStart && pDate <= weekEnd;
             });

             // Assuming 5 days needed
             if (currentWeekPlans.length < 5) {
                setShowWarningModal(true);
             }
          }
        } catch (e) {
          console.error("Error checking planning", e);
        }
      } else if (day === 4 || day === 5) {
         // Thursday (4) or Friday (5)
         navigate('/portal/planificacion', { state: { warning: 'Pronto se cerrará esta planificación semanal.', forced: true } });
      }
    };
    
    checkPlanning();
  }, [user, role, navigate]);

  if (role === 'empleado') {
    return <EmployeeDashboard />;
  }

  return (
    <section className="cih-card" aria-labelledby="portal-dashboard">
      <div className="cih-card__body">

        <div className="cih-card" id="portal-dashboard" style={{ marginTop: '1rem' }}>
          <div className="cih-card__body">
            <h2 className="cih-card__title">{dashboard.title}</h2>
            <p className="cih-card__subtitle">{dashboard.description}</p>
          </div>
        </div>

        <div className="cih-grid" style={{ marginTop: '1rem' }}>
          {dashboard.actions.map((action) => (
            <article className="cih-card cih-card--hoverable" key={action.label}>
              <div className="cih-card__body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  {action.icon && <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>}
                  <h3 className="cih-card__title" style={{ margin: 0 }}>{action.label}</h3>
                </div>
                <p className="cih-card__subtitle">{action.description}</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <Link
                    to={action.href}
                    className={`cih-btn ${action.primary ? 'cih-btn--primary' : ''}`}
                  >
                    {action.primary ? 'Acceder' : 'Ver'}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Notifications Card for Jefe/Gerente */}
        {(role === 'jefe' || role === 'gerente') && (
          <div style={{ marginTop: '1.5rem' }}>
            <NotificationsCard />
          </div>
        )}
      </div>

      {showWarningModal && (
        <div className="cih-modal-overlay">
          <div className="cih-modal-box" style={{ maxWidth: '450px' }}>
            <div className="cih-modal-header">
              <h3>Recordatorio de Planificación</h3>
              <button className="cih-btn-close" onClick={() => setShowWarningModal(false)}>&times;</button>
            </div>
            <div className="cih-modal-body">
              <p style={{ margin: 0, color: '#64748b', lineHeight: 1.5 }}>
                Faltan solo 3 días para llenar la planificación de esta semana. Por favor completa tu agenda.
              </p>
            </div>
            <div className="cih-modal-footer">
              <button className="cih-btn cih-btn--ghost" onClick={() => setShowWarningModal(false)}>Entendido</button>
              <button className="cih-btn cih-btn--primary" onClick={() => navigate('/portal/planificacion')}>Ir a planificación</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
