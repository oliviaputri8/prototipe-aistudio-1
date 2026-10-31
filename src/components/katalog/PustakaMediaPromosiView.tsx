import React, { useState } from 'react';
import {
  Upload,
  RefreshCw,
  Settings,
  FileText,
  Radio,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  DeletedMediaItemDTO,
  HubId,
  KatalogMediaHubBundleDTO,
  PromotionalMediaItemDTO,
  SegmentId,
} from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';

interface PustakaMediaPromosiViewProps {
  data: KatalogMediaHubBundleDTO['promotionalMedia'];
  onOpenUploadModal: () => void;
  onRefresh: () => void;
  onSoftDeleteMedia: (mediaId: string) => void;
  onRestoreMedia: (deletedMediaId: string) => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

/**
 * Stage 3b Segment 2: Pustaka Media Promosi (`13-media-promosi`)
 * - Action bar: "Unggah media baru" (opens d05), "Muat Ulang", "Pengaturan Tim"
 * - 2 KPI cards: Pustaka Berkas Promosi (file count) and Kanal Distribusi (Sesi WA)
 * - Primary solid table (`Daftar Materi Promosi & Brosur Acuan`, `fixedLayout={true}`):
 *   #, Nama Dokumen / File, Kategori, Ukuran, Media Handle WA (hash-cache note), Pembaruan, Aksi,
 *   plus the "Teknologi WhatsApp Media Hash Caching (Blueprint §3.4)" callout.
 * - Secondary solid table (`Terhapus`): soft-deleted media with "Pulihkan" action.
 */
export const PustakaMediaPromosiView: React.FC<PustakaMediaPromosiViewProps> = ({
  data,
  onOpenUploadModal,
  onRefresh,
  onSoftDeleteMedia,
  onRestoreMedia,
  onNavigate,
}) => {
  const [copiedHandleId, setCopiedHandleId] = useState<string | null>(null);

  const handleCopyWaHandle = (item: PromotionalMediaItemDTO) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(item.waMediaHandle).catch(() => {});
    }
    setCopiedHandleId(item.id);
    window.setTimeout(() => {
      setCopiedHandleId((curr) => (curr === item.id ? null : curr));
    }, 2000);
  };

  // Active Media Table Columns (`fixedLayout={true}` — widths sum to 100%)
  const activeColumns: DataTableColumn<PromotionalMediaItemDTO>[] = [
    {
      key: 'no',
      header: '#',
      widthClass: 'w-[4%]',
      isNumeric: true,
      render: (row) => (
        <span className="font-mono text-[12px] text-[var(--text-tertiary)] tabular-nums">
          {row.rowNumber}
        </span>
      ),
    },
    {
      key: 'nama_dokumen',
      header: 'Nama Dokumen / File',
      widthClass: 'w-[22%]',
      render: (row) => (
        <div className="min-w-0">
          <div className="font-semibold text-[13px] text-[var(--text-primary)] truncate">
            {row.documentTitle}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
            {row.fileName} ({row.fileType})
          </div>
        </div>
      ),
    },
    {
      key: 'kategori',
      header: 'Kategori',
      widthClass: 'w-[18%]',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[11px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] leading-tight whitespace-normal break-words">
          {row.category}
        </span>
      ),
    },
    {
      key: 'ukuran',
      header: 'Ukuran',
      widthClass: 'w-[8%]',
      isNumeric: true,
      render: (row) => (
        <span className="text-[12px] font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
          {row.fileSizeLabel}
        </span>
      ),
    },
    {
      key: 'media_handle',
      header: 'Media Handle WA',
      widthClass: 'w-[18%]',
      render: (row) => (
        <div className="min-w-0">
          <div className="text-[11px] font-mono text-[var(--text-primary)] truncate">
            {row.waMediaHandle}
          </div>
          <div className="text-[10px] text-[var(--status-success)] font-medium truncate">
            {row.waHashCacheNote}
          </div>
        </div>
      ),
    },
    {
      key: 'pembaruan',
      header: 'Pembaruan',
      widthClass: 'w-[16%]',
      render: (row) => (
        <span className="text-[11px] text-[var(--text-secondary)] tabular-nums whitespace-normal leading-tight block">
          {row.updatedAtWib}
        </span>
      ),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      widthClass: 'w-[14%]',
      align: 'right',
      render: (row) => {
        const isCopied = copiedHandleId === row.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => handleCopyWaHandle(row)}
              title="Salin Media Handle WhatsApp"
              className={`min-h-[28px] px-2 py-1 rounded-[6px] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap hig-transition ${
                isCopied
                  ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]'
                  : 'bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-strong)]'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 shrink-0" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[var(--accent-primary)] shrink-0" />
                  <span>Salin Handle</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onSoftDeleteMedia(row.id)}
              title="Hapus lunak (pindahkan ke Terhapus)"
              aria-label={`Hapus ${row.documentTitle}`}
              className="w-7 h-7 rounded-[6px] bg-[var(--surface-recessed)] hover:bg-[var(--status-danger-bg)] text-[var(--text-secondary)] hover:text-[var(--status-danger)] border border-[var(--border-hairline)] inline-flex items-center justify-center cursor-pointer shrink-0 hig-transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  // Deleted Media Table Columns (`fixedLayout={true}`)
  const deletedColumns: DataTableColumn<DeletedMediaItemDTO>[] = [
    {
      key: 'del_nama',
      header: 'Nama Dokumen / Berkas Terhapus',
      widthClass: 'w-[30%]',
      render: (row) => (
        <div className="min-w-0">
          <div className="font-semibold text-[13px] text-[var(--text-primary)] truncate">
            {row.documentTitle}
          </div>
          <div className="text-[11px] text-[var(--text-tertiary)] font-mono truncate">
            {row.fileName} · {row.fileSizeLabel}
          </div>
        </div>
      ),
    },
    {
      key: 'del_kategori',
      header: 'Kategori',
      widthClass: 'w-[18%]',
      render: (row) => (
        <span className="text-[12px] text-[var(--text-secondary)] leading-tight whitespace-normal break-words block">
          {row.category}
        </span>
      ),
    },
    {
      key: 'del_handle',
      header: 'Media Handle WA',
      widthClass: 'w-[18%]',
      render: (row) => (
        <span className="text-[11px] font-mono text-[var(--text-tertiary)] truncate block">
          {row.waMediaHandle}
        </span>
      ),
    },
    {
      key: 'del_waktu',
      header: 'Waktu Dihapus',
      widthClass: 'w-[18%]',
      render: (row) => (
        <div className="min-w-0">
          <div className="text-[11px] text-[var(--text-secondary)] tabular-nums whitespace-normal leading-tight">
            {row.deletedAtWib}
          </div>
          <div className="text-[10px] text-[var(--text-tertiary)] truncate">
            Oleh {row.deletedByOperator}
          </div>
        </div>
      ),
    },
    {
      key: 'del_aksi',
      header: 'Aksi',
      widthClass: 'w-[16%]',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => onRestoreMedia(row.id)}
            className="min-h-[28px] px-2.5 py-1 rounded-[6px] bg-[var(--accent-tint)] hover:bg-[var(--accent-fill)] text-[var(--accent-primary)] hover:text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap hig-transition"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span>Pulihkan</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <section aria-label="Pustaka Media Promosi" className="space-y-3">
      {/* 1. HEADER & ACTION BAR */}
      <SolidCard padding="sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
              <FileText className="w-3 h-3" />
              <span>{data.headerBadgeLabel}</span>
            </span>
            <h2 className="text-[15px] md:text-[16px] font-bold tracking-tight text-[var(--text-primary)]">
              {data.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Upload className="w-3.5 h-3.5" />}
              onClick={onOpenUploadModal}
            >
              Unggah media baru
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={onRefresh}
            >
              Muat Ulang
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Settings className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('sistem', 'pengaturan_nomor_wa')}
            >
              Pengaturan Tim
            </Button>
          </div>
        </div>
      </SolidCard>

      {/* 2. 2 KPI CARDS (`Pustaka Berkas Promosi` & `Kanal Distribusi`) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SolidCard padding="sm" className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Pustaka Berkas Promosi
            </div>
            <div className="text-[22px] font-bold text-[var(--text-primary)] tabular-nums">
              {data.activeItems.length} Berkas
            </div>
            <div className="text-[12px] text-[var(--text-secondary)]">
              {data.kpiTotalFilesSubtext}
            </div>
          </div>
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </SolidCard>

        <SolidCard padding="sm" className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Kanal Distribusi
            </div>
            <div className="text-[22px] font-bold text-[var(--status-success)]">
              {data.kpiDistributionChannelLabel}
            </div>
            <div className="text-[12px] text-[var(--text-secondary)]">
              {data.kpiDistributionSubtext}
            </div>
          </div>
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
        </SolidCard>
      </div>

      {/* 3. PRIMARY SOLID TABLE: Daftar Materi Promosi & Brosur Acuan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
            Daftar Materi Promosi & Brosur Acuan ({data.activeItems.length})
          </h3>
        </div>

        <DataTable
          caption="Daftar Materi Promosi & Brosur Acuan"
          columns={activeColumns}
          rows={data.activeItems}
          rowKey={(r) => r.id}
          fixedLayout
          compact
          emptyLabel="Belum ada materi promosi aktif. Klik 'Unggah media baru' untuk menambahkan brosur."
          mobileCardRender={(row) => {
            const isCopied = copiedHandleId === row.id;
            return (
              <div className="p-3 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--text-primary)]">
                      #{row.rowNumber} · {row.documentTitle}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] truncate">
                      {row.fileName} · {row.fileSizeLabel}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] shrink-0">
                    {row.fileType}
                  </span>
                </div>

                <div className="p-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-0.5">
                  <div className="text-[11px] font-mono text-[var(--text-primary)] truncate">
                    {row.waMediaHandle}
                  </div>
                  <div className="text-[10px] text-[var(--status-success)] font-medium">
                    {row.waHashCacheNote} · {row.updatedAtWib}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={
                      isCopied ? (
                        <Check className="w-4 h-4 text-[var(--status-success)]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )
                    }
                    onClick={() => handleCopyWaHandle(row)}
                  >
                    {isCopied ? 'Tersalin' : 'Salin Handle'}
                  </Button>
                  <Button
                    variant="destructive-outline"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => onSoftDeleteMedia(row.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* 4. WHATSAPP MEDIA HASH CACHING BLUEPRINT §3.4 CALLOUT */}
      <SolidCard
        padding="sm"
        className="border-l-4 border-l-[var(--status-success-fill)]"
      >
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[var(--status-success)] shrink-0 mt-0.5" />
          <div className="space-y-0.5 min-w-0">
            <div className="text-[12px] font-bold text-[var(--text-primary)]">
              {data.hashCachingBlueprintTitle}
            </div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {data.hashCachingBlueprintBody}
            </p>
          </div>
        </div>
      </SolidCard>

      {/* 5. SECONDARY SOLID TABLE: Terhapus (Soft-Deleted Media with "Pulihkan") */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
            Terhapus ({data.deletedItems.length})
          </h3>
          <span className="text-[11px] text-[var(--text-secondary)]">
            Berkas yang dihapus lunak dapat dipulihkan kembali ke pustaka aktif
          </span>
        </div>

        <DataTable
          caption="Tabel Materi Promosi Terhapus"
          columns={deletedColumns}
          rows={data.deletedItems}
          rowKey={(r) => r.id}
          fixedLayout
          compact
          emptyLabel="Tidak ada berkas promosi di daftar Terhapus."
          mobileCardRender={(row) => (
            <div className="p-3 space-y-2.5">
              <div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">
                  {row.documentTitle}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  {row.fileName} ({row.fileSizeLabel}) · Dihapus {row.deletedAtWib}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => onRestoreMedia(row.id)}
              >
                Pulihkan ke Pustaka Aktif
              </Button>
            </div>
          )}
        />
      </div>
    </section>
  );
};
