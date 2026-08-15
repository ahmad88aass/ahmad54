import { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  Wallet,
  Loader2,
  RefreshCw,
  Check,
  X,
  KeyRound,
  Search,
  Crown,
  AlertCircle,
} from 'lucide-react';
import {
  adminListOrders,
  adminListUsers,
  adminSetAdmin,
  adminUpdateBalance,
  adminUpdateOrder,
} from '@/lib/api';
import type { Order, OrderStatus, Profile } from '@/lib/types';
import { formatMoney, formatDate, shortId } from '@/lib/format';
import { ServiceGlyph, categoryColor } from '@/components/BrandIcons';
import { getService } from '@/lib/services';

type Tab = 'users' | 'orders';

type AdminOrder = Order & { user_code?: string; email?: string };

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (tab === 'users') {
      const data = await adminListUsers();
      setUsers(data);
    } else {
      const data = await adminListOrders();
      setOrders(data);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredUsers = users.filter(
    (u) =>
      !query ||
      u.user_code.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredOrders = orders.filter(
    (o) =>
      !query ||
      o.service_name.includes(query) ||
      (o.user_code ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (o.email ?? '').toLowerCase().includes(query.toLowerCase()),
  );

  const setBalance = async (u: Profile, raw: string) => {
    const bal = Number(raw);
    if (Number.isNaN(bal)) return;
    setBusyId(u.id);
    await adminUpdateBalance(u.id, bal);
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, balance: bal } : x)));
    setBusyId(null);
  };

  const setOrderStatus = async (o: AdminOrder, status: OrderStatus) => {
    setBusyId(o.id);
    await adminUpdateOrder(o.id, { status });
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status } : x)));
    setBusyId(null);
  };

  const sendCode = async (o: AdminOrder) => {
    const code = window.prompt('أدخل كود التفعيل لإرساله للمستخدم:');
    if (!code) return;
    setBusyId(o.id);
    await adminUpdateOrder(o.id, { activationCode: code, status: 'مكتمل' });
    setOrders((prev) =>
      prev.map((x) =>
        x.id === o.id
          ? { ...x, activation_code: code, status: 'مكتمل' as OrderStatus }
          : x,
      ),
    );
    setBusyId(null);
  };

  const toggleAdmin = async (u: Profile) => {
    setBusyId(u.id);
    await adminSetAdmin(u.id, !u.is_admin);
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_admin: !x.is_admin } : x)));
    setBusyId(null);
  };

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center gap-2">
        <ShieldCheck size={22} className="text-error" />
        <h2 className="text-xl font-extrabold text-text">لوحة الإدارة</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat icon={Users} label="المستخدمون" value={users.length} color="text-accent" />
        <Stat icon={ShoppingBag} label="الطلبات" value={orders.length} color="text-primary" />
        <Stat
          icon={Wallet}
          label="إجمالي الأرصدة"
          value={formatMoney(users.reduce((s, u) => s + Number(u.balance), 0))}
          color="text-success"
        />
      </div>

      <div className="flex items-center gap-1 p-1 bg-surface/60 rounded-2xl border border-border-soft"><TabBtn active={tab === 'users'} onClick={() => setTab('users')} icon={Users} label="المستخدمون" />
        <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} icon={ShoppingBag} label="الطلبات" />
        <div className="flex-1" />
        <button
          onClick={load}
          className="grid place-items-center w-9 h-9 rounded-xl bg-surface-2 hover:bg-border text-muted hover:text-text transition-colors"
          aria-label="تحديث"
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث..."
          className="w-full rounded-2xl bg-surface-2 border border-border-soft focus:border-primary/40 pr-9 pl-4 py-2.5 text-sm text-text outline-none transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-faint">
          <Loader2 size={24} className="spin" />
        </div>
      ) : tab === 'users' ? (
        <div className="space-y-2.5">
          {filteredUsers.length === 0 ? (
            <Empty icon={Users} text="لا يوجد مستخدمون." />
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-text">{u.user_code}</span>
                      {u.is_admin && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-error bg-error/10 border border-error/30 rounded-full px-1.5 py-0.5">
                          <Crown size={9} /> أدمن
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate" dir="ltr">{u.email}</p>
                    <p className="text-[10px] text-faint mt-0.5">{formatDate(u.created_at)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <label className="text-[10px] text-faint">الرصيد ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={Number(u.balance)}
                      onBlur={(e) => setBalance(u, e.target.value)}
                      disabled={busyId === u.id}
                      className="w-24 rounded-lg bg-surface-2 border border-border-soft focus:border-primary/50 px-2 py-1.5 text-sm font-bold text-text outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleAdmin(u)}
                    disabled={busyId === u.id}
                    className={text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      u.is_admin
                        ? 'bg-error/10 hover:bg-error/20 text-error'
                        : 'bg-surface-2 hover:bg-border text-muted'
                    }}
                  >
                    {u.is_admin ? 'إزالة الأدمن' : 'تعيين أدمن'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.length === 0 ? (
            <Empty icon={ShoppingBag} text="لا توجد طلبات." />) : (
            filteredOrders.map((o) => {
              const svc = getService(o.service_key);
              const cat = svc?.category ?? 'telegram';
              const colors = categoryColor[cat];
              return (
                <div key={o.id} className="glass rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className={grid place-items-center w-10 h-10 rounded-xl ${colors.bg} ${colors.text} shrink-0}>
                      <ServiceGlyph category={cat} size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-extrabold text-text truncate">{o.service_name}</h3>
                        <span className="text-[10px] text-faint" dir="ltr">#{shortId(o.id)}</span>
                      </div>
                      <p className="text-[11px] text-muted">
                        {o.user_code ?? '—'} • {o.email ?? ''}
                      </p>
                      <p className="text-[11px] text-faint mt-0.5">{formatDate(o.created_at)}</p>
                      {o.plan && <p className="text-xs text-muted mt-1">الباقة: {o.plan}</p>}
                      {o.target_input && (
                        <p className="text-xs text-muted truncate">
                          المدخل: <span className="font-mono text-text" dir="ltr">{o.target_input}</span>
                        </p>
                      )}
                      {o.activation_code && (
                        <p className="text-xs text-success mt-1 flex items-center gap-1">
                          <KeyRound size={12} /> الكود: <span className="font-mono" dir="ltr">{o.activation_code}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-extrabold text-gradient-gold shrink-0">{formatMoney(o.price)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(['قيد المعالجة', 'انتظار الكود', 'مكتمل', 'ملغي'] as OrderStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setOrderStatus(o, s)}
                        disabled={busyId === o.id}
                        className={inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                          o.status === s
                            ? 'bg-primary/15 border-primary/40 text-primary'
                            : 'bg-surface-2 border-border-soft text-muted hover:text-text'
                        }}
                      >
                        {s === 'مكتمل' && <Check size={11} />}
                        {s === 'ملغي' && <X size={11} />}
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => sendCode(o)}
                      disabled={busyId === o.id}
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 transition-colors"
                    >
                      <KeyRound size={11} /> إرسال كود
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="flex items-start gap-2 rounded-2xl bg-warning/10 border border-warning/30 p-3 text-[11px] text-warning leading-relaxed">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <span>
          تذكير: لإشعارات تيليجرام الفورية بالطلبات وطلبات الشحن، يلزم ربط متغيّر TELEGRAM_BOT_TOKEN من جهة خادمية. تُسجَّل الإشعارات حالياً في وحدة تحكّم المتصفّح لحين الربط.
        </span>
      </div>
    </div>
  );
}function Stat({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: number | string; color: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <Icon size={16} className={${color} mx-auto mb-1} />
      <p className="text-[10px] text-faint">{label}</p>
      <p className="text-sm font-extrabold text-text">{value}</p>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Users; label: string }) {
  return (
    <button
      onClick={onClick}
      className={inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
        active ? 'bg-primary text-bg glow-primary' : 'text-muted hover:text-text'
      }}
    >
      <Icon size={15} /> {label}
    </button>
  );
}

function Empty({ icon: Icon, text }: { icon: typeof Users; text: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-faint">
      <Icon size={32} className="opacity-30 mb-2" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
