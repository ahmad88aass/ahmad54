import { supabase } from './supabase';
import type { Notification, Order, OrderStatus, Profile } from './types';

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  var result = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (result.error) {
    console.error('getOrdersForUser error:', result.error);
    return [];
  }
  return result.data as Order[];
}

export async function getAllOrders(): Promise<(Order & { user_code?: string; email?: string })[]> {
  var result = await supabase
    .from('orders')
    .select('*, profiles(user_code, email)')
    .order('created_at', { ascending: false });
  if (result.error) {
    console.error('getAllOrders error:', result.error);
    return [];
  }
  var rows = result.data as any[];
  return rows.map(function (o) {
    var userCode = o.profiles ? o.profiles.user_code : undefined;
    var email = o.profiles ? o.profiles.email : undefined;
    var copy = Object.assign({}, o);
    delete copy.profiles;
    copy.user_code = userCode;
    copy.email = email;
    return copy;
  });
}

export async function getAllUsers(): Promise<Profile[]> {
  var result = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (result.error) {
    console.error('getAllUsers error:', result.error);
    return [];
  }
  return result.data as Profile[];
}

export async function setBalance(userId: string, balance: number): Promise<void> {
  var result = await supabase
    .from('profiles')
    .update({ balance: Number(balance) })
    .eq('id', userId);
  if (result.error) {
    console.error('setBalance error:', result.error);
  }
}

export async function setAdmin(userId: string, isAdmin: boolean): Promise<void> {
  var result = await supabase
    .from('profiles')
    .update({ is_admin: !!isAdmin })
    .eq('id', userId);
  if (result.error) {
    console.error('setAdmin error:', result.error);
  }
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  var result = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (result.error) {
    console.error('getNotifications error:', result.error);
    return [];
  }
  return result.data as Notification[];
}

export async function markNotificationsRead(userId: string): Promise<void> {
  var result = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (result.error) {
    console.error('markNotificationsRead error:', result.error);
  }
}

export async function addNotification(input: { userId: string; title: string; body?: string | null }): Promise<Notification | null> {
  var result = await supabase
    .from('notifications')
    .insert({
      user_id: input.userId,
      title: input.title,
      body: input.body || null,
      read: false,
    })
    .select()
    .maybeSingle();
  if (result.error) {
    console.error('addNotification error:', result.error);
    return null;
  }
  return result.data as Notification;
}

export async function requestRecharge(userCode: string, email: string): Promise<{ ok: boolean }> {
  notifyTelegram('Recharge Request - User: ' + userCode + ' | Email: ' + email);
  return { ok: true };
}

export async function updateOrder(
  orderId: string,
  patch: { status?: OrderStatus; activationCode?: string; notes?: string },
): Promise<Order | undefined> {
  var updateData: any = { updated_at: new Date().toISOString() };
  if (patch.status) { updateData.status = patch.status; }
  if (patch.activationCode) { updateData.activation_code = patch.activationCode; }
  if (patch.notes) { updateData.notes = patch.notes; }

  var result = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .maybeSingle();

  if (result.error) {
    console.error('updateOrder error:', result.error);
    return undefined;
  }var order = result.data as Order;

  if (patch.activationCode && order) {
    await addNotification({
      userId: order.user_id,
      title: 'Activation Code Ready',
      body: 'Code for (' + order.service_name + '): ' + patch.activationCode,
    });
  }

  return order;
}

export async function placeOrder(input: {
  userId: string;
  serviceKey: string;
  serviceName: string;
  plan?: string | null;
  price: number;
  targetInput?: string | null;
  waitForCode?: boolean;
}): Promise<{ ok: boolean; error?: string; order?: Order }> {
  var profileResult = await supabase
    .from('profiles')
    .select('*')
    .eq('id', input.userId)
    .maybeSingle();

  if (profileResult.error || !profileResult.data) {
    return { ok: false, error: 'المستخدم غير موجود.' };
  }

  var user = profileResult.data as Profile;
  var cost = Number(input.price) || 0;

  if (Number(user.balance) < cost) {
    return { ok: false, error: 'رصيد غير كافٍ. يرجى شحن المحفظة أولاً.' };
  }

  var insertResult = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      service_key: input.serviceKey,
      service_name: input.serviceName,
      plan: input.plan || null,
      price: cost,
      target_input: input.targetInput || null,
      status: input.waitForCode ? 'انتظار الكود' : 'قيد المعالجة',
    })
    .select()
    .maybeSingle();

  if (insertResult.error) {
    console.error('placeOrder insert error:', insertResult.error);
    return { ok: false, error: 'حدث خطأ أثناء إنشاء الطلب.' };
  }

  var newBalance = Number(user.balance) - cost;
  var updateResult = await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('id', user.id);

  if (updateResult.error) {
    console.error('placeOrder balance update error:', updateResult.error);
  }

  var telegramMsg = 'New Order: ' + input.serviceName + ' | Price: ' + cost + ' | User: ' + user.user_code;
  notifyTelegram(telegramMsg);

  return { ok: true, order: insertResult.data as Order };
}

function notifyTelegram(text: string): void {
  var BOT_TOKEN = '8062958069:AAHMn-CK9-UN0f2pmsu4H3POi-9I9kPNvo8';
  var CHAT_ID = '6729808723';
  var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
    }),
  }).catch(function (err) {
    console.error('Telegram error:', err);
  });
}
