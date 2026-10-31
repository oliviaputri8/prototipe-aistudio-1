import React from 'react';
import {
  Store,
  Users,
  CheckCircle2,
  Crown,
  ArrowUpRight,
  ArrowRight,
  Star,
} from 'lucide-react';
import {
  BerandaDashboardDTO,
  BerandaKpiCardDTO,
  HubId,
  RegionalIslandDistributionDTO,
  SegmentId,
} from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';

export interface BerandaViewProps {
  data: BerandaDashboardDTO;
  operatorFirstName: string;
  onNavigate: (hub: HubId, segment: SegmentId) => void;
}

function renderKpiIcon(iconType: BerandaKpiCardDTO['iconType']) {
  switch (iconType) {
    case 'new-shop':
      return <Store className="w-5 h-5" />;
    case 'contacted':
      return <Users className="w-5 h-5" />;
    case 'positive-reply':
      return <CheckCircle2 className="w-5 h-5" />;
    case 'active-reseller':
      return <Crown className="w-5 h-5" />;
  }
}

function formatIdNumber(num: number): string {
  return num.toLocaleString('id-ID');
}

/**
 * Returns the bar fill class and swatch class matching the 5-step density scale
 * in the header legend (`Sedikit` 1..5 `Banyak`).
 */
function getDensityScaleClasses(level: RegionalIslandDistributionDTO['densityLevel']): {
  barClass: string;
  swatchClass: string;
} {
  switch (level) {
    case 5:
      return {
        barClass: 'bg-[var(--accent-fill)]',
        swatchClass: 'bg-[var(--accent-fill)]',
      };
    case 4:
      return {
        barClass: 'bg-[var(--accent-primary)]/80',
        swatchClass: 'bg-[var(--accent-primary)]/80',
      };
    case 3:
      return {
        barClass: 'bg-[var(--accent-primary)]/55',
        swatchClass: 'bg-[var(--accent-primary)]/55',
      };
    case 2:
      return {
        barClass: 'bg-[var(--accent-tint-strong)]',
        swatchClass: 'bg-[var(--accent-tint-strong)]',
      };
    case 1:
      return {
        barClass: 'bg-[var(--accent-tint)] border border-[var(--border-strong)]',
        swatchClass: 'bg-[var(--accent-tint)] border border-[var(--border-strong)]',
      };
  }
}

/**
 * Screen `02-beranda`: Beranda Ringkasan Harian & Sebaran Wilayah
 * Purely presentational component (no internal data fetching).
 * - Top Banner: Personalized greeting, daily queue status CTA, and Monthly Reseller Target card.
 * - 4 KPI Cards: Toko Baru Hari Ini, Total Toko Dihubungi, Respon Positif, Reseller Aktif.
 * - Regional Distribution Preview: Ranked horizontal bars per island group (name, store count,
 *   potential count, and density color from the 5-step scale).
 */
