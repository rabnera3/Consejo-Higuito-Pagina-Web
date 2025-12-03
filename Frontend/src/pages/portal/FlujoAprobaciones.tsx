export default function FlujoAprobacionesPage() {
  return (
    <div className="cih-section-stack">
      <div className="card">
        <div className="body">
          <h2>Flujo de Aprobaciones de Vacaciones</h2>
          <p className="subtitle">
            Sistema jerárquico: Técnico → Jefe de Unidad → Gerencia → Administración
          </p>

          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', marginTop: '1.5rem' }}>
            <h3>1️⃣ Empleado/Técnico crea solicitud</h3>
            <p>
              El empleado completa el formulario de vacaciones. La solicitud inicia con estado{' '}
              <strong>"Pendiente Jefe de Unidad"</strong>.
            </p>

            <h3 style={{ marginTop: '1.5rem' }}>2️⃣ Jefe de Unidad revisa</h3>
            <p>El jefe de la unidad del empleado ve la solicitud en su panel. Puede aprobar o rechazar.</p>
            <ul>
              <li>
                Si <strong>aprueba</strong>: pasa a estado <strong>"Pendiente Gerencia"</strong>
              </li>
              <li>
                Si <strong>rechaza</strong>: estado final <strong>"Rechazada"</strong>
              </li>
            </ul>

            <h3 style={{ marginTop: '1.5rem' }}>3️⃣ Gerencia revisa</h3>
            <p>La gerencia ve todas las solicitudes aprobadas por los jefes.</p>
            <ul>
              <li>
                Si <strong>aprueba</strong>: pasa a estado <strong>"Pendiente Administración"</strong>
              </li>
              <li>
                Si <strong>rechaza</strong>: estado final <strong>"Rechazada"</strong>
              </li>
            </ul>

            <h3 style={{ marginTop: '1.5rem' }}>4️⃣ Administración aprueba final</h3>
            <p>El departamento de administración da la aprobación final.</p>
            <ul>
              <li>
                Si <strong>aprueba</strong>: estado final <strong>"Aprobada"</strong> ✓
              </li>
              <li>
                Si <strong>rechaza</strong>: estado final <strong>"Rechazada"</strong>
              </li>
            </ul>

            <h3 style={{ marginTop: '1.5rem' }}>📋 Historial de aprobaciones</h3>
            <p>
              Cada solicitud mantiene un historial completo con fecha, rol y comentarios de cada aprobador.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Acceso según rol:</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                }}
              >
                <strong>👤 Empleado/Técnico</strong>
                <br />
                Crea solicitudes y consulta su historial
              </div>
              <div
                style={{
                  padding: '1rem',
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '8px',
                }}
              >
                <strong>👔 Jefe de Unidad</strong>
                <br />
                Aprueba/rechaza solicitudes de su equipo
              </div>
              <div
                style={{
                  padding: '1rem',
                  background: '#dbeafe',
                  border: '1px solid #93c5fd',
                  borderRadius: '8px',
                }}
              >
                <strong>📊 Gerencia</strong>
                <br />
                Aprueba/rechaza tras revisión de jefes
              </div>
              <div
                style={{
                  padding: '1rem',
                  background: '#f3e8ff',
                  border: '1px solid #d8b4fe',
                  borderRadius: '8px',
                }}
              >
                <strong>⚙️ Administración</strong>
                <br />
                Aprobación final y gestión de nómina
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
