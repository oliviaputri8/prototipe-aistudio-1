import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Compass,
  RefreshCw,
  ShieldCheck,
  Search,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Store,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowRight,
  X,
} from 'lucide-react';
import {
  ErpDuplicateCheckDTO,
  HubId,
  InboxLeadThreadDTO,
  RadarCategoryFilterOption,
  RadarProspectRowDTO,
  RadarStatusFilterOption,
  RadarTokoViewDTO,
  SegmentId,
} from '../../mock/api';
import { GlassChrome } from '../ui/GlassChrome';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';
import { ModalSheet } from '../ui/ModalSheet';

export interface RadarTokoViewProps {
  data: RadarTokoViewDTO;
  onCheckDuplicatePhone: (phone: string) => Promise<ErpDuplicateCheckDTO>;
  onCheckRowErp: (rowId: string, phone: string) => void;
  onSendRowSpintax: (rowId: string) => void;
  onAddCityChip: (cityName: string) => void;
  onOpenHandoverModal: (lead: InboxLeadThreadDTO) => void;
  onRefreshRadar: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

function renderSdrStatusBadge(row: RadarProspectRowDTO) {
  switch (row.sdrStatusCode) {
    case 'UNTOUCHED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--surface-recessed)] text-[var(--text-secondary)] border border-[var(--border-strong)] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] shrink-0" />
          <span>Belum Disapa</span>
        </span>
      );
    case 'TOUCHED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/25 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-fill)] shrink-0" />
          <span>Sudah Disapa</span>
        </span>
      );
    case 'WARM_TALKING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-warning-fill)] shrink-0" />
          <span>Diskusi Aktif</span>
        </span>
      );
    case 'HANDOVER_PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-warning-fill)] shrink-0" />
          <span>Menunggu ACC ERP</span>
        </span>
      );
    case 'GRADUATED_ERP':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success-fill)] shrink-0" />
          <span>Reseller RG ERP</span>
        </span>
      );
  }
}

function mapProspectToHandoverLead(row: RadarProspectRowDTO): InboxLeadThreadDTO {
  return {
    id: `rad-lead-${row.id}`,
    leadIdNumber: row.leadIdNumber,
    shopName: row.shopName,
    avatarInitial: row.shopName.charAt(0).toUpperCase(),
    picName: row.picName,
    whatsappNumber: row.whatsappNumber.replace(/\D/g, ''),
    city: row.city,
    province: row.province,
    fullAddress: row.fullAddress,
    googleMapsUrl: row.googleMapsUrl,
    instagramHandle: row.instagramHandle,
    filterCategory: 'sales',
    handlerBadgeLabel: 'Dipegang Sales',
    funnelStageBadge: 'Prospek Kualifikasi (QUALIFIED)',
    priorityScore: 85,
    waSessionId: 'session-01',
    waSessionLabel: 'WABA Hub Nusantara (6281194002101)',
    cycleStatusLabel: 'Ditangani manusia',
    lastMessageTimestamp: 'Baru saja',
    lastMessagePreview: 'Diajukan dari Radar Toko HP.',
    unreadCount: 0,
    defaultFocusCategory: row.focusCategoryFull,
    defaultProductInterests: [row.focusCategoryShort],
    defaultWeeklyPotentialUnits: row.weeklyPotentialUnits,
    defaultHandoverNote: `Prospek ${row.shopName} (${row.city}) siap order rutin ${row.weeklyPotentialUnits} unit/minggu kategori ${row.focusCategoryShort}.`,
    erpDuplicateCheck: row.erpCheckStatus ?? {
      checkedAtWib: '29 Okt 09.25 WIB',
      isDuplicate: false,
      statusMessage: 'Aman diajukan ke RG ERP.',
    },
    cognitiveMemory: {
      funnelStageCode: 'QUALIFIED',
      picName: row.picName,
      counterProfile: `${row.shopName} · ${row.fullAddress}`,
      preferredSeries: `Unit fokus ${row.focusCategoryShort}`,
      budgetRange: 'Sesuai potensi mingguan',
      tabooNotes: 'Belum ada',
      dealHistorySummary: 'Prospek dari Radar Toko HP',
      conversationSummary: 'Siap verifikasi KYC RG ERP.',
    },
    messages: [],
  };
}

