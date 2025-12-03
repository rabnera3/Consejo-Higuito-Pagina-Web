import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // SVGs del carrusel de fondo (optimizados a WebP)
  const carouselSvgs = [
    new URL('../img/svg/carrusel1.webp', import.meta.url).href,
    new URL('../img/svg/carrusel2.webp', import.meta.url).href,
    new URL('../img/svg/carrusel3.webp', import.meta.url).href,
    new URL('../img/svg/carrusel4.webp', import.meta.url).href,
  ];

  // Resolve logo asset
  const logo = new URL('../img/logo01.png', import.meta.url).href;

  // JS slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSvgs.length);
    }, 4000); // Cambiar cada 4 segundos

    return () => clearInterval(interval);
  }, [carouselSvgs.length]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] md:h-[700px] md:min-h-0 w-full max-w-full overflow-hidden flex flex-col">
      {/* Slideshow de fondo (JS-controlled) con ligera parallax */}
      <motion.div className="absolute inset-0 z-0 overflow-hidden" style={{ y }} aria-hidden>
        {/* Cada imagen como slide absoluto, solo visible cuando es el currentSlide */}
        {carouselSvgs.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === i ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
        {/* Overlays para legibilidad del texto - Enhanced Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/40 z-10"></div>
      </motion.div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center pb-20 md:pb-0"
        style={{ opacity }}
      >
        {/* Mobile Navbar Spacer */}
        <div className="h-24 md:hidden shrink-0" aria-hidden="true" />

        <div className="text-white max-w-4xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 mb-8 lg:mb-12">
            {/* Enhanced Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="mb-4 lg:mb-0 hidden md:block"
            >
              <img
                src={logo}
                alt="Logo Consejo Higuito"
                className="h-24 w-auto md:h-32 lg:h-40 drop-shadow-2xl"
              />
            </motion.div>

            <div className="flex-1 text-center lg:text-left">
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-green-600/90 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold text-white">Impacto Sostenible</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Construyendo un
                <br />
                <span className="bg-gradient-to-r from-green-300 via-green-200 to-amber-200 bg-clip-text text-transparent">
                  Futuro Sostenible
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-8 leading-relaxed text-green-50 font-light max-w-2xl drop-shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Trabajamos juntos para fortalecer las comunidades y promover el desarrollo sostenible en áreas rurales
              </motion.p>
            </div>
          </div>

          {/* Enhanced CTAs with better contrast */}
          <motion.div
            className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/nosotros">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-2xl hover:shadow-green-500/50 transition-all px-10 py-7 text-lg font-bold rounded-xl border-2 border-green-500/30"
                >
                  CONOCE MÁS
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/lineas-servicio">
                <Button
                  size="lg"
                  className="bg-white hover:bg-green-50 text-green-800 shadow-2xl hover:shadow-amber-500/30 transition-all px-10 py-7 text-lg font-bold rounded-xl border-2 border-white/50 group"
                >
                  NUESTROS PROYECTOS
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap gap-x-8 gap-y-4 mt-12 text-sm text-green-100 justify-center lg:justify-start"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>2,500+ Familias Beneficiadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>15 Municipios Activos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span>Trabajo mediante procesos estandarizados</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
