import type { Notification, Order, OrderStatus, Profile } from './types';

const KEYS = {
  users: 'alameriki.users',
  orders: 'alameriki.orders',
  notes: 'alameriki.notifications',
  session: 'alameriki.session',
  counter: 'alameriki.counter',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / disabled storage — ignore */
  }
}

function uid(prefix = ''): string {
  return (
    prefix +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

function nextUserCode(): string {
  const counter = read<number>(KEYS.counter, 0) + 1;
  write(KEYS.counter, counter);
  return 'AL-' + String(counter).padStart(6, '0');
}

export interface StoredUser extends Profile {
  password: string;
}

function loadUsers(): StoredUser[] {
  return read<StoredUser[]>(KEYS.users, []);
}
function saveUsers(users: StoredUser[]): void {
  write(KEYS.users, users);
}
function loadOrders(): Order[] {
  return read<Order[]>(KEYS.orders, []);
}
function saveOrders(orders: Order[]): void {
  write(KEYS.orders, orders);
}
function loadNotes(): Notification[] {
  return read<Notification[]>(KEYS.notes, []);
}
function saveNotes(notes: Notification[]): void {
  write(KEYS.notes, notes);
}

export function getSession(): { userId: string } | null {
  return read<{ userId: string } | null>(KEYS.session, null);
}
export function setSession(userId: string | null): void {
  if (userId) write(KEYS.session, { userId });
  else localStorage.removeItem(KEYS.session);
}

export function toProfile(u: StoredUser): Profile {
  const { password: _pw, ...profile } = u;
  void _pw;
  return profile;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return loadUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}
export function findUserById(id: string): StoredUser | undefined {
  return loadUsers().find((u) => u.id === id);
}

export function createUser(email: string, password: string): StoredUser {
  const users = loadUsers();
  const user: StoredUser = {
    id: uid('u_'),
    user_id: uid('uid_'),
    user_code: nextUserCode(),
    email,
    password,
    balance: 0,
    is_admin: users.length === 0,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(userId: string, patch: Partial<StoredUser>): StoredUser | undefined {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  return users[idx];
}

export function getAllUsers(): StoredUser[] {
  return loadUsers();
}

export function setBalance(userId: string, balance: number): void {
  updateUser(userId, { balance: Number(balance) || 0 });
}

export function setAdmin(userId: string, isAdmin: boolean): void {
  updateUser(userId, { is_admin: !!isAdmin });
}

export function getOrdersForUser(userId: string): Order[] {
  return loadOrders()
    .filter((o) => o.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getAllOrders(): Order[] {
  return loadOrders().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export interface PlaceOrderInput {
  userId: string;
  serviceKey: string;
  serviceName: string;
  plan?: string | null;
  price: number;
  targetInput?: string | null;
  waitForCode?: boolean;
}

export function placeOrder(input: PlaceOrderInput): { ok: boolean; error?: string; order?: Order } {
  const user = findUserById(input.userId);
  if (!user) return { ok: false, error: 'المستخدم غير موجود.' };
  const cost = Number(input.price) || 0;
  if (Number(user.balance) < cost) {
    return { ok: false, error: 'رصيد غير كافٍ. يرجى شحن المحفظة أولاً.' };
  }

  // deduct balance
  updateUser(user.id, { balance: Number(user.balance) - cost });

  const order: Order = {
    id: uid('o_'),
    user_id: user.id,
    service_key: input.serviceKey,
    service_name: input.serviceName,
    plan: input.plan ?? null,
    price: cost,
    target_input: input.targetInput ?? null,
    status: input.waitForCode ? 'انتظار الكود' : 'قيد المعالجة',
    activation_code: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  // in-app notification
  addNotification({
    userId: user.id,
    title: 'تم استلام طلبك',
    body: `طلب: ${input.serviceName}${input.plan ? ' (' + input.plan + ')' : ''}`,
  });

  // Telegram notification (best-effort console log; real bot requires server-side token)
  notifyTelegram(
    `🛒 طلب جديد\nالخدمة: ${input.serviceName}\n` +
      (input.plan ? `الباقة: ${input.plan}\n` : '') +
      `السعر: $${cost.toFixed(2)}\n` +
      (input.targetInput ? `المدخل: ${input.targetInput}\n` : '') +
      `المستخدم: ${user.user_code}\nالبريد: ${user.email}\n` +
      `رقم الطلب: ${order.id}\n` +
      (input.waitForCode ? '⏳ بانتظار كود التفعيل.' : '⏳ سيتم المعالجة خلال 24 ساعة.'),
  );

  return { ok: true, order };
}

export function updateOrder(
  orderId: string,
  patch: { status?: OrderStatus; activationCode?: string; notes?: string },
): Order | undefined {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return undefined;
  const o = orders[idx];
  const updated: Order = {
    ...o,
    status: patch.status ?? o.status,
    activation_code: patch.activationCode ?? o.activation_code,
    notes: patch.notes ?? o.notes,
    updated_at: new Date().toISOString(),
  };
  orders[idx] = updated;
  saveOrders(orders);

  if (patch.activationCode) {
    addNotification({
      userId: o.user_id,
      title: 'كود التفعيل جاهز',
      body: `كود التفعيل لطلبك (${o.service_name}): ${patch.activationCode}`,
    });
  }
  return updated;
}

export function requestRecharge(userCode: string, email: string): { ok: boolean } {
  notifyTelegram(
    `🔔 طلب شحن رصيد جديد\nالمستخدم: ${userCode}\nالبريد: ${email}\nيرجى تأكيد الشحن يدوياً.`,
  );
  return { ok: true };
}

export interface AddNotificationInput {
  userId: string;
  title: string;
  body?: string | null;
}

export function addNotification(input: AddNotificationInput): Notification {
  const notes = loadNotes();
  const n: Notification = {
    id: uid('n_'),
    user_id: input.userId,
    title: input.title,
    body: input.body ?? null,
    read: false,
    created_at: new Date().toISOString(),
  };
  notes.push(n);
  saveNotes(notes);
  return n;
}

export function getNotifications(userId: string): Notification[] {
  return loadNotes()
    .filter((n) => n.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function markNotificationsRead(userId: string): void {
  const notes = loadNotes();
  const updated = notes.map((n) => (n.user_id === userId ? { ...n, read: true } : n));
  saveNotes(updated);
}

/**
 * Telegram notification shim.
 * In production this would POST to the Telegram Bot API from a server-side
 * function using TELEGRAM_BOT_TOKEN and admin chat id 6729808723. Because the
 * browser cannot hold the bot token, we log to console here; the message text
 * is also delivered to the admin via the in-app admin panel orders list.
 */
function notifyTelegram(text: string): void {
  // eslint-disable-next-line no-console
  console.info('[Telegram → admin 6729808723]', text);
}