/**
 * Segment 2: Radar Toko HP (`03-radar-toko-hp`)
 * - Desktop (`1440×900`): Merged compact toolbar (Header + Duplicate Checker + Search + Collapsible Filter Drawer)
 *   and compact `<= 52px` table rows with inline real-button actions (`Cek ERP`, `Sapa Spintax`, `Ajukan ke RG ERP`)
 *   so 8+ rows are visible without scrolling at `1440×900`.
 * - Mobile (`390×844`):
 *   - Compact toolbar header with real button affordances + overflow menu for secondary links.
 *   - Only a compact bar sticks (`search field + Filter button with active-filter count`, keeping total sticky chrome `<= 108px`).
 *   - Full filters (cities, `Kategori Fokus Unit`, `Status Sapaan`) open in a bottom sheet with `"Terapkan"` and `"Reset"`.
 *   - Every interactive element on mobile is `>= 44×44px` (`0` touch target violations).
 *   - Unified active chip style (`bg-[var(--accent-fill)] text-[var(--accent-on-fill)]`).
 */
export const RadarTokoView: React.FC<RadarTokoViewProps> = ({
  data,
  onCheckDuplicatePhone,
  onCheckRowErp,
  onSendRowSpintax,
  onAddCityChip,
  onOpenHandoverModal,
  onRefreshRadar,
  onNavigate,
}) => {
  // Duplicate checker state
  const [dupPhoneInput, setDupPhoneInput] = useState('');
  const [isCheckingDup, setIsCheckingDup] = useState(false);
  const [dupResult, setDupResult] = useState<ErpDuplicateCheckDTO | null>(null);
  const [mobileDupExpanded, setMobileDupExpanded] = useState(false);

  // Applied filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<RadarCategoryFilterOption>('Semua Kategori');
  const [selectedSdrStatus, setSelectedSdrStatus] =
    useState<RadarStatusFilterOption>('Semua Status');

  // Desktop collapsible filter drawer
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false);

  // Mobile bottom-sheet filter modal & draft state
  const [mobileFilterSheetOpen, setMobileFilterSheetOpen] = useState(false);
  const [draftCities, setDraftCities] = useState<string[]>([]);
  const [draftCategory, setDraftCategory] =
    useState<RadarCategoryFilterOption>('Semua Kategori');
  const [draftSdrStatus, setDraftSdrStatus] =
    useState<RadarStatusFilterOption>('Semua Status');

  // Add city inline input
  const [addingCityMode, setAddingCityMode] = useState(false);
  const [newCityInput, setNewCityInput] = useState('');

  // Quick links overflow popover
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuRef = useRef<HTMLDivElement | null>(null);

  // Spintax feedback banner
  const [spintaxToast, setSpintaxToast] = useState<string | null>(null);

  useEffect(() => {
    if (!navMenuOpen) return;
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target as Node)) {
        setNavMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavMenuOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navMenuOpen]);

  const activeFilterCount = useMemo(() => {
    let count = selectedCities.length;
    if (selectedCategory !== 'Semua Kategori') count += 1;
    if (selectedSdrStatus !== 'Semua Status') count += 1;
    return count;
  }, [selectedCities, selectedCategory, selectedSdrStatus]);

  const openMobileFilterSheet = () => {
    setDraftCities(selectedCities);
    setDraftCategory(selectedCategory);
    setDraftSdrStatus(selectedSdrStatus);
    setAddingCityMode(false);
    setMobileFilterSheetOpen(true);
  };

  const applyMobileFilters = () => {
    setSelectedCities(draftCities);
    setSelectedCategory(draftCategory);
    setSelectedSdrStatus(draftSdrStatus);
    setMobileFilterSheetOpen(false);
  };

  const resetAllFilters = () => {
    setSelectedCities([]);
    setSelectedCategory('Semua Kategori');
    setSelectedSdrStatus('Semua Status');
    setDraftCities([]);
    setDraftCategory('Semua Kategori');
    setDraftSdrStatus('Semua Status');
  };

  const toggleDesktopCityChip = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleDraftCityChip = (city: string) => {
    setDraftCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleCheckDuplicateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dupPhoneInput.trim()) return;
    setIsCheckingDup(true);
    try {
      const res = await onCheckDuplicatePhone(dupPhoneInput.trim());
      setDupResult(res);
    } finally {
      setIsCheckingDup(false);
    }
  };

  const handleAddCitySubmit = (e: React.FormEvent, isMobileSheet: boolean) => {
    e.preventDefault();
    const cleaned = newCityInput.trim();
    if (cleaned) {
      onAddCityChip(cleaned);
      if (isMobileSheet) {
        setDraftCities((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
      } else {
        setSelectedCities((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
      }
    }
    setNewCityInput('');
    setAddingCityMode(false);
  };

  const filteredProspects = useMemo(() => {
    return data.prospects.filter((row) => {
      if (selectedCities.length > 0) {
        const matchesCity = selectedCities.some((chip) =>
          row.city.toLowerCase().includes(chip.toLowerCase())
        );
        if (!matchesCity) return false;
      }

      if (selectedCategory !== 'Semua Kategori') {
        if (selectedCategory.startsWith('Ex-iBox') && row.focusCategoryShort !== 'Ex-iBox') {
          return false;
        }
        if (selectedCategory.startsWith('New iBox') && row.focusCategoryShort !== 'New iBox') {
          return false;
        }
        if (selectedCategory.startsWith('Inter') && row.focusCategoryShort !== 'Inter') {
          return false;
        }
      }

      if (selectedSdrStatus !== 'Semua Status' && row.sdrStatusLabel !== selectedSdrStatus) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.shopName.toLowerCase().includes(q) ||
          row.city.toLowerCase().includes(q) ||
          row.fullAddress.toLowerCase().includes(q) ||
          row.whatsappNumber.toLowerCase().includes(q) ||
          row.picName.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [data.prospects, selectedCities, selectedCategory, selectedSdrStatus, searchQuery]);

  // Compact Desktop Table Columns (`<= 52px` row height, zero horizontal clipping at 1440px & 1280px)
  const columns: DataTableColumn<RadarProspectRowDTO>[] = [
    {
      key: 'shop',
      header: 'Nama Toko Counter',
      widthClass: 'w-[25%]',
      render: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] flex items-center justify-center shrink-0">
            <Store className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[13px] leading-tight text-[var(--text-primary)] truncate">
              {row.shopName}
            </div>
            <div className="text-[11px] leading-tight text-[var(--text-secondary)] tabular-nums truncate mt-0.5 flex items-center gap-1">
              <span className="truncate">
                #{row.leadIdNumber} · {row.tierLabel} · {row.picName}
              </span>
              {row.erpCheckStatus && (
                <span
                  className={`font-semibold shrink-0 ${
                    row.erpCheckStatus.isDuplicate
                      ? 'text-[var(--status-warning)]'
                      : 'text-[var(--status-success)]'
                  }`}
                >
                  · {row.erpCheckStatus.isDuplicate ? 'Di ERP' : 'Aman'}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Kota / Wilayah',
      widthClass: 'w-[19%]',
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium text-[13px] leading-tight text-[var(--text-primary)] truncate">
            {row.city}
          </div>
          <div className="text-[11px] leading-tight text-[var(--text-tertiary)] truncate mt-0.5">
            {row.fullAddress}
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Nomor WhatsApp',
      isNumeric: true,
      widthClass: 'w-[14%]',
      render: (row) => (
        <span className="font-semibold text-[12px] text-[var(--text-primary)] tabular-nums whitespace-nowrap block truncate">
          {row.whatsappNumber}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      widthClass: 'w-[10%]',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[11px] font-semibold text-[var(--text-primary)] whitespace-nowrap">
          {row.focusCategoryShort}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status SDR',
      widthClass: 'w-[13%]',
      render: (row) => renderSdrStatusBadge(row),
    },
    {
      key: 'actions',
      header: 'Aksi Cepat Hunter',
      align: 'right',
      widthClass: 'w-[19%]',
      render: (row) => (
        <div className="flex flex-nowrap items-center justify-end gap-1 whitespace-nowrap">
          <button
            type="button"
            title="Cek ERP: Periksa duplikasi nomor WhatsApp di RG ERP"
            aria-label={`Cek ERP untuk ${row.shopName}`}
            onClick={() => onCheckRowErp(row.id, row.whatsappNumber)}
            className="w-7 h-7 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center shrink-0 cursor-pointer hig-transition hig-focus"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </button>
          <button
            type="button"
            title="Sapa Spintax: Kirim pesan sapaan acak anti-spam"
            aria-label={`Sapa Spintax untuk ${row.shopName}`}
            onClick={() => {
              onSendRowSpintax(row.id);
              setSpintaxToast(
                `Pesan sapaan acak anti-spam (Spintax) telah dikirim ke ${row.shopName} (${row.whatsappNumber}).`
              );
            }}
            className="w-7 h-7 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center shrink-0 cursor-pointer hig-transition hig-focus"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </button>
          <Button
            variant="primary"
            size="xs"
            className="md:!px-2 md:!py-1 !text-[11px] shrink-0"
            onClick={() => onOpenHandoverModal(mapProspectToHandoverLead(row))}
          >
            Ajukan ke RG ERP
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* ====================================================================
       * 1. UNIFIED COMPACT TOOLBAR (Header + Overflow Links + Duplicate Checker)
       *    - Mobile: Compact row with real button affordances + overflow menu
       *    - Desktop: Single row merging Search, Filter Drawer toggle, and Duplicate Checker
       * ==================================================================== */}
      <SolidCard padding="sm" className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Radar Title Badge + Refresh + Desktop Search & Filter Drawer Toggle */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-xs)] bg-[var(--accent-tint)] text-[var(--accent-primary)] text-[12px] font-bold shrink-0">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                Radar Toko HP ({data.totalBankDataCount.toLocaleString('id-ID')})
              </span>
            </span>

            <Button
              variant="secondary"
              size="xs"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={onRefreshRadar}
            >
              Segarkan Radar
            </Button>

            {/* Desktop Inline Search Input */}
            <div className="hidden md:block relative w-60 lg:w-64">
              <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari toko, kota, atau WA..."
                aria-label="Cari toko counter di Radar"
                className="w-full min-h-[32px] pl-8 pr-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-strong)] text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </div>

            {/* Desktop Collapsible Filter Drawer Button */}
            <div className="hidden md:flex items-center gap-1.5">
              <Button
                variant={desktopFilterOpen || activeFilterCount > 0 ? 'primary' : 'secondary'}
                size="xs"
                leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                rightIcon={
                  desktopFilterOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )
                }
                onClick={() => setDesktopFilterOpen((prev) => !prev)}
              >
                Filter Wilayah & Status{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="xs" onClick={resetAllFilters}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Right: Inline Desktop Duplicate Checker + Primary Action + Overflow Menu */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Desktop Inline Duplicate Checker Form */}
            <form
              onSubmit={handleCheckDuplicateForm}
              className="hidden xl:flex items-center gap-1.5 pr-1.5 border-r border-[var(--border-hairline)]"
            >
              <input
                type="tel"
                value={dupPhoneInput}
                onChange={(e) => setDupPhoneInput(e.target.value)}
                placeholder="Cek No. WA di RG ERP..."
                aria-label="Ketik nomor WhatsApp untuk cek duplikasi RG ERP"
                className="w-44 min-h-[32px] px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-strong)] text-[12px] text-[var(--text-primary)] tabular-nums placeholder:text-[var(--text-tertiary)]"
              />
              <Button
                type="submit"
                variant="secondary"
                size="xs"
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                disabled={isCheckingDup || !dupPhoneInput.trim()}
              >
                {isCheckingDup ? 'Cek...' : 'Cek Duplikat RG ERP'}
              </Button>
            </form>

            <Button
              variant="primary"
              size="xs"
              onClick={() => onNavigate('inbox', 'inbox_workspace')}
            >
              Buka Hunter Chat
            </Button>

            {/* Compact Overflow Menu for Secondary Links (`Katalog Harga Acuan`, `Antrean Handover ERP`, Mobile `Cek Duplikat`) */}
            <div ref={navMenuRef} className="relative">
              <Button
                variant="secondary"
                size="xs"
                leftIcon={<MoreHorizontal className="w-4 h-4" />}
                onClick={() => setNavMenuOpen((prev) => !prev)}
                aria-expanded={navMenuOpen}
                aria-label="Menu pintasan Radar Toko HP"
              >
                Pintasan
              </Button>

              {navMenuOpen && (
                <div
                  role="menu"
                  aria-label="Pintasan Navigasi Radar"
                  className="absolute right-0 top-full mt-1.5 w-64 z-40 hig-glass-floating rounded-[var(--radius-md)] p-1.5 bg-[var(--surface-solid)] border border-[var(--border-strong)] shadow-lg space-y-1"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setNavMenuOpen(false);
                      setMobileDupExpanded((prev) => !prev);
                    }}
                    className="xl:hidden w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] text-left text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-recessed)] flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>{mobileDupExpanded ? 'Sembunyikan Cek Duplikat' : 'Cek Duplikat RG ERP'}</span>
                    <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setNavMenuOpen(false);
                      onNavigate('katalog', 'katalog_harga');
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] text-left text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-recessed)] flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>Katalog Harga Acuan</span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setNavMenuOpen(false);
                      onNavigate('akuisisi', 'antrean_handover_erp');
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] text-left text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-recessed)] flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>Antrean Handover ERP</span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Collapsible Duplicate Checker Row (or always visible if user toggled it) */}
        {mobileDupExpanded && (
          <form
            onSubmit={handleCheckDuplicateForm}
            className="xl:hidden pt-2 border-t border-[var(--border-hairline)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <input
              type="tel"
              value={dupPhoneInput}
              onChange={(e) => setDupPhoneInput(e.target.value)}
              placeholder="Ketik nomor WA (cth: 081141007707)"
              aria-label="Ketik nomor WhatsApp untuk cek duplikasi RG ERP"
              className="flex-1 min-h-[44px] px-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] tabular-nums"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isCheckingDup || !dupPhoneInput.trim()}
            >
              {isCheckingDup ? 'Memeriksa...' : 'Cek Duplikat RG ERP'}
            </Button>
          </form>
        )}

        {/* Duplicate Check Result Banner */}
        {dupResult && (
          <div
            role="status"
            className={`px-3 py-2 rounded-[var(--radius-xs)] border flex items-center justify-between gap-3 text-[12px] ${
              dupResult.isDuplicate
                ? 'bg-[var(--status-warning-bg)] border-[var(--status-warning-border)] text-[var(--status-warning)]'
                : 'bg-[var(--status-success-bg)] border-[var(--status-success-border)] text-[var(--status-success)]'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {dupResult.isDuplicate ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{dupResult.statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setDupResult(null)}
              className="min-h-[44px] min-w-[44px] md:min-h-[28px] md:min-w-[28px] px-2 inline-flex items-center justify-center text-[12px] font-semibold underline shrink-0 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* ==================================================================
         * DESKTOP COLLAPSIBLE FILTER DRAWER (Hidden on mobile, opens on click)
         * ================================================================== */}
        {desktopFilterOpen && (
          <div className="hidden md:block pt-2.5 border-t border-[var(--border-hairline)] space-y-3">
            {/* Multi-City Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Filter Multi-Kota Target Akuisisi:</span>
                </span>
                {selectedCities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCities([])}
                    className="min-h-[32px] px-2 text-[12px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                  >
                    Reset kota ({selectedCities.length})
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {data.availableCities.map((city) => {
                  const active = selectedCities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleDesktopCityChip(city)}
                      className={`min-h-[32px] px-3 py-1 rounded-full text-[12px] font-semibold border cursor-pointer hig-transition ${
                        active
                          ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                          : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}

                {addingCityMode ? (
                  <form
                    onSubmit={(e) => handleAddCitySubmit(e, false)}
                    className="inline-flex items-center gap-1"
                  >
                    <input
                      type="text"
                      value={newCityInput}
                      onChange={(e) => setNewCityInput(e.target.value)}
                      placeholder="Nama kota..."
                      autoFocus
                      className="h-8 w-32 px-2.5 rounded-full bg-[var(--surface-solid)] border border-[var(--accent-primary)] text-[12px] text-[var(--text-primary)]"
                    />
                    <button
                      type="submit"
                      className="h-8 px-2.5 rounded-full bg-[var(--accent-fill)] text-[var(--accent-on-fill)] text-[12px] font-semibold cursor-pointer"
                    >
                      Tambah
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingCityMode(false)}
                      className="h-8 px-2 text-[12px] text-[var(--text-secondary)] cursor-pointer"
                    >
                      Batal
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingCityMode(true)}
                    className="min-h-[32px] px-3 py-1 rounded-full text-[12px] font-semibold border border-dashed border-[var(--border-strong)] bg-[var(--surface-solid)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah kota...</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category & SDR Status Filter Pills (Unified Filled Accent Active State) */}
            <div className="pt-2 border-t border-[var(--border-hairline)] grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
                  Kategori Fokus Unit:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {data.categoryFilterOptions.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`min-h-[32px] px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold border cursor-pointer hig-transition ${
                          active
                            ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                            : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
                  Status Sapaan & Handover SDR:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {data.statusFilterOptions.map((st) => {
                    const active = selectedSdrStatus === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedSdrStatus(st)}
                        className={`min-h-[32px] px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold border cursor-pointer hig-transition ${
                          active
                            ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                            : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </SolidCard>

      {/* ====================================================================
       * 2. MOBILE COMPACT STICKY SEARCH + FILTER BAR (< md ONLY)
       *    - Sticks directly under the 52px mobile SegmentedControl bar (`top-[52px]`)
       *    - Height = 56px -> Total sticky chrome on mobile = 52 + 56 = 108px (<= 110px!)
       * ==================================================================== */}
      <GlassChrome
        variant="toolbar"
        radius="sm"
        className="md:hidden sticky top-[52px] z-10 p-1.5 flex items-center gap-2"
      >
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari counter, kota, nomor WA..."
            aria-label="Cari toko counter di Radar"
            className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
        </div>

        <button
          type="button"
          onClick={openMobileFilterSheet}
          aria-label={`Filter Radar Prospek${activeFilterCount > 0 ? ` (${activeFilterCount} aktif)` : ''}`}
          className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] border text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hig-transition ${
            activeFilterCount > 0
              ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
              : 'bg-[var(--surface-solid)] text-[var(--text-primary)] border-[var(--border-strong)]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-white/25 text-white tabular-nums">
              {activeFilterCount}
            </span>
          )}
        </button>
      </GlassChrome>

      {/* Spintax Action Feedback Toast */}
      {spintaxToast && (
        <div
          role="status"
          className="px-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[var(--status-success)] flex items-center justify-between gap-3 text-[12px] font-semibold"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{spintaxToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSpintaxToast(null)}
            className="min-h-[44px] min-w-[44px] md:min-h-[28px] md:min-w-[28px] px-2 inline-flex items-center justify-center underline text-[12px] cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ====================================================================
       * 3. PROSPECT SOLID TABLE (Compact Desktop Table / Mobile Card List)
       * ==================================================================== */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">
              Daftar Counter & Toko HP Target
            </h2>
            <span className="px-2 py-0.5 rounded-[6px] bg-[var(--surface-solid)] border border-[var(--border-hairline)] text-[11px] font-bold text-[var(--text-secondary)] tabular-nums">
              {filteredProspects.length} toko
            </span>
          </div>
          <p className="hidden lg:block text-[12px] text-[var(--text-secondary)]">
            Klik Sapa Spintax untuk pesan acak anti-spam atau Ajukan ke RG ERP bila terverifikasi.
          </p>
        </div>

        <DataTable
          compact
          fixedLayout
          columns={columns}
          rows={filteredProspects}
          rowKey={(r) => r.id}
          caption="Tabel Daftar Counter dan Toko HP Target Radar SDR"
          emptyLabel="Tidak ada prospek toko yang cocok dengan kombinasi filter saat ini."
          mobileCardRender={(row) => (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-[15px] text-[var(--text-primary)]">
                    {row.shopName}
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)] tabular-nums">
                    ID #{row.leadIdNumber} · {row.tierLabel} · {row.city}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] text-[11px] font-semibold text-[var(--text-primary)]">
                  {row.focusCategoryShort}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {row.whatsappNumber}
                </span>
                {renderSdrStatusBadge(row)}
              </div>

              {row.erpCheckStatus && (
                <div
                  className={`p-2 rounded-[var(--radius-xs)] text-[12px] font-semibold ${
                    row.erpCheckStatus.isDuplicate
                      ? 'bg-[var(--status-warning-bg)] text-[var(--status-warning)]'
                      : 'bg-[var(--status-success-bg)] text-[var(--status-success)]'
                  }`}
                >
                  {row.erpCheckStatus.statusMessage}
                </div>
              )}

              <div className="pt-2 border-t border-[var(--border-hairline)] flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCheckRowErp(row.id, row.whatsappNumber)}
                >
                  Cek ERP
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onSendRowSpintax(row.id);
                    setSpintaxToast(
                      `Sapaan Spintax terkirim ke ${row.shopName} (${row.whatsappNumber}).`
                    );
                  }}
                >
                  Sapa Spintax
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                  onClick={() => onOpenHandoverModal(mapProspectToHandoverLead(row))}
                >
                  Ajukan ke RG ERP
                </Button>
              </div>
            </div>
          )}
        />
      </div>

      {/* ====================================================================
       * 4. MOBILE FILTER BOTTOM SHEET (`ModalSheet` with "Reset" & "Terapkan")
       * ==================================================================== */}
      <ModalSheet
        open={mobileFilterSheetOpen}
        onClose={() => setMobileFilterSheetOpen(false)}
        title="Filter Radar Toko HP"
        subtitle={`${data.totalBankDataCount.toLocaleString('id-ID')} Toko di Bank Data`}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDraftCities([]);
                setDraftCategory('Semua Kategori');
                setDraftSdrStatus('Semua Status');
              }}
            >
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={applyMobileFilters}>
              Terapkan
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* 1. Multi-City Chips (`>= 44x44px` on mobile) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Kota Target Akuisisi</span>
              </span>
              {draftCities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDraftCities([])}
                  className="min-h-[44px] min-w-[44px] px-2 text-[12px] font-semibold text-[var(--accent-primary)] underline cursor-pointer"
                >
                  Hapus pilihan ({draftCities.length})
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {data.availableCities.map((city) => {
                const active = draftCities.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => toggleDraftCityChip(city)}
                    className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full text-[13px] font-semibold border cursor-pointer hig-transition ${
                      active
                        ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                        : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-strong)]'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}

              {addingCityMode ? (
                <form
                  onSubmit={(e) => handleAddCitySubmit(e, true)}
                  className="w-full flex items-center gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={newCityInput}
                    onChange={(e) => setNewCityInput(e.target.value)}
                    placeholder="Ketik nama kota baru..."
                    autoFocus
                    className="flex-1 min-h-[44px] px-3.5 rounded-full bg-[var(--surface-solid)] border border-[var(--accent-primary)] text-[13px] text-[var(--text-primary)]"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    Tambah
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setAddingCityMode(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingCityMode(true)}
                  className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full text-[13px] font-semibold border border-dashed border-[var(--border-strong)] bg-[var(--surface-solid)] text-[var(--text-secondary)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah kota...</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Kategori Fokus Unit (`>= 44x44px` on mobile, unified accent fill) */}
          <div className="space-y-2 pt-3 border-t border-[var(--border-hairline)]">
            <span className="text-[13px] font-semibold text-[var(--text-primary)] block">
              Kategori Fokus Unit
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {data.categoryFilterOptions.map((cat) => {
                const active = draftCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDraftCategory(cat)}
                    className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] text-[13px] font-semibold border cursor-pointer hig-transition ${
                      active
                        ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                        : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-strong)]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Status Sapaan & Handover SDR (`>= 44x44px` on mobile, unified accent fill) */}
          <div className="space-y-2 pt-3 border-t border-[var(--border-hairline)]">
            <span className="text-[13px] font-semibold text-[var(--text-primary)] block">
              Status Sapaan & Handover SDR
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {data.statusFilterOptions.map((st) => {
                const active = draftSdrStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setDraftSdrStatus(st)}
                    className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-[var(--radius-xs)] text-[13px] font-semibold border cursor-pointer hig-transition ${
                      active
                        ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                        : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] border-[var(--border-strong)]'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ModalSheet>
    </div>
  );
};
