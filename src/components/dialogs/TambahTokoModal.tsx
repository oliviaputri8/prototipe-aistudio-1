import React, { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import { CreateShopFromAcquaintancePayloadDTO } from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

export interface TambahTokoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitNewShop: (payload: CreateShopFromAcquaintancePayloadDTO) => void;
}

/**
 * Dialog `d01-dialog-tambah-toko`: Tambah Toko dari Kenalan
 * - Presentational component (no data fetching).
 * - Desktop: Centered 22px squircle dialog.
 * - Mobile: Slide-up 28px bottom sheet with >= 44x44px touch targets.
 */
export const TambahTokoModal: React.FC<TambahTokoModalProps> = ({
  open,
  onClose,
  onSubmitNewShop,
}) => {
  const [shopName, setShopName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!open) return;
    setShopName('');
    setWhatsappNumber('');
    setCity('');
    setFullAddress('');
    setNameError('');
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setNameError('Nama toko wajib diisi.');
      return;
    }
    setNameError('');
    onSubmitNewShop({
      shopName: shopName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      city: city.trim() || 'Kota Medan',
      fullAddress: fullAddress.trim() || 'Belum diisi',
    });
    onClose();
  };

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      size="md"
      title="Tambah Toko dari Kenalan"
      subtitle="Masukkan data toko referensi sales ke Bank Data Olivia SDR"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Store className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            Simpan Toko
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* 1. Nama Toko / Counter * */}
        <div className="space-y-1.5">
          <label
            htmlFor="d01-shop-name"
            className="block text-[13px] font-semibold text-[var(--text-primary)]"
          >
            Nama Toko / Counter *
          </label>
          <input
            id="d01-shop-name"
            type="text"
            value={shopName}
            onChange={(e) => {
              setShopName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Cth: Barokah Cell"
            className="w-full min-h-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          {nameError && (
            <p className="text-[12px] text-[var(--status-danger)] font-medium">{nameError}</p>
          )}
        </div>

        {/* 2. Nomor WhatsApp */}
        <div className="space-y-1.5">
          <label
            htmlFor="d01-wa-number"
            className="block text-[13px] font-semibold text-[var(--text-primary)]"
          >
            Nomor WhatsApp
          </label>
          <input
            id="d01-wa-number"
            type="tel"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="Cth: 08123456789"
            className="w-full min-h-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] tabular-nums placeholder:text-[var(--text-tertiary)]"
          />
        </div>

        {/* 3. Kota / Kabupaten */}
        <div className="space-y-1.5">
          <label
            htmlFor="d01-city"
            className="block text-[13px] font-semibold text-[var(--text-primary)]"
          >
            Kota / Kabupaten
          </label>
          <input
            id="d01-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cth: Medan"
            className="w-full min-h-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
        </div>

        {/* 4. Alamat Lengkap */}
        <div className="space-y-1.5">
          <label
            htmlFor="d01-address"
            className="block text-[13px] font-semibold text-[var(--text-primary)]"
          >
            Alamat Lengkap
          </label>
          <textarea
            id="d01-address"
            rows={3}
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            placeholder="Cth: Jl. Gatot Subroto No. 12"
            className="w-full p-3 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
        </div>
      </form>
    </ModalSheet>
  );
};
