import React, { useState } from 'react';
import {
  RefreshCw,
  Compass,
  Tag,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart,
  Percent,
} from 'lucide-react';
import {
  HubId,
  LaporanSapaanDTO,
  SapaanHourPerformanceDTO,
  SapaanPeriodDays,
  SapaanTemplatePerformanceDTO,
  SapaanTierPerformanceDTO,
  SegmentId,
} from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';

interface LaporanSapaanViewProps {
  data: LaporanSapaanDTO;
  onSelectPeriod: (period: SapaanPeriodDays) => void;
  onRefresh: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

export const LaporanSapaanView: React.FC<LaporanSapaanViewProps> = ({
  data,
  onSelectPeriod,
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

  // 1. Columns for Performa per Tier Toko (widths sum to 100%)
  const tierColumns: DataTableColumn<SapaanTierPerformanceDTO>[] = [
    {
      key: 'tier',
      header: 'Tier Toko',
      widthClass: 'w-[32%]',
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--text-primary)]">
          {row.tier}
        </span>
      ),
    },
    {
      key: 'disapa',
      header: 'Disapa',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-secondary)] tabular-nums">
          {row.disapa.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'membalas',
      header: 'Membalas',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-primary)] font-medium tabular-nums">
          {row.membalas.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'pamit',
      header: 'Pamit',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-tertiary)] tabular-nums">
          {row.pamit.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'angka_balas',
      header: 'Angka Balas',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-bold text-[13px] text-[var(--status-success)] tabular-nums">
          {row.angkaBalas}
        </span>
      ),
    },
  ];

  // 2. Columns for Performa per Template Sapaan (widths sum to 100%)
  const templateColumns: DataTableColumn<SapaanTemplatePerformanceDTO>[] = [
    {
      key: 'template',
      header: 'ID Template & Judul Naskah',
      widthClass: 'w-[36%]',
      render: (row) => (
        <div className="min-w-0">
          <span className="inline-block px-1.5 py-0.2 rounded-[4px] bg-[var(--surface-recessed)] text-[10px] font-mono text-[var(--text-tertiary)] mr-1.5">
            {row.templateId}
          </span>
          <span className="font-semibold text-[13px] text-[var(--text-primary)]">
            {row.templateName}
          </span>
        </div>
      ),
    },
    {
      key: 'disapa',
      header: 'Disapa',
      widthClass: 'w-[16%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-secondary)] tabular-nums">
          {row.disapa.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'membalas',
      header: 'Membalas',
      widthClass: 'w-[16%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-primary)] font-medium tabular-nums">
          {row.membalas.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'pamit',
      header: 'Pamit',
      widthClass: 'w-[16%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-tertiary)] tabular-nums">
          {row.pamit.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'angka_balas',
      header: 'Angka Balas',
      widthClass: 'w-[16%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-bold text-[13px] text-[var(--status-success)] tabular-nums">
          {row.angkaBalas}
        </span>
      ),
    },
  ];

  // 3. Columns for Performa per Jam Komitmen (WIB) (widths sum to 100%)
  const hourColumns: DataTableColumn<SapaanHourPerformanceDTO>[] = [
    {
      key: 'jam',
      header: 'Rentang Jam (WIB)',
      widthClass: 'w-[32%]',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" />
          <span className="font-semibold text-[13px] text-[var(--text-primary)]">
            {row.hourRangeWib}
          </span>
        </div>
      ),
    },
    {
      key: 'disapa',
      header: 'Disapa',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-secondary)] tabular-nums">
          {row.disapa.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'membalas',
      header: 'Membalas',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-primary)] font-medium tabular-nums">
          {row.membalas.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'pamit',
      header: 'Pamit',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-tertiary)] tabular-nums">
          {row.pamit.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'angka_balas',
      header: 'Angka Balas',
      widthClass: 'w-[17%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-bold text-[13px] text-[var(--status-success)] tabular-nums">
          {row.angkaBalas}
        </span>
      ),
    },
  ];

  const periodOptions: SapaanPeriodDays[] = [7, 30, 90];

  return (
    <section aria-label="Laporan Sapaan" className="space-y-3.5">
      {/* 1. TOP ACTION BAR */}
      <SolidCard padding="sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-[15px] md:text-[16px] font-bold tracking-tight text-[var(--text-primary)]">
              {data.title}
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {data.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Period selector buttons with min-h-[44px] on mobile */}
            <div className="inline-flex rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] p-1 border border-[var(--border-hairline)]">
              {periodOptions.map((p) => {
                const active = data.activePeriod === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onSelectPeriod(p)}
                    className={`min-h-[44px] sm:min-h-[28px] px-3 rounded-[var(--radius-xs)] text-[12px] font-semibold cursor-pointer hig-transition hig-focus ${
                      active
                        ? 'bg-[var(--surface-solid)] text-[var(--accent-primary)] shadow-2xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {p} Hari
                  </button>
                );
              })}
            </div>

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

      {/* 2. 4 KPI CARDS (Screenshot 11c-laporan-sapaan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Toko Disapa */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Toko Disapa
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] text-[var(--accent-primary)] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
              {data.kpis.tokoDisapa.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.kpis.tokoDisapaSubtext}
            </div>
          </div>
        </SolidCard>

        {/* KPI 2: Toko Membalas */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Toko Membalas
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
              {data.kpis.tokoMembalas.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.kpis.tokoMembalasSubtext}
            </div>
          </div>
        </SolidCard>

        {/* KPI 3: Pamit / Menolak */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Pamit / Menolak
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] text-[var(--text-tertiary)] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight tabular-nums">
              {data.kpis.pamitMenolak.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.kpis.pamitMenolakSubtext}
            </div>
          </div>
        </SolidCard>

        {/* KPI 4: Angka Balas */}
        <SolidCard padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Angka Balas
            </span>
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold text-[var(--status-success)] tracking-tight tabular-nums">
              {data.kpis.angkaBalasLabel}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {data.kpis.angkaBalasSubtext}
            </div>
          </div>
        </SolidCard>
      </div>

      {/* 3. PLAIN SVG/CSS TEXT-ALTERNATIVE CHART (No chart libraries) */}
      <SolidCard padding="md" className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-2.5">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              {data.chartSummary.title}
            </h3>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {data.chartSummary.subtitle}
          </span>
        </div>

        {/* Accessible SVG Visualization with text labels */}
        <div className="space-y-2.5 py-1" role="img" aria-label={`Grafik distribusi respon: ${data.chartSummary.bars.map((b) => `${b.label} ${b.percentage}% (${b.count} toko)`).join(', ')}`}>
          {data.chartSummary.bars.map((bar, idx) => (
            <div key={bar.label} className="space-y-1">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[var(--text-primary)]">
                  {bar.label}
                </span>
                <span className="font-mono text-[var(--text-secondary)] tabular-nums">
                  {bar.count} toko ({bar.percentage}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--surface-recessed)] overflow-hidden">
                <div
                  className={`h-full rounded-full hig-transition ${
                    idx === 0
                      ? 'bg-[var(--status-success-fill)]'
                      : idx === 1
                        ? 'bg-[var(--accent-fill)]'
                        : 'bg-[var(--surface-elevated)]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, bar.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SolidCard>

      {/* 4. THREE SOLID TABLES (Tier, Template, Jam WIB) */}
      <div className="space-y-4">
        {/* Table A: Performa per Tier Toko */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Performa per Tier Toko
            </h3>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Model Skoring m1-overture
            </span>
          </div>
          <DataTable
            caption="Tabel Performa per Tier Toko"
            columns={tierColumns}
            rows={data.tierTable}
            rowKey={(r) => r.id}
            fixedLayout
            compact
            emptyLabel="Belum ada data tier."
            mobileCardRender={(row) => (
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[var(--text-primary)]">{row.tier}</span>
                  <span className="font-bold text-[13px] text-[var(--status-success)] tabular-nums">{row.angkaBalas}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[12px] p-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] tabular-nums">
                  <div>Disapa: <span className="font-semibold">{row.disapa}</span></div>
                  <div>Balas: <span className="font-semibold">{row.membalas}</span></div>
                  <div>Pamit: <span className="font-semibold">{row.pamit}</span></div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Table B: Performa per Template Sapaan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Performa per Template Sapaan
            </h3>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Variasi Naskah Spintax
            </span>
          </div>
          <DataTable
            caption="Tabel Performa per Template Sapaan"
            columns={templateColumns}
            rows={data.templateTable}
            rowKey={(r) => r.id}
            fixedLayout
            compact
            emptyLabel="Belum ada data template sapaan."
            mobileCardRender={(row) => (
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[var(--text-primary)]">{row.templateName}</span>
                  <span className="font-bold text-[13px] text-[var(--status-success)] tabular-nums">{row.angkaBalas}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[12px] p-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] tabular-nums">
                  <div>Disapa: <span className="font-semibold">{row.disapa}</span></div>
                  <div>Balas: <span className="font-semibold">{row.membalas}</span></div>
                  <div>Pamit: <span className="font-semibold">{row.pamit}</span></div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Table C: Performa per Jam Komitmen (WIB) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Performa per Jam Komitmen (WIB)
            </h3>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Waktu Kirim Sapaan
            </span>
          </div>
          <DataTable
            caption="Tabel Performa per Jam Komitmen"
            columns={hourColumns}
            rows={data.hourTable}
            rowKey={(r) => r.id}
            fixedLayout
            compact
            emptyLabel="Belum ada data jam kirim."
            mobileCardRender={(row) => (
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[var(--text-primary)]">{row.hourRangeWib}</span>
                  <span className="font-bold text-[13px] text-[var(--status-success)] tabular-nums">{row.angkaBalas}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[12px] p-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] tabular-nums">
                  <div>Disapa: <span className="font-semibold">{row.disapa}</span></div>
                  <div>Balas: <span className="font-semibold">{row.membalas}</span></div>
                  <div>Pamit: <span className="font-semibold">{row.pamit}</span></div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
};
