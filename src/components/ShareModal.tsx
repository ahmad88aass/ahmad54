import { useState } from 'react';
import { Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import { Modal } from './Modal';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ open, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : 'https://al-ameriki.store';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const shareText = encodeURIComponent('متجر الأميركي الرقمي — أرقام واتساب، تيليجرام بريميوم، توثيق الحسابات والمزيد!');

  return (
    <Modal open={open} onClose={onClose} title="مشاركة المتجر" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-muted leading-relaxed">
          ساعد أصدقاءك على الوصول إلى خدماتنا الرقمية المتميزة. شارك رابط المتجر عبر منصتك المفضّلة.
        </p>

        <div className="flex items-center gap-2 rounded-2xl bg-surface-2 border border-border-soft p-3">
          <input
            value={url}
            readOnly
            className="flex-1 bg-transparent text-sm text-text outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-bg-soft hover:bg-border text-text transition-colors"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            {copied ? 'تم' : 'نسخ'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a
            href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-wa/10 hover:bg-wa/20 text-wa transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-[11px] font-bold">واتساب</span>
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${shareText}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-tg/10 hover:bg-tg/20 text-tg transition-colors"
          >
            <Send size={20} />
            <span className="text-[11px] font-bold">تيليجرام</span>
          </a>
          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-surface-2 hover:bg-border text-text transition-colors"
          >
            {copied ? <Check size={20} className="text-success" /> : <Share2 size={20} />}
            <span className="text-[11px] font-bold">{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
