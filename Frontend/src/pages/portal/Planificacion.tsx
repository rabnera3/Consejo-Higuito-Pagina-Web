import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchPlanificacion,
  createPlanificacion,
  updatePlanificacion,
  deletePlanificacion,
  PlanificacionEntry
} from '../../lib/api';
import WeeklyPlanView from '../../components/portal/WeeklyPlanView';
import PlanDetailsModal from '../../components/portal/PlanDetailsModal';

const formatIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWorkWeekDates = (reference: Date) => {
  const normalized = new Date(reference);
  normalized.setHours(0, 0, 0, 0);
  const dayOfWeek = normalized.getDay();
  const offsetToMonday = dayOfWeek === 0 ? 1 : 1 - dayOfWeek;
  normalized.setDate(normalized.getDate() + offsetToMonday);

  const dates: string[] = [];
  for (let i = 0; i < 5; i++) {
    const current = new Date(normalized);
    current.setDate(normalized.getDate() + i);
    dates.push(formatIsoDate(current));
  }

  return dates;
};

const toLocalDate = (value: string) => new Date(`${value}T00:00:00`);

export default function PlanificacionPage() {
  const { user } = useAuth();
  const employeeId = user?.employee_id ?? null;
  const [plans, setPlans] = useState<PlanificacionEntry[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<PlanificacionEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUnit, setSearchUnit] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'unit'>('all');
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanificacionEntry | null>(null);
  const [pendingDates, setPendingDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('list');

  // Sorting and Pagination state
  const [sortConfig, setSortConfig] = useState<{ key: keyof PlanificacionEntry; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    empleado_id: employeeId || 0,
    fecha: new Date().toISOString().split('T')[0],
    lugar: 'Oficina',
    sector_trabajo: 'Trabajo de oficina',
    area: 'N/A',
    recursos: 'Ninguno',
    linea_servicio: 'Gestión de Información Territorial',
    duracion: '',
    descripcion: '',
  });

  useEffect(() => {
    if (!employeeId) return;
    setFormData((prev) => {
      if (prev.empleado_id) {
        return prev;
      }
      return { ...prev, empleado_id: employeeId };
    });
  }, [employeeId]);

  const lugares = [
    'Belen Gualcho Ocotepeque', 'Corquin Copán', 'Cucuyagua Copán', 'Dolores Copán',
    'La Unión Copán', 'San Agustín Copán', 'San José Copán', 'Trinidad Copán',
    'Veracruz Copán', 'Talgua Lempira', 'Santa Rosa de Copán', 'San Pedro Copán',
    'Concepción Copán', 'San Juan de Opoa Copán', 'Oficina', 'Vacaciones',
    'Otro Municipio', 'Permiso'
  ];

  const sectores = ['Trabajo de oficina', 'Trabajo de casa', 'Visita al municipio'];
  const areas = ['Urbana', 'Rural', 'N/A'];
  const recursosList = ['Salón', 'Vehículo', 'Materiales', 'Equipo', 'Ninguno'];
  const lineasServicio = [
    'Asistencia Técnica para el Desarrollo de Capacidades',
    'Acompañamiento en instrumentos de planificacion y normativa',
    'Formulación de Estudios',
    'Gestión de Información Territorial',
    'Promoción, Socialización y Sencibilización',
    'Capacitación',
    'Gestion de Programas -Proyectos'
  ];

  useEffect(() => {
    const weekDates = getWorkWeekDates(new Date());
    if (weekDates.length) {
      setWeekStart(weekDates[0]);
      setWeekEnd(weekDates[weekDates.length - 1]);
    }

    // Cargar datos
    loadPlans();

    // Mostrar formulario según rol
    if (user?.role === 'gerente' || user?.role === 'jefe' || user?.role === 'empleado') {
      setShowForm(true);
    }
  }, [user]);

  useEffect(() => {
    filterPlans();
    checkPendingDays();
  }, [plans, searchTerm, searchUnit, filterMode, weekStart, weekEnd, employeeId]);

  const loadPlans = async () => {
    try {
      const response = await fetchPlanificacion();
      if (response.success && response.data) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error cargando planificación:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlans = () => {
    let filtered = [...plans];

    // Filter by mode
    if (filterMode === 'mine') {
      filtered = employeeId ? filtered.filter((p) => p.empleado_id === employeeId) : [];
    } else if (filterMode === 'unit') {
      filtered = user?.department_id
        ? filtered.filter((p) => p.department_id === user.department_id)
        : [];
    }


    // Filtrar por búsqueda (nombre)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.empleado_nombre?.toLowerCase().includes(term) ||
        p.lugar.toLowerCase().includes(term) ||
        p.sector_trabajo.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term) ||
        p.linea_servicio.toLowerCase().includes(term)
      );
    }

    // Filtrar por unidad (departamento)
    if (searchUnit) {
      const unitTerm = searchUnit.toLowerCase();
      filtered = filtered.filter(p =>
        p.departamento?.toLowerCase().includes(unitTerm)
      );
    }

    // Reset unit search if in 'unit' mode to avoid confusion, or keep it?
    // Let's keep it independent.


    // Filter by week if in weekly view or if dates are set
    if (weekStart && weekEnd) {
      const startDate = toLocalDate(weekStart);
      const endDate = new Date(`${weekEnd}T23:59:59`);
      filtered = filtered.filter((p) => {
        const fecha = toLocalDate(p.fecha);
        return fecha >= startDate && fecha <= endDate;
      });
    }

    setFilteredPlans(filtered);
    setCurrentPage(1); // Reset page on filter change
  };

  const checkPendingDays = () => {
    if (user?.role === 'gerente' || !employeeId) {
      setPendingDates([]);
      return;
    }

    const reference = weekStart ? toLocalDate(weekStart) : new Date();
    const weekDates = getWorkWeekDates(reference);
    const myPlans = plans.filter((p) => p.empleado_id === employeeId);
    const filledDates = new Set(myPlans.map((p) => p.fecha));
    const pending = weekDates.filter((d) => !filledDates.has(d));

    setPendingDates(pending);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar duplicados en frontend (UX)
    const duplicate = plans.find(p =>
      p.empleado_id === (employeeId || 0) &&
      p.fecha === formData.fecha &&
      p.id !== editingId
    );

    if (duplicate) {
      alert('Ya existe una planificación para esta fecha. Por favor edite la existente o elija otra fecha.');
      return;
    }

    try {
      if (editingId) {
        await updatePlanificacion(editingId, formData);
        alert('Planificación actualizada');
      } else {
        await createPlanificacion(formData);
        alert('Planificación guardada');
      }

      loadPlans();

      // Reset form
      setFormData({
        empleado_id: employeeId || 0,
        fecha: new Date().toISOString().split('T')[0],
        lugar: 'Oficina',
        sector_trabajo: 'Trabajo de oficina',
        area: 'N/A',
        recursos: 'Ninguno',
        linea_servicio: 'Gestión de Información Territorial',
        duracion: '',
        descripcion: '',
      });
      setEditingId(null);
    } catch (error: any) {
      console.error('Error guardando:', error);
      alert('Error al guardar: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleEdit = (plan: PlanificacionEntry) => {
    setFormData({
      empleado_id: plan.empleado_id,
      fecha: plan.fecha,
      lugar: plan.lugar,
      sector_trabajo: plan.sector_trabajo,
      area: plan.area,
      recursos: plan.recursos,
      linea_servicio: plan.linea_servicio,
      duracion: plan.duracion,
      descripcion: plan.descripcion,
    });
    setEditingId(plan.id ?? null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este registro de planificación?')) return;

    try {
      await deletePlanificacion(id);
      alert('Planificación eliminada');
      loadPlans();
    } catch (error: any) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleAddForDate = (date: string) => {
    setFormData({
      ...formData,
      fecha: date,
      empleado_id: employeeId || 0
    });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const handleSort = (key: keyof PlanificacionEntry) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedAndPaginatedPlans = () => {
    let sorted = [...filteredPlans];
    if (sortConfig) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by date desc
      sorted.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

  if (loading) {
    return <div className="cih-section-stack">Cargando planificación...</div>;
  }

  const displayedPlans = getSortedAndPaginatedPlans();

  return (
    <div className="cih-section-stack">
      {/* Alerta de días pendientes */}
      {pendingDates.length > 0 && user?.role !== 'gerente' && (
        <div className="card" style={{ borderLeft: '4px solid #fbbf24', background: '#fff9f0' }}>
          <div className="body">
            <div className="pending-alert-content">
              <span className="pending-icon">⚠️</span>
              <div className="pending-text" style={{ flex: 1 }}>
                <strong>
                  Tienes {pendingDates.length} {pendingDates.length === 1 ? 'día pendiente' : 'días pendientes'} de esta semana sin planificar
                </strong>
                <div className="pending-dates-list" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {pendingDates.map(date => {
                    const dateObj = toLocalDate(date);
                    const dayName = new Intl.DateTimeFormat('es-CR', { weekday: 'long' }).format(dateObj);
                    const dayNum = dateObj.getDate();

                    return (
                      <button
                        key={date}
                        className="btn sm"
                        style={{ background: '#fbbf24', color: '#000', border: 'none', fontSize: '0.85rem' }}
                        onClick={() => handleAddForDate(date)}
                      >
                        Planificar {dayName} {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="card mt-12">
          <div className="body">
            <h3 className="h3-tight">{editingId ? 'Editar' : 'Ingresar'} Planificación</h3>
            <form onSubmit={handleSubmit} className="plan-form">
              <div className="form-group">
                <label htmlFor="fecha" className="form-label required">
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lugar" className="form-label required">
                  Lugar
                </label>
                <select
                  id="lugar"
                  required
                  value={formData.lugar}
                  onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                >
                  <option value="">Seleccione un lugar...</option>
                  {lugares.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="sector" className="form-label required">
                  Sector de Trabajo
                </label>
                <select
                  id="sector"
                  required
                  value={formData.sector_trabajo}
                  onChange={(e) => setFormData({ ...formData, sector_trabajo: e.target.value })}
                >
                  <option value="">Seleccione un sector...</option>
                  {sectores.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="area" className="form-label required">
                  Área
                </label>
                <select
                  id="area"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                  {areas.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="recursos" className="form-label required">
                  Recursos
                </label>
                <select
                  id="recursos"
                  required
                  value={formData.recursos}
                  onChange={(e) => setFormData({ ...formData, recursos: e.target.value })}
                >
                  {recursosList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="linea" className="form-label required">
                  Línea de Servicio
                </label>
                <select
                  id="linea"
                  required
                  value={formData.linea_servicio}
                  onChange={(e) => setFormData({ ...formData, linea_servicio: e.target.value })}
                >
                  <option value="">Seleccione una línea de servicio...</option>
                  {lineasServicio.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="duracion" className="form-label required">
                  Duración
                </label>
                <input
                  id="duracion"
                  type="text"
                  required
                  placeholder="8 horas, 4 horas..."
                  value={formData.duracion}
                  onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="descripcion" className="form-label required">
                  Descripción Breve de la Actividad
                </label>
                <textarea
                  id="descripcion"
                  placeholder="Seguimiento a proceso de transición y traspaso..."
                  required
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div className="plan-actions full-width">
                <button type="submit" className="btn primary">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setFormData({
                      empleado_id: employeeId || 0,
                      fecha: new Date().toISOString().split('T')[0],
                      lugar: 'Oficina',
                      sector_trabajo: 'Trabajo de oficina',
                      area: 'N/A',
                      recursos: 'Ninguno',
                      linea_servicio: 'Gestión de Información Territorial',
                      duracion: '',
                      descripcion: '',
                    });
                    setEditingId(null);
                    setShowForm(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filtros y Vistas */}
      <div className="toolbar mt-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
          <input
            type="search"
            placeholder="🔍 Buscar por nombre..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <div className="segmented-control">
          <button
            className={`segment-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
            title="Ver todos los planes"
          >
            Todos
          </button>
          <button
            className={`segment-btn ${filterMode === 'mine' ? 'active' : ''}`}
            onClick={() => setFilterMode('mine')}
            title="Ver solo mis planes"
          >
            Mis Planes
          </button>
          <button
            className={`segment-btn ${filterMode === 'unit' ? 'active' : ''}`}
            onClick={() => setFilterMode('unit')}
            title="Ver planes de mi unidad"
          >
            Mi Unidad
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
          <input
            type="search"
            placeholder="🏢 Buscar por unidad..."
            className="search-input"
            value={searchUnit}
            onChange={(e) => setSearchUnit(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label htmlFor="week-start">Semana:</label>
          <input
            id="week-start"
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
          <span>al</span>
          <input
            id="week-end"
            type="date"
            value={weekEnd}
            onChange={(e) => setWeekEnd(e.target.value)}
          />
        </div>

        <div className="view-toggle" style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${viewMode === 'list' ? 'primary' : 'secondary'}`}
            onClick={() => setViewMode('list')}
          >
            Lista
          </button>
          <button
            className={`btn ${viewMode === 'weekly' ? 'primary' : 'secondary'}`}
            onClick={() => setViewMode('weekly')}
          >
            Semanal
          </button>
        </div>

        {/* Pagination Controls in Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="itemsPerPage">Mostrar:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="card mt-12">
        <div className="body">
          <div className="plan-header">
            <h3 className="h3-tight">
              {viewMode === 'weekly' ? 'Planificación Semanal' : 'Registros de Planificación'}
            </h3>
            <div className="count">
              {filteredPlans.length} {filteredPlans.length === 1 ? 'registro' : 'registros'}
            </div>
          </div>

          {viewMode === 'weekly' ? (
            <WeeklyPlanView
              plans={filteredPlans}
              weekStart={weekStart}
              weekEnd={weekEnd}
              onEdit={handleEdit}
              onAdd={handleAddForDate}
              onViewDetails={setSelectedPlan}
              currentUserId={employeeId ?? undefined}
              userRole={user?.role || undefined}
            />
          ) : (
            <>
              {filteredPlans.length === 0 ? (
                <div className="empty">
                  {searchTerm || searchUnit
                    ? `No se encontraron resultados para los filtros seleccionados`
                    : 'No hay registros de planificación para mostrar.'}
                </div>
              ) : (
                <div className="table-wrap mobile-cards">
                  <table className="table plan-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('empleado_nombre')} style={{ cursor: 'pointer' }}>
                          Empleado {sortConfig?.key === 'empleado_nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('departamento')} style={{ cursor: 'pointer' }}>
                          Unidad {sortConfig?.key === 'departamento' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('fecha')} style={{ cursor: 'pointer' }}>
                          Fecha {sortConfig?.key === 'fecha' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('lugar')} style={{ cursor: 'pointer' }}>
                          Lugar {sortConfig?.key === 'lugar' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Sector de Trabajo</th>
                        <th>Área</th>
                        <th>Recursos</th>
                        <th>Línea de Servicio</th>
                        <th>Duración</th>
                        <th>Descripción</th>
                        <th className="text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedPlans.map((plan) => (
                        <tr
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                          className="plan-row"
                        >
                          <td data-label="Empleado">{plan.empleado_nombre || '—'}</td>
                          <td data-label="Unidad">{plan.departamento || '—'}</td>
                          <td data-label="Fecha">{plan.fecha}</td>
                          <td data-label="Lugar">{plan.lugar}</td>
                          <td data-label="Sector">{plan.sector_trabajo}</td>
                          <td data-label="Área">{plan.area}</td>
                          <td data-label="Recursos">{plan.recursos}</td>
                          <td data-label="Línea">{plan.linea_servicio}</td>
                          <td data-label="Duración">{plan.duracion || '—'}</td>
                          <td data-label="Descripción">
                            <div style={{
                              maxWidth: '200px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {plan.descripcion}
                            </div>
                          </td>
                          <td data-label="Acciones" className="text-right" onClick={(e) => e.stopPropagation()}>
                            {(employeeId === plan.empleado_id || user?.role === 'gerente') && (
                              <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                <button
                                  className="btn sm"
                                  onClick={() => handleEdit(plan)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn sm danger"
                                  onClick={() => plan.id && handleDelete(plan.id)}
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      className="btn secondary"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      className="btn secondary"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedPlan && (
        <PlanDetailsModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={employeeId === selectedPlan.empleado_id || user?.role === 'gerente'}
        />
      )}

      <style>{`
        .segmented-control {
          display: flex;
          background: #e2e8f0;
          padding: 0.25rem;
          border-radius: 8px;
          gap: 0.25rem;
        }
        .segment-btn {
          border: none;
          background: transparent;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .segment-btn:hover {
          color: #1e293b;
        }
        .segment-btn.active {
          background: white;
          color: #0f172a;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .plan-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}
