import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Compass,
  MessageSquare,
  Store,
  Tag,
  BarChart3,
  Upload,
  ShieldCheck,
  Search,
  Bell,
  Calendar,
  Power,
  PanelLeftClose,
  PanelLeftOpen,
  MoreHorizontal,
  LogOut,
  Sparkles,
  ArrowRight,
  Clock,
  Lock,
  Monitor,
  Minus,
  Plus,
} from 'lucide-react';
import { UI_SCALE_STEPS, useAppState } from '../../context/AppStateContext';
import { DatabaseShopRowDTO, HubId, NavHubItem, SegmentId } from '../../mock/api';
import { GlassChrome } from '../ui/GlassChrome';
import { SolidCard } from '../ui/SolidCard';
import { Button, IconButton } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';
import { ModalSheet } from '../ui/ModalSheet';
import { AsyncStateWrapper } from '../ui/AsyncStateWrapper';
import { BerandaView } from '../beranda/BerandaView';
import { HunterInboxView } from '../inbox/HunterInboxView';
import { AjukanResellerModal } from '../dialogs/AjukanResellerModal';
import { TambahNomorWarningModal } from '../dialogs/TambahNomorWarningModal';
import { CatatTindakLanjutModal } from '../dialogs/CatatTindakLanjutModal';
import { TambahTokoModal } from '../dialogs/TambahTokoModal';
import { UbahDataTokoModal } from '../dialogs/UbahDataTokoModal';
import { UbahKontakCatatanModal } from '../dialogs/UbahKontakCatatanModal';
import { HapusTokoModal } from '../dialogs/HapusTokoModal';
import { UnggahMediaModal } from '../dialogs/UnggahMediaModal';
import { AntreanHariIniView } from '../akuisisi/AntreanHariIniView';
import { RadarTokoView } from '../akuisisi/RadarTokoView';
import { JadwalTindakLanjutView } from '../akuisisi/JadwalTindakLanjutView';
import { KetepatanWaktuSlaView } from '../akuisisi/KetepatanWaktuSlaView';
import { AntreanHandoverErpView } from '../akuisisi/AntreanHandoverErpView';
import { DatabaseTokoTableView } from '../database/DatabaseTokoTableView';
import { PetaProvinsiView } from '../database/PetaProvinsiView';
import { TokoDetailView } from '../database/TokoDetailView';
import { KatalogHargaView } from '../katalog/KatalogHargaView';
import { PustakaMediaPromosiView } from '../katalog/PustakaMediaPromosiView';
import { LaporanPeriodeView } from '../laporan/LaporanPeriodeView';
import { LaporanTargetView } from '../laporan/LaporanTargetView';
import { LaporanSapaanView } from '../laporan/LaporanSapaanView';
import { ImporTokoView } from '../impor/ImporTokoView';
import { ImporRiwayatView } from '../impor/ImporRiwayatView';
import { ImporStokView } from '../impor/ImporStokView';
import { ImporHargaView } from '../impor/ImporHargaView';

function renderHubIcon(iconName: NavHubItem['iconName'], className = 'w-5 h-5') {
  switch (iconName) {
    case 'home':
      return <Home className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'message-square':
      return <MessageSquare className={className} />;
    case 'store':
      return <Store className={className} />;
    case 'tag':
      return <Tag className={className} />;
    case 'bar-chart-3':
      return <BarChart3 className={className} />;
    case 'upload':
      return <Upload className={className} />;
    case 'shield-check':
      return <ShieldCheck className={className} />;
  }
}

/**
 * Apple HIG AppShell (Desktop 1440px & Mobile 390px)
 * - Notification popover closes on Escape, outside click, and navigation.
 * - Hunter Inbox workspace fits the exact viewport height (`100dvh - 4rem` on desktop,
 *   `100dvh - 8rem - env(safe-area-inset-bottom)` on mobile) with internal pane scrolling.
 */
