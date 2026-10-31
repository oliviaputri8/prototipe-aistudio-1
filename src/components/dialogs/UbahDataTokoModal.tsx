import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';
import {
  DatabaseShopRowDTO,
  MoveShopTierPayloadDTO,
  OnlineLinkType,
  ShopTierCode,
  UpdateShopDataPayloadDTO,
} from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

export interface UbahDataTokoModalProps {
  open: boolean;
  onClose: () => void;
  shop: DatabaseShopRowDTO | null;
  availableCities: string[];
  onSaveShopData: (payload: UpdateShopDataPayloadDTO) => void;
  onAddOnlineLink: (shopId: string, type: OnlineLinkType, url: string) => void;
  onRemoveOnlineLink: (shopId: string, linkId: string) => void;
  onMoveShopTier: (payload: MoveShopTierPayloadDTO) => void;
}

const LINK_TYPES: OnlineLinkType[] = [
  'Situs Web',
  'Facebook',
  'Instagram',
  'Google Maps',
  'Marketplace',
];

const TIER_OPTIONS: ShopTierCode[] = ['Tier A', 'Tier B', 'Tier C', 'Tier X'];

/**
 * Dialog `d07-dialog-ubah-data`: Ubah Data Toko #{leadIdNumber}
 * - Presentational component (no data fetching).
 * - Functional checklist from `d07-dialog-ubah-data.png`:
 *   1. Data toko (`Nama toko`, `Alamat`, `Kota / Kabupaten`, `Simpan data toko`)
 *   2. Tautan online (existing list + delete, add link select + URL input + `Tambah`)
 *   3. Tier toko (`Tier sekarang`, `Pindah ke tier...` select, `Alasan (wajib)` input, `Pindahkan` button)
 *   4. Riwayat perubahan (audit log of changes)
 * - Every mobile interactive control >= 44x44px.
 */
