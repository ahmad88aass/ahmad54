import { Home, ShoppingBag, Wallet, User, ShieldCheck } from 'lucide-react';
import type { Page } from '@/lib/types';

interface SideNavProps {
  page: Page;
  onChange: (p: Page) => void;
  isAdmin?: boolean;
  ordersCount?: number;
}

const TABS: { key: Page; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'الرئيسية', icon: Home },
  { key: 'orders', label: 'طلباتي', icon: ShoppingBag },
  { key: 'wallet', label: 'المحفظة', icon: Wallet },
  { key: 'profile', label: 'حسابي', icon: User },
];

export function SideNav({ page, onChange, isAdmin, ordersCount = 0 }: SideNavProps) {
  return (
    <aside className="hidden sm:block w-60 shrink-0">
      <div className="sticky top-24 space-y-1.5">
        {TABS.map((t) => {
          const active = page === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-right ${
                active
                  ? 'bg-primary/10 border-primary/40 text-primary glow-primary'
                  : 'bg-surface/40 border-border-soft text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.6 : 2} />
              <span className="font-bold text-sm flex-1">{t.label}</span>
              {t.key === 'orders' && ordersCount > 0 && (
                <span className="grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-error text-white text-[10px] font-extrabold">
                  {ordersCount > 9 ? '9+' : ordersCount}
                </span>
              )}
            </button>
          );
        })}

        {isAdmin && (
          <>
            <div className="h-px bg-border-soft my-2" />
            <button
              onClick={() => onChange('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-right ${
                page === 'admin'
                  ? 'bg-error/10 border-error/40 text-error'
                  : 'bg-surface/40 border-border-soft text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <ShieldCheck size={20} />
              <span className="font-bold text-sm">لوحة الإدارة</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
