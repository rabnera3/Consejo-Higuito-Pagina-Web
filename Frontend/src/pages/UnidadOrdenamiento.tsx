import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map, Target, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';

import ord13 from '../img/unidades/ordenamiento/uni_orde_terr_13_1.webp';
import ord15 from '../img/unidades/ordenamiento/uni_orde_terr_15_1.webp';
import ord17 from '../img/unidades/ordenamiento/uni_orde_terr_17.webp';
import ord22 from '../img/unidades/ordenamiento/uni_orde_terr_22_1.webp';
import ord23 from '../img/unidades/ordenamiento/uni_orde_terr_23_1.webp';
import ord24 from '../img/unidades/ordenamiento/uni_orde_terr_24_1.webp';
import ord27 from '../img/unidades/ordenamiento/uni_orde_terr_27_1.webp';
import ord28 from '../img/unidades/ordenamiento/uni_orde_terr_28_1.webp';
import ord30 from '../img/unidades/ordenamiento/uni_orde_terr_30_1.webp';

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', containScroll: 'trimSnaps', slidesToScroll: 1, dragFree: false, skipSnaps: false });
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const galeriaLocales = useMemo(() => {
    const shuffled = [...galeriaBase];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const play = () => {
      if (!isPaused) {
        emblaApi.scrollNext();
      }
      autoPlayRef.current = setTimeout(play, 4800);
    };
    autoPlayRef.current = setTimeout(play, 4800);
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [emblaApi, isPaused]);

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
          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={ord24}
              alt="Cabildo abierto Talgua Lempira para socializar valores catastrales 2019-2024"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Cabildo abierto Talgua Lempira para socializar, concertar y aprobar valores catastrales quinquenio 2019-2024.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={ord13}
              alt="Levantamiento de información de campo en Trinidad Copán"
              className="w-full h-[300px] object-cover"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                Personal de catastro realizando levantamiento de información de campo, Trinidad Copán.
              </p>
            </div>
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
            {/* Carousel Container */}
            <div className="max-w-none w-full px-4 sm:px-6 md:px-8">
              <div className="relative">
                {/* Embla Carousel */}
                <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    {galeriaLocales.map((image, index) => (
                      <div
                        key={index}
                        className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-6px)] md:flex-[0_0_calc(50%-8px)]"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg group bg-gray-100">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={scrollPrev}
                  aria-label="Diapositiva anterior"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>

                <button
                  onClick={scrollNext}
                  aria-label="Siguiente diapositiva"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>
              </div>

              {/* Controls Below Carousel */}
              <div className="flex items-center justify-between mt-6">
                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  aria-label={isPaused ? 'Reproducir' : 'Pausar'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900 font-medium"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Reproducir</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Pausar</span>
                    </>
                  )}
                </button>

                {/* Dot Indicators */}
                <div className="flex gap-2 justify-center flex-1 mx-4">
                  {galeriaLocales.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      aria-label={`Ir a diapositiva ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === selectedIndex
                          ? 'bg-teal-600 w-8'
                          : 'bg-gray-300 hover:bg-gray-400 w-2.5'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="text-sm font-medium text-gray-600">
                  {selectedIndex + 1} / {galeriaLocales.length}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
