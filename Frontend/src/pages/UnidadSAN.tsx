import { useMemo, useState } from 'react';
import { Target, CheckCircle2, Image as ImageIcon, Wheat } from 'lucide-react';
import { motion } from 'motion/react';
import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';
import { ImageCarousel } from '../components/ImageCarousel';
import { ImageModal } from '../components/ImageModal';

import san1 from '../img/unidades/san/gallery_unidad-san_1.avif';
import san11 from '../img/unidades/san/gallery_unidad-san_11_1.avif';
import san12 from '../img/unidades/san/gallery_unidad-san_12_1.avif';
import san14 from '../img/unidades/san/gallery_unidad-san_14_1.avif';
import san15 from '../img/unidades/san/gallery_unidad-san_15_1.avif';
import san17 from '../img/unidades/san/gallery_unidad-san_17_1.avif';
import san19 from '../img/unidades/san/gallery_unidad-san_19.avif';

const objetivosEspecificos = [
  'Coordinar con las unidades municipales para promover sistemas alimentarios sostenibles que mejoren la productividad, disponibilidad, acceso y diversificación de alimentos en los municipios a través de la extensión agrícola y nutricional, principalmente en las familias en condición de inseguridad alimentaria y nutricional.',
  'Contribuir desde su gestión a fortalecer los sistemas financieros y empresariales en el territorio para mejorar el acceso a los recursos principalmente en los grupos en condiciones de vulnerabilidad.',
  'Articular con las unidades municipales para promover la mejora de los servicios de salud y saneamiento básicos en los hogares con las condiciones sanitarias y ambientales para una óptima utilización biológica de los alimentos.',
  'Promover una educación alimentaria con hábitos y estilos de vida saludable que permita mejorar el estado de la salud y nutrición de las familias.',
  'Organizar y fortalecer las organizaciones a nivel comunitario, municipal y territorial promoviendo una participación equitativa para facilitar la transferencia de conocimientos, tecnologías y prácticas que mejoren la calidad de vida de las familias.',
  'Planificar, gestionar y ejecutar programas y proyectos, en alianzas con los actores del territorio que permitir orientar acciones SAN en las familias principalmente en condiciones de vulnerabilidad.',
  'Fortalecer las estructuras comunitarias y municipales para crear las capacidades de repuesta ante situaciones de InSAN.',
];

const lineamientos = [
  'Promover los sistemas alimentarios sostenibles a través de la extensión agrícola y nutricional',
  'Fortalecer sistemas financieros y empresariales para mejorar el acceso a los recursos',
  'Mejorar servicios de salud y saneamiento básicos en los hogares a través de la extensión agrícola y nutricional',
  'Promover la educación alimentaria con hábitos y estilos de vida saludable',
  'Fortalecer las capacidades humanas e institucionales en la población promoviendo una participación equitativa que facilite la transferencia de conocimientos, metodologías, buenas prácticas y tecnologías para un abordaje integral de SAN',
  'Gestión de la SAN en alianzas con otros actores del territorio',
  'Seguimiento de acciones SAN',
];

const galeriaBase = [
  { src: san1, alt: 'Proyecto SAN 1' },
  { src: san11, alt: 'Proyecto SAN 11' },
  { src: san12, alt: 'Proyecto SAN 12' },
  { src: san14, alt: 'Proyecto SAN 14' },
  { src: san15, alt: 'Proyecto SAN 15' },
  { src: san17, alt: 'Proyecto SAN 17' },
  { src: san19, alt: 'Proyecto SAN 19' },
];

