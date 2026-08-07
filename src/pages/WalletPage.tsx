import { Wallet as WalletIcon, Plus, Send, TrendingUp, ArrowDownLeft, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { formatMoney, formatDate, shortId } from '@/lib/format';
import { TELEGRAM_AGENT } from '@/lib/services';

interface WalletPageProps {
  onRecharge: () => void;
}

export function WalletPage({ onRecharge }: WalletPageProps) {
  const { profile } = useAuth();

  const telegramLink = `https://t.me/${TELEGRAM_AGENT}?text=${encodeURIComponent(
    `مرحباً، أرغب بشحن رصيدي في متجر الأميركي.\nمعرّف المستخدم الخاص بي: ${profile?.user_code ?? ''}`,
  )}`;

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center gap-2">
        <WalletIcon size={22} className="text-primary" />
        <h2 className="text-xl font-extrabold text-text">المحفظة</h2>
      </div>

      {/* Balance card */}
      <div className="relative overflow-hidden rounded-3xl glass p-6 glow-primary">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs text-muted mb-1">الرصيد المتاح</p>
          <p className="text-4xl font-extrabold text-gradient-gold leading-none">{formatMoney(profile?.balance ?? 0)}</p>

          <div className="mt-5 rounded-2xl bg-surface-2/80 border border-border-soft p-3.5">
            <p className="text-[10px] text-faint mb-1">معرّف المستخدم (User ID)</p>
            <p className="text-xl font-extrabold text-text tracking-wider">{profile?.user_code ?? '—'}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-4">
            <button
              onClick={onRecharge}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-primary text-bg font-extrabold hover:brightness-110 transition glow-primary"
            >
              <Plus size={18} strokeWidth={3} /> شحن الرصيد
            </button>
            <a
              href={telegramLink}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-surface-2 hover:bg-border border border-border-soft text-text font-bold transition-colors"
            >
              <Send size={16} className="text-tg" /> التواصل مع الوكيل للشحن
            </a>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-text">
          <ArrowDownLeft size={16} className="text-accent" /> كيف تتم عملية الشحن؟
        </div>
        <ol className="text-xs text-muted space-y-2 leading-relaxed list-decimal pr-4">
          <li>اضغط على "شحن الرصيد" أو تواصل مع الوكيل مباشرة عبر تيليجرام.</li>
          <li>أرسل معرّف المستخدم الخاص بك <code className="text-primary font-bold">{profile?.user_code}</code> مع قيمة الشحن.</li>
          <li>يقوم الوكيل بإضافة الرصيد إلى محفظتك يدوياً خلال وقت قصير.</li>
          <li>ستصلك إشعار فور إضافة الرصيد إلى حسابك.</li>
        </ol>
      </div>

      {/* Stats placeholders */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <TrendingUp size={18} className="text-success mb-2" />
          <p className="text-[11px] text-muted">الرصيد المتاح</p>
          <p className="text-lg font-extrabold text-text">{formatMoney(profile?.balance ?? 0)}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <Clock size={18} className="text-primary mb-2" />
          <p className="text-[11px] text-muted">عضو منذ</p>
          <p className="text-sm font-extrabold text-text">{profile ? formatDate(profile.created_at) : '—'}</p>
        </div>
      </div>

      <p className="text-center text-[11px] text-faint leading-relaxed">
        جميع عمليات الشحن تتم يدوياً عبر الوكيل المعتمد @{TELEGRAM_AGENT}. لا يوجد شحن تلقائي مجاني.
      </p>
    </div>
  );
}
