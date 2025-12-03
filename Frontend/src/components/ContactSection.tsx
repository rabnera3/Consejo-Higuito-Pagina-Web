import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Ponte en Contacto
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Listo para generar un{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              cambio positivo?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Contáctanos y descubre cómo podemos trabajar juntos por un futuro sostenible
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Estamos aquí para ayudarte
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Nuestro equipo está comprometido en responder todas tus consultas y colaborar contigo en proyectos de impacto comunitario.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 group"
              >
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <a
                    href="mailto:info@consejohiguito.hn"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    info@consejohiguito.hn
                  </a>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 group"
              >
                <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Teléfonos</h4>
                  <ul className="text-green-600 hover:text-green-700 transition-colors space-y-1">
                    <li><a href="tel:+50426626682">+504 2662-6682</a></li>
                    <li><a href="tel:+50426626610">+504 2662-6610</a></li>
                    <li><a href="tel:+50426627035">+504 2662-7035</a></li>
                  </ul>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 group"
              >
                <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Dirección</h4>
                  <p className="text-gray-600">
                    Santa Rosa de Copán, Colonia Centenario, 2da calle, 5ta avenida.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Respuesta en 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>100% Confidencial</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-gray-700 font-medium">
                    Nombre *
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="text-gray-700 font-medium">
                    Apellido *
                  </Label>
                  <Input
                    id="apellido"
                    placeholder="Tu apellido"
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Correo electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Asunto */}
              <div className="space-y-2">
                <Label htmlFor="asunto" className="text-gray-700 font-medium">
                  Asunto del mensaje *
                </Label>
                <Input
                  id="asunto"
                  placeholder="¿En qué podemos ayudarte?"
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="mensaje" className="text-gray-700 font-medium">
                  Escribe tu mensaje aquí *
                </Label>
                <Textarea
                  id="mensaje"
                  placeholder="Cuéntanos más sobre tu consulta o proyecto..."
                  rows={5}
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                >
                  <span>Enviar mensaje</span>
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              <p className="text-sm text-gray-500 text-center">
                * Campos obligatorios
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
