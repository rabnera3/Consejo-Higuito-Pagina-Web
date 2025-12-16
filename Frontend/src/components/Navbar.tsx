import { Menu, X, Facebook, Instagram, Youtube, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ResponsiveImage } from './ResponsiveImage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const nosotrosLinks = [
  { to: '/nosotros', label: 'Sobre Nosotros' },
  { to: '/nosotros/filosofia', label: 'Filosofía Institucional' },
  { to: '/nosotros/socios', label: 'Nuestros Socios' },
  { to: '/nosotros/calidad', label: 'Sistema de Gestión de Calidad' },
];

const unidadLinks = [
  { to: '/unidades/ambiente', label: 'Recursos Naturales y Ambiente' },
  { to: '/unidades/ordenamiento', label: 'Ordenamiento Territorial' },
  { to: '/unidades/fortalecimiento', label: 'Fortalecimiento Institucional' },
  { to: '/unidades/desarrollo-economico', label: 'Desarrollo Económico' },
  { to: '/unidades/infraestructura', label: 'Infraestructura Social' },
  { to: '/unidades/planificacion', label: 'Planificación Territorial' },
  { to: '/unidades/san', label: 'Seguridad Alimentaria y Nutricional' },
];

const generalLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/lineas-servicio', label: 'Líneas de Servicio' },
  { to: '/blog', label: 'Blog' },
  { to: '/contacto', label: 'Contacto y Descargas' },
  { to: '/portal', label: 'Portal' },
];

// Resolve logo asset from src/img without needing a PNG module declaration
const logo = new URL('../img/logo01.avif', import.meta.url).href;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.documentElement.style.height = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.documentElement.style.height = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.documentElement.style.height = 'unset';
    };
  }, [mobileOpen]);

  const toggleMobileMenu = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMobileOpen((prev) => !prev)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-green-100 py-2' : 'bg-transparent py-4'}`}
      >
        <div className="container mx-auto px-4 transition-[padding]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" aria-label="Ir al inicio">
              <ResponsiveImage
                src={logo}
                alt="Consejo Intermunicipal Higuito"
                sizes="(max-width: 768px) 40px, 48px"
                className="h-10 w-auto md:h-12 drop-shadow-sm select-none pointer-events-none"
              />
              <span className={`hidden xl:inline font-medium transition-colors ${scrolled ? 'text-green-700 group-hover:text-green-800' : 'text-white group-hover:text-green-100 drop-shadow-md'}`}>
                Consejo Intermunicipal Higuito
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Inicio primero */}
              <Link to="/" className={`transition-colors ${scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-200 drop-shadow-sm'}`}>
                Inicio
              </Link>

              {/* Pestaña Nosotros con enlaces */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`transition-colors inline-flex items-center gap-1 ${scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-200 drop-shadow-sm'}`}>
                    Nosotros
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 opacity-70">
                      <path fillRule="evenodd" d="M12 14.5a.75.75 0 0 1-.53-.22l-4.5-4.5a.75.75 0 1 1 1.06-1.06L12 12.19l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-.53.22Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-52 bg-white shadow-lg border border-gray-200">
                  <DropdownMenuItem asChild>
                    <Link to="/nosotros">Sobre Nosotros</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/nosotros/filosofia">Filosofía Institucional</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/nosotros/socios">Nuestros Socios</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/nosotros/calidad">Sistema de Gestión de Calidad</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Pestaña Unidades */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`transition-colors inline-flex items-center gap-1 ${scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-200 drop-shadow-sm'}`}>
                    Unidades
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 opacity-70">
                      <path fillRule="evenodd" d="M12 14.5a.75.75 0 0 1-.53-.22l-4.5-4.5a.75.75 0 1 1 1.06-1.06L12 12.19l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-.53.22Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-64 bg-white shadow-lg border border-gray-200">
                  <DropdownMenuItem asChild>
                    <Link to="/unidades/ambiente">Recursos Naturales y Ambiente</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/unidades/ordenamiento">Ordenamiento Territorial</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/unidades/fortalecimiento">Fortalecimiento Institucional</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/unidades/desarrollo-economico">Desarrollo Económico</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/unidades/infraestructura">Infraestructura Social</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/unidades/planificacion">Planificación Territorial</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/unidades/san">Seguridad Alimentaria y Nutricional</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Líneas de Servicio */}
              <Link to="/lineas-servicio" className={`transition-colors ${scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-200 drop-shadow-sm'}`}>
                Líneas de Servicio
              </Link>

              {/* Blog */}
              <Link to="/blog" className={`transition-colors ${scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-200 drop-shadow-sm'}`}>
                Blog
              </Link>

              {/* Contacto y Descargas */}
              <Link to="/contacto" className={`transition-colors ${scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-200 drop-shadow-sm'}`}>
                Contacto y Descargas
              </Link>

              {/* Portal */}
              <Link
                to="/portal"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${scrolled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white/20 backdrop-blur-sm text-white border border-white/50 hover:bg-white/30'}`}
              >
                <LogIn className="h-4 w-4" />
                Portal
              </Link>

              {/* Redes sociales (desktop) */}
              <div className={`ml-2 flex items-center gap-3 pl-3 border-l ${scrolled ? 'border-gray-200' : 'border-white/30'}`}>
                <a
                  href="https://www.facebook.com/ConsejoHiguito"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className={`transition-colors ${scrolled ? 'text-gray-600 hover:text-green-700' : 'text-white hover:text-green-200'}`}
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/ConsejoHiguito"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className={`transition-colors ${scrolled ? 'text-gray-600 hover:text-green-700' : 'text-white hover:text-green-200'}`}
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@ConsejoHiguito"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className={`transition-colors ${scrolled ? 'text-gray-600 hover:text-green-700' : 'text-white hover:text-green-200'}`}
                >
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </a>
              </div>
            </div>

            {/* Mobile actions: botón portal + botón menú (visible hasta lg) */}
            <div className="lg:hidden flex items-center gap-2">
              <Link
                to="/portal"
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${scrolled ? 'border-green-600 text-green-700 hover:bg-green-50' : 'border-white/50 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20'}`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Portal</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className={`active:scale-95 transition-transform ${scrolled ? 'text-gray-700' : 'text-white hover:bg-white/10'}`}
                onClick={toggleMobileMenu}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto"
            >
              <div className="px-6 pt-6 pb-10 space-y-8">
                <div className="flex items-center justify-between">
                  <Link to="/" className="text-lg font-semibold text-green-700" onClick={() => setMobileOpen(false)}>
                    Consejo Higuito
                  </Link>
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Cerrar menú">
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <nav className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">General</p>
                    <div className="flex flex-col gap-2">
                      {generalLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="text-slate-800 font-medium"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nosotros</p>
                    <div className="flex flex-col gap-2">
                      {nosotrosLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="text-slate-800"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Unidades</p>
                    <div className="flex flex-col gap-2">
                      {unidadLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="text-slate-800"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Redes sociales</p>
                  <div className="flex gap-4 text-slate-600">
                    <a
                      href="https://www.facebook.com/ConsejoHiguito"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="hover:text-green-700"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/ConsejoHiguito"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="hover:text-green-700"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.youtube.com/@ConsejoHiguito"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="hover:text-green-700"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
