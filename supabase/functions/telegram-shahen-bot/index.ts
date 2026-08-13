// Supabase Edge Function: telegram-shahen-bot
import { createClient } from 'jsr:@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const ADMIN_CHAT_ID = Deno.env.get('ADMIN_CHAT_ID')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function sendMessage(chatId, text) {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' }),
  });
}

Deno.serve(async (req) => {
  try {
    var update = await req.json();
    var message = update.message;
    if (!message || !message.text) {
      return new Response('ok', { status: 200 });
    }

    var chatId = message.chat.id;
    var text = message.text.trim();

    if (String(chatId) !== String(ADMIN_CHAT_ID)) {
      await sendMessage(chatId, 'Not authorized to use this bot.');
      return new Response('ok', { status: 200 });
    }

    if (text === '/start' || text === '/help') {
      var helpMsg = 'Welcome to Al-Amriki charging bot.' + '\n\n' +
        'To charge a customer balance:' + '\n' +
        '<code>/shahen AL-000123 50</code>' + '\n\n' +
        '(customer code then amount in dollars)' + '\n\n' +
        'To check a customer balance:' + '\n' +
        '<code>/check AL-000123</code>';
      await sendMessage(chatId, helpMsg);
      return new Response('ok', { status: 200 });
    }

    if (text.indexOf('/check') === 0) {
      var parts1 = text.split(/\s+/);
      var userCode1 = parts1[1];
      if (!userCode1) {
        await sendMessage(chatId, 'Format: /check AL-000123');
        return new Response('ok', { status: 200 });
      }

      var result1 = await supabase
        .from('profiles')
        .select('user_code, email, balance')
        .eq('user_code', userCode1.toUpperCase())
        .maybeSingle();

      var profile1 = result1.data;
      var error1 = result1.error;

      if (error1 || !profile1) {
        await sendMessage(chatId, 'Customer not found with code: ' + userCode1);
        return new Response('ok', { status: 200 });
      }

      var msg1 = 'Customer: ' + profile1.user_code + '\n' +
        'Email: ' + profile1.email + '\n' +
        'Balance: $' + Number(profile1.balance).toFixed(2);
      await sendMessage(chatId, msg1);
      return new Response('ok', { status: 200 });
    }

    if (text.indexOf('/shahen') === 0) {
      var parts2 = text.split(/\s+/);
      var userCode2 = parts2[1];
      var amountStr = parts2[2];
      var amount = Number(amountStr);

      var isBad = false;
      if (!userCode2) { isBad = true; }
      if (!amountStr) { isBad = true; }
      if (isNaN(amount)) { isBad = true; }
      if (amount <= 0) { isBad = true; }

      if (isBad) {
        await sendMessage(chatId, 'Correct format:' + '\n' + '<code>/shahen AL-000123 50</code>');
        return new Response('ok', { status: 200 });
      }

      var result2 = await supabase
        .from('profiles')
        .select('id, user_code, email, balance')
        .eq('user_code', userCode2.toUpperCase())
        .maybeSingle();

      var profile2 = result2.data;
      var findError = result2.error;

      if (findError || !profile2) {
        await sendMessage(chatId, 'Customer not found with code: ' + userCode2);
        return new Response('ok', { status: 200 });
      }

      var newBalance = Number(profile2.balance) + amount;

      var updateResult = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', profile2.id);

      if (updateResult.error) {
        await sendMessage(chatId, 'Error while charging: ' + updateResult.error.message);
        return new Response('ok', { status: 200 });
      }await supabase.from('notifications').insert({
        user_id: profile2.id,
        title: 'Balance charged',
        body: '$' + amount.toFixed(2) + ' added to your wallet. New balance: $' + newBalance.toFixed(2),
      });

      var successMsg = 'Charged successfully' + '\n\n' +
        'Customer: ' + profile2.user_code + '\n' +
        'Email: ' + profile2.email + '\n' +
        'Amount added: $' + amount.toFixed(2) + '\n' +
        'New balance: $' + newBalance.toFixed(2);
      await sendMessage(chatId, successMsg);
      return new Response('ok', { status: 200 });
    }

    await sendMessage(chatId, 'Unknown command. Type /help to see available commands.');
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('ok', { status: 200 });
  }
});
