import { Leaf, Target, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
  'Asegurar la definición de un alcance de los servicios sobre Recursos Naturales y Ambiente que sea diferencial y esté enfocado en la satisfacción de necesidades que resulten de los Planes de Desarrollo Municipales y esté alineada a las competencias del área.',
  'Brindar asistencia técnica sobre legislación y manejo de los recursos naturales y ambiente a Unidades Municipales Ambientales (UMA);',
  'Manejo ambientalmente seguro de proyectos, emprendimientos y actividad económica y social que se impulse en el territorio y sobre su impacto ambiental',
  'Manejo de obras de mitigación y gestión de áreas protegidas.',
  'Preservación, protección y manejo adecuado de los recursos naturales',
  'Sostenibilidad ambiental, económica y social de los recursos naturales de la Subcuenca',
  'Brindar asistencia técnica para operativizar capítulo ambiental de los planes de arbitrios',
  'Brindar educación ambiental a la población en general, foros, municipios y escuelas',
  'Brindar asistencia técnica en la formulación de planes de acción ambiental intermunicipal (Competencias a desarrollar)',
  'Proponer iniciativas de mejora para los servicios que brinda y a los proyectos que sirve',
  'Procesar y almacenar la información relevante y documentación de acuerdo con las políticas y/o manuales de manejo de información.',
];

export default function UnidadAmbientePage() {
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
              Unidad de Recursos Naturales y Ambiente
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
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
              alt="Levantamiento de información en microcuenca La Cumbre"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Levantamiento de información en microcuenca que abastece comunidad de La Cumbre con participación de beneficiarios y directivos de la junta que administra el sistema de agua potable.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=600&fit=crop"
              alt="Inspección en campo San Agustín"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Inspección en campo para darle seguimiento a denuncia presentada en el municipio de San Agustín en conjunto con Municipalidad, CIH, Fiscalía Especial de Medio Ambiente, Fuerzas Armadas e ICF.
              </p>
            </div>
          </motion.div>
        </Stagger>

        {/* Descripción de la unidad */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-green-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-green-600 text-white shadow-lg">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Descripción de la unidad</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Gestión ambiental o gestión del medio ambiente es el conjunto de diligencias conducentes al manejo integral del sistema ambiental con enfoque de desarrollo sostenible y las instituciones responsables de ello. La gestión ambiental responde al «cómo hay que hacer» para conseguir lo planteado por el desarrollo sostenible, o sea, cómo conseguir un equilibrio adecuado para el desarrollo económico, crecimiento de la población, uso racional de los recursos y protección y conservación del ambiente.
              </p>
            </div>
          </motion.div>

          {/* Misión del cargo */}
          <motion.div variants={itemVariant} className="border-l-4 border-blue-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-blue-600 text-white shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misión del cargo</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Brindar asistencia técnica a los municipios asociados en materias vinculadas de recursos naturales y ambiente con alta relación calidad/costo
              </p>
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
                src="https://images.unsplash.com/photo-1440581572325-0bea30075d9d?w=800&h=600&fit=crop"
                alt="Trabajo en campo - Recursos Naturales"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=600&fit=crop"
                alt="Gestión de recursos naturales"
                className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </Stagger>
        </div>

      </div>
    </div>
  );
}