export const UbahDataTokoModal: React.FC<UbahDataTokoModalProps> = ({
  open,
  onClose,
  shop,
  availableCities,
  onSaveShopData,
  onAddOnlineLink,
  onRemoveOnlineLink,
  onMoveShopTier,
}) => {
  const [shopName, setShopName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // Tautan online form state
  const [linkType, setLinkType] = useState<OnlineLinkType>('Situs Web');
  const [linkUrl, setLinkUrl] = useState('');

  // Tier toko form state
  const [targetTier, setTargetTier] = useState<string>('');
  const [tierReason, setTierReason] = useState<string>('');

  useEffect(() => {
    if (!open || !shop) return;
    setShopName(shop.shopName);
    setFullAddress(shop.fullAddress === 'Belum diisi' ? '' : shop.fullAddress);
    setCity(shop.city || '');
    setLinkType('Situs Web');
    setLinkUrl('');
    setTargetTier('');
    setTierReason('');
    setSavedBanner(null);
  }, [open, shop]);

  if (!shop) return null;

  const handleSaveDataToko = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) return;
    onSaveShopData({
      shopId: shop.id,
      shopName: shopName.trim(),
      fullAddress: fullAddress.trim() || 'Belum diisi',
      city: city.trim(),
    });
    setSavedBanner('Data identitas toko berhasil diperbarui.');
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    onAddOnlineLink(shop.id, linkType, linkUrl.trim());
    setLinkUrl('');
    setSavedBanner(`Tautan ${linkType} berhasil ditambahkan.`);
  };

  const handleMoveTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTier || !tierReason.trim()) return;
    onMoveShopTier({
      shopId: shop.id,
      targetTier: targetTier as ShopTierCode,
      reason: tierReason.trim(),
    });
    setTargetTier('');
    setTierReason('');
    setSavedBanner(`Tier toko berhasil dipindahkan ke ${targetTier}.`);
  };

  const cityChoices = Array.from(
    new Set([...(shop.city ? [shop.city] : []), ...availableCities])
  );

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      size="lg"
      title={`Ubah Data Toko #${shop.leadIdNumber}`}
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="space-y-6 text-[13px]">
        {savedBanner && (
          <div
            role="status"
            className="px-3.5 py-2.5 rounded-[var(--radius-xs)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[var(--status-success)] flex items-center gap-2 font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedBanner}</span>
          </div>
        )}

        {/* ================================================================
         * SECTION 1: DATA TOKO
         * ================================================================ */}
        <form onSubmit={handleSaveDataToko} className="space-y-3" noValidate>
          <div className="font-bold text-[14px] text-[var(--text-primary)]">Data toko</div>

          <div className="space-y-1">
            <label
              htmlFor="d07-nama-toko"
              className="block text-[12px] font-medium text-[var(--text-secondary)]"
            >
              Nama toko
            </label>
            <input
              id="d07-nama-toko"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="d07-alamat-toko"
              className="block text-[12px] font-medium text-[var(--text-secondary)]"
            >
              Alamat
            </label>
            <input
              id="d07-alamat-toko"
              type="text"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="Alamat lengkap jalan dan nomor ruko..."
              className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="d07-kota-toko"
              className="block text-[12px] font-medium text-[var(--text-secondary)]"
            >
              Kota / Kabupaten
            </label>
            <select
              id="d07-kota-toko"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
            >
              <option value="">Belum diisi</option>
              {cityChoices.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-1">
            <Button type="submit" variant="primary" size="sm">
              Simpan data toko
            </Button>
          </div>
        </form>

        {/* ================================================================
         * SECTION 2: TAUTAN ONLINE
         * ================================================================ */}
        <div className="pt-4 border-t border-[var(--border-hairline)] space-y-3">
          <div className="font-bold text-[14px] text-[var(--text-primary)]">Tautan online</div>

          {shop.onlineLinks.length === 0 ? (
            <p className="text-[13px] text-[var(--text-secondary)]">Belum ada tautan.</p>
          ) : (
            <div className="space-y-2">
              {shop.onlineLinks.map((lnk) => (
                <div
                  key={lnk.id}
                  className="px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase text-[var(--text-tertiary)] block">
                      {lnk.type}
                    </span>
                    <span className="text-[13px] font-semibold text-[var(--accent-primary)] truncate block">
                      {lnk.url}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-[var(--status-danger)]" />}
                    onClick={() => onRemoveOnlineLink(shop.id, lnk.id)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleAddLink}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value as OnlineLinkType)}
              aria-label="Jenis tautan online"
              className="sm:w-40 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)]"
            >
              {LINK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              aria-label="URL tautan online"
              className="flex-1 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!linkUrl.trim()}
            >
              Tambah
            </Button>
          </form>

          <p className="text-[12px] text-[var(--text-tertiary)]">
            Untuk mengubah tautan: hapus yang lama, lalu tambahkan yang baru.
          </p>
        </div>

        {/* ================================================================
         * SECTION 3: TIER TOKO
         * ================================================================ */}
        <form
          onSubmit={handleMoveTier}
          className="pt-4 border-t border-[var(--border-hairline)] space-y-3"
        >
          <div className="space-y-0.5">
            <div className="font-bold text-[14px] text-[var(--text-primary)]">Tier toko</div>
            <div className="text-[13px] text-[var(--text-secondary)]">
              Tier sekarang: <strong className="text-[var(--text-primary)]">{shop.tier}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <select
              value={targetTier}
              onChange={(e) => setTargetTier(e.target.value)}
              aria-label="Pindah ke tier"
              className="sm:w-44 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)]"
            >
              <option value="">Pindah ke tier...</option>
              {TIER_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={tierReason}
              onChange={(e) => setTierReason(e.target.value)}
              placeholder="Alasan (wajib)"
              aria-label="Alasan perpindahan tier (wajib)"
              className="flex-1 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!targetTier || !tierReason.trim()}
            >
              Pindahkan
            </Button>
          </div>
        </form>

        {/* ================================================================
         * SECTION 4: RIWAYAT PERUBAHAN
         * ================================================================ */}
        <div className="pt-4 border-t border-[var(--border-hairline)] space-y-2">
          <div className="font-bold text-[14px] text-[var(--text-primary)]">
            Riwayat perubahan
          </div>

          {shop.changeHistory.length === 0 ? (
            <p className="text-[13px] text-[var(--text-secondary)]">Belum ada perubahan.</p>
          ) : (
            <div className="space-y-2">
              {shop.changeHistory.map((ch) => (
                <div
                  key={ch.id}
                  className="p-2.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[12px]"
                >
                  <div className="flex items-center justify-between gap-2 text-[var(--text-tertiary)] tabular-nums">
                    <span className="font-semibold text-[var(--text-primary)]">{ch.actorName}</span>
                    <span>{ch.timestampWib}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] mt-0.5">{ch.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalSheet>
  );
};
