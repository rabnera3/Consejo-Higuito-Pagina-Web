import { Phone, Mail, MapPin, Download, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';

const telefonos = [
  '+504 2662-6682',
  '+504 2662-6610',
  '+504 2662-7035'
];

const formularios = [
  {
    title: 'Catálogo',
    subtitle: 'de servicios',
    color: 'green',
    icon: 'file',
  },
  {
    title: 'Solicitud',
    subtitle: 'de servicios',
    color: 'orange',
    icon: 'file',
  },
  {
    title: 'Encuesta',
    subtitle: 'de satisfacción',
    color: 'orange',
    icon: 'file',
  },
  {
    title: 'Quejas',
    subtitle: 'y reclamos',
    color: 'blue',
    icon: 'file',
  },
];

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    captcha: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verificar captcha simple
    if (parseInt(formData.captcha) !== 11) {
      alert('La respuesta al captcha es incorrecta. 4 + 7 = 11');
      return;
    }
    
    // Aquí se enviaría el formulario
    alert('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '', captcha: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Área de contacto y descargas
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Consejo Intermunicipal Higuito (CIH)
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">
        
        {/* Sección de contacto */}
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Columna izquierda - Información y formulario */}
          <div className="space-y-8">
            
            {/* Teléfonos */}
            <FadeIn>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-600 text-white rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Nuestros teléfonos</h2>
                </div>
                <ul className="space-y-3">
                  {telefonos.map((telefono, index) => (
                    <li key={index}>
                      <a
                        href={`tel:${telefono.replace(/\s/g, '')}`}
                        className="text-lg text-gray-700 hover:text-green-600 transition-colors font-medium"
                      >
                        {telefono}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Formulario de contacto */}
            <FadeIn>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-600 text-white rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Envíenos un mensaje</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Su correo electrónico"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="Su número de teléfono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Mensaje"
                      required
                      rows={5}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      className="textarea-field"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">4 + 7 =</span>
                    <input
                      type="number"
                      placeholder="?"
                      required
                      value={formData.captcha}
                      onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                      className="input-field w-20"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

          {/* Columna derecha - Dirección y mapa */}
          <div className="space-y-8">
            
            {/* Dirección */}
            <FadeIn>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-600 text-white rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Dirección</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Santa Rosa de Copán, Colonia Centenario, 2da calle, 5ta avenida.
                </p>
              </div>
            </FadeIn>

            {/* Mapa */}
            <FadeIn>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d483.85205775569556!2d-88.79004694905448!3d14.770541492183382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f64022b9b9b9b9b%3A0x1234567890abcdef!2sConsejo%20Intermunicipal%20Higuito!5e0!3m2!1ses!2shn!4v1699999999999!5m2!1ses!2shn"
                  width="100%"
                  height="450"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Consejo Intermunicipal Higuito - Q6C6+622, Escalinata, Santa Rosa de Copán"
                  className="w-full h-[450px] border-0"
                />
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Formularios de descarga */}
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 md:p-12">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-6">
                <Download className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Descargue los formularios de solicitudes
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Ponemos a su disposición los siguientes formularios para que puedan ser descargados y enviar sus solicitudes al correo{' '}
                <a href="mailto:info@consejohiguito.hn" className="text-green-600 hover:text-green-700 font-semibold">
                  info@consejohiguito.hn
                </a>
              </p>
            </div>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formularios.map((formulario, index) => {
              const colorClasses = {
                green: 'bg-green-600 hover:bg-green-700',
                orange: 'bg-orange-500 hover:bg-orange-600',
                blue: 'bg-blue-600 hover:bg-blue-700',
              };
              
              const bgLightClasses = {
                green: 'bg-green-50 text-green-600',
                orange: 'bg-orange-50 text-orange-500',
                blue: 'bg-blue-50 text-blue-600',
              };

              return (
                <motion.div
                  key={index}
                  variants={itemVariant}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-gray-200"
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${bgLightClasses[formulario.color as keyof typeof bgLightClasses]} rounded-xl mb-4`}>
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {formulario.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {formulario.subtitle}
                    </p>
                    <button
                      className={`w-full ${colorClasses[formulario.color as keyof typeof colorClasses]} text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2`}
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </Stagger>
        </div>

      </div>
    </div>
  );
}
