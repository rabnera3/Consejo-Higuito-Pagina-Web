import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE, fetchPlanificacionByEmployee } from '../../lib/api';
import { NotificationCenter } from './NotificationCenter';

const logo = new URL('../../img/logo01.webp', import.meta.url).href;

interface MenuItem {
  label: string;
  icon: string;
  href: string;
}

const MENU_ITEMS: Record<string, MenuItem[]> = {
  admin: [
    { label: 'Dashboard', icon: '📊', href: '/portal/dashboard' },
    { label: 'Empleados', icon: '👥', href: '/portal/admin' },
    { label: 'Planificación', icon: '📅', href: '/portal/planificacion' },
    { label: 'Solicitudes', icon: '📋', href: '/portal/solicitudes' },
    { label: 'Blog', icon: '📝', href: '/portal/blog-nuevo' },
    { label: 'Blogs Pendientes', icon: '⏳', href: '/portal/blog-pendientes' },
    { label: 'Directorio', icon: '📇', href: '/portal/directorio' },
    { label: 'Mi Perfil', icon: '👤', href: '/portal/empleado' },
  ],
  gerente: [
    { label: 'Dashboard', icon: '📊', href: '/portal/dashboard' },
    { label: 'Panel Gerente', icon: '📈', href: '/portal/gerencia' },
    { label: 'Empleados', icon: '👥', href: '/portal/admin' },
    { label: 'Planificación', icon: '📅', href: '/portal/planificacion' },
    { label: 'Solicitudes', icon: '📋', href: '/portal/solicitudes' },
    { label: 'Blog', icon: '📝', href: '/portal/blog-nuevo' },
    { label: 'Blogs Pendientes', icon: '⏳', href: '/portal/blog-pendientes' },
    { label: 'Directorio', icon: '📇', href: '/portal/directorio' },
    { label: 'Mi Perfil', icon: '👤', href: '/portal/empleado' },
  ],
  gerencia: [
    { label: 'Dashboard', icon: '📊', href: '/portal/dashboard' },
    { label: 'Panel Gerente', icon: '📈', href: '/portal/gerencia' },
    { label: 'Empleados', icon: '👥', href: '/portal/admin' },
    { label: 'Planificación', icon: '📅', href: '/portal/planificacion' },
    { label: 'Solicitudes', icon: '📋', href: '/portal/solicitudes' },
    { label: 'Blog', icon: '📝', href: '/portal/blog-nuevo' },
    { label: 'Blogs Pendientes', icon: '⏳', href: '/portal/blog-pendientes' },
    { label: 'Directorio', icon: '📇', href: '/portal/directorio' },
    { label: 'Mi Perfil', icon: '👤', href: '/portal/empleado' },
  ],
  jefe: [
    { label: 'Dashboard', icon: '📊', href: '/portal/dashboard' },
    { label: 'Mi Equipo', icon: '👥', href: '/portal/jefatura' },
    { label: 'Planificación', icon: '📅', href: '/portal/planificacion' },
    { label: 'Blog', icon: '📝', href: '/portal/blog-nuevo' },
    { label: 'Directorio', icon: '📇', href: '/portal/directorio' },
    { label: 'Mi Perfil', icon: '👤', href: '/portal/empleado' },
  ],
  jefatura: [
    { label: 'Dashboard', icon: '📊', href: '/portal/dashboard' },
    { label: 'Mi Equipo', icon: '👥', href: '/portal/jefatura' },
    { label: 'Planificación', icon: '📅', href: '/portal/planificacion' },
    { label: 'Blog', icon: '📝', href: '/portal/blog-nuevo' },
    { label: 'Directorio', icon: '📇', href: '/portal/directorio' },
    { label: 'Mi Perfil', icon: '👤', href: '/portal/empleado' },
  ],
  tecnico: [
    { label: 'Dashboard', icon: '📊', href: '/portal/dashboard' },
    { label: 'Panel de Campo', icon: '🔧', href: '/portal/tecnico' },
    { label: 'Solicitudes', icon: '📋', href: '/portal/solicitudes' },
    { label: 'Planificación', icon: '📅', href: '/portal/planificacion' },
    { label: 'Directorio', icon: '📇', href: '/portal/directorio' },
    { label: 'Mi Perfil', icon: '👤', href: '/portal/empleado' },
  ],
  empleado: [
    { label: 'Dashboard', icon: '📊', href: '/portal/dashboard' },
    { label: 'Mi Perfil', icon: '👤', href: '/portal/empleado' },
    { label: 'Solicitudes', icon: '📋', href: '/portal/solicitudes' },
    { label: 'Planificación', icon: '📅', href: '/portal/planificacion' },
    { label: 'Directorio', icon: '📇', href: '/portal/directorio' },
  ],
};

export function PortalSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [pendingPlanning, setPendingPlanning] = useState(false);

  useEffect(() => {
    if (user?.employee_id) {
      checkPlanning(user.employee_id);
    }
  }, [user]);

  const checkPlanning = async (employeeId: number) => {
    try {
      const resp = await fetchPlanificacionByEmployee(employeeId);
      if (resp.success && resp.data) {
        // Check if there is planning for the current week
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Sunday
        endOfWeek.setHours(23, 59, 59, 999);

        const hasPlanning = resp.data.some((p: any) => {
          const pDate = new Date(p.fecha);
          return pDate >= startOfWeek && pDate <= endOfWeek;
        });

        setPendingPlanning(!hasPlanning);
      }
    } catch (error) {
      console.error('Error checking planning:', error);
    }
  };

  if (!user) return null;

  const role = user.role || 'empleado';
  const items = MENU_ITEMS[role] || MENU_ITEMS.empleado;

  const getInitial = (name: string | null) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="app-sidebar">
      {/* Logo Area */}
      <div className="sidebar-logo">
        <img src={logo} alt="CIH Logo" />
        <div className="logo-text">
          <span className="brand">CIH</span>
          <span className="role">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">
                  {item.label}
                  {item.label === 'Planificación' && pendingPlanning && (
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      background: '#ef4444',
                      borderRadius: '50%',
                      marginLeft: '0.5rem',
                      verticalAlign: 'middle'
                    }} title="Planificación pendiente para esta semana" />
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile / Logout Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user.photo_url ? (
              <img
                src={user.photo_url.startsWith('http') ? user.photo_url : `${API_BASE}${user.photo_url}`}
                alt={user.nombre || 'User'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              getInitial(user.nombre)
            )}
          </div>
          <div className="user-details">
            <span className="user-name">{user.nombre || 'Usuario'}</span>
            <span className="user-dept">{user.role || ''}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NotificationCenter />
          <button
            className="btn-logout"
            onClick={logout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}
