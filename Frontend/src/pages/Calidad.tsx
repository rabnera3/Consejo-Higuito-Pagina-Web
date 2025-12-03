import { CheckCircle2, Target, Users, TrendingUp, Lightbulb, FileCheck, DollarSign, Cpu, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { ProcessMap } from '../components/ProcessMap';

// Animation helpers
const FadeIn = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.div>
);

const Stagger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      visible: { transition: { staggerChildren: 0.1 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const beneficios = [
  {
    icon: CheckCircle2,
    texto: 'Capacidad para proporcionar servicios que satisfaga las demandas y necesidades del cliente.',
  },
  {
    icon: TrendingUp,
    texto: 'Facilita oportunidades de aumentar satisfacción del cliente.',
  },
  {
    icon: Target,
    texto: 'Puede abordar riesgos y oportunidades asociadas con el contextos y objetivos.',
  },
];

const principios = [
  'Enfoque al cliente',
  'Liderazgo',
  'Compromiso de las personas',
  'Enfoque al proceso',
  'Mejora',
  'Gestión de relaciones',
];

const objetivos = [
  { icon: Users, texto: 'Mejorar la cultura organizacional', color: 'green' },
  { icon: Target, texto: 'Mejorar la gestión basada en riesgos y resultados', color: 'blue' },
  { icon: Award, texto: 'Mejorar la coordinación interinstitucional', color: 'teal' },
  { icon: TrendingUp, texto: 'Mejorar las comunicaciones internas y externas', color: 'amber' },
  { icon: FileCheck, texto: 'Mejorar la planificación de los servicios', color: 'purple' },
  { icon: DollarSign, texto: 'Mejorar la sostenibilidad financiera institucional', color: 'green' },
  { icon: Cpu, texto: 'Mejorar la tecnología y la logística', color: 'blue' },
  { icon: Lightbulb, texto: 'Satisfacer la demanda de servicios', color: 'teal' },
];

export default function CalidadPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Sistema de Gestión de la Calidad
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Consejo Intermunicipal Higuito (CIH)
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Contenido principal */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-24"
        role="main"
        aria-label="Contenido del Sistema de Gestión de la Calidad"
      >
        {/* 1. Introducción y Alcance */}
        <section
          id="introduccion-alcance"
          aria-labelledby="introduccion-alcance-title"
          className="space-y-10"
        >
          <FadeIn>
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Introducción
              </p>
              <h2
                id="introduccion-alcance-title"
                className="text-3xl md:text-4xl font-bold text-gray-900 mt-2"
              >
                Introducción y alcance del sistema
              </h2>
            </div>
          </FadeIn>
          <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-green-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-green-600 text-white shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div className="ml-6 space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                El Sistema de Gestión de Calidad del Consejo Intermunicipal Higuito y su aplicación, tiene el objetivo de lograr y mejorar continuamente la calidad de los servicios prestados, conforme a los requisitos establecidos en la Norma Internacional ISO 9001:2015.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                La Junta Directiva y la Gerencia General lideran y apoyan todas las acciones dirigidas al mantenimiento y mejora continua del Sistema de Gestión de Calidad y están atentas a proporcionar los recursos necesarios para lograr este propósito y generando valor a los grupos de interés que incidan en el desempeño institucional.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="border-l-4 border-blue-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-blue-600 text-white shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Alcance del Sistema</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                El alcance del Sistema de Gestión de Calidad del Consejo Intermunicipal Higuito, incluye los servicios técnicos ofrecidos a los socios de la Mancomunidad a través de sus Unidades Operativas: Capacitación, asistencia técnica para el desarrollo de capacidades, acompañamiento en instrumentos de planificación y normativa, formulación de estudios, gestión de información territorial promoción, socialización y sensibilización y gestión de programas – proyectos.
              </p>
            </div>
          </motion.div>
          </Stagger>
        </section>

        {/* 2. Beneficios */}
        <section id="beneficios" aria-labelledby="beneficios-title" className="scroll-mt-16">
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-amber-600 text-white shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 id="beneficios-title" className="text-3xl md:text-4xl font-bold text-gray-900">
                Beneficios
              </h2>
            </div>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-8">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-100 text-green-600 flex-shrink-0">
                    <beneficio.icon className="w-6 h-6" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{beneficio.texto}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* 3. Principios del Sistema de Gestión */}
        <section
          id="principios"
          aria-labelledby="principios-title"
          className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 md:p-12"
        >
          <FadeIn>
            <h2
              id="principios-title"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center"
            >
              Principios del Sistema de Gestión de Calidad
            </h2>
          </FadeIn>
          
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {principios.map((principio, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-200 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{principio}</span>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* 4. Objetivos de Calidad */}
        <section id="objetivos" aria-labelledby="objetivos-title">
          <FadeIn>
            <h2 id="objetivos-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Nuestros objetivos de calidad
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Comprometidos con la excelencia y la mejora continua
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {objetivos.map((objetivo, index) => {
              const colorClasses = {
                green: 'bg-green-600',
                blue: 'bg-blue-600',
                teal: 'bg-teal-600',
                amber: 'bg-amber-600',
                purple: 'bg-purple-600',
              };

              return (
                <motion.div
                  key={index}
                  variants={itemVariant}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-4 rounded-2xl ${
                        colorClasses[objetivo.color as keyof typeof colorClasses]
                      } text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <objetivo.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium leading-snug px-2">
                    {objetivo.texto}
                  </p>
                </motion.div>
              );
            })}
          </Stagger>
        </section>

        {/* 5. Mapa de Procesos */}
        <section id="mapa-procesos" aria-labelledby="mapa-procesos-title">
          <Stagger className="space-y-8">
            <motion.div variants={itemVariant}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-teal-600 text-white shadow-lg">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h2
                    id="mapa-procesos-title"
                    className="text-3xl md:text-4xl font-bold text-gray-900"
                  >
                    Mapa de procesos
                  </h2>
                </div>
              </div>
              <ProcessMap />
            </motion.div>
          </Stagger>
        </section>

        {/* 6. Política de Calidad */}
        <section id="politica-calidad" aria-labelledby="politica-calidad-title">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <Award className="w-8 h-8" />
              </div>
              <h2 id="politica-calidad-title" className="text-3xl md:text-4xl font-bold">
                Política de calidad
              </h2>
            </div>

            <div className="space-y-6 text-white/95 text-lg leading-relaxed">
              <p>
                Las directrices de orientación estratégica para la calidad de los servicios prestados por el Consejo Intermunicipal Higuito, asume el desafío de entregar a sus asociados una oferta de servicios atractiva y competitiva enfocada en generar mejor gobierno local y mayor impacto socio-económico-ambiental en los municipios, de acuerdo con los índices de gestión institucional y dentro del marco de referencia de los planes de desarrollo municipal.
              </p>
              <p>
                Asume el compromiso de conducir sus acciones trabajando por procesos, dentro del marco jurídico vigente, alineadas con los programas de gobierno nacional, regional y local y mejorando continuamente la gestión y resultados, con fundamento en la comunicación, la concertación, la coordinación y la integración eficaz con los grupos de valor de la mancomunidad.
              </p>
              <p className="font-semibold">
                CIH asume el liderazgo necesario para generar los beneficios esperados como mancomunidad, aplicando un sistema de gestión de calidad centrado en generar mayor impacto institucional y valor público, esencial para lograr su visión de éxito sostenible.
              </p>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
