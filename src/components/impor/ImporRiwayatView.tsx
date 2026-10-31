import React, { useState } from 'react';
import {
  RefreshCw,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';
import { HubId, ImportHistoryRowDTO, SegmentId } from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';

interface ImporRiwayatViewProps {
  records: ImportHistoryRowDTO[];
  onRefresh: () => void;
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
}

export const ImporRiwayatView: React.FC<ImporRiwayatViewProps> = ({
  records,
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

  // Columns strictly summing to 100% with fixedLayout={true}
  const columns: DataTableColumn<ImportHistoryRowDTO>[] = [
    {
      key: 'waktu',
      header: 'Waktu (WIB)',
      widthClass: 'w-[18%]',
      render: (row) => (
        <span className="text-[12px] text-[var(--text-secondary)] tabular-nums whitespace-normal leading-tight block">
          {row.waktuWib}
        </span>
      ),
    },
    {
      key: 'berkas',
      header: 'Berkas',
      widthClass: 'w-[28%]',
      render: (row) => (
        <div className="min-w-0">
          <div className="font-semibold text-[13px] text-[var(--text-primary)] truncate">
            {row.berkasName}
          </div>
          <div className="text-[11px] text-[var(--text-tertiary)] font-mono">
            {Math.max(1, Math.round(row.fileSizeBytes / 1024))} KB
          </div>
        </div>
      ),
    },
    {
      key: 'oleh',
      header: 'Oleh',
      widthClass: 'w-[18%]',
      render: (row) => (
        <span className="text-[12px] text-[var(--text-primary)] font-medium truncate block">
          {row.olehOperator}
        </span>
      ),
    },
    {
      key: 'total_baris',
      header: 'Total Baris',
      widthClass: 'w-[12%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--text-primary)] tabular-nums">
          {row.totalBaris.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'diimpor',
      header: 'Diimpor',
      widthClass: 'w-[12%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-bold text-[13px] text-[var(--status-success)] tabular-nums">
          +{row.diimporCount.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'dilewati',
      header: 'Dilewati',
      widthClass: 'w-[12%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-tertiary)] tabular-nums">
          {row.dilewatiCount.toLocaleString('id-ID')}
        </span>
      ),
    },
  ];

  return (
    <section aria-label="Riwayat Impor Bank Data Toko" className="space-y-3.5">
      {/* 1. TOP ACTION BAR */}
      <SolidCard padding="sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-[15px] md:text-[16px] font-bold tracking-tight text-[var(--text-primary)]">
              Riwayat Impor Bank Data Toko
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Catatan riwayat berkas CSV atau Excel (.xlsx) yang telah dimasukkan ke basis data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefreshClick}
            >
              {isRefreshing ? 'Menyegarkan...' : 'Segarkan Riwayat'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Upload className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('impor', 'impor_unggah_toko')}
            >
              + Unggah Data Baru
            </Button>
          </div>
        </div>
      </SolidCard>

      {/* 2. HISTORY SOLID TABLE */}
      <div className="space-y-2">
        <DataTable
          caption="Tabel Riwayat Impor Bank Data Toko"
          columns={columns}
          rows={records}
          rowKey={(r) => r.id}
          fixedLayout
          compact
          emptyLabel="Belum ada impor tercatat."
          mobileCardRender={(row) => (
            <div className="p-3 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                    {row.berkasName}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)] font-mono">
                    {row.waktuWib} · Oleh {row.olehOperator}
                  </div>
                </div>
                <span className="text-[12px] font-bold text-[var(--status-success)] tabular-nums shrink-0">
                  +{row.diimporCount} toko
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2 rounded-[var(--radius-xs)] bg-[var(--surface-recessed)] text-[12px] tabular-nums">
                <div>
                  <span className="text-[var(--text-secondary)]">Total: </span>
                  <span className="font-semibold text-[var(--text-primary)]">{row.totalBaris}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Dilewati: </span>
                  <span className="font-semibold text-[var(--text-tertiary)]">{row.dilewatiCount}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Duplikat: </span>
                  <span className="font-semibold text-[var(--status-warning)]">{row.duplikatCount}</span>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
};
