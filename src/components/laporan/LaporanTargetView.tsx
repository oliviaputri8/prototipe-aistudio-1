import React, { useState } from 'react';
import {
  RefreshCw,
  Compass,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
  Send,
  Lock,
} from 'lucide-react';
import { HubId, LaporanTargetDTO, SegmentId } from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';

interface LaporanTargetViewProps {
  data: LaporanTargetDTO;
  onRefresh: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

export const LaporanTargetView: React.FC<LaporanTargetViewProps> = ({
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

  return (
    <section aria-label="Laporan Target & SLA Tim Sales" className="space-y-3.5">
      {/* 1. TOP ACTION BAR */}
      <SolidCard padding="sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-[15px] md:text-[16px] font-bold tracking-tight text-[var(--text-primary)]">
              {data.title}
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Monitoring pemenuhan kuota harian outreach sales dan protokol anti-banned nomor WhatsApp.
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

      {/* 2. TARGET & SLA TIM SALES (Grid of Sales Rep Progress Bars) */}
      <SolidCard padding="md" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-2.5">
          <Users className="w-4 h-4 text-[var(--accent-primary)]" />
          <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
            {data.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {data.salesReps.map((rep) => (
            <div
              key={rep.id}
              className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                  {rep.name}
                </span>
                <span className="text-[12px] font-medium text-[var(--text-secondary)] tabular-nums shrink-0">
                  {rep.currentCount}/{rep.targetCount} Pesan / Hari
                </span>
              </div>

              {/* Progress track */}
              <div
                className="w-full h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden"
                role="progressbar"
                aria-valuenow={rep.currentCount}
                aria-valuemin={0}
                aria-valuemax={rep.targetCount}
                aria-label={`Progres ${rep.name}`}
              >
                <div
                  className="h-full bg-[var(--accent-fill)] rounded-full hig-transition"
                  style={{ width: `${Math.min(100, Math.max(0, rep.percentage))}%` }}
                />
              </div>

              <div className="flex justify-end">
                <span className="text-[11px] font-semibold text-[var(--status-danger)] tabular-nums">
                  {rep.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </SolidCard>

      {/* 3. TARGET PENJANGKAUAN HARIAN (OUTREACH TARGET PANEL) */}
      <SolidCard padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[var(--border-hairline)] pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
                {data.outreachPanel.title}
              </h3>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              {data.outreachPanel.subtitle}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-[15px] font-bold text-[var(--accent-primary)] tabular-nums">
              {data.outreachPanel.currentReached} / {data.outreachPanel.targetReached} Toko
            </div>
            <div className="text-[11px] font-semibold text-[var(--text-tertiary)]">
              {data.outreachPanel.achievedPercentLabel}
            </div>
          </div>
        </div>

        {/* Global progress track */}
        <div
          className="w-full h-2.5 rounded-full bg-[var(--surface-recessed)] overflow-hidden"
          role="progressbar"
          aria-valuenow={data.outreachPanel.currentReached}
          aria-valuemin={0}
          aria-valuemax={data.outreachPanel.targetReached}
          aria-label="Progres penjangkauan harian tim"
        >
          <div
            className="h-full bg-[var(--accent-fill)] rounded-full hig-transition"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  (data.outreachPanel.currentReached / Math.max(1, data.outreachPanel.targetReached)) *
                    100
                )
              )}%`,
            }}
          />
        </div>

        {/* 4 Bottom metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="space-y-0.5">
            <div className="text-[11px] text-[var(--text-secondary)]">Kapasitas Aman</div>
            <div className="text-[13px] font-bold text-[var(--text-primary)]">
              {data.outreachPanel.safeCapacityPerNumber}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] text-[var(--text-secondary)]">Target Tim Harian</div>
            <div className="text-[13px] font-bold text-[var(--text-primary)]">
              {data.outreachPanel.teamDailyTarget}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] text-[var(--text-secondary)]">Metode Kirim</div>
            <div className="text-[13px] font-bold text-[var(--status-success)] flex items-center gap-1">
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>{data.outreachPanel.sendMethod}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] text-[var(--text-secondary)]">Status Akun WA</div>
            <div className="text-[13px] font-bold text-[var(--status-success)] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{data.outreachPanel.waSafetyStatus}</span>
            </div>
          </div>
        </div>
      </SolidCard>
    </section>
  );
};
