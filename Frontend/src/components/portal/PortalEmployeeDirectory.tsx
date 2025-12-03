import { useEffect, useMemo, useState } from 'react';
import { fetchEmployees, fetchEmployeeById, fetchPlanificacion, isApiHalted, resetApiFailureState, API_BASE, PlanificacionEntry } from '../../lib/api';

type SortOption = 'az' | 'za';
type FilterOption = { value: string; label: string };

const PAGE_SIZE = 10;
const PENDING_LOCATION_LABEL = 'Pendiente planificación';

function buildPlanLocationIndex(entries: PlanificacionEntry[]) {
  const now = new Date();
  const grouped: Record<string, PlanificacionEntry[]> = {};

  entries.forEach((entry) => {
    if (!entry || entry.empleado_id == null) {
      return;
    }
    const key = String(entry.empleado_id);
    grouped[key] = grouped[key] || [];
    grouped[key].push(entry);
  });

  const result: Record<string, string> = {};

  Object.entries(grouped).forEach(([key, list]) => {
    if (!list.length) {
      return;
    }
    const sorted = [...list].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    const upcoming = sorted.find((item) => {
      const entryDate = new Date(item.fecha);
      return !Number.isNaN(entryDate.getTime()) && entryDate >= now;
    });
    const candidate = upcoming ?? sorted[sorted.length - 1];
    const location = candidate?.lugar?.trim()
      || candidate?.area?.trim()
      || candidate?.linea_servicio?.trim()
      || candidate?.sector_trabajo?.trim()
      || '';
    if (location) {
      result[key] = location;
    }
  });

  return result;
}

