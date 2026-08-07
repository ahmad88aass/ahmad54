import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-md';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxW} glass rounded-t-3xl sm:rounded-3xl shadow-2xl scale-in max-h-[92vh] overflow-y-auto no-scrollbar`}
      >
        {title !== undefined && (
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-border-soft bg-surface/95 backdrop-blur">
            <h3 className="text-lg font-extrabold text-text">{title}</h3>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="grid place-items-center w-9 h-9 rounded-xl bg-surface-2 text-muted hover:text-text hover:bg-border transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
