import type { ServiceCategory } from '@/lib/types';

interface IconProps {
  className?: string;
  size?: number;
}

// WhatsApp glyph
export function WhatsAppIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

// Telegram glyph
export function TelegramIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

// Instagram glyph
export function InstagramIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.71a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32-1.24-.06-1.59-.07-4.74-.07zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92zm0 9a3.54 3.54 0 1 0 0-7.08 3.54 3.54 0 0 0 0 7.08zm5.95-9.12a1.27 1.27 0 1 1-2.55 0 1.27 1.27 0 0 1 2.55 0z" />
    </svg>
  );
}

// Metallic shield badge with star — the "الأمريكي" emblem
export function ShieldBadge({ className, size = 40 }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden>
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7e08a" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6d1a" />
        </linearGradient>
        <linearGradient id="shieldInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2230" />
          <stop offset="100%" stopColor="#0c1018" />
        </linearGradient>
      </defs>
      <path
        d="M24 3l16 5v12c0 10.5-6.8 19.8-16 25-9.2-5.2-16-14.5-16-25V8l16-5z"
        fill="url(#shieldGrad)"
        stroke="#8a6d1a"
        strokeWidth="0.6"
      />
      <path
        d="M24 7l12 3.8v9.2c0 8.4-5.1 15.8-12 20-6.9-4.2-12-11.6-12-20v-9.2L24 7z"
        fill="url(#shieldInner)"
      />
      <path
        d="M24 14l2.1 4.6 5 .5-3.7 3.4 1.1 4.9L24 25.6 19.5 27.4l1.1-4.9-3.7-3.4 5-.5L24 14z"
        fill="url(#shieldGrad)"
      />
    </svg>
  );
}

// USA flag emblem (simplified stars + stripes)
export function UsaFlag({ className, size = 28 }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} className={className} aria-hidden>
      <rect x="0" y="0" width="28" height="28" rx="4" fill="#0c1018" />
      <rect x="0" y="0" width="11" height="12" rx="2" fill="#1f3a8a" />
      <rect x="11" y="0" width="17" height="2.3" fill="#e9edf4" />
      <rect x="11" y="3.3" width="17" height="2.3" fill="#dc2626" />
      <rect x="0" y="6.6" width="28" height="2.3" fill="#e9edf4" />
      <rect x="0" y="9.9" width="28" height="2.3" fill="#dc2626" />
      <rect x="0" y="13.2" width="28" height="2.3" fill="#e9edf4" />
      <rect x="0" y="16.5" width="28" height="2.3" fill="#dc2626" />
      <rect x="0" y="19.8" width="28" height="2.3" fill="#e9edf4" />
      <rect x="0" y="23.1" width="28" height="4.9" rx="0" fill="#dc2626" />
      <g fill="#e9edf4">
        <circle cx="3" cy="3" r="0.7" />
        <circle cx="6" cy="3" r="0.7" />
        <circle cx="9" cy="3" r="0.7" />
        <circle cx="4.5" cy="6" r="0.7" />
        <circle cx="7.5" cy="6" r="0.7" />
        <circle cx="3" cy="9" r="0.7" />
        <circle cx="6" cy="9" r="0.7" />
        <circle cx="9" cy="9" r="0.7" />
      </g>
      <rect x="0" y="0" width="28" height="28" rx="4" fill="none" stroke="#d4af37" strokeWidth="0.8" />
    </svg>
  );
}

export function ServiceGlyph({
  category,
  className,
  size,
}: {
  category: ServiceCategory;
  className?: string;
  size?: number;
}) {
  if (category === 'whatsapp') return <WhatsAppIcon className={className} size={size} />;
  if (category === 'telegram') return <TelegramIcon className={className} size={size} />;
  return <InstagramIcon className={className} size={size} />;
}

export const categoryColor: Record<ServiceCategory, { text: string; glow: string; ring: string; bg: string }> = {
  whatsapp: { text: 'text-wa', glow: 'glow-wa', ring: 'ring-wa/40', bg: 'bg-wa/10' },
  telegram: { text: 'text-tg', glow: 'glow-tg', ring: 'ring-tg/40', bg: 'bg-tg/10' },
  instagram: { text: 'text-ig', glow: 'glow-ig', ring: 'ring-ig/40', bg: 'bg-ig/10' },
};
