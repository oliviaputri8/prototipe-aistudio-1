import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Store,
  User,
  Phone,
  MapPin,
  Upload,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  HandoverKycFileMetadataDTO,
  HandoverSubmissionPayloadDTO,
  HandoverSubmissionReceiptDTO,
  InboxLeadThreadDTO,
  PrimaryFocusCategoryOption,
  ProductCategoryOption,
} from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

export interface AjukanResellerModalProps {
  open: boolean;
  onClose: () => void;
  lead: InboxLeadThreadDTO | null;
  onSubmitHandover: (
    payload: HandoverSubmissionPayloadDTO
  ) => Promise<HandoverSubmissionReceiptDTO>;
}

const MAX_KYC_FILE_BYTES = 500 * 1024; // 500 KB limit as required by RG ERP KYC gate

const FOCUS_CATEGORIES: PrimaryFocusCategoryOption[] = [
  'Ex-iBox (Second Resmi)',
  'New iBox (Garansi Resmi)',
  'Inter (All Operator)',
];

const PRODUCT_INTEREST_OPTIONS: ProductCategoryOption[] = ['Ex-iBox', 'New iBox', 'Inter'];

/**
 * Dialog `d03-dialog-ajukan-reseller`: Ajukan Reseller ke RG ERP (Handover Gate)
 * - Contains strictly production controls (no dev simulation checkboxes).
 * - Desktop: Centered 22px squircle dialog
 * - Mobile: Slide-up 28px bottom sheet
 * - Full KYC form with all fields from `d03-dialog-ajukan-reseller.png`,
 *   two file inputs enforcing the 500 KB limit, inline field validation errors,
 *   and submit success / failure states.
 */
