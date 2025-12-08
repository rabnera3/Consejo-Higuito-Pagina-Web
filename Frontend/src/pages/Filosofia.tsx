import { FadeIn, Stagger, itemVariant } from '../components/figma/animations';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { motion } from 'motion/react';
import { Target, Eye, Share2, Users, Building2, ChevronRight } from 'lucide-react';
import { HiguitoOrgChart } from '../components/HiguitoOrgChart';

// Resolve assets from src/img
const presidente = new URL('../img/img_filosofia_damian_galdamez.webp', import.meta.url).href;
const gerente = new URL('../img/img_filosofia_marisela-espinoza.webp', import.meta.url).href;

const whoStats = [
  { label: 'Municipios socios', value: '15', detail: 'Desde la Subcuenca Higuito' },
  { label: 'Años de gestión', value: '+20', detail: 'Coordinando desarrollo regional' },
  { label: 'Líneas de servicio', value: '7', detail: 'Equipos técnicos multidisciplinarios' }
];

const missionBlocks = [
  {
    id: 'mision',
    title: 'Nuestra misión',
    description:
      'Somos una asociación mancomunada de municipios que gestiona, impulsa y facilita procesos junto a los gobiernos locales para el desarrollo regional con transparencia, equidad y responsabilidad.',
    icon: Target,
    accent: 'from-green-500/20 to-emerald-500/10'
  },
  {
    id: 'vision',
    title: 'Nuestra visión',
    description:
      'Ser una mancomunidad comprometida, innovadora y sostenible, referente nacional en la gestión de procesos que impulsan el desarrollo local y regional.',
    icon: Eye,
    accent: 'from-sky-500/20 to-blue-500/10'
  },
  {
    id: 'vision-compartida',
    title: 'Visión compartida',
    description:
      'Una región ordenada territorialmente, con infraestructura adecuada y manejo sostenible de los recursos naturales que impulse el desarrollo económico.',
    icon: Share2,
    accent: 'from-teal-500/20 to-emerald-500/10'
  }
];

const principles = [
  {
    title: 'Gobernanza cercana',
    detail: 'Procesos participativos con alcaldías, ciudadanía y alianzas estratégicas para cada iniciativa territorial.'
  },
  {
    title: 'Innovación aplicada',
    detail: 'Comités de calidad y equipos técnicos que prototipan soluciones y adaptan buenas prácticas al contexto local.'
  },
  {
    title: 'Transparencia y rendición',
    detail: 'Monitoreo constante de proyectos, auditorías sociales y publicación de resultados para fortalecer la confianza.'
  }
];

const strategicGoals = [
  {
    verb: 'Promover',
    detail: 'El manejo racional de los recursos naturales con enfoque territorial y comunitario.'
  },
  {
    verb: 'Impulsar',
    detail: 'El desarrollo agroempresarial y turístico sostenible que diversifique la economía local.'
  },
  {
    verb: 'Apoyar',
    detail: 'La participación consciente de la ciudadanía en los procesos de planificación y control social.'
  },
  {
    verb: 'Fortalecer',
    detail: 'La gestión institucional de las municipalidades socias con asistencia técnica y capacitación.'
  },
  {
    verb: 'Facilitar',
    detail: 'Acciones de ordenamiento territorial, infraestructura social y seguridad alimentaria.'
  }
];

