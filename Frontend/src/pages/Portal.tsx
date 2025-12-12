import { Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/portal.css';
import { PortalSidebar } from '../components/portal/PortalSidebar';
import { useAuth } from '../context/AuthContext';
import { fetchEmployeeById } from '../lib/api';

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: '', subtitle: '' },
  directorio: { title: '', subtitle: '' },
  admin: { title: '', subtitle: '' },
  gerencia: { title: '', subtitle: '' },
  jefatura: { title: '', subtitle: '' },
  empleado: { title: '', subtitle: '' },
  'blog-manager': { title: '', subtitle: '' },
  'blog-pendientes': { title: '', subtitle: '' },
};

const DEFAULT_SEGMENTS = ['dashboard', 'directorio', 'admin', 'gerencia', 'jefatura', 'empleado'];

function getSegment(pathname: string) {
  const segment = pathname.replace(/^\/portal\/?/, '').split('/')[0];
  return segment || 'dashboard';
}

export default function PortalLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const segment = getSegment(location.pathname);
  const meta = routeMeta[segment] ?? routeMeta['dashboard'];
  const defaultSegments = DEFAULT_SEGMENTS;
  const [showMissingDataAlert, setShowMissingDataAlert] = useState(false);

  const roleAllowedMap: Record<string, string[]> = {
    admin: ['dashboard', 'admin', 'directorio', 'planificacion', 'solicitudes', 'blog-manager', 'blog-nuevo', 'blog-pendientes', 'empleado'],
    gerente: ['dashboard', 'gerencia', 'admin', 'directorio', 'planificacion', 'solicitudes', 'blog-manager', 'blog-nuevo', 'blog-pendientes', 'empleado'],
    gerencia: ['dashboard', 'gerencia', 'admin', 'directorio', 'planificacion', 'solicitudes', 'blog-manager', 'blog-nuevo', 'blog-pendientes', 'empleado'],
    jefe: ['dashboard', 'jefatura', 'directorio', 'empleado', 'planificacion', 'solicitudes', 'blog-manager', 'blog-nuevo'],
    jefatura: ['dashboard', 'jefatura', 'directorio', 'empleado', 'planificacion', 'solicitudes', 'blog-manager', 'blog-nuevo'],
    empleado: ['dashboard', 'empleado', 'directorio', 'planificacion', 'solicitudes'],
  };
  const allowedSegments = roleAllowedMap[user?.role ?? ''] ?? roleAllowedMap.empleado;

  useEffect(() => {
    const checkMissingData = async () => {
      if (user?.employee_id) {
        try {
          const resp = await fetchEmployeeById(user.employee_id);
          if (resp.success && resp.data) {
            const e = resp.data;
            // Check for missing fields
            const missing = !e.telefono || !e.address || !e.emergency_contact_name || !e.emergency_contact_phone || !e.fecha_nacimiento || !e.genero;
            setShowMissingDataAlert(missing);
          }
        } catch (error) {
          console.error('Error checking employee data', error);
        }
      }
    };
    checkMissingData();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedSegments.includes(segment)) {
    const target = allowedSegments[0] ?? defaultSegments[0];
    return <Navigate to={`/portal/${target}`} replace />;
  }

  return (
    <div className="app-shell">
      <PortalSidebar />
      <main className="app-main">
        {showMissingDataAlert && (
          <div className="alert alert-warning" style={{ margin: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <strong>Atención:</strong> Faltan datos importantes en tu perfil (Dirección, Contacto de Emergencia, Fecha de Nacimiento, etc.).
            </span>
            <Link to="/portal/empleado" className="btn secondary" style={{ marginLeft: '1rem', whiteSpace: 'nowrap' }}>
              Completar Perfil
            </Link>
          </div>
        )}
        {meta.title && (
          <div className="header">
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
