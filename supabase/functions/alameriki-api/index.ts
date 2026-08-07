import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const ADMIN_CHAT_ID = "6729808723";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

async function sendTelegram(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN not configured");
    return;
  }
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      },
    );
  } catch (e) {
    console.error("telegram send error", e);
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/alameriki-api/, "");
    const body = req.method === "POST" || req.method === "PUT"
      ? await req.json().catch(() => ({}))
      : {};

    // ---- Recharge request: notify admin on Telegram ----
    if (path === "/recharge-request" && req.method === "POST") {
      const { userCode, email } = body;
      if (!userCode) return json({ error: "missing userCode" }, 400);
      const text =
        `🔔 <b>طلب شحن رصيد جديد</b>\n\n` +
        `المستخدم: <code>${userCode}</code>\n` +
        `البريد: ${email ?? "—"}\n\n` +
        `يرجى التواصل مع المستخدم وتأكيد الشحن يدوياً.`;
      await sendTelegram(text);
      return json({ ok: true });
    }

    // ---- Order placed: deduct balance, create order, notify admin ----
    if (path === "/place-order" && req.method === "POST") {
      const {
        userId,
        userCode,
        email,
        serviceKey,
        serviceName,
        plan,
        price,
        targetInput,
      } = body;
      if (!userId || !serviceKey) {
        return json({ error: "missing fields" }, 400);
      }

      // Verify balance with service role
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("id, balance")
        .eq("user_id", userId)
        .maybeSingle();
      if (pErr || !profile) {
        return json({ error: "profile not found" }, 404);
      }
      const cost = Number(price) || 0;
      if (Number(profile.balance) < cost) {
        return json({ error: "رصيد غير كافٍ. يرجى شحن المحفظة أولاً." }, 402);
      }

      // Deduct balance
      const newBalance = Number(profile.balance) - cost;
      const { error: balErr } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", profile.id);
      if (balErr) {
        return json({ error: "balance update failed" }, 500);
      }

      // Determine initial status
      const status = serviceKey === "whatsapp_numbers"
        ? "انتظار الكود"
        : "قيد المعالجة";

      const { data: order, error: oErr } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          service_key: serviceKey,
          service_name: serviceName,
          plan: plan ?? null,
          price: cost,
          target_input: targetInput ?? null,
          status,
        })
        .select()
        .single();
      if (oErr) {
        // refund on failure
        await supabase
          .from("profiles")
          .update({ balance: Number(profile.balance) })
          .eq("id", profile.id);
        return json({ error: "order insert failed" }, 500);
      }

      // Notify user in-app
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "تم استلام طلبك",
        body: `طلب: ${serviceName}${plan ? " (" + plan + ")" : ""} — رقم الطلب: ${order.id.slice(0, 8)}`,
      });

      // Notify admin on Telegram
      const tgText =
        `🛒 <b>طلب خدمة جديد</b>\n\n` +
        `الخدمة: ${serviceName}\n` +
        (plan ? `الباقة: ${plan}\n` : "") +
        `السعر: $${cost.toFixed(2)}\n` +
        (targetInput ? `المدخل: <code>${targetInput}</code>\n` : "") +
        `المستخدم: <code>${userCode}</code>\n` +
        `البريد: ${email ?? "—"}\n` +
        `رقم الطلب: <code>${order.id}</code>\n\n` +
        (serviceKey === "whatsapp_numbers"
          ? "⏳ بانتظار إرسال كود التفعيل من الإدارة."
          : "⏳ سيتم المعالجة خلال 24 ساعة.");
      await sendTelegram(tgText);

      return json({ ok: true, order });
    }

    // ---- Admin: list all users ----
    if (path === "/admin/users" && req.method === "GET") {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, user_code, email, balance, is_admin, created_at")
        .order("created_at", { ascending: true });
      if (error) return json({ error: error.message }, 500);
      return json({ users: data });
    }

    // ---- Admin: list all orders ----
    if (path === "/admin/orders" && req.method === "GET") {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, user_id, service_key, service_name, plan, price, target_input, status, activation_code, notes, created_at, updated_at, profiles:user_id(user_code, email)",
        )
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ orders: data });
    }

    // ---- Admin: update balance ----
    if (path === "/admin/balance" && req.method === "POST") {
      const { userId, balance } = body;
      if (!userId || balance === undefined) {
        return json({ error: "missing fields" }, 400);
      }
      const { error } = await supabase
        .from("profiles")
        .update({ balance: Number(balance) })
        .eq("user_id", userId);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    // ---- Admin: update order status / send activation code ----
    if (path === "/admin/order" && req.method === "POST") {
      const { orderId, status, activationCode, notes } = body;
      if (!orderId) return json({ error: "missing orderId" }, 400);
      const update: Record<string, unknown> = {};
      if (status !== undefined) update.status = status;
      if (activationCode !== undefined) update.activation_code = activationCode;
      if (notes !== undefined) update.notes = notes;
      const { error } = await supabase
        .from("orders")
        .update(update)
        .eq("id", orderId);
      if (error) return json({ error: error.message }, 500);

      // Notify the user in-app about activation code
      if (activationCode) {
        const { data: order } = await supabase
          .from("orders")
          .select("user_id, service_name")
          .eq("id", orderId)
          .maybeSingle();
        if (order) {
          await supabase.from("notifications").insert({
            user_id: order.user_id,
            title: "كود التفعيل جاهز",
            body: `كود التفعيل لطلبك (${order.service_name}): ${activationCode}`,
          });
        }
      }
      return json({ ok: true });
    }

    // ---- Admin: promote/demote admin flag ----
    if (path === "/admin/set-admin" && req.method === "POST") {
      const { userId, isAdmin } = body;
      if (!userId) return json({ error: "missing userId" }, 400);
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !!isAdmin })
        .eq("user_id", userId);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "not found" }, 404);
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "server error" },
      500,
    );
  }
});
