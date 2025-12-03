import { Link } from 'react-router-dom';

const shortcuts = [
  { to: '/portal/login', label: 'Iniciar sesión', description: 'Autentícate para acceder a los paneles personalizados' },
  { to: '/portal/directorio', label: 'Directorio de empleados', description: 'Consulta información de contacto del equipo' },
  { to: '/portal/admin', label: 'Admin empleados', description: 'Gestiona información del personal (gerencia)' },
  { to: '/portal/gerencia', label: 'Panel Gerente', description: 'KPIs ejecutivos y aprobaciones' },
  { to: '/portal/jefatura', label: 'Panel Jefe', description: 'Coordinación de unidad y equipo' },
  { to: '/portal/empleado', label: 'Panel Empleado', description: 'Perfil personal y solicitudes' },
  { to: '/portal/tecnico', label: 'Panel de Campo', description: 'Reportes de visita y bitácoras' },
];

export default function PortalOverviewPage() {
  return (
    <section className="cih-card" aria-labelledby="portal-overview-title">
      <div className="cih-card__body">
        <h2 className="cih-card__title" id="portal-overview-title">Accesos rápidos</h2>
        <p className="cih-card__subtitle">
          Selecciona tu módulo para acceder a las funcionalidades del portal interno. Cada pantalla se conectará con el
          backend Slim una vez que los endpoints estén listos.
        </p>

        <div className="cih-grid" style={{ marginTop: '1.5rem' }}>
          {shortcuts.map((shortcut) => (
            <article className="cih-card cih-card--hoverable" key={shortcut.to}>
              <div className="cih-card__body">
                <h3 className="cih-card__title">{shortcut.label}</h3>
                <p className="cih-card__subtitle">{shortcut.description}</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <Link className="cih-btn cih-btn--primary" to={shortcut.to}>
                    Acceder
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
