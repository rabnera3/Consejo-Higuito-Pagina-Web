import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EmployeeDashboard } from './EmployeeDashboard';
import { TechnicianDashboard } from './TechnicianDashboard';
import { NotificationsCard } from './NotificationsCard';

type DashboardRole = 'gerente' | 'jefe' | 'tecnico' | 'empleado';

type Action = {
  label: string;
  description: string;
  href: string;
  primary?: boolean;
};

type DashboardDefinition = {
  title: string;
  description: string;
  actions: Action[];
};

const dashboards: Record<DashboardRole, DashboardDefinition> = {
  gerente: {
    title: '',
    description: '',
    actions: [
      { label: 'Panel Gerente', href: '/portal/gerencia', description: '', primary: true },
      { label: 'Administrar Empleados', href: '/portal/admin', description: '' },
      { label: 'Directorio', href: '/portal/directorio', description: '' },
    ],
  },
  jefe: {
    title: 'Panel de Jefatura',
    description: 'Control de equipo y coordinación departamental con alertas pendientes.',
    actions: [
      { label: 'Mi Panel', href: '/portal/jefatura', description: 'Gestión de equipo y tareas', primary: true },
      { label: 'Directorio', href: '/portal/directorio', description: 'Información del personal' },
      { label: 'Mi Perfil', href: '/portal/empleado', description: 'Actualiza datos y solicitudes' },
    ],
  },
  tecnico: {
    title: 'Panel de Campo',
    description: 'Gestión de proyectos, estudios comunitarios y reportes de visita.',
    actions: [], // Not used when TechnicianDashboard is rendered
  },
  empleado: {
    title: 'Mi Espacio',
    description: 'Servicios personales, vacaciones, permisos y seguimiento de solicitudes.',
    actions: [
      { label: 'Mi Perfil', href: '/portal/empleado', description: 'Datos personales y trámites', primary: true },
      { label: 'Directorio', href: '/portal/directorio', description: 'Información del equipo' },
    ],
  },
};

export function PortalDashboard() {
  const { user } = useAuth();
  const role = (user?.role as DashboardRole) || 'empleado';
  const dashboard = useMemo(() => dashboards[role] || dashboards.empleado, [role]);

  if (role === 'empleado') {
    return <EmployeeDashboard />;
  }

  if (role === 'tecnico') {
    return <TechnicianDashboard />;
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
            <article className="cih-card" key={action.label}>
              <div className="cih-card__body">
                <h3 className="cih-card__title">{action.label}</h3>
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
    </section>
  );
}
