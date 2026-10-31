import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArrowRight,
  MessageSquare,
  CalendarPlus,
  Eye,
  Ban,
  Undo2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Copy,
  Check,
  MapPin,
  User,
  Sparkles,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  DatabaseHubBundleDTO,
  DatabaseShopRowDTO,
  HubId,
  SegmentId,
  ShopChatStatusLabel,
  ShopOwnershipCode,
  ShopTierCode,
} from '../../mock/api';
import { VisualDirection } from '../../context/AppStateContext';
import { GlassChrome } from '../ui/GlassChrome';
import { Button } from '../ui/Button';
import { ModalSheet } from '../ui/ModalSheet';

export interface DatabaseTokoTableViewProps {
  mode: 'semua_toko' | 'toko_tier_a' | 'reseller_aktif';
  bundle: DatabaseHubBundleDTO;
  visualDirection?: VisualDirection;
  isLoading?: boolean;
  externalCityFilter: string;
  onClearExternalCityFilter: () => void;
  onSelectShopDetail: (shopId: string) => void;
  onOpenAddShopDialog: () => void;
  onOpenCreateFollowUpForShop: (shop: DatabaseShopRowDTO) => void;
  onToggleDisqualified: (shopId: string) => void;
  onUpdateFunnelStep?: (shopId: string, stepIndex: 1 | 2 | 3 | 4 | 5) => void;
  onSaveInlineOwnerNote?: (shopId: string, note: string) => void;
  onOpenShopInInbox: (shop: DatabaseShopRowDTO) => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

const OWNERSHIP_OPTIONS: { value: 'ALL' | ShopOwnershipCode; label: string }[] = [
  { value: 'ALL', label: 'Semua kepemilikan' },
  { value: 'MINE', label: 'Dipegang Anda' },
  { value: 'SALES_2', label: 'Dipegang Sales CRM 2' },
  { value: 'UNASSIGNED', label: 'Belum dipegang' },
];

const CHAT_STATUS_OPTIONS: ('Semua status chat' | ShopChatStatusLabel)[] = [
  'Semua status chat',
  'Belum Disapa (Cold)',
  'Ditangani Sales',
  'Cooling Off',
  'Dijawab AI',
];

const TIER_FILTER_OPTIONS: ('Semua tier' | ShopTierCode)[] = [
  'Semua tier',
  'Tier A',
  'Tier B',
  'Tier C',
  'Tier X',
];

const FUNNEL_STEPS: { step: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { step: 1, label: 'Prospek' },
  { step: 2, label: 'Terkontak' },
  { step: 3, label: 'Berminat' },
  { step: 4, label: 'Negosiasi' },
  { step: 5, label: 'Deal ERP' },
];

function getInitials(name: string): string {
  const parts = name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'TK';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getShortChatLabel(label: ShopChatStatusLabel): string {
  if (label === 'Belum Disapa (Cold)') return 'Belum Disapa';
  return label;
}

/**
 * Colored SVG Score Ring (Tier + Score, all text >= 12px)
 */
const ShopScoreRing: React.FC<{
  tier: ShopTierCode;
  score: number | null;
  size?: 'sm' | 'lg';
  selected?: boolean;
}> = ({ tier, score, size = 'sm', selected = false }) => {
  const normalizedScore = score !== null ? Math.max(12, Math.min(100, Math.round(score))) : 68;
  const radius = size === 'lg' ? 26 : 20;
  const dimension = size === 'lg' ? 64 : 48;
  const strokeWidth = size === 'lg' ? 4.5 : 3.5;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalizedScore / 100) * circumference;

  const strokeColor = selected
    ? 'currentColor'
    : tier === 'Tier A'
      ? 'var(--status-warning-fill)'
      : tier === 'Tier B'
        ? 'var(--accent-primary)'
        : tier === 'Tier C'
          ? 'var(--status-success-fill)'
          : 'var(--text-tertiary)';

  const shortTier = tier.replace('Tier ', '');

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 tabular-nums"
      style={{ width: dimension, height: dimension }}
      title={`${tier} · Skor Prioritas ${score !== null ? score : 'Belum dinilai'}`}
      aria-label={`${tier}, Skor ${score !== null ? Math.round(score) : 'belum dinilai'}`}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={selected ? 'rgba(255,255,255,0.28)' : 'var(--border-strong)'}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span
          className={`font-bold ${
            size === 'lg' ? 'text-[14px]' : 'text-[12px]'
          } ${selected ? 'text-white' : 'text-[var(--text-primary)]'}`}
        >
          {shortTier}
        </span>
        <span
          className={`font-semibold text-[12px] ${
            selected ? 'text-white/90' : 'text-[var(--text-secondary)]'
          }`}
        >
          {score !== null ? Math.round(score) : '-'}
        </span>
      </div>
    </div>
  );
};

/**
 * Small SVG Progress Arc for Funnel Stage (1/5 .. 5/5)
 */
const FunnelProgressArc: React.FC<{
  stepIndex: 1 | 2 | 3 | 4 | 5;
  stageLabel: string;
  selected?: boolean;
}> = ({ stepIndex, stageLabel, selected = false }) => {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const fraction = stepIndex / 5;
  const dashOffset = circumference - fraction * circumference;

  const strokeColor = selected
    ? '#FFFFFF'
    : stepIndex >= 4
      ? 'var(--status-success-fill)'
      : stepIndex >= 2
        ? 'var(--accent-primary)'
        : 'var(--text-tertiary)';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] leading-[1.45] font-medium tabular-nums ${
        selected ? 'text-white/95' : 'text-[var(--text-secondary)]'
      }`}
      title={`Tahap Funnel: ${stageLabel} (${stepIndex}/5)`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90 shrink-0" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke={selected ? 'rgba(255,255,255,0.28)' : 'var(--border-strong)'}
          strokeWidth="2.5"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="truncate">{stageLabel}</span>
      <span className={selected ? 'text-white/80 text-[12px]' : 'text-[var(--text-tertiary)] text-[12px]'}>
        ({stepIndex}/5)
      </span>
    </span>
  );
};

/**
 * Single Dot + Short Label for Chat Status
 */
const ChatStatusDotLabel: React.FC<{
  code: DatabaseShopRowDTO['chatStatusCode'];
  label: ShopChatStatusLabel;
  selected?: boolean;
}> = ({ code, label, selected = false }) => {
  const dotColor = selected
    ? 'bg-white'
    : code === 'SALES_HANDLED'
      ? 'bg-[var(--accent-fill)]'
      : code === 'COOLING_OFF'
        ? 'bg-[var(--status-warning-fill)]'
        : code === 'AI_HANDLED'
          ? 'bg-[var(--status-success-fill)]'
          : 'bg-[var(--text-tertiary)]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] leading-[1.45] font-medium ${
        selected ? 'text-white/95' : 'text-[var(--text-secondary)]'
      }`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} aria-hidden="true" />
      <span className="truncate">{getShortChatLabel(label)}</span>
    </span>
  );
};

/**
 * Owner / PIC Avatar Circle
 */
