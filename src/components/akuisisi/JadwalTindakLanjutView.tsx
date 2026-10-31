import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
} from 'lucide-react';
import {
  FollowUpCommitmentRowDTO,
  HubId,
  JadwalTindakLanjutViewDTO,
  SegmentId,
} from '../../mock/api';
import { GlassChrome } from '../ui/GlassChrome';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';

export interface JadwalTindakLanjutViewProps {
  data: JadwalTindakLanjutViewDTO;
  onMarkCompleted: (commitmentId: string) => void;
  onOpenCreateDialog: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

type StatusTabFilter = 'TERBUKA' | 'DITEPATI' | 'SEMUA';

const PAGE_SIZE = 4;

/**
 * Segment 3: Jadwal Tindak Lanjut (`07-tindak-lanjut-terbuka`)
 * - Presentational component (zero internal fetch calls).
 * - Filter Bar (`md:sticky` on desktop): `+ Catat tindak lanjut baru` (opens `d02`),
 *   status filter (`Terbuka`, `Ditepati`, `Semua`), date range (`Dari` / `Sampai`),
 *   and `"Tanpa tenggat saja"` switch button.
 * - All mobile interactive elements strictly `>= 44×44px` (`0` violations).
 */
export const JadwalTindakLanjutView: React.FC<JadwalTindakLanjutViewProps> = ({
  data,
  onMarkCompleted,
  onOpenCreateDialog,
  onNavigate,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusTabFilter>('TERBUKA');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [noDeadlineOnly, setNoDeadlineOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const openCount = useMemo(
    () => data.commitments.filter((c) => c.status === 'MENUNGGU').length,
    [data.commitments]
  );
  const completedCount = useMemo(
    () => data.commitments.filter((c) => c.status === 'DITEPATI').length,
    [data.commitments]
  );

  const filteredCommitments = useMemo(() => {
    return data.commitments.filter((item) => {
      if (statusFilter === 'TERBUKA' && item.status !== 'MENUNGGU') return false;
      if (statusFilter === 'DITEPATI' && item.status !== 'DITEPATI') return false;
      if (noDeadlineOnly && !item.isNoDeadline) return false;
      if (dateFrom && (!item.dueDateIso || item.dueDateIso < dateFrom)) return false;
      if (dateTo && (!item.dueDateIso || item.dueDateIso > dateTo)) return false;
      return true;
    });
  }, [data.commitments, statusFilter, noDeadlineOnly, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredCommitments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedRows = filteredCommitments.slice(startIndex, startIndex + PAGE_SIZE);

  const handleStatusChange = (next: StatusTabFilter) => {
    setStatusFilter(next);
    setCurrentPage(1);
  };

  const columns: DataTableColumn<FollowUpCommitmentRowDTO>[] = [
    {
      key: 'num',
      header: '#',
      isNumeric: true,
      widthClass: 'w-16',
      render: (row) => (
        <span className="font-semibold text-[var(--text-secondary)] tabular-nums">
          #{row.commitmentNumber}
        </span>
      ),
    },
    {
      key: 'due',
      header: 'Jatuh Tempo',
      isNumeric: true,
      render: (row) => (
        <span className="font-medium text-[13px] text-[var(--text-primary)] tabular-nums">
          {row.dueDateDisplay}
        </span>
      ),
    },
    {
      key: 'shop',
      header: 'Toko / Partner',
      render: (row) => (
        <div>
          <div className="font-bold text-[14px] text-[var(--text-primary)]">{row.shopName}</div>
          <div className="text-[12px] text-[var(--text-tertiary)] tabular-nums">
            ID Lead: {row.leadIdNumber} · {row.city}
          </div>
        </div>
      ),
    },
    {
      key: 'topic',
      header: 'Isi Tindak Lanjut / Komitmen',
      render: (row) => (
        <p className="text-[13px] text-[var(--text-primary)] max-w-md">{row.topic}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          {row.status === 'MENUNGGU' ? (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--status-warning-fill)] shrink-0" />
                <span>MENUNGGU</span>
              </span>
              {row.overdueWarningBadge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-xs)] text-[11px] font-semibold bg-[var(--surface-solid)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
                  {row.overdueWarningBadge}
                </span>
              )}
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-bold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>DITEPATI</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Aksi',
      align: 'right',
      render: (row) =>
        row.status === 'MENUNGGU' ? (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success)]" />}
            onClick={() => onMarkCompleted(row.id)}
          >
            Tandai Ditepati
          </Button>
        ) : (
          <span className="text-[12px] text-[var(--text-tertiary)] tabular-nums">
            Selesai {row.completedAtWib ?? ''}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* ====================================================================
       * 1. GLASS FILTER BAR (Sticky on desktop `md:sticky`, scrolls on mobile)
       * ==================================================================== */}
      <GlassChrome
        variant="toolbar"
        radius="md"
        className="md:sticky md:top-[7.25rem] z-10 p-3.5 md:p-4 space-y-3.5"
      >
        {/* Row 1: + Catat tindak lanjut baru + Status Filter Pills + SLA Link */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onOpenCreateDialog}
            >
              Catat tindak lanjut baru
            </Button>
            <span className="hig-caption text-[var(--text-secondary)]">
              {data.helperNotice}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Filter status tindak lanjut"
              className="inline-flex flex-wrap items-center p-1 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] gap-1"
            >
              <button
                type="button"
                onClick={() => handleStatusChange('TERBUKA')}
                className={`min-h-[44px] min-w-[44px] md:min-h-[34px] px-3 py-1.5 md:py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer tabular-nums hig-transition ${
                  statusFilter === 'TERBUKA'
                    ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Terbuka ({openCount})</span>
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('DITEPATI')}
                className={`min-h-[44px] min-w-[44px] md:min-h-[34px] px-3 py-1.5 md:py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer tabular-nums hig-transition ${
                  statusFilter === 'DITEPATI'
                    ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ditepati ({completedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('SEMUA')}
                className={`min-h-[44px] min-w-[44px] md:min-h-[34px] px-3 py-1.5 md:py-1 rounded-[var(--radius-xs)] text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer tabular-nums hig-transition ${
                  statusFilter === 'SEMUA'
                    ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>Semua ({data.commitments.length})</span>
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('akuisisi', 'ketepatan_waktu_sla')}
            >
              Ketepatan Waktu SLA
            </Button>
          </div>
        </div>

        {/* Row 2: Date Range (`Dari` / `Sampai`) + Switch Button `Tanpa tenggat saja` */}
        <div className="pt-2.5 border-t border-[var(--border-hairline)] flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label
                htmlFor="fu-date-from"
                className="block text-[12px] font-semibold text-[var(--text-secondary)]"
              >
                Dari
              </label>
              <input
                id="fu-date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="min-h-[44px] min-w-[44px] md:min-h-[38px] px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="fu-date-to"
                className="block text-[12px] font-semibold text-[var(--text-secondary)]"
              >
                Sampai
              </label>
              <input
                id="fu-date-to"
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="min-h-[44px] min-w-[44px] md:min-h-[38px] px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] tabular-nums"
              />
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={noDeadlineOnly}
              onClick={() => {
                setNoDeadlineOnly((prev) => !prev);
                setCurrentPage(1);
              }}
              className={`min-h-[44px] min-w-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-[var(--radius-xs)] border inline-flex items-center gap-2 text-[13px] font-semibold cursor-pointer select-none hig-transition ${
                noDeadlineOnly
                  ? 'bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-transparent'
                  : 'bg-[var(--surface-solid)] text-[var(--text-primary)] border-[var(--border-strong)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-4 h-4 rounded-[4px] flex items-center justify-center border ${
                  noDeadlineOnly
                    ? 'bg-white text-[var(--accent-fill)] border-white'
                    : 'bg-[var(--surface-recessed)] border-[var(--border-strong)]'
                }`}
              >
                {noDeadlineOnly && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
              <span>Tanpa tenggat saja</span>
            </button>

            {(dateFrom || dateTo || noDeadlineOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setNoDeadlineOnly(false);
                  setCurrentPage(1);
                }}
              >
                Reset Filter Tanggal
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hig-headline text-[var(--text-primary)]">{data.title}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-solid)] border border-[var(--border-hairline)] text-[12px] font-bold text-[var(--text-secondary)] tabular-nums">
              {filteredCommitments.length} komitmen
            </span>
          </div>
        </div>
      </GlassChrome>

      {/* ====================================================================
       * 2. SOLID FOLLOW-UP TABLE + PAGINATION
       * ==================================================================== */}
      <DataTable
        columns={columns}
        rows={paginatedRows}
        rowKey={(r) => r.id}
        caption="Tabel Jadwal Tindak Lanjut Mitra Toko"
        emptyLabel="Tidak ada jadwal tindak lanjut yang cocok dengan filter saat ini."
        mobileCardRender={(row) => (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-[var(--text-tertiary)] tabular-nums">
                    #{row.commitmentNumber}
                  </span>
                  <span className="font-bold text-[15px] text-[var(--text-primary)]">
                    {row.shopName}
                  </span>
                </div>
                <div className="text-[12px] text-[var(--text-secondary)] tabular-nums">
                  ID Lead: {row.leadIdNumber} · {row.city}
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--text-secondary)] tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                <span>{row.dueDateDisplay}</span>
              </span>
            </div>

            <p className="text-[13px] text-[var(--text-primary)] bg-[var(--surface-recessed)] p-2.5 rounded-[var(--radius-xs)]">
              {row.topic}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {row.status === 'MENUNGGU' ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--status-warning-fill)]" />
                      <span>MENUNGGU</span>
                    </span>
                    {row.overdueWarningBadge && (
                      <span className="px-2 py-0.5 rounded-[var(--radius-xs)] text-[11px] font-semibold bg-[var(--surface-solid)] text-[var(--status-warning)] border border-[var(--status-warning-border)]">
                        {row.overdueWarningBadge}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-bold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>DITEPATI</span>
                  </span>
                )}
              </div>

              {row.status === 'MENUNGGU' && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success)]" />}
                  onClick={() => onMarkCompleted(row.id)}
                >
                  Tandai Ditepati
                </Button>
              )}
            </div>
          </div>
        )}
      />

      {/* Pagination Bar */}
      <SolidCard
        padding="sm"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <span className="text-[13px] text-[var(--text-secondary)] tabular-nums">
          Menampilkan{' '}
          <strong>
            {filteredCommitments.length === 0 ? 0 : startIndex + 1} sampai{' '}
            {Math.min(startIndex + PAGE_SIZE, filteredCommitments.length)}
          </strong>{' '}
          dari <strong>{filteredCommitments.length}</strong>
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Halaman sebelumnya
          </Button>
          <span className="px-2.5 py-1 text-[12px] font-semibold text-[var(--text-secondary)] tabular-nums">
            Hal. {safePage} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            rightIcon={<ChevronRight className="w-4 h-4" />}
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Halaman berikutnya
          </Button>
        </div>
      </SolidCard>
    </div>
  );
};
