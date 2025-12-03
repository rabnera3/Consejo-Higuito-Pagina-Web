import { Link } from 'react-router-dom';

export default function PortalTechnicalPanelPage() {
  return (
    <section className="cih-card" aria-labelledby="portal-tech-title">
      <div className="cih-card__body">
        <h2 className="cih-card__title" id="portal-tech-title">Panel de Campo</h2>

        <div className="cih-action-grid">
          <article className="cih-card">
            <div className="cih-card__body">
              <h3 className="cih-card__title">Reportes de Visita</h3>
              <p className="cih-card__subtitle">
                Documenta hallazgos, acuerdos y fotografías de visitas a campo.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <Link className="cih-btn cih-btn--primary" to="/portal/reportes-visita">
                  Ver Reportes
                </Link>
              </div>
            </div>
          </article>

          <article className="cih-card">
            <div className="cih-card__body">
              <h3 className="cih-card__title">Bitácora de Campo</h3>
              <p className="cih-card__subtitle">
                Registro diario de actividades, observaciones y condiciones climáticas.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <Link className="cih-btn cih-btn--primary" to="/portal/bitacora-campo">
                  Ver Bitácora
                </Link>
              </div>
            </div>
          </article>

          <article className="cih-card">
            <div className="cih-card__body">
              <h3 className="cih-card__title">Solicitudes</h3>
              <p className="cih-card__subtitle">
                Gestión de permisos, vacaciones y requerimientos de materiales.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <Link className="cih-btn cih-btn--primary" to="/portal/solicitudes">
                  Ver Solicitudes
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