export function PortalEmployeeDirectory() {
  const [search, setSearch] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [estado, setEstado] = useState('');
  const [sort, setSort] = useState<SortOption>('az');
  const [page, setPage] = useState(1);

  const [remoteEmployees, setRemoteEmployees] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ municipios: FilterOption[]; departamentos: FilterOption[]; estados: FilterOption[] }>({ municipios: [], departamentos: [], estados: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [halted, setHalted] = useState(false);
  const [planLocations, setPlanLocations] = useState<Record<string, string>>({});

  // Modal State
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const normalizeOptionList = (items: any, prefix: string): FilterOption[] => {
    if (!Array.isArray(items) || items.length === 0) return [];
    const seen = new Set<string>();
    const normalized: FilterOption[] = [];
    items.forEach((item, index) => {
      if (item == null) {
        return;
      }

      let value: string | null = null;
      let label: string | null = null;

      if (typeof item === 'string' || typeof item === 'number') {
        const text = String(item).trim();
        value = text || `${prefix}-${index}`;
        label = text || `${prefix} ${index + 1}`;
      } else if (typeof item === 'object') {
        const rawValue = item.value ?? item.id ?? item.slug ?? item.nombre ?? item.name ?? item.label;
        const rawLabel = item.label ?? item.nombre ?? item.name ?? rawValue;
        value = rawValue != null ? String(rawValue) : `${prefix}-${index}`;
        label = rawLabel != null ? String(rawLabel) : value;
      }

      if (!value || seen.has(value)) {
        value = `${prefix}-${index}`;
      }
      seen.add(value);
      normalized.push({ value, label: label || value });
    });
    return normalized;
  };

  const load = async () => {
    if (isApiHalted()) {
      setHalted(true);
      setError('Peticiones suspendidas tras múltiples fallos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetchEmployees({ q: search, municipio, departamento, sort, scope: 'all' });
      if (resp.success) {
        setRemoteEmployees(Array.isArray(resp.data?.employees) ? resp.data.employees : []);
        const rawFilters = resp.data?.filters || {};
        setFilterOptions({
          municipios: normalizeOptionList(rawFilters.municipios, 'municipio'),
          departamentos: normalizeOptionList(rawFilters.departamentos, 'departamento'),
          estados: normalizeOptionList(rawFilters.estados, 'estado'),
        });
      } else {
        setError('Error desconocido');
      }
    } catch (e: any) {
      setError(e.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, municipio, departamento, sort]);

  useEffect(() => {
    const loadPlanLocations = async () => {
      if (isApiHalted()) {
        return;
      }
      try {
        const resp = await fetchPlanificacion();
        if (resp.success && Array.isArray(resp.data)) {
          setPlanLocations(buildPlanLocationIndex(resp.data));
        } else {
          setPlanLocations({});
        }
      } catch (planError) {
        console.error('No se pudo obtener la planificación para el directorio', planError);
        setPlanLocations({});
      }
    };
    loadPlanLocations();
  }, []);

  useEffect(() => {
    const onHalt = () => {
      setHalted(true);
      setError('Peticiones suspendidas tras múltiples fallos.');
    };
    const onResume = () => {
      setHalted(false);
      setError('');
      load();
    };
    window.addEventListener('api:halt', onHalt);
    window.addEventListener('api:resumed', onResume);
    return () => {
      window.removeEventListener('api:halt', onHalt);
      window.removeEventListener('api:resumed', onResume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!remoteEmployees || remoteEmployees.length === 0) return [];
    return remoteEmployees
      .filter((employee) => {
        if (!employee) return false;
        const matchesEstado = estado ? employee.estado === estado : true;
        return matchesEstado;
      })
      .sort((a, b) => {
        const nameA = (a?.nombre ?? a?.name ?? '').toString();
        const nameB = (b?.nombre ?? b?.name ?? '').toString();
        // Use Spanish locale; fallback to base sensitivity for accent-insensitive compare
        return sort === 'az'
          ? nameA.localeCompare(nameB, 'es', { sensitivity: 'base' })
          : nameB.localeCompare(nameA, 'es', { sensitivity: 'base' });
      });
  }, [estado, remoteEmployees, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [currentPage, filtered]);

  const resolveDirectoryLocation = (employee: any) => {
    if (!employee || employee.id == null) {
      return PENDING_LOCATION_LABEL;
    }
    return planLocations[String(employee.id)] || PENDING_LOCATION_LABEL;
  };

  const reset = () => {
    setSearch('');
    setMunicipio('');
    setDepartamento('');
    setEstado('');
    setSort('az');
    setPage(1);
  };

  const handleViewProfile = async (employee: any) => {
    setSelectedEmployee(employee); // Show basic info immediately
    setShowModal(true);
    setModalLoading(true);
    try {
      // Assuming employee has an ID. If not, we can't fetch details.
      if (employee.id) {
        const resp = await fetchEmployeeById(employee.id);
        if (resp.success && resp.data) {
          setSelectedEmployee(resp.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch employee details", error);
      // Keep showing basic info if fetch fails
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const getPhotoUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  };

  return (
    <section id="directorio" className="cih-card" aria-labelledby="directorio-title">
      <div className="cih-card__body">
        <h2 className="cih-card__title" id="directorio-title">Equipo del Consejo Intermunicipal Higuito</h2>
        <p className="cih-card__subtitle">Busca por nombre, unidad, municipio o estado.</p>

        <div className="cih-toolbar" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-end' }}>
          <label className="cih-field" style={{ flex: '1 1 180px', minWidth: 0 }}>
            <span className="sr-only">Buscar</span>
            <input
              className="cih-input"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', width: '100%' }}
              placeholder="Buscar por nombre o rol…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <label className="cih-field" style={{ flex: '1 1 140px', minWidth: 0 }}>
            <span className="sr-only">Municipio</span>
            <select
              className="cih-select"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', width: '100%' }}
              value={municipio}
              onChange={(event) => {
                setMunicipio(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos los municipios</option>
              {(filterOptions.municipios || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="cih-field" style={{ flex: '1 1 140px', minWidth: 0 }}>
            <span className="sr-only">Departamento</span>
            <select
              className="cih-select"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', width: '100%' }}
              value={departamento}
              onChange={(event) => {
                setDepartamento(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Todas las unidades</option>
              {(filterOptions.departamentos || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="cih-field" style={{ flex: '1 1 140px', minWidth: 0 }}>
            <span className="sr-only">Estado</span>
            <select
              className="cih-select"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', width: '100%' }}
              value={estado}
              onChange={(event) => {
                setEstado(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              {(filterOptions.estados || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="cih-field" style={{ flex: '0 0 100px', minWidth: 0 }}>
            <span className="sr-only">Ordenar</span>
            <select
              className="cih-select"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', width: '100%' }}
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </label>

          <button
            type="button"
            className="cih-btn"
            onClick={reset}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', minHeight: 'unset', flex: '0 0 auto' }}
          >
            Limpiar
          </button>
        </div>

        {loading && <p className="cih-card__subtitle">Cargando…</p>}
        {error && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p className="cih-error visible" role="alert">{error}</p>
            {halted && (
              <button
                type="button"
                className="cih-btn cih-btn--primary"
                onClick={() => {
                  resetApiFailureState();
                  setHalted(false);
                  setError('');
                  load();
                }}
              >
                Reintentar
              </button>
            )}
          </div>
        )}
        {!loading && !error && (
          <p className="cih-count">
            {filtered.length === 1 ? '1 resultado' : `${filtered.length} resultados`}
          </p>
        )}

        <div className="cih-table-wrap">
          <table className="cih-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Ubicación</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && !loading && !error && (
                <tr>
                  <td colSpan={6}>
                    <div className="cih-empty">No se encontraron empleados con esos filtros.</div>
                  </td>
                </tr>
              )}
              {paginated.map((employee, index) => {
                const rowKey = employee?.id ?? employee?.email ?? `${employee?.nombre ?? 'empleado'}-${index}`;
                return (
                  <tr key={rowKey}>
                    <td data-label="Nombre">
                      {employee.nombre}
                      <div className="cih-card__subtitle" style={{ marginTop: '0.15rem' }}>
                        {employee.rol}
                      </div>
                    </td>
                    <td data-label="Contacto">
                      <div>{employee.telefono}</div>
                      <div className="cih-card__subtitle">{employee.email}</div>
                    </td>
                    <td data-label="Ubicación">{resolveDirectoryLocation(employee)}</td>
                    <td data-label="Unidad">{employee.departamento}</td>
                    <td data-label="Estado">
                      <span className={`cih-badge ${employee.estado === 'Activa' ? 'cih-badge--success' : 'cih-badge--warning'}`}>
                        {employee.estado}
                      </span>
                    </td>
                    <td data-label="Acciones" className="cih-text-right" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="cih-btn cih-btn--primary"
                        onClick={() => handleViewProfile(employee)}
                      >
                        Ver perfil
                      </button>
                      {employee.email ? (
                        <a
                          href={`mailto:${employee.email}`}
                          className="cih-btn"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Contactar
                        </a>
                      ) : (
                        <button type="button" className="cih-btn" disabled title="No tiene email registrado">
                          Contactar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="cih-pagination" aria-label="Paginación del directorio">
          <button type="button" disabled={currentPage === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Anterior
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1) {
              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={pageNumber === currentPage ? 'is-active' : ''}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            }
            if (Math.abs(pageNumber - currentPage) === 2) {
              return (
                <span key={pageNumber} aria-hidden="true">
                  …
                </span>
              );
            }
            return null;
          })}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Siguiente
          </button>
        </div>

      </div>

      {/* Profile Modal */}
      {showModal && selectedEmployee && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>Perfil de Empleado</h3>
              <button type="button" className="cih-btn cih-btn--ghost" onClick={closeModal} style={{ padding: '0.25rem 0.5rem' }}>✕</button>
            </div>

            {modalLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando detalles...</div>
            ) : (
              <div className="modal-body">
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {/* Avatar / Photo placeholder */}
                  <div style={{ flexShrink: 0 }}>
                    {selectedEmployee.foto ? (
                      <img
                        src={getPhotoUrl(selectedEmployee.foto) || ''}
                        alt={selectedEmployee.nombre}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--cih-border)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: '#64748b',
                        fontWeight: 'bold'
                      }}>
                        {selectedEmployee.nombre ? selectedEmployee.nombre.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{selectedEmployee.nombre}</h4>
                    <p style={{ color: 'var(--cih-muted)', margin: '0 0 1rem 0' }}>{selectedEmployee.rol}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                      <div className="kv">
                        <span style={{ fontWeight: 600, minWidth: '80px' }}>Email:</span>
                        <span>{selectedEmployee.email || 'No disponible'}</span>
                      </div>
                      <div className="kv">
                        <span style={{ fontWeight: 600, minWidth: '80px' }}>Teléfono:</span>
                        <span>{selectedEmployee.telefono || 'No disponible'}</span>
                      </div>
                      <div className="kv">
                        <span style={{ fontWeight: 600, minWidth: '80px' }}>Unidad:</span>
                        <span>{selectedEmployee.departamento || 'No asignada'}</span>
                      </div>
                      <div className="kv">
                        <span style={{ fontWeight: 600, minWidth: '80px' }}>Ubicación:</span>
                        <span>{selectedEmployee.municipio || 'No especificada'}</span>
                      </div>
                      <div className="kv">
                        <span style={{ fontWeight: 600, minWidth: '80px' }}>Estado:</span>
                        <span className={`cih-badge ${selectedEmployee.estado === 'Activa' ? 'cih-badge--success' : 'cih-badge--warning'}`}>
                          {selectedEmployee.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEmployee.descripcion && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--cih-border)', paddingTop: '1rem' }}>
                    <h5 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Sobre mí</h5>
                    <p style={{ lineHeight: 1.6, color: 'var(--cih-text)' }}>{selectedEmployee.descripcion}</p>
                  </div>
                )}
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="cih-btn" onClick={closeModal}>Cerrar</button>
              {selectedEmployee?.email ? (
                <a
                  href={`mailto:${selectedEmployee.email}`}
                  className="cih-btn cih-btn--primary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Contactar
                </a>
              ) : (
                <button type="button" className="cih-btn cih-btn--primary" disabled>
                  Contactar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
