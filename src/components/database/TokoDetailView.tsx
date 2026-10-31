import React, { useState } from 'react';
import {
  ChevronLeft,
  MessageSquare,
  ExternalLink,
  Settings,
  Smartphone,
  Star,
  Ban,
  Undo2,
  Trash2,
  Globe,
  Calendar,
  Brain,
  ChevronDown,
  ChevronUp,
  Check,
  Edit3,
  MapPin,
  Plus,
} from 'lucide-react';
import { DatabaseShopRowDTO } from '../../mock/api';
import { GlassChrome } from '../ui/GlassChrome';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';

export interface TokoDetailViewProps {
  shop: DatabaseShopRowDTO;
  onBack: () => void;
  onOpenShopInInbox: (shop: DatabaseShopRowDTO) => void;
  onOpenEditDataModal: () => void;
  onOpenEditContactModal: (focusField: 'contact' | 'note') => void;
  onOpenDeleteModal: () => void;
  onOpenCreateFollowUpModal: (shop: DatabaseShopRowDTO) => void;
  onNavigateToFollowUpSchedule: () => void;
  onToggleDisqualified: (shopId: string) => void;
  onUpdateFunnelStep: (shopId: string, stepIndex: 1 | 2 | 3 | 4 | 5) => void;
  onSaveInlineOwnerNote: (shopId: string, note: string) => void;
}

type DetailTabId = 'profil_toko' | 'riwayat_chat';

const FUNNEL_STEPS: { index: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { index: 1, label: 'Prospek' },
  { index: 2, label: 'Terkontak' },
  { index: 3, label: 'Berminat' },
  { index: 4, label: 'Negosiasi' },
  { index: 5, label: 'Deal Tercapai' },
];

/**
 * Stage 3a Detail Toko (`09-toko-detail`, `09b-toko-detail-chat`, `09c-toko-detail-2`)
 * - Purely presentational: receives all data & callbacks via props (zero internal fetch calls).
 * - Contains only production controls (prototype variant switcher moved to `PrototypeDevToolbar`).
 * - Includes `SegmentedControl` for `Profil Toko` | `Riwayat Chat`, interactive 5-step Funnel Stage
 *   stepper, inline Catatan Sales editor, Tindak Lanjut Terbuka card (opens `d02`), and expandable
 *   7-layer Memori AI accordion with clean single numbering (`1. IDENTITAS` .. `7. PERCAKAPAN`).
 */
