import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, Target, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';

import mon1 from '../img/unidades/monitoreo/gallery_unidad-monitoreo_1-400x284_1.webp';
import mon2 from '../img/unidades/monitoreo/gallery_unidad-monitoreo_2.webp';
import mon3 from '../img/unidades/monitoreo/gallery_unidad-monitoreo_3-400x284_1.webp';
import mon4 from '../img/unidades/monitoreo/gallery_unidad-monitoreo_4-400x284_1.webp';
import mon5 from '../img/unidades/monitoreo/gallery_unidad-monitoreo_5-400x284_1.webp';
import mon6 from '../img/unidades/monitoreo/gallery_unidad-monitoreo_6.webp';
import mon7 from '../img/unidades/monitoreo/gallery_unidad-monitoreo_7-400x284_1.webp';

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
  { src: mon1, alt: 'Proyecto monitoreo 1' },
  { src: mon2, alt: 'Proyecto monitoreo 2' },
  { src: mon3, alt: 'Proyecto monitoreo 3' },
  { src: mon4, alt: 'Proyecto monitoreo 4' },
  { src: mon5, alt: 'Proyecto monitoreo 5' },
  { src: mon6, alt: 'Proyecto monitoreo 6' },
  { src: mon7, alt: 'Proyecto monitoreo 7' },
];

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
              src={mon1}
              alt="Validación en campo de información" 
              className="w-full h-[300px] object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Validación en campo</span> de la información recolectada por plataformas de monitoreo
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={mon2}
              alt="Capacitación al personal" 
              className="w-full h-[300px] object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Capacitación municipal</span> en herramientas de monitoreo y control
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

        {/* Galería de imágenes con Carousel */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-orange-600 text-white shadow-lg">
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
                          ? 'bg-orange-600 w-8'
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
