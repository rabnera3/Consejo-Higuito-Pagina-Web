import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchEmployees, isApiHalted, resetApiFailureState, EmployeeSummary } from '../../lib/api';

type EmployeeRecord = {
  id: number | string;
  nombre: string;
  rol?: string | null;
  departamento?: string | null;
  departamentoId?: number | null;
  municipio?: string | null;
  email?: string | null;
  telefono?: string | null;
  estado?: string | null;
  cedula?: string | null;
  diasVacaciones?: number | null;
  fechaIngreso?: string | null;
  fechaNacimiento?: string | null;
  foto?: string | null;
};

type FilterOption = { value: string; label: string };

const statusOrder: Record<string, number> = {
  Activa: 1,
  Vacaciones: 2,
  Licencia: 3,
  Baja: 4,
};

const normalizeOptionList = (items: Array<any> | undefined, prefix: string): FilterOption[] => {
  if (!Array.isArray(items)) {
    return [];
  }
  const seen = new Set<string>();
  return items.reduce<FilterOption[]>((acc, item, index) => {
    if (item == null) {
      return acc;
    }
    let value: string | null = null;
    let label: string | null = null;
    if (typeof item === 'string' || typeof item === 'number') {
      const text = String(item).trim();
      value = text || `${prefix}-${index}`;
      label = text || `${prefix} ${index + 1}`;
    } else if (typeof item === 'object') {
      const rawValue = item.value ?? item.id ?? item.slug ?? item.nombre ?? item.name ?? null;
      const rawLabel = item.label ?? item.nombre ?? item.name ?? rawValue;
      value = rawValue != null ? String(rawValue) : null;
      label = rawLabel != null ? String(rawLabel) : null;
    }
    const safeValue = value && value.trim() !== '' ? value : `${prefix}-${index}`;
    const safeLabel = label && label.trim() !== '' ? label : safeValue;
    if (seen.has(safeValue)) {
      return acc;
    }
    seen.add(safeValue);
    acc.push({ value: safeValue, label: safeLabel });
    return acc;
  }, []);
};

const mapEmployeeRecord = (raw: EmployeeSummary): EmployeeRecord => {
  const source = raw as Record<string, any>;
  const fallbackId = raw?.id ?? source.employee_id ?? raw?.email ?? `emp-${Math.random().toString(36).slice(2)}`;
  return {
    id: fallbackId,
    nombre: raw?.nombre ?? source.full_name ?? 'Sin nombre',
    rol: raw?.rol ?? source.job_title ?? source.cargo ?? null,
    departamento: raw?.departamento ?? source.department?.name ?? source.unidad ?? null,
    departamentoId: raw?.departamentoId ?? source.department_id ?? source.department?.id ?? null,
    municipio: raw?.municipio ?? source.city ?? '',
    email: raw?.email ?? '',
    telefono: raw?.telefono ?? source.phone ?? null,
    estado: raw?.estado ?? source.employment_status ?? 'Activa',
    cedula: raw?.cedula ?? source.dni ?? null,
    diasVacaciones: raw?.diasVacaciones ?? source.vacation_days_balance ?? null,
    fechaIngreso: raw?.fechaIngreso ?? source.hire_date ?? null,
    fechaNacimiento: raw?.fechaNacimiento ?? source.birth_date ?? null,
    foto: raw?.foto ?? source.photo_url ?? null,
  };
};

