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

export async function placeOrder(input: {
  userId: string;
  serviceKey: string;
  serviceName: string;
  plan?: string | null;
  price: number;
  targetInput?: string | null;
  waitForCode?: boolean;
}): Promise<{ ok: boolean; error?: string; order?: Order }> {
  return storePlaceOrder(input);
}

export async function requestRecharge(userCode: string, email: string): Promise<{ ok: boolean }> {
  return storeRequestRecharge(userCode, email);
}

export async function adminListUsers(): Promise<Profile[]> {
  var users = await getAllUsers();
  return users;
}

export async function adminListOrders(): Promise<(Order & { user_code?: string; email?: string })[]> {
  var orders = await getAllOrders();
  return orders;
}

export async function adminUpdateBalance(userId: string, balance: number): Promise<void> {
  await storeSetBalance(userId, balance);
}

export async function adminUpdateOrder(
  orderId: string,
  patch: { status?: OrderStatus; activationCode?: string; notes?: string },
): Promise<void> {
  await storeUpdateOrder(orderId, patch);
}

export async function adminSetAdmin(userId: string, isAdmin: boolean): Promise<void> {
  await storeSetAdmin(userId, isAdmin);
}
