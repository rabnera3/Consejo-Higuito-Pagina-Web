import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { CircleHelp, Sprout, Recycle, UsersRound } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-green-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/30 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/30 blur-3xl rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">Sobre Nosotros</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl md:text-2xl text-green-50 max-w-4xl mx-auto leading-relaxed">
              Consejo Intermunicipal Higuito (CIH). Trabajamos por el desarrollo comunitario sostenible fortaleciendo capacidades, articulando municipios y gestionando proyectos de alto impacto.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content Blocks */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl space-y-24">
          {/* 1. El Consejo Intermunicipal Higuito (CIH) */}
          <span id="cih" />
          <Stagger className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariant} className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-100 rounded-full">
                <CircleHelp className="w-5 h-5 text-green-700" />
                <span className="text-sm font-semibold text-green-700">Quiénes Somos</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">El Consejo Intermunicipal Higuito</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Es una asociación regional de municipios de carácter permanente que funciona con autonomía administrativa, apolítica, no religiosa ni racista, que orienta sus servicios al desarrollo y fortalecimiento de capacidades de sus municipalidades miembros, así como a la identificación, impulso y gestión de proyectos mancomunados que beneficien dos o más municipios, de preferencia al conjunto de municipios de la Subcuenca Higuito.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                La Subcuenca del Río Higuito está ubicada entre los departamentos de Copán, Lempira y Ocotepeque, en la Región Occidental de Honduras, se extiende sobre un territorio de aproximadamente 168,000 hectáreas, la cual se encuentra en la parte alta de la cuenca del río Ulúa, siendo esta una de sus principales afluentes.
              </p>
            </motion.div>
            <motion.div variants={itemVariant} className="rounded-2xl overflow-hidden shadow-2xl h-[400px]">
              <ImageWithFallback
                src={new URL('../img/aboutus1.webp', import.meta.url).href}
                alt="Reunión comunitaria"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </Stagger>

          {/* 2. El Consejo Higuito inicia su proceso */}
          <span id="proceso" />
          <Stagger className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariant} className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-2xl h-[400px]">
              <ImageWithFallback
                src={new URL('../img/aboutus2.webp', import.meta.url).href}
                alt="Ecosistemas y sostenibilidad"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div variants={itemVariant} className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-100 rounded-full">
                <Sprout className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-semibold text-amber-700">Nuestra Historia</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">El Consejo Higuito inicia su proceso</h2>
              <div className="space-y-5">
                <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Organizativo desde el mes de mayo de 1998, pero se constituyó oficialmente en marzo de 1999, por una Asamblea General que originalmente la integraban 32 miembros (16 alcaldes y 16 representantes de los Consejos de Desarrollo Municipal de cada municipio).
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                  <p className="text-base text-gray-700 leading-relaxed">
                    En la actualidad el Consejo solamente lo integran los alcaldes municipales, en representación de sus municipios, por decisión de las Corporaciones Municipales y una Junta de Vigilancia nombrada de entre los representantes de las diferentes Comisiones Ciudadanas de Transparencia de sus municipios socios.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Inicialmente el Consejo Higuito se organizó para facilitar servicios orientados a un manejo adecuado a los recursos naturales y al desarrollo integral; luego se incorporaron áreas como fortalecimiento institucional, infraestructura social, ordenamiento territorial mancomunado y fomento al desarrollo empresarial.
                  </p>
                </div>
              </div>
            </motion.div>
          </Stagger>

          {/* 3. Unidad Municipal Ambiental de Santa Rosa de Copán */}
          <span id="uma" />
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <Stagger className="space-y-8">
              <motion.div variants={itemVariant} className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-teal-100 rounded-full">
                  <Recycle className="w-5 h-5 text-teal-700" />
                  <span className="text-sm font-semibold text-teal-700">Nuestra Estructura</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Unidad Municipal Ambiental</h2>
              </motion.div>
              
              <motion.div variants={itemVariant} className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <p className="text-base text-gray-600 leading-relaxed">
                    Creada a principios de 1999, fue el centro de operaciones del Consejo Higuito hasta finales de abril del año 2001, luego se apertura en mayo del 2001, lo que en ese entonces se denominaba, la Unidad Técnica Intermunicipal (UTIM), con 3 oficinas, una sede ubicada en la ciudad de Santa Rosa de Copán y dos oficinas sectoriales ubicadas en las cabeceras municipales de Corquín y Dulce Nombre de Copán.
                  </p>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Actualmente laboran en el Consejo Higuito 25 personas, entre el personal técnico y administrativo. Además, el Consejo Higuito, posee 7 unidades técnicas de servicio y desarrolla siete líneas de servicio.
                  </p>
                  <p className="text-base text-gray-600 leading-relaxed">
                    La Junta Directiva se reúne al menos una vez al mes y está integrada por 7 miembros: Presidente, Vice-Presidente, Secretario, Tesorero, Fiscal y dos Vocales, y es electa en el mes de febrero de cada dos años.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={new URL('../img/aboutus3.webp', import.meta.url).href}
                    alt="Trabajo de campo colaborativo"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariant} className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Unidades técnicas de servicio</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Manejo de Recursos Naturales y Ambiente</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Fortalecimiento Institucional</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Planificación Territorial</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Ordenamiento Territorial</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Desarrollo Económico Local</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Infraestructura Social</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>Seguridad Alimentaria Nutricional</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Líneas de servicio</h3>
                  <ol className="space-y-3 text-gray-700 list-decimal ps-5">
                    <li>Capacitación</li>
                    <li>Formulación de Estudios</li>
                    <li>Asistencia Técnica para el Desarrollo de Capacidades</li>
                    <li>Acompañamiento en instrumentos de planificación y normativa</li>
                    <li>Gestión de Información Territorial</li>
                    <li>Gestión de Programas – Proyectos</li>
                    <li>Promoción, Socialización y Sensibilización</li>
                  </ol>
                </div>
              </motion.div>
            </Stagger>
          </div>

          {/* 4. En lo que corresponde a nivel del territorio */}
          <span id="territorio" />
          <Stagger className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariant} className="order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={new URL('../img/mapa1.webp', import.meta.url).href}
                  alt="Alcance territorial"
                  className="w-full h-[420px]"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Población</p>
                    <p className="text-lg font-bold text-blue-700">153 mil habitantes</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Territorio</p>
                    <p className="text-lg font-bold text-blue-700">1,256.3 Km²</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariant} className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-100 rounded-full">
                <UsersRound className="w-5 h-5 text-blue-700" />
                <span className="text-sm font-semibold text-blue-700">Nuestro Territorio</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Alcance Territorial</h2>
              <p className="text-base text-gray-600 leading-relaxed">
                La creación del Consejo fue motivado por el acelerado deterioro de los recursos naturales a que estaba sometida la subcuenca con su biodiversidad, poniendo en riesgo la sostenibilidad de los sistemas de abastecimiento de agua y la construcción de futuros proyectos de agua para las cabeceras municipales y más de 500 comunidades de los 15 municipios.
              </p>
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                <p className="text-base text-gray-700 leading-relaxed">
                  El territorio del área de influencia del Consejo Intermunicipal Higuito tiene una población aproximada de <span className="font-bold text-blue-700">153 mil habitantes</span>, de los cuales el 50.2% son mujeres. La superficie total es de <span className="font-bold text-blue-700">1,256.3 Km²</span> que corresponde a los 15 municipios miembros.
                </p>
              </div>
            </motion.div>
          </Stagger>

          {/* 5. El Consejo Intermunicipal Higuito agradece */}
          <span id="agradece" />
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl overflow-hidden shadow-2xl">
            <Stagger className="grid md:grid-cols-2 gap-0">
              <motion.div variants={itemVariant} className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Agradecimientos</h2>
                <p className="text-lg text-green-50 leading-relaxed">
                  A la cooperación internacional, por la colaboración técnica y financiera que ha brindado al territorio, a través de sus programas y proyectos:
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['USAID', 'Unión Europea', 'JICA', 'GIZ', 'AECID', 'Cooperación Suiza'].map((org) => (
                    <span key={org} className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                      {org}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={itemVariant} className="h-[400px] md:h-full">
                <ImageWithFallback
                  src={new URL('../img/aboutus4.webp', import.meta.url).href}
                  alt="Agradecimientos y cooperación"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </Stagger>
          </div>

          
        </div>
      </section>
    </div>
  );
}
