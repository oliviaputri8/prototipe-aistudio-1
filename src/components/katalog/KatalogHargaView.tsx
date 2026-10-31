import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Info,
  Compass,
  MessageSquare,
  Tag,
} from 'lucide-react';
import {
  HubId,
  KatalogMediaHubBundleDTO,
  PriceCatalogCategoryFilterOption,
  PriceCatalogItemDTO,
  SegmentId,
} from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { GlassChrome } from '../ui/GlassChrome';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';
import { ModalSheet } from '../ui/ModalSheet';

interface KatalogHargaViewProps {
  data: KatalogMediaHubBundleDTO['priceCatalog'];
  onSyncFromErp: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Stage 3b Segment 1: Katalog Harga Acuan (`05-katalog-harga`)
 * - Action bar: "Salin Brosur Harga ke WhatsApp", "Sinkronkan dari RG ERP", plus navigation links
 *   to Radar Toko HP and Hunter Chat.
 * - Info callout: "Katalog Acuan Indikatif Harian (Tanpa Stok Fisik / IMEI)"
 * - Sticky glass filter bar on desktop; compact sticky search + "Filter" button on mobile (<= 110px sticky chrome)
 *   opening a bottom sheet.
 * - Solid price table (`fixedLayout={true}`, zero horizontal overflow at 1440px and 1280px) with
 *   "Salin Harga" row action and visible copied confirmation state ("Tersalin").
 */
export const KatalogHargaView: React.FC<KatalogHargaViewProps> = ({
  data,
  onSyncFromErp,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<PriceCatalogCategoryFilterOption>('Semua Kategori');
  const [mobileFilterSheetOpen, setMobileFilterSheetOpen] = useState(false);

  const [copiedBrochure, setCopiedBrochure] = useState(false);
  const [copiedRowId, setCopiedRowId] = useState<string | null>(null);
  const [syncingErp, setSyncingErp] = useState(false);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.items.filter((item) => {
      if (
        selectedCategory !== 'Semua Kategori' &&
        item.warrantyCategory !== selectedCategory
      ) {
        return false;
      }
      if (!q) return true;
      return (
        item.modelName.toLowerCase().includes(q) ||
        item.capacityLabel.toLowerCase().includes(q) ||
        item.warrantyCategory.toLowerCase().includes(q) ||
        item.erpSkuCode.toLowerCase().includes(q)
      );
    });
  }, [data.items, searchQuery, selectedCategory]);

  const activeMobileFilterCount = selectedCategory !== 'Semua Kategori' ? 1 : 0;

