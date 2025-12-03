import { Building2, Target, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
  'Liderar la ejecución de los estudios de campo, topográficos, de ingeniería y de financiamiento, de proyectos de infraestructura social.',
  'Apoyar al área de Formulación de Proyectos durante la etapa respectiva, en los proyectos de infraestructura social, brindando asistencia en la presupuestación, en el diseño y en la producción de documentación técnica.',
  'Mantener y gestionar una cartera de proyectos de infraestructura social con una metodología de evaluación y priorización basada en múltiples criterios.',
  'Dar seguimiento supervisión y liquidar los proyectos de infraestructura social.',
  'Asegurar el cumplimiento de los estándares de calidad en la gestión integral de los proyectos que maneja la Unidad (Competencias a desarrollar).',
  'Analizar la logística y la infraestructura disponible de la CIH para asegurar el diseño de un modelo eficiente de operaciones y visitas en campo para todas las unidades de la CIH (Competencias a desarrollar).',
  'Comunicar y programar la prestación de servicios en campo a las partes interesadas.',
  'Procesar y almacenar la información relevante y documentación de acuerdo con las políticas y/o manuales de manejo de información.',
];

export default function UnidadInfraestructuraPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unidad de Infraestructura Social
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
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop"
              alt="Tanque de agua en Aguacaliente"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Trabajos constructivos en tanque de almacenamiento de agua</span> para distribución a la comunidad. Aguacaliente, Veracruz, Copán
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop"
              alt="Alcaldía de Concepción"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Trabajos constructivos en segundo nivel</span> de alcaldía de Concepción Copán.
              </p>
            </div>
          </motion.div>
        </Stagger>

        {/* Descripción de la unidad */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-blue-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-blue-600 text-white shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Descripción de la unidad</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Contribuir en el mejoramiento de la calidad de vida.
              </p>
            </div>
          </motion.div>

          {/* Misión del cargo */}
          <motion.div variants={itemVariant} className="border-l-4 border-cyan-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-cyan-600 text-white shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misión del cargo</h2>
              <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                <p>Prestar a los municipios asociados servicios profesionales y asistencia técnica en gestión integral de proyectos de infraestructura social con alta relación calidad/costo y acorde a los lineamientos y prioridades del Plan Estratégico del CIH.</p>
                <p>Liderar, orientar y monitorear el trabajo del equipo de profesionales y técnico asignado al área.</p>
              </div>
            </div>
          </motion.div>
        </Stagger>

        {/* Responsabilidades */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-teal-600 text-white shadow-lg">
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
                <div className="p-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-1">
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
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop"
                alt="Proyecto de infraestructura social 1"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&h=600&fit=crop"
                alt="Proyecto de infraestructura social 2"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </Stagger>
        </div>

      </div>
    </div>
  );
}

