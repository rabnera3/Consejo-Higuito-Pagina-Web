import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/portal.css';
import logo from '../../img/logo01.webp';

export default function PortalLoginPage() {
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/portal/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    setError('');
    const ok = await login(email, password);
    if (!ok) {
      setError('Credenciales inválidas o error del servidor');
      return;
    }
    navigate('/portal/dashboard', { replace: true });
  };

  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="container login-container">
      <div className="login-logo-wrap">
        <img src={logo} alt="Logo Consejo Intermunicipal Higuito" className="login-logo" />
      </div>
      <div className="login">
        <div className="head">
          <h1>Iniciar sesión</h1>

        </div>
        <div className="body">
          <form id="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="ingresa tu correo institucional"
              required
            />
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="•••••"
                required
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyDown}
                onClick={handleKeyDown}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={togglePassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="btn ghost"
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {capsLockOn && (
              <div style={{ color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠️</span> Bloq Mayús está activado
              </div>
            )}
            <div id="error" style={{ display: error ? 'block' : 'none' }}>
              {error}
            </div>
            <div className="login-actions">
              <button id="btn-login" className="btn primary" type="submit">
                Entrar
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
