import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loginApi, logoutApi, meApi, resetApiFailureState, setApiAuthToken, getApiAuthToken } from '../lib/api';

export interface AuthUser {
  email: string;
  role: string | null;
  roleName?: string | null;
  nombre: string | null;
  id: number | null;
  department_id?: number | null;
  department_name?: string | null;
  employee_id?: number | null;
  photo_url?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'portalAuth';

let loadingInitialMe = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [, setToken] = useState<string | null>(null);

  const persistSession = (nextUser: AuthUser, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);
    setApiAuthToken(nextToken ?? null);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
  };

  useEffect(() => {
    const onUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    // Cargar desde localStorage pero no hacer llamada /me si no hay usuario previo
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && !user) {
        const parsed = JSON.parse(raw) as { user?: AuthUser; token?: string } | AuthUser;
        const storedUser = (parsed as any)?.user ?? parsed;
        const storedToken = (parsed as any)?.token ?? null;

        if (storedToken) {
          setToken(storedToken);
          setApiAuthToken(storedToken);
        }

        if ((storedUser as AuthUser)?.email) {
          setUser(storedUser as AuthUser);
          // Solo refrescar /me si ya había algo local
          if (!loadingInitialMe) {
            loadingInitialMe = true;
            meApi()
              .then((resp: any) => {
                if (resp?.success && resp?.user) {
                  const authUser: AuthUser = {
                    email: resp.user.email ?? '',
                    role: resp.user.role ?? null,
                    roleName: resp.user.role_name ?? null,
                    nombre: resp.user.nombre ?? null,
                    id: resp.user.id ?? null,
                    department_id: resp.user.department_id ?? null,
                    department_name: resp.user.department_name ?? null,
                    employee_id: resp.user.employee_id ?? null,
                    photo_url: resp.user.photo_url ?? null,
                  };
                  persistSession(authUser, storedToken ?? null);
                }
              })
              .catch(() => {
                localStorage.removeItem(STORAGE_KEY);
                setToken(null);
                setApiAuthToken(null);
                setUser(null);
              });
          }
        }
      }
    } catch (_) { }
    return () => {
      window.removeEventListener('auth:unauthorized', onUnauthorized);
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const resp = await loginApi(email, password);
      if (!resp.success || !resp.user || !resp.token) return false;
      resetApiFailureState();
      const authUser: AuthUser = {
        email: resp.user.email ?? '',
        role: resp.user.role ?? null,
        roleName: resp.user.role_name ?? null,
        nombre: resp.user.nombre ?? null,
        id: resp.user.id ?? null,
        department_id: resp.user.department_id ?? null,
        department_name: resp.user.department_name ?? null,
        employee_id: resp.user.employee_id ?? null,
        photo_url: resp.user.photo_url ?? null,
      };
      persistSession(authUser, resp.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    // Solo llamar logout al backend si aún hay sesión local
    if (user) {
      logoutApi().catch(() => { });
    }
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setApiAuthToken(null);
    setUser(null);
    loadingInitialMe = false;
  };

  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser, token: getApiAuthToken() }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
