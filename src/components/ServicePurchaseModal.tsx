import { useMemo, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  Check,
  Wallet,
  ShieldCheck,
  Clock,
  Hash,
  Sparkles,
} from 'lucide-react';
import { Modal } from './Modal';
import { ServiceGlyph, categoryColor } from './BrandIcons';
import type { ServiceDef, ServicePlan } from '@/lib/types';
import { formatMoney } from '@/lib/format';
import { useAuth } from '@/lib/auth';
import { placeOrder } from '@/lib/api';

interface Props {
  service: ServiceDef | null;
  open: boolean;
  onClose: () => void;
  onRechargeOpen: () => void;
  onOrdered?: () => void;
}

export function ServicePurchaseModal({
  service,
  open,
  onClose,
  onRechargeOpen,
  onOrdered,
}: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ plan: string; flow: string; code: boolean } | null>(null);

  const effectivePrice = service?.price ?? selectedPlan?.price ?? 0;
  const balance = profile?.balance ?? 0;
  const insufficient = effectivePrice > balance;

  const requiresInput = !!service?.inputLabel;
  const inputValid = useMemo(() => {
    if (!service || !requiresInput) return true;
    const v = input.trim();
    if (!v) return false;
    if (service.inputType === 'username') return v.startsWith('@') ? v.length > 3 : v.length >= 3;
    if (service.inputType === 'phone') return v.replace(/\D/g, '').length >= 7;
    return v.length >= 2;
  }, [input, service, requiresInput]);

  const canSubmit =
    !!service &&
    !!user &&
    !submitting &&
    !insufficient &&
    inputValid &&
    (service.plans ? !!selectedPlan : true);

  const reset = () => {
    setSelectedPlan(null);
    setInput('');
    setError(null);
    setDone(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!service  !user  !profile || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    const planLabel = service.plans
      ? selectedPlan?.label ?? ''
      : service.presetPlan ?? service.name;
    const r = await placeOrder({
      userId: user.id,
      serviceKey: service.key,
      serviceName: service.name,
      plan: planLabel,
      price: effectivePrice,
      targetInput: input.trim() || null,
      waitForCode: !!service.waitForCode,
    });
    setSubmitting(false);
    if (!r.ok) {
      setError(r.error ?? 'فشل تنفيذ الطلب.');
      return;
    }
    await refreshProfile();
    setDone({
      plan: planLabel,
      flow: service.flowMessage ?? 'تم استلام طلبك بنجاح.',
      code: !!service.waitForCode,
    });
    onOrdered?.();
  };

  if (!service) return null;
  const colors = categoryColor[service.category];

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <span
            className={grid place-items-center w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} shrink-0}
          >
            <ServiceGlyph category={service.category} size={30} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold text-text leading-tight">{service.name}</h3>
            <p className="text-xs text-muted">{service.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed">{service.description}</p>

        {done ? (
          <div className="space-y-4 fade-in">
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <span className="grid place-items-center w-16 h-16 rounded-full bg-success/15 text-success pulse-ring"><Check size={30} />
              </span>
              <h4 className="text-lg font-extrabold text-text">تم استلام طلبك بنجاح</h4>
              <p className="text-sm text-muted max-w-xs">
                {done.flow}
              </p>
            </div>

            <div className="rounded-2xl bg-surface-2 border border-border-soft p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">الخدمة</span>
                <span className="font-bold text-text">{service.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">الباقة</span>
                <span className="font-bold text-text">{done.plan}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">المبلغ المخصوم</span>
                <span className="font-bold text-primary">{formatMoney(effectivePrice)}</span>
              </div>
            </div>

            {done.code && (
              <div className="flex items-start gap-2 rounded-2xl bg-warning/10 border border-warning/30 p-3 text-xs text-warning leading-relaxed">
                <Clock size={15} className="shrink-0 mt-0.5" />
                <span>طلبك الآن بحالة "انتظار الكود". سيصلك كود التفعيل عبر الإشعارات فور توفره.</span>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full px-4 py-3 rounded-2xl bg-primary text-bg font-extrabold hover:brightness-110 transition glow-primary"
            >
              حسناً، عودة للمتجر
            </button>
          </div>
        ) : (
          <>
            {service.plans && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted">اختر الباقة</p>
                <div className="grid grid-cols-2 gap-2">
                  {service.plans.map((p) => {
                    const active = selectedPlan?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlan(p)}
                        className={flex flex-col items-start gap-0.5 p-3 rounded-2xl border text-right transition-all ${
                          active
                            ? 'border-primary bg-primary/10 glow-primary'
                            : 'border-border-soft bg-surface-2 hover:border-border'
                        }}
                      >
                        <span className="text-sm font-bold text-text">{p.label}</span>
                        <span className="text-lg font-extrabold text-gradient-gold">
                          {formatMoney(p.price)}
                        </span>
                        {active && (
                          <span className="flex items-center gap-1 text-[10px] text-primary font-bold mt-1">
                            <Check size={11} /> مختارة
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {requiresInput && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted block">{service.inputLabel}</label>
                {service.inputType === 'textarea' ? (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={service.inputPlaceholder}
                    rows={3}
                    className="w-full rounded-2xl bg-surface-2 border border-border-soft focus:border-primary/50 px-4 py-3 text-sm text-text outline-none resize-none transition-colors"/>
                ) : (
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={service.inputPlaceholder}
                    dir={service.inputType === 'username' || service.inputType === 'phone' ? 'ltr' : 'rtl'}
                    className="w-full rounded-2xl bg-surface-2 border border-border-soft focus:border-primary/50 px-4 py-3 text-sm text-text outline-none transition-colors"
                  />
                )}
              </div>
            )}

            <div className="rounded-2xl bg-bg-soft border border-border-soft p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted">
                  <Wallet size={14} /> رصيدك الحالي
                </span>
                <span className="font-bold text-text">{formatMoney(balance)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted">
                  <Hash size={14} /> سعر الطلب
                </span>
                <span className="font-bold text-text">{formatMoney(effectivePrice)}</span>
              </div>
              <div className="border-t border-border-soft pt-2 flex items-center justify-between">
                <span className="text-sm text-muted">الرصيد بعد الطلب</span>
                <span
                  className={font-extrabold ${insufficient ? 'text-error' : 'text-success'}}
                >
                  {formatMoney(Math.max(0, balance - effectivePrice))}
                </span>
              </div>
            </div>

            {insufficient && (
              <div className="flex items-start gap-2 rounded-2xl bg-error/10 border border-error/30 p-3 text-xs text-error leading-relaxed">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>رصيدك غير كافٍ لتنفيذ هذا الطلب. يرجى شحن المحفظة أولاً.</span>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 rounded-2xl bg-error/10 border border-error/30 p-3 text-xs text-error leading-relaxed">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-faint">
              <ShieldCheck size={13} className="text-accent" />
              <span>معاملة آمنة — يتم خصم الرصيد فقط عند نجاح الطلب.</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full inline-flex items-ce
