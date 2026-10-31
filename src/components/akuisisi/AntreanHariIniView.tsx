import React, { useState, useMemo } from 'react';
import {
  Plus,
  ShieldCheck,
  LayoutGrid,
  Focus,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  AntreanHariIniViewDTO,
  DailyQueueShopItemDTO,
  HubId,
  SegmentId,
} from '../../mock/api';
import { GlassChrome } from '../ui/GlassChrome';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';

export interface QueueLastAction {
  itemId: string;
  shopName: string;
  previousStatus: DailyQueueShopItemDTO['status'];
  appliedStatus: 'sent' | 'disqualified';
}

export interface AntreanHariIniViewProps {
  data: AntreanHariIniViewDTO;
  onMarkQueueItem: (itemId: string, nextStatus: 'sent' | 'disqualified') => void;
  lastAction: QueueLastAction | null;
  onUndoLastAction: () => void;
  onOpenAddNumberDialog: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

/**
 * Segment 1: Antrean Hari Ini (`06-antrean-hari-ini`)
 * - Presentational component (zero internal API calls).
 * - Compact collapsible summary row ("Nomor aktif 2/12 · Breaker: Normal") that expands on tap,
 *   ensuring Mode Fokus card and all three action buttons fit above the mobile bottom tab bar
 *   at 390x844 without scrolling (scrollY = 0).
 * - Session select is strictly bounded (`w-full max-w-full min-w-0`) so it never clips.
 * - Every interactive control enforces >= 44x44px touch targets on mobile.
 */
export const AntreanHariIniView: React.FC<AntreanHariIniViewProps> = ({
  data,
  onMarkQueueItem,
  lastAction,
  onUndoLastAction,
  onOpenAddNumberDialog,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');
  const [isHeaderExpanded, setIsHeaderExpanded] = useState<boolean>(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('all');
  const [activeWaNotice, setActiveWaNotice] = useState<{
    shopName: string;
    whatsappNumber: string;
    spintaxText: string;
  } | null>(null);

  // Touch swipe state for Mode Fokus
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  const sessionFilteredItems = useMemo(() => {
    return data.items.filter((item) =>
      selectedSessionId === 'all' ? true : item.waSessionId === selectedSessionId
    );
  }, [data.items, selectedSessionId]);

  const pendingItems = useMemo(
    () => sessionFilteredItems.filter((item) => item.status === 'pending'),
    [sessionFilteredItems]
  );
  const sentCount = useMemo(
    () => sessionFilteredItems.filter((item) => item.status === 'sent').length,
    [sessionFilteredItems]
  );
  const disqualifiedCount = useMemo(
    () => sessionFilteredItems.filter((item) => item.status === 'disqualified').length,
    [sessionFilteredItems]
  );

  const totalQueueCount = sessionFilteredItems.length;
  const processedCount = sentCount + disqualifiedCount;
  const currentPositionNumber = Math.min(totalQueueCount, processedCount + 1);
  const progressPercent =
    totalQueueCount > 0 ? Math.round((processedCount / totalQueueCount) * 100) : 0;

  const currentFocusShop: DailyQueueShopItemDTO | undefined = pendingItems[0];

  const handleOpenWaMe = (shop: DailyQueueShopItemDTO) => {
    setActiveWaNotice({
      shopName: shop.shopName,
      whatsappNumber: shop.whatsappNumber,
      spintaxText: shop.spintaxGreetingPreview,
    });
  };

  // Touch handlers for Mode Fokus swipe (Right = Sent, Left = Skip / Bukan target)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = e.touches[0].clientX - touchStartX;
    setTouchDeltaX(delta);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || !currentFocusShop) {
      setTouchStartX(null);
      setTouchDeltaX(0);
      return;
    }
    if (touchDeltaX >= 65) {
      onMarkQueueItem(currentFocusShop.id, 'sent');
    } else if (touchDeltaX <= -65) {
      onMarkQueueItem(currentFocusShop.id, 'disqualified');
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  return (
    <div className="space-y-3">
      {/* ====================================================================
       * 1. COMPACT HEADER & COLLAPSIBLE QUOTA / CIRCUIT-BREAKER ROW
       * ==================================================================== */}
      <SolidCard padding="sm" className="space-y-2.5 overflow-hidden">
        {/* Top Row: Title + Counts on Left, View Mode Switcher on Right */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-[16px] md:text-[20px] font-bold tracking-tight text-[var(--text-primary)] truncate">
              {data.title}
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)] tabular-nums truncate">
              <strong className="text-[var(--text-primary)]">{pendingItems.length} belum</strong> ·{' '}
              <strong className="text-[var(--status-success)]">{sentCount} sudah</strong>
              {disqualifiedCount > 0 && <span> · {disqualifiedCount} bukan target</span>}
              <span className="hidden sm:inline"> · Target 20–25 toko/nomor</span>
            </p>
          </div>

          {/* View Mode Switcher: (a) Grid Kartu vs (b) Mode Fokus (44px touch targets) */}
          <div
            role="group"
            aria-label="Pilih cara kerja antrean"
            className="inline-flex items-center p-1 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] shrink-0"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-[var(--radius-xs)] text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer hig-transition ${
                viewMode === 'grid'
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Grid Kartu</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('focus')}
              className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-[var(--radius-xs)] text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer hig-transition ${
                viewMode === 'focus'
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Focus className="w-4 h-4 shrink-0" />
              <span>Mode Fokus</span>
            </button>
          </div>
        </div>

        {/* One Compact Summary Row that expands on tap */}
        <button
          type="button"
          onClick={() => setIsHeaderExpanded((prev) => !prev)}
          aria-expanded={isHeaderExpanded}
          className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[var(--status-success)] flex items-center justify-between gap-2 text-left cursor-pointer hig-transition"
        >
          <div className="flex items-center gap-2 min-w-0 text-[12px] sm:text-[13px] font-semibold tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success-fill)] shrink-0" />
            <span className="truncate">
              Nomor aktif {data.activeNumbersCount}/{data.maxNumbersCapacity} · Breaker: Normal (0.0%
              &lt; 35%)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[12px] font-bold shrink-0">
            <span className="hidden sm:inline">
              {isHeaderExpanded ? 'Sembunyikan' : 'Kelola Sesi & Nomor'}
            </span>
            {isHeaderExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {/* Expanded Quota, Session Select & Circuit-Breaker Details */}
        {isHeaderExpanded && (
          <GlassChrome
            variant="toolbar"
            radius="sm"
            className="p-3 space-y-3 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={onOpenAddNumberDialog}
                >
                  Tambah Nomor
                </Button>
                <span className="min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[12px] font-medium text-[var(--text-secondary)] inline-flex items-center tabular-nums">
                  {data.needsInspectionLabel}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--status-success)]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{data.circuitBreakerText}</span>
              </span>
            </div>

            {/* Bounded Session Filter Select (Never overflows parent card) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 w-full min-w-0">
              <label
                htmlFor="antrean-session-filter"
                className="text-[12px] font-semibold text-[var(--text-secondary)] shrink-0"
              >
                Filter nomor / sesi:
              </label>
              <select
                id="antrean-session-filter"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full max-w-full min-w-0 sm:w-72 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] truncate"
              >
                {data.sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </GlassChrome>
        )}
      </SolidCard>

      {/* ====================================================================
       * 2. UNDO BANNER (In Grid Mode) & WA.ME DEEP LINK PREVIEW BANNER
       * ==================================================================== */}
      {lastAction && viewMode === 'grid' && (
        <div
          role="status"
          className="px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] shadow-xs flex flex-wrap items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2 text-[13px] text-[var(--text-primary)]">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                lastAction.appliedStatus === 'sent'
                  ? 'bg-[var(--status-success-fill)]'
                  : 'bg-[var(--status-warning-fill)]'
              }`}
            />
            <span>
              Terakhir: <strong>{lastAction.shopName}</strong> ditandai{' '}
              <strong>
                {lastAction.appliedStatus === 'sent' ? 'Sudah Terkirim' : 'Bukan Target'}
              </strong>
              .
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onUndoLastAction}
          >
            Urungkan Tindakan Terakhir
          </Button>
        </div>
      )}

      {activeWaNotice && (
        <div
          role="status"
          className="p-3 rounded-[var(--radius-sm)] bg-[var(--accent-tint)] border border-[var(--accent-primary)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
        >
          <div className="space-y-0.5 min-w-0">
            <div className="text-[12px] font-bold text-[var(--accent-primary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                Tautan wa.me: {activeWaNotice.shopName} ({activeWaNotice.whatsappNumber})
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-primary)] line-clamp-2">
              “{activeWaNotice.spintaxText}”
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('inbox', 'inbox_workspace')}
            >
              Buka di Inbox
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveWaNotice(null)}>
              Tutup
            </Button>
          </div>
        </div>
      )}

      {/* ====================================================================
       * 3A. MODE FOKUS (ONE SHOP AT A TIME — FITS 390x844 WITHOUT SCROLLING)
       * ==================================================================== */}
      {viewMode === 'focus' ? (
        <div className="max-w-2xl mx-auto">
          {currentFocusShop ? (
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform:
                  touchDeltaX !== 0
                    ? `translateX(${Math.max(-90, Math.min(90, touchDeltaX))}px)`
                    : undefined,
              }}
              className="hig-transition"
            >
              <SolidCard padding="md" className="space-y-3 border-2 border-[var(--border-strong)]">
                {/* Integrated Progress Bar & Undo Row */}
                <div className="space-y-1.5 pb-2.5 border-b border-[var(--border-hairline)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--accent-tint)] text-[var(--accent-primary)] text-[12px] font-bold tabular-nums">
                        {currentPositionNumber} dari {totalQueueCount}
                      </span>
                      <span className="text-[12px] font-semibold text-[var(--text-secondary)] tabular-nums">
                        Terkirim: {sentCount} · Lewat: {disqualifiedCount}
                      </span>
                    </div>

                    {lastAction && (
                      <Button
                        variant="ghost"
                        size="xs"
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        onClick={onUndoLastAction}
                      >
                        Urungkan
                      </Button>
                    )}
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-[var(--surface-recessed)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent-fill)] hig-transition"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Shop Identity & Tier / Score (Shop name wraps up to 2 lines with no ellipsis) */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-[var(--text-tertiary)] tabular-nums">
                      ID #{currentFocusShop.leadIdNumber} · {currentFocusShop.antiReportLineLabel}
                    </div>
                    <h3 className="text-[17px] sm:text-[18px] font-bold text-[var(--text-primary)] leading-snug break-words mt-0.5">
                      {currentFocusShop.shopName}
                    </h3>
                    <p className="text-[13px] text-[var(--text-secondary)] truncate mt-0.5">
                      {currentFocusShop.city} · PIC:{' '}
                      <strong className="text-[var(--text-primary)]">
                        {currentFocusShop.picName}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-xs)] text-[11px] font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-warning-fill)]" />
                      <span>{currentFocusShop.tier}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-[var(--radius-xs)] text-[11px] font-bold bg-[var(--surface-recessed)] text-[var(--text-primary)] border border-[var(--border-hairline)] tabular-nums">
                      Skor {currentFocusShop.score}
                    </span>
                  </div>
                </div>

                {/* Compact Phone + Spintax Box */}
                <div className="p-2.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums">
                      {currentFocusShop.whatsappNumber}
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)] truncate">
                      {currentFocusShop.fullAddress}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--text-secondary)] line-clamp-2">
                    “{currentFocusShop.spintaxGreetingPreview}”
                  </p>
                </div>

                {/* THREE VISIBLE ACTIONS (All >= 44px touch targets & swipe hints outside buttons) */}
                <div className="space-y-1.5 pt-0.5">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => handleOpenWaMe(currentFocusShop)}
                  >
                    Buka wa.me
                  </Button>

                  {/* Edge Swipe Hints outside the buttons */}
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-between px-1 text-[11px] font-medium text-[var(--text-tertiary)] select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" />
                      <span>Geser kiri: Bukan target</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span>Geser kanan: Terkirim</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<XCircle className="w-4 h-4 text-[var(--status-danger)]" />}
                      onClick={() => onMarkQueueItem(currentFocusShop.id, 'disqualified')}
                      aria-label={`Bukan target untuk ${currentFocusShop.shopName}`}
                    >
                      <span>Bukan target</span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<CheckCircle2 className="w-4 h-4 text-[var(--status-success)]" />}
                      onClick={() => onMarkQueueItem(currentFocusShop.id, 'sent')}
                      className="border-[var(--status-success-border)] text-[var(--status-success)] hover:bg-[var(--status-success-bg)]"
                      aria-label={`Tandai Terkirim untuk ${currentFocusShop.shopName}`}
                    >
                      <span>Terkirim</span>
                    </Button>
                  </div>
                </div>
              </SolidCard>
            </div>
          ) : (
            <SolidCard padding="lg" className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[var(--status-success)] mx-auto" />
              <h3 className="hig-headline text-[var(--text-primary)]">
                Seluruh Toko dalam Antrean Fokus Telah Diproses
              </h3>
              <p className="hig-footnote text-[var(--text-secondary)]">
                Anda telah menyelesaikan {sentCount} sapaan terkirim dan melewatkan{' '}
                {disqualifiedCount} toko bukan target.
              </p>
              {lastAction && (
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={onUndoLastAction}
                  >
                    Urungkan Tindakan Terakhir
                  </Button>
                </div>
              )}
            </SolidCard>
          )}
        </div>
      ) : (
        /* ==================================================================
         * 3B. CARD GRID VIEW (`06-antrean-hari-ini` 3-column grid on desktop)
         * ================================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sessionFilteredItems.map((shop) => {
            const isSent = shop.status === 'sent';
            const isDisqualified = shop.status === 'disqualified';

            return (
              <SolidCard
                key={shop.id}
                padding="md"
                className={`flex flex-col justify-between gap-4 ${
                  isSent || isDisqualified ? 'opacity-70' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-bold text-[var(--text-primary)] truncate">
                        {shop.shopName}
                      </h3>
                      <p className="text-[13px] text-[var(--text-secondary)] truncate">
                        {shop.city} · PIC: {shop.picName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-bold border ${
                          shop.tier === 'Tier A'
                            ? 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]'
                            : 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-transparent'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            shop.tier === 'Tier A'
                              ? 'bg-[var(--status-warning-fill)]'
                              : 'bg-[var(--accent-fill)]'
                          }`}
                        />
                        <span>{shop.tier}</span>
                      </span>
                      <span className="text-[12px] font-bold text-[var(--text-primary)] tabular-nums">
                        Skor {shop.score}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[13px] font-semibold text-[var(--text-secondary)] tabular-nums">
                      {shop.whatsappNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-[4px] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[11px] font-medium text-[var(--text-tertiary)]">
                      {shop.antiReportLineLabel}
                    </span>
                  </div>

                  {shop.status !== 'pending' && (
                    <div className="pt-1">
                      {isSent ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sudah Terkirim</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold bg-[var(--status-danger-bg)] text-[var(--status-danger)] border border-[var(--status-danger-border)]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Bukan Target</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--border-hairline)] flex flex-wrap items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenWaMe(shop)}
                  >
                    Buka wa.me
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isSent}
                    onClick={() => onMarkQueueItem(shop.id, 'sent')}
                  >
                    Tandai Sudah Terkirim
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDisqualified}
                    onClick={() => onMarkQueueItem(shop.id, 'disqualified')}
                  >
                    Bukan target
                  </Button>
                </div>
              </SolidCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
