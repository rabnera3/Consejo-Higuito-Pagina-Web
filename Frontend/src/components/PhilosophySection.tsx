import { Button } from './ui/button';
import { FadeIn, Stagger, itemVariant } from './figma/animations';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function PhilosophySection() {
  return (
    <section id="filosofia" className="py-16 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="border-l-4 border-green-600 pl-4 mb-10">
          <FadeIn className="text-gray-800"><h2>Nuestra filosofía</h2></FadeIn>
        </div>

        <Stagger className="grid md:grid-cols-2 gap-8 items-start">
          {/* Mission */}
          <motion.div
            variants={itemVariant}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-green-700 mb-4 text-2xl font-bold">Nuestra misión</h3>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              Somos una asociación mancomunada de municipios, de interés público, que gestiona, impulsa y facilita procesos, en acompañamiento a los gobiernos municipales, para el desarrollo local y regional, con trasparencia equidad y responsabilidad.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/nosotros/filosofia">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white shadow-md w-full md:w-auto">
                  CONOCER MÁS
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={itemVariant}
            className="bg-gradient-to-br from-green-600 to-green-800 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/20 rounded-full blur-xl -ml-5 -mb-5 transition-transform duration-700 group-hover:scale-150"></div>

            <h3 className="mb-4 text-white text-2xl font-bold relative z-10">Nuestra visión</h3>
            <p className="mb-4 leading-relaxed text-lg text-green-50 relative z-10">
              Ser una mancomunidad comprometida, innovadora y sostenible, líder a nivel nacional, con capacidad para gestionar procesos de apoyo hacia el desarrollo local y regional.
            </p>
          </motion.div>
        </Stagger>
      </div>
    </section>
  );
}
