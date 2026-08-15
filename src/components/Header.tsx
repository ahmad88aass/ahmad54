import { useEffect, useRef, useState } from 'react';
import {
  Plus,
  Bell,
  MoreVertical,
  Share2,
  Headphones,
  Wallet,
  Check,
} from 'lucide-react';
import { ShieldBadge, UsaFlag } from './BrandIcons';
import { TICKER_TEXT } from '@/lib/services';
import { useAuth } from '@/lib/auth';
import { formatMoney, timeAgo } from '@/lib/format';
import { getNotifications, markNotificationsRead } from '@/lib/store';
import type { Notification } from '@/lib/types';

interface HeaderProps {
  onRecharge: () => void;
  onShare: () => void;
  onSupport: () => void;
  onNavigateWallet: () => void;
}

export function Header({ onRecharge, onShare, onSupport, onNavigateWallet }: HeaderProps) {
  const { profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notes, setNotes] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
    var active = true;
    const load = async () => {
      const data = (await getNotifications(profile.id)).slice(0, 20);
      if (!active) return;
      setNotes(data);
      setUnread(data.filter((n) => !n.read).length);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [profile]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const markAllRead = async () => {
    if (!profile || unread === 0) return;
    setUnread(0);
    setNotes((prev) => prev.map((n) => ({ ...n, read: true })));
    await markNotificationsRead(profile.id);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Ticker */}
      <div className="bg-gradient-to-l from-[#11161f] via-[#0c1018] to-[#11161f] border-b border-border-soft overflow-hidden">
        <div className="ticker-track py-1.5 text-[11px] sm:text-xs text-primary font-bold tracking-wide">
          {[0, 1].map((dup) => (
            <span key={dup} className="inline-flex items-center gap-2 px-6" aria-hidden={dup === 1}>
              <UsaFlag size={14} />
              {TICKER_TEXT}
              <span className="text-faint">•</span>
              <UsaFlag size={14} />
              {TICKER_TEXT}
              <span className="text-faint">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div className="glass-soft border-b border-border-soft">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldBadge size={38} className="shrink-0 drop-shadow" />
            <div className="flex items-center gap-2 min-w-0">
              <UsaFlag size={26} className="shrink-0" />
              <div className="min-w-0">
                <h1 className="font-display text-xl font-extrabold text-gradient-gold leading-none truncate">
                  الأميركي
                </h1>
                <p className="text-[10px] text-faint leading-none mt-1">المتجر الرقمي</p>
              </div>
            </div>
          </div>
          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wallet badge */}
            <button
              onClick={onNavigateWallet}
              className="group flex items-center gap-2 rounded-2xl bg-surface-2 border border-border-soft hover:border-primary/40 pl-1 pr-3 py-1.5 transition-colors"aria-label="المحفظة"
            >
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onRecharge();
                }}
                className="grid place-items-center w-7 h-7 rounded-xl bg-primary text-bg font-extrabold hover:brightness-110 transition pulse-ring"
                aria-label="شحن الرصيد"
              >
                <Plus size={16} strokeWidth={3} />
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-faint">الرصيد</span>
                <span className="text-sm font-extrabold text-text group-hover:text-primary transition-colors">
                  {formatMoney(profile?.balance ?? 0)}
                </span>
              </span>
            </button>

            {/* Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => {
                  setBellOpen((v) => !v);
                  if (!bellOpen) markAllRead();
                }}
                className="relative grid place-items-center w-10 h-10 rounded-2xl bg-surface-2 border border-border-soft hover:border-border text-muted hover:text-text transition-colors"
                aria-label="الإشعارات"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[10px] font-extrabold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] glass rounded-2xl shadow-2xl overflow-hidden scale-in origin-top-left">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border-soft">
                    <span className="text-sm font-extrabold text-text">الإشعارات</span>
                    <span className="text-[11px] text-faint">{notes.length} إشعار</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto no-scrollbar">
                    {notes.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-faint">
                        <Bell size={22} className="mx-auto mb-2 opacity-40" />
                        لا توجد إشعارات بعد
                      </div>
                    ) : (
                      notes.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 border-b border-border-soft/50 last:border-0 hover:bg-surface-2/60 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-text">{n.title}</p>
                              {n.body && <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.body}</p>}
                              <p className="text-[10px] text-faint mt-1">{timeAgo(n.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Options menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="grid place-items-center w-10 h-10 rounded-2xl bg-surface-2 border border-border-soft hover:border-border text-muted hover:text-text transition-colors"aria-label="القائمة"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="absolute left-0 mt-2 w-56 glass rounded-2xl shadow-2xl overflow-hidden scale-in origin-top-left">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onShare();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors text-right"
                  >
                    <Share2 size={17} className="text-accent" />
                    <span className="text-sm font-bold text-text">مشاركة المتجر</span>
                  </button>
                  <div className="border-t border-border-soft" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onSupport();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors text-right"
                  >
                    <Headphones size={17} className="text-primary" />
                    <span className="text-sm font-bold text-text">الدعم الفني</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative neon underline */}
      <div className="h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent" />
    </header>
  );
}
