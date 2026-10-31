import React, { useMemo, useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Rocket,
  ArrowRight,
  Building2,
  Award,
  CheckCircle2,
  Users,
  Layers,
} from 'lucide-react';
import { ProvinceDistributionItemDTO } from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';

export interface PetaProvinsiViewProps {
  provinces: ProvinceDistributionItemDTO[];
  onFilterShopsByRegion: (regionQuery: string) => void;
  externalTransitionTrigger?: number;
}

const ISLAND_FILTER_OPTIONS = [
  'Semua Kepulauan (38 Provinsi)',
  'Jawa',
  'Sumatera',
  'Kalimantan',
  'Sulawesi',
  'Bali & Nusa Tenggara',
  'Maluku & Papua',
] as const;

function getDensityTileClasses(level: 1 | 2 | 3 | 4 | 5, isSelected: boolean): string {
  const ringClass = isSelected
    ? 'ring-2 ring-offset-2 ring-[var(--accent-primary)] shadow-sm scale-[1.02]'
    : '';
  switch (level) {
    case 5:
      return `bg-[var(--accent-fill)] text-[var(--accent-on-fill)] border-[var(--accent-fill)] ${ringClass}`;
    case 4:
      return `bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)] ${ringClass}`;
    case 3:
      return `bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[var(--accent-primary)]/35 ${ringClass}`;
    case 2:
      return `bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)] ${ringClass}`;
    case 1:
    default:
      return `bg-[var(--surface-recessed)] text-[var(--text-primary)] border-[var(--border-strong)] ${ringClass}`;
  }
}

/**
 * Stage 3a Segment 4: Peta Provinsi (`10-peta-toko` & `10b-peta-provinsi`)
 * - Built WITHOUT any external map library (`maplibre-gl` is NOT used).
 * - Pairs an interactive SVG/CSS Abstract Tile-Grid Map of Indonesia (38 provinces arranged
 *   geographically from Aceh in the West to Papua Pegunungan in the East) with a searchable
 *   ranked list of all 38 provinces with horizontal density bars (`4 - 4.628 toko`).
 * - Includes the `10b-peta-provinsi` rocket transition state when selecting a province.
 */
