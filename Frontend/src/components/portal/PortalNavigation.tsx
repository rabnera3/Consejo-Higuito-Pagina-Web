import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';

const navItems = [
  { key: 'directorio', label: 'Directorio', to: '/portal/directorio' },
  { key: 'admin', label: 'Admin empleados', to: '/portal/admin' },
  { key: 'gerencia', label: 'Panel Gerente', to: '/portal/gerencia' },
  { key: 'jefatura', label: 'Panel Jefe', to: '/portal/jefatura' },
  { key: 'empleado', label: 'Panel Empleado', to: '/portal/empleado' },
];

interface PortalNavigationProps {
  allowedSegments: string[];
}

export function PortalNavigation({ allowedSegments }: PortalNavigationProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const visibleItems = navItems.filter((item) => allowedSegments.includes(item.key));
  // Strict separation: Do NOT fall back to navItems if visibleItems is empty.
  // If a user has no allowed segments, they should see no navigation, not everything.
  const itemsToRender = visibleItems;

  return (
    <nav className="cih-nav" aria-label="Navegación del portal interno">
      <div className="cih-flex-spacer" />
      {itemsToRender.map((link) => (
        <NavLink
          key={link.key}
          to={link.to}
          className={({ isActive }) => (isActive ? 'is-active' : undefined)}
        >
          {link.label}
        </NavLink>
      ))}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NotificationCenter />
          <div className="cih-user-profile">
            <div className="cih-user-avatar">
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="cih-user-info">
              <div className="cih-user-name">{user.nombre || user.email}</div>
              <div className="cih-user-role">{user.roleName || user.role}</div>
            </div>
            <button type="button" onClick={handleLogout} className="cih-btn-logout" aria-label="Cerrar sesión">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export function getDefaultSegments(): string[] {
  return navItems.map((item) => item.key);
}
