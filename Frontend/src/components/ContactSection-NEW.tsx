import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { FadeIn, Stagger, itemVariant } from './figma/animations';
import { motion } from 'motion/react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: formData.name.trim() === '' ? 'El nombre es requerido' : '',
      email: formData.email.trim() === '' ? 'El email es requerido' : !validateEmail(formData.email) ? 'Email inválido' : '',
      subject: formData.subject.trim() === '' ? 'El asunto es requerido' : '',
      message: formData.message.trim() === '' ? 'El mensaje es requerido' : ''
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every(error => error === '')) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <FadeIn>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <Mail className="w-5 h-5 text-green-300" />
              <span className="text-white font-semibold text-sm">Estamos para ayudarle</span>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Póngase en <span className="bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-transparent">Contacto</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-green-100 text-lg leading-relaxed max-w-2xl mx-auto">
              ¿Tiene preguntas o desea colaborar? Nos encantaría escuchar de usted
            </p>
          </FadeIn>
        </div>

        <Stagger className="grid md:grid-cols-3 gap-8">
          <motion.div variants={itemVariant} className="space-y-6">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="p-3 bg-green-600 rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Dirección</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  Colonia Centenario, 2da calle, 5ta avenida.<br />
                  Santa Rosa de Copán
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="p-3 bg-green-600 rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Teléfonos</h4>
                <ul className="text-green-100 text-sm space-y-1">
                  <li><a href="tel:+50426626682" className="hover:text-white transition-colors">+504 2662-6682</a></li>
                  <li><a href="tel:+50426626610" className="hover:text-white transition-colors">+504 2662-6610</a></li>
                  <li><a href="tel:+50426627035" className="hover:text-white transition-colors">+504 2662-7035</a></li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="p-3 bg-green-600 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Email</h4>
                <a href="mailto:info@consejohiguito.hn" className="text-green-100 text-sm hover:text-white transition-colors">
                  info@consejohiguito.hn
                </a>
              </div>
            </motion.div>

            <div className="pt-6">
              <h4 className="text-white font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
                  { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
                  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    title={social.label}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm ${social.color} rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl border border-white/10`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="md:col-span-2">
            <div className="bg-white text-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-gray-600">Nos pondremos en contacto con usted pronto.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                        Nombre *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Su nombre completo"
                        className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="su@email.com"
                        className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                      Asunto *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="¿De qué se trata su mensaje?"
                      className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                      Mensaje *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escriba su mensaje aquí..."
                      rows={6}
                      className={`w-full resize-none ${errors.message ? 'border-red-500' : ''}`}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-500">* Campos requeridos</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all px-8 group"
                      >
                        <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        ENVIAR MENSAJE
                      </Button>
                    </motion.div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </Stagger>
      </div>
    </section>
  );
}
