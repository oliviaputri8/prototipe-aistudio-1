import React, { useState } from 'react';
import {
  RefreshCw,
  ArrowRight,
  Database,
  Bot,
  Ticket,
  TrendingUp,
  Warehouse,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Compass,
} from 'lucide-react';
import { HubId, LaporanPeriodeDTO, ReplyRateTierRowDTO, SegmentId } from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';

interface LaporanPeriodeViewProps {
  data: LaporanPeriodeDTO;
  onRefresh: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

export const LaporanPeriodeView: React.FC<LaporanPeriodeViewProps> = ({
  data,
  onRefresh,
  onNavigate,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      onRefresh();
      setIsRefreshing(false);
    }, 280);
  };

  // Reply Rate Table columns summing strictly to 100% with fixedLayout={true}
  const columns: DataTableColumn<ReplyRateTierRowDTO>[] = [
    {
      key: 'tier',
      header: 'Tier',
      widthClass: 'w-[14%]',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[5px] text-[11px] font-bold ${
            row.tier === 'Tier A'
              ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)]'
              : row.tier === 'Tier B'
                ? 'bg-[var(--surface-recessed)] text-[var(--text-primary)] border border-[var(--border-hairline)]'
                : row.tier === 'Tier C'
                  ? 'bg-[var(--status-warning-bg)] text-[var(--status-warning)]'
                  : 'bg-[var(--status-danger-bg)] text-[var(--status-danger)]'
          }`}
        >
          {row.tier}
        </span>
      ),
    },
    {
      key: 'total_toko',
      header: 'Total Toko',
      widthClass: 'w-[16%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--text-primary)] tabular-nums">
          {row.totalToko.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'toko_disapa',
      header: 'Toko Disapa',
      widthClass: 'w-[15%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-secondary)] tabular-nums">
          {row.tokoDisapa.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'toko_membalas',
      header: 'Toko Membalas',
      widthClass: 'w-[15%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-secondary)] tabular-nums">
          {row.tokoMembalas.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'reply_rate',
      header: 'Reply Rate',
      widthClass: 'w-[14%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span
          className={`font-semibold text-[13px] tabular-nums ${
            row.replyRateLabel !== '—'
              ? 'text-[var(--status-success)]'
              : 'text-[var(--text-tertiary)]'
          }`}
        >
          {row.replyRateLabel}
        </span>
      ),
    },
    {
      key: 'status_validitas',
      header: 'Status Validitas Data',
      widthClass: 'w-[26%]',
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-tight whitespace-normal break-words ${
            row.isValidSample
              ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]'
              : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]'
          }`}
        >
          {row.isValidSample ? (
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{row.validityBadgeText}</span>
        </span>
      ),
    },
  ];

  return (
    <section aria-label="Laporan Periode" className="space-y-3.5">
      {/* 1. TOP ACTION BAR */}
      <SolidCard padding="sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-[15px] md:text-[16px] font-bold tracking-tight text-[var(--text-primary)]">
              Laporan Operasional & Kinerja SDR
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Pemantauan bank data reseller, konversi sapaan awal, dan status perputaran stok konsinyasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefreshClick}
            >
              {isRefreshing ? 'Menyegarkan...' : 'Refresh Metrik'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Compass className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('akuisisi', 'antrean_handover_erp')}
            >
              Antrean Handover ERP
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Tag className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('katalog', 'katalog_harga')}
            >
              Katalog Harga Acuan
            </Button>
          </div>
        </div>
      </SolidCard>

      {/* 2. FOUR KPI CARDS (Screenshot 11-laporan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Bank Data Counter */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Bank Data Counter
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
              {data.bankDataCounter.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.bankDataSubtext}
            </div>
          </div>
        </SolidCard>

        {/* KPI 2: AI Opt-In */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              AI Opt-In (Balasan Sah)
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] text-[var(--accent-primary)] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
              {data.aiOptInToko} toko
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.aiOptInSubtext}
            </div>
          </div>
        </SolidCard>

        {/* KPI 3: Tiket Stok Pending */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Tiket Stok Pending
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--status-warning-bg)] text-[var(--status-warning)] flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
              {data.pendingStockTickets} tiket
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.pendingStockSubtext}
            </div>
          </div>
        </SolidCard>

        {/* KPI 4: Total Omzet B2B */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Total Omzet B2B
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
              {data.b2bRevenueFormatted}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.b2bRevenueSubtext}
            </div>
          </div>
        </SolidCard>
      </div>

      {/* 3. RINGKASAN DISTRIBUSI STOK FISIK & KONSINYASI */}
      <SolidCard padding="md" className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-2.5">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              {data.stockDistribution.title}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
            {data.stockDistribution.locationLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
            <div className="text-[11px] font-medium text-[var(--text-secondary)]">
              Ready Etalase Rumah
            </div>
            <div className="text-[20px] font-bold text-[var(--text-primary)] tabular-nums">
              {data.stockDistribution.readyShowcaseUnits} Unit
            </div>
            <div className="text-[11px] text-[var(--text-tertiary)]">
              {data.stockDistribution.readyShowcaseSubtext}
            </div>
          </div>

          <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
            <div className="text-[11px] font-medium text-[var(--text-secondary)]">
              Dititip Konsinyasi di Mitra
            </div>
            <div className="text-[20px] font-bold text-[var(--text-primary)] tabular-nums">
              {data.stockDistribution.consignedUnits} Unit
            </div>
            <div className="text-[11px] text-[var(--text-tertiary)]">
              {data.stockDistribution.consignedSubtext}
            </div>
          </div>

          <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
            <div className="text-[11px] font-medium text-[var(--text-secondary)]">
              Terjual & Disetor
            </div>
            <div className="text-[20px] font-bold text-[var(--text-primary)] tabular-nums">
              {data.stockDistribution.soldAndRemittedUnits} Unit
            </div>
            <div className="text-[11px] text-[var(--text-tertiary)]">
              {data.stockDistribution.soldAndRemittedSubtext}
            </div>
          </div>
        </div>
      </SolidCard>

      {/* 4. SOLID TABLE: Tingkat Balasan Berdasarkan Kualitas Toko (Reply Rate per Tier) */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-0.5">
          <div>
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              {data.replyRateTable.title}
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {data.replyRateTable.subtitle}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[5px] text-[11px] font-semibold bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[var(--text-secondary)] shrink-0 self-start sm:self-auto">
            {data.replyRateTable.thresholdBadgeText}
          </span>
        </div>

        <DataTable
          caption="Tingkat Balasan Berdasarkan Kualitas Toko"
          columns={columns}
          rows={data.replyRateTable.rows}
          rowKey={(r) => r.id}
          fixedLayout
          compact
          emptyLabel="Belum ada data evaluasi reply rate per tier."
          mobileCardRender={(row) => (
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded-[5px] text-[11px] font-bold ${
                    row.tier === 'Tier A'
                      ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)]'
                      : row.tier === 'Tier B'
                        ? 'bg-[var(--surface-recessed)] text-[var(--text-primary)]'
                        : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)]'
                  }`}
                >
                  {row.tier}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    row.isValidSample
                      ? 'bg-[var(--status-success-bg)] text-[var(--status-success)]'
                      : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)]'
                  }`}
                >
                  {row.validityBadgeText}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px] p-2.5 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)]">
                <div>
                  <span className="text-[var(--text-secondary)]">Total Toko: </span>
                  <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                    {row.totalToko.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Disapa: </span>
                  <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                    {row.tokoDisapa.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Membalas: </span>
                  <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                    {row.tokoMembalas.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Reply Rate: </span>
                  <span className="font-bold text-[var(--status-success)] tabular-nums">
                    {row.replyRateLabel}
                  </span>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
};