export const AppShell: React.FC = () => {
  const {
    bootstrap,
    berandaData,
    inboxWorkspace,
    akuisisiBundle,
    databaseBundle,
    katalogBundle,
    laporanBundle,
    imporBundle,
    visibleHubs,
    currentOperator,
    unreadNotificationCount,
    role,
    setRole,
    activeHub,
    activeSegment,
    navigateTo,
    aiKillSwitchActive,
    toggleAiKillSwitch,
    setIsCommandPaletteOpen,
    markAllNotificationsRead,
    selectedThreadId,
    setSelectedThreadId,
    sendInboxMessage,
    toggleInboxThreadHandler,
    markInboxThreadDisqualified,
    handoverModalLead,
    openHandoverModal,
    closeHandoverModal,
    submitHandoverToErp,
    lastQueueAction,
    markQueueItem,
    undoLastQueueAction,
    isAddNumberModalOpen,
    setIsAddNumberModalOpen,
    confirmAddActiveNumber,
    checkDuplicatePhoneInErp,
    checkRadarRowErp,
    sendRadarRowSpintax,
    addRadarCityChip,
    isCreateFollowUpModalOpen,
    setIsCreateFollowUpModalOpen,
    markFollowUpCompleted,
    createFollowUpCommitment,
    selectedShopDetailId,
    setSelectedShopDetailId,
    databaseCityFilterOverride,
    setDatabaseCityFilterOverride,
    filterShopsByRegionFromMap,
    isAddShopModalOpen,
    setIsAddShopModalOpen,
    createShopFromAcquaintance,
    isEditShopDataModalOpen,
    setIsEditShopDataModalOpen,
    updateShopData,
    addShopOnlineLink,
    removeShopOnlineLink,
    moveShopTierWithReason,
    isEditShopContactModalOpen,
    editShopContactFocusField,
    openEditShopContactModal,
    closeEditShopContactModal,
    updateShopContactAndNote,
    isDeleteShopModalOpen,
    setIsDeleteShopModalOpen,
    softDeleteShop,
    toggleShopDisqualified,
    updateShopFunnelStep,
    saveShopInlineOwnerNote,
    openShopInHunterInbox,
    mapTransitionTrigger,
    isUploadMediaModalOpen,
    setIsUploadMediaModalOpen,
    syncPriceCatalogFromErp,
    uploadPromotionalMedia,
    softDeletePromotionalMedia,
    restorePromotionalMedia,
    uploadMediaPrefill,
    sapaanPeriod,
    setSapaanPeriod,
    refreshLaporanData,
    refreshImporData,
    addImportHistoryRecord,
    simulateErpError,
    setIsAuthenticated,
    visualDirection,
    uiScaleMode,
    uiScaleStep,
    autoDetectedScale,
    effectiveUiScalePct,
    isPhoneViewport,
    setUiScaleMode,
    setUiScaleStep,
    stepUiScaleUp,
    stepUiScaleDown,
    resetUiScale,
    asyncState,
    reloadCurrentViewData,
  } = useAppState();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [scalePopoverOpen, setScalePopoverOpen] = useState(false);
  const [aiConfirmModalOpen, setAiConfirmModalOpen] = useState(false);
  const [mobileLainnyaOpen, setMobileLainnyaOpen] = useState(false);
  const [followUpInitialLead, setFollowUpInitialLead] = useState<{
    leadIdNumber: number;
    shopName: string;
  } | null>(null);

  const notifContainerRef = useRef<HTMLDivElement | null>(null);
  const scaleContainerRef = useRef<HTMLDivElement | null>(null);

  // Close popovers on navigation (activeHub or activeSegment change)
  useEffect(() => {
    setNotifPopoverOpen(false);
    setScalePopoverOpen(false);
  }, [activeHub, activeSegment]);

  // Close notification popover on Escape key and outside click
  useEffect(() => {
    if (!notifPopoverOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifPopoverOpen(false);
      }
    };

    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target as Node)
      ) {
        setNotifPopoverOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [notifPopoverOpen]);

  // Close UI Scale popover on Escape key and outside click
  useEffect(() => {
    if (!scalePopoverOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setScalePopoverOpen(false);
      }
    };

    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      if (
        scaleContainerRef.current &&
        !scaleContainerRef.current.contains(e.target as Node)
      ) {
        setScalePopoverOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [scalePopoverOpen]);

  if (!bootstrap || !currentOperator) {
    return null;
  }

  const crmHubs = visibleHubs.filter((h) => h.group === 'crm');
  const adminHubs = visibleHubs.filter((h) => h.group === 'admin');

  const currentHubObj =
    visibleHubs.find((h) => h.id === activeHub) ?? visibleHubs[0];
  const currentSegmentObj =
    currentHubObj.segments.find((s) => s.id === activeSegment) ??
    currentHubObj.segments[0];

  // Mobile 5 Primary Bottom Tabs (`Beranda`, `Antrean`, `Inbox`, `Toko`, `Lainnya`)
  const mobilePrimaryHubIds: HubId[] = ['beranda', 'akuisisi', 'inbox', 'database'];
  const isLainnyaActive = !mobilePrimaryHubIds.includes(activeHub);

  const operatorFirstName = currentOperator.fullName.split(' ')[0] || 'Nadia';

  // Determine whether current active view is built
  const isBerandaActive = activeHub === 'beranda' && activeSegment === 'beranda_utama';
  const isInboxActive = activeHub === 'inbox' && activeSegment === 'inbox_workspace';
  const isViewportLockedInbox = isInboxActive && asyncState === 'success';
  const isSplitDatabaseView =
    activeHub === 'database' &&
    !selectedShopDetailId &&
    (activeSegment === 'semua_toko' ||
      activeSegment === 'toko_tier_a' ||
      activeSegment === 'reseller_aktif');

  const selectedShopDetail: DatabaseShopRowDTO | null =
    activeHub === 'database' && selectedShopDetailId && databaseBundle
      ? (databaseBundle.shops.find((s) => s.id === selectedShopDetailId) ?? null)
      : null;

  const handleOpenFollowUpForShop = (shop: DatabaseShopRowDTO) => {
    setFollowUpInitialLead({
      leadIdNumber: shop.leadIdNumber,
      shopName: shop.shopName,
    });
    setIsCreateFollowUpModalOpen(true);
  };

  return (
    <div className="relative min-h-[var(--effective-vh)] w-full hig-ambient-canvas flex flex-col md:flex-row text-[var(--text-primary)]">
      {/* ====================================================================
       * 0. RICH SPATIAL AMBIENT COLOR BLOBS BEHIND GLASS SURFACES (Directions A, B, C)
       * ==================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className={`absolute -top-20 -left-16 w-[560px] h-[560px] rounded-full blur-[90px] hig-transition ${
            visualDirection === 'B'
              ? 'bg-[var(--ambient-orb-1)] opacity-100'
              : 'bg-[var(--ambient-orb-1)] opacity-85'
          }`}
        />
        <div
          className={`absolute top-8 right-[-100px] w-[620px] h-[560px] rounded-full blur-[100px] hig-transition ${
            visualDirection === 'B'
              ? 'bg-[var(--ambient-orb-2)] opacity-100'
              : 'bg-[var(--ambient-orb-2)] opacity-85'
          }`}
        />
        <div
          className={`absolute top-[28%] left-[34%] w-[540px] h-[500px] rounded-full blur-[105px] hig-transition ${
            visualDirection === 'B'
              ? 'bg-[var(--ambient-orb-3)] opacity-95'
              : 'bg-[var(--ambient-orb-3)] opacity-80'
          }`}
        />
        <div
          className={`absolute bottom-[-120px] right-[16%] w-[580px] h-[520px] rounded-full blur-[105px] hig-transition ${
            visualDirection === 'B'
              ? 'bg-[var(--ambient-orb-5)] opacity-95'
              : 'bg-[var(--ambient-orb-5)] opacity-80'
          }`}
        />
        <div
          className={`absolute bottom-[-90px] left-[10%] w-[520px] h-[480px] rounded-full blur-[95px] hig-transition ${
            visualDirection === 'B'
              ? 'bg-[var(--ambient-orb-4)] opacity-95'
              : 'bg-[var(--ambient-orb-4)] opacity-80'
          }`}
        />
      </div>

      {/* ====================================================================
       * 1. DESKTOP TRANSLUCENT SIDEBAR (Directions A & B; in Direction C, layout is centered 2-pane with floating bottom toolbar)
       *    - Sidebar items: 44px tall (`min-h-[44px]`) with 8px gaps (`space-y-2`)
       *    - Section titles: 24px top margin (`mt-6`)
       * ==================================================================== */}
      <GlassChrome
        as="aside"
        variant={visualDirection === 'B' ? 'popover' : 'sidebar'}
        aria-label="Navigasi Utama Olivia SDR"
        className={`${
          visualDirection === 'C' && isSplitDatabaseView ? 'hidden' : 'hidden md:flex'
        } flex-col shrink-0 sticky z-30 hig-transition ${
          visualDirection === 'B'
            ? 'top-6 my-6 ml-6 h-[calc(var(--effective-vh)-3rem)] rounded-[28px] border border-[var(--glass-border)]'
            : 'top-0 h-[var(--effective-vh)] border-r border-[var(--glass-border)]'
        } ${sidebarCollapsed ? 'w-[80px]' : 'w-[268px]'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-hairline)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--accent-fill)] flex items-center justify-center shrink-0 shadow-xs">
              <div className="flex items-end gap-0.5" aria-hidden="true">
                <span className="w-1 h-2.5 rounded-full bg-white/85" />
                <span className="w-1 h-4 rounded-full bg-white" />
                <span className="w-1 h-3 rounded-full bg-white/90" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-[16px] font-bold tracking-tight text-[var(--text-primary)] truncate">
                  Olivia SDR
                </div>
                <div className="text-[12px] font-medium text-[var(--text-secondary)] truncate">
                  WhatsApp Reseller CRM
                </div>
              </div>
            )}
          </div>

          <IconButton
            label={sidebarCollapsed ? 'Perluas bilah sisi' : 'Ciutkan bilah sisi'}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="-mr-1"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </IconButton>
        </div>

        {/* Navigation Groups (44px item height, 8px item gap `space-y-2`, 24px section title top margin `mt-6`) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu Hub CRM">
          {/* GROUP 1: PENJUALAN & CRM */}
          <div>
            {!sidebarCollapsed && (
              <div className="mt-6 first:mt-2 px-3 pb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                Penjualan & CRM
              </div>
            )}
            <div className="space-y-2">
              {crmHubs.map((hub) => {
                const isActive = hub.id === activeHub;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => navigateTo(hub.id)}
                    title={sidebarCollapsed ? hub.label : undefined}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] flex items-center justify-between gap-2.5 text-[15px] font-medium cursor-pointer select-none hig-transition hig-focus ${
                      isActive
                        ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] font-semibold shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-solid)]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0">{renderHubIcon(hub.iconName, 'w-5 h-5')}</span>
                      {!sidebarCollapsed && <span className="truncate">{hub.label}</span>}
                    </div>
                    {!sidebarCollapsed && typeof hub.badgeCount === 'number' && hub.badgeCount > 0 && (
                      <span
                        className={`px-2 py-0.5 text-[12px] font-bold rounded-[6px] tabular-nums ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--accent-tint)] text-[var(--accent-primary)]'
                        }`}
                      >
                        {hub.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GROUP 2: ADMINISTRASI & SISTEM (24px top margin `mt-6`, 8px item gap `space-y-2`) */}
          {adminHubs.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--border-hairline)]">
              {!sidebarCollapsed && (
                <div className="px-3 pb-2 flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  <span>Administrasi & Sistem</span>
                  <span className="text-[12px] px-1.5 py-0.5 rounded-[4px] bg-[var(--surface-recessed)] text-[var(--text-secondary)]">
                    Admin
                  </span>
                </div>
              )}
              <div className="space-y-2">
                {adminHubs.map((hub) => {
                  const isActive = hub.id === activeHub;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => navigateTo(hub.id)}
                      title={sidebarCollapsed ? `${hub.label} (Khusus Admin)` : undefined}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] flex items-center justify-between gap-2.5 text-[15px] font-medium cursor-pointer select-none hig-transition hig-focus ${
                        isActive
                          ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] font-semibold shadow-xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-solid)]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0">{renderHubIcon(hub.iconName, 'w-5 h-5')}</span>
                        {!sidebarCollapsed && <span className="truncate">{hub.label}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer: Go API & PostgreSQL Live Status */}
        <div className="p-3 border-t border-[var(--border-hairline)] shrink-0">
          <div
            className={`px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--glass-well)] border border-[var(--border-hairline)] flex items-center ${
              sidebarCollapsed ? 'justify-center' : 'justify-between'
            } gap-2`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2 h-2 rounded-full bg-[var(--status-success-fill)] shrink-0"
                aria-hidden="true"
              />
              {!sidebarCollapsed && (
                <span className="text-[12px] font-semibold text-[var(--text-primary)] truncate tabular-nums">
                  {bootstrap.runtimeStatus.apiEndpointLabel}
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[12px] font-medium text-[var(--text-tertiary)] shrink-0">
                {bootstrap.runtimeStatus.dbEngineLabel}
              </span>
            )}
          </div>
        </div>
      </GlassChrome>

      {/* ====================================================================
       * 2. MAIN WORKSPACE COLUMN (Top Bar z-30 + Sticky Level-2 Bar z-20 + Viewport)
       * ==================================================================== */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* TOP TRANSLUCENT TOOLBAR */}
        <GlassChrome
          as="header"
          variant={visualDirection === 'B' ? 'popover' : 'toolbar'}
          className={`relative md:sticky z-30 h-14 md:h-16 px-5 md:px-8 flex items-center justify-between gap-3 shrink-0 ${
            visualDirection === 'B'
              ? 'md:top-6 md:mt-6 md:mx-8 md:rounded-[24px] border border-[var(--glass-border)]'
              : visualDirection === 'C' && isSplitDatabaseView
                ? 'md:top-4 md:mt-4 md:mx-auto md:w-full md:max-w-[1200px] md:rounded-[22px] border border-[var(--glass-border)]'
                : 'md:top-0 border-b border-[var(--glass-border)]'
          }`}
        >
          {/* Left: Mobile Brand + Current Hub Title (Given priority with flex-1 min-w-0) */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-initial">
            <div className="md:hidden w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--accent-fill)] flex items-center justify-center shrink-0">
              <span className="text-white text-[13px] font-bold">O</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] sm:text-[16px] md:text-[18px] font-bold tracking-tight text-[var(--text-primary)] truncate">
                  {currentHubObj.label}
                </h1>
                {currentHubObj.adminOnly && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                    Admin
                  </span>
                )}
              </div>
              <p className="hidden lg:block text-[12px] text-[var(--text-secondary)] truncate">
                {selectedShopDetail
                  ? `Detail Toko #${selectedShopDetail.leadIdNumber} · ${selectedShopDetail.shopName}`
                  : currentSegmentObj.description}
              </p>
            </div>
          </div>

          {/* Center: Spotlight Command Palette Trigger (`Ctrl+K`) */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full min-h-[44px] md:min-h-[40px] px-3.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] border border-[var(--border-strong)] flex items-center justify-between gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer hig-transition hig-focus"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                <span className="truncate">Cari toko atau nomor...</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[11px] font-semibold rounded-[4px] bg-[var(--surface-recessed)] text-[var(--text-secondary)] border border-[var(--border-hairline)] shrink-0 tabular-nums">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right: AI Emergency Kill Switch, Notifications, WIB Clock, Operator Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Button */}
            <IconButton
              label="Cari toko atau nomor"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="sm:hidden"
            >
              <Search className="w-5 h-5" />
            </IconButton>

            {/* Saklar Darurat AI Pill: Compact icon+dot on < 440px, full pill on >= 440px */}
            <button
              type="button"
              onClick={() => setAiConfirmModalOpen(true)}
              aria-label={aiKillSwitchActive ? 'Saklar Darurat: AI Dimatikan' : 'Saklar Darurat: AI Aktif'}
              title={aiKillSwitchActive ? 'AI Dimatikan (Klik untuk kelola)' : 'AI Aktif (Klik untuk kelola)'}
              className={`relative min-w-[44px] min-h-[44px] md:min-h-[40px] px-2.5 min-[440px]:px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-semibold flex items-center justify-center gap-1.5 border cursor-pointer hig-transition hig-focus ${
                aiKillSwitchActive
                  ? 'bg-[var(--status-danger-bg)] text-[var(--status-danger)] border-[var(--status-danger-border)]'
                  : 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
              }`}
            >
              <Sparkles className="w-4 h-4 min-[440px]:w-3.5 min-[440px]:h-3.5 shrink-0" />
              <span className="hidden min-[440px]:inline whitespace-nowrap">
                {aiKillSwitchActive ? 'AI Dimatikan' : 'AI Aktif'}
              </span>
              <span
                aria-hidden="true"
                className={`min-[440px]:hidden absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                  aiKillSwitchActive
                    ? 'bg-[var(--status-danger-fill)]'
                    : 'bg-[var(--status-success-fill)]'
                }`}
              />
            </button>

            {/* UI Scale ("Ukuran Tampilan") Button & Glass Popover (Hidden on phones < 768px) */}
            {!isPhoneViewport && (
              <div ref={scaleContainerRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifPopoverOpen(false);
                    setScalePopoverOpen((prev) => !prev);
                  }}
                  aria-expanded={scalePopoverOpen}
                  aria-haspopup="dialog"
                  aria-label={`Pengaturan ukuran tampilan, saat ini ${effectiveUiScalePct}%`}
                  className={`min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 border cursor-pointer hig-transition hig-focus ${
                    scalePopoverOpen
                      ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[var(--accent-primary)]/40'
                      : 'bg-[var(--surface-solid)]/80 hover:bg-[var(--surface-solid)] text-[var(--text-primary)] border-[var(--border-strong)]'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Tampilan</span>
                  <span className="px-1.5 py-0.5 rounded-[4px] bg-[var(--surface-recessed)] text-[11px] font-bold text-[var(--text-secondary)] tabular-nums">
                    {effectiveUiScalePct}%
                  </span>
                </button>

                {scalePopoverOpen && (
                  <div
                    role="dialog"
                    aria-label="Pengaturan Ukuran Tampilan"
                    className="absolute right-0 top-12 w-76 z-50 hig-glass-floating rounded-[var(--radius-md)] border border-[var(--glass-border)] shadow-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[var(--border-hairline)] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[13px] font-bold text-[var(--text-primary)] block">
                          Ukuran Tampilan
                        </span>
                        <span className="text-[11px] font-medium text-[var(--text-secondary)] tabular-nums block mt-0.5">
                          {uiScaleMode === 'auto'
                            ? `Otomatis - ${autoDetectedScale}%`
                            : `Manual - ${uiScaleStep}%`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={resetUiScale}
                        aria-label="Reset ukuran tampilan ke Otomatis"
                        className="min-h-[44px] min-w-[44px] px-2.5 text-[12px] font-semibold text-[var(--accent-primary)] hover:underline inline-flex items-center justify-center cursor-pointer hig-focus rounded-[var(--radius-xs)]"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="p-3.5 bg-[var(--surface-solid)] space-y-3">
                      {/* Segmented Mode Choice: Otomatis | Manual */}
                      <div
                        role="group"
                        aria-label="Mode ukuran tampilan"
                        className="grid grid-cols-2 p-1 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] gap-1"
                      >
                        <button
                          type="button"
                          onClick={() => setUiScaleMode('auto')}
                          aria-pressed={uiScaleMode === 'auto'}
                          aria-label={`Mode Otomatis (${autoDetectedScale}%)`}
                          className={`min-h-[44px] px-2.5 py-1.5 rounded-[var(--radius-xs)] text-[12px] font-semibold inline-flex items-center justify-center cursor-pointer tabular-nums hig-transition hig-focus ${
                            uiScaleMode === 'auto'
                              ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-xs'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          Otomatis - {autoDetectedScale}%
                        </button>
                        <button
                          type="button"
                          onClick={() => setUiScaleMode('manual')}
                          aria-pressed={uiScaleMode === 'manual'}
                          aria-label="Mode Manual"
                          className={`min-h-[44px] px-2.5 py-1.5 rounded-[var(--radius-xs)] text-[12px] font-semibold inline-flex items-center justify-center cursor-pointer hig-transition hig-focus ${
                            uiScaleMode === 'manual'
                              ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-xs'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          Manual
                        </button>
                      </div>

                      {/* Stepper Row: "-" button, Current Percentage, "+" button */}
                      <div className="flex items-center justify-between gap-2 p-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
                        <button
                          type="button"
                          onClick={stepUiScaleDown}
                          disabled={effectiveUiScalePct <= UI_SCALE_STEPS[0]}
                          aria-label="Perkecil ukuran tampilan"
                          className="min-h-[44px] min-w-[44px] rounded-[var(--radius-xs)] bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--border-strong)] text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer hig-transition hig-focus"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <div
                          aria-live="polite"
                          className="text-center flex-1 min-w-0 px-2"
                        >
                          <span className="text-[16px] font-bold text-[var(--text-primary)] tabular-nums block">
                            {effectiveUiScalePct}%
                          </span>
                          <span className="text-[11px] text-[var(--text-secondary)] block">
                            Skala aktif
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={stepUiScaleUp}
                          disabled={effectiveUiScalePct >= UI_SCALE_STEPS[UI_SCALE_STEPS.length - 1]}
                          aria-label="Perbesar ukuran tampilan"
                          className="min-h-[44px] min-w-[44px] rounded-[var(--radius-xs)] bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--border-strong)] text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer hig-transition hig-focus"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Step Buttons (90%, 100%, 110%, 125%, 150%) */}
                      <div
                        role="group"
                        aria-label="Pilihan persentase ukuran tampilan"
                        className="grid grid-cols-5 gap-1"
                      >
                        {UI_SCALE_STEPS.map((step) => {
                          const isCurrent = effectiveUiScalePct === step;
                          return (
                            <button
                              key={step}
                              type="button"
                              onClick={() => setUiScaleStep(step)}
                              aria-label={`Atur ukuran tampilan ke ${step}%`}
                              aria-pressed={uiScaleMode === 'manual' && uiScaleStep === step}
                              className={`min-h-[44px] px-1 rounded-[var(--radius-xs)] text-[11px] font-bold tabular-nums border inline-flex items-center justify-center cursor-pointer hig-transition hig-focus ${
                                isCurrent
                                  ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[var(--accent-primary)]/40'
                                  : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              {step}%
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Button & Popover (Closes on Escape, outside click, and navigation) */}
            <div ref={notifContainerRef} className="relative">
              <IconButton
                label="Notifikasi sistem"
                badgeDot={unreadNotificationCount > 0}
                active={notifPopoverOpen}
                onClick={() => {
                  setScalePopoverOpen(false);
                  setNotifPopoverOpen((prev) => !prev);
                }}
              >
                <Bell className="w-5 h-5" />
              </IconButton>

              {notifPopoverOpen && (
                <div
                  role="dialog"
                  aria-label="Notifikasi Operasional"
                  className="fixed md:absolute right-3 md:right-0 top-14 md:top-12 w-[calc(100vw-1.5rem)] sm:w-88 z-50 hig-glass-floating rounded-[var(--radius-md)] overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[var(--border-hairline)] flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                      Notifikasi Operasional
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="min-h-[44px] md:min-h-[28px] px-2 text-[12px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                    >
                      Tandai dibaca
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto bg-[var(--surface-solid)] divide-y divide-[var(--border-hairline)]">
                    {bootstrap.notifications.length === 0 ? (
                      <div className="p-6 text-center text-[13px] text-[var(--text-secondary)]">
                        Tidak ada notifikasi baru.
                      </div>
                    ) : (
                      bootstrap.notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            setNotifPopoverOpen(false);
                            navigateTo(n.targetHub, n.targetSegment);
                          }}
                          className="w-full min-h-[44px] p-3.5 text-left hover:bg-[var(--surface-elevated)] flex items-start gap-3 cursor-pointer hig-transition"
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              n.severity === 'danger'
                                ? 'bg-[var(--status-danger-fill)]'
                                : n.severity === 'warning'
                                  ? 'bg-[var(--status-warning-fill)]'
                                  : 'bg-[var(--accent-fill)]'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-semibold text-[var(--text-primary)]">
                              {n.title}
                            </div>
                            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                              {n.message}
                            </p>
                            <span className="text-[11px] text-[var(--text-tertiary)] tabular-nums mt-1 block">
                              {n.timestampWib}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* WIB Timestamp Badge (Desktop XL) */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-xs)] text-[12px] font-medium text-[var(--text-secondary)] tabular-nums border border-transparent">
              <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <span>{bootstrap.runtimeStatus.wibFormattedTimestamp}</span>
            </div>

            {/* Active Operator Badge + Logout */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[var(--border-hairline)]">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] font-bold text-[12px] flex items-center justify-center shrink-0">
                {currentOperator.avatarInitials}
              </div>
              <div className="max-w-[160px]">
                <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                  {currentOperator.fullName}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] truncate">
                  {currentOperator.roleBadgeLabel}
                </div>
              </div>
              <IconButton
                label="Keluar ke halaman Login"
                onClick={() => setIsAuthenticated(false)}
              >
                <LogOut className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </GlassChrome>

        {/* LEVEL 2 NAVIGATION BAR: Sticky SegmentedControl */}
        {currentHubObj.segments.length > 1 && !selectedShopDetail && (
          <GlassChrome
            as="div"
            variant="toolbar"
            className={`sticky top-0 z-20 px-5 md:px-8 py-2 flex items-center justify-between gap-4 ${
              visualDirection === 'B'
                ? 'md:top-[6rem] md:mt-4 md:mx-8 md:rounded-[20px] border border-[var(--glass-border)]'
                : visualDirection === 'C' && isSplitDatabaseView
                  ? 'md:top-[5.25rem] md:mt-4 md:mx-auto md:w-full md:max-w-[1200px] md:rounded-[18px] border border-[var(--glass-border)]'
                  : 'md:top-16 border-b border-[var(--glass-border)]'
            }`}
          >
            <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
              <SegmentedControl
                ariaLabel={`Sub-navigasi ${currentHubObj.label}`}
                value={activeSegment}
                onChange={(segId: SegmentId) => navigateTo(activeHub, segId)}
                options={currentHubObj.segments.map((seg) => ({
                  id: seg.id,
                  label: seg.label,
                  count: seg.badgeCount,
                }))}
              />
            </div>
          </GlassChrome>
        )}

        {/* ==================================================================
         * MAIN CONTENT VIEWPORT
         * Page padding: 32px on desktop (`md:p-8`), 20px on mobile (`p-5`).
         * Reading areas have a max content width of 1200px (`max-w-[1200px]`).
         * ================================================================== */}
        <main
          className={
            isViewportLockedInbox
              ? 'h-[calc(var(--effective-vh)-7.5rem-env(safe-area-inset-bottom,0px))] md:h-[calc(var(--effective-vh)-4rem)] overflow-hidden p-2 md:p-4 max-w-[1440px] w-full mx-auto flex flex-col'
              : 'flex-1 p-5 md:p-8 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pb-12 w-full'
          }
        >
          <div className="max-w-[1200px] w-full mx-auto space-y-6">
          <AsyncStateWrapper
            state={isSplitDatabaseView && asyncState === 'loading' ? 'success' : asyncState}
            emptyTitle={`Belum ada data di ${currentSegmentObj.label}`}
            emptyDescription="Data akan tampil secara otomatis setelah sinkronisasi atau penambahan data baru."
            emptyActionLabel="Muat Ulang Data"
            onEmptyAction={reloadCurrentViewData}
            onRetry={reloadCurrentViewData}
          >
            {role === 'sales_crm' &&
            (activeHub === 'laporan' || activeHub === 'impor' || activeHub === 'sistem') ? (
              <SolidCard padding="lg" className="my-6">
                <div className="max-w-md mx-auto text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--status-danger-bg)] text-[var(--status-danger)] flex items-center justify-center mx-auto border border-[var(--status-danger-border)]">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--status-danger-bg)] text-[var(--status-danger)] border border-[var(--status-danger-border)]">
                      Akses Dibatasi
                    </span>
                    <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
                      Halaman ini hanya untuk admin
                    </h2>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      Peran akun Anda saat ini adalah <strong className="text-[var(--text-primary)]">Sales CRM</strong>. Modul administrasi, analitik performa tim, impor massal, dan konfigurasi sistem hanya dapat diakses oleh peran Operator & Super Admin.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => navigateTo('beranda', 'beranda_utama')}
                    >
                      Kembali ke Beranda
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setRole('admin')}
                    >
                      Ganti Peran ke Admin (Uji Mode)
                    </Button>
                  </div>
                </div>
              </SolidCard>
            ) : isBerandaActive && berandaData ? (
              <BerandaView
                data={berandaData}
                operatorFirstName={operatorFirstName}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : isInboxActive && inboxWorkspace ? (
              <HunterInboxView
                workspace={inboxWorkspace}
                role={role}
                selectedThreadId={selectedThreadId}
                onSelectThread={setSelectedThreadId}
                onSendMessage={sendInboxMessage}
                onToggleThreadHandler={toggleInboxThreadHandler}
                onMarkDisqualified={markInboxThreadDisqualified}
                onOpenHandoverModal={openHandoverModal}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'akuisisi' &&
              activeSegment === 'antrean_hari_ini' &&
              akuisisiBundle ? (
              <AntreanHariIniView
                data={akuisisiBundle.antreanHariIni}
                onMarkQueueItem={markQueueItem}
                lastAction={lastQueueAction}
                onUndoLastAction={undoLastQueueAction}
                onOpenAddNumberDialog={() => setIsAddNumberModalOpen(true)}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'akuisisi' && activeSegment === 'radar_toko' && akuisisiBundle ? (
              <RadarTokoView
                data={akuisisiBundle.radarToko}
                onCheckDuplicatePhone={checkDuplicatePhoneInErp}
                onCheckRowErp={checkRadarRowErp}
                onSendRowSpintax={sendRadarRowSpintax}
                onAddCityChip={addRadarCityChip}
                onOpenHandoverModal={openHandoverModal}
                onRefreshRadar={reloadCurrentViewData}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'akuisisi' &&
              activeSegment === 'jadwal_tindak_lanjut' &&
              akuisisiBundle ? (
              <JadwalTindakLanjutView
                data={akuisisiBundle.jadwalTindakLanjut}
                onMarkCompleted={markFollowUpCompleted}
                onOpenCreateDialog={() => {
                  setFollowUpInitialLead(null);
                  setIsCreateFollowUpModalOpen(true);
                }}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'akuisisi' &&
              activeSegment === 'ketepatan_waktu_sla' &&
              akuisisiBundle ? (
              <KetepatanWaktuSlaView
                data={akuisisiBundle.ketepatanWaktuSla}
                onOpenCreateDialog={() => {
                  setFollowUpInitialLead(null);
                  setIsCreateFollowUpModalOpen(true);
                }}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'akuisisi' &&
              activeSegment === 'antrean_handover_erp' &&
              akuisisiBundle ? (
              <AntreanHandoverErpView
                data={akuisisiBundle.antreanHandoverErp}
                onOpenNewHandoverModal={openHandoverModal}
                onRefresh={reloadCurrentViewData}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'database' && selectedShopDetail && databaseBundle ? (
              <TokoDetailView
                shop={selectedShopDetail}
                onBack={() => setSelectedShopDetailId(null)}
                onOpenShopInInbox={openShopInHunterInbox}
                onOpenEditDataModal={() => setIsEditShopDataModalOpen(true)}
                onOpenEditContactModal={(focus) => openEditShopContactModal(focus)}
                onOpenDeleteModal={() => setIsDeleteShopModalOpen(true)}
                onOpenCreateFollowUpModal={handleOpenFollowUpForShop}
                onNavigateToFollowUpSchedule={() =>
                  navigateTo('akuisisi', 'jadwal_tindak_lanjut')
                }
                onToggleDisqualified={toggleShopDisqualified}
                onUpdateFunnelStep={updateShopFunnelStep}
                onSaveInlineOwnerNote={saveShopInlineOwnerNote}
              />
            ) : activeHub === 'database' &&
              (activeSegment === 'semua_toko' ||
                activeSegment === 'toko_tier_a' ||
                activeSegment === 'reseller_aktif') &&
              databaseBundle ? (
              <DatabaseTokoTableView
                mode={activeSegment}
                bundle={databaseBundle}
                visualDirection={visualDirection}
                isLoading={asyncState === 'loading'}
                externalCityFilter={databaseCityFilterOverride}
                onClearExternalCityFilter={() => setDatabaseCityFilterOverride('')}
                onSelectShopDetail={(shopId) => setSelectedShopDetailId(shopId)}
                onOpenAddShopDialog={() => setIsAddShopModalOpen(true)}
                onOpenCreateFollowUpForShop={handleOpenFollowUpForShop}
                onToggleDisqualified={toggleShopDisqualified}
                onUpdateFunnelStep={updateShopFunnelStep}
                onSaveInlineOwnerNote={saveShopInlineOwnerNote}
                onOpenShopInInbox={openShopInHunterInbox}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'database' &&
              activeSegment === 'peta_toko' &&
              databaseBundle ? (
              <PetaProvinsiView
                provinces={databaseBundle.provinces}
                onFilterShopsByRegion={filterShopsByRegionFromMap}
                externalTransitionTrigger={mapTransitionTrigger}
              />
            ) : activeHub === 'katalog' &&
              activeSegment === 'katalog_harga' &&
              katalogBundle ? (
              <KatalogHargaView
                data={katalogBundle.priceCatalog}
                onSyncFromErp={syncPriceCatalogFromErp}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'katalog' &&
              activeSegment === 'media_promosi' &&
              katalogBundle ? (
              <PustakaMediaPromosiView
                data={katalogBundle.promotionalMedia}
                onOpenUploadModal={() => setIsUploadMediaModalOpen(true)}
                onRefresh={reloadCurrentViewData}
                onSoftDeleteMedia={softDeletePromotionalMedia}
                onRestoreMedia={restorePromotionalMedia}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'laporan' &&
              activeSegment === 'laporan_periode' &&
              laporanBundle ? (
              <LaporanPeriodeView
                data={laporanBundle.periode}
                onRefresh={refreshLaporanData}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'laporan' &&
              activeSegment === 'laporan_target' &&
              laporanBundle ? (
              <LaporanTargetView
                data={laporanBundle.target}
                onRefresh={refreshLaporanData}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'laporan' &&
              activeSegment === 'laporan_sapaan' &&
              laporanBundle ? (
              <LaporanSapaanView
                data={laporanBundle.sapaan}
                onSelectPeriod={setSapaanPeriod}
                onRefresh={refreshLaporanData}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'impor' && activeSegment === 'impor_unggah_toko' ? (
              <ImporTokoView
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
                onImportSuccess={addImportHistoryRecord}
              />
            ) : activeHub === 'impor' &&
              activeSegment === 'impor_riwayat' &&
              imporBundle ? (
              <ImporRiwayatView
                records={imporBundle.historyRecords}
                onRefresh={refreshImporData}
                onNavigate={(hub, seg) => navigateTo(hub, seg)}
              />
            ) : activeHub === 'impor' &&
              activeSegment === 'impor_stok' &&
              imporBundle ? (
              <ImporStokView
                records={imporBundle.stockHistoryRecords}
                onRefresh={refreshImporData}
              />
            ) : activeHub === 'impor' &&
              activeSegment === 'impor_harga' &&
              imporBundle ? (
              <ImporHargaView
                records={imporBundle.priceHistoryRecords}
                onRefresh={refreshImporData}
              />
            ) : (
              /* ==============================================================
               * UNBUILT PAGES EMPTY-STATE PLACEHOLDER ("Segera Hadir")
               * ============================================================== */
              <SolidCard padding="lg" className="my-4">
                <div className="max-w-lg mx-auto text-center py-10 space-y-4">
                  <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--surface-recessed)] text-[var(--text-secondary)]">
                      Segera Hadir
                    </span>
                    <h2 className="hig-title text-[var(--text-primary)]">
                      {currentSegmentObj.label}
                    </h2>
                    <p className="hig-footnote text-[var(--text-secondary)]">
                      {currentSegmentObj.description}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigateTo('beranda', 'beranda_utama')}
                    >
                      Kembali ke Beranda
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigateTo('inbox', 'inbox_workspace')}
                    >
                      Buka Hunter Chat / Inbox
                    </Button>
                  </div>
                </div>
              </SolidCard>
            )}
          </AsyncStateWrapper>
          </div>
        </main>
      </div>

      {/* ====================================================================
       * 3. MOBILE IOS 5-TAB TRANSLUCENT BOTTOM BAR (< md)
       *    Tabs: Beranda | Antrean | Inbox | Toko | Lainnya
       * ==================================================================== */}
      <GlassChrome
        as="nav"
        variant="toolbar"
        aria-label="Navigasi Bawah Mobile"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 min-h-16 pb-[env(safe-area-inset-bottom,0px)] border-t border-[var(--glass-border)] px-1 flex items-center justify-around"
      >
        {mobilePrimaryHubIds.map((hubId) => {
          const hub = visibleHubs.find((h) => h.id === hubId);
          if (!hub) return null;
          const isActive = activeHub === hub.id && !mobileLainnyaOpen;
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => {
                setMobileLainnyaOpen(false);
                navigateTo(hub.id);
              }}
              className={`relative flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center gap-0.5 rounded-[var(--radius-xs)] cursor-pointer select-none hig-transition ${
                isActive
                  ? 'text-[var(--accent-primary)] font-semibold'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {renderHubIcon(hub.iconName, 'w-5 h-5')}
              <span className="text-[11px] leading-tight truncate">{hub.shortMobileLabel}</span>
              {typeof hub.badgeCount === 'number' && hub.badgeCount > 0 && (
                <span className="absolute top-1 right-1/4 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[var(--accent-fill)] text-white tabular-nums">
                  {hub.badgeCount}
                </span>
              )}
            </button>
          );
        })}

        {/* 5th Tab: Lainnya (Opens Slide-Up Sheet for Katalog & Admin Hubs) */}
        <button
          type="button"
          onClick={() => setMobileLainnyaOpen(true)}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center gap-0.5 rounded-[var(--radius-xs)] cursor-pointer select-none hig-transition ${
            isLainnyaActive || mobileLainnyaOpen
              ? 'text-[var(--accent-primary)] font-semibold'
              : 'text-[var(--text-secondary)]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] leading-tight">Lainnya</span>
        </button>
      </GlassChrome>

      {/* ====================================================================
       * 4. DIALOG d03: AJUKAN RESELLER KE RG ERP (Desktop Dialog / Mobile Sheet)
       * ==================================================================== */}
      <AjukanResellerModal
        open={Boolean(handoverModalLead)}
        onClose={closeHandoverModal}
        lead={handoverModalLead}
        onSubmitHandover={submitHandoverToErp}
      />

      {/* ====================================================================
       * 4B. DIALOG d04: PERINGATAN OPERASIONAL PENAMBAHAN NOMOR
       * ==================================================================== */}
      {akuisisiBundle && (
        <TambahNomorWarningModal
          open={isAddNumberModalOpen}
          onClose={() => setIsAddNumberModalOpen(false)}
          config={akuisisiBundle.antreanHariIni.addNumberWarningDialog}
          onConfirmAddNumber={confirmAddActiveNumber}
        />
      )}

      {/* ====================================================================
       * 4C. DIALOG d02: CATAT TINDAK LANJUT
       * ==================================================================== */}
      {akuisisiBundle && (
        <CatatTindakLanjutModal
          open={isCreateFollowUpModalOpen}
          onClose={() => {
            setIsCreateFollowUpModalOpen(false);
            setFollowUpInitialLead(null);
          }}
          leadLookupOptions={akuisisiBundle.jadwalTindakLanjut.leadLookupOptions}
          initialLead={followUpInitialLead}
          onSubmitFollowUp={createFollowUpCommitment}
        />
      )}

      {/* ====================================================================
       * 4D. DIALOG d01: TAMBAH TOKO DARI KENALAN (`d01-dialog-tambah-toko`)
       * ==================================================================== */}
      {databaseBundle && (
        <TambahTokoModal
          open={isAddShopModalOpen}
          onClose={() => setIsAddShopModalOpen(false)}
          onSubmitNewShop={createShopFromAcquaintance}
        />
      )}

      {/* ====================================================================
       * 4E. DIALOG d07: UBAH DATA TOKO (`d07-dialog-ubah-data`)
       * ==================================================================== */}
      {databaseBundle && (
        <UbahDataTokoModal
          open={isEditShopDataModalOpen}
          onClose={() => setIsEditShopDataModalOpen(false)}
          shop={selectedShopDetail}
          availableCities={databaseBundle.availableCities}
          onSaveShopData={updateShopData}
          onAddOnlineLink={addShopOnlineLink}
          onRemoveOnlineLink={removeShopOnlineLink}
          onMoveShopTier={moveShopTierWithReason}
        />
      )}

      {/* ====================================================================
       * 4F. DIALOG d06: UBAH KONTAK & CATATAN (`UbahKontakCatatanModal`)
       * ==================================================================== */}
      <UbahKontakCatatanModal
        open={isEditShopContactModalOpen}
        onClose={closeEditShopContactModal}
        shop={selectedShopDetail}
        initialFocus={editShopContactFocusField}
        onSaveContactNote={updateShopContactAndNote}
      />

      {/* ====================================================================
       * 4G. DIALOG d08: HAPUS TOKO (`d08-dialog-hapus-toko`)
       * ==================================================================== */}
      <HapusTokoModal
        open={isDeleteShopModalOpen}
        onClose={() => setIsDeleteShopModalOpen(false)}
        shop={selectedShopDetail}
        onConfirmSoftDelete={softDeleteShop}
      />

      {/* ====================================================================
       * 4H. DIALOG d05: UNGGAH MEDIA PROMOSI BARU (`d05-dialog-unggah-media`)
       * ==================================================================== */}
      {katalogBundle && (
        <UnggahMediaModal
          open={isUploadMediaModalOpen}
          onClose={() => setIsUploadMediaModalOpen(false)}
          categoryOptions={katalogBundle.promotionalMedia.categoryOptions}
          simulateServerError={simulateErpError}
          prefill={uploadMediaPrefill}
          onSubmitUpload={uploadPromotionalMedia}
        />
      )}

      {/* ====================================================================
       * 5. MOBILE "LAINNYA" SLIDE-UP SHEET (`ModalSheet`)
       * ==================================================================== */}
      <ModalSheet
        open={mobileLainnyaOpen}
        onClose={() => setMobileLainnyaOpen(false)}
        title="Menu Lainnya & Pengaturan"
        subtitle={`${currentOperator.fullName} · ${currentOperator.roleBadgeLabel}`}
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="hig-caption font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Katalog & Kampanye
            </div>
            {visibleHubs
              .filter((h) => h.id === 'katalog')
              .map((hub) => (
                <div key={hub.id} className="space-y-1.5">
                  {hub.segments.map((seg) => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => {
                        navigateTo(hub.id, seg.id);
                        setMobileLainnyaOpen(false);
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                        {seg.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </button>
                  ))}
                </div>
              ))}
          </div>

          {adminHubs.length > 0 && (
            <div className="space-y-2">
              <div className="hig-caption font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Administrasi & Sistem (Khusus Admin)
              </div>
              <div className="space-y-1.5">
                {adminHubs.map((hub) => (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => {
                      navigateTo(hub.id);
                      setMobileLainnyaOpen(false);
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {renderHubIcon(hub.iconName, 'w-4 h-4')}
                      <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                        {hub.label}
                      </span>
                    </div>
                    <span className="hig-caption text-[var(--text-tertiary)]">
                      {hub.segments.length} tab
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRole(role === 'admin' ? 'sales_crm' : 'admin')}
            >
              Ganti Peran ({role === 'admin' ? 'Ke Sales CRM' : 'Ke Admin'})
            </Button>
            <Button
              variant="destructive-outline"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => {
                setMobileLainnyaOpen(false);
                setIsAuthenticated(false);
              }}
            >
              Keluar
            </Button>
          </div>
        </div>
      </ModalSheet>

      {/* ====================================================================
       * 6. SAKLAR DARURAT AI (KILL SWITCH) CONFIRMATION MODAL
       * ==================================================================== */}
      <ModalSheet
        open={aiConfirmModalOpen}
        onClose={() => setAiConfirmModalOpen(false)}
        title="Saklar Darurat AI (Kill Switch)"
        subtitle="Kendalikan status balasan otomatis asisten AI Olivia SDR untuk seluruh sesi WhatsApp"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setAiConfirmModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant={aiKillSwitchActive ? 'primary' : 'destructive'}
              size="sm"
              leftIcon={<Power className="w-4 h-4" />}
              onClick={() => {
                toggleAiKillSwitch();
                setAiConfirmModalOpen(false);
              }}
            >
              {aiKillSwitchActive ? 'Aktifkan Kembali AI' : 'Matikan Darurat AI Sekarang'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div
            className={`p-4 rounded-[var(--radius-sm)] border ${
              aiKillSwitchActive
                ? 'bg-[var(--status-danger-bg)] border-[var(--status-danger-border)] text-[var(--status-danger)]'
                : 'bg-[var(--status-success-bg)] border-[var(--status-success-border)] text-[var(--status-success)]'
            }`}
          >
            <div className="text-[14px] font-semibold">
              Status Saat Ini: {aiKillSwitchActive ? 'AI Dimatikan (Darurat)' : 'AI Aktif Normal'}
            </div>
            <p className="text-[13px] mt-1 opacity-90">
              {aiKillSwitchActive
                ? 'Seluruh pesan masuk WhatsApp dari toko counter saat ini dialihkan langsung ke antrean manual Sales di Hunter Inbox.'
                : 'Asisten AI aktif membalas pesan sapaan awal dan memperbarui 7 lapisan Memori AI secara otomatis.'}
            </p>
          </div>
          <p className="hig-footnote text-[var(--text-secondary)]">
            Perubahan status Saklar Darurat AI akan langsung dicatat di{' '}
            <strong className="text-[var(--text-primary)]">Log Aktivitas</strong> dan{' '}
            <strong className="text-[var(--text-primary)]">Kesehatan Sistem</strong>.
          </p>
        </div>
      </ModalSheet>
    </div>
  );
};
