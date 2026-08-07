import { Home, ShoppingBag, Wallet, User } from 'lucide-react';
import type { Page } from '@/lib/types';

interface BottomNavProps {
  page: Page;
  onChange: (p: Page) => void;
  ordersCount?: number;
}

const TABS: { key: Page; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'الرئيسية', icon: Home },
  { key: 'orders', label: 'طلباتي', icon: ShoppingBag },
  { key: 'wallet', label: 'المحفظة', icon: Wallet },
  { key: 'profile', label: 'حسابي', icon: User },
];

export function BottomNav({ page, onChange, ordersCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 sm:hidden">
      <div className="glass border-t border-border-soft px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4 gap-1">
          {TABS.map((t) => {
            const active = page === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className="relative flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl transition-colors"
              >
                <span
                  className={`relative grid place-items-center w-9 h-9 rounded-xl transition-all ${
                    active ? 'bg-primary/15 text-primary glow-primary' : 'text-faint'
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.6 : 2} />
                  {t.key === 'orders' && ordersCount > 0 && (
                    <span className="absolute -top-1 -right-1 grid place-items-center min-w-[16px] h-4 px-1 rounded-full bg-error text-white text-[9px] font-extrabold">
                      {ordersCount > 9 ? '9+' : ordersCount}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10px] font-bold transition-colors ${
                    active ? 'text-primary' : 'text-faint'
                  }`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