export default function UnidadSANPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galeriaLocales = useMemo(() => {
    const shuffled = [...galeriaBase];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unidad de Seguridad Alimentaria y Nutricional
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
          <motion.div
            variants={itemVariant}
            className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => setSelectedImage(san14)}
          >
            <img
              src={san14}
              alt="Huerto familiar en Rio Colorado"
              className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>

          <motion.div
            variants={itemVariant}
            className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={() => setSelectedImage(san17)}
          >
            <img
              src={san17}
              alt="Sistema de riego"
              className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        </Stagger>

        {/* Objetivo general */}
        <Stagger className="space-y-12">
          <motion.div variants={itemVariant} className="border-l-4 border-green-600/40 pl-6 md:pl-10 relative">
            <div className="absolute -left-6 top-0 p-3 rounded-xl bg-green-600 text-white shadow-lg">
              <Wheat className="w-6 h-6" />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Objetivo general</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Ser el órgano mancomunado, técnico y de gestión, encargado de implementar políticas públicas, programas, proyectos y planes promoviendo el derecho a la alimentación adecuada, la soberanía alimentaria, y la seguridad alimentaria y nutricional a través de la articulación de actores internos y externos para el desarrollo de acciones integrales respondiendo a las necesidades de la población del municipio, priorizando a grupos en condiciones de vulnerabilidad que contribuya a mejorar los medios de vida.
              </p>
            </div>
          </motion.div>
        </Stagger>

        {/* Objetivos específicos */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-amber-600 text-white shadow-lg">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Objetivos específicos</h2>
            </div>
          </FadeIn>

          <Stagger className="space-y-4">
            {objetivosEspecificos.map((objetivo, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-1.5 rounded-full bg-green-600 flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">{objetivo}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>

        {/* Lineamientos estratégicos */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-teal-600 text-white shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Lineamientos estratégicos</h2>
            </div>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 gap-6">
            {lineamientos.map((lineamiento, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-1.5 rounded-full bg-amber-600 flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">{lineamiento}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>

        {/* Funciones - Sección expandible */}
        <div>
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Funciones
            </h2>
          </FadeIn>

          <Stagger className="space-y-6">
            {/* Función 1 */}
            <motion.details variants={itemVariant} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
              <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    1. Promover los sistemas alimentarios sostenibles a través de la extensión agrícola y nutricional
                  </h3>
                  <svg className="w-6 h-6 text-green-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <p className="text-gray-700 mb-4 font-medium">Brindar asistencia técnica a unidades municipales en:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Organización y fortalecimiento de Promotores Agrícolas Comunitarios (PAC) y grupos productivos, para la transferencia de conocimiento, buenas prácticas y tecnologías ambientalmente sostenible.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promoción e implementación de modelos productivos agroecológicos, agroforestales y silvopastoriles como medida de protección al medio ambiente e inocuidad y calidad de los alimentos.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Fomentar la diversificación de actividades agropecuarias mediante la incorporación de especies menores a nivel de hogares y colectivo estableciendo mecanismos de apoyo económico y técnico.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Apoyar la agricultura de pequeña y mediana escala (huertos familiares, pedagógicos y fincas integrales) con capacitación, asistencia técnica e insumos.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promoción del rescate de semillas criollas adaptadas a la zona y resilientes a la sequía.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Implementación de metodologías de extensión agropecuaria de manera horizontal como las Escuelas de Campo -ECAS, parcelas demostrativas, otros.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promover el acceso equitativo, el uso sustentable y aprovechamiento de agua para riego y otras actividades en la producción de alimentos.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Incentivar la producción de los alimentos básicos a través de insumos y asistencia técnica que mejore las cadenas productivas de alimentos.</span>
                  </li>
                </ul>
              </div>
            </motion.details>

            {/* Función 2 */}
            <motion.details variants={itemVariant} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
              <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    2. Fortalecer sistemas financieros y empresariales
                  </h3>
                  <svg className="w-6 h-6 text-green-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <p className="text-gray-700 mb-4 font-medium">Brindar asistencia técnica a unidades municipales en:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Organización y fortalecimiento de cajas de ahorro y crédito (CAC), para facilitar el acceso equitativo de los recursos financieros y tecnológicos.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promover el establecimiento y/o fortalecimiento de Reservas Estratégicas de Granos Básicos –REGB- (municipales y comunitarias).</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Organización y fortalecimiento de iniciativas empresariales, principalmente orientadas a jóvenes y mujeres del municipio.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promover la implementación y/o fortalecimiento de ferias del agricultor a nivel municipal con participación de productores, productoras, iniciativas empresariales.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Gestionar construcción de infraestructuras y/o mejoras de espacios de comercialización de productos agrícolas y no agrícolas.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Gestionar el mantenimiento de vías de acceso a las zonas productivas (primarias y secundarias) que garanticen la disponibilidad y acceso de alimentos.</span>
                  </li>
                </ul>
              </div>
            </motion.details>

            {/* Función 3 */}
            <motion.details variants={itemVariant} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
              <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    3. Promover la educación alimentaria con hábitos y estilos de vida saludable
                  </h3>
                  <svg className="w-6 h-6 text-green-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <p className="text-gray-700 mb-4 font-medium">Brindar asistencia técnica a unidades municipales en:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Desarrollo de acciones de educación no formal sobre salud, alimentación y nutrición con enfoque de género coordinado con la secretaria de salud y educación.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Fortalecimiento de los componentes del Programa Nacional de Alimentación Escolar (PNAE).</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promover e implementar huertos escolares con enfoque pedagógicos (Asistencia técnica, insumos, otro).</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Gestionar la construcción y mejoras de espacios de almacenamiento, preparación y consumo de alimentación escolar en los centros educativos.</span>
                  </li>
                </ul>
              </div>
            </motion.details>

            {/* Función 4 */}
            <motion.details variants={itemVariant} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
              <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    4. Mejorar servicios de salud y saneamiento básicos en los hogares
                  </h3>
                  <svg className="w-6 h-6 text-green-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <p className="text-gray-700 mb-4 font-medium">Brindar asistencia técnica a unidades municipales en:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Fortalecer las capacidades institucionales y comunitarias de salud a través de procesos de formación para la trasferencia de conocimiento, buenas prácticas y tecnologías en salud y nutrición en los hogares.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Coordinación con la Secretarias de Salud y Educación a través de la elaboración e implementación de cartas acuerdos, convenios, planes de trabajo entre otros.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promover espacios de prevención de (sensibilización, limpieza, vacunación, fumigación, entre otras).</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promover acciones de tratamiento manejo y almacenamiento de agua para consumo.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Gestionar y ejecutar proyectos de mejoramiento de infraestructura de viviendas y saneamiento básico, promoviendo buenas prácticas tecnologías de bajo costo ambientalmente sostenible.</span>
                  </li>
                </ul>
              </div>
            </motion.details>

            {/* Función 5 */}
            <motion.details variants={itemVariant} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
              <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    5. Fortalecer las capacidades humanas e institucionales
                  </h3>
                  <svg className="w-6 h-6 text-green-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <p className="text-gray-700 mb-4 font-medium">Brindar asistencia técnica a unidades municipales en:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Desarrollo de procesos de formación curricular con facilitadores agrícolas, financieros, ambientales y voluntarios de salud y/o facilitadores SAN y organizaciones afines.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Organización y fortalecimiento de facilitadores comunitarios.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Fortalecimiento de las organizaciones a nivel comunitario, municipal y territorial promoviendo una participación equitativa.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Vinculación de los facilitadores y/o voluntarios a estructuras comunitarias, municipales y regionales para una mejor gestión y manejo de la información.</span>
                  </li>
                </ul>
              </div>
            </motion.details>

            {/* Función 6 */}
            <motion.details variants={itemVariant} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
              <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    6. Gestión de la SAN en el territorio
                  </h3>
                  <svg className="w-6 h-6 text-green-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Apoyar la gestión e implementación de políticas públicas en SAN realizando periódicamente la revisión y actualización que permita basarse en la demanda de la población.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Promover y fortalecer el enlace corporativo con la instancia de decisión y operativa para facilitar la ejecución de metas de la planificación de la unidad SAN.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Desarrollar estrategias coordinadas con enfoque de Derecho Humano a la Alimentación e igualdad de género.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Elaborar planes operativos de la unidad en coordinación con otras unidades mancomunadas garantizando la aplicación de un enfoque de atención diferenciada.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Coordinación y concertación planificación con actores locales y organizaciones de sociedad civil.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Sensibilizar a los socios del CIH y organizaciones en temas relacionados a la SAN.</span>
                  </li>
                </ul>
              </div>
            </motion.details>

            {/* Función 7 */}
            <motion.details variants={itemVariant} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group">
              <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    7. Seguimiento de la SAN
                  </h3>
                  <svg className="w-6 h-6 text-green-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Monitorear y evaluar la situación de la SAN en el territorio del CIH de forma permanente y difundir los resultados periódicamente a las instituciones responsables y a la población en general.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Coordinar con las instancias correspondientes para identificar los grupos de la población y las áreas geográficas más afectadas, vulnerables o en riesgo de InSAN, dar alertas tempranas para establecer la adopción de medidas pertinentes y oportunas.</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Velar por el cumplimiento de las obligaciones y acciones desarrolladas por las instancias correspondientes, que permitan la prevención y la atención integral a la población infantil en situación de malnutrición o riesgo nutricional.</span>
                  </li>
                </ul>
              </div>
            </motion.details>
          </Stagger>
        </div>

        {/* Galería de imágenes con Carousel */}
        <div>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-xl bg-red-600 text-white shadow-lg">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Galería de imágenes</h2>
            </div>
          </FadeIn>

          <motion.div variants={itemVariant}>
            <ImageCarousel images={galeriaLocales} />
          </motion.div>
        </div>

      </div>

      <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
