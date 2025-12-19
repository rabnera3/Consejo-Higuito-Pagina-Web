import axios, { AxiosInstance } from 'axios';

// Vite exposes env via import.meta as any in this TS config; cast to access safely
const meta: any = import.meta;
export const API_BASE: string = meta?.env?.VITE_API_BASE || 'http://localhost:8080';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Interceptor para capturar 401 y notificar a la app (una sola vez hasta éxito)
let unauthorizedNotified = false;
client.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401 && !unauthorizedNotified) {
      unauthorizedNotified = true;
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Control de fallos consecutivos
const THROTTLE_LIMIT = 5;
let consecutiveFailures = 0;
let halted = false;

function registerSuccess() {
  if (consecutiveFailures !== 0) {
    consecutiveFailures = 0;
  }
  if (halted) {
    halted = false;
    window.dispatchEvent(new CustomEvent('api:resumed'));
  }
  // Restablece notificación de 401 para poder captar futura expiración de sesión
  unauthorizedNotified = false;
}

function registerFailure() {
  consecutiveFailures += 1;
  if (consecutiveFailures >= THROTTLE_LIMIT && !halted) {
    halted = true;
    window.dispatchEvent(new CustomEvent('api:halt', { detail: { count: consecutiveFailures } }));
  }
}

export function isApiHalted() {
  return halted;
}

export function resetApiFailureState() {
  consecutiveFailures = 0;
  if (halted) {
    halted = false;
    window.dispatchEvent(new CustomEvent('api:resumed'));
  }
}

async function apiRequest<T = any>(method: string, path: string, data?: any, params?: any): Promise<T> {
  if (halted) {
    throw new Error('Servicio temporalmente suspendido tras múltiples errores. Presiona reintentar.');
  }
  try {
    const resp = await client.request<T>({ method, url: path, data, params });
    registerSuccess();
    return resp.data as T;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Error de red';
    registerFailure();
    throw new Error(message);
  }
}

export interface ApiUser {
  id: number | null;
  email: string | null;
  nombre: string | null;
  role: string | null;
  role_name?: string | null;
  department_id?: number | null;
  department_name?: string | null;
  employee_id?: number | null;
  photo_url?: string | null;
}

export interface LoginResponse {
  success: boolean;
  user?: ApiUser;
  token?: string;
  message?: string;
}

export function loginApi(email: string, password: string) {
  return apiRequest<LoginResponse>('POST', '/api/auth/login', { email, password });
}

export function logoutApi() {
  return apiRequest('POST', '/api/auth/logout');
}

export function meApi() {
  return apiRequest('GET', '/api/auth/me');
}

export interface EmployeeSummary {
  id: number | string;
  nombre: string;
  rol?: string | null;
  telefono?: string | null;
  municipio?: string | null;
  departamento?: string | null;
  departamentoId?: number | null;
  estado?: string | null;
  email?: string | null;
  foto?: string | null;
  cedula?: string | null;
  diasVacaciones?: number | null;
  fechaIngreso?: string | null;
  fechaNacimiento?: string | null;
}

export interface EmployeesFiltersResponse {
  municipios: Array<string | Record<string, any>>;
  departamentos: Array<string | Record<string, any>>;
  estados: string[];
}

export interface EmployeesIndexResponse {
  success: boolean;
  data: {
    employees: EmployeeSummary[];
    filters: EmployeesFiltersResponse;
  };
  message?: string;
}

export function fetchEmployees(params: Record<string, string | number | undefined>) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  );
  return apiRequest<EmployeesIndexResponse>('GET', '/api/empleados', undefined, cleanParams);
}

export function fetchEmployeeById(id: number) {
  return apiRequest<{ success: boolean; data: any }>('GET', `/api/empleados/${id}`);
}

export interface Department {
  id: number;
  name: string;
}

export function fetchDepartments() {
  return apiRequest<{ success: boolean; data: Department[] }>('GET', '/api/departamentos');
}

export function updateEmployee(id: number, data: any) {
  return apiRequest<{ success: boolean; message: string }>('PUT', `/api/empleados/${id}`, data);
}

export interface CreateEmployeeData {
  full_name: string;
  email: string;
  password: string;
  job_title?: string;
  department_id?: number;
  municipio?: string;
  phone?: string;
  cedula?: string;
  hire_date?: string;
  role?: string;
}

export function createEmployee(data: CreateEmployeeData) {
  return apiRequest<{ success: boolean; message: string; data: { id: number; user_id: number; nombre: string; email: string; rol: string } }>('POST', '/api/empleados', data);
}

export function uploadEmployeePhoto(id: number, file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return client.post<{ success: boolean; message: string; data: { photo_url: string } }>(
    `/api/empleados/${id}/foto`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  ).then(r => r.data);
}

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

export function getApiAuthToken() {
  return authToken;
}
// Planificación API
export interface PlanificacionEntry {
  id?: number;
  empleado_id: number;
  empleado_nombre?: string;
  departamento?: string;
  department_id?: number;
  fecha: string;
  lugar: string;
  sector_trabajo: string;
  area: string;
  recursos: string;
  linea_servicio: string;
  duracion: string;
  descripcion: string;
}

export interface PlanificacionResponse {
  success: boolean;
  data?: PlanificacionEntry[];
  message?: string;
}

export function fetchPlanificacion() {
  return apiRequest<PlanificacionResponse>('GET', '/api/planificacion');
}

export function createPlanificacion(data: PlanificacionEntry) {
  return apiRequest<{ success: boolean; message: string }>('POST', '/api/planificacion', data);
}

