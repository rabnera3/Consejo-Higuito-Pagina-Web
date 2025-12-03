import { Target, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
  'Brindar asistencia técnica y capacitación a los municipios y comunidades en procesos de planificación participativa a nivel municipal, con metodología Focal o las que la reemplacen o complementen en el futuro.',
  'Coordinar el proceso de formulación del Plan Estratégico institucional (PEI) de la CIH y consolidarlo, cada dos años, asegurando el cumplimiento de su cronograma y velando por su alineamiento a las necesidades que reflejan los Planes de Desarrollo Municipal (PDM), Planes de Inversión Municipal Plurianual (PIMP) y Anual (PIMA).',
  'Evaluar iniciativas y proponer lineamientos estratégicos relacionadas con los servicios brindados por la CIH.',
  'Monitorear el cumplimiento y desempeño del Plan Estratégico, y mantener informado al Comité Estratégico.',
  'Asegurar la confección y el mantenimiento actualizado de un panel de indicadores claves, de naturaleza financiera y operativa, que podrá evolucionar a un Balanced Score Card según la complejidad creciente de la institución.',
  'Supervisar el cumplimiento de la misión y responsabilidades del área de Catastro y de Recursos Naturales y Ambiente, mientras se desempeñen como parte de la Unidad de Planificación Territorial.',
  'Integrar cuando fuere, necesario o conveniente, las competencias del área de catastro y de Recursos Naturales y Ambiente, a los procesos de planificación municipal y territorial (regional).',
  'Supervisar el cumplimiento de la misión y responsabilidades del área de Formulación de proyectos.',
  'Definir las políticas de gestión de la información, bases de datos documentales y del conocimiento que deberán cumplir las unidades operativas y de soporte, y velar por su cumplimiento en toda la empresa.',
  'Desarrollar servicios para que los municipios socios obtengan información crítica y comparativa de las bases de datos disponibles en el CIH, particularmente de las "líneas de base" (Competencias a desarrollar).',
  'Desarrollar competencias en la CIH para brindar servicios de Prospectiva Estratégica Territorial a los municipios socios desde una perspectiva regional (Competencias a desarrollar).',
];

export default function UnidadPlanificacionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-purple-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unidad de Planificación Territorial
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
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
              alt="Asesoría en Concepción"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Asesor de Fortalecimiento Institucional de SEAN-FAO</span> brinda inducción a municipio de Concepción, Copán para la vinculación de los PDM y su inversión con la Seguridad Alimentaria y Nutricional.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
              alt="Graduación CUROC"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Alumnos de CUROC reciben su diploma</span> de participación en inducción en metodología de Fortalecimiento de Capacidades Locales (FOCAL) impartido por el Consejo Higuito.
              </p>
            </div>
          </motion.div>
        </Stagger>

        {/* Misión del cargo */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-purple-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-purple-600 text-white shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misión del cargo</h2>
              <div className="text-gray-700 leading-relaxed text-lg space-y-3">
                <p>Brindar asistencia técnica a los municipios miembros y sus comunidades en la formulación de sus planes estratégicos intermunicipales, municipales y comunales.</p>
                <p>Dar impulso, consolidar y monitorear el desempeño del proceso de Planificación Estratégica Institucional de la CIH.</p>
                <p>Liderar, coordinar y supervisar el rol de los responsables de Recursos Naturales y Ambiente; Catastro y Formulación de Proyectos.</p>
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
                <div className="p-1.5 rounded-full bg-purple-600 flex-shrink-0 mt-1">
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
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                alt="Planificación estratégica 1"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
                alt="Planificación estratégica 2"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </Stagger>
        </div>

      </div>
    </div>
  );
}

