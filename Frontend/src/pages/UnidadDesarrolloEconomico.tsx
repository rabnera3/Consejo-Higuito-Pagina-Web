import { TrendingUp, Target, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
  'Apoyar la formulación de los proyectos vinculados a desarrollo económico local y regional',
  'Gestionar y dar seguimiento a los proyectos de desarrollo económico local y regional en coordinación con municipios y otras organizaciones económicas y sociales (ej.: PNAE; SAN; Activo).',
  'Brindar asistencia técnica sobre microcréditos a Cajas de Ahorro y sobre micro emprendimientos a MiPymes, estructuras comunitarias, OMM (oficina municipal de la mujer).',
  'Promover, gestionar y desarrollar la formación de una cultura micro empresarial en la población.',
  'Detectar analizar, estudiar, facilitar y promover el aprovechamiento de las potencialidades económicas y sociales existentes en la región.',
  'Impulsar y facilitar procesos de coordinación interinstitucional orientados al desarrollo empresarial.',
  'Liderar mesas de conversación para formular la Agenda de Desarrollo Económico Local alineada a los PDMs (Competencia a desarrollar).',
  'Promover procesos productivos de calidad y generar valor agregado a los productos en industria agraria (Competencia a desarrollar)',
  'Proponer iniciativas de mejora para los servicios que brinda y a los proyectos que sirve. Procesar y almacenar la información relevante y documentación de acuerdo con las políticas y/o manuales de manejo de información.',
];

export default function UnidadDesarrolloEconomicoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-green-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unidad de Desarrollo Económico
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
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=600&fit=crop"
              alt="Vinculación del sector productivo a las compras locales"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Vinculación del sector productivo a las compras locales.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=800&h=600&fit=crop"
              alt="Fortalecimiento de capacidades a productores para PNAE"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Fortalecimiento de capacidades a productores, para la vinculación al Programa Nacional de Alimentación Escolar.
              </p>
            </div>
          </motion.div>
        </Stagger>

        {/* Descripción de la unidad */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-amber-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-amber-600 text-white shadow-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Descripción de la unidad</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Elevar el crecimiento económico y las condiciones de vida de la población bajo un uso racional y sostenible de los recursos naturales existentes.
              </p>
            </div>
          </motion.div>

          {/* Misión del cargo */}
          <motion.div variants={itemVariant} className="border-l-4 border-green-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-green-600 text-white shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misión del cargo</h2>
              <ul className="space-y-3 text-gray-700 leading-relaxed text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1.5">•</span>
                  <span>Brindar asistencia técnica y formación sobre desarrollo económico local y regional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1.5">•</span>
                  <span>Formular, desarrollar, ejecutar y supervisar proyectos de desarrollo económico local e inter municipal con alta relación calidad/costo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1.5">•</span>
                  <span>Liderar, coordinar y supervisar el rol de su equipo de colaboradores</span>
                </li>
              </ul>
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
                <div className="p-1.5 rounded-full bg-green-600 flex-shrink-0 mt-1">
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
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop"
                alt="Capacitación desarrollo económico"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                alt="Proyectos desarrollo local"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </Stagger>
        </div>
      </div>
    </div>
  );
}