const formatDate = (value?: string | Date | null) => {
  if (!value) {
    return 'N/D';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/D';
  }
  return date.toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function PortalAdminEmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [remoteEmployees, setRemoteEmployees] = useState<EmployeeRecord[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ departamentos: FilterOption[]; estados: FilterOption[] }>({ departamentos: [], estados: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [halted, setHalted] = useState(false);
  const filtersActive = Boolean(searchTerm.trim() || departmentFilter !== 'todos' || statusFilter !== 'todos');

  const loadEmployees = useCallback(async () => {
    if (isApiHalted()) {
      setHalted(true);
      setError('Peticiones suspendidas tras múltiples fallos.');
      return;
    }
    setLoading(true);
    setError('');
    setHalted(false);
    try {
      const resp = await fetchEmployees({ sort: 'az', scope: 'all' });
      if (resp.success) {
        const incoming = Array.isArray(resp.data?.employees) ? resp.data.employees : [];
        setRemoteEmployees(incoming.map((item) => mapEmployeeRecord(item)));
        const rawFilters = resp.data?.filters ?? {};
        setFilterOptions({
          departamentos: normalizeOptionList(rawFilters.departamentos, 'departamento'),
          estados: normalizeOptionList(rawFilters.estados, 'estado'),
        });
      } else {
        setError('No se pudo cargar el personal.');
      }
    } catch (e: any) {
      setError(e?.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    const onHalt = () => {
      setHalted(true);
      setError('Peticiones suspendidas tras múltiples fallos.');
    };
    const onResume = () => {
      setHalted(false);
      setError('');
      loadEmployees();
    };
    window.addEventListener('api:halt', onHalt);
    window.addEventListener('api:resumed', onResume);
    return () => {
      window.removeEventListener('api:halt', onHalt);
      window.removeEventListener('api:resumed', onResume);
    };
  }, [loadEmployees]);

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const departmentNeedle = departmentFilter.toLowerCase();
    const statusNeedle = statusFilter.toLowerCase();
    return remoteEmployees
      .filter((employee) => {
        const name = employee.nombre?.toLowerCase() ?? '';
        const email = employee.email?.toLowerCase() ?? '';
        const municipio = employee.municipio?.toLowerCase() ?? '';
        const matchesQuery = !query || name.includes(query) || email.includes(query) || municipio.includes(query);
        const matchesDept = departmentFilter === 'todos'
          || (employee.departamento?.toLowerCase() ?? '') === departmentNeedle;
        const matchesStatus = statusFilter === 'todos'
          || (employee.estado?.toLowerCase() ?? '') === statusNeedle;
        return matchesQuery && matchesDept && matchesStatus;
      })
      .sort((a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es', { sensitivity: 'base' }));
  }, [searchTerm, departmentFilter, statusFilter, remoteEmployees]);

  const summary = useMemo(() => {
    const dataset = filtersActive ? filteredEmployees : remoteEmployees;
    const total = dataset.length;
    const porEstado = dataset.reduce<Record<string, number>>((acc, employee) => {
      const estado = employee.estado || 'Activa';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});
    const activos = porEstado['Activa'] || 0;
    const vacaciones = porEstado['Vacaciones'] || 0;
    const licencias = porEstado['Licencia'] || 0;
    const municipios = new Set(dataset.map((e) => e.municipio).filter(Boolean)).size;
    const totalYears = dataset.reduce((sum, employee) => {
      if (!employee.fechaIngreso) {
        return sum;
      }
      const start = new Date(employee.fechaIngreso);
      if (Number.isNaN(start.getTime())) {
        return sum;
      }
      const years = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return sum + years;
    }, 0);
    const promedioAntiguedad = total ? Math.round(totalYears / total) : 0;

    return { total, activos, vacaciones, licencias, municipios, porEstado, promedioAntiguedad };
  }, [filteredEmployees, filtersActive, remoteEmployees]);

  const recentMovements = useMemo(() => {
    if (!remoteEmployees.length) {
      return [];
    }
    return [...remoteEmployees]
      .sort((a, b) => {
        const dateA = a.fechaIngreso ? new Date(a.fechaIngreso).getTime() : 0;
        const dateB = b.fechaIngreso ? new Date(b.fechaIngreso).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [remoteEmployees]);

  const topStates = Object.entries(summary.porEstado)
    .sort((a, b) => (statusOrder[a[0]] || 99) - (statusOrder[b[0]] || 99))
    .slice(0, 4);

  const vacationTeam = useMemo(() => {
    const dataset = filtersActive ? filteredEmployees : remoteEmployees;
    return dataset
      .filter((employee) => {
        const estado = (employee.estado || '').toLowerCase();
        return estado === 'vacaciones' || estado === 'licencia';
      })
      .slice(0, 5);
  }, [filteredEmployees, filtersActive, remoteEmployees]);

  const upcomingBirthdays = useMemo(() => {
    const dataset = filtersActive ? filteredEmployees : remoteEmployees;
    const today = new Date();
    return dataset
      .filter((employee) => Boolean(employee.fechaNacimiento))
      .map((employee) => {
        const birth = new Date(employee.fechaNacimiento as string);
        const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (next.getTime() < today.getTime()) {
          next.setFullYear(today.getFullYear() + 1);
        }
        const daysUntil = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const turning = next.getFullYear() - birth.getFullYear();
        return {
          id: employee.id,
          nombre: employee.nombre,
          departamento: employee.departamento,
          daysUntil,
          nextDate: next.toLocaleDateString('es-HN', { day: '2-digit', month: 'short' }),
          turning,
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 4);
  }, [filteredEmployees, filtersActive, remoteEmployees]);

  const distributionByDepartment = useMemo(() => {
    const dataset = filtersActive ? filteredEmployees : remoteEmployees;
    return Object.entries(
      dataset.reduce<Record<string, number>>((acc, employee) => {
        const key = employee.departamento || 'Sin unidad';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredEmployees, filtersActive, remoteEmployees]);

  const showActionStatus = (type: 'success' | 'info', message: string) => {
    setActionStatus({ type, message });
  };

  const buildCsvFile = (data: EmployeeRecord[], filename: string) => {
    if (!data.length) {
      showActionStatus('info', 'No hay registros para exportar con la selección actual.');
      return;
    }
    const headers = ['Nombre', 'Correo', 'Rol', 'Unidad', 'Municipio', 'Estado', 'Ingreso'];
    const rows = data.map((employee) => [
      employee.nombre || '',
      employee.email || '',
      employee.rol || '',
      employee.departamento || '',
      employee.municipio || '',
      employee.estado || '',
      formatDate(employee.fechaIngreso),
    ]);
    const escapeField = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => escapeField(String(field))).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showActionStatus('success', `Descarga generada (${data.length} registros).`);
  };

  const handleExportMovements = () => {
    buildCsvFile(recentMovements, 'movimientos-recientes.csv');
  };

  const handleExportSelection = () => {
    buildCsvFile(filteredEmployees, 'empleados-filtrados.csv');
  };

  const handleViewEmployee = (employee: EmployeeRecord) => {
    setSelectedEmployee(employee);
    showActionStatus('info', `Detalle abierto para ${employee.nombre}.`);
  };

  const handleUpdateEmployee = (employee: EmployeeRecord) => {
    showActionStatus('success', `${employee.nombre} marcado para seguimiento.`);
  };

  const handleViewBoard = () => {
    showActionStatus('info', 'Pronto abriremos el tablero consolidado desde aquí.');
  };

  const handleRetry = () => {
    resetApiFailureState();
    loadEmployees();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('todos');
    setStatusFilter('todos');
    setSelectedEmployee(null);
  };

  return (
    <section className="cih-card" aria-labelledby="portal-admin-title">
      <div className="cih-card__body">
        <h2 className="cih-card__title" id="portal-admin-title">Administración de empleados</h2>
        <p className="cih-card__subtitle">
          Consolida altas, bajas y licencias con la data existente del portal. Usa los filtros para centrarte en la unidad
          o municipio que necesitas antes de sincronizar con los servicios del backend.
        </p>

        {(error || halted) && (
          <div
            role="alert"
            style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#7f1d1d',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{error || 'Peticiones suspendidas hasta nuevo intento.'}</span>
            <button className="cih-btn cih-btn--ghost" type="button" onClick={handleRetry}>Reintentar</button>
          </div>
        )}

        {loading && !error && (
          <p className="cih-helper" style={{ marginTop: '0.75rem' }}>Cargando personal desde la base de datos...</p>
        )}

        <div className="cih-card" style={{ marginTop: '1.5rem' }}>
          <div className="cih-card__body">
            <div className="cih-card__header" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h3 className="cih-card__title">Filtros rápidos</h3>
                <p className="cih-card__subtitle">Búsqueda por nombre, correo, municipio, unidad o estado.</p>
              </div>
              <button className="cih-btn" type="button" onClick={handleResetFilters}>Limpiar filtros</button>
            </div>
            <div className="row wrap" style={{ gap: '0.75rem' }}>
              <div className="full-width" style={{ flex: '1 1 260px' }}>
                <input
                  type="search"
                  className="cih-input"
                  placeholder="Buscar por nombre, correo o municipio"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <select
                  className="cih-select"
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                >
                  <option value="todos">Todas las unidades</option>
                  {filterOptions.departamentos.map((departamento) => (
                    <option key={departamento.value} value={departamento.value}>{departamento.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <select
                  className="cih-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="todos">Todos los estados</option>
                  {filterOptions.estados.map((estado) => (
                    <option key={estado.value} value={estado.value}>{estado.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="cih-helper" style={{ marginTop: '0.75rem' }}>
              {loading
                ? 'Cargando registros...'
                : remoteEmployees.length === 0
                  ? 'Aún no se han sincronizado colaboradores.'
                  : filtersActive
                    ? filteredEmployees.length
                      ? `${filteredEmployees.length} registros coinciden con la búsqueda.`
                      : 'Sin coincidencias, ajusta los filtros para ver datos.'
                    : 'Mostrando universo completo (sin filtros activos).'}
            </p>
          </div>
        </div>

        {actionStatus && (
          <div
            role="status"
            style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              backgroundColor: actionStatus.type === 'success' ? '#e8f5e9' : '#e7f0ff',
              color: '#0f172a',
            }}
          >
            {actionStatus.message}
          </div>
        )}

        <div className="cih-kpi-grid">
          <div className="cih-kpi">
            <p className="cih-kpi__label">Colaboradores totales</p>
            <p className="cih-kpi__value">{summary.total}</p>
            <p className="cih-helper">Registro maestro</p>
          </div>
          <div className="cih-kpi">
            <p className="cih-kpi__label">Activos</p>
            <p className="cih-kpi__value">{summary.activos}</p>
            <p className="cih-helper">Disponibles hoy</p>
          </div>
          <div className="cih-kpi">
            <p className="cih-kpi__label">Vacaciones</p>
            <p className="cih-kpi__value">{summary.vacaciones}</p>
            <p className="cih-helper">Con reemplazo asignado</p>
          </div>
          <div className="cih-kpi">
            <p className="cih-kpi__label">Licencias</p>
            <p className="cih-kpi__value">{summary.licencias}</p>
            <p className="cih-helper">Médica / especiales</p>
          </div>
          <div className="cih-kpi">
            <p className="cih-kpi__label">Municipios cubiertos</p>
            <p className="cih-kpi__value">{summary.municipios}</p>
            <p className="cih-helper">Operación territorial</p>
          </div>
          <div className="cih-kpi">
            <p className="cih-kpi__label">Antigüedad promedio</p>
            <p className="cih-kpi__value">{summary.promedioAntiguedad} años</p>
            <p className="cih-helper">Basado en la selección</p>
          </div>
        </div>

        <div className="cih-section-grid">
          <div className="cih-card">
            <div className="cih-card__body">
              <div className="cih-card__header">
                <div>
                  <h3 className="cih-card__title">Movimientos recientes</h3>
                  <p className="cih-card__subtitle">Últimas altas y cambios registrados en el mes.</p>
                </div>
                <button className="cih-btn cih-btn--ghost" type="button" onClick={handleExportMovements}>Descargar XLS</button>
              </div>
              <div className="cih-table-wrap">
                <table className="cih-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Unidad</th>
                      <th>Estado</th>
                      <th>Ingreso</th>
                      <th>Seguimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMovements.map((employee) => (
                      <tr key={employee.id}>
                        <td data-label="Nombre">{employee.nombre}</td>
                        <td data-label="Unidad">{employee.departamento || 'Sin unidad'}</td>
                        <td data-label="Estado">
                          <span className={`cih-badge ${(employee.estado || 'Activa') === 'Activa' ? 'cih-badge--success' : 'cih-badge--warning'}`}>
                            {employee.estado || 'Sin estado'}
                          </span>
                        </td>
                        <td data-label="Ingreso">{formatDate(employee.fechaIngreso)}</td>
                        <td data-label="Seguimiento" className="cih-text-right">
                          <button className="cih-btn cih-btn--ghost" type="button" onClick={() => handleViewEmployee(employee)}>Ver ficha</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="cih-card">
            <div className="cih-card__body">
              <h3 className="cih-card__title">Estado del personal</h3>
              <p className="cih-card__subtitle">Distribución rápida por situación laboral.</p>
              <ul className="cih-list">
                {topStates.map(([estado, count]) => (
                  <li key={estado} className="cih-list__item">
                    <div>
                      <strong>{estado}</strong>
                      <p className="cih-helper">{estado === 'Activa' ? 'Disponible' : 'Seguimiento'}</p>
                    </div>
                    <span className="cih-chip">{count}</span>
                  </li>
                ))}
              </ul>
              <button className="cih-btn cih-btn--primary" type="button" onClick={handleViewBoard}>Ver tablero completo</button>
            </div>
          </div>
        </div>

        <div className="cih-section-grid">
          <div className="cih-card">
            <div className="cih-card__body">
              <h3 className="cih-card__title">Equipo en vacaciones / licencias</h3>
              <p className="cih-card__subtitle">Personas fuera de oficina según el filtro aplicado.</p>
              {vacationTeam.length ? (
                <ul className="cih-list">
                  {vacationTeam.map((employee) => (
                    <li key={employee.id} className="cih-list__item">
                      <div>
                        <strong>{employee.nombre}</strong>
                        <p className="cih-helper">{employee.departamento || 'Sin unidad'} · {employee.municipio || 'Sin municipio'}</p>
                      </div>
                      <div className="cih-text-right">
                        <span className="cih-chip">{employee.estado || 'Sin estado'}</span>
                        <p className="cih-helper">Ingreso {formatDate(employee.fechaIngreso)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="cih-empty">No hay personal fuera de oficina con los filtros actuales.</p>
              )}
            </div>
          </div>

          <div className="cih-card">
            <div className="cih-card__body">
              <h3 className="cih-card__title">Próximos cumpleaños</h3>
              <p className="cih-card__subtitle">Celebra al personal que está por cumplir años.</p>
              {upcomingBirthdays.length ? (
                <ul className="cih-list">
                  {upcomingBirthdays.map((item) => (
                    <li key={item.id} className="cih-list__item">
                      <div>
                        <strong>{item.nombre}</strong>
                        <p className="cih-helper">{item.departamento || 'Sin unidad'}</p>
                      </div>
                      <div className="cih-text-right">
                        <span className="cih-chip">{item.daysUntil} días</span>
                        <p className="cih-helper">Cumple {item.nextDate} · {item.turning} años</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="cih-empty">Sin cumpleaños cercanos con los filtros aplicados.</p>
              )}
            </div>
          </div>
        </div>

        <div className="cih-card" style={{ marginTop: '1.5rem' }}>
          <div className="cih-card__body">
            <div className="cih-card__header">
              <div>
                <h3 className="cih-card__title">Detalle operativo</h3>
                <p className="cih-card__subtitle">Resultados listos para validar antes de enviarlos a Recursos Humanos.</p>
              </div>
                <button className="cih-btn cih-btn--primary" type="button" onClick={handleExportSelection}>Exportar selección</button>
            </div>
            {filteredEmployees.length ? (
              <div className="cih-table-wrap">
                <table className="cih-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Unidad</th>
                      <th>Municipio</th>
                      <th>Estado</th>
                      <th>Ingreso</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td data-label="Nombre">{employee.nombre}</td>
                        <td data-label="Rol">{employee.rol || 'N/D'}</td>
                        <td data-label="Unidad">{employee.departamento || 'Sin unidad'}</td>
                        <td data-label="Municipio">{employee.municipio || 'Sin municipio'}</td>
                        <td data-label="Estado">
                          <span className={`cih-badge ${(employee.estado || 'Activa') === 'Activa' ? 'cih-badge--success' : 'cih-badge--warning'}`}>
                            {employee.estado || 'Sin estado'}
                          </span>
                        </td>
                        <td data-label="Ingreso">{formatDate(employee.fechaIngreso)}</td>
                        <td data-label="Acciones" className="cih-text-right">
                          <div className="actions-row">
                            <button className="cih-btn cih-btn--ghost" type="button" onClick={() => handleUpdateEmployee(employee)}>Actualizar</button>
                            <button className="cih-btn" type="button" onClick={() => handleViewEmployee(employee)}>Ver detalle</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="cih-empty">No hay coincidencias con los filtros aplicados.</p>
            )}
          </div>
        </div>

        {selectedEmployee && (
          <div className="cih-card" style={{ marginTop: '1.25rem' }}>
            <div className="cih-card__body">
              <div className="cih-card__header">
                <div>
                  <h3 className="cih-card__title">Detalle seleccionado</h3>
                  <p className="cih-card__subtitle">Resumen rápido para acciones manuales.</p>
                </div>
                <button className="cih-btn cih-btn--ghost" type="button" onClick={() => setSelectedEmployee(null)}>Cerrar</button>
              </div>
              <div className="cih-table-wrap">
                <table className="cih-table">
                  <tbody>
                    <tr>
                      <th>Nombre</th>
                      <td>{selectedEmployee.nombre}</td>
                    </tr>
                    <tr>
                      <th>Correo</th>
                      <td>{selectedEmployee.email || 'N/D'}</td>
                    </tr>
                    <tr>
                      <th>Rol</th>
                      <td>{selectedEmployee.rol || 'N/D'}</td>
                    </tr>
                    <tr>
                      <th>Unidad / Municipio</th>
                      <td>{(selectedEmployee.departamento || 'Sin unidad')} · {(selectedEmployee.municipio || 'Sin municipio')}</td>
                    </tr>
                    <tr>
                      <th>Estado</th>
                      <td>{selectedEmployee.estado || 'Sin estado'}</td>
                    </tr>
                    <tr>
                      <th>Ingreso</th>
                      <td>{formatDate(selectedEmployee.fechaIngreso)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="cih-card" style={{ marginTop: '1.5rem' }}>
          <div className="cih-card__body">
            <h3 className="cih-card__title">Distribución por unidad</h3>
            <p className="cih-card__subtitle">Top de áreas con mayor dotación según el filtro.</p>
            <ul className="cih-list">
              {distributionByDepartment.map(([area, count]) => {
                const baseTotal = filtersActive ? filteredEmployees.length : remoteEmployees.length;
                const percentage = baseTotal ? ((count / baseTotal) * 100).toFixed(0) : '0';
                return (
                  <li key={area} className="cih-list__item">
                    <div>
                      <strong>{area}</strong>
                      <p className="cih-helper">{count} colaboradores</p>
                    </div>
                    <span className="cih-chip">{percentage}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