export function updatePlanificacion(id: number, data: PlanificacionEntry) {
  return apiRequest<{ success: boolean; message: string }>('PUT', `/api/planificacion/${id}`, data);
}

export function deletePlanificacion(id: number) {
  return apiRequest<{ success: boolean; message: string }>('DELETE', `/api/planificacion/${id}`);
}

export function fetchPlanificacionByEmployee(employeeId: number) {
  return apiRequest<PlanificacionResponse>('GET', `/api/planificacion/empleado/${employeeId}`);
}

export function fetchPlanificacionByUnit() {
  return apiRequest<PlanificacionResponse>('GET', '/api/planificacion/my-unit');
}

// Blog API
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  video_url: string | null;
  category: string | null;
  tags: string | null;
  author_id: number;
  author_name?: string;
  author_email?: string;
  department_name?: string;
  department_id?: number | null;
  status: 'draft' | 'published';
  published_at: string | null;
  published_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogResponse {
  success: boolean;
  data?: BlogPost | BlogPost[];
  message?: string;
}

export const blogApi = {
  getAll: (status: 'all' | 'draft' | 'published' = 'published') => {
    return apiRequest<BlogResponse>('GET', '/api/blog', undefined, { status });
  },

  getById: (id: number) => {
    return apiRequest<BlogResponse>('GET', `/api/blog/${id}`);
  },

  getBySlug: (slug: string) => {
    return apiRequest<BlogResponse>('GET', `/api/blog/slug/${slug}`);
  },

  create: (data: Partial<BlogPost>) => {
    return apiRequest<BlogResponse>('POST', '/api/blog', data);
  },

  update: (id: number, data: Partial<BlogPost>) => {
    return apiRequest<BlogResponse>('PUT', `/api/blog/${id}`, data);
  },

  delete: (id: number) => {
    return apiRequest<BlogResponse>('DELETE', `/api/blog/${id}`);
  },

  uploadImage: async (file: File) => {
    if (halted) {
      throw new Error('Servicio temporalmente suspendido tras múltiples errores. Presiona reintentar.');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const resp = await client.post('/api/blog/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      registerSuccess();
      return resp.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Error al subir imagen';
      registerFailure();
      throw new Error(message);
    }
  },

  requestChanges: (id: number, reason: string) => {
    return apiRequest<{ success: boolean; message: string }>('POST', `/api/blog/${id}/request-changes`, { reason });
  }
};

// Notifications API
export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
}

export function fetchNotifications() {
  return apiRequest<NotificationResponse>('GET', '/api/notifications');
}

export function markNotificationAsRead(id: number) {
  return apiRequest<{ success: boolean }>('POST', `/api/notifications/${id}/read`);
}

export function markAllNotificationsAsRead() {
  return apiRequest<{ success: boolean }>('POST', '/api/notifications/read-all');
}

export function deleteAllNotifications() {
  return apiRequest<{ success: boolean }>('DELETE', '/api/notifications/delete-all');
}


// Requests API
export interface RequestEntry {
  id: number;
  employee_id: number;
  type: 'vacaciones' | 'permiso' | 'insumos' | 'vehiculo' | 'otro';
  description: string;
  start_date?: string;
  end_date?: string;
  status: 'pending_approval' | 'pending_authorization' | 'pending_admin' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
  employee?: {
    full_name: string;
    department_id: number;
  };
}

export interface RequestResponse {
  success: boolean;
  data?: RequestEntry | RequestEntry[];
  message?: string;
}

export function createRequest(data: { type: RequestEntry['type']; description: string; start_date?: string; end_date?: string }) {
  return apiRequest<{ success: boolean; data: RequestEntry }>('POST', '/api/requests', data);
}

export function fetchMyRequests() {
  return apiRequest<RequestResponse>('GET', '/api/requests/my');
}

export function fetchPendingRequestsForChief() {
  return apiRequest<RequestResponse>('GET', '/api/requests/pending-chief');
}

export function fetchPendingRequestsForManager() {
  return apiRequest<RequestResponse>('GET', '/api/requests/pending-manager');
}

export function fetchRequestsByUnit() {
  return apiRequest<RequestResponse>('GET', '/api/requests/unit');
}

export function approveRequestByChief(id: number) {
  return apiRequest<{ success: boolean; message: string }>('PUT', `/api/requests/${id}/approve-chief`);
}

export function approveRequestByManager(id: number) {
  return apiRequest<{ success: boolean; message: string }>('PUT', `/api/requests/${id}/approve-manager`);
}

export function rejectRequest(id: number, reason: string) {
  return apiRequest<{ success: boolean; message: string }>('PUT', `/api/requests/${id}/reject`, { reason });
}

export function fetchApprovedRequestsHistory(params: { start: string; end: string }) {
  return apiRequest<RequestResponse>('GET', '/api/requests/manager/history', undefined, params);
}

// Default export for convenient usage
const api = {
  get: (path: string, params?: any) => apiRequest('GET', `/api${path}`, undefined, params),
  post: (path: string, data?: any) => apiRequest('POST', `/api${path}`, data),
  put: (path: string, data?: any) => apiRequest('PUT', `/api${path}`, data),
  delete: (path: string) => apiRequest('DELETE', `/api${path}`),
  postFormData: async (path: string, formData: FormData) => {
    if (halted) {
      throw new Error('Servicio temporalmente suspendido tras múltiples errores. Presiona reintentar.');
    }
    try {
      const resp = await client.post(`/api${path}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      registerSuccess();
      return resp.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Error en la petición';
      registerFailure();
      throw new Error(message);
    }
  }
};

export default api;
