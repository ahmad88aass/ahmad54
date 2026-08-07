import { ChevronLeft, Hash } from 'lucide-react';
import { ServiceGlyph, categoryColor } from './BrandIcons';
import type { ServiceDef } from '@/lib/types';
import { formatMoney } from '@/lib/format';

interface ServiceCardProps {
  service: ServiceDef;
  onBuy: (s: ServiceDef) => void;
  index?: number;
}

export function ServiceCard({ service, onBuy, index = 0 }: ServiceCardProps) {
  const colors = categoryColor[service.category];
  const minPrice = service.plans ? Math.min(...service.plans.map((p) => p.price)) : service.price ?? 0;

  return (
    <button
      onClick={() => onBuy(service)}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`group relative text-right glass rounded-3xl p-5 card-hover fade-in ${colors.glow} hover:${colors.glow}`}
    >
      {/* glow border on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
           style={{ boxShadow: `inset 0 0 0 1px currentColor` }} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`grid place-items-center w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} shrink-0`}>
          <ServiceGlyph category={service.category} size={30} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold text-text leading-tight">{service.name}</h3>
          <p className="text-[11px] text-muted mt-0.5">{service.tagline}</p>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
        {service.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-faint">يبدأ من</span>
          <span className="text-lg font-extrabold text-gradient-gold leading-none">
            {formatMoney(minPrice)}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl ${colors.bg} ${colors.text} group-hover:gap-2 transition-all`}
        >
          <Hash size={13} />
          {service.cardCta ?? 'اطلب الآن'}
          <ChevronLeft size={14} className="-mr-1 group-hover:-mr-2 transition-all" />
        </span>
      </div>
    </button>
  );
}
