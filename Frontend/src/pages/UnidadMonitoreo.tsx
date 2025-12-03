import { BarChart3, Target, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

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

const responsabilidades = [
  'Medidos los niveles de cumplimiento de las municipalidades, mancomunidad e instituciones públicas y privadas en la implementación de las políticas, objetivos, metodologías, estrategias, planes operativos y presupuestos y los indicadores de calidad del Servicio del resto de las Unidades del CIH.',
  'Elaborados los instrumentos para el levantamiento de la información de campo con base a los indicadores de cumplimiento indicados en poas anuales y/o cada convenio o proyecto.',
  'Levantada, procesada, analizada la información y generados los indicadores de cumplimiento en seguimiento del Consejo I. Higuito.',
  'Elaborados los informes mensuales, trimestrales, semestrales, anuales, dando a conocer los avances y logros en función de los indicadores establecidos en el CIH.',
  'Proponer iniciativas de mejora para los servicios que brinda y a los proyectos que sirve',
  'Procesar y almacenar la información relevante y documentación de acuerdo con las políticas y/o manuales de manejo de información.',
];

const funciones = [
  'Implementación del sistema de información de la institución, herramientas y metodologías para la recolección de información.',
  'Contribuir con los líderes de componente de las unidades del CIH al uso de herramientas de monitoreo y seguimiento y la recolección de datos.',
  'Asegurar la recolección y consolidación de datos e información estadística con criterios de calidad de información como insumo para la elaboración de informes mensuales, trimestrales, semestrales y anuales sobre los avances alcanzados en función del cumplimiento de objetivos, políticas, metodologías, estrategias, procesos y actividades desarrolladas por el CIH.',
  'Dar seguimiento al cumplimiento de las actividades enmarcadas en el Plan Operativo y el Presupuesto Anual del CIH, estableciendo las herramientas de control o de medición necesarios.',
  'Análisis y Gestión de información, para la proyección de necesidades y requerimientos de las unidades operativas del Consejo I. Higuito en relación a los servicios de formulación de proyectos, y verificar que estén alineadas a los Planes de Desarrollo Municipal y plan estratégico institucional (PEI) del Consejo I. Higuito. (CIH)',
];

export default function UnidadMonitoreoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-orange-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unidad de Monitoreo y Seguimiento
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Consejo Intermunicipal Higuito (CIH)
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">
        
        {/* Imágenes destacadas */}
        <Stagger className="grid md:grid-cols-2 gap-8">
          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
              alt="Validación en campo de información" 
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Validación en campo de la información recolectada por medio de las plataformas de monitoreo y seguimiento
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2340&auto=format&fit=crop" 
              alt="Capacitación al personal" 
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Capacitación al personal municipal y mancomunado en la implementación de nuevas herramientas de control
              </p>
            </div>
          </motion.div>
        </Stagger>

        {/* Misión del cargo */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-orange-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-orange-600 text-white shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misión del cargo</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Implementar herramientas de monitoreo, seguimiento y evaluación (incluyendo la medición de indicadores de resultados y productos) que permita el seguimiento y la evaluación periódica de los avances logrados Consejo I. Higuito.
              </p>
            </div>
          </motion.div>

          {/* Funciones */}
          <motion.div variants={itemVariant} className="border-l-4 border-amber-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-amber-600 text-white shadow-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Funciones</h2>
              <ul className="space-y-3">
                {funciones.map((funcion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{funcion}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Stagger>

        {/* Responsabilidades */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-orange-600 text-white shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Responsabilidades</h2>
            </div>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 gap-6">
            {responsabilidades.map((responsabilidad, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-1.5 rounded-full bg-orange-600 flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">{responsabilidad}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>

        {/* Galería de imágenes */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-amber-600 text-white shadow-lg">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Galería de imágenes</h2>
            </div>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop" 
                alt="Análisis de datos" 
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2340&auto=format&fit=crop" 
                alt="Trabajo en equipo" 
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </Stagger>
        </div>

      </div>
    </div>
  );
}
