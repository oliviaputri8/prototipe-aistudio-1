import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { DatabaseShopRowDTO } from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

export interface HapusTokoModalProps {
  open: boolean;
  onClose: () => void;
  shop: DatabaseShopRowDTO | null;
  onConfirmSoftDelete: (shopId: string) => void;
}

const REQUIRED_DELETE_PHRASE = 'saya yakin menghapus toko ini';

/**
 * Dialog `d08-dialog-hapus-toko`: Yakin ingin menghapus toko ini?
 * - Presentational component (no data fetching).
 * - Soft-delete confirmation that requires typing the exact phrase:
 *   "saya yakin menghapus toko ini"
 * - Paste is strictly disabled (`onPaste={(e) => e.preventDefault()}`).
 * - Confirm button (`Ya, hapus toko`) is disabled until the typed phrase matches.
 */
export const HapusTokoModal: React.FC<HapusTokoModalProps> = ({
  open,
  onClose,
  shop,
  onConfirmSoftDelete,
}) => {
  const [typedText, setTypedText] = useState('');
  const [pasteBlockedMessage, setPasteBlockedMessage] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTypedText('');
    setPasteBlockedMessage(false);
  }, [open]);

  if (!shop) return null;

  const isMatched = typedText.trim().toLowerCase() === REQUIRED_DELETE_PHRASE;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatched) return;
    onConfirmSoftDelete(shop.id);
    onClose();
  };

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      size="md"
      title="Yakin ingin menghapus toko ini?"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="destructive"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            disabled={!isMatched}
            onClick={handleConfirm}
          >
            Ya, hapus toko
          </Button>
        </>
      }
    >
      <form onSubmit={handleConfirm} className="space-y-4" noValidate>
        <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
          Toko <strong className="text-[var(--text-primary)]">“{shop.shopName}”</strong> (ID #
          {shop.leadIdNumber}) akan dihapus lunak dan dipindahkan ke halaman Terhapus.
        </p>

        <div className="space-y-2">
          <label
            htmlFor="d08-confirm-phrase"
            className="block text-[13px] font-medium text-[var(--text-secondary)]"
          >
            Untuk melanjutkan, ketik kalimat berikut (tidak bisa ditempel):
          </label>

          {/* Reference Phrase Box */}
          <div
            aria-label="Kalimat konfirmasi penghapusan"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[14px] font-bold text-[var(--text-primary)] select-none flex items-center"
          >
            {REQUIRED_DELETE_PHRASE}
          </div>

          {/* Input with Paste Disabled */}
          <input
            id="d08-confirm-phrase"
            type="text"
            autoComplete="off"
            value={typedText}
            onChange={(e) => {
              setTypedText(e.target.value);
              if (pasteBlockedMessage) setPasteBlockedMessage(false);
            }}
            onPaste={(e) => {
              e.preventDefault();
              setPasteBlockedMessage(true);
            }}
            placeholder="Ketik kalimat di atas"
            className="w-full min-h-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--accent-primary)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />

          {pasteBlockedMessage && (
            <p className="text-[12px] font-medium text-[var(--status-warning)]">
              Tempel (paste) dinonaktifkan untuk keamanan. Silakan ketik kalimat konfirmasi secara
              manual.
            </p>
          )}
        </div>
      </form>
    </ModalSheet>
  );
};