export default function FilosofiaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-300/40 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-emerald-300/40 blur-3xl rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 tracking-tight">Filosofía Institucional</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl">
              Nuestra identidad, misión, visión y estructura organizacional al servicio del desarrollo local y regional de los 15 municipios socios.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content Blocks */}
      <section className="py-14">
        <div className="container mx-auto px-4 space-y-10">
          
          {/* 1. ¿Quiénes somos? */}
          <Stagger className="grid lg:grid-cols-2 gap-10 items-stretch">
            <motion.div
              variants={itemVariant}
              className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8 shadow-sm"
            >
              <div className="absolute -top-10 -right-6 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-200 to-green-100 opacity-60 blur-3xl" />
              <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-gradient-to-tr from-emerald-100 to-green-50 opacity-70 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
                  <Building2 className="w-4 h-4" />
                  Identidad institucional
                </div>
                <h3 className="mt-4 text-3xl font-bold text-gray-900">¿Quiénes somos?</h3>
                <p className="mt-4 text-gray-700 leading-7">
                  El Consejo Intermunicipal Higuito (CIH) es una asociación regional de municipios con autonomía administrativa que fortalece capacidades locales y gestiona proyectos conjuntos en la Subcuenca Higuito, Honduras.
                </p>
                <p className="mt-4 text-gray-700 leading-7">
                  Somos un espacio apolítico, no religioso ni racista que promueve soluciones intermunicipales para el desarrollo social, económico y ambiental.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {whoStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-center shadow">
                      <p className="text-2xl font-extrabold text-green-700">{stat.value}</p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{stat.label}</p>
                      <p className="text-[11px] text-gray-500 mt-1">{stat.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariant}
              className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-lg ring-1 ring-black/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-gray-50">
                <ResponsiveImage
                  src={presidente}
                  alt="Ing. Kelvin G. Aguilar – Presidente de la Junta Directiva"
                  sizes="(max-width: 640px) 480px, 600px"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-gray-700 shadow">
                  Liderazgo directivo
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-lg font-semibold text-gray-900">Ing. Damian Raúl Portillo Galdamez</p>
                <p className="text-sm text-gray-600">Presidente de la Junta Directiva</p>
                <p className="mt-4 text-sm text-gray-500">
                  Coordina la agenda política común y garantiza la articulación entre alcaldías para consolidar proyectos regionales.
                </p>
              </div>
            </motion.div>
          </Stagger>

          {/* 2. Misión, Visión, Visión Compartida */}
          <Stagger className="grid lg:grid-cols-[0.9fr,1.1fr] gap-10 items-stretch">
            <motion.div
              variants={itemVariant}
              className="order-2 lg:order-1 flex flex-col rounded-3xl border border-gray-100 bg-white shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-gray-100">
                <ResponsiveImage src={gerente} alt="Lic. Lourdes Marisela Espinoza – Gerente General CIH" sizes="(max-width: 640px) 480px, 600px" className="h-full w-full object-cover" />
                <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 px-4 py-3 text-sm text-gray-700 shadow">
                  <p className="font-semibold text-gray-900">Lic. Lourdes Marisela Espinoza</p>
                  <p className="text-xs uppercase tracking-wide text-emerald-600">Gerente General CIH</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Lidera la estrategia operativa, coordina alianzas y vela por la ejecución eficiente del plan anual.
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Dirección ejecutiva</p>
                <p className="mt-2 text-sm text-gray-600">
                  Coordinación de equipos técnicos, gestión de cooperación y representación legal de la mancomunidad.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariant} className="order-1 lg:order-2 space-y-6">
              <div className="grid gap-6">
                {missionBlocks.map(({ id, title, description, icon: Icon, accent }) => (
                  <div
                    key={id}
                    className={`relative overflow-hidden rounded-3xl border border-gray-100 bg-white/95 p-6 shadow-sm before:absolute before:inset-0 before:bg-gradient-to-br ${accent} before:opacity-60 before:blur-3xl`}
                  >
                    <div className="relative flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <p className="mt-2 text-gray-700 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </Stagger>

          {/* 3. Principios y Objetivos */}
          <Stagger className="space-y-10">
            <motion.div variants={itemVariant} className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-emerald-50 to-white p-8 shadow-sm">
              <div className="flex flex-col gap-3 mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Principios de gestión</p>
                <h3 className="text-3xl font-bold text-gray-900">Cómo hacemos realidad la misión</h3>
                <p className="text-gray-700 max-w-3xl">
                  Nuestros equipos técnicos y las municipalidades socias se rigen por prácticas de acompañamiento cercano, innovación aplicada y absoluta transparencia para que cada intervención sea sostenible.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {principles.map((principle) => (
                  <div key={principle.title} className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">{principle.title}</p>
                    <p className="mt-3 text-gray-700 text-sm leading-relaxed">{principle.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariant} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Objetivos estratégicos</h3>
                  <p className="text-sm text-gray-600">
                    Acciones que marcan la ruta para alcanzar nuestras metas a corto y largo plazo.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {strategicGoals.map((goal) => (
                  <div key={goal.verb} className="rounded-2xl border border-gray-100 bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{goal.verb}</p>
                    <p className="text-base font-medium text-gray-900">{goal.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Stagger>

          {/* 4. Estructura orgánica */}
          <Stagger className="space-y-6">
            <motion.div variants={itemVariant} className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8 shadow-sm">
              <div className="flex flex-col gap-3 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-purple-700">
                  <Users className="w-4 h-4" />
                  Gobernanza CIH
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Estructura orgánica</h3>
                <p className="text-gray-700 max-w-4xl">
                  La toma de decisiones combina órganos de gobernanza política, comités de control y unidades técnicas operativas que aterrizan los proyectos en territorio.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'Asamblea General',
                    detail: '15 alcaldes municipales que definen lineamientos y aprueban presupuestos.'
                  },
                  {
                    title: 'Junta Directiva',
                    detail: 'Representantes propietarios y suplentes que ejecutan acuerdos y supervisan la gerencia.'
                  },
                  {
                    title: 'Junta de Vigilancia',
                    detail: '7 miembros de comisiones ciudadanas y comisionados municipales que garantizan transparencia.'
                  }
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow">
                    <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                    <p className="mt-2 text-sm text-gray-600">{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nivel administrativo</p>
                  <p className="mt-2 text-sm text-gray-700">
                    Gerencia General y Unidad Administrativa que proveen soporte financiero, logístico y de talento humano.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nivel técnico operativo</p>
                  <p className="mt-2 text-sm text-gray-700">
                    Unidades integradas con profesionales multidisciplinarios que ejecutan las líneas de servicio priorizadas.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Organigrama */}
                <motion.div variants={itemVariant} className="border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm bg-white">
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1 text-sm font-semibold text-amber-700">
                      <Users className="w-4 h-4" />
                      Organigrama interactivo
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Mapa institucional en componentes</h4>
                    <p className="text-gray-600 text-sm max-w-3xl">
                      Visualiza la relación entre órganos de gobierno, comités y unidades técnicas dentro del CIH. Desplázate horizontalmente para conocer cada nivel del esquema.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 shadow-inner ring-1 ring-slate-100">
                      <HiguitoOrgChart />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm text-gray-700">
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <span className="inline-block w-4 h-4 rounded-full bg-[#0f172a]" />
                        <p className="font-semibold text-gray-900">Consejo y gobernanza</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <span className="inline-block w-4 h-4 rounded-full bg-[#fcd34d]" />
                        <p className="font-semibold text-gray-900">Comités estratégicos</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <span className="inline-block w-4 h-4 rounded-full bg-[#c7d2fe]" />
                        <p className="font-semibold text-gray-900">Unidades técnicas</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <span className="inline-block w-4 h-4 rounded-full bg-[#bae6fd]" />
                        <p className="font-semibold text-gray-900">Municipalidades y sectores</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <span className="inline-block w-4 h-4 rounded-full bg-[#fee2e2]" />
                        <p className="font-semibold text-gray-900">Aliados estratégicos</p>
                      </div>
                      <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5" />
                        <p className="text-sm">
                          Navega, haz zoom o captura esta vista para tus presentaciones o informes de gestión.
                        </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
          </Stagger>

        </div>
      </section>
    </div>
  );
}
