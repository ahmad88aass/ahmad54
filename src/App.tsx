import { useCallback, useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AuthScreen } from '@/components/AuthScreen';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { SideNav } from '@/components/SideNav';
import { RechargeModal } from '@/components/RechargeModal';
import { ShareModal } from '@/components/ShareModal';
import { SupportModal } from '@/components/SupportModal';
import { ServicePurchaseModal } from '@/components/ServicePurchaseModal';
import { HomePage } from '@/pages/HomePage';
import { OrdersPage } from '@/pages/OrdersPage';
import { WalletPage } from '@/pages/WalletPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import { getOrdersForUser } from '@/lib/store';
import type { Page, ServiceDef } from '@/lib/types';

function Shell() {
  const { profile, loading, signOut } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [buyService, setBuyService] = useState<ServiceDef | null>(null);
  const [ordersTick, setOrdersTick] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  const openRecharge = useCallback(() => setRechargeOpen(true), []);
  const openShare = useCallback(() => setShareOpen(true), []);
  const openSupport = useCallback(() => setSupportOpen(true), []);

  const handleBuy = useCallback((s: ServiceDef) => setBuyService(s), []);

  const handleOrdered = useCallback(() => {
    setOrdersTick((t) => t + 1);
    setPage('orders');
  }, []);

  useEffect(() => {
    if (!profile) return;
    var active = true;
    const load = async () => {
      const orders = await getOrdersForUser(profile.id);
      if (!active) return;
      const count = orders.filter(
        (o) => o.status === 'قيد المعالجة' || o.status === 'انتظار الكود',
      ).length;
      setOrdersCount(count);
    };
    load();
    return () => {
      active = false;
    };
  }, [profile, ordersTick]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-faint">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary spin" />
          <p className="text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <AuthScreen />;
  }

  const isAdmin = profile.is_admin;
  const effectivePage = page === 'admin' && !isAdmin ? 'home' : page;

  return (
    <div className="min-h-screen pb-24 sm:pb-0">
      <Header
        onRecharge={openRecharge}
        onShare={openShare}
        onSupport={openSupport}
        onNavigateWallet={() => setPage('wallet')}
      />

      <div className="mx-auto max-w-5xl px-4 py-6 flex gap-6">
        <SideNav
          page={effectivePage}
          onChange={setPage}
          isAdmin={isAdmin}
          ordersCount={ordersCount}
        />
        <main className="flex-1 min-w-0">
          {effectivePage === 'home' && <HomePage onBuy={handleBuy} />}
          {effectivePage === 'orders' && <OrdersPage key={ordersTick} />}
          {effectivePage === 'wallet' && <WalletPage onRecharge={openRecharge} />}
          {effectivePage === 'profile' && (
            <ProfilePage
              onRecharge={openRecharge}
              onSignOut={signOut}
              onAdmin={() => setPage('admin')}
            />
          )}
          {effectivePage === 'admin' && isAdmin && <AdminPage />}
        </main>
      </div>

      <BottomNav page={effectivePage} onChange={setPage} ordersCount={ordersCount} /><RechargeModal open={rechargeOpen} onClose={() => setRechargeOpen(false)} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <ServicePurchaseModal
        service={buyService}
        open={!!buyService}
        onClose={() => setBuyService(null)}
        onRechargeOpen={openRecharge}
        onOrdered={handleOrdered}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