export const PetaProvinsiView: React.FC<PetaProvinsiViewProps> = ({
  provinces,
  onFilterShopsByRegion,
  externalTransitionTrigger = 0,
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
    provinces[0]?.id ?? 'prov-jatim'
  );
  const [islandFilter, setIslandFilter] = useState<string>('Semua Kepulauan (38 Provinsi)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [transitioningProvinceName, setTransitioningProvinceName] = useState<string | null>(
    null
  );

  const selectedProvince = useMemo(
    () => provinces.find((p) => p.id === selectedProvinceId) ?? provinces[0],
    [provinces, selectedProvinceId]
  );

  const maxShopsCount = useMemo(
    () => Math.max(1, ...provinces.map((p) => p.totalShops)),
    [provinces]
  );

  const totalNationalShops = useMemo(
    () => provinces.reduce((acc, p) => acc + p.totalShops, 0),
    [provinces]
  );

  // Trigger the `10b-peta-provinsi` transition state briefly when selecting a province
  const handleSelectProvince = (prov: ProvinceDistributionItemDTO, holdDurationMs = 380) => {
    setTransitioningProvinceName(prov.provinceName);
    setSelectedProvinceId(prov.id);
    window.setTimeout(() => {
      setTransitioningProvinceName((curr) =>
        curr === prov.provinceName ? null : curr
      );
    }, holdDurationMs);
  };

  // Allow PrototypeDevToolbar to trigger the 10b transition banner without polluting production UI
  useEffect(() => {
    if (externalTransitionTrigger > 0 && selectedProvince) {
      handleSelectProvince(selectedProvince, 1200);
    }
  }, [externalTransitionTrigger]);

  // Filtered & sorted ranked list of 38 provinces
  const rankedProvinces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...provinces]
      .filter((p) => {
        if (
          islandFilter !== 'Semua Kepulauan (38 Provinsi)' &&
          p.islandGroup !== islandFilter
        ) {
          return false;
        }
        if (!q) return true;
        return (
          p.provinceName.toLowerCase().includes(q) ||
          p.provinceCode.toLowerCase().includes(q) ||
          p.cities.some((c) => c.cityName.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.totalShops - a.totalShops);
  }, [provinces, islandFilter, searchQuery]);

  // Build 6-row x 12-col lookup for the abstract Indonesia archipelago tile grid
  const tileGridMatrix = useMemo(() => {
    const map = new Map<string, ProvinceDistributionItemDTO>();
    provinces.forEach((p) => {
      map.set(`${p.gridRow}-${p.gridCol}`, p);
    });
    return map;
  }, [provinces]);

  if (!selectedProvince) return null;

  return (
    <div className="space-y-4">
      {/* ====================================================================
       * 1. HEADER & DENSITY LEGEND (`Sedikit` -> `Banyak`, `4 - 4.628 toko`)
       * ==================================================================== */}
      <SolidCard padding="sm" className="border border-[var(--border-hairline)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                Sebaran Geografis 38 Provinsi
              </span>
              <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[var(--surface-recessed)] text-[var(--text-primary)] tabular-nums">
                {totalNationalShops.toLocaleString('id-ID')} toko terpetakan
              </span>
            </div>
            <h2 className="text-[16px] md:text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
              Peta Sebaran Toko HP per Provinsi
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Pilih ubin provinsi pada peta kepulauan atau daftar peringkat untuk melihat rincian Kabupaten/Kota.
            </p>
          </div>

          {/* Density Legend */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] flex items-center gap-2 text-[11px]"
              aria-label="Skala Kepadatan Toko per Provinsi"
            >
              <span className="font-semibold text-[var(--text-secondary)]">Sedikit (4)</span>
              <div className="flex items-center gap-1" aria-hidden="true">
                <span className="w-4 h-3 rounded-[3px] bg-[var(--surface-solid)] border border-[var(--border-strong)]" />
                <span className="w-4 h-3 rounded-[3px] bg-[var(--status-warning-bg)] border border-[var(--status-warning-border)]" />
                <span className="w-4 h-3 rounded-[3px] bg-[var(--accent-tint)] border border-[var(--accent-primary)]/40" />
                <span className="w-4 h-3 rounded-[3px] bg-[var(--status-success-bg)] border border-[var(--status-success-border)]" />
                <span className="w-4 h-3 rounded-[3px] bg-[var(--accent-fill)]" />
              </div>
              <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                Banyak ({maxShopsCount.toLocaleString('id-ID')})
              </span>
            </div>
          </div>
        </div>
      </SolidCard>

      {/* ====================================================================
       * 2. ABSTRACT ARCHIPELAGO TILE-GRID MAP + SELECTED PROVINCE DRILL-DOWN
       * ==================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT 7 COLS: Abstract Tile-Grid Map of Indonesia (38 Provinces) */}
        <SolidCard
          padding="md"
          className="xl:col-span-7 border border-[var(--border-hairline)] space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-[14px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Peta Ubin Kepulauan Indonesia (38 Provinsi)</span>
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Susunan geografis Barat (Aceh) ke Timur (Papua Pegunungan) · Klik provinsi untuk rincian kota
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[var(--accent-primary)] bg-[var(--accent-tint)] px-2.5 py-1 rounded-[6px]">
              Aktif: {selectedProvince.provinceName} ({selectedProvince.totalShops.toLocaleString('id-ID')} toko)
            </span>
          </div>

          {/* 10b-peta-provinsi Rocket Transition Overlay Banner */}
          {transitioningProvinceName && (
            <div
              role="status"
              aria-live="polite"
              className="p-3 rounded-[var(--radius-sm)] bg-[var(--accent-tint)] border border-[var(--accent-primary)]/30 flex items-center justify-between gap-3 animate-pulse"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-fill)] text-[var(--accent-on-fill)] flex items-center justify-center shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[var(--text-primary)]">
                    Menuju Provinsi {transitioningProvinceName}...
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    Memuat batas wilayah dan agregasi toko counter Kabupaten/Kota
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                Memuat Peta
              </span>
            </div>
          )}

          {/* Scrollable container on narrow mobile so all 38 tiles remain >=44x44px */}
          <div className="overflow-x-auto pb-1">
            <div
              role="grid"
              aria-label="Peta Grid 38 Provinsi Indonesia"
              className="min-w-[600px] p-3 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)]/60 border border-[var(--border-hairline)] grid grid-cols-12 gap-1.5"
            >
              {Array.from({ length: 6 }).map((_, rIdx) =>
                Array.from({ length: 12 }).map((__, cIdx) => {
                  const prov = tileGridMatrix.get(`${rIdx}-${cIdx}`);
                  if (!prov) {
                    return (
                      <div
                        key={`empty-${rIdx}-${cIdx}`}
                        aria-hidden="true"
                        className="min-h-[44px] min-w-[44px] rounded-[6px] border border-dashed border-[var(--border-hairline)]/40 opacity-35"
                      />
                    );
                  }
                  const isSelected = prov.id === selectedProvince.id;
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleSelectProvince(prov)}
                      title={`${prov.provinceName}: ${prov.totalShops.toLocaleString('id-ID')} toko (${prov.tierACount} Tier A)`}
                      aria-label={`Pilih provinsi ${prov.provinceName}, ${prov.totalShops} toko`}
                      aria-pressed={isSelected}
                      className={`min-h-[44px] min-w-[44px] p-1 rounded-[6px] border flex flex-col items-center justify-center text-center cursor-pointer select-none hig-transition hig-focus ${getDensityTileClasses(
                        prov.densityLevel,
                        isSelected
                      )}`}
                    >
                      <span className="text-[10px] font-extrabold leading-tight tracking-tight truncate max-w-full">
                        {prov.provinceCode}
                      </span>
                      <span className="text-[10px] font-semibold leading-tight tabular-nums opacity-95">
                        {prov.totalShops.toLocaleString('id-ID')}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Regional Island Summary Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[var(--text-secondary)]">
            <span>
              Barat: <strong>Sumatera & Jawa</strong>
            </span>
            <span>
              Tengah: <strong>Kalimantan, Sulawesi, Bali & Nusa Tenggara</strong>
            </span>
            <span>
              Timur: <strong>Maluku & Tanah Papua</strong>
            </span>
          </div>
        </SolidCard>

        {/* RIGHT 5 COLS: Selected Province Drill-Down Card (Stats + Kabupaten/Kota Breakdown) */}
        <SolidCard
          padding="md"
          className="xl:col-span-5 border border-[var(--border-hairline)] space-y-3.5"
        >
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[var(--border-hairline)]">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                  {selectedProvince.islandGroup}
                </span>
                <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">
                  Kode: {selectedProvince.provinceCode}
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-[var(--text-primary)] mt-1">
                Provinsi {selectedProvince.provinceName}
              </h3>
            </div>

            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => onFilterShopsByRegion(selectedProvince.provinceName)}
            >
              Filter Semua Toko
            </Button>
          </div>

          {/* 4 Province KPI Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
                <Building2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Total Toko HP</span>
              </div>
              <div className="text-[16px] font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                {selectedProvince.totalShops.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
                <Award className="w-3.5 h-3.5 text-[var(--status-warning)]" />
                <span>Prioritas Tier A</span>
              </div>
              <div className="text-[16px] font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                {selectedProvince.tierACount.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success)]" />
                <span>Sudah Disapa</span>
              </div>
              <div className="text-[16px] font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                {selectedProvince.contactedCount.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
                <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Reseller Aktif</span>
              </div>
              <div className="text-[16px] font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                {selectedProvince.activeResellerCount.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Drill-down list of Kabupaten / Kota */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--text-secondary)]">
              <span>Rincian Kabupaten / Kota ({selectedProvince.cities.length} wilayah utama)</span>
              <span>Klik kota untuk filter tabel</span>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
              {selectedProvince.cities.map((city) => (
                <div
                  key={city.cityName}
                  className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)] border border-[var(--border-hairline)] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                      <span className="truncate">{city.cityName}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] tabular-nums mt-0.5">
                      <strong>{city.shopCount.toLocaleString('id-ID')}</strong> toko ·{' '}
                      <span className="text-[var(--accent-primary)] font-semibold">
                        {city.tierACount} Tier A
                      </span>
                      {city.activeResellerCount > 0 && (
                        <span className="ml-1.5 text-[var(--status-success)] font-semibold">
                          · {city.activeResellerCount} Reseller Aktif
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onFilterShopsByRegion(city.cityName)}
                  >
                    Lihat Toko
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </SolidCard>
      </div>

      {/* ====================================================================
       * 3. RANKED LIST OF ALL 38 INDONESIAN PROVINCES WITH DENSITY BARS
       * ==================================================================== */}
      <SolidCard padding="md" className="border border-[var(--border-hairline)] space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
              Peringkat Sebaran Seluruh 38 Provinsi Indonesia
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Diurutkan berdasarkan populasi toko counter tertinggi (Jawa Timur 4.628 toko hingga Papua Pegunungan 4 toko)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari provinsi atau kota..."
                className="w-full sm:w-56 min-h-[44px] md:min-h-[38px] pl-9 pr-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
              />
            </div>

            <select
              aria-label="Filter Gugus Kepulauan"
              value={islandFilter}
              onChange={(e) => setIslandFilter(e.target.value)}
              className="min-h-[44px] md:min-h-[38px] px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[12px] font-medium text-[var(--text-primary)] hig-focus"
            >
              {ISLAND_FILTER_OPTIONS.map((isl) => (
                <option key={isl} value={isl}>
                  {isl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 38 Provinces Grid / List with Horizontal Density Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {rankedProvinces.map((prov, idx) => {
            const widthPercent = Math.max(
              3,
              Math.min(100, Math.round((prov.totalShops / maxShopsCount) * 100))
            );
            const isSelected = prov.id === selectedProvince.id;
            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => handleSelectProvince(prov)}
                className={`w-full min-h-[54px] p-3 rounded-[var(--radius-sm)] border text-left cursor-pointer hig-transition hig-focus ${
                  isSelected
                    ? 'bg-[var(--accent-tint)]/55 border-[var(--accent-primary)] shadow-xs'
                    : 'bg-[var(--surface-recessed)]/70 hover:bg-[var(--surface-elevated)] border-[var(--border-hairline)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-[6px] bg-[var(--surface-solid)] border border-[var(--border-hairline)] text-[11px] font-bold text-[var(--text-secondary)] flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                      {prov.provinceName}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-[var(--surface-solid)] text-[var(--text-secondary)] shrink-0">
                      {prov.islandGroup}
                    </span>
                  </div>

                  <div className="text-right shrink-0 tabular-nums">
                    <span className="text-[13px] font-bold text-[var(--text-primary)]">
                      {prov.totalShops.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] ml-1">toko</span>
                  </div>
                </div>

                {/* Horizontal Density Progress Bar */}
                <div className="mt-2 h-2 w-full rounded-full bg-[var(--surface-solid)] overflow-hidden border border-[var(--border-hairline)]">
                  <div
                    className={`h-full rounded-full ${
                      prov.densityLevel >= 4
                        ? 'bg-[var(--accent-fill)]'
                        : prov.densityLevel === 3
                          ? 'bg-[var(--status-success-fill)]'
                          : 'bg-[var(--status-warning-fill)]'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--text-secondary)] tabular-nums">
                  <span>
                    Tier A: <strong>{prov.tierACount.toLocaleString('id-ID')}</strong> · Disapa:{' '}
                    <strong>{prov.contactedCount.toLocaleString('id-ID')}</strong>
                  </span>
                  {prov.activeResellerCount > 0 ? (
                    <span className="text-[var(--status-success)] font-semibold">
                      {prov.activeResellerCount} Reseller Aktif
                    </span>
                  ) : (
                    <span>Kode: {prov.provinceCode}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </SolidCard>
    </div>
  );
};
