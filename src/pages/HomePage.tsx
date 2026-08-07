import { useMemo, useState } from 'react';
import { Sparkles, Zap, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { ShieldBadge, UsaFlag } from '@/components/BrandIcons';
import { SERVICES } from '@/lib/services';
import type { ServiceCategory, ServiceDef } from '@/lib/types';

interface HomePageProps {
  onBuy: (s: ServiceDef) => void;
}

type Filter = 'all' | ServiceCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'whatsapp', label: 'واتساب' },
  { key: 'telegram', label: 'تيليجرام' },
  { key: 'instagram', label: 'انستغرام' },
];

export function HomePage({ onBuy }: HomePageProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(
    () => (filter === 'all' ? SERVICES : SERVICES.filter((s) => s.category === filter)),
    [filter],
  );

  return (
    <div className="space-y-7 fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass p-6 sm:p-9 glow-primary">
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-56 h-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          <div className="flex items-center gap-3">
            <ShieldBadge size={72} className="shrink-0 drop-shadow-xl" />
            <UsaFlag size={40} className="hidden sm:block" />
          </div>
          <div className="flex-1 text-center sm:text-right">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1 mb-3">
              <Sparkles size={12} /> متجر رقمي موثوق
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text leading-tight">
              خدمات رقمية <span className="text-gradient-gold">احترافية</span> بين يديك
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed max-w-xl">
              أرقام واتساب افتراضية، تيليجرام بريميوم، توثيق الحسابات، تربية الحسابات، وفك الحظر — كل ذلك بأمان وسرعة.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
          {[
            { icon: Zap, label: 'تنفيذ سريع', color: 'text-accent' },
            { icon: ShieldCheck, label: 'معاملات آمنة', color: 'text-success' },
            { icon: Clock, label: 'دعم 24/7', color: 'text-primary' },
            { icon: TrendingUp, label: 'أسعار منافسة', color: 'text-tg' },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 rounded-2xl bg-surface-2/70 border border-border-soft px-3 py-2.5"
            >
              <f.icon size={16} className={f.color} />
              <span className="text-[11px] font-bold text-text">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filter + grid */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-extrabold text-text">خدماتنا الرقمية</h3>
          <div className="flex items-center gap-1 p-1 bg-surface/60 rounded-2xl border border-border-soft overflow-x-auto no-scrollbar max-w-full">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filter === f.key
                    ? 'bg-primary text-bg glow-primary'
                    : 'text-muted hover:text-text'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((s, i) => (
            <ServiceCard key={s.key} service={s} onBuy={onBuy} index={i} />
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="rounded-3xl glass p-5 sm:p-6 text-center">
        <p className="text-sm text-muted">
          القيادة العامة:{' '}
          <a href="tel:+963984335910" dir="ltr" className="text-primary font-bold hover:underline">
            +963 984 335 910
          </a>
        </p>
      </section>
    </div>
  );
}
