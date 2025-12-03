export default function ActualizarDatosPage() {
  return (
    <div className="cih-section-stack">
      <div className="card">
        <div className="body">
          <h2>Actualizar Datos Personales</h2>
          <p className="subtitle">Mantenga su información actualizada</p>

          <form className="cih-form" style={{ marginTop: '2rem' }}>
            <div className="form-section">
              <h3>Información básica</h3>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" readOnly required />
                <small className="text-muted">
                  Este campo no puede modificarse. Contacte a Recursos Humanos si necesita cambiar su nombre.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="cedula">Cédula</label>
                <input type="text" id="cedula" name="cedula" readOnly />
                <small className="text-muted">Este campo no puede modificarse.</small>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha-nacimiento">Fecha de nacimiento</label>
                  <input type="date" id="fecha-nacimiento" name="fecha-nacimiento" />
                </div>
                <div className="form-group">
                  <label htmlFor="genero">Género</label>
                  <select id="genero" name="genero">
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="otro">Otro</option>
                    <option value="prefiero-no-decir">Prefiero no decir</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Información de contacto</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="tel" id="telefono" name="telefono" placeholder="9999-9999" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input type="email" id="email" name="email" readOnly />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección completa</label>
                <textarea id="direccion" name="direccion" rows={3} />
              </div>
            </div>

            <div className="alert info">
              <strong>Importante:</strong> Los cambios serán revisados por Recursos Humanos antes de ser aplicados.
            </div>

            <div className="form-actions">
              <button type="button" className="btn">Cancelar</button>
              <button type="submit" className="btn primary">Guardar cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
