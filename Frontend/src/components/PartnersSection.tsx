import { Handshake, Building2, Sprout, Award, Globe, TreePine, Scale, Heart, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

const partnerLogos = [
  { id: 1, name: "Cooperación Internacional", icon: Globe, color: "text-teal-600" },
  { id: 2, name: "ICF", icon: TreePine, color: "text-green-600" },
  { id: 3, name: "Mi Ambiente", icon: Sprout, color: "text-emerald-600" },
  { id: 4, name: "Fiscalía", icon: Scale, color: "text-indigo-600" },
  { id: 5, name: "Secretaría de Salud", icon: Heart, color: "text-red-600" },
  { id: 6, name: "Secretaría de Educación", icon: GraduationCap, color: "text-blue-600" },
  { id: 7, name: "Otras Secretarías de estado", icon: Building2, color: "text-gray-600" },
  { id: 8, name: "Academia", icon: Award, color: "text-amber-600" },
];

export function PartnersSection() {
  return (
    <section id="socios" className="py-24 bg-gradient-to-br from-green-50 via-white to-green-50 scroll-mt-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Enhanced Partner Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white via-green-50/30 to-white rounded-3xl p-10 md:p-12 shadow-2xl border-2 border-green-100/50"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-full mb-4"
            >
              <Handshake className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Alianzas Estratégicas</span>
            </motion.div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Socios
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Colaborando con organizaciones líderes para maximizar el impacto en las comunidades
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{
                  scale: 1.08,
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
                className="group relative flex flex-col items-center justify-center p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/5 group-hover:to-emerald-400/5 transition-all duration-300"></div>

                {/* Icon container with gradient on hover */}
                <div className="relative p-5 rounded-2xl bg-gray-50 group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300 mb-4 shadow-sm group-hover:shadow-xl">
                  <partner.icon className={`w-10 h-10 ${partner.color} filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`} />
                </div>

                {/* Partner name */}
                <span className="text-sm text-center text-gray-700 font-semibold group-hover:text-green-700 transition-colors leading-tight">
                  {partner.name}
                </span>

                {/* Corner accent dot */}
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>

          {/* Trust indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Award className="w-4 h-4 text-green-600" />
              <span>Certificados y avalados por entidades internacionales</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
