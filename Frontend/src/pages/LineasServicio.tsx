import { GraduationCap, Users, FileText, TrendingUp, Database, Megaphone, CheckCircle2, Download, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';

const lineasServicio = [
  {
    icon: GraduationCap,
    title: 'Capacitación',
    description: 'Mejorar las competencias de los diferentes actores del territorio del Consejo Higuito para realizar de manera más adecuada su trabajo, de acuerdo con el marco legal e institucional de los gobiernos locales.',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Asistencia técnica para el desarrollo de capacidades',
    description: 'Generar capacidades para la aplicación de técnicas y herramientas metodológicas de acuerdo con las necesidades, condiciones y situaciones específicas de cada municipio y dentro del marco de los Planes de Desarrollo Municipal.',
    color: 'green',
  },
  {
    icon: FileText,
    title: 'Acompañamiento en instrumentos de planificación y normativa',
    description: 'Facilitar la elaboración de instrumentos y normativas para el desarrollo de proceso de planificación a nivel territorial de los gobiernos locales.',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    title: 'Formulación de estudios',
    description: 'Brindar información técnica especializada para la identificación, prevención, control o mitigación de la problemática municipal, o para el seguimiento de los planes de intervención correspondiente.',
    color: 'orange',
  },
  {
    icon: Database,
    title: 'Gestión de información territorial',
    description: 'Brindar información y conocimiento decisional para la planificación y evaluación de la gestión y resultados de los gobiernos locales, basada en la recolección, tratamiento y análisis de los datos disponibles en fuentes relevantes y competentes.',
    color: 'cyan',
  },
  {
    icon: Megaphone,
    title: 'Promoción, socialización y sensibilización',
    description: 'Mejorar la participación consciente de la población en consonancia con el gobierno local que contribuya a fortalecer la gobernabilidad y el tejido social e incrementar la calidad de vida de las comunidades.',
    color: 'pink',
  },
  {
    icon: Briefcase,
    title: 'Consultoría',
    description: 'Asesoría y acompañamiento especializado para gobiernos locales y socios en diagnóstico, diseño e implementación de proyectos, fortalecimiento institucional y mejora de procesos.',
    color: 'blue',
  },
];

const formularios = [
  {
    title: 'Catálogo',
    subtitle: 'de servicios',
    color: 'green',
    icon: FileText,
  },
  {
    title: 'Solicitud',
    subtitle: 'de servicios',
    color: 'orange',
    icon: FileText,
  },
  {
    title: 'Encuesta',
    subtitle: 'de satisfacción',
    color: 'orange',
    icon: FileText,
  },
  {
    title: 'Quejas',
    subtitle: 'y reclamos',
    color: 'blue',
    icon: FileText,
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-600',
    border: 'border-blue-600/40',
    text: 'text-blue-600',
    bgLight: 'bg-blue-50',
    hover: 'hover:border-blue-300',
  },
  green: {
    bg: 'bg-green-600',
    border: 'border-green-600/40',
    text: 'text-green-600',
    bgLight: 'bg-green-50',
    hover: 'hover:border-green-300',
  },
  purple: {
    bg: 'bg-purple-600',
    border: 'border-purple-600/40',
    text: 'text-purple-600',
    bgLight: 'bg-purple-50',
    hover: 'hover:border-purple-300',
  },
  orange: {
    bg: 'bg-orange-600',
    border: 'border-orange-600/40',
    text: 'text-orange-600',
    bgLight: 'bg-orange-50',
    hover: 'hover:border-orange-300',
  },
  cyan: {
    bg: 'bg-cyan-600',
    border: 'border-cyan-600/40',
    text: 'text-cyan-600',
    bgLight: 'bg-cyan-50',
    hover: 'hover:border-cyan-300',
  },
  pink: {
    bg: 'bg-pink-600',
    border: 'border-pink-600/40',
    text: 'text-pink-600',
    bgLight: 'bg-pink-50',
    hover: 'hover:border-pink-300',
  },
};

export default function LineasServicioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-green-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Líneas de Servicio
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Consejo Intermunicipal Higuito (CIH)
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">
        
        {/* Líneas de servicio */}
        <div>
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Nuestros Servicios
            </h2>
          </FadeIn>

          <Stagger className="space-y-12">
            {lineasServicio.map((linea, index) => {
              const Icon = linea.icon;
              const colors = colorClasses[linea.color as keyof typeof colorClasses];
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariant}
                  className={`border-l-4 ${colors.border} pl-6 md:pl-10 relative ${colors.hover} transition-colors`}
                >
                  <div className={`absolute -left-6 top-0 p-3 rounded-xl ${colors.bg} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
                      {linea.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {linea.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </Stagger>
        </div>

        {/* Formularios de solicitudes */}
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 md:p-12">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-6">
                <Download className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Formularios de solicitudes
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Ponemos a su disposición los siguientes formularios para que puedan ser descargados y enviar sus solicitudes al correo{' '}
                <a href="mailto:info@consejohiguito.hn" className="text-green-600 hover:text-green-700 font-semibold">
                  info@consejohiguito.hn
                </a>
              </p>
            </div>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formularios.map((formulario, index) => {
              const Icon = formulario.icon;
              const colors = colorClasses[formulario.color as keyof typeof colorClasses];
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariant}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-gray-200"
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bgLight} rounded-xl mb-4`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {formulario.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {formulario.subtitle}
                    </p>
                    <button
                      className={`w-full ${colors.bg} text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </Stagger>
        </div>

        {/* Nota informativa */}
        <FadeIn>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">Importante:</span> Una vez completados los formularios, envíelos al correo electrónico{' '}
                <a href="mailto:info@consejohiguito.hn" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  info@consejohiguito.hn
                </a>
                {' '}para que podamos procesar su solicitud de manera eficiente.
              </p>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
