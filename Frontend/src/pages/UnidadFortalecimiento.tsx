import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Shield, Target, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';

import fort03 from '../img/unidades/fortalecimiento/uni_forta_inst_03_1.webp';
import fort05 from '../img/unidades/fortalecimiento/uni_forta_inst_05_1.webp';
import fort07 from '../img/unidades/fortalecimiento/uni_forta_inst_07_1.webp';
import fort08 from '../img/unidades/fortalecimiento/uni_forta_inst_08_1.webp';
import fort14 from '../img/unidades/fortalecimiento/uni_forta_inst_14_1.webp';
import fort21 from '../img/unidades/fortalecimiento/uni_forta_inst_21_1.webp';

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
  { src: fort03, alt: 'Proyecto fortalecimiento 03' },
  { src: fort05, alt: 'Proyecto fortalecimiento 05' },
  { src: fort07, alt: 'Proyecto fortalecimiento 07' },
  { src: fort08, alt: 'Proyecto fortalecimiento 08' },
  { src: fort14, alt: 'Proyecto fortalecimiento 14' },
  { src: fort21, alt: 'Proyecto fortalecimiento 21' },
];

const responsabilidades = [
  'Supervisar el cumplimiento de la misión y responsabilidades del área de Fortalecimiento administrativo y financiero.',
  'Supervisar el cumplimiento de la misión y responsabilidades del área de Desarrollo social.',
  'Coordinar, integrar y facilitar las actividades necesarias para el mantenimiento y mejora continua del sistema de gestión de calidad (SGC), en particular en lo relacionado a la planificación basada en riesgos y oportunidades; a la gestión de la información y el conocimiento documental; a la evaluación y verificación del desempeño de procesos, a la realimentación de las partes interesadas; y a la ejecución de acciones para mejora (todo ello referido al SGC).',
  'Asegurar la transparencia en la CIH, y velar por la integridad y cumplimiento, gestionando y supervisando los riesgos penales, generando la normativa interna a las empresas sobre el buen gobierno corporativo, desarrollar métodos de denuncias y sanciones, y brindando entrenamiento para asegurar que el mensaje de compromiso ético trascienda a todos los niveles jerárquicos de la empresa (Competencias a desarrollar).',
  'Proponer iniciativas de mejora para los servicios que brinda y a los proyectos que sirve.',
  'Procesar y almacenar la información relevante y documentación de acuerdo con las políticas y/o manuales de manejo de información.',
];

export default function UnidadFortalecimientoPage() {
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
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unidad de Fortalecimiento Institucional
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
              src={fort03}
              alt="Taller de fortalecimiento institucional"
              className="w-full h-[300px] object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Fortalecimiento institucional</span> en procesos administrativos y de gobernanza.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={fort05}
              alt="Reunión de fortalecimiento municipal"
              className="w-full h-[300px] object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Capacitación y asistencia técnica</span> en fortalecimiento administrativo local.
              </p>
            </div>
          </motion.div>
        </Stagger>

        {/* Descripción de la unidad */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-purple-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-purple-600 text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Descripción de la unidad</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Mejorar las capacidades locales de gestión para el desarrollo socioeconómico de la población.
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
              <ul className="space-y-3 text-gray-700 leading-relaxed text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1.5">•</span>
                  <span>Fortalecer estructuras y procesos, y asegurar el uso eficiente de los recursos en municipios miembros, sus comunidades y en institucionales y organizaciones de la sociedad civil.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1.5">•</span>
                  <span>Liderar, coordinar y supervisar el rol del responsable de Fortalecimiento administrativo; financiero y del responsable de Desarrollo social</span>
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

        {/* Galería de imágenes con Carousel */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-purple-600 text-white shadow-lg">
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
                          ? 'bg-purple-600 w-8'
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
