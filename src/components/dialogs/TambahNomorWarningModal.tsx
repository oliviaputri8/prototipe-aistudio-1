import React from 'react';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import { AddNumberWarningDialogConfigDTO } from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

export interface TambahNomorWarningModalProps {
  open: boolean;
  onClose: () => void;
  config: AddNumberWarningDialogConfigDTO;
  onConfirmAddNumber: () => void;
}

/**
 * Dialog `d04-dialog-tambah-nomor`: Peringatan Operasional Penambahan Nomor
 * - Presentational component (no data fetching).
 * - Desktop: Centered 22px squircle dialog
 * - Mobile: Slide-up 28px bottom sheet
 */
export const TambahNomorWarningModal: React.FC<TambahNomorWarningModalProps> = ({
  open,
  onClose,
  config,
  onConfirmAddNumber,
}) => {
  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      size="md"
      title={config.title}
      subtitle="Evaluasi risiko keselamatan nomor dan batas jam operasional"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {config.cancelLabel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => {
              onConfirmAddNumber();
              onClose();
            }}
          >
            {config.confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="hig-body text-[var(--text-secondary)]">{config.subtitle}</p>

        {/* Warning Bullet Box */}
        <div
          role="alert"
          className="p-4 rounded-[var(--radius-sm)] bg-[var(--status-warning-bg)] border border-[var(--status-warning-border)] text-[var(--status-warning)] space-y-2"
        >
          <div className="flex items-center gap-2 text-[13px] font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Temuan Risiko Operasional</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-[13px] font-medium">
            {config.warnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>

        <p className="hig-footnote font-medium text-[var(--text-primary)]">
          {config.confirmQuestion}
        </p>
      </div>
    </ModalSheet>
  );
};
