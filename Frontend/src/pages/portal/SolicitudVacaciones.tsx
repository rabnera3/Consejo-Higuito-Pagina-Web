export default function SolicitudVacacionesPage() {
  return (
    <div className="cih-section-stack">
      <div className="card">
        <div className="body">
          <h2>Solicitud de Vacaciones</h2>
          <p className="subtitle">
            Complete el formulario para solicitar sus días de vacaciones.
          </p>

          <form className="cih-form" style={{ marginTop: '2rem' }}>
            <div className="form-section">
              <h3>Información del empleado</h3>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" readOnly required />
              </div>
              <div className="form-group">
                <label htmlFor="unidad">Unidad</label>
                <input type="text" id="unidad" name="unidad" readOnly required />
              </div>
              <div className="form-group">
                <label htmlFor="dias-disponibles">Días de vacaciones disponibles</label>
                <input type="number" id="dias-disponibles" name="dias-disponibles" readOnly required />
              </div>
            </div>

            <div className="form-section">
              <h3>Fechas de vacaciones</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha-inicio">Fecha de inicio</label>
                  <input type="date" id="fecha-inicio" name="fecha-inicio" required />
                </div>
                <div className="form-group">
                  <label htmlFor="fecha-fin">Fecha de fin</label>
                  <input type="date" id="fecha-fin" name="fecha-fin" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="dias-solicitados">Días solicitados</label>
                <input type="number" id="dias-solicitados" name="dias-solicitados" readOnly required />
              </div>
            </div>

            <div className="form-section">
              <h3>Detalles de la solicitud</h3>
              <div className="form-group">
                <label htmlFor="motivo">Motivo (opcional)</label>
                <textarea 
                  id="motivo" 
                  name="motivo" 
                  rows={4} 
                  placeholder="Describa brevemente el motivo de su solicitud..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="contacto">Teléfono de contacto durante vacaciones</label>
                <input type="tel" id="contacto" name="contacto" placeholder="8888-8888" />
              </div>
            </div>

            <div className="alert info">
              <strong>Nota:</strong> Su solicitud será revisada por su supervisor. 
              Recibirá una notificación cuando sea aprobada o rechazada.
            </div>

            <div className="form-actions">
              <button type="button" className="btn">Cancelar</button>
              <button type="submit" className="btn primary">Enviar solicitud</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
