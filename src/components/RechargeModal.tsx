import { useState } from 'react';
import { Copy, Check, Send, Loader2, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { TELEGRAM_AGENT } from '@/lib/services';
import { formatMoney } from '@/lib/format';
import { useAuth } from '@/lib/auth';
import { requestRecharge } from '@/lib/api';

interface RechargeModalProps {
  open: boolean;
  onClose: () => void;
}

export function RechargeModal({ open, onClose }: RechargeModalProps) {
  const { user, profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const userCode = profile?.user_code ?? '—';
  const telegramLink = `https://t.me/${TELEGRAM_AGENT}?text=${encodeURIComponent(
    `مرحباً، أرغب بشحن رصيدي في متجر الأميركي.\nمعرّف المستخدم الخاص بي: ${userCode}\nالبريد: ${user?.email ?? ''}`,
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleNotify = async () => {
    if (!profile) return;
    setSending(true);
    setErr(null);
    const r = requestRecharge(profile.user_code, profile.email);
    setSending(false);
    if (r.ok) setSent(true);
    else setErr('تعذّر إرسال الطلب.');
  };

  return (
    <Modal open={open} onClose={onClose} title="شحن المحفظة" size="sm">
      <div className="space-y-5">
        <div className="rounded-2xl bg-surface-2 border border-border-soft p-4">
          <p className="text-xs text-muted mb-1">رصيدك الحالي</p>
          <p className="text-2xl font-extrabold text-gradient-gold">{formatMoney(profile?.balance ?? 0)}</p>
        </div>

        <div className="rounded-2xl bg-bg-soft border border-border p-4">
          <p className="text-xs text-muted mb-2">معرّف المستخدم الخاص بك (User ID)</p>
          <div className="flex items-center justify-between gap-3">
            <code className="text-lg font-extrabold text-primary tracking-wider">{userCode}</code>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-surface-2 hover:bg-border text-text transition-colors"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              {copied ? 'تم النسخ' : 'نسخ'}
            </button>
          </div>
          <p className="text-[11px] text-faint mt-3 leading-relaxed">
            احتفظ بهذا المعرّف، فهو ما يحدد حسابك عند الشحن.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
          <p className="text-sm font-bold text-text">آلية الشحن يدوية:</p>
          <ol className="text-xs text-muted space-y-1 list-decimal pr-4 leading-relaxed">
            <li>تواصل مع الوكيل عبر تيليجرام واطلب الشحن.</li>
            <li>أرسل معرّف المستخدم الخاص بك مع قيمة الشحن.</li>
            <li>سيقوم الوكيل بإضافة الرصيد إلى محفظتك يدوياً.</li>
          </ol>
        </div>

        {err && (
          <div className="flex items-center gap-2 text-xs text-error bg-error/10 border border-error/30 rounded-xl p-3">
            <AlertCircle size={15} /> {err}
          </div>
        )}

        {sent ? (
          <div className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/30 rounded-xl p-3">
            <Check size={16} /> تم إرسال إشعار طلب الشحن إلى الإدارة. تواصل مع الوكيل لإتمام الشحن.
          </div>
        ) : (
          <button
            onClick={handleNotify}
            disabled={sending || !profile}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-surface-2 hover:bg-border text-text font-bold transition-colors disabled:opacity-50"
          >
            {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            إشعار الإدارة بطلب الشحن
          </button>
        )}

        <a
          href={telegramLink}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-l from-[#2aabee] to-[#1c8cc4] text-white font-extrabold shadow-lg glow-tg hover:brightness-110 transition"
        >
          <Send size={18} />
          التواصل مع الوكيل للشحن
        </a>
        <p className="text-center text-[11px] text-faint">Telegram: @{TELEGRAM_AGENT}</p>
      </div>
    </Modal>
  );
}
