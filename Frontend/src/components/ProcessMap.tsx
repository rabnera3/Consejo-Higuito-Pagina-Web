import { ChevronRight } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';

type TierCard = {
  label: string;
  variant?: 'chevron' | 'block';
};

type Tier = {
  id: string;
  title: string;
  description: string;
  gradient: string;
  textColor: string;
  cards: TierCard[];
};

const tiers: Tier[] = [
  {
    id: 'strategic',
    title: 'Procesos estratégicos',
    description: 'Definen la dirección y articulación intermunicipal.',
    gradient: 'from-emerald-200 to-lime-100',
    textColor: 'text-emerald-950',
    cards: [
      { label: 'Direccionamiento Estratégico' },
      { label: 'Gestión de Relaciones Interinstitucionales' }
    ]
  },
  {
    id: 'operational',
    title: 'Procesos operativos',
    description: 'Transforman la estrategia en servicios y resultados.',
    gradient: 'from-slate-600 via-slate-500 to-slate-600',
    textColor: 'text-white',
    cards: [
      { label: 'Planificación de Servicios', variant: 'block' },
      { label: 'Prestación de Servicios', variant: 'chevron' },
      { label: 'Gestión de Proyectos', variant: 'chevron' },
      { label: 'Seguimiento de Resultados e Impacto', variant: 'chevron' }
    ]
  },
  {
    id: 'support',
    title: 'Procesos de apoyo',
    description: 'Sostienen la operación mediante talento, datos y recursos.',
    gradient: 'from-sky-300 to-indigo-200',
    textColor: 'text-slate-900',
    cards: [
      { label: 'Gestión del Talento Humano' },
      { label: 'Gestión de Información y Conocimiento' },
      { label: 'Gestión de Recursos' }
    ]
  },
  {
    id: 'evaluation',
    title: 'Procesos de evaluación, mejora y aprendizaje',
    description: 'Aseguran la mejora continua del sistema.',
    gradient: 'from-indigo-100 to-blue-100',
    textColor: 'text-slate-900',
    cards: [{ label: 'Gestión de Evaluación y Mejora' }]
  }
];

type ProcessMapProps = {
  imageSrc?: string;
  imageAlt?: string;
};

export function ProcessMap({
  imageSrc,
  imageAlt = 'Mapa de procesos del CIH',
}: ProcessMapProps) {
  const officialImage = imageSrc?.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Mapa de procesos</p>
        <h3 className="text-3xl font-bold text-gray-900">Cómo se organiza nuestro Sistema de Gestión de Calidad</h3>
      </div>

      <div className="hidden md:flex flex-col gap-6" aria-live="polite">
        {tiers.map((tier) => (
          <section
            key={tier.id}
            className={`rounded-3xl bg-gradient-to-r ${tier.gradient} ${tier.textColor} p-4 shadow-lg`}
          >
            <div className="flex flex-col gap-1 pb-4">
              <p className="text-sm font-semibold uppercase tracking-wide opacity-90">{tier.title}</p>
              <p className="text-sm opacity-80">{tier.description}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {tier.cards.map((card) => (
                <div
                  key={card.label}
                  className={`flex-1 min-w-[180px] rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow ${
                    card.variant === 'chevron' ? 'relative overflow-hidden pl-6 pr-8' : ''
                  } ${card.variant === 'block' ? 'max-w-sm' : ''}`}
                >
                  {card.variant === 'chevron' && (
                    <>
                      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-200 to-amber-400" />
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" />
                    </>
                  )}
                  {card.variant === 'block' && (
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Planeación</span>
                  )}
                  {card.label}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="md:hidden space-y-4 rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-sm" aria-label="Mapa de procesos">
        {officialImage ? (
          <a
            href={officialImage}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-slate-100 overflow-hidden"
          >
            <ResponsiveImage src={officialImage} alt={imageAlt} className="w-full object-contain" />
          </a>
        ) : (
          <div className="space-y-3 text-sm text-slate-600">
            {tiers.map((tier) => (
              <div key={tier.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tier.title}</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{tier.description}</p>
                <ul className="mt-3 space-y-1 text-slate-700">
                  {tier.cards.map((card) => (
                    <li key={card.label} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      {card.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcessMap;
