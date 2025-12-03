import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchEmployeeById, updateEmployee, uploadEmployeePhoto, API_BASE } from '../../lib/api';

export default function PortalEmployeePanelPage() {
  const { user, updateUser } = useAuth();
  const role = user?.role ?? '';
  const isManager = role === 'gerente' || role === 'gerencia';
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    municipio: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    birth_date: '',
    gender: '',
    dni: '',
    job_title: '',
  });

  useEffect(() => {
    if (user?.employee_id) {
      loadEmployee(user.employee_id);
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadEmployee = async (id: number) => {
    try {
      setLoading(true);
      const resp = await fetchEmployeeById(id);
      if (resp.success) {
        setEmployee(resp.data);
        setFormData({
          phone: resp.data.telefono || '',
          municipio: resp.data.municipio || '',
          address: resp.data.address || '',
          emergency_contact_name: resp.data.emergency_contact_name || '',
          emergency_contact_phone: resp.data.emergency_contact_phone || '',
          birth_date: resp.data.fecha_nacimiento || '',
          gender: resp.data.genero || '',
          dni: resp.data.dni || '',
          job_title: resp.data.rol || '',
        });
      } else {
        setError('No se pudo cargar la información del empleado.');
      }
    } catch (err) {
      setError('Error al cargar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.employee_id) return;

    try {
      const resp = await updateEmployee(user.employee_id, formData);
      if (resp.success) {
        setEditing(false);
        loadEmployee(user.employee_id);
      } else {
        alert('Error al actualizar: ' + resp.message);
      }
    } catch (err: any) {
      alert('Error al actualizar: ' + err.message);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.employee_id) return;

    try {
      setUploading(true);
      const resp = await uploadEmployeePhoto(user.employee_id, file);
      if (resp.success) {
        setEmployee((prev: any) => ({ ...prev, foto: resp.data.photo_url }));
        updateUser({ photo_url: resp.data.photo_url });
      } else {
        alert('Error al subir foto: ' + resp.message);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      alert('Error al subir foto: ' + msg);
    } finally {
      setUploading(false);
      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getPhotoUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  };

  if (loading) return <div className="p-4">Cargando perfil...</div>;

  if (!user?.employee_id) {
    return (
      <div className="cih-card">
        <div className="cih-card__body">
          <h2 className="cih-card__title">Mi Perfil</h2>
          <p>No se encontró información de empleado asociada a tu usuario.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="cih-card" aria-labelledby="portal-employee-title">
      <div className="cih-card__body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="cih-card__title" id="portal-employee-title">Mi Perfil</h2>
          {!editing && (
            <button className="btn primary" onClick={() => setEditing(true)}>
              Editar Datos
            </button>
          )}
        </div>

        {editing && !isManager && (
          <div className="alert alert-warning" style={{ marginBottom: '1.5rem', background: '#fff3cd', color: '#856404', padding: '0.75rem 1.25rem', borderRadius: '0.25rem', border: '1px solid #ffeeba' }}>
            <strong>Nota:</strong> Los cambios realizados deberán ser aprobados por gerencia antes de reflejarse permanentemente.
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {editing ? (
          <form onSubmit={handleUpdate} className="form-grid">
            <div className="form-group">
              <label>Cargo / Puesto</label>
              <input
                type="text"
                className="form-control"
                value={formData.job_title}
                onChange={e => setFormData({ ...formData, job_title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>DNI / Cédula</label>
              <input
                type="text"
                className="form-control"
                value={formData.dni}
                onChange={e => setFormData({ ...formData, dni: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Municipio</label>
              <input
                type="text"
                className="form-control"
                value={formData.municipio}
                onChange={e => setFormData({ ...formData, municipio: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={formData.birth_date}
                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Género</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contacto de Emergencia (Nombre)</label>
              <input
                type="text"
                className="form-control"
                value={formData.emergency_contact_name}
                onChange={e => setFormData({ ...formData, emergency_contact_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Contacto de Emergencia (Teléfono)</label>
              <input
                type="text"
                className="form-control"
                value={formData.emergency_contact_phone}
                onChange={e => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
              />
            </div>
            <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn primary">Guardar Cambios</button>
              <button type="button" className="btn secondary" onClick={() => setEditing(false)}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-header" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
              <div
                className="profile-avatar"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#64748b',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={handlePhotoClick}
                title="Clic para cambiar foto"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {uploading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                    ...
                  </div>
                )}
                {employee?.foto ? (
                  <img src={getPhotoUrl(employee.foto) || ''} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (employee?.nombre?.charAt(0) || user.nombre?.charAt(0) || '?').toUpperCase()
                )}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>{employee?.nombre}</h3>
                <p style={{ margin: 0, color: '#64748b' }}>{employee?.rol}</p>
                <span className="badge" style={{ marginTop: '0.5rem', display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                  {employee?.departamento}
                </span>
              </div>
            </div>

            <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Email</label>
                <div style={{ fontWeight: 500 }}>{employee?.email}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>DNI / Cédula</label>
                <div style={{ fontWeight: 500 }}>{employee?.dni || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Teléfono</label>
                <div style={{ fontWeight: 500 }}>{employee?.telefono || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Municipio</label>
                <div style={{ fontWeight: 500 }}>{employee?.municipio || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Unidad / Departamento</label>
                <div style={{ fontWeight: 500 }}>{employee?.departamento || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Estado</label>
                <div style={{ fontWeight: 500 }}>{employee?.estado}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Dirección</label>
                <div style={{ fontWeight: 500 }}>{employee?.address || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Fecha de Nacimiento</label>
                <div style={{ fontWeight: 500 }}>{employee?.fecha_nacimiento || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Género</label>
                <div style={{ fontWeight: 500 }}>{employee?.genero || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Contacto Emergencia</label>
                <div style={{ fontWeight: 500 }}>
                  {employee?.emergency_contact_name || '—'}
                  {employee?.emergency_contact_phone && ` (${employee.emergency_contact_phone})`}
                </div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Fecha de Contratación</label>
                <div style={{ fontWeight: 500 }}>{employee?.fecha_contratacion || '—'}</div>
              </div>
              <div className="detail-item">
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Días de Vacaciones</label>
                <div style={{ fontWeight: 500 }}>{employee?.dias_vacaciones ?? '—'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
