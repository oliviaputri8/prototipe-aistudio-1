import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  X,
  FileDown,
} from 'lucide-react';
import { StockUploadHistoryRowDTO } from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';
import { DataTable, DataTableColumn } from '../ui/DataTable';

interface ImporStokViewProps {
  records: StockUploadHistoryRowDTO[];
  onRefresh: () => void;
  onUploadSuccess?: (fileName: string, acceptedCount: number) => void;
}

export const ImporStokView: React.FC<ImporStokViewProps> = ({
  records,
  onRefresh,
  onUploadSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeBytes: number;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      onRefresh();
      setIsRefreshing(false);
    }, 280);
  };

  const handleFileChosen = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      alert('Format berkas harus Excel (.xlsx).');
      return;
    }
    setSelectedFile({
      name: file.name,
      sizeBytes: file.size,
    });
    setSuccessMessage(null);
  };

  const handleStartVerification = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(20);

    const t1 = window.setTimeout(() => setProgress(60), 120);
    const t2 = window.setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setSuccessMessage(
        `Berkas "${selectedFile.name}" berhasil diverifikasi dan stok unit telah terbit di RG ERP.`
      );
      if (onUploadSuccess) {
        onUploadSuccess(selectedFile.name, 120);
      }
      setSelectedFile(null);
    }, 280);
  };

  const handleDownloadTemplate = () => {
    const filename = 'template-stok-rumah-gadget.xlsx';
    const blob = new Blob(['Dummy Template Stok'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: DataTableColumn<StockUploadHistoryRowDTO>[] = [
    {
      key: 'waktu',
      header: 'Waktu unggah',
      widthClass: 'w-[20%]',
      render: (row) => (
        <span className="text-[12px] text-[var(--text-secondary)] tabular-nums whitespace-normal leading-tight block">
          {row.waktuUnggahWib}
        </span>
      ),
    },
    {
      key: 'berkas',
      header: 'Berkas',
      widthClass: 'w-[32%]',
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--text-primary)] truncate block">
          {row.berkasName}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      widthClass: 'w-[16%]',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${
            row.status === 'Diterbitkan'
              ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)]'
              : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)]'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'diterima',
      header: 'Diterima',
      widthClass: 'w-[11%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="font-semibold text-[13px] text-[var(--status-success)] tabular-nums">
          {row.diterimaCount}
        </span>
      ),
    },
    {
      key: 'ditolak',
      header: 'Ditolak',
      widthClass: 'w-[11%]',
      align: 'right',
      isNumeric: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--text-tertiary)] tabular-nums">
          {row.ditolakCount}
        </span>
      ),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      widthClass: 'w-[10%]',
      align: 'right',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownloadTemplate()}
          className="text-[11px]"
        >
          {row.aksiLabel}
        </Button>
      ),
    },
  ];

  return (
    <section aria-label="Impor Stok Rumah Gadget" className="space-y-3.5">
      {/* 1. UPLOAD STOK CARD */}
      <SolidCard padding="md" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-2.5">
          <div>
            <h2 className="text-[15px] font-bold text-[var(--text-primary)]">
              Impor Stok Rumah Gadget
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Unggah Excel stok dari admin, periksa pratinjau per baris, lalu tekan Verifikasi stok agar data terbit.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownloadTemplate}
          >
            Unduh templat
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileChosen(f);
          }}
        />

        {successMessage && (
          <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] flex items-start gap-2.5 text-[12px] text-[var(--status-success)]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-semibold">{successMessage}</div>
          </div>
        )}

        {selectedFile ? (
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileSpreadsheet className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {Math.max(1, Math.round(selectedFile.sizeBytes / 1024))} KB · Format Excel .xlsx valid
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="w-8 h-8 rounded-full bg-[var(--surface-solid)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isProcessing ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>Memverifikasi baris IMEI & model unit...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-fill)] rounded-full hig-transition"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={handleStartVerification}
                >
                  Verifikasi Stok & Terbitkan Data
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Ganti File
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFileChosen(f);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-7 rounded-[var(--radius-md)] border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer hig-transition ${
              dragOver
                ? 'border-[var(--accent-primary)] bg-[var(--accent-tint)]'
                : 'border-[var(--border-strong)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)]'
            }`}
          >
            <div className="text-[13px] font-bold text-[var(--text-primary)]">
              Klik atau seret berkas Excel (.xlsx) ke sini
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Format yang didukung: .xlsx, maksimum 5 MB
            </div>
          </div>
        )}
      </SolidCard>

      {/* 2. RIWAYAT UNGGAHAN STOK TABLE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
            Riwayat unggahan stok
          </h3>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefreshClick}
          >
            {isRefreshing ? 'Menyegarkan...' : 'Segarkan Riwayat'}
          </Button>
        </div>

        <DataTable
          caption="Tabel Riwayat Unggahan Stok"
          columns={columns}
          rows={records}
          rowKey={(r) => r.id}
          fixedLayout
          compact
          emptyLabel="Belum ada unggahan."
          mobileCardRender={(row) => (
            <div className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                    {row.berkasName}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)]">
                    {row.waktuUnggahWib}
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[5px] bg-[var(--status-success-bg)] text-[var(--status-success)] shrink-0">
                  {row.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-1 border-t border-[var(--border-hairline)]">
                <span className="text-[var(--text-secondary)]">Diterima: <strong className="text-[var(--status-success)]">{row.diterimaCount}</strong> · Ditolak: <strong>{row.ditolakCount}</strong></span>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-[11px] text-[var(--accent-primary)] font-semibold hover:underline"
                >
                  {row.aksiLabel}
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
};