  const handleCopyFullBrochure = () => {
    const lines = [
      '*KATALOG HARGA ACUAN GROSIR IPHONE - RUMAH GADGET*',
      `Update: ${data.lastErpSyncWib}`,
      '',
      ...filteredItems.map(
        (item) =>
          `- *${item.modelName} (${item.capacityLabel})* [${item.warrantyBadgeShort}]: ${formatRupiah(item.minPriceIdr)} - ${formatRupiah(item.maxPriceIdr)}`
      ),
      '',
      '_Harga acuan indikatif harian. Konfirmasi stok fisik & unit via Sales Rumah Gadget._',
    ];
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
    }
    setCopiedBrochure(true);
    window.setTimeout(() => setCopiedBrochure(false), 2200);
  };

  const handleCopySingleRow = (item: PriceCatalogItemDTO) => {
    const snippet = `${item.modelName} (${item.capacityLabel}) [${item.warrantyCategory}]: ${formatRupiah(item.minPriceIdr)} - ${formatRupiah(item.maxPriceIdr)}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snippet).catch(() => {});
    }
    setCopiedRowId(item.id);
    window.setTimeout(() => {
      setCopiedRowId((curr) => (curr === item.id ? null : curr));
    }, 2000);
  };

  const handleSyncErpClick = () => {
    setSyncingErp(true);
    window.setTimeout(() => {
      onSyncFromErp();
      setSyncingErp(false);
    }, 260);
  };

  // Desktop columns strictly sum to 100% (`fixedLayout={true}`) for zero horizontal scroll at 1440px & 1280px
  const columns: DataTableColumn<PriceCatalogItemDTO>[] = [
    {
      key: 'tipe_iphone',
      header: 'Tipe iPhone',
      widthClass: 'w-[16%]',
      render: (row) => (
        <div className="min-w-0">
          <div className="font-semibold text-[13px] text-[var(--text-primary)] truncate">
            {row.modelName}
          </div>
          <div className="text-[11px] text-[var(--text-tertiary)] font-mono truncate">
            {row.erpSkuCode}
          </div>
        </div>
      ),
    },
    {
      key: 'kapasitas',
      header: 'Kapasitas',
      widthClass: 'w-[9%]',
      render: (row) => (
        <span className="text-[12px] font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
          {row.capacityLabel}
        </span>
      ),
    },
    {
      key: 'kategori',
      header: 'Kategori Garansi',
      widthClass: 'w-[15%]',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[5px] text-[11px] font-semibold truncate max-w-full ${
            row.warrantyBadgeShort === 'Ex-iBox'
              ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)]'
              : row.warrantyBadgeShort === 'New iBox'
                ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]'
                : 'bg-[var(--surface-recessed)] text-[var(--text-secondary)] border border-[var(--border-hairline)]'
          }`}
        >
          {row.warrantyCategory}
        </span>
      ),
    },
    {
      key: 'harga_min',
      header: 'Harga Acuan Minimum',
      widthClass: 'w-[18%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--text-primary)] tabular-nums whitespace-nowrap">
          {formatRupiah(row.minPriceIdr)}
        </span>
      ),
    },
    {
      key: 'harga_max',
      header: 'Harga Acuan Maksimum',
      widthClass: 'w-[18%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--accent-primary)] tabular-nums whitespace-nowrap">
          {formatRupiah(row.maxPriceIdr)}
        </span>
      ),
    },
    {
      key: 'sinkronisasi',
      header: 'Sinkronisasi',
      widthClass: 'w-[11%]',
      render: (row) => (
        <span className="text-[11px] text-[var(--text-secondary)] tabular-nums truncate block">
          {row.syncedAtLabel}
        </span>
      ),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      widthClass: 'w-[13%]',
      align: 'right',
      render: (row) => {
        const isCopied = copiedRowId === row.id;
        return (
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => handleCopySingleRow(row)}
              className={`min-h-[28px] px-2 py-1 rounded-[6px] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap hig-transition hig-focus ${
                isCopied
                  ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]'
                  : 'bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)]'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-[var(--status-success)] shrink-0" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[var(--accent-primary)] shrink-0" />
                  <span>Salin Harga</span>
                </>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <section aria-label="Katalog Harga Acuan" className="space-y-3">
      {/* 1. HEADER & ACTION BAR */}
      <SolidCard padding="sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                <Tag className="w-3 h-3" />
                <span>{data.headerBadgeLabel}</span>
              </span>
              <span className="text-[11px] font-medium text-[var(--text-secondary)] tabular-nums">
                Sinkron terakhir: {data.lastErpSyncWib}
              </span>
            </div>
            <h2 className="text-[15px] md:text-[16px] font-bold tracking-tight text-[var(--text-primary)]">
              {data.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={
                copiedBrochure ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
              onClick={handleCopyFullBrochure}
            >
              {copiedBrochure
                ? 'Brosur harga tersalin.'
                : 'Salin Brosur Harga ke WhatsApp'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                <RefreshCw
                  className={`w-3.5 h-3.5 ${syncingErp ? 'animate-spin' : ''}`}
                />
              }
              onClick={handleSyncErpClick}
            >
              {syncingErp ? 'Menyinkronkan...' : 'Sinkronkan dari RG ERP'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Compass className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('akuisisi', 'radar_toko')}
            >
              Radar Toko HP
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('inbox', 'inbox_workspace')}
            >
              Hunter Chat
            </Button>
          </div>
        </div>
      </SolidCard>

      {/* 2. INDICATIVE PRICE CALLOUT CARD (`05-katalog-harga`) */}
      <SolidCard
        padding="sm"
        className="border-l-4 border-l-[var(--accent-fill)]"
      >
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div className="min-w-0 space-y-0.5">
            <div className="text-[12px] font-bold text-[var(--text-primary)]">
              {data.calloutTitle}
            </div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {data.calloutBody}
            </p>
          </div>
        </div>
      </SolidCard>

      {/* 3A. MOBILE COMPACT STICKY SEARCH + FILTER BAR (<= 104px total sticky chrome with SegmentedControl) */}
      <GlassChrome
        variant="toolbar"
        className="md:hidden sticky top-[52px] z-10 -mx-3 px-3 py-1.5 border-b border-[var(--glass-border)] flex items-center gap-2"
      >
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tipe iPhone atau kapasitas..."
            className="w-full min-h-[44px] pl-9 pr-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
          />
        </div>
        <button
          type="button"
          onClick={() => setMobileFilterSheetOpen(true)}
          className="min-h-[44px] px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[12px] font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--accent-primary)]" />
          <span>Filter</span>
          {activeMobileFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[var(--accent-fill)] text-white text-[10px] font-bold tabular-nums">
              {activeMobileFilterCount}
            </span>
          )}
        </button>
      </GlassChrome>

      {/* 3B. DESKTOP STICKY GLASS FILTER BAR */}
      <GlassChrome
        variant="toolbar"
        className="hidden md:flex sticky top-[116px] z-10 rounded-[var(--radius-md)] p-2.5 border border-[var(--glass-border)] items-center justify-between gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari model iPhone (mis. iPhone 13, 128GB, Ex-iBox)..."
            className="w-full min-h-[36px] pl-9 pr-3 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {data.categoryFilterOptions.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[34px] px-3 py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold cursor-pointer hig-transition hig-focus ${
                  active
                    ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                    : 'bg-[var(--surface-solid)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </GlassChrome>

      {/* 4. SOLID PRICE TABLE (Desktop `fixedLayout`) + MOBILE CARD LIST */}
      <DataTable
        caption="Tabel Katalog Harga Acuan iPhone"
        columns={columns}
        rows={filteredItems}
        rowKey={(r) => r.id}
        fixedLayout
        compact
        emptyLabel="Tidak ada model iPhone yang cocok dengan pencarian atau filter kategori."
        mobileCardRender={(row) => {
          const isCopied = copiedRowId === row.id;
          return (
            <div className="p-3 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[14px] font-bold text-[var(--text-primary)]">
                    {row.modelName} · {row.capacityLabel}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)] font-mono">
                    {row.erpSkuCode} · Sinkron {row.syncedAtLabel}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] shrink-0">
                  {row.warrantyBadgeShort}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
                <div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Harga Acuan Minimum
                  </div>
                  <div className="text-[13px] font-bold text-[var(--text-primary)] tabular-nums">
                    {formatRupiah(row.minPriceIdr)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Harga Acuan Maksimum
                  </div>
                  <div className="text-[13px] font-bold text-[var(--accent-primary)] tabular-nums">
                    {formatRupiah(row.maxPriceIdr)}
                  </div>
                </div>
              </div>

              <Button
                variant={isCopied ? 'primary' : 'secondary'}
                size="sm"
                fullWidth
                leftIcon={
                  isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )
                }
                onClick={() => handleCopySingleRow(row)}
              >
                {isCopied ? 'Tersalin ke Clipboard' : 'Salin Harga'}
              </Button>
            </div>
          );
        }}
      />

      {/* MOBILE FILTER BOTTOM SHEET */}
      <ModalSheet
        open={mobileFilterSheetOpen}
        onClose={() => setMobileFilterSheetOpen(false)}
        title="Filter Kategori Garansi"
        subtitle="Pilih kategori unit iPhone untuk menyaring daftar harga acuan."
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setSelectedCategory('Semua Kategori');
                setMobileFilterSheetOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setMobileFilterSheetOpen(false)}
            >
              Terapkan
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          {data.categoryFilterOptions.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius-sm)] flex items-center justify-between text-left text-[13px] font-semibold cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                    : 'bg-[var(--surface-recessed)] text-[var(--text-primary)]'
                }`}
              >
                <span>{cat}</span>
                {active && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </ModalSheet>
    </section>
  );
};
