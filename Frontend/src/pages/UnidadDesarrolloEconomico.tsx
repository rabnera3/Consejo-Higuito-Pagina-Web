import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TrendingUp, Target, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';

import desa01 from '../img/unidades/desarrollo/uni_desa_eco_01.webp';
import desa03 from '../img/unidades/desarrollo/uni_desa_eco_03_1.webp';
import desa05 from '../img/unidades/desarrollo/uni_desa_eco_05_1.webp';
import desa08 from '../img/unidades/desarrollo/uni_desa_eco_08_1.webp';
import desa09 from '../img/unidades/desarrollo/uni_desa_eco_09_1.webp';
import desa11 from '../img/unidades/desarrollo/uni_desa_eco_11_1.webp';
import desa12 from '../img/unidades/desarrollo/uni_desa_eco_12.webp';

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
  { src: desa01, alt: 'Proyecto desarrollo 01' },
  { src: desa03, alt: 'Proyecto desarrollo 03' },
  { src: desa05, alt: 'Proyecto desarrollo 05' },
  { src: desa08, alt: 'Proyecto desarrollo 08' },
  { src: desa09, alt: 'Proyecto desarrollo 09' },
  { src: desa11, alt: 'Proyecto desarrollo 11' },
  { src: desa12, alt: 'Proyecto desarrollo 12' },
];

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
              src={desa03}
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
              src={desa08}
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

        {/* Galería de imágenes con Carousel */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-amber-600 text-white shadow-lg">
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
                          ? 'bg-amber-600 w-8'
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
