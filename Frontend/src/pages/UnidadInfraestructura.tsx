import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Building2, Target, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';

import infra01 from '../img/unidades/infraestructura/uni_infra_so_01_1.webp';
import infra02 from '../img/unidades/infraestructura/uni_infra_so_02_1.webp';
import infra08 from '../img/unidades/infraestructura/uni_infra_so_08.webp';
import infra09 from '../img/unidades/infraestructura/uni_infra_so_09_1.webp';
import infra11 from '../img/unidades/infraestructura/uni_infra_so_11_1.webp';
import infra12 from '../img/unidades/infraestructura/uni_infra_so_12.webp';
import infra14 from '../img/unidades/infraestructura/uni_infra_so_14_1.webp';
import infra16 from '../img/unidades/infraestructura/uni_infra_so_16_1.webp';
import infra18 from '../img/unidades/infraestructura/uni_infra_so_18_1.webp';
import infra19 from '../img/unidades/infraestructura/uni_infra_so_19_1.webp';
import infra20 from '../img/unidades/infraestructura/uni_infra_so_20_1.webp';
import infra24 from '../img/unidades/infraestructura/uni_infra_so_24_1.webp';

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

const galeriaBase = [
  { src: infra01, alt: 'Proyecto infraestructura 01' },
  { src: infra02, alt: 'Proyecto infraestructura 02' },
  { src: infra08, alt: 'Proyecto infraestructura 08' },
  { src: infra09, alt: 'Proyecto infraestructura 09' },
  { src: infra11, alt: 'Proyecto infraestructura 11' },
  { src: infra12, alt: 'Proyecto infraestructura 12' },
  { src: infra14, alt: 'Proyecto infraestructura 14' },
  { src: infra16, alt: 'Proyecto infraestructura 16' },
  { src: infra18, alt: 'Proyecto infraestructura 18' },
  { src: infra19, alt: 'Proyecto infraestructura 19' },
  { src: infra20, alt: 'Proyecto infraestructura 20' },
  { src: infra24, alt: 'Proyecto infraestructura 24' },
];

export default function UnidadInfraestructuraPage() {
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
              src={infra01}
              alt="Tanque de agua en Aguacaliente"
              className="w-full h-[300px] object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="bg-white p-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold">Trabajos constructivos en tanque de almacenamiento de agua</span> para distribución a la comunidad. Aguacaliente, Veracruz, Copán
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={infra02}
              alt="Alcaldía de Concepción"
              className="w-full h-[300px] object-cover"
              loading="lazy"
              decoding="async"
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

          <div className="relative w-full px-4 sm:px-6 lg:px-8" aria-live="polite">
            <div
              className="overflow-x-hidden"
              ref={emblaRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') scrollPrev();
                if (e.key === 'ArrowRight') scrollNext();
              }}
              tabIndex={0}
            >
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                {galeriaLocales.map(({ src, alt }, idx) => (
                  <motion.div
                    key={alt + idx}
                    variants={itemVariant}
                    className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-6px)] md:flex-[0_0_calc(50%-8px)] rounded-xl shadow-md group overflow-hidden"
                  >
                    <div className="w-full aspect-video overflow-hidden rounded-xl">
                        <img
                          src={src}
                          alt={alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4 md:px-6 pointer-events-none">
              <button
                type="button"
                className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-md border border-gray-200 hover:bg-white"
                onClick={scrollPrev}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-md border border-gray-200 hover:bg-white"
                onClick={scrollNext}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsPaused((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-sm font-medium"
                aria-label={isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Reanudar' : 'Pausar'}
              </button>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {galeriaLocales.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollTo(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      selectedIndex === idx ? 'bg-amber-600 scale-110' : 'bg-gray-300'
                    }`}
                    aria-label={`Ir a la imagen ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