export const TokoDetailView: React.FC<TokoDetailViewProps> = ({
  shop,
  onBack,
  onOpenShopInInbox,
  onOpenEditDataModal,
  onOpenEditContactModal,
  onOpenDeleteModal,
  onOpenCreateFollowUpModal,
  onNavigateToFollowUpSchedule,
  onToggleDisqualified,
  onUpdateFunnelStep,
  onSaveInlineOwnerNote,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTabId>('profil_toko');
  const [expandedLayers, setExpandedLayers] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  // Inline Owner Note editor state
  const [isEditingInlineNote, setIsEditingInlineNote] = useState(false);
  const [inlineNoteDraft, setInlineNoteDraft] = useState(shop.salesOwnerNote);

  React.useEffect(() => {
    setInlineNoteDraft(shop.salesOwnerNote);
    setIsEditingInlineNote(false);
  }, [shop.id, shop.salesOwnerNote]);

  const toggleLayerExpanded = (layerNum: number) => {
    setExpandedLayers((prev) => ({
      ...prev,
      [layerNum]: !prev[layerNum],
    }));
  };

  const expandAllLayers = () => {
    const allOpen = [1, 2, 3, 4, 5, 6, 7].every((n) => expandedLayers[n]);
    if (allOpen) {
      setExpandedLayers({});
    } else {
      setExpandedLayers({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true });
    }
  };

  return (
    <div className="space-y-4">
      {/* ====================================================================
       * 1. TOP ACTION TOOLBAR (GlassChrome) - Production Controls Only
       * ==================================================================== */}
      <GlassChrome
        as="section"
        variant="toolbar"
        aria-label="Bilah Aksi Detail Toko"
        className="p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Kembali + Buka WhatsApp + Sapaan notice */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={onBack}
            >
              Kembali
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Smartphone className="w-4 h-4" />}
              onClick={() => onOpenShopInInbox(shop)}
            >
              Buka WhatsApp
            </Button>

            <span className="hidden xl:inline-block text-[11px] text-[var(--text-tertiary)] max-w-[130px] leading-tight">
              Sapaan bertemplat tetap lewat Antrean
            </span>
          </div>

          {/* Right: Action Buttons (`Buka di Inbox`, `Ubah Data` [d07], `Ubah Kontak` [d06], `Edit Catatan` [d06], `Bukan target`, `Hapus Toko` [d08]) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => onOpenShopInInbox(shop)}
            >
              Buka di Inbox
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Settings className="w-3.5 h-3.5" />}
              onClick={onOpenEditDataModal}
            >
              Ubah Data
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Smartphone className="w-3.5 h-3.5" />}
              onClick={() => onOpenEditContactModal('contact')}
            >
              Ubah Kontak
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Star className="w-3.5 h-3.5" />}
              onClick={() => onOpenEditContactModal('note')}
            >
              Edit Catatan
            </Button>

            <Button
              variant={shop.isDisqualified ? 'secondary' : 'destructive-outline'}
              size="sm"
              leftIcon={
                shop.isDisqualified ? (
                  <Undo2 className="w-3.5 h-3.5" />
                ) : (
                  <Ban className="w-3.5 h-3.5" />
                )
              }
              onClick={() => onToggleDisqualified(shop.id)}
            >
              {shop.isDisqualified ? 'Batalkan label' : 'Bukan target'}
            </Button>

            <Button
              variant="destructive-outline"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={onOpenDeleteModal}
            >
              Hapus Toko
            </Button>
          </div>
        </div>
      </GlassChrome>

      {/* ====================================================================
       * 2. SEGMENTED CONTROL: `Profil Toko` | `Riwayat Chat`
       * ==================================================================== */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <SegmentedControl<DetailTabId>
          ariaLabel="Sub-tampilan Detail Toko"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { id: 'profil_toko', label: 'Profil Toko' },
            {
              id: 'riwayat_chat',
              label: 'Riwayat Chat',
              count: shop.chatMessages.length,
            },
          ]}
        />
      </div>

      {/* ====================================================================
       * 3A. TAB 1: PROFIL TOKO (`09-toko-detail` & `09c-toko-detail-2`)
       * ==================================================================== */}
      {activeTab === 'profil_toko' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT 8 COLUMNS: Identity, Tautan Online, 5-Step Funnel Stage, Catatan Sales, Riwayat Percakapan Terakhir */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. IDENTITY CARD */}
            <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[18px] md:text-[20px] font-bold tracking-tight text-[var(--text-primary)] break-words">
                      {shop.shopName}
                    </h2>
                    {shop.isDisqualified && (
                      <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[var(--status-danger-bg)] text-[var(--status-danger)] border border-[var(--status-danger-border)]">
                        Bukan target
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1.5 flex-wrap tabular-nums">
                    <span>ID Lead: {shop.leadIdNumber}</span>
                    <span>·</span>
                    <span>{shop.city || 'Belum diisi'}</span>
                    <span>·</span>
                    <span>Sesi: {shop.waSessionLabel}</span>
                    <span>·</span>
                    <span>Diperbarui {shop.lastUpdatedLabel}</span>
                  </div>
                </div>

                {/* Status Badges (Single Status Badge + Optional Tier/Score Badge - No Duplicate) */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {shop.score !== null && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)] tabular-nums">
                      {shop.tier} · Skor {shop.score} ({shop.coveragePercent}% cakupan)
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      shop.chatStatusCode === 'SALES_HANDLED'
                        ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                        : shop.chatStatusCode === 'AI_HANDLED'
                          ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
                          : 'bg-[var(--surface-recessed)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                    }`}
                  >
                    {shop.chatStatusLabel}
                  </span>
                </div>
              </div>

              {/* Metadata Grid: Alamat, Brand / Sumber, Kontak WA, Maps Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-hairline)] text-[13px]">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Alamat
                  </div>
                  <div className="font-medium text-[var(--text-primary)]">
                    {shop.fullAddress || 'Belum diisi'}
                  </div>
                  {shop.googleMapsUrl && (
                    <a
                      href={shop.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] md:min-h-[30px] inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--accent-primary)] hover:underline mt-0.5"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Buka di Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                      Brand / Sumber
                    </div>
                    <div className="font-semibold text-[var(--text-primary)]">
                      {shop.brandSourceLabel}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                      Kontak WhatsApp & PIC
                    </div>
                    <div className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {shop.whatsappNumber} · <span className="font-normal">{shop.picName}</span>
                    </div>
                    {shop.secondaryPhones.length > 0 && (
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 tabular-nums">
                        Nomor tambahan:{' '}
                        {shop.secondaryPhones
                          .map((sp) => `${sp.phone} (${sp.label})`)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SolidCard>

            {/* 2. TAUTAN ONLINE CARD (`09-toko-detail` empty state & `09c-toko-detail-2` with 2 links) */}
            <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Tautan Online</span>
                </h3>
                <div className="flex items-center gap-2">
                  {shop.onlineLinks.length > 0 && (
                    <span className="px-2 py-0.5 rounded-[5px] text-[11px] font-bold bg-[var(--surface-recessed)] text-[var(--text-secondary)] tabular-nums">
                      {shop.onlineLinks.length} tautan
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onOpenEditDataModal}
                    className="min-h-[44px] md:min-h-[32px] px-2 text-[12px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                  >
                    Kelola tautan
                  </button>
                </div>
              </div>

              {shop.onlineLinks.length === 0 ? (
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Tidak ada tautan online tercatat untuk toko ini.
                </p>
              ) : (
                <div className="divide-y divide-[var(--border-hairline)]">
                  {shop.onlineLinks.map((lnk) => (
                    <div
                      key={lnk.id}
                      className="py-1.5 flex items-center justify-between gap-3 text-[13px]"
                    >
                      <span className="font-semibold text-[var(--text-secondary)] shrink-0">
                        {lnk.type}
                      </span>
                      <a
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] md:min-h-[30px] font-medium text-[var(--accent-primary)] hover:underline truncate inline-flex items-center gap-1"
                      >
                        <span className="truncate">{lnk.displayLabel || lnk.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </SolidCard>

            {/* 3. 5-STEP FUNNEL STAGE STEPPER (`Prospek`, `Terkontak`, `Berminat`, `Negosiasi`, `Deal Tercapai`) */}
            <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Funnel Stage</h3>
                <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Klik tahap untuk memperbarui progres kualifikasi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {FUNNEL_STEPS.map((st) => {
                  const isCompleted = shop.funnelStepperIndex > st.index;
                  const isCurrent = shop.funnelStepperIndex === st.index;
                  return (
                    <button
                      key={st.index}
                      type="button"
                      onClick={() => onUpdateFunnelStep(shop.id, st.index)}
                      className={`min-h-[44px] px-2.5 py-2 rounded-[var(--radius-sm)] border flex items-center gap-2 text-left cursor-pointer hig-transition hig-focus ${
                        isCurrent
                          ? 'bg-[var(--accent-tint)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold shadow-xs'
                          : isCompleted
                            ? 'bg-[var(--status-success-bg)] border-[var(--status-success-border)] text-[var(--status-success)] font-semibold'
                            : 'bg-[var(--surface-recessed)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums ${
                          isCurrent
                            ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                            : isCompleted
                              ? 'bg-[var(--status-success-fill)] text-white'
                              : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border border-[var(--border-strong)]'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.index}
                      </span>
                      <span className="text-[12px] leading-tight truncate">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </SolidCard>

            {/* 4. CATATAN SALES (OWNER NOTE) WITH INLINE EDIT */}
            <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                  Catatan Sales (Owner Note)
                </h3>
                {!isEditingInlineNote && (
                  <button
                    type="button"
                    onClick={() => setIsEditingInlineNote(true)}
                    className="min-h-[44px] md:min-h-[36px] px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-tint)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditingInlineNote ? (
                <div className="space-y-2.5">
                  <textarea
                    rows={3}
                    value={inlineNoteDraft}
                    onChange={(e) => setInlineNoteDraft(e.target.value)}
                    placeholder="Tulis catatan negosiasi, stok incaran, atau jam operasional toko..."
                    className="w-full p-3 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setInlineNoteDraft(shop.salesOwnerNote);
                        setIsEditingInlineNote(false);
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onSaveInlineOwnerNote(shop.id, inlineNoteDraft);
                        setIsEditingInlineNote(false);
                      }}
                    >
                      Simpan Catatan
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-[var(--text-secondary)] whitespace-pre-line">
                  {shop.salesOwnerNote || 'Belum ada catatan.'}
                </p>
              )}
            </SolidCard>

            {/* 5. RIWAYAT PERCAKAPAN TERAKHIR PREVIEW (`09-toko-detail` & `09c-toko-detail-2`) */}
            <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
                  Riwayat Percakapan Terakhir
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[5px] text-[11px] font-bold bg-[var(--surface-recessed)] text-[var(--text-secondary)] tabular-nums">
                    {shop.chatMessages.length} pesan
                  </span>
                  {shop.chatMessages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('riwayat_chat')}
                      className="min-h-[44px] md:min-h-[30px] px-2 inline-flex items-center text-[12px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                    >
                      Lihat semua transkrip →
                    </button>
                  )}
                </div>
              </div>

              {shop.chatMessages.length === 0 ? (
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Belum ada riwayat percakapan. Gunakan tombol Sapa untuk memulai pendekatan.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {shop.chatMessages.slice(0, 5).map((msg) => {
                    const isShop = msg.senderType === 'shop';
                    return (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-[var(--radius-sm)] border ${
                          isShop
                            ? 'bg-[var(--surface-recessed)] border-[var(--border-hairline)] mr-6'
                            : 'bg-[var(--status-success-bg)]/55 border-[var(--status-success-border)] ml-6'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                          <span>{isShop ? 'Toko' : 'Sales'}</span>
                          <span className="tabular-nums">{msg.timestampWib}</span>
                        </div>
                        <p className="text-[13px] text-[var(--text-primary)] leading-relaxed">
                          {msg.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </SolidCard>
          </div>

          {/* RIGHT 4 COLUMNS: Tindak Lanjut Terbuka (opens d02) + Memori AI (7 Lapisan) */}
          <div className="lg:col-span-4 space-y-4">
            {/* 6. TINDAK LANJUT TERBUKA CARD (Opens Dialog d02) */}
            <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Tindak Lanjut Terbuka</span>
                </h3>
                <span className="text-[13px] font-bold text-[var(--status-warning)] tabular-nums">
                  {shop.openFollowUps.length}
                </span>
              </div>

              {shop.openFollowUps.length === 0 ? (
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Tidak ada tindak lanjut terbuka.
                </p>
              ) : (
                <div className="space-y-2">
                  {shop.openFollowUps.map((fu) => (
                    <div
                      key={fu.id}
                      className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[12px]"
                    >
                      <div className="font-bold text-[var(--accent-primary)] tabular-nums">
                        {fu.dueDateDisplay}
                      </div>
                      <div className="text-[var(--text-primary)] mt-0.5">{fu.topic}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => onOpenCreateFollowUpModal(shop)}
                >
                  Catat tindak lanjut
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onNavigateToFollowUpSchedule}
                >
                  Lihat jadwal
                </Button>
              </div>
            </SolidCard>

            {/* 7. MEMORI AI (7 LAPISAN) EXPANDABLE LIST (Single Numbering) */}
            <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Memori AI (7 Lapisan)</span>
                </h3>
                <button
                  type="button"
                  onClick={expandAllLayers}
                  className="min-h-[44px] md:min-h-[30px] px-2 inline-flex items-center text-[11px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                >
                  Buka / Tutup Semua
                </button>
              </div>

              <div className="space-y-2">
                {shop.aiMemoryLayers.map((layer) => {
                  const isOpen = Boolean(expandedLayers[layer.layerNumber]);
                  const cleanTitle = layer.title.replace(/^\d+\.\s*/, '');
                  return (
                    <div
                      key={layer.layerNumber}
                      className="rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleLayerExpanded(layer.layerNumber)}
                        aria-expanded={isOpen}
                        className="w-full min-h-[48px] p-3 text-left flex items-start justify-between gap-2 cursor-pointer hover:bg-[var(--surface-elevated)] hig-transition"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-primary)]">
                            {layer.layerNumber}. {cleanTitle}
                          </div>
                          <div className="text-[12px] text-[var(--text-secondary)] mt-0.5 break-words">
                            {layer.summary}
                          </div>
                        </div>
                        <span className="text-[var(--text-tertiary)] shrink-0 mt-0.5">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 border-t border-[var(--border-hairline)]/60 text-[12px] text-[var(--text-secondary)] space-y-1 bg-[var(--surface-solid)]/60">
                          <p className="leading-relaxed">{layer.detailDescription}</p>
                          <div className="text-[10px] text-[var(--text-tertiary)] tabular-nums">
                            Pembaruan lapisan: {layer.updatedAtWib}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </SolidCard>
          </div>
        </div>
      ) : (
        /* ====================================================================
         * 3B. TAB 2: RIWAYAT CHAT (`09b-toko-detail-chat`)
         *     Read-only transcript on a solid surface with a "Buka di Inbox" button.
         * ==================================================================== */
        <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-hairline)]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                  Riwayat Percakapan ({shop.chatMessages.length} pesan)
                </h3>
                <span className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold bg-[var(--surface-recessed)] text-[var(--text-secondary)]">
                  Transkrip Baca-Saja
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                {shop.shopName} · {shop.whatsappNumber} · Sesi: {shop.waSessionLabel}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => onOpenShopInInbox(shop)}
            >
              Buka di Inbox
            </Button>
          </div>

          {shop.chatMessages.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-[13px] text-[var(--text-secondary)]">
                Belum ada riwayat pesan WhatsApp tercatat pada toko ini.
              </p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<MessageSquare className="w-4 h-4" />}
                onClick={() => onOpenShopInInbox(shop)}
              >
                Mulai Sapaan di Hunter Inbox
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {shop.chatMessages.map((msg) => {
                const isShop = msg.senderType === 'shop';
                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-[var(--radius-sm)] border ${
                      isShop
                        ? 'bg-[var(--surface-recessed)] border-[var(--border-hairline)] mr-4 md:mr-20'
                        : 'bg-[var(--status-success-bg)]/60 border-[var(--status-success-border)] ml-4 md:ml-20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      <span>
                        {isShop ? `Toko (${shop.shopName})` : `Sales (${msg.senderLabel})`}
                      </span>
                      <span className="tabular-nums">{msg.timestampWib}</span>
                    </div>
                    <p className="text-[13px] text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                      {msg.body}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </SolidCard>
      )}
    </div>
  );
};
