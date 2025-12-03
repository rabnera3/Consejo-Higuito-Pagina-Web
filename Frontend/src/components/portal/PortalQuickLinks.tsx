import { Link } from 'react-router-dom';

const quickLinks = [
  {
    to: '/portal/login',
    title: 'Autenticación',
    description: 'Inicia sesión para acceder a dashboards personalizados conectados con Slim.',
    cta: 'Ir al login',
  },
  {
    to: '/portal/admin',
    title: 'Administrar empleados',
    description: 'Actualiza información del personal, estados y permisos desde una sola vista.',
    cta: 'Abrir módulo',
  },
  {
    to: '/portal/gerencia',
    title: 'Panel Gerente',
    description: 'Visión ejecutiva con KPIs, aprob aciones y enlaces rápidos hacia reportes.',
    cta: 'Ver tablero',
  },
  {
    to: '/portal/tecnico',
    title: 'Panel de Campo',
    description: 'Reportes y bitácoras de campo',
    cta: 'Ingresar',
  },
];

export function PortalQuickLinks() {
  return (
    <section className="cih-grid" aria-label="Atajos principales">
      {quickLinks.map((link) => (
        <article key={link.to} className="cih-card">
          <div className="cih-card__body">
            <h3 className="cih-card__title">{link.title}</h3>
            <p className="cih-card__subtitle">{link.description}</p>
            <div style={{ marginTop: '0.75rem' }}>
              <Link className="cih-btn cih-btn--primary" to={link.to}>
                {link.cta}
              </Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