export const AjukanResellerModal: React.FC<AjukanResellerModalProps> = ({
  open,
  onClose,
  lead,
  onSubmitHandover,
}) => {
  const [shopName, setShopName] = useState('');
  const [picName, setPicName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [primaryFocusCategory, setPrimaryFocusCategory] =
    useState<PrimaryFocusCategoryOption>('Ex-iBox (Second Resmi)');
  const [productInterests, setProductInterests] = useState<ProductCategoryOption[]>([
    'Ex-iBox',
    'New iBox',
  ]);
  const [weeklyPotentialUnits, setWeeklyPotentialUnits] = useState<string>('5');
  const [ktpPhoto, setKtpPhoto] = useState<HandoverKycFileMetadataDTO | null>(null);
  const [shopFrontPhoto, setShopFrontPhoto] = useState<HandoverKycFileMetadataDTO | null>(null);
  const [salesQualificationNote, setSalesQualificationNote] = useState('');

  // Validation, submission, and receipt states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<HandoverSubmissionReceiptDTO | null>(null);

  // Sync form fields when lead changes or modal opens
  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setSubmitError(null);
    setReceipt(null);

    if (lead) {
      setShopName(lead.shopName);
      setPicName(lead.picName);
      setWhatsappNumber(lead.whatsappNumber);
      setCity(lead.city);
      setProvince(lead.province);
      setFullAddress(lead.fullAddress);
      setGoogleMapsUrl(lead.googleMapsUrl);
      setInstagramHandle(lead.instagramHandle);
      setPrimaryFocusCategory(lead.defaultFocusCategory);
      setProductInterests(lead.defaultProductInterests);
      setWeeklyPotentialUnits(String(lead.defaultWeeklyPotentialUnits));
      setSalesQualificationNote(lead.defaultHandoverNote);
      setKtpPhoto(null);
      setShopFrontPhoto(null);
    }
  }, [open, lead]);

  const toggleInterest = (cat: ProductCategoryOption) => {
    setProductInterests((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const handleFileChange = (
    target: 'ktp' | 'shop',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const meta: HandoverKycFileMetadataDTO = {
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type || 'image/jpeg',
    };

    if (target === 'ktp') {
      setKtpPhoto(meta);
      if (file.size > MAX_KYC_FILE_BYTES) {
        setFieldErrors((prev) => ({
          ...prev,
          ktpPhoto: `Ukuran berkas "${file.name}" (${Math.round(file.size / 1024)} KB) melebihi batas maksimal 500 KB.`,
        }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.ktpPhoto;
          return next;
        });
      }
    } else {
      setShopFrontPhoto(meta);
      if (file.size > MAX_KYC_FILE_BYTES) {
        setFieldErrors((prev) => ({
          ...prev,
          shopFrontPhoto: `Ukuran berkas "${file.name}" (${Math.round(file.size / 1024)} KB) melebihi batas maksimal 500 KB.`,
        }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.shopFrontPhoto;
          return next;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!shopName.trim()) {
      errors.shopName = 'Nama toko counter wajib diisi.';
    }
    if (!picName.trim()) {
      errors.picName = 'Nama pemilik / PIC wajib diisi.';
    }
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    if (!/^628\d{7,13}$/.test(cleanPhone)) {
      errors.whatsappNumber = 'Nomor WhatsApp wajib berformat 628... (10-16 digit angka).';
    }
    if (!city.trim()) {
      errors.city = 'Kota / Kabupaten wajib diisi.';
    }
    if (!province.trim()) {
      errors.province = 'Provinsi wajib diisi.';
    }
    if (!fullAddress.trim()) {
      errors.fullAddress = 'Alamat lengkap counter wajib diisi.';
    }
    if (productInterests.length === 0) {
      errors.productInterests = 'Pilih minimal 1 minat kategori produk.';
    }
    const parsedUnits = Number(weeklyPotentialUnits);
    if (!Number.isFinite(parsedUnits) || parsedUnits < 1) {
      errors.weeklyPotentialUnits = 'Potensi order minimal 1 unit/minggu.';
    }
    if (!ktpPhoto) {
      errors.ktpPhoto = 'Foto KTP Pemilik Toko wajib dilampirkan (Maks 500 KB).';
    } else if (ktpPhoto.fileSizeBytes > MAX_KYC_FILE_BYTES) {
      errors.ktpPhoto = `Ukuran berkas "${ktpPhoto.fileName}" (${Math.round(ktpPhoto.fileSizeBytes / 1024)} KB) melebihi batas maksimal 500 KB.`;
    }
    if (!shopFrontPhoto) {
      errors.shopFrontPhoto = 'Foto Toko Tampak Depan wajib dilampirkan (Maks 500 KB).';
    } else if (shopFrontPhoto.fileSizeBytes > MAX_KYC_FILE_BYTES) {
      errors.shopFrontPhoto = `Ukuran berkas "${shopFrontPhoto.fileName}" (${Math.round(shopFrontPhoto.fileSizeBytes / 1024)} KB) melebihi batas maksimal 500 KB.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmitHandover({
        threadId: lead?.id ?? 'thr-manual',
        shopName: shopName.trim(),
        picName: picName.trim(),
        whatsappNumber: whatsappNumber.replace(/\D/g, ''),
        city: city.trim(),
        province: province.trim(),
        fullAddress: fullAddress.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        instagramHandle: instagramHandle.trim(),
        primaryFocusCategory,
        productInterests,
        weeklyPotentialUnits: Number(weeklyPotentialUnits),
        ktpPhoto,
        shopFrontPhoto,
        salesQualificationNote: salesQualificationNote.trim(),
      });
      setReceipt(result);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengirim pengajuan ke RG ERP.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      size="xl"
      title="Ajukan Reseller ke RG ERP (Handover Gate)"
      subtitle="Verifikasi KYC ringan wajib melampirkan Foto KTP Pemilik dan Foto Toko Tampak Depan (otomatis dikompresi di bawah 500 KB)."
      footer={
        receipt ? (
          <Button variant="primary" size="md" onClick={onClose}>
            Selesai & Tutup
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Mengirim ke RG ERP...'
                : 'Kirim Pengajuan Reseller ke RG ERP'}
            </Button>
          </>
        )
      }
    >
      {receipt ? (
        /* ==================================================================
         * SUBMIT SUCCESS RECEIPT STATE
         * ================================================================== */
        <div className="py-6 space-y-5">
          <div className="p-5 rounded-[var(--radius-md)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] flex items-start gap-3.5">
            <CheckCircle2 className="w-6 h-6 text-[var(--status-success)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="hig-headline text-[var(--status-success)]">
                Pengajuan Reseller Berhasil Dikirim ke RG ERP
              </div>
              <p className="hig-footnote text-[var(--text-primary)]">
                Data prospek <strong>{receipt.shopName}</strong> telah masuk ke{' '}
                <strong>Antrean Handover ERP</strong> untuk diverifikasi oleh Owner RG ERP.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[13px]">
            <div>
              <span className="text-[var(--text-tertiary)] block">ID Handover RG ERP</span>
              <span className="font-bold text-[var(--text-primary)] tabular-nums">
                {receipt.erpHandoverId}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Waktu Pengajuan</span>
              <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                {receipt.submittedAtWib}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Status Verifikasi</span>
              <span className="font-semibold text-[var(--accent-primary)]">
                {receipt.statusLabel}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Berkas KYC Terkompresi</span>
              <span className="font-medium text-[var(--text-secondary)] tabular-nums">
                KTP ({receipt.compressedKtpSizeKb} KB) · Toko ({receipt.compressedShopPhotoSizeKb} KB)
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ==================================================================
         * FULL KYC HANDOVER FORM (`d03-dialog-ajukan-reseller`)
         * ================================================================== */
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Qualification Status Badge */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-hairline)]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prospek Kualifikasi (QUALIFIED)</span>
            </span>
            <span className="hig-caption text-[var(--text-tertiary)]">
              * Wajib diisi untuk validasi KYC
            </span>
          </div>

          {/* API Submit Error Banner */}
          {submitError && (
            <div
              role="alert"
              className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--status-danger-bg)] border border-[var(--status-danger-border)] text-[var(--status-danger)] flex items-start gap-2.5 text-[13px]"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold">Pengajuan Gagal Terkirim</div>
                <p className="mt-0.5">{submitError}</p>
              </div>
            </div>
          )}

          {/* Row 1: Nama Toko Counter & Nama Pemilik / PIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="d03-shop-name"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Nama Toko Counter *
              </label>
              <div className="relative flex items-center">
                <Store className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 pointer-events-none" />
                <input
                  id="d03-shop-name"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Contoh: Cahaya Gadget Sentosa"
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                />
              </div>
              {fieldErrors.shopName && (
                <p className="text-[12px] text-[var(--status-danger)]">{fieldErrors.shopName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="d03-pic-name"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Nama Pemilik / PIC *
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 pointer-events-none" />
                <input
                  id="d03-pic-name"
                  type="text"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  placeholder="Contoh: Hendra Wijaya"
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                />
              </div>
              {fieldErrors.picName && (
                <p className="text-[12px] text-[var(--status-danger)]">{fieldErrors.picName}</p>
              )}
            </div>
          </div>

          {/* Row 2: Nomor WhatsApp Aktif, Kota / Kabupaten, Provinsi */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1.5">
              <label
                htmlFor="d03-wa-number"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Nomor WhatsApp Aktif (628...) *
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 pointer-events-none" />
                <input
                  id="d03-wa-number"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="6281194007712"
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] tabular-nums placeholder:text-[var(--text-tertiary)]"
                />
              </div>
              {fieldErrors.whatsappNumber && (
                <p className="text-[12px] text-[var(--status-danger)]">
                  {fieldErrors.whatsappNumber}
                </p>
              )}
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label
                htmlFor="d03-city"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Kota / Kabupaten *
              </label>
              <input
                id="d03-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kota Surabaya"
                className="w-full min-h-[42px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
              />
              {fieldErrors.city && (
                <p className="text-[12px] text-[var(--status-danger)]">{fieldErrors.city}</p>
              )}
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label
                htmlFor="d03-province"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Provinsi *
              </label>
              <input
                id="d03-province"
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Jawa Timur"
                className="w-full min-h-[42px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
              />
              {fieldErrors.province && (
                <p className="text-[12px] text-[var(--status-danger)]">{fieldErrors.province}</p>
              )}
            </div>
          </div>

          {/* Row 3: Alamat Lengkap Counter, Tautan Google Maps, Akun Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1.5">
              <label
                htmlFor="d03-address"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Alamat Lengkap Counter *
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 pointer-events-none" />
                <input
                  id="d03-address"
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Plaza Marina Lt. 2 Blok C-14"
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
                />
              </div>
              {fieldErrors.fullAddress && (
                <p className="text-[12px] text-[var(--status-danger)]">
                  {fieldErrors.fullAddress}
                </p>
              )}
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label
                htmlFor="d03-maps"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Tautan Google Maps
              </label>
              <input
                id="d03-maps"
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full min-h-[42px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label
                htmlFor="d03-ig"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Akun Instagram
              </label>
              <input
                id="d03-ig"
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@cahayagadget.sby"
                className="w-full min-h-[42px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Row 4: Kategori Fokus Utama, Minat Kategori Produk, Potensi Order */}
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4 space-y-1.5">
              <label
                htmlFor="d03-focus-cat"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Kategori Fokus Utama *
              </label>
              <select
                id="d03-focus-cat"
                value={primaryFocusCategory}
                onChange={(e) =>
                  setPrimaryFocusCategory(e.target.value as PrimaryFocusCategoryOption)
                }
                className="w-full min-h-[42px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)]"
              >
                {FOCUS_CATEGORIES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5 space-y-1.5">
              <span className="block text-[13px] font-semibold text-[var(--text-primary)]">
                Minat Kategori Produk *
              </span>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {PRODUCT_INTEREST_OPTIONS.map((cat) => {
                  const selected = productInterests.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleInterest(cat)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-[var(--radius-xs)] text-[13px] font-semibold border cursor-pointer hig-transition ${
                        selected
                          ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                          : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {fieldErrors.productInterests && (
                <p className="text-[12px] text-[var(--status-danger)]">
                  {fieldErrors.productInterests}
                </p>
              )}
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label
                htmlFor="d03-weekly-units"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Potensi Order (Unit/Minggu) *
              </label>
              <input
                id="d03-weekly-units"
                type="number"
                min={1}
                value={weeklyPotentialUnits}
                onChange={(e) => setWeeklyPotentialUnits(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] tabular-nums"
              />
              {fieldErrors.weeklyPotentialUnits && (
                <p className="text-[12px] text-[var(--status-danger)]">
                  {fieldErrors.weeklyPotentialUnits}
                </p>
              )}
            </div>
          </div>

          {/* Row 5: Two KYC File Upload Inputs (500 KB Limit) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Foto KTP Pemilik Toko */}
            <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-primary)]">
                  <Upload className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>1. Foto KTP Pemilik Toko *</span>
                </div>
                <span className="hig-caption text-[var(--text-tertiary)] tabular-nums">
                  Maks 500 KB
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <label className="min-h-[38px] px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] border border-[var(--border-hairline)] text-[13px] font-semibold text-[var(--accent-primary)] inline-flex items-center cursor-pointer">
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('ktp', e)}
                    className="sr-only"
                  />
                </label>
                <span className="text-[13px] text-[var(--text-secondary)] truncate max-w-[210px] tabular-nums">
                  {ktpPhoto
                    ? `${ktpPhoto.fileName} (${Math.round(ktpPhoto.fileSizeBytes / 1024)} KB)`
                    : 'Tidak ada file yang dipilih'}
                </span>
              </div>

              {fieldErrors.ktpPhoto && (
                <p className="text-[12px] text-[var(--status-danger)]">{fieldErrors.ktpPhoto}</p>
              )}
            </div>

            {/* 2. Foto Toko Tampak Depan */}
            <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-primary)]">
                  <Upload className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>2. Foto Toko Tampak Depan *</span>
                </div>
                <span className="hig-caption text-[var(--text-tertiary)] tabular-nums">
                  Maks 500 KB
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <label className="min-h-[38px] px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] border border-[var(--border-hairline)] text-[13px] font-semibold text-[var(--accent-primary)] inline-flex items-center cursor-pointer">
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('shop', e)}
                    className="sr-only"
                  />
                </label>
                <span className="text-[13px] text-[var(--text-secondary)] truncate max-w-[210px] tabular-nums">
                  {shopFrontPhoto
                    ? `${shopFrontPhoto.fileName} (${Math.round(shopFrontPhoto.fileSizeBytes / 1024)} KB)`
                    : 'Tidak ada file yang dipilih'}
                </span>
              </div>

              {fieldErrors.shopFrontPhoto && (
                <p className="text-[12px] text-[var(--status-danger)]">
                  {fieldErrors.shopFrontPhoto}
                </p>
              )}
            </div>
          </div>

          {/* Row 6: Catatan Kualifikasi Sales untuk Owner RG ERP */}
          <div className="space-y-1.5">
            <label
              htmlFor="d03-sales-note"
              className="block text-[13px] font-semibold text-[var(--text-primary)]"
            >
              Catatan Kualifikasi Sales untuk Owner RG ERP
            </label>
            <textarea
              id="d03-sales-note"
              rows={3}
              value={salesQualificationNote}
              onChange={(e) => setSalesQualificationNote(e.target.value)}
              placeholder="Prospek siap order rutin mingguan dan tertarik katalog konsinyasi."
              className="w-full p-3 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            />
          </div>
        </form>
      )}
    </ModalSheet>
  );
};
