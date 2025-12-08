import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Sparkles, Users, Heart, Award, Target } from 'lucide-react';

export function BannerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-gradient-to-br from-green-600 via-green-700 to-emerald-900 relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Optimized animated background - reduced blur and animations */}
      <div className="absolute inset-0 opacity-30 will-change-transform">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-amber-400 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>
        <motion.div 
          style={{ y: y2 }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-teal-400 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        ></motion.div>
      </div>

      {/* Reduced number of floating shapes for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 20) % 100}%`,
              top: `${(i * 30) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          >
            {i % 2 === 0 ? (
              <div className="w-6 h-6 border border-white/20 rounded-lg" />
            ) : (
              <Sparkles className="w-4 h-4 text-white/20" />
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          style={{ scale }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Badge with optimized animation */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <Award className="w-5 h-5 text-amber-300" />
            <span className="text-white text-base font-semibold tracking-wide">Impacto Sostenible Certificado</span>
          </motion.div>

          {/* Main heading with faster animations */}
          <div className="mb-8 space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
            >
              Promovemos
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
                El Desarrollo
              </span>
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
            >
              Comunitario Sostenible
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-green-50 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            Trabajando mano a mano con las comunidades para crear un futuro mejor
          </motion.p>

          {/* Social media links moved to Navbar */}

          {/* Optimized stats cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              { icon: Users, number: "175,000+", label: "Familias Beneficiadas", color: "from-amber-400 to-orange-500" },
              { icon: Target, number: "15", label: "Municipios Activos", color: "from-green-400 to-emerald-500" },
              { icon: Heart, number: "500+", label: "Comunidades Impactadas", color: "from-teal-400 to-cyan-500" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ 
                  scale: 1.03, 
                  y: -5,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex flex-col items-center gap-3">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-1 tracking-tight">
                      {stat.number}
                    </div>
                    <div className="text-green-100 text-sm md:text-base font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 right-0"
      >
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </motion.div>
    </section>
  );
}
