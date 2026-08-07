import {
  getAllOrders,
  getAllUsers,
  placeOrder as storePlaceOrder,
  requestRecharge as storeRequestRecharge,
  setAdmin as storeSetAdmin,
  setBalance as storeSetBalance,
  updateOrder as storeUpdateOrder,
} from './store';
import type { Order, OrderStatus, Profile } from './types';

export function placeOrder(input: {
  userId: string;
  serviceKey: string;
  serviceName: string;
  plan?: string | null;
  price: number;
  targetInput?: string | null;
  waitForCode?: boolean;
}): { ok: boolean; error?: string; order?: Order } {
  return storePlaceOrder(input);
}

export function requestRecharge(userCode: string, email: string): { ok: boolean } {
  return storeRequestRecharge(userCode, email);
}

export function adminListUsers(): Profile[] {
  return getAllUsers().map((u) => {
    const { password: _pw, ...p } = u;
    void _pw;
    return p;
  });
}

export function adminListOrders(): (Order & { user_code?: string; email?: string })[] {
  const users = getAllUsers();
  return getAllOrders().map((o) => {
    const u = users.find((x) => x.id === o.user_id);
    return { ...o, user_code: u?.user_code, email: u?.email };
  });
}

export function adminUpdateBalance(userId: string, balance: number): void {
  storeSetBalance(userId, balance);
}

export function adminUpdateOrder(
  orderId: string,
  patch: { status?: OrderStatus; activationCode?: string; notes?: string },
): void {
  storeUpdateOrder(orderId, patch);
}

export function adminSetAdmin(userId: string, isAdmin: boolean): void {
  storeSetAdmin(userId, isAdmin);
}