const OwnerAvatar: React.FC<{
  picName: string;
  ownershipCode: ShopOwnershipCode;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ picName, ownershipCode, selected = false, size = 'md' }) => {
  const initials = getInitials(picName);
  const sizeClasses =
    size === 'lg'
      ? 'w-12 h-12 text-[15px]'
      : size === 'sm'
        ? 'w-9 h-9 text-[12px]'
        : 'w-11 h-11 text-[13px]';

  const colorClasses = selected
    ? 'bg-white/22 text-white border-white/40'
    : ownershipCode === 'MINE'
      ? 'bg-[var(--accent-tint-strong)] text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
      : ownershipCode === 'SALES_2'
        ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
        : 'bg-[var(--surface-recessed)] text-[var(--text-secondary)] border-[var(--border-strong)]';

  return (
    <div
      className={`${sizeClasses} rounded-full border font-bold flex items-center justify-center shrink-0 select-none ${colorClasses}`}
      title={`PIC: ${picName}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};

/**
 * Split-View Skeleton matching the new Apple HIG List + Inspector layout
 */
const SplitViewSkeleton: React.FC<{ direction: VisualDirection }> = ({ direction }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Memuat direktori toko..."
      className="w-full max-w-[1200px] mx-auto space-y-6"
    >
      <GlassChrome
        variant="popover"
        radius={direction === 'B' ? 'xl' : 'lg'}
        className="p-5 md:p-6 space-y-4"
      >
        <div className="h-4 w-40 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
        <div className="h-10 w-64 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] animate-pulse" />
        <div className="flex gap-2 pt-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-full bg-[var(--surface-recessed)] animate-pulse"
            />
          ))}
        </div>
      </GlassChrome>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <GlassChrome
          variant="list"
          radius={direction === 'B' ? 'xl' : 'lg'}
          className="lg:col-span-5 p-5 md:p-6 space-y-2"
        >
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="min-h-[76px] px-4 py-3 rounded-[var(--radius-md)] bg-[var(--glass-well)] border border-[var(--border-hairline)] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 flex-1">
                <div className="w-11 h-11 rounded-full bg-[var(--surface-recessed)] animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-44 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
                  <div className="h-3.5 w-32 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--surface-recessed)] animate-pulse shrink-0" />
            </div>
          ))}
        </GlassChrome>

        <GlassChrome
          variant="inspector"
          radius={direction === 'B' ? 'xl' : 'lg'}
          className="hidden lg:block lg:col-span-7 p-5 md:p-6 space-y-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2.5 flex-1">
              <div className="h-4 w-32 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
              <div className="h-8 w-72 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] animate-pulse" />
              <div className="h-4 w-60 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] animate-pulse" />
            </div>
            <div className="w-16 h-16 rounded-full bg-[var(--surface-recessed)] animate-pulse" />
          </div>
          <div className="flex gap-3">
            {[0, 1, 2, 3, 4].map((btn) => (
              <div
                key={btn}
                className="h-11 flex-1 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-36 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] animate-pulse" />
            <div className="h-36 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] animate-pulse" />
          </div>
          <div className="h-40 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] animate-pulse" />
        </GlassChrome>
      </div>
    </div>
  );
};

/**
 * Apple HIG Spatial Split-View & Glassmorphic Redesign for "Semua Toko"
 * Enforces generous breathing room & spacing floors:
 * - Max content width 1200px, surrounded by visible ambient canvas
 * - 24px gap between panels and cards on desktop (`md:gap-6`), 16px on mobile (`gap-4`)
 * - 24px inner card padding on desktop (`md:p-6`), 20px on mobile (`p-5`)
 * - Split-view list items: min-height 72px (`min-h-[72px]`), 2 lines of content, 12px vertical padding (`py-3`), 8px gap (`space-y-2`)
 * - Primary text 15-16px, secondary 13-14px, never below 12px, line-height 1.45
 * - At most 1 primary button per section; at most 5 filter controls visible at once
 */
export const DatabaseTokoTableView: React.FC<DatabaseTokoTableViewProps> = ({
  mode,
  bundle,
  visualDirection = 'A',
  isLoading = false,
  externalCityFilter,
  onClearExternalCityFilter,
  onSelectShopDetail,
  onOpenAddShopDialog,
  onOpenCreateFollowUpForShop,
  onToggleDisqualified,
  onUpdateFunnelStep,
  onSaveInlineOwnerNote,
  onOpenShopInInbox,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>(externalCityFilter || '');
  const [tierFilter, setTierFilter] = useState<'Semua tier' | ShopTierCode>('Semua tier');
  const [ownershipFilter, setOwnershipFilter] = useState<'ALL' | ShopOwnershipCode>('ALL');
  const [chatStatusFilter, setChatStatusFilter] =
    useState<'Semua status chat' | ShopChatStatusLabel>('Semua status chat');
  const [onlyNeedsInspection, setOnlyNeedsInspection] = useState(false);
  const [virtualPage, setVirtualPage] = useState(1);

  const [selectedShopId, setSelectedShopId] = useState<string>(
    () => bundle.shops[0]?.id ?? ''
  );
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState<boolean>(false);

  const [secondaryFilterPopoverOpen, setSecondaryFilterPopoverOpen] = useState<boolean>(false);
  const [mobileFilterSheetOpen, setMobileFilterSheetOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [waLaunchedBanner, setWaLaunchedBanner] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);

  useEffect(() => {
    if (externalCityFilter) {
      setCityFilter(externalCityFilter);
      setVirtualPage(1);
    }
  }, [externalCityFilter]);

  useEffect(() => {
    if (!secondaryFilterPopoverOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSecondaryFilterPopoverOpen(false);
    };
    const handleOutside = (e: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSecondaryFilterPopoverOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('pointerdown', handleOutside);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('pointerdown', handleOutside);
    };
  }, [secondaryFilterPopoverOpen]);

  const baseRows = useMemo(() => {
    if (mode === 'toko_tier_a') {
      return bundle.shops.filter((s) => s.tier === 'Tier A');
    }
    if (mode === 'reseller_aktif') {
      return bundle.shops.filter((s) => s.isActiveReseller);
    }
    return bundle.shops;
  }, [bundle.shops, mode]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const cityQ = cityFilter.trim().toLowerCase();
    return baseRows.filter((row) => {
      if (mode === 'semua_toko' && tierFilter !== 'Semua tier' && row.tier !== tierFilter) {
        return false;
      }
      if (ownershipFilter !== 'ALL' && row.ownershipCode !== ownershipFilter) {
        return false;
      }
      if (
        chatStatusFilter !== 'Semua status chat' &&
        row.chatStatusLabel !== chatStatusFilter
      ) {
        return false;
      }
      if (onlyNeedsInspection && !row.needsInspection) {
        return false;
      }
      if (
        cityQ &&
        !row.city.toLowerCase().includes(cityQ) &&
        !row.province.toLowerCase().includes(cityQ)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        row.shopName.toLowerCase().includes(q) ||
        row.fullAddress.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.picName.toLowerCase().includes(q) ||
        row.whatsappNumber.toLowerCase().includes(q) ||
        String(row.leadIdNumber).includes(q)
      );
    });
  }, [
    baseRows,
    searchQuery,
    cityFilter,
    mode,
    tierFilter,
    ownershipFilter,
    chatStatusFilter,
    onlyNeedsInspection,
  ]);

  useEffect(() => {
    if (filteredRows.length > 0 && !filteredRows.some((r) => r.id === selectedShopId)) {
      setSelectedShopId(filteredRows[0].id);
    }
  }, [filteredRows, selectedShopId]);

  const selectedShop: DatabaseShopRowDTO | null = useMemo(() => {
    return (
      filteredRows.find((r) => r.id === selectedShopId) ??
      filteredRows[0] ??
      baseRows[0] ??
      null
    );
  }, [filteredRows, baseRows, selectedShopId]);

  useEffect(() => {
    if (selectedShop) {
      setNoteDraft(selectedShop.salesOwnerNote || '');
      setWaLaunchedBanner(null);
      setCopiedPhone(false);
    }
  }, [selectedShop?.id]);

  const activeFilterCount =
    (cityFilter.trim() ? 1 : 0) +
    (mode === 'semua_toko' && tierFilter !== 'Semua tier' ? 1 : 0) +
    (ownershipFilter !== 'ALL' ? 1 : 0) +
    (chatStatusFilter !== 'Semua status chat' ? 1 : 0) +
    (onlyNeedsInspection ? 1 : 0);

  const totalVirtualUnits = useMemo(() => {
    if (activeFilterCount > 0 || searchQuery.trim().length > 0) {
      return filteredRows.length;
    }
    if (mode === 'toko_tier_a') return bundle.totalTierAShopsVirtualCount;
    if (mode === 'reseller_aktif') return bundle.totalActiveResellersCount;
    return bundle.totalAllShopsVirtualCount;
  }, [
    activeFilterCount,
    searchQuery,
    filteredRows.length,
    mode,
    bundle.totalTierAShopsVirtualCount,
    bundle.totalActiveResellersCount,
    bundle.totalAllShopsVirtualCount,
  ]);

  const totalVirtualPages = Math.max(1, Math.ceil(totalVirtualUnits / 50));

  const headerConfig = useMemo(() => {
    if (mode === 'toko_tier_a') {
      return {
        kicker: 'Prioritas Akun Utama',
        title: 'Toko Tier A',
        subtitle:
          'Toko dengan kelengkapan data tertinggi, respons cepat, dan potensi grosir mingguan terbesar.',
      };
    }
    if (mode === 'reseller_aktif') {
      return {
        kicker: 'Mitra Terverifikasi RG ERP',
        title: 'Reseller Aktif',
        subtitle:
          'Daftar toko yang telah mencapai tahap Deal Tercapai dan aktif bertransaksi bersama Rumah Gadget.',
      };
    }
    return {
      kicker: 'Bank Data Nasional',
      title: 'Semua Toko',
      subtitle:
        'Direktori terpusat seluruh prospek toko counter HP di 38 provinsi beserta skor prioritas dan status sapaan.',
    };
  }, [mode]);

  const groupedSectionsForDirectionC = useMemo(() => {
    const tierA = filteredRows.filter((r) => r.tier === 'Tier A');
    const tierB = filteredRows.filter((r) => r.tier === 'Tier B');
    const tierOther = filteredRows.filter((r) => r.tier !== 'Tier A' && r.tier !== 'Tier B');
    return [
      { id: 'group-a', title: 'Tier A · Prioritas Utama', items: tierA },
      { id: 'group-b', title: 'Tier B · Potensi Menengah', items: tierB },
      { id: 'group-cx', title: 'Tier C & X · Eksplorasi Area', items: tierOther },
    ].filter((g) => g.items.length > 0);
  }, [filteredRows]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setCityFilter('');
    setTierFilter('Semua tier');
    setOwnershipFilter('ALL');
    setChatStatusFilter('Semua status chat');
    setOnlyNeedsInspection(false);
    if (externalCityFilter) {
      onClearExternalCityFilter();
    }
    setVirtualPage(1);
    setSecondaryFilterPopoverOpen(false);
    setMobileFilterSheetOpen(false);
  };

  const handleSelectShop = (shop: DatabaseShopRowDTO, openMobileSheet = false) => {
    setSelectedShopId(shop.id);
    if (openMobileSheet) {
      setMobileInspectorOpen(true);
    }
  };

  const handleCopyPhone = (phone: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone).catch(() => {});
    }
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 1800);
  };

  const handleTriggerWhatsAppDirect = (shop: DatabaseShopRowDTO) => {
    setWaLaunchedBanner(
      `Tautan wa.me/${shop.whatsappNumber.replace(/\D/g, '')} disiapkan untuk ${shop.shopName} (PIC: ${shop.picName}).`
    );
  };

  const handleSaveOwnerNote = (shop: DatabaseShopRowDTO) => {
    if (onSaveInlineOwnerNote) {
      onSaveInlineOwnerNote(shop.id, noteDraft);
      setNoteSavedToast(true);
      setTimeout(() => setNoteSavedToast(false), 1800);
    }
  };

  if (isLoading) {
    return <SplitViewSkeleton direction={visualDirection} />;
  }

  /**
   * Renders a single Shop List Item:
   * - Minimum height 72px (`min-h-[72px]`)
   * - Two lines of content (Line 1: 16px shop name + 14px city; Line 2: 13px chat dot+label + funnel arc)
   * - 12px vertical padding (`py-3`)
   * - 8px gap between items (`space-y-2` on parent list)
   * - No repeated action buttons in the row
   */
  const renderShopListItem = (row: DatabaseShopRowDTO, variantStyle: VisualDirection) => {
    const isSelected = selectedShop?.id === row.id;
    const isMacSelected = variantStyle === 'A' && isSelected;

    const desktopRowClass =
      variantStyle === 'A'
        ? `w-full min-h-[76px] text-left px-4 py-3 rounded-[var(--radius-md)] flex items-center justify-between gap-3.5 cursor-pointer select-none hig-transition hig-focus ${
            isMacSelected
              ? 'bg-[var(--accent-fill)] text-white shadow-sm'
              : 'bg-[var(--glass-well)]/55 hover:bg-[var(--glass-well)] text-[var(--text-primary)] border border-[var(--border-hairline)]'
          }`
        : variantStyle === 'B'
          ? `w-full min-h-[78px] text-left px-4 py-3 rounded-[20px] flex items-center justify-between gap-3.5 cursor-pointer select-none hig-transition hig-focus border ${
              isSelected
                ? 'bg-[var(--glass-well)] border-[var(--accent-primary)] shadow-[var(--shadow-floating)] -translate-y-0.5 ring-2 ring-[var(--accent-primary)]/25'
                : 'bg-[var(--glass-well)]/75 hover:bg-[var(--glass-well)] border-[var(--border-glass-outer)] hover:-translate-y-0.5 shadow-xs'
            }`
          : `w-full min-h-[76px] text-left px-4 py-3 rounded-[16px] flex items-center justify-between gap-3.5 cursor-pointer select-none hig-transition hig-focus border ${
              isSelected
                ? 'bg-[var(--accent-tint-strong)] border-[var(--accent-primary)]/40 text-[var(--text-primary)]'
                : 'bg-[var(--glass-well)]/65 hover:bg-[var(--glass-well)] border-[var(--border-hairline)] text-[var(--text-primary)]'
            }`;

    return (
      <div key={row.id} className="w-full">
        {/* Desktop Split-View Selection Row */}
        <button
          type="button"
          onClick={() => handleSelectShop(row, false)}
          aria-current={isSelected ? 'true' : undefined}
          className={`hidden lg:flex ${desktopRowClass}`}
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <OwnerAvatar
              picName={row.picName}
              ownershipCode={row.ownershipCode}
              selected={isMacSelected}
              size="md"
            />

            {/* Strictly Two Lines of Content with 15-16px primary & 13-14px secondary text, line-height 1.45 */}
            <div className="min-w-0 flex-1 space-y-1">
              {/* Line 1: Shop Name (16px) + City (14px) */}
              <div className="flex items-baseline justify-between gap-2 min-w-0">
                <span
                  className={`text-[16px] font-semibold leading-[1.45] truncate ${
                    isMacSelected ? 'text-white' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {row.shopName}
                </span>
                <span
                  className={`text-[13px] leading-[1.45] shrink-0 ${
                    isMacSelected ? 'text-white/85' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {row.city}
                </span>
              </div>

              {/* Line 2: Chat Status Dot + Label (13px) · Funnel Progress Arc (13px) */}
              <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1">
                <ChatStatusDotLabel
                  code={row.chatStatusCode}
                  label={row.chatStatusLabel}
                  selected={isMacSelected}
                />
                <span
                  aria-hidden="true"
                  className={isMacSelected ? 'text-white/45' : 'text-[var(--text-tertiary)]'}
                >
                  ·
                </span>
                <FunnelProgressArc
                  stepIndex={row.funnelStepperIndex}
                  stageLabel={row.funnelStage}
                  selected={isMacSelected}
                />
              </div>
            </div>
          </div>

          <ShopScoreRing
            tier={row.tier}
            score={row.score}
            size="sm"
            selected={isMacSelected}
          />
        </button>

        {/* Mobile / Tablet Tap Row (Opens Detail Bottom Sheet, >= 72px height, 12px vertical padding) */}
        <button
          type="button"
          onClick={() => handleSelectShop(row, true)}
          className="flex lg:hidden w-full min-h-[76px] text-left px-4 py-3 rounded-[18px] bg-[var(--glass-well)] border border-[var(--border-glass-outer)] shadow-xs items-center justify-between gap-3 cursor-pointer select-none hig-transition hig-focus"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <OwnerAvatar
              picName={row.picName}
              ownershipCode={row.ownershipCode}
              size="md"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-baseline justify-between gap-2 min-w-0">
                <span className="text-[16px] font-semibold leading-[1.45] text-[var(--text-primary)] truncate">
                  {row.shopName}
                </span>
                <span className="text-[13px] leading-[1.45] text-[var(--text-secondary)] shrink-0">
                  {row.city}
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1">
                <ChatStatusDotLabel
                  code={row.chatStatusCode}
                  label={row.chatStatusLabel}
                />
                <span aria-hidden="true" className="text-[var(--text-tertiary)]">
                  ·
                </span>
                <FunnelProgressArc
                  stepIndex={row.funnelStepperIndex}
                  stageLabel={row.funnelStage}
                />
              </div>
            </div>
          </div>

          <ShopScoreRing tier={row.tier} score={row.score} size="sm" />
        </button>
      </div>
    );
  };

  /**
   * Renders the Inspector Content for the currently selected shop
   * - Card gaps: 24px on desktop (`md:gap-6`), 16px on mobile (`gap-4`)
   * - Inner card padding: 24px on desktop (`md:p-6`), 20px on mobile (`p-5`)
   * - At most ONE primary button in the inspector action toolbar (`WhatsApp`)
   */
  const renderInspectorContent = (shop: DatabaseShopRowDTO | null, isMobileSheet = false) => {
    if (!shop) {
      return (
        <div className="py-16 px-6 text-center space-y-3">
          <p className="text-[16px] font-semibold text-[var(--text-primary)]">
            Tidak ada toko yang dipilih
          </p>
          <p className="text-[15px] text-[var(--text-secondary)]">
            Pilih salah satu toko di daftar sebelah kiri atau ubah kata kunci pencarian.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 md:space-y-6 hig-transition" key={shop.id}>
        {/* 1. Inspector Header: Identity, Owner Avatar, Score Ring */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 md:gap-6">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2 text-[13px] leading-[1.45] font-medium text-[var(--text-secondary)] tabular-nums">
              <span className="font-semibold text-[var(--accent-primary)]">
                ID #{shop.leadIdNumber}
              </span>
              <span aria-hidden="true">·</span>
              <span>{shop.brandSourceLabel}</span>
              <span aria-hidden="true">·</span>
              <span>Diperbarui {shop.lastUpdatedLabel}</span>
              {shop.isDisqualified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[var(--status-danger)]">
                    Ditandai Bukan Target
                  </span>
                </>
              )}
              {shop.needsInspection && !shop.isDisqualified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[var(--status-warning)]">
                    Perlu Diperiksa
                  </span>
                </>
              )}
            </div>

            <h2 className="text-[24px] sm:text-[26px] font-bold tracking-tight leading-tight text-[var(--text-primary)] text-balance">
              {shop.shopName}
            </h2>

            <div className="flex items-start gap-2 text-[15px] leading-[1.45] text-[var(--text-secondary)]">
              <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-1" />
              <span>
                <strong className="font-semibold text-[var(--text-primary)]">
                  {shop.city}, {shop.province}
                </strong>{' '}
                · {shop.fullAddress || 'Belum diisi'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 self-start shrink-0 p-4 rounded-[var(--radius-md)] bg-[var(--glass-well)] border border-[var(--border-hairline)]">
            <ShopScoreRing tier={shop.tier} score={shop.score} size="lg" />
            <div className="pr-1 space-y-0.5">
              <div className="text-[16px] font-bold text-[var(--text-primary)]">
                {shop.tier}
              </div>
              <div className="text-[14px] text-[var(--text-secondary)] tabular-nums">
                {shop.score !== null ? `Skor ${shop.score}` : 'Belum dinilai'}
              </div>
              <div className="text-[13px] text-[var(--text-tertiary)] tabular-nums">
                {shop.coveragePercent}% cakupan
              </div>
            </div>
          </div>
        </div>

        {/* 2. Inspector Action Bar (At most ONE primary button: WhatsApp; secondary actions beside it) */}
        <GlassChrome
          variant="well"
          radius="md"
          className="p-5 md:p-6 flex flex-wrap items-center gap-2.5"
          aria-label="Tindakan Toko Terpilih"
        >
          <Button
            variant="primary"
            size="md"
            leftIcon={<Phone className="w-4 h-4" />}
            onClick={() => handleTriggerWhatsAppDirect(shop)}
            className="min-h-[44px] flex-1 sm:flex-initial"
          >
            WhatsApp
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<MessageSquare className="w-4 h-4 text-[var(--accent-primary)]" />}
            onClick={() => {
              if (isMobileSheet) setMobileInspectorOpen(false);
              onOpenShopInInbox(shop);
            }}
            className="min-h-[44px] flex-1 sm:flex-initial"
          >
            Chat
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<CalendarPlus className="w-4 h-4 text-[var(--accent-primary)]" />}
            onClick={() => onOpenCreateFollowUpForShop(shop)}
            className="min-h-[44px] flex-1 sm:flex-initial"
          >
            Catat tindak lanjut
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => {
              if (isMobileSheet) setMobileInspectorOpen(false);
              onSelectShopDetail(shop.id);
            }}
            className="min-h-[44px] flex-1 sm:flex-initial"
          >
            Detail
          </Button>

          <Button
            variant={shop.isDisqualified ? 'secondary' : 'destructive-outline'}
            size="md"
            leftIcon={
              shop.isDisqualified ? (
                <Undo2 className="w-4 h-4" />
              ) : (
                <Ban className="w-4 h-4" />
              )
            }
            onClick={() => onToggleDisqualified(shop.id)}
            className="min-h-[44px] flex-1 sm:flex-initial ml-auto"
          >
            {shop.isDisqualified ? 'Batalkan label' : 'Bukan target'}
          </Button>
        </GlassChrome>

        {waLaunchedBanner && (
          <div
            role="status"
            className="p-5 md:p-6 rounded-[var(--radius-md)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[var(--status-success)] flex items-center justify-between gap-4 text-[15px] leading-[1.45] font-medium"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{waLaunchedBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenShopInInbox(shop)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] text-[var(--text-primary)] font-semibold text-[13px] shrink-0 cursor-pointer"
            >
              Lanjut di Inbox
            </button>
          </div>
        )}

        {/* 3. Interactive 5-Step Funnel Progress Arc & Stepper */}
        <GlassChrome variant="well" radius="md" className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <FunnelProgressArc
              stepIndex={shop.funnelStepperIndex}
              stageLabel={shop.funnelStage}
            />
            <ChatStatusDotLabel
              code={shop.chatStatusCode}
              label={shop.chatStatusLabel}
            />
          </div>

          <div
            role="group"
            aria-label="Tahap Funnel Akuisisi Toko"
            className="grid grid-cols-5 gap-2"
          >
            {FUNNEL_STEPS.map((st) => {
              const isCompleted = st.step <= shop.funnelStepperIndex;
              const isCurrent = st.step === shop.funnelStepperIndex;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() =>
                    onUpdateFunnelStep && onUpdateFunnelStep(shop.id, st.step)
                  }
                  className={`min-h-[48px] px-2.5 py-2 rounded-[var(--radius-xs)] text-left cursor-pointer hig-transition hig-focus border ${
                    isCurrent
                      ? 'bg-[var(--accent-tint-strong)] text-[var(--accent-primary)] border-[var(--accent-primary)] font-semibold'
                      : isCompleted
                        ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[var(--accent-primary)]/25 font-medium'
                        : 'bg-[var(--surface-solid)]/65 text-[var(--text-secondary)] border-[var(--border-hairline)] hover:bg-[var(--surface-solid)]'
                  }`}
                >
                  <div className="text-[12px] opacity-85 tabular-nums">
                    Tahap {st.step}
                  </div>
                  <div className="text-[13px] truncate">{st.label}</div>
                </button>
              );
            })}
          </div>
        </GlassChrome>

        {/* 4. Two-Column Contact & Ownership Details (24px gap on desktop, 16px on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <GlassChrome variant="well" radius="md" className="p-5 md:p-6 space-y-3.5">
            <div className="text-[13px] font-semibold text-[var(--text-secondary)]">
              Kontak WhatsApp & PIC
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <OwnerAvatar
                  picName={shop.picName}
                  ownershipCode={shop.ownershipCode}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="text-[16px] font-semibold leading-[1.45] text-[var(--text-primary)] truncate">
                    {shop.picName}
                  </div>
                  <div className="text-[14px] leading-[1.45] font-mono text-[var(--text-secondary)] tabular-nums">
                    {shop.whatsappNumber}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyPhone(shop.whatsappNumber)}
                className="min-h-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] hover:bg-[var(--surface-elevated)] border border-[var(--border-strong)] text-[13px] font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5 shrink-0 cursor-pointer hig-transition hig-focus"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-4 h-4 text-[var(--status-success)]" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {shop.secondaryPhones.length > 0 && (
              <div className="pt-2.5 border-t border-[var(--border-hairline)] text-[13px] leading-[1.45] text-[var(--text-secondary)] tabular-nums">
                Nomor cadangan: {shop.secondaryPhones.join(', ')}
              </div>
            )}
          </GlassChrome>

          <GlassChrome variant="well" radius="md" className="p-5 md:p-6 space-y-2.5">
            <div className="text-[13px] font-semibold text-[var(--text-secondary)]">
              Kepemilikan & Sesi Akuisisi
            </div>
            <div className="flex items-center gap-2 text-[16px] font-semibold leading-[1.45] text-[var(--text-primary)]">
              <User className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <span>{shop.ownershipBadgeLabel}</span>
            </div>
            <div className="text-[14px] leading-[1.45] text-[var(--text-secondary)]">
              Sesi WhatsApp: <span className="font-mono">{shop.waSessionLabel}</span>
            </div>
            <div className="text-[13px] leading-[1.45] text-[var(--text-tertiary)]">
              Mode penanganan: {shop.handlerType === 'HUMAN' ? 'Sales Manusia' : 'Otomatisasi AI'}
            </div>
          </GlassChrome>
        </div>

        {/* 5. Cognitive AI Memory Highlight & Sales Note */}
        <GlassChrome variant="well" radius="md" className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[var(--text-primary)]">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Ringkasan Memori Counter & Catatan Sales</span>
            </div>
            <button
              type="button"
              onClick={() => onSelectShopDetail(shop.id)}
              className="min-h-[36px] px-2.5 text-[13px] font-semibold text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Buka 7 Lapis Memori</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {shop.aiMemoryLayers.slice(2, 5).map((layer) => (
              <div
                key={layer.layerNumber}
                className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-solid)]/75 border border-[var(--border-hairline)] space-y-1"
              >
                <div className="text-[12px] font-semibold text-[var(--text-tertiary)]">
                  {layer.title}
                </div>
                <div className="text-[15px] font-semibold leading-[1.45] text-[var(--text-primary)]">
                  {layer.summary}
                </div>
                <p className="text-[13px] leading-[1.45] text-[var(--text-secondary)] line-clamp-2">
                  {layer.detailDescription}
                </p>
              </div>
            ))}
          </div>

          {/* Inline Owner Note */}
          <div className="pt-3 border-t border-[var(--border-hairline)] space-y-2">
            <label
              htmlFor={`inspector-note-${shop.id}`}
              className="block text-[13px] font-semibold text-[var(--text-secondary)]"
            >
              Catatan Internal Sales
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id={`inspector-note-${shop.id}`}
                type="text"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Tambahkan catatan kualifikasi atau minat unit..."
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
              />
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleSaveOwnerNote(shop)}
                className="min-h-[44px] shrink-0"
              >
                {noteSavedToast ? 'Tersimpan' : 'Simpan catatan'}
              </Button>
            </div>
          </div>
        </GlassChrome>

        {/* 6. Recent Conversation Preview & Open Follow-Up Commitments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <GlassChrome variant="well" radius="md" className="p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
                Percakapan Terakhir
              </span>
              <span className="text-[12px] text-[var(--text-tertiary)] tabular-nums">
                {shop.chatMessages.length} pesan
              </span>
            </div>
            {shop.chatMessages.length === 0 ? (
              <p className="text-[14px] leading-[1.45] text-[var(--text-secondary)]">
                Belum ada riwayat sapaan WhatsApp. Klik tombol <strong>Chat</strong> di atas untuk menyapa toko ini.
              </p>
            ) : (
              <div className="space-y-2.5">
                {shop.chatMessages.slice(-2).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-solid)]/80 border border-[var(--border-hairline)] text-[14px] leading-[1.45]"
                  >
                    <div className="flex items-center justify-between text-[12px] text-[var(--text-tertiary)] mb-1">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {msg.senderLabel}
                      </span>
                      <span className="tabular-nums">{msg.timestampWib}</span>
                    </div>
                    <p className="text-[var(--text-secondary)] line-clamp-2">{msg.body}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassChrome>

          <GlassChrome variant="well" radius="md" className="p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
                Jadwal Tindak Lanjut
              </span>
              <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
            </div>
            {shop.openFollowUps.length === 0 ? (
              <p className="text-[14px] leading-[1.45] text-[var(--text-secondary)]">
                Tidak ada jadwal tindak lanjut terbuka. Gunakan tombol <strong>Catat tindak lanjut</strong> untuk menjadwalkan pengingat.
              </p>
            ) : (
              <div className="space-y-2.5">
                {shop.openFollowUps.map((fu) => (
                  <div
                    key={fu.id}
                    className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-solid)]/80 border border-[var(--border-hairline)]"
                  >
                    <div className="text-[12px] font-semibold text-[var(--accent-primary)] tabular-nums">
                      {fu.dueDateDisplay}
                    </div>
                    <div className="text-[14px] leading-[1.45] text-[var(--text-primary)] mt-0.5">
                      {fu.topic}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassChrome>
        </div>
      </div>
    );
  };

  /**
   * Compact Filter Row of Interactive Chips:
   * Strictly at most 5 filter controls visible at once (4 quick chips + 1 "Filter" popover/sheet button).
   */
  const renderCompactFilterChipBar = () => (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter Cepat Toko">
      {/* Control 1: Tier A Quick Chip */}
      <button
        type="button"
        onClick={() => {
          setTierFilter((prev) => (prev === 'Tier A' ? 'Semua tier' : 'Tier A'));
          setVirtualPage(1);
        }}
        className={`min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer hig-transition hig-focus whitespace-nowrap ${
          tierFilter === 'Tier A'
            ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-2xs'
            : 'bg-[var(--glass-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
        }`}
      >
        Tier A
      </button>

      {/* Control 2: Tier B Quick Chip */}
      <button
        type="button"
        onClick={() => {
          setTierFilter((prev) => (prev === 'Tier B' ? 'Semua tier' : 'Tier B'));
          setVirtualPage(1);
        }}
        className={`min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer hig-transition hig-focus whitespace-nowrap ${
          tierFilter === 'Tier B'
            ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-2xs'
            : 'bg-[var(--glass-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
        }`}
      >
        Tier B
      </button>

      {/* Control 3: Ownership Quick Chip */}
      <button
        type="button"
        onClick={() => {
          setOwnershipFilter((prev) => (prev === 'MINE' ? 'ALL' : 'MINE'));
          setVirtualPage(1);
        }}
        className={`min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer hig-transition hig-focus whitespace-nowrap ${
          ownershipFilter === 'MINE'
            ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-2xs'
            : 'bg-[var(--glass-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
        }`}
      >
        Dipegang Anda
      </button>

      {/* Control 4: Chat Status Quick Chip */}
      <button
        type="button"
        onClick={() => {
          setChatStatusFilter((prev) =>
            prev === 'Belum Disapa (Cold)' ? 'Semua status chat' : 'Belum Disapa (Cold)'
          );
          setVirtualPage(1);
        }}
        className={`min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer hig-transition hig-focus whitespace-nowrap ${
          chatStatusFilter === 'Belum Disapa (Cold)'
            ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-2xs'
            : 'bg-[var(--glass-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
        }`}
      >
        Belum Disapa
      </button>

      {/* Control 5: Secondary Filters Popover (Desktop) & Sheet Trigger (Mobile) */}
      <div ref={popoverRef} className="relative ml-auto">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              setMobileFilterSheetOpen(true);
            } else {
              setSecondaryFilterPopoverOpen((prev) => !prev);
            }
          }}
          className={`min-h-[44px] md:min-h-[38px] px-4 py-1.5 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 cursor-pointer hig-transition hig-focus whitespace-nowrap ${
            activeFilterCount > 0 || secondaryFilterPopoverOpen
              ? 'bg-[var(--accent-tint-strong)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/35'
              : 'bg-[var(--glass-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="tabular-nums">({activeFilterCount})</span>
          )}
        </button>

        {/* Desktop Secondary Filters Glass Popover */}
        {secondaryFilterPopoverOpen && (
          <div
            role="dialog"
            aria-label="Filter Tambahan Direktori Toko"
            className="hidden md:block absolute right-0 top-12 w-80 z-40 hig-glass-floating rounded-[var(--radius-lg)] p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                Filter Wilayah & Lanjutan
              </span>
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[13px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
              >
                Reset Semua
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
                Kota / Kabupaten
              </label>
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  if (!e.target.value && externalCityFilter) {
                    onClearExternalCityFilter();
                  }
                  setVirtualPage(1);
                }}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] hig-focus"
              >
                <option value="">Semua kota / wilayah</option>
                {bundle.availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {mode === 'semua_toko' && (
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
                  Tier Toko
                </label>
                <select
                  value={tierFilter}
                  onChange={(e) => {
                    setTierFilter(e.target.value as 'Semua tier' | ShopTierCode);
                    setVirtualPage(1);
                  }}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] hig-focus"
                >
                  {TIER_FILTER_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
                Kepemilikan Sales
              </label>
              <select
                value={ownershipFilter}
                onChange={(e) => {
                  setOwnershipFilter(e.target.value as 'ALL' | ShopOwnershipCode);
                  setVirtualPage(1);
                }}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] hig-focus"
              >
                {OWNERSHIP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
                Status Percakapan
              </label>
              <select
                value={chatStatusFilter}
                onChange={(e) => {
                  setChatStatusFilter(
                    e.target.value as 'Semua status chat' | ShopChatStatusLabel
                  );
                  setVirtualPage(1);
                }}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[14px] text-[var(--text-primary)] hig-focus"
              >
                {CHAT_STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={onlyNeedsInspection}
                onChange={(e) => {
                  setOnlyNeedsInspection(e.target.checked);
                  setVirtualPage(1);
                }}
                className="w-4 h-4 rounded accent-[var(--accent-fill)]"
              />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">
                Hanya toko yang perlu diperiksa
              </span>
            </label>

            <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSecondaryFilterPopoverOpen(false);
                  onNavigate('akuisisi', 'antrean_hari_ini');
                }}
                className="text-[13px] font-semibold text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ke Antrean Hari Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => setSecondaryFilterPopoverOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ==========================================================================
   * DIRECTION A: "Mail / Contacts Split View" (Calm macOS Translucent Split)
   * ========================================================================== */
  const renderDirectionA = () => (
    <div
      aria-label="Direktori Semua Toko - Arah A Mail/Contacts Split View"
      className="max-w-[1200px] w-full mx-auto space-y-4 md:space-y-6"
    >
      {/* Top macOS Window Header & Filter Bar (p-5 on mobile, md:p-6 on desktop) */}
      <GlassChrome
        as="section"
        variant="chrome"
        radius="lg"
        className="p-5 md:p-6 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[13px] font-semibold text-[var(--accent-primary)] tabular-nums">
              {headerConfig.kicker} · {totalVirtualUnits.toLocaleString('id-ID')} unit data nasional
            </div>
            <h2 className="hig-large-title text-[var(--text-primary)]">
              {headerConfig.title}
            </h2>
          </div>

          {/* Search in Toolbar + Single Primary Action ("Tambah toko") */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVirtualPage(1);
                }}
                placeholder="Cari toko, kota, PIC, atau WA..."
                className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--glass-well)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onOpenAddShopDialog}
              className="min-h-[44px] shrink-0"
            >
              Tambah toko
            </Button>
          </div>
        </div>

        {/* Strictly 5 Filter Controls Visible at Once */}
        {renderCompactFilterChipBar()}
      </GlassChrome>

      {/* macOS 2-Pane Split Body with 24px Desktop Gap (`md:gap-6`) & 16px Mobile Gap (`gap-4`) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        {/* Left List Column (p-5 mobile, md:p-6 desktop) */}
        <GlassChrome
          as="section"
          variant="list"
          radius="lg"
          aria-label="Daftar Toko"
          className="lg:col-span-5 p-5 md:p-6 space-y-4"
        >
          <div className="flex items-center justify-between text-[13px] font-medium text-[var(--text-secondary)] tabular-nums">
            <span>Menampilkan {filteredRows.length} toko</span>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={resetAllFilters}
                className="font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
              >
                Reset filter
              </button>
            ) : (
              <span>
                Hal. {virtualPage} / {totalVirtualPages.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* 8px gap between items (`space-y-2`) */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredRows.length === 0 ? (
              <div className="py-16 px-4 text-center space-y-3">
                <p className="text-[16px] font-semibold text-[var(--text-primary)]">
                  Tidak ada toko yang cocok
                </p>
                <p className="text-[14px] text-[var(--text-secondary)]">
                  Coba ubah filter chip di atas atau hapus kata kunci pencarian.
                </p>
                <Button variant="secondary" size="sm" onClick={resetAllFilters}>
                  Reset Filter
                </Button>
              </div>
            ) : (
              filteredRows.map((row) => renderShopListItem(row, 'A'))
            )}
          </div>

          <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-[13px] text-[var(--text-secondary)] tabular-nums">
            <span>
              Hal. <strong className="text-[var(--text-primary)]">{virtualPage}</strong> /{' '}
              {totalVirtualPages.toLocaleString('id-ID')}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={virtualPage <= 1}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => setVirtualPage((p) => Math.max(1, p - 1))}
              >
                Sebelumnya
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={virtualPage >= totalVirtualPages}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => setVirtualPage((p) => Math.min(totalVirtualPages, p + 1))}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </GlassChrome>

        {/* Right Detail / Inspector Column (Desktop, p-5 mobile, md:p-6 desktop) */}
        <GlassChrome
          as="aside"
          variant="inspector"
          radius="lg"
          aria-label="Inspektor Detail Toko Terpilih"
          className="hidden lg:block lg:col-span-7 p-5 md:p-6"
        >
          {renderInspectorContent(selectedShop, false)}
        </GlassChrome>
      </div>
    </div>
  );

  /* ==========================================================================
   * DIRECTION B: "Liquid Glass Floating Panels" (visionOS Spatial Islands)
   * ========================================================================== */
  const renderDirectionB = () => (
    <div
      aria-label="Direktori Semua Toko - Arah B Liquid Glass Floating Panels"
      className="max-w-[1200px] w-full mx-auto space-y-4 md:space-y-6"
    >
      {/* Floating Spatial Glass Header & Toolbar Island */}
      <GlassChrome
        as="section"
        variant="popover"
        radius="xl"
        className="p-5 md:p-6 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[13px] font-semibold text-[var(--accent-primary)] tabular-nums">
              {headerConfig.kicker} · {totalVirtualUnits.toLocaleString('id-ID')} unit data nasional
            </div>
            <h2 className="hig-large-title text-[var(--text-primary)]">
              {headerConfig.title}
            </h2>
            <p className="text-[15px] leading-[1.45] text-[var(--text-secondary)] max-w-2xl">
              {headerConfig.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVirtualPage(1);
                }}
                placeholder="Cari toko, kota, PIC, atau WA..."
                className="w-full min-h-[44px] pl-11 pr-4 py-2 rounded-full bg-[var(--glass-well)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onOpenAddShopDialog}
              className="min-h-[44px] !rounded-full px-5 shrink-0"
            >
              Tambah toko
            </Button>
          </div>
        </div>

        {renderCompactFilterChipBar()}
      </GlassChrome>

      {/* Two Detached Floating Spatial Glass Panels with 24px Desktop Gap (`md:gap-6`) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        {/* Left Floating Glass List Island */}
        <GlassChrome
          as="section"
          variant="list"
          radius="xl"
          aria-label="Daftar Toko Spatial"
          className="lg:col-span-5 p-5 md:p-6 space-y-4"
        >
          <div className="flex items-center justify-between text-[13px] font-medium text-[var(--text-secondary)] tabular-nums">
            <span>{filteredRows.length} kartu toko aktif</span>
            <span>
              Hal. {virtualPage} / {totalVirtualPages.toLocaleString('id-ID')}
            </span>
          </div>

          {/* 8px gap between list items (`space-y-2`) */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredRows.length === 0 ? (
              <div className="py-14 px-4 text-center space-y-3">
                <p className="text-[16px] font-semibold text-[var(--text-primary)]">
                  Tidak ada toko yang cocok
                </p>
                <Button variant="secondary" size="sm" onClick={resetAllFilters}>
                  Reset Filter
                </Button>
              </div>
            ) : (
              filteredRows.map((row) => renderShopListItem(row, 'B'))
            )}
          </div>

          <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={virtualPage <= 1}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setVirtualPage((p) => Math.max(1, p - 1))}
            >
              Sebelumnya
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={virtualPage >= totalVirtualPages}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => setVirtualPage((p) => Math.min(totalVirtualPages, p + 1))}
            >
              Berikutnya
            </Button>
          </div>
        </GlassChrome>

        {/* Right Floating Glass Inspector Card */}
        <GlassChrome
          as="aside"
          variant="inspector"
          radius="xl"
          aria-label="Inspektor Detail Toko Terpilih"
          className="hidden lg:block lg:col-span-7 p-5 md:p-6"
        >
          {renderInspectorContent(selectedShop, false)}
        </GlassChrome>
      </div>
    </div>
  );

  /* ==========================================================================
   * DIRECTION C: "iOS Large-Title Inset Lists" (Centered 2-Pane + Floating Bottom Toolbar)
   * ========================================================================== */
  const renderDirectionC = () => (
    <div
      aria-label="Direktori Semua Toko - Arah C iOS Large-Title Inset Lists"
      className="max-w-[1200px] w-full mx-auto space-y-4 md:space-y-6 pb-20"
    >
      {/* iOS Large-Title Header Card */}
      <GlassChrome
        as="section"
        variant="chrome"
        radius="lg"
        className="p-5 md:p-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-[var(--accent-primary)] tabular-nums">
              {headerConfig.kicker} · {totalVirtualUnits.toLocaleString('id-ID')} Unit Data
            </div>
            <h2 className="hig-large-title text-[var(--text-primary)]">
              {headerConfig.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVirtualPage(1);
                }}
                placeholder="Cari toko atau WA..."
                className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-[14px] bg-[var(--glass-well)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onOpenAddShopDialog}
              className="min-h-[44px] shrink-0"
            >
              Tambah toko
            </Button>
          </div>
        </div>

        {renderCompactFilterChipBar()}
      </GlassChrome>

      {/* Centered Two-Pane iOS Inset Grouped Layout (24px gap on desktop, 16px on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        {/* Left Column: iOS Inset Grouped Sections */}
        <div className="lg:col-span-5 space-y-4 md:space-y-6">
          {groupedSectionsForDirectionC.length === 0 ? (
            <GlassChrome variant="list" radius="lg" className="p-5 md:p-6 text-center space-y-3">
              <p className="text-[16px] font-semibold text-[var(--text-primary)]">
                Tidak ada toko di grup ini
              </p>
              <Button variant="secondary" size="sm" onClick={resetAllFilters}>
                Reset Filter
              </Button>
            </GlassChrome>
          ) : (
            groupedSectionsForDirectionC.map((group) => (
              <GlassChrome
                key={group.id}
                variant="list"
                radius="lg"
                className="p-5 md:p-6 space-y-3"
              >
                <div className="flex items-center justify-between text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  <span>{group.title}</span>
                  <span className="tabular-nums">{group.items.length} toko</span>
                </div>
                <div className="space-y-2">
                  {group.items.map((row) => renderShopListItem(row, 'C'))}
                </div>
              </GlassChrome>
            ))
          )}
        </div>

        {/* Right Column: iOS Inset Grouped Inspector */}
        <GlassChrome
          as="aside"
          variant="inspector"
          radius="lg"
          className="hidden lg:block lg:col-span-7 p-5 md:p-6"
        >
          {renderInspectorContent(selectedShop, false)}
        </GlassChrome>
      </div>

      {/* Signature iOS Floating Bottom Glass Toolbar (Secondary controls only, zero duplicate primary CTA) */}
      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100vw-1.5rem)]">
        <GlassChrome
          variant="popover"
          radius="xl"
          aria-label="Bilah Alat Mengambang Semua Toko"
          className="!rounded-full px-4 py-2 flex items-center gap-3"
        >
          <button
            type="button"
            onClick={() => searchInputRef.current?.focus()}
            className="min-h-[38px] px-3 py-1 rounded-full text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-solid)]/60 inline-flex items-center gap-1.5 cursor-pointer hig-focus whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Fokus Cari</span>
          </button>

          <span className="text-[13px] font-medium text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
            Hal. {virtualPage}/{totalVirtualPages.toLocaleString('id-ID')} · {filteredRows.length} toko
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={virtualPage <= 1}
              onClick={() => setVirtualPage((p) => Math.max(1, p - 1))}
              aria-label="Halaman sebelumnya"
              className="w-9 h-9 rounded-full bg-[var(--surface-solid)]/75 hover:bg-[var(--surface-solid)] disabled:opacity-40 flex items-center justify-center cursor-pointer hig-focus"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={virtualPage >= totalVirtualPages}
              onClick={() => setVirtualPage((p) => Math.min(totalVirtualPages, p + 1))}
              aria-label="Halaman berikutnya"
              className="w-9 h-9 rounded-full bg-[var(--surface-solid)]/75 hover:bg-[var(--surface-solid)] disabled:opacity-40 flex items-center justify-center cursor-pointer hig-focus"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </GlassChrome>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {visualDirection === 'B'
        ? renderDirectionB()
        : visualDirection === 'C'
          ? renderDirectionC()
          : renderDirectionA()}

      {/* ====================================================================
       * MOBILE DETAIL INSPECTOR BOTTOM SHEET (`< 1024px` List > Detail flow)
       * ==================================================================== */}
      <ModalSheet
        open={mobileInspectorOpen}
        onClose={() => setMobileInspectorOpen(false)}
        title={selectedShop ? selectedShop.shopName : 'Detail Toko'}
        subtitle={
          selectedShop
            ? `ID #${selectedShop.leadIdNumber} · ${selectedShop.city}, ${selectedShop.province}`
            : undefined
        }
        size="lg"
      >
        {renderInspectorContent(selectedShop, true)}
      </ModalSheet>

      {/* ====================================================================
       * MOBILE SECONDARY FILTERS BOTTOM SHEET (`ModalSheet`)
       * ==================================================================== */}
      <ModalSheet
        open={mobileFilterSheetOpen}
        onClose={() => setMobileFilterSheetOpen(false)}
        title="Filter Direktori Toko"
        subtitle="Pilih kota, tier, kepemilikan sales, atau status percakapan"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={resetAllFilters}>
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => setMobileFilterSheetOpen(false)}
            >
              Terapkan Filter
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
              Kota / Wilayah
            </label>
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                if (!e.target.value && externalCityFilter) {
                  onClearExternalCityFilter();
                }
                setVirtualPage(1);
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] hig-focus"
            >
              <option value="">Semua kota / wilayah</option>
              {bundle.availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {mode === 'semua_toko' && (
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
                Tier Toko
              </label>
              <select
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value as 'Semua tier' | ShopTierCode);
                  setVirtualPage(1);
                }}
                className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] hig-focus"
              >
                {TIER_FILTER_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
              Kepemilikan Sales
            </label>
            <select
              value={ownershipFilter}
              onChange={(e) => {
                setOwnershipFilter(e.target.value as 'ALL' | ShopOwnershipCode);
                setVirtualPage(1);
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] hig-focus"
            >
              {OWNERSHIP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-[var(--text-secondary)]">
              Status Chat
            </label>
            <select
              value={chatStatusFilter}
              onChange={(e) => {
                setChatStatusFilter(
                  e.target.value as 'Semua status chat' | ShopChatStatusLabel
                );
                setVirtualPage(1);
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[15px] text-[var(--text-primary)] hig-focus"
            >
              {CHAT_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2.5 min-h-[44px] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyNeedsInspection}
              onChange={(e) => {
                setOnlyNeedsInspection(e.target.checked);
                setVirtualPage(1);
              }}
              className="w-4 h-4 rounded accent-[var(--accent-fill)]"
            />
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              Hanya tampilkan toko yang perlu diperiksa dulu
            </span>
          </label>
        </div>
      </ModalSheet>
    </div>
  );
};