export const BerandaView: React.FC<BerandaViewProps> = ({
  data,
  operatorFirstName,
  onNavigate,
}) => {
  const maxIslandShops = Math.max(
    1,
    ...data.regionalSummary.islands.map((item) => item.totalShops)
  );

  const targetProgressPercent = Math.min(
    100,
    Math.round(
      (data.monthlyTarget.achievedCount / Math.max(1, data.monthlyTarget.targetCount)) * 100
    )
  );

  return (
    <div className="space-y-5">
      {/* ====================================================================
       * 1. MONTHLY TARGET & DAILY QUEUE BANNER
       * ==================================================================== */}
      <SolidCard
        radius="lg"
        padding="lg"
        className="relative overflow-hidden bg-[var(--surface-solid)] border border-[var(--border-strong)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Operator Greeting & Queue Action */}
          <div className="space-y-3 max-w-xl">
            <div className="hig-footnote font-semibold text-[var(--accent-primary)]">
              {data.bannerGreetingPrefix} {operatorFirstName},
            </div>
            <h2 className="hig-title text-[var(--text-primary)]">{data.bannerHeadline}</h2>
            <p className="hig-body text-[var(--text-secondary)]">{data.bannerSubtitle}</p>
            <div className="pt-1">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onNavigate(data.bannerTargetHub, data.bannerTargetSegment)}
              >
                {data.bannerCtaLabel}
              </Button>
            </div>
          </div>

          {/* Right Column: Monthly Reseller Target Card */}
          <div className="w-full lg:w-72 shrink-0 p-4 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-secondary)]">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
                  <Star className="w-3.5 h-3.5" />
                </span>
                <span>{data.monthlyTarget.label}</span>
              </div>
              <span className="hig-caption text-[var(--text-tertiary)] tabular-nums">
                {data.monthlyTarget.achievedCount}/{data.monthlyTarget.targetCount}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="hig-large-title text-[var(--text-primary)] tabular-nums">
                {data.monthlyTarget.targetCount}
              </span>
              <span className="hig-headline text-[var(--text-secondary)]">
                {data.monthlyTarget.unitLabel}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[var(--surface-solid)] overflow-hidden border border-[var(--border-hairline)]">
              <div
                className="h-full bg-[var(--accent-fill)] rounded-full hig-transition"
                style={{ width: `${targetProgressPercent}%` }}
              />
            </div>

            <div className="hig-caption text-[var(--text-secondary)] tabular-nums">
              {data.monthlyTarget.achievedPercentLabel}
            </div>
          </div>
        </div>
      </SolidCard>

      {/* ====================================================================
       * 2. 4 KPI SUMMARY CARDS
       * ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpiCards.map((card) => {
          const toneStyle =
            card.tone === 'success'
              ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
              : card.tone === 'warning'
                ? 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]'
                : 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[var(--border-hairline)]';

          return (
            <SolidCard
              key={card.id}
              padding="md"
              onClick={() => onNavigate(card.targetHub, card.targetSegment)}
              tabIndex={0}
              role="button"
              aria-label={`${card.label}: ${card.numericValue}. ${card.deltaLabel}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(card.targetHub, card.targetSegment);
                }
              }}
              className="group cursor-pointer hover:bg-[var(--surface-elevated)] active:scale-[0.99] flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 ${toneStyle}`}
                  >
                    {renderKpiIcon(card.iconType)}
                  </div>
                  <div className="min-w-0">
                    <div className="hig-footnote font-medium text-[var(--text-secondary)] truncate">
                      {card.label}
                    </div>
                    <div className="text-[28px] leading-tight font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                      {formatIdNumber(card.numericValue)}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] shrink-0 mt-1 hig-transition" />
              </div>

              <div className="hig-caption text-[var(--text-tertiary)] tabular-nums pl-14">
                {card.deltaLabel}
              </div>
            </SolidCard>
          );
        })}
      </div>

      {/* ====================================================================
       * 3. SEBARAN TOKO & POTENSI RESELLER (Ranked Horizontal Bars per Island Group)
       * ==================================================================== */}
      <SolidCard padding="lg" className="space-y-5">
        {/* Section Header + Density Scale Legend */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
          <div className="space-y-1">
            <h3 className="hig-headline text-[var(--text-primary)]">
              {data.regionalSummary.title}
            </h3>
            <p className="hig-footnote text-[var(--text-secondary)]">
              {data.regionalSummary.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            {/* 5-Step Density Scale Legend */}
            <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
              <span>{data.regionalSummary.legendLowLabel}</span>
              <div className="flex items-center gap-1" aria-hidden="true">
                <span className="w-3 h-3 rounded-[3px] bg-[var(--accent-tint)] border border-[var(--border-strong)]" />
                <span className="w-3 h-3 rounded-[3px] bg-[var(--accent-tint-strong)]" />
                <span className="w-3 h-3 rounded-[3px] bg-[var(--accent-primary)]/55" />
                <span className="w-3 h-3 rounded-[3px] bg-[var(--accent-primary)]/80" />
                <span className="w-3 h-3 rounded-[3px] bg-[var(--accent-fill)]" />
              </div>
              <span>{data.regionalSummary.legendHighLabel}</span>
              <span className="text-[var(--text-tertiary)] tabular-nums">
                {data.regionalSummary.legendRangeLabel}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('database', 'peta_toko')}
            >
              {data.regionalSummary.openMapLabel}
            </Button>
          </div>
        </div>

        {/* Ranked Horizontal Bars per Island Group */}
        <div className="space-y-3">
          {data.regionalSummary.islands.map((island, idx) => {
            const widthPct = Math.max(
              4,
              Math.round((island.totalShops / maxIslandShops) * 100)
            );
            const { barClass, swatchClass } = getDensityScaleClasses(island.densityLevel);

            return (
              <div
                key={island.id}
                className="p-4 rounded-[var(--radius-sm)] bg-[var(--surface-elevated)] border border-[var(--border-hairline)] space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Left: Rank + Density Swatch + Island Name + Provinces */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-[6px] bg-[var(--surface-recessed)] text-[var(--text-secondary)] text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                      #{idx + 1}
                    </span>
                    <span
                      className={`w-3 h-3 rounded-[3px] shrink-0 ${swatchClass}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <span className="text-[14px] font-bold text-[var(--text-primary)]">
                        {island.islandName}
                      </span>
                      <span className="hidden md:inline text-[12px] text-[var(--text-tertiary)] ml-2">
                        · {island.topProvincesSummary}
                      </span>
                    </div>
                  </div>

                  {/* Right: Store Count, Potential Count & Contacted Metrics */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] tabular-nums shrink-0">
                    <span className="font-bold text-[var(--text-primary)]">
                      {formatIdNumber(island.totalShops)} toko
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      ({formatIdNumber(island.potentialShops)} potensial)
                    </span>
                    <span className="text-[12px] px-2 py-0.5 rounded-[5px] bg-[var(--surface-recessed)] text-[var(--text-secondary)]">
                      Dihubungi: {island.contactedShops}
                    </span>
                    {island.activeResellers > 0 && (
                      <span className="text-[12px] px-2 py-0.5 rounded-[5px] bg-[var(--status-success-bg)] text-[var(--status-success)] font-semibold">
                        Reseller: {island.activeResellers}
                      </span>
                    )}
                  </div>
                </div>

                {/* Horizontal Ranked Bar using Density Scale Color */}
                <div className="w-full h-2.5 rounded-full bg-[var(--surface-recessed)] overflow-hidden">
                  <div
                    className={`h-full rounded-full hig-transition ${barClass}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SolidCard>
    </div>
  );
};
