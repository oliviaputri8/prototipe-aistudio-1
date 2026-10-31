import React from 'react';
import {
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import {
  HubId,
  KetepatanWaktuSlaViewDTO,
  SegmentId,
  SlaOperatorMetricDTO,
} from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';

export interface KetepatanWaktuSlaViewProps {
  data: KetepatanWaktuSlaViewDTO;
  onOpenCreateDialog: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

/**
 * Segment 4: Ketepatan Waktu SLA (`07b-tindak-lanjut-sla`)
 * - Presentational component (zero internal fetch calls).
 * - SLA compliance panel (KPI summary + per-operator table + server SLA endpoint notice)
 *   and the automation rules card (`Aturan & Otomasi Ketepatan Waktu`).
 */
export const KetepatanWaktuSlaView: React.FC<KetepatanWaktuSlaViewProps> = ({
  data,
  onOpenCreateDialog,
  onNavigate,
}) => {
  const columns: DataTableColumn<SlaOperatorMetricDTO>[] = [
    {
      key: 'operator',
      header: 'Penanggung Jawab Sales',
      render: (row) => (
        <div>
          <div className="font-bold text-[14px] text-[var(--text-primary)]">{row.operatorName}</div>
          <div className="text-[12px] text-[var(--text-secondary)] tabular-nums">
            {row.waSessionLabel}
          </div>
        </div>
      ),
    },
    {
      key: 'assigned',
      header: 'Total Komitmen',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">
          {row.totalAssigned}
        </span>
      ),
    },
    {
      key: 'ontime',
      header: 'Ditepati Tepat Waktu',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[var(--status-success)] tabular-nums">
          {row.completedOnTime}
        </span>
      ),
    },
    {
      key: 'overdue',
      header: 'Lewat > 2 Jam (Warning)',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[var(--radius-xs)] text-[12px] font-bold bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)] tabular-nums">
          <span className="w-2 h-2 rounded-full bg-[var(--status-warning-fill)]" />
          <span>{row.overdueWarningCount}</span>
        </span>
      ),
    },
    {
      key: 'rate',
      header: 'Rasio Kepatuhan SLA',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] text-[12px] font-bold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] tabular-nums">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{row.onTimeRatePercent.toFixed(1)}%</span>
        </span>
      ),
    },
    {
      key: 'avg',
      header: 'Rata-Rata Waktu',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] font-medium text-[var(--text-secondary)] tabular-nums">
          {row.avgResponseMinutes} menit
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <SolidCard padding="sm" className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenCreateDialog}
          >
            Catat tindak lanjut baru
          </Button>
          <span className="hig-caption text-[var(--text-secondary)]">
            Monitoring komitmen waktu follow-up mitra reseller
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          onClick={() => onNavigate('akuisisi', 'jadwal_tindak_lanjut')}
        >
          Kembali ke Jadwal Tindak Lanjut
        </Button>
      </SolidCard>

      {/* Main SLA Compliance Panel */}
      <SolidCard padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-4">
          <div>
            <h2 className="hig-title text-[var(--text-primary)]">{data.title}</h2>
            <p className="hig-footnote text-[var(--text-secondary)] mt-0.5">{data.subtitle}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>Pemantauan SLA Aktif</span>
          </span>
        </div>

        {/* 4 SLA Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
              Kepatuhan Tepat Waktu
            </span>
            <div className="text-[24px] font-bold text-[var(--status-success)] tabular-nums">
              {data.overallOnTimePercent}%
            </div>
            <span className="hig-caption text-[var(--text-tertiary)] block">
              Target minimal SLA: 85%
            </span>
          </div>

          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
              Rata-Rata Waktu Eksekusi
            </span>
            <div className="text-[24px] font-bold text-[var(--text-primary)] tabular-nums">
              {data.avgLeadTimeLabel}
            </div>
            <span className="hig-caption text-[var(--text-tertiary)] block">
              Sebelum batas jatuh tempo
            </span>
          </div>

          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
              Eskalasi Lewat &gt; 2 Jam
            </span>
            <div className="text-[24px] font-bold text-[var(--status-warning)] tabular-nums flex items-center gap-2">
              <span>{data.warningEscalatedCount}</span>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="hig-caption text-[var(--text-tertiary)] block">
              Diteruskan ke Supervisor
            </span>
          </div>

          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1">
            <span className="text-[12px] font-semibold text-[var(--text-secondary)] block">
              Total Komitmen Bulan Ini
            </span>
            <div className="text-[24px] font-bold text-[var(--accent-primary)] tabular-nums">
              {data.activeCommitmentsCount}
            </div>
            <span className="hig-caption text-[var(--text-tertiary)] block">
              Terjadwal di sistem SDR
            </span>
          </div>
        </div>

        {/* Per-Operator SLA Breakdown Table */}
        <div className="space-y-2">
          <h3 className="hig-headline text-[var(--text-primary)]">
            Rincian Kepatuhan SLA per Sesi Sales
          </h3>
          <DataTable
            columns={columns}
            rows={data.operatorMetrics}
            rowKey={(r) => r.id}
            caption="Tabel Rincian Kepatuhan SLA per Sesi Sales"
            emptyLabel="Belum ada metrik SLA per operator."
            mobileCardRender={(row) => (
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[14px] text-[var(--text-primary)]">
                      {row.operatorName}
                    </div>
                    <div className="text-[12px] text-[var(--text-secondary)] tabular-nums">
                      {row.waSessionLabel}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[var(--radius-xs)] text-[12px] font-bold bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] tabular-nums">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{row.onTimeRatePercent.toFixed(1)}%</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-hairline)] text-[12px] tabular-nums">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Ditepati</span>
                    <strong className="text-[var(--text-primary)]">
                      {row.completedOnTime} / {row.totalAssigned}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Warning &gt;2j</span>
                    <strong className="text-[var(--status-warning)]">
                      {row.overdueWarningCount}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Rata-rata</span>
                    <strong className="text-[var(--text-primary)]">
                      {row.avgResponseMinutes} mnt
                    </strong>
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Server SLA Endpoint Info Banner */}
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] flex items-start gap-3">
          <Clock className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-[13px] font-bold text-[var(--text-primary)]">
              {data.serverMetricEndpointNoticeTitle}
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">
              {data.serverMetricEndpointNoticeBody}
            </p>
          </div>
        </div>

        {/* Automation Rules Card (`Aturan & Otomasi Ketepatan Waktu:`) */}
        <div className="p-5 rounded-[var(--radius-md)] bg-[var(--accent-tint)] border border-[var(--accent-primary)]/25 space-y-2.5">
          <div className="flex items-center gap-2 text-[14px] font-bold text-[var(--accent-primary)]">
            <Bot className="w-4 h-4 shrink-0" />
            <span>{data.automationRulesTitle}</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-[13px] font-medium text-[var(--text-primary)]">
            {data.automationRules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      </SolidCard>
    </div>
  );
};
