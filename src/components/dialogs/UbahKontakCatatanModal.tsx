import React, { useState, useEffect } from 'react';
import { Phone, Plus, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { DatabaseShopRowDTO, UpdateShopContactNotePayloadDTO } from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

export interface UbahKontakCatatanModalProps {
  open: boolean;
  onClose: () => void;
  shop: DatabaseShopRowDTO | null;
  initialFocus?: 'contact' | 'note';
  onSaveContactNote: (payload: UpdateShopContactNotePayloadDTO) => void;
}

/**
 * Dialog `d06`: Ubah Kontak & Edit Catatan Sales (Owner Note)
 * - Presentational component (no data fetching).
 * - Allows updating primary WhatsApp number, PIC name, secondary phones, and Sales Owner Note.
 * - All mobile touch targets >= 44x44px.
 */
export const UbahKontakCatatanModal: React.FC<UbahKontakCatatanModalProps> = ({
  open,
  onClose,
  shop,
  initialFocus = 'contact',
  onSaveContactNote,
}) => {
  const [picName, setPicName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [secondaryPhones, setSecondaryPhones] = useState<{ phone: string; label: string }[]>([]);
  const [newSecPhone, setNewSecPhone] = useState('');
  const [newSecLabel, setNewSecLabel] = useState('Admin Counter');
  const [salesOwnerNote, setSalesOwnerNote] = useState('');

  useEffect(() => {
    if (!open || !shop) return;
    setPicName(shop.picName);
    setWhatsappNumber(shop.whatsappNumber);
    setSecondaryPhones(shop.secondaryPhones);
    setNewSecPhone('');
    setNewSecLabel('Admin Counter');
    setSalesOwnerNote(shop.salesOwnerNote);
  }, [open, shop]);

  if (!shop) return null;

  const handleAddSecondaryPhone = () => {
    if (!newSecPhone.trim()) return;
    setSecondaryPhones((prev) => [
      ...prev,
      { phone: newSecPhone.trim(), label: newSecLabel.trim() || 'Cadangan' },
    ]);
    setNewSecPhone('');
  };

  const handleRemoveSecondaryPhone = (idx: number) => {
    setSecondaryPhones((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContactNote({
      shopId: shop.id,
      picName: picName.trim() || shop.picName,
      whatsappNumber: whatsappNumber.trim(),
      secondaryPhones,
      salesOwnerNote: salesOwnerNote.trim(),
    });
    onClose();
  };

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      size="md"
      title={`Ubah Kontak & Catatan #${shop.leadIdNumber}`}
      subtitle={shop.shopName}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            Simpan Perubahan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* 1. Kontak Utama (PIC & Nomor WhatsApp Utama) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--text-primary)]">
            <Phone className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Kontak WhatsApp & Pemilik (PIC)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="d06-wa-primary"
                className="block text-[12px] font-semibold text-[var(--text-secondary)]"
              >
                Nomor WhatsApp Utama
              </label>
              <input
                id="d06-wa-primary"
                type="tel"
                autoFocus={initialFocus === 'contact'}
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+62813..."
                className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="d06-pic-name"
                className="block text-[12px] font-semibold text-[var(--text-secondary)]"
              >
                Nama Pemilik / PIC Counter
              </label>
              <input
                id="d06-pic-name"
                type="text"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                placeholder="Nama pemilik counter"
                className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Secondary phones */}
          <div className="space-y-2 pt-1">
            <span className="block text-[12px] font-semibold text-[var(--text-secondary)]">
              Nomor Telepon Tambahan / Admin Counter
            </span>

            {secondaryPhones.length > 0 && (
              <div className="space-y-1.5">
                {secondaryPhones.map((item, idx) => (
                  <div
                    key={`${item.phone}-${idx}`}
                    className="px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] flex items-center justify-between gap-2 text-[13px]"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                        {item.phone}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded-[4px] bg-[var(--surface-solid)] text-[11px] font-medium text-[var(--text-secondary)]">
                        {item.label}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-[var(--status-danger)]" />}
                      onClick={() => handleRemoveSecondaryPhone(idx)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="tel"
                value={newSecPhone}
                onChange={(e) => setNewSecPhone(e.target.value)}
                placeholder="Nomor tambahan (+628...)"
                aria-label="Nomor telepon tambahan"
                className="flex-1 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] tabular-nums"
              />
              <input
                type="text"
                value={newSecLabel}
                onChange={(e) => setNewSecLabel(e.target.value)}
                placeholder="Label (cth: Admin)"
                aria-label="Label nomor tambahan"
                className="sm:w-36 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)]"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleAddSecondaryPhone}
                disabled={!newSecPhone.trim()}
              >
                Tambah
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Catatan Sales (Owner Note) */}
        <div className="pt-4 border-t border-[var(--border-hairline)] space-y-2">
          <label
            htmlFor="d06-owner-note"
            className="flex items-center gap-2 text-[13px] font-bold text-[var(--text-primary)]"
          >
            <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Catatan Sales (Owner Note)</span>
          </label>
          <textarea
            id="d06-owner-note"
            rows={4}
            autoFocus={initialFocus === 'note'}
            value={salesOwnerNote}
            onChange={(e) => setSalesOwnerNote(e.target.value)}
            placeholder="Catat preferensi pemilik toko, jadwal order rutin, atau negosiasi khusus..."
            className="w-full p-3 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
        </div>
      </form>
    </ModalSheet>
  );
};
