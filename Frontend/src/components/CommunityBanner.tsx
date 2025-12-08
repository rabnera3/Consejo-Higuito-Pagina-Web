import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export function CommunityBanner() {
  return (
  <section className="relative h-[400px] overflow-hidden">
      {/* Background Image */}
      <ImageWithFallback
        src={new URL('../img/landingpage1.webp', import.meta.url).href}
        alt="Agricultural workers in the field"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></motion.div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-white max-w-xl">
          <h2 className="mb-4">
            Fortalecemos<br />
            Comunidades<br />
            De Occidente
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
