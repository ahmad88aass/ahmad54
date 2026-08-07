import { User as UserIcon, LogOut, Mail, Hash, Wallet, ShieldCheck, Copy, Check, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { formatMoney, formatDate } from '@/lib/format';
import { useState } from 'react';

interface ProfilePageProps {
  onRecharge: () => void;
  onSignOut: () => void;
  onAdmin: () => void;
}

export function ProfilePage({ onRecharge, onSignOut, onAdmin }: ProfilePageProps) {
  const { profile, user } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(profile?.user_code ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center gap-2">
        <UserIcon size={22} className="text-primary" />
        <h2 className="text-xl font-extrabold text-text">حسابي</h2>
      </div>

      {/* Profile card */}
      <div className="relative overflow-hidden rounded-3xl glass p-6 text-center">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="grid place-items-center w-20 h-20 rounded-full bg-primary/15 text-primary mx-auto mb-3 glow-primary">
            <UserIcon size={36} />
          </div>
          {profile?.is_admin && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-error bg-error/10 border border-error/30 rounded-full px-2.5 py-0.5 mb-2">
              <Crown size={11} /> حساب إدارة
            </span>
          )}
          <h3 className="text-lg font-extrabold text-text" dir="ltr">{profile?.email ?? user?.email}</h3>
          <p className="text-xs text-faint mt-1">عضو منذ {profile ? formatDate(profile.created_at) : '—'}</p>
        </div>
      </div>

      {/* Details list */}
      <div className="glass rounded-2xl divide-y divide-border-soft overflow-hidden">
        <Row icon={<Hash size={16} className="text-primary" />} label="معرّف المستخدم">
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-text tracking-wider">{profile?.user_code ?? '—'}</span>
            <button
              onClick={copyId}
              className="grid place-items-center w-7 h-7 rounded-lg bg-surface-2 hover:bg-border text-muted hover:text-text transition-colors"
              aria-label="نسخ"
            >
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            </button>
          </div>
        </Row>
        <Row icon={<Mail size={16} className="text-accent" />} label="البريد الإلكتروني">
          <span className="text-sm text-text" dir="ltr">{profile?.email ?? user?.email}</span>
        </Row>
        <Row icon={<Wallet size={16} className="text-success" />} label="رصيد المحفظة">
          <span className="text-sm font-extrabold text-gradient-gold">{formatMoney(profile?.balance ?? 0)}</span>
        </Row>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={onRecharge}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-primary text-bg font-extrabold hover:brightness-110 transition glow-primary"
        >
          <Wallet size={18} /> شحن المحفظة
        </button>

        {profile?.is_admin && (
          <button
            onClick={onAdmin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-error/10 hover:bg-error/20 border border-error/30 text-error font-bold transition-colors"
          >
            <ShieldCheck size={18} /> لوحة الإدارة
          </button>
        )}

        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-surface-2 hover:bg-border border border-border-soft text-muted hover:text-error font-bold transition-colors"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="text-xs font-bold text-muted">{label}</span>
      </div>
      <div className="text-left min-w-0">{children}</div>
    </div>
  );
}
