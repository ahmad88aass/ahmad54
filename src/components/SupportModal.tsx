import { Phone, Send, MessageCircle, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { SUPPORT_PHONE, TELEGRAM_AGENT } from '@/lib/services';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="الدعم الفني" size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl bg-primary/5 border border-primary/30 p-4">
          <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted leading-relaxed">
            فريق الدعم الفني متاح لمساعدتك في أي مشكلة تتعلق بطلباتك أو حسابك أو الشحن. تواصل معنا عبر القنوات التالية.
          </p>
        </div>

        <a
          href={`https://t.me/${TELEGRAM_AGENT}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-surface-2 hover:bg-border border border-border-soft p-4 transition-colors"
        >
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-tg/15 text-tg">
            <Send size={20} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-text">الدعم عبر تيليجرام</p>
            <p className="text-xs text-muted">@{TELEGRAM_AGENT}</p>
          </div>
        </a>

        <a
          href={`https://wa.me/${SUPPORT_PHONE.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-surface-2 hover:bg-border border border-border-soft p-4 transition-colors"
        >
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-wa/15 text-wa">
            <MessageCircle size={20} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-text">الدعم عبر واتساب</p>
            <p className="text-xs text-muted" dir="ltr">{SUPPORT_PHONE}</p>
          </div>
        </a>

        <div className="flex items-center gap-3 rounded-2xl bg-bg-soft border border-border-soft p-4">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-primary/15 text-primary">
            <Phone size={20} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-text">القيادة العامة</p>
            <p className="text-xs text-muted" dir="ltr">{SUPPORT_PHONE}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
