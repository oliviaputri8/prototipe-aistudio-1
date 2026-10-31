import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export interface ModalSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<ModalSheetProps['size']>, string> = {
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-3xl',
};

/**
 * Adaptive Apple HIG Overlay:
 * - On Desktop (`md:`): Centered 22px squircle dialog with translucent glass header/footer and solid content well.
 * - On Mobile (`< md`): Slide-up bottom sheet (`rounded-t-[28px]`) with top grab handle bar.
 */
export const ModalSheet: React.FC<ModalSheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  footer,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-sheet-title"
    >
      {/* Scrim Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--glass-scrim)] backdrop-blur-xs hig-transition"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog / Sheet Container */}
      <div
        className={`relative z-10 w-full ${SIZE_CLASSES[size]} max-h-[90vh] flex flex-col hig-glass-modal rounded-t-[var(--radius-xl)] md:rounded-[var(--radius-lg)] overflow-hidden hig-transition`}
      >
        {/* Mobile Drag Handle Affordance */}
        <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-[var(--border-strong)]" />
        </div>

        {/* Translucent Chrome Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[var(--border-hairline)] shrink-0">
          <div className="min-w-0">
            <h2
              id="modal-sheet-title"
              className="hig-headline text-[var(--text-primary)] truncate"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="hig-footnote text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <IconButton label="Tutup dialog" onClick={onClose} className="-mr-1 -mt-1">
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Solid Content Surface for High-Contrast Form / Data Reading */}
        <div className="flex-1 overflow-y-auto p-5 bg-[var(--surface-solid)] text-[var(--text-primary)]">
          {children}
        </div>

        {/* Translucent Chrome Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[var(--border-hairline)] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
