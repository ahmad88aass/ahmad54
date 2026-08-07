import { useState } from 'react';
import { Loader2, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { ShieldBadge, UsaFlag } from './BrandIcons';
import { useAuth } from '@/lib/auth';
import { TICKER_TEXT } from '@/lib/services';

export function AuthScreen() {
  const { signIn, signUp, error } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErr, setLocalErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);
    if (!email.trim() || !password) {
      setLocalErr('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }
    if (password.length < 6) {
      setLocalErr('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }
    setBusy(true);
    if (mode === 'signin') {
      await signIn(email.trim(), password);
    } else {
      await signUp(email.trim(), password);
    }
    setBusy(false);
  };

  const displayErr = localErr ?? error;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-l from-[#11161f] via-[#0c1018] to-[#11161f] border-b border-border-soft overflow-hidden">
        <div className="ticker-track py-1.5 text-[11px] text-primary font-bold tracking-wide">
          {[0, 1].map((d) => (
            <span key={d} className="inline-flex items-center gap-2 px-6">
              <UsaFlag size={14} /> {TICKER_TEXT} <span className="text-faint">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md scale-in">
          <div className="flex flex-col items-center text-center mb-7">
            <ShieldBadge size={64} className="mb-3 drop-shadow-lg" />
            <div className="flex items-center gap-2.5">
              <UsaFlag size={30} />
              <h1 className="font-display text-3xl font-extrabold text-gradient-gold">الأميركي</h1>
            </div>
            <p className="text-sm text-muted mt-2">المتجر الرقمي المتكامل للخدمات الرقمية</p>
          </div>

          <div className="glass rounded-3xl p-6 shadow-2xl">
            <div className="grid grid-cols-2 gap-1 p-1 bg-bg-soft rounded-2xl mb-5">
              <button
                onClick={() => { setMode('signin'); setLocalErr(null); }}
                className={`py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                  mode === 'signin' ? 'bg-primary text-bg glow-primary' : 'text-muted hover:text-text'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => { setMode('signup'); setLocalErr(null); }}
                className={`py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                  mode === 'signup' ? 'bg-primary text-bg glow-primary' : 'text-muted hover:text-text'
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl bg-surface-2 border border-border-soft focus:border-primary/50 pr-10 pl-4 py-3 text-sm text-text outline-none transition-colors text-left"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted">كلمة المرور</label>
                <div className="relative">
                  <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
                  <input
                    type="password"
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-surface-2 border border-border-soft focus:border-primary/50 pr-10 pl-4 py-3 text-sm text-text outline-none transition-colors text-left"
                  />
                </div>
              </div>

              {displayErr && (
                <div className="flex items-start gap-2 text-xs text-error bg-error/10 border border-error/30 rounded-xl p-3">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{displayErr}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-primary text-bg font-extrabold hover:brightness-110 transition glow-primary disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 size={18} className="spin" />
                ) : mode === 'signin' ? (
                  <><LogIn size={18} /> دخول المتجر</>
                ) : (
                  <><UserPlus size={18} /> إنشاء الحساب</>
                )}
              </button>
            </form>

            <p className="text-center text-[11px] text-faint mt-4 leading-relaxed">
              {mode === 'signin'
                ? 'إذا لم يكن لديك حساب، أنشئ واحداً لتتمكن من الشراء.'
                : 'بإنشاء حساب توافق على شروط استخدام المتجر.'}
            </p>
          </div>

          <p className="text-center text-[11px] text-faint mt-4">
            جميع المعاملات آمنة ومحمية • الدعم الفني متاح على مدار الساعة
          </p>
        </div>
      </div>
    </div>
  );
}
