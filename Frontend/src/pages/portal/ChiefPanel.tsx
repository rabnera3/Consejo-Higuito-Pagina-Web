import { Link } from 'react-router-dom';
import { ApprovalsList } from '../../components/portal/ApprovalsList';
import { TeamLocation } from '../../components/portal/TeamLocation';
import { TeamReports } from '../../components/portal/TeamReports';

const actions = [
  {
    title: 'Gestionar solicitudes',
    description: 'Revisa y da el visto bueno a las solicitudes de tu unidad para enviarlas a gerencia.',
    // to: '/portal/admin', // This might need to be changed if there's a specific approvals page, but ApprovalsList is on the dashboard.
    // Actually, the user said "Gestionar solicitudes" and described the workflow.
    // Since ApprovalsList is already on the dashboard, maybe this action card is redundant or should link to a full view?
    // The user said "esto que se afuncional...".
    // I'll keep the link to /portal/admin for now or maybe remove it if it's confusing.
    // Wait, /portal/admin is "AdminEmployees".
    // The "ApprovalsList" is right there on the dashboard.
    // Maybe this card should link to the "Solicitudes" page if it exists?
    // There is a /portal/solicitudes route.
    to: '/portal/solicitudes',
    cta: 'Ver historial',
  },
  {
    title: 'Mi directorio',
    description: 'Consulta teléfonos y roles de tu personal en segundos.',
    to: '/portal/directorio',
    cta: 'Ver colaboradores',
  },
];

export default function PortalChiefPanelPage() {
  return (
    <section className="cih-card" aria-labelledby="portal-chief-title">
      <div className="cih-card__body">
        <h2 className="cih-card__title" id="portal-chief-title">Panel de Jefatura</h2>
        {/* Subtitle removed as requested */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">
          <TeamLocation />
          <div className="cih-card">
            <div className="cih-card__body">
              <h3 className="cih-card__title">Solicitudes por Aprobar</h3>
              <ApprovalsList role="chief" />
            </div>
          </div>
        </div>

        <TeamReports />

        <div className="cih-action-grid mt-8">
          {actions.map((action) => (
            <article className="cih-card" key={action.title}>
              <div className="cih-card__body">
                <h3 className="cih-card__title">{action.title}</h3>
                <p className="cih-card__subtitle">{action.description}</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <Link className="cih-btn cih-btn--primary" to={action.to}>
                    {action.cta}
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
