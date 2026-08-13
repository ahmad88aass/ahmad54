import { useState } from 'react';
import { Loader2, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { ShieldBadge, UsaFlag } from './BrandIcons';
import { useAuth } from '@/lib/auth';
import { TICKER_TEXT } from '@/lib/services';

export function AuthScreen() {
  const { signIn, signUp, signInWithGoogle, signInWithFacebook, error } = useAuth();
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
      var res = await signIn(email.trim(), password);
      if (!res.error) {
        window.location.reload();
      }
    } else {
      var res2 = await signUp(email.trim(), password);
      if (!res2.error) {
        setLocalErr('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setMode('signin');
      }
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
                className={py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                  mode === 'signin' ? 'bg-primary text-bg glow-primary' : 'text-muted hover:text-text'
                }}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => { setMode('signup'); setLocalErr(null); }}
                className={py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                  mode === 'signup' ? 'bg-primary text-bg glow-primary' : 'text-muted hover:text-text'
                }}
              >
                إنشاء حساب
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
                  <inputtype="email"
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

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border-soft"></div>
              <span className="text-xs text-faint">أو</span>
              <div className="flex-1 h-px bg-border-soft"></div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-gray-800 font-bold text-sm hover:brightness-95 transition border border-border-soft"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.6 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.8l6.6 5.6C41.9 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
                </svg>
                المتابعة عبر جوجل
              </button>

              <button
                type="button"
                onClick={() => signInWithFacebook()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#1877F2] text-white font-bold text-sm hover:brightness-110 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                المتابعة عبر فيسبوك
              </button>
            </div>

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
