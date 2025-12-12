import { useMemo, useState } from 'react';
import { Target, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';
import { ImageCarousel } from '../components/ImageCarousel';
import { ImageModal } from '../components/ImageModal';

import plan04 from '../img/unidades/planificacion/uni_plan_terr_04_1.webp';
import plan07 from '../img/unidades/planificacion/uni_plan_terr_07_1.webp';
import plan08 from '../img/unidades/planificacion/uni_plan_terr_08_1.webp';
import plan13 from '../img/unidades/planificacion/uni_plan_terr_13.webp';
import plan14 from '../img/unidades/planificacion/uni_plan_terr_14_1.webp';
import plan15 from '../img/unidades/planificacion/uni_plan_terr_15_1.webp';
import plan16 from '../img/unidades/planificacion/uni_plan_terr_16.webp';

const galeriaBase = [
  { src: plan04, alt: 'Proyecto planificacion 04' },
  { src: plan07, alt: 'Proyecto planificacion 07' },
  { src: plan08, alt: 'Proyecto planificacion 08' },
  { src: plan13, alt: 'Proyecto planificacion 13' },
  { src: plan14, alt: 'Proyecto planificacion 14' },
  { src: plan15, alt: 'Proyecto planificacion 15' },
  { src: plan16, alt: 'Proyecto planificacion 16' },
];

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galeriaLocales = useMemo(() => {
    const shuffled = [...galeriaBase];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

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
          <motion.div
            variants={itemVariant}
            className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => setSelectedImage(plan04)}
          >
            <img
              src={plan04}
              alt="Asesoría en planificación territorial"
              className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
              loading="eager"
              decoding="async"
            />
          </motion.div>

          <motion.div
            variants={itemVariant}
            className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => setSelectedImage(plan07)}
          >
            <img
              src={plan07}
              alt="Capacitación en planificación municipal"
              className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
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

        {/* Galería de imágenes con Carousel */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-cyan-600 text-white shadow-lg">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Galería de imágenes</h2>
            </div>
          </FadeIn>

          <motion.div variants={itemVariant}>
            <ImageCarousel images={galeriaLocales} />
          </motion.div>
        </div>

      </div>

      <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}

