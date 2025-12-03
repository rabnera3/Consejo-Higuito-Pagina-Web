import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const HomePage = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/About'));
const FilosofiaPage = lazy(() => import('./pages/Filosofia'));
const SociosPage = lazy(() => import('./pages/Socios'));
const CalidadPage = lazy(() => import('./pages/Calidad'));
const UnidadAmbientePage = lazy(() => import('./pages/UnidadAmbiente'));
const UnidadOrdenamientoPage = lazy(() => import('./pages/UnidadOrdenamiento'));
const UnidadFortalecimientoPage = lazy(() => import('./pages/UnidadFortalecimiento'));
const UnidadDesarrolloEconomicoPage = lazy(() => import('./pages/UnidadDesarrolloEconomico'));
const UnidadInfraestructuraPage = lazy(() => import('./pages/UnidadInfraestructura'));
const UnidadPlanificacionPage = lazy(() => import('./pages/UnidadPlanificacion'));
const UnidadSANPage = lazy(() => import('./pages/UnidadSAN'));
const LineasServicioPage = lazy(() => import('./pages/LineasServicio'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogPostPage = lazy(() => import('./pages/BlogPost'));
const ContactoPage = lazy(() => import('./pages/Contacto'));
const PortalLayout = lazy(() => import('./pages/Portal'));
const PortalDashboardPage = lazy(() => import('./pages/portal/Dashboard'));
const PortalDirectoryPage = lazy(() => import('./pages/portal/Directory'));
const PortalLoginPage = lazy(() => import('./pages/portal/Login'));
const PortalAdminEmployeesPage = lazy(() => import('./pages/portal/AdminEmployees'));
const PortalManagerPanelPage = lazy(() => import('./pages/portal/ManagerPanel'));
const PortalChiefPanelPage = lazy(() => import('./pages/portal/ChiefPanel'));
const PortalTechnicalPanelPage = lazy(() => import('./pages/portal/TechnicalPanel'));
const PortalEmployeePanelPage = lazy(() => import('./pages/portal/EmployeePanel'));
const PlanificacionPage = lazy(() => import('./pages/portal/Planificacion'));
const SolicitudVacacionesPage = lazy(() => import('./pages/portal/SolicitudVacaciones'));
const ActualizarDatosPage = lazy(() => import('./pages/portal/ActualizarDatos'));
const FlujoAprobacionesPage = lazy(() => import('./pages/portal/FlujoAprobaciones'));
const UnidadesPage = lazy(() => import('./pages/portal/Unidades'));
const BlogNuevoPage = lazy(() => import('./pages/portal/BlogNuevo'));
const BlogManagerPage = lazy(() => import('./pages/BlogManager'));
const VisitReportsPage = lazy(() => import('./pages/portal/VisitReports'));
const NewVisitReportPage = lazy(() => import('./pages/portal/NewVisitReport'));
const EditVisitReportPage = lazy(() => import('./pages/portal/EditVisitReport'));
const FieldLogsPage = lazy(() => import('./pages/portal/FieldLogs'));
const NewFieldLogPage = lazy(() => import('./pages/portal/NewFieldLog'));
const RequestsPage = lazy(() => import('./pages/portal/Requests'));
const NewRequestPage = lazy(() => import('./pages/portal/NewRequest'));
const PendingBlogsPage = lazy(() => import('./pages/portal/PendingBlogs'));

export default function App() {
  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith('/portal');
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-white">
      {!isPortalRoute && !isLoginRoute && <Navbar />}
      <main>
        <ScrollToTop />
        <Suspense fallback={<div className="py-10 text-center text-gray-600">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<AboutPage />} /> 
            <Route path="/nosotros/filosofia" element={<FilosofiaPage />} />
            <Route path="/nosotros/socios" element={<SociosPage />} />
            <Route path="/nosotros/calidad" element={<CalidadPage />} />
            <Route path="/unidades/ambiente" element={<UnidadAmbientePage />} />
            <Route path="/unidades/ordenamiento" element={<UnidadOrdenamientoPage />} />
            <Route path="/unidades/fortalecimiento" element={<UnidadFortalecimientoPage />} />
            <Route path="/unidades/desarrollo-economico" element={<UnidadDesarrolloEconomicoPage />} />
            <Route path="/unidades/infraestructura" element={<UnidadInfraestructuraPage />} />
            <Route path="/unidades/planificacion" element={<UnidadPlanificacionPage />} />
            <Route path="/unidades/san" element={<UnidadSANPage />} />
            <Route path="/lineas-servicio" element={<LineasServicioPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/login" element={<PortalLoginPage />} />
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PortalDashboardPage />} />
              <Route path="directorio" element={<PortalDirectoryPage />} />
              <Route path="admin" element={<PortalAdminEmployeesPage />} />
              <Route path="gerencia" element={<PortalManagerPanelPage />} />
              <Route path="jefatura" element={<PortalChiefPanelPage />} />
              <Route path="tecnico" element={<PortalTechnicalPanelPage />} />
              <Route path="empleado" element={<PortalEmployeePanelPage />} />
              <Route path="planificacion" element={<PlanificacionPage />} />
              <Route path="solicitud-vacaciones" element={<SolicitudVacacionesPage />} />
              <Route path="actualizar-datos" element={<ActualizarDatosPage />} />
              <Route path="flujo-aprobaciones" element={<FlujoAprobacionesPage />} />
              <Route path="unidades" element={<UnidadesPage />} />
              <Route path="blog-nuevo" element={<BlogNuevoPage />} />
              <Route path="blog-manager" element={<BlogManagerPage />} />
              <Route path="reportes-visita" element={<VisitReportsPage />} />
              <Route path="reportes-visita/nuevo" element={<NewVisitReportPage />} />
              <Route path="reportes-visita/editar/:id" element={<EditVisitReportPage />} />
              <Route path="bitacora-campo" element={<FieldLogsPage />} />
              <Route path="bitacora-campo/nuevo" element={<NewFieldLogPage />} />
              <Route path="solicitudes" element={<RequestsPage />} />
              <Route path="solicitudes/nueva" element={<NewRequestPage />} />
              <Route path="blog-pendientes" element={<PendingBlogsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!isPortalRoute && !isLoginRoute && (
        <>
          <ContactSection />
          <Footer />
        </>
      )}
    </div>
  );
}
