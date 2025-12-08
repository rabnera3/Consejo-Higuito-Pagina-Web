import { ReactNode } from 'react';
import { ResponsiveImage } from './ResponsiveImage';
import logoImg from '../img/logo01.webp';

interface NodeBoxProps {
  children: ReactNode;
  color?: string;
  textColor?: string;
  className?: string;
}

function NodeBox({ children, color = 'bg-white', textColor = 'text-gray-900', className = '' }: NodeBoxProps) {
  return (
    <div
      className={`${color} ${textColor} border border-gray-300 px-3 py-2 text-[11px] font-semibold text-center shadow-sm rounded-md flex items-center justify-center min-h-[42px] ${className}`}
    >
      {children}
    </div>
  );
}

function VLine({ height = 'h-6' }: { height?: string }) {
  return <div className={`w-[2px] bg-gray-300 mx-auto ${height}`} />;
}

interface DepartmentColumnProps {
  title: string;
  items: string[];
  withConnector?: boolean;
}

function DepartmentColumn({ title, items, withConnector = false }: DepartmentColumnProps) {
  return (
    <div className="flex flex-col items-center w-32 mx-1">
      {withConnector && <div className="h-4 w-[2px] bg-gray-300 mb-1" />}
      <NodeBox color="bg-[#fbbf24]" className="w-full h-14 text-[10px] uppercase tracking-wide">
        {title}
      </NodeBox>
      {items.length > 0 && <VLine height="h-3" />}
      <div className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <NodeBox key={item} color="bg-sky-100" className="w-full text-[10px] font-medium py-1">
            {item}
          </NodeBox>
        ))}
      </div>
    </div>
  );
}

function SideBox({ title, color = 'bg-emerald-50' }: { title: string; color?: string }) {
  return (
    <div className={`${color} border border-gray-300 px-3 py-2 text-[11px] font-semibold text-center rounded-md shadow-sm w-full`}>
      {title}
    </div>
  );
}

const logoSrc = logoImg;

const departmentColumns = [
  { title: 'Soporte', items: ['Asistente administrativo'] },
  { title: 'Fortalecimiento institucional', items: ['Fortalecimiento administrativo', 'Desarrollo social'] },
  { title: 'Desarrollo económico regional', items: ['Técnico de campo 1', 'Técnico de campo 2'] },
  { title: 'Infraestructura social', items: ['Agua y saneamiento', 'Infraestructura social', 'Topografía'] },
  { title: 'Planificación territorial', items: ['Catastro', 'Ambiente', 'Formulación de proyectos'] },
  { title: 'Seguridad alimentaria nutricional', items: ['Agrícola', 'Salud y nutrición', 'Fortalecimiento institucional', 'Seguimiento y monitoreo'] }
];

const strategicPartners = [
  'Secretarías de Estado',
  'Cooperación Internacional',
  'AMHON',
  'Academia',
  'Institutos técnicos',
  'CD MIPYMES',
  'ONGs'
];

const externalSectors = [
  'Departamentos municipales',
  'Entidades públicas locales',
  'Sector privado',
  'Sociedad civil organizada'
];

export function HiguitoOrgChart() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1100px] rounded-3xl border border-gray-200 bg-gradient-to-b from-white via-slate-50 to-white p-6 shadow-sm">
        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full border border-emerald-100 bg-white shadow flex items-center justify-center p-4">
              <ResponsiveImage src={logoSrc} alt="Logo Consejo Higuito" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Consejo Intermunicipal</p>
              <h2 className="text-2xl font-bold text-slate-800">Higuito</h2>
              <p className="text-sm text-slate-500">Organigrama institucional 2025</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-start gap-8">
          {/* Left column */}
          <div className="w-40 flex flex-col gap-4 mt-16">
            <NodeBox color="bg-sky-100" className="uppercase text-xs">Sectores estratégicos</NodeBox>
            <VLine height="h-8" />
            <div className="border-l-2 border-gray-200 ml-8 pl-4 py-3 flex flex-col gap-3">
              <NodeBox color="bg-amber-200" className="text-[11px]">Mesas regionales</NodeBox>
              <NodeBox color="bg-amber-200" className="text-[11px]">Mesas municipales</NodeBox>
            </div>
          </div>

          {/* Center column */}
          <div className="flex-1 flex flex-col items-center">
            <NodeBox color="bg-white" className="w-64 uppercase tracking-wide border-2 border-gray-300 shadow-sm">Consejo Intermunicipal Higuito</NodeBox>
            <VLine />
            <NodeBox color="bg-[#7ac142]" textColor="text-white" className="w-44 uppercase">Asamblea</NodeBox>
            <VLine />

            <div className="flex items-start gap-6 mt-2">
              <div className="flex flex-col items-center">
                <NodeBox color="bg-[#7ac142]" textColor="text-white" className="w-36 text-[11px]">
                  Junta de Vigilancia
                </NodeBox>
              </div>
              <div className="flex flex-col items-center gap-2">
                <NodeBox color="bg-[#7ac142]" textColor="text-white" className="w-44">
                  Junta Directiva
                </NodeBox>
                <VLine />
                <NodeBox color="bg-[#7ac142]" textColor="text-white" className="w-44">
                  Gerencia
                </NodeBox>
              </div>
            </div>

            <VLine />
              <div className="w-72 h-[2px] bg-gray-300" />
              <div className="flex gap-8 -mt-1">
                {[ 'Comité de innovación y calidad', 'Comité estratégico' ].map((committee) => (
                  <div key={committee} className="flex flex-col items-center">
                    <div className="h-4 w-[2px] bg-gray-300" />
                    <NodeBox color="bg-lime-200" className="w-48 text-[11px]">
                      {committee}
                    </NodeBox>
                  </div>
                ))}
              </div>

            <div className="flex flex-col items-center w-full mt-8">
              <VLine height="h-4" />
                <div className="w-[92%] border-t-2 border-gray-300" />
                <div className="flex justify-center gap-2 flex-wrap -mt-1">
                  {departmentColumns.map((column) => (
                    <DepartmentColumn key={column.title} title={column.title} items={column.items} withConnector />
                  ))}
                </div>
            </div>

            <div className="flex flex-col items-center w-full mt-10">
              <div className="w-[70%] h-4 border border-gray-300 rounded-t-xl border-b-0" />
              <NodeBox color="bg-amber-100" className="w-48">Municipalidades</NodeBox>
              <VLine height="h-4" />
              <div className="w-[60%] border-t-2 border-gray-300" />
              <div className="flex justify-evenly w-[60%]">
                {externalSectors.map((sector) => (
                  <div key={sector} className="h-4 w-[2px] bg-gray-300" />
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {externalSectors.map((sector) => (
                  <NodeBox key={sector} color="bg-amber-100" className="w-40 text-[10px]">
                    {sector}
                  </NodeBox>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-40 mt-10 flex flex-col items-center">
            <NodeBox color="bg-sky-100" className="uppercase text-xs">Aliados estratégicos</NodeBox>
            <VLine height="h-8" />
            <div className="relative w-full pl-4">
              <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-200" />
              <div className="flex flex-col gap-2">
                {strategicPartners.map((partner) => (
                  <SideBox key={partner} title={partner} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HiguitoOrgChart;
