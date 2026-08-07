import { useEffect, useMemo, useState } from 'react';
import {
  ShoppingBag,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  KeyRound,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { getOrdersForUser } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import type { Order, OrderStatus } from '@/lib/types';
import { formatMoney, formatDate, shortId } from '@/lib/format';
import { ServiceGlyph, categoryColor } from '@/components/BrandIcons';
import { getService } from '@/lib/services';

const STATUS_META: Record<OrderStatus, { icon: typeof Clock; color: string; bg: string }> = {
  'قيد المعالجة': { icon: Clock, color: 'text-warning', bg: 'bg-warning/10 border-warning/30' },
  'انتظار الكود': { icon: Hash, color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
  'مكتمل': { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10 border-success/30' },
  'ملغي': { icon: XCircle, color: 'text-error', bg: 'bg-error/10 border-error/30' },
};

export function OrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const load = () => {
    if (!profile) return;
    setOrders(getOrdersForUser(profile.id));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const filtered = useMemo(
    () => (filter === 'all' ? orders ?? [] : (orders ?? []).filter((o) => o.status === filter)),
    [orders, filter],
  );

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* ignore */
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    (orders ?? []).forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1));
    return c;
  }, [orders]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-faint">
        <Loader2 size={28} className="spin mb-3" />
        <p className="text-sm">جاري تحميل طلباتك...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShoppingBag size={22} className="text-primary" />
          <h2 className="text-xl font-extrabold text-text">طلباتي</h2>
        </div>
        <button
          onClick={load}
          className="grid place-items-center w-9 h-9 rounded-xl bg-surface-2 border border-border-soft text-muted hover:text-text transition-colors"
          aria-label="تحديث"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'قيد المعالجة', 'انتظار الكود', 'مكتمل', 'ملغي'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filter === f
                ? 'bg-primary/10 border-primary/40 text-primary'
                : 'bg-surface/40 border-border-soft text-muted hover:text-text'
            }`}
          >
            {f === 'all' ? 'الكل' : f}
            <span className="text-[10px] opacity-70">({counts[f] ?? 0})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-faint">
          <ShoppingBag size={40} className="opacity-30 mb-3" />
          <p className="text-sm font-bold">لا توجد طلبات بعد</p>
          <p className="text-xs mt-1">تصفّح المتجر وابدأ أول طلب لك.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const svc = getService(o.service_key);
            const cat = svc?.category ?? 'telegram';
            const colors = categoryColor[cat];
            const sm = STATUS_META[o.status];
            return (
              <div key={o.id} className="glass rounded-2xl p-4 fade-in">
                <div className="flex items-start gap-3">
                  <span className={`grid place-items-center w-11 h-11 rounded-xl ${colors.bg} ${colors.text} shrink-0`}>
                    <ServiceGlyph category={cat} size={22} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-text truncate">{o.service_name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sm.bg} ${sm.color}`}>
                        <sm.icon size={11} /> {o.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-faint mt-1">
                      <span dir="ltr">#{shortId(o.id)}</span>
                      <span>•</span>
                      <span>{formatDate(o.created_at)}</span>
                    </div>
                    {o.plan && (
                      <p className="text-xs text-muted mt-1.5">الباقة: <span className="font-bold text-text">{o.plan}</span></p>
                    )}
                    {o.target_input && (
                      <p className="text-xs text-muted mt-0.5 truncate">
                        المدخل: <span className="font-mono text-text" dir="ltr">{o.target_input}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-[10px] text-faint">المبلغ</p>
                    <p className="text-sm font-extrabold text-gradient-gold">{formatMoney(o.price)}</p>
                  </div>
                </div>

                {/* Activation code */}
                {o.activation_code && (
                  <div className="mt-3 rounded-xl bg-primary/5 border border-primary/30 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary mb-1.5">
                      <KeyRound size={13} /> كود التفعيل
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm font-extrabold text-text tracking-wider break-all" dir="ltr">
                        {o.activation_code}
                      </code>
                      <button
                        onClick={() => copyCode(o.activation_code!)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-surface-2 hover:bg-border text-text transition-colors shrink-0"
                      >
                        {copied === o.activation_code ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                        {copied === o.activation_code ? 'تم' : 'نسخ'}
                      </button>
                    </div>
                  </div>
                )}

                {o.notes && (
                  <p className="text-xs text-muted mt-2 bg-surface-2/50 rounded-lg p-2 leading-relaxed">
                    {o.notes}
                  </p>
                )}

                {o.status === 'انتظار الكود' && !o.activation_code && (
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-warning">
                    <AlertCircle size={13} />
                    <span>بانتظار إرسال كود التفعيل من الإدارة.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
