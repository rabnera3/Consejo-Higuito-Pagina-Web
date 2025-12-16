import { ResponsiveImage } from './ResponsiveImage';
import { Download, ExternalLink, Info } from 'lucide-react';
import organigramaImage from '../img/organigrama.avif';

export function InstitutionalOrgChart() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="h-4 w-4 text-emerald-600" />
          <p className="text-sm font-medium">
            Versión estática del organigrama oficial. Pulsa la imagen para ampliarla en otra pestaña.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={organigramaImage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver grande
          </a>
          <a
            href={organigramaImage}
            download="organigrama-cih.avif"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
          >
            <Download className="h-3.5 w-3.5" />
            Descargar
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-3 shadow-inner">
        <a href={organigramaImage} target="_blank" rel="noreferrer" className="block">
          <ResponsiveImage
            src={organigramaImage}
            alt="Organigrama institucional del Consejo Intermunicipal Higuito"
            sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1200px"
            className="h-auto w-full rounded-2xl border border-white object-contain"
          />
        </a>
      </div>

      <p className="text-center text-xs text-slate-500">
        Actualizado 2025 · Distribución oficial según manual de organización CIH.
      </p>
    </div>
  );
}

export default InstitutionalOrgChart;
