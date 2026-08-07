export function formatMoney(n: number): string {
  const v = Number(n) || 0;
  return `$${v.toFixed(2)}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone;
  const start = digits.slice(0, 6);
  const end = digits.slice(-3);
  return `+${start.slice(0, 3)} ${start.slice(3, 6)} *** ${end}`;
}

export function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'الآن';
  if (min < 60) return `قبل ${min} دقيقة`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `قبل ${hr} ساعة`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `قبل ${day} يوم`;
  const mo = Math.floor(day / 30);
  return `قبل ${mo} شهر`;
}

export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
