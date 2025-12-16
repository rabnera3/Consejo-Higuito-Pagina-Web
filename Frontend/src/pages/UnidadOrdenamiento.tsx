import { useMemo, useState } from 'react';
import { Map, Target, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';
import { ImageCarousel } from '../components/ImageCarousel';
import { ImageModal } from '../components/ImageModal';

import ord13 from '../img/unidades/ordenamiento/uni_orde_terr_13_1.avif';
import ord15 from '../img/unidades/ordenamiento/uni_orde_terr_15_1.avif';
import ord17 from '../img/unidades/ordenamiento/uni_orde_terr_17.avif';
import ord22 from '../img/unidades/ordenamiento/uni_orde_terr_22_1.avif';
import ord23 from '../img/unidades/ordenamiento/uni_orde_terr_23_1.avif';
import ord24 from '../img/unidades/ordenamiento/uni_orde_terr_24_1.avif';
import ord27 from '../img/unidades/ordenamiento/uni_orde_terr_27_1.avif';
import ord28 from '../img/unidades/ordenamiento/uni_orde_terr_28_1.avif';
import ord30 from '../img/unidades/ordenamiento/uni_orde_terr_30_1.avif';

const galeriaBase = [
  { src: ord13, alt: 'Personal de catastro realizando levantamiento de información de campo, Trinidad Copán' },
  { src: ord22, alt: 'Trabajo de campo en ordenamiento territorial y catastro municipal' },
  { src: ord17, alt: 'Análisis técnico de uso de suelo en territorio' },
  { src: ord28, alt: 'Equipo técnico en sesión de trabajo de ordenamiento territorial' },
  { src: ord24, alt: 'Taller participativo con comunidades sobre ordenamiento' },
  { src: ord23, alt: 'Socialización de planes de ordenamiento territorial' },
  { src: ord15, alt: 'Coordinación técnica con autoridades locales' },
  { src: ord30, alt: 'Presentación de resultados de ordenamiento a autoridades' },
  { src: ord27, alt: 'Actualización de información catastral municipal' },
];

const responsabilidades = [
  'Desarrollar presupuestos para el primer “levantamiento catastral” (y sus actualizaciones).',
  'Brindar asistencia técnica en planificación, formulación, gestión y seguimiento del levantamiento, en mantenimiento catastral y estudio de valores para conformación de catálogo, tanto en zonas urbanas como rurales.',
  'Aportar métodos y formatos para levantamiento catastral, y brindar asistencia técnica para que los municipios realicen el ingreso de datos en el sistema de procesamiento de catastro de los municipios que luego consolide la CIH.',
  'Asistencia técnica al jefe de catastro sobre dominios plenos, permisos de construcción, constancias catastrales y uso de software para elaboración de planos y herramientas.',
  'Proponer iniciativas de mejora para los servicios que brinda y a los proyectos que sirve.',
  'Procesar y almacenar la información relevante y documentación de acuerdo con las políticas y/o manuales de manejo de información.',
];

export default function UnidadOrdenamientoPage() {
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
      <div className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-green-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unidad de Ordenamiento Territorial
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
            onClick={() => setSelectedImage(ord24)}
          >
            <img
              src={ord24}
              alt="Cabildo abierto Talgua Lempira para socializar valores catastrales 2019-2024"
              className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>

          <motion.div 
            variants={itemVariant} 
            className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => setSelectedImage(ord13)}
          >
            <img
              src={ord13}
              alt="Levantamiento de información de campo en Trinidad Copán"
              className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        </Stagger>

        {/* Descripción de la unidad */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-green-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-green-600 text-white shadow-lg">
              <Map className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Descripción de la unidad</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Contribuir con los municipios miembros en la aplicación de la ley y las normas específicas existentes en materia de ordenamiento territorial y apoyar los procesos de organización para potenciar el uso óptimo de los recursos disponibles.
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
                Brindar servicios de Asistencia técnica a los municipios miembros sobre gestión, organización y mejora de procesos catastrales con alta relación calidad/costo.
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

        {/* Galería de imágenes con Carousel */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-teal-600 text-white shadow-lg">
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
