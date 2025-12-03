import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FadeIn, Stagger, itemVariant } from './figma/animations';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function WelcomeSection() {
  return (
    <section className="py-16 bg-gray-50 scroll-mt-20" id="inicio">
      <div className="container mx-auto px-4">
        <Stagger className="grid md:grid-cols-2 gap-8 items-center">
          {/* Welcome Card */}
          <motion.div
            variants={itemVariant}
            className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border-l-8 border-green-600 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <FadeIn className="text-green-700 mb-4"><h2>¡BIENVENIDO!</h2></FadeIn>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Somos una asociación regional de municipios de carácter permanente
              que funciona con autonomía administrativa, apolítica, no religiosa ni racista,
              que orienta sus servicios al desarrollo y fortalecimiento de capacidades de sus municipalidades miembros,
              así como a la identificación, impulso y gestión de proyectos mancomunados que beneficien dos o más municipios,
              de preferencia al conjunto de municipios de la Subcuenca Higuito.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/nosotros">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-md">
                  VER MÁS INFORMACIÓN
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={itemVariant}
            className="rounded-2xl overflow-hidden shadow-2xl h-[350px] relative group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="h-full w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <ImageWithFallback
                src={new URL('../img/bienvenida.webp', import.meta.url).href}
                alt="Community members working in agriculture"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </Stagger>
      </div>
    </section>
  );
}
