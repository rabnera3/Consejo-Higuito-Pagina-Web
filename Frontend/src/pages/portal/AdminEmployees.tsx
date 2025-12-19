import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchEmployees, isApiHalted, resetApiFailureState, EmployeeSummary, createEmployee, fetchDepartments, Department } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

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
  const [employeeToCommunicate, setEmployeeToCommunicate] = useState<EmployeeRecord | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [remoteEmployees, setRemoteEmployees] = useState<EmployeeRecord[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ departamentos: FilterOption[]; estados: FilterOption[] }>({ departamentos: [], estados: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [halted, setHalted] = useState(false);
  const filtersActive = Boolean(searchTerm.trim() || departmentFilter !== 'todos' || statusFilter !== 'todos');

  // Estados para modal de crear empleado
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    email: '',
    password: '',
    job_title: '',
    department_id: '',
    municipio: '',
    phone: '',
    cedula: '',
    role: 'empleado',
  });
  const isGerente = user?.role === 'gerente' || user?.role === 'gerencia';

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

  // Cargar departamentos cuando se abre el modal
  useEffect(() => {
    if (showCreateModal && departments.length === 0) {
      fetchDepartments().then((resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          setDepartments(resp.data);
        }
      });
    }
  }, [showCreateModal, departments.length]);

  // Función para crear empleado
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.full_name || !newEmployee.email || !newEmployee.password) {
      setCreateError('Nombre, email y contraseña son requeridos');
      return;
    }
    setCreateLoading(true);
    setCreateError('');
    try {
      const payload = {
        full_name: newEmployee.full_name,
        email: newEmployee.email,
        password: newEmployee.password,
        job_title: newEmployee.job_title || undefined,
        department_id: newEmployee.department_id ? Number(newEmployee.department_id) : undefined,
        municipio: newEmployee.municipio || undefined,
        phone: newEmployee.phone || undefined,
        cedula: newEmployee.cedula || undefined,
        role: newEmployee.role || 'empleado',
      };
      const resp = await createEmployee(payload);
      if (resp.success) {
        setShowCreateModal(false);
        setNewEmployee({
          full_name: '',
          email: '',
          password: '',
          job_title: '',
          department_id: '',
          municipio: '',
          phone: '',
          cedula: '',
          role: 'empleado',
        });
        setActionStatus({ type: 'success', message: 'Empleado creado exitosamente' });
        loadEmployees();
      } else {
        setCreateError(resp.error || 'Error al crear empleado');
      }
    } catch (err: any) {
      setCreateError(err?.message || 'Error de red');
    } finally {
      setCreateLoading(false);
    }
  };

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

  const showActionStatus = (type: 'success' | 'info', message: string) => {
    setActionStatus({ type, message });
  };

  const buildXlsxFile = async (data: EmployeeRecord[], filename: string) => {
    if (!data.length) {
      showActionStatus('info', 'No hay registros para exportar con la selección actual.');
      return;
    }
    const XLSX = await import('xlsx');
    const headers = ['Nombre', 'Correo', 'Rol', 'Unidad', 'Municipio', 'Estado', 'Ingreso'];
    const rows = data.map((employee) => ({
      Nombre: employee.nombre || '',
      Correo: employee.email || '',
      Rol: employee.rol || '',
      Unidad: employee.departamento || '',
      Municipio: employee.municipio || '',
      Estado: employee.estado || '',
      Ingreso: formatDate(employee.fechaIngreso),
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');
    XLSX.writeFile(workbook, filename);
    showActionStatus('success', `Descarga generada (${data.length} registros).`);
  };

  const handleExportMovements = () => {
    buildXlsxFile(recentMovements, 'movimientos-recientes.xlsx');
  };

  const handleExportSelection = () => {
    buildXlsxFile(filteredEmployees, 'empleados-filtrados.xlsx');
  };

  const handleViewEmployee = (employee: EmployeeRecord) => {
    setSelectedEmployee(employee);
  };

  const handleCommunicateEmployee = (employee: EmployeeRecord) => {
    setEmployeeToCommunicate(employee);
  };

  const executeCommunication = () => {
    if (!employeeToCommunicate) return;
    showActionStatus('success', `Notificación de sistema y correo enviados a ${employeeToCommunicate.nombre}.`);
    setEmployeeToCommunicate(null);
    setSelectedEmployee(null);
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
    <>
    <section className="cih-card" aria-labelledby="portal-admin-title">
      <div className="cih-card__body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="cih-card__title" id="portal-admin-title">Administración de empleados</h2>
            <p className="cih-card__subtitle">
              Consolida altas, bajas y licencias con la data existente del portal. Usa los filtros para centrarte en la unidad
              o municipio que necesitas antes de sincronizar con los servicios del backend.
            </p>
          </div>
          {isGerente && (
            <button
              type="button"
              className="cih-btn cih-btn--primary"
              onClick={() => setShowCreateModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Empleado
            </button>
          )}
        </div>

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
                    : `Total: ${remoteEmployees.length} colaboradores.`}
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
                            <button className="cih-btn cih-btn--ghost" type="button" onClick={() => handleCommunicateEmployee(employee)}>Comunicar</button>
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



        <div className="cih-kpi-grid" style={{ marginTop: '1.5rem' }}>
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

        <div className="cih-section-grid" style={{ marginTop: '1.5rem' }}>
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
        </div>

        <div className="cih-card" style={{ marginTop: '1.5rem' }}>
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
    </section>

    {selectedEmployee && (
      <div className="cih-modal-overlay" onClick={() => setSelectedEmployee(null)}>
        <div className="cih-modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="cih-modal-header">
            <h3>Detalle del Colaborador</h3>
            <button className="cih-btn-close" onClick={() => setSelectedEmployee(null)}>&times;</button>
          </div>
          <div className="cih-modal-body">
            <div className="detail-grid">
              <div className="detail-item full-width">
                <label>Nombre Completo</label>
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{selectedEmployee.nombre}</p>
              </div>
              <div className="detail-item">
                <label>Correo Electrónico</label>
                <p>{selectedEmployee.email || 'N/D'}</p>
              </div>
              <div className="detail-item">
                <label>Rol / Cargo</label>
                <p>{selectedEmployee.rol || 'N/D'}</p>
              </div>
              <div className="detail-item">
                <label>Unidad</label>
                <p>{selectedEmployee.departamento || 'Sin unidad'}</p>
              </div>
              <div className="detail-item">
                <label>Municipio</label>
                <p>{selectedEmployee.municipio || 'Sin municipio'}</p>
              </div>
              <div className="detail-item">
                <label>Estado Actual</label>
                <span className={`cih-badge ${(selectedEmployee.estado || 'Activa') === 'Activa' ? 'cih-badge--success' : 'cih-badge--warning'}`} style={{ width: 'fit-content' }}>
                  {selectedEmployee.estado || 'Sin estado'}
                </span>
              </div>
              <div className="detail-item">
                <label>Fecha de Ingreso</label>
                <p>{formatDate(selectedEmployee.fechaIngreso)}</p>
              </div>
            </div>
          </div>
          <div className="cih-modal-footer">
            <button className="cih-btn cih-btn--ghost" type="button" onClick={() => setSelectedEmployee(null)}>Cerrar</button>
            <button className="cih-btn cih-btn--primary" type="button" onClick={() => handleCommunicateEmployee(selectedEmployee)}>Comunicar</button>
          </div>
        </div>
      </div>
    )}

    {employeeToCommunicate && (
      <div className="cih-modal-overlay" onClick={() => setEmployeeToCommunicate(null)}>
        <div className="cih-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
          <div className="cih-modal-header">
            <h3>Confirmar Comunicación</h3>
            <button className="cih-btn-close" onClick={() => setEmployeeToCommunicate(null)}>&times;</button>
          </div>
          <div className="cih-modal-body">
            <p style={{ margin: 0, color: '#64748b', lineHeight: 1.5 }}>
              ¿Estás seguro de enviar una notificación de sistema y un correo electrónico a <strong>{employeeToCommunicate.nombre}</strong>?
            </p>
          </div>
          <div className="cih-modal-footer">
            <button className="cih-btn cih-btn--ghost" type="button" onClick={() => setEmployeeToCommunicate(null)}>Cancelar</button>
            <button className="cih-btn cih-btn--primary" type="button" onClick={executeCommunication}>Sí, enviar</button>
          </div>
        </div>
      </div>
    )}

    <style>{`
      .cih-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
      }
      .cih-modal-box {
        background-color: #ffffff !important;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        animation: modal-in 0.2s ease-out;
        position: relative;
        z-index: 10000;
        border: 1px solid #e2e8f0;
      }
      @keyframes modal-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .cih-modal-header {
        padding: 1.25rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #ffffff;
        border-radius: 12px 12px 0 0;
      }
      .cih-modal-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #1e293b;
        font-weight: 600;
      }
      .cih-btn-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        color: #64748b;
        cursor: pointer;
        padding: 0.25rem;
      }
      .cih-btn-close:hover {
        color: #0f172a;
      }
      .cih-modal-body {
        padding: 1.5rem;
        background-color: #ffffff;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .detail-item.full-width {
        grid-column: 1 / -1;
      }
      .detail-item label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        font-weight: 600;
      }
      .detail-item p {
        margin: 0;
        color: #0f172a;
        font-size: 0.95rem;
      }
      .cih-modal-footer {
        padding: 1.25rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        background-color: #f8fafc;
        border-radius: 0 0 12px 12px;
      }
      @media (max-width: 640px) {
        .detail-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }
    `}</style>

    {/* Modal Crear Empleado */}
    {showCreateModal && (
      <div
        className="cih-modal-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}
        onClick={() => setShowCreateModal(false)}
      >
        <div
          className="cih-modal"
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '550px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
              Crear Nuevo Empleado
            </h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Complete los datos del nuevo empleado
            </p>
          </div>

          <form onSubmit={handleCreateEmployee} style={{ padding: '1.5rem' }}>
            {createError && (
              <div
                role="alert"
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#fee2e2',
                  color: '#7f1d1d',
                  fontSize: '0.875rem',
                }}
              >
                {createError}
              </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="cih-form-group">
                <label className="cih-label">Nombre completo *</label>
                <input
                  type="text"
                  className="cih-input"
                  value={newEmployee.full_name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
                  placeholder="Ej: María López García"
                  required
                />
              </div>

              <div className="cih-form-group">
                <label className="cih-label">Correo electrónico *</label>
                <input
                  type="email"
                  className="cih-input"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="correo@consejohiguito.gob.hn"
                  required
                />
              </div>

              <div className="cih-form-group">
                <label className="cih-label">Contraseña *</label>
                <input
                  type="password"
                  className="cih-input"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cih-form-group">
                  <label className="cih-label">Cargo</label>
                  <input
                    type="text"
                    className="cih-input"
                    value={newEmployee.job_title}
                    onChange={(e) => setNewEmployee({ ...newEmployee, job_title: e.target.value })}
                    placeholder="Ej: Técnico"
                  />
                </div>

                <div className="cih-form-group">
                  <label className="cih-label">Unidad</label>
                  <select
                    className="cih-input"
                    value={newEmployee.department_id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department_id: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="">Seleccionar...</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cih-form-group">
                  <label className="cih-label">Municipio</label>
                  <input
                    type="text"
                    className="cih-input"
                    value={newEmployee.municipio}
                    onChange={(e) => setNewEmployee({ ...newEmployee, municipio: e.target.value })}
                    placeholder="Ej: San Pedro Sula"
                  />
                </div>

                <div className="cih-form-group">
                  <label className="cih-label">Teléfono</label>
                  <input
                    type="tel"
                    className="cih-input"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="Ej: 9999-9999"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cih-form-group">
                  <label className="cih-label">Cédula</label>
                  <input
                    type="text"
                    className="cih-input"
                    value={newEmployee.cedula}
                    onChange={(e) => setNewEmployee({ ...newEmployee, cedula: e.target.value })}
                    placeholder="0000-0000-00000"
                  />
                </div>

                <div className="cih-form-group">
                  <label className="cih-label">Rol</label>
                  <select
                    className="cih-input"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="jefe">Jefe de Unidad</option>
                    <option value="gerente">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="cih-btn cih-btn--ghost"
                onClick={() => setShowCreateModal(false)}
                disabled={createLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="cih-btn cih-btn--primary"
                disabled={createLoading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {createLoading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Creando...
                  </>
                ) : (
                  'Crear Empleado'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}
