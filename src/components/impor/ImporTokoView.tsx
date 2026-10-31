import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  Store,
  RefreshCw,
  X,
} from 'lucide-react';
import { HubId, ImportSimulationReceiptDTO, SegmentId, simulateImportUpload } from '../../mock/api';
import { SolidCard } from '../ui/SolidCard';
import { Button } from '../ui/Button';

interface ImporTokoViewProps {
  onNavigate: (hub: HubId, segment?: SegmentId) => void;
  onImportSuccess?: (receipt: ImportSimulationReceiptDTO) => void;
}

type UploadFlowState = 'idle' | 'file_chosen' | 'uploading' | 'success' | 'error';

export const ImporTokoView: React.FC<ImporTokoViewProps> = ({
  onNavigate,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeBytes: number;
    rowCount: number;
  } | null>(null);

  const [flowState, setFlowState] = useState<UploadFlowState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ImportSimulationReceiptDTO | null>(null);

  const handleFileSelected = (file: File) => {
    const isCsv = file.name.endsWith('.csv');
    const isXlsx = file.name.endsWith('.xlsx');

    if (!isCsv && !isXlsx) {
      setErrorMessage('Format berkas tidak didukung. Harap unggah berkas .csv atau .xlsx.');
      setFlowState('error');
      return;
    }

    setErrorMessage(null);
    // Estimate fictional row count from file size
    const estimatedRows = Math.max(25, Math.min(1200, Math.round(file.size / 450)));
    setSelectedFile({
      name: file.name,
      sizeBytes: file.size,
      rowCount: estimatedRows,
    });
    setFlowState('file_chosen');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleStartImport = async () => {
    if (!selectedFile) return;

    setFlowState('uploading');
    setUploadProgress(15);

    const t1 = window.setTimeout(() => setUploadProgress(45), 100);
    const t2 = window.setTimeout(() => setUploadProgress(80), 220);

    try {
      const res = await simulateImportUpload(selectedFile.name, selectedFile.rowCount, false);
      setUploadProgress(100);
      setReceipt(res);
      setFlowState('success');
      if (onImportSuccess) {
        onImportSuccess(res);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memproses impor berkas.');
      setFlowState('error');
    } finally {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    }
  };

  const handleResetFlow = () => {
    setSelectedFile(null);
    setFlowState('idle');
    setUploadProgress(0);
    setErrorMessage(null);
    setReceipt(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadDummyTemplate = (extension: 'xlsx' | 'csv') => {
    const filename = `template-impor-toko-rumah-gadget.${extension}`;
    const content =
      extension === 'csv'
        ? 'nama,telepon,alamat,kota\n"Barokah Cell","08123456789","Jl. Medan Area No.10","Kota Medan"\n"Surya Ponsel","08139876543","Jl. Gatot Subroto No.88","Kota Medan"'
        : 'Dummy Excel Data';
    const blob = new Blob([content], {
      type: extension === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-label="Unggah Data Toko" className="space-y-3.5">
      {/* 1. TOP ACTION BAR */}
      <SolidCard padding="sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-[15px] md:text-[16px] font-bold tracking-tight text-[var(--text-primary)]">
              Impor Data Toko Baru (CSV atau Excel .xlsx)
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Unggah berkas data toko baru untuk ditambahkan ke Bank Data Olivia SDR secara massal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Upload className="w-3.5 h-3.5" />}
              onClick={() => fileInputRef.current?.click()}
            >
              + Pilih Berkas
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<History className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('impor', 'impor_riwayat')}
            >
              Lihat Riwayat Impor
            </Button>
          </div>
        </div>
      </SolidCard>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file);
        }}
      />

      {/* 2. DRAG-AND-DROP UPLOAD ZONE WITH INTERACTIVE STATES */}
      <SolidCard padding="md">
        <div className="space-y-3">
          <div>
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Impor Data Toko Baru (CSV atau Excel (.xlsx))
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Unggah file CSV atau Excel (.xlsx) untuk menambahkan toko baru ke bank data.
            </p>
          </div>

          {/* UPLOAD FLOW STATE DISPLAY */}
          {flowState === 'idle' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-[var(--radius-md)] border-2 border-dashed flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer hig-transition ${
                dragOver
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-tint)]'
                  : 'border-[var(--border-strong)] bg-[var(--surface-recessed)] hover:bg-[var(--surface-elevated)]'
              }`}
            >
              <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--status-warning-bg)] text-[var(--status-warning)] flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-[14px] font-bold text-[var(--text-primary)]">
                  Klik atau seret file ke sini
                </div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  Format yang didukung: .csv atau .xlsx (Maksimum 10 MB)
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Pilih Berkas dari Komputer
              </Button>
            </div>
          )}

          {flowState === 'file_chosen' && selectedFile && (
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                      {Math.max(1, Math.round(selectedFile.sizeBytes / 1024))} KB · Perkiraan ~{selectedFile.rowCount} baris calon prospek
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="w-8 h-8 rounded-full bg-[var(--surface-solid)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] flex items-center justify-center cursor-pointer shrink-0"
                  aria-label="Batalkan pilihan file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Upload className="w-4 h-4" />}
                  onClick={handleStartImport}
                >
                  Mulai Impor & Validasi Duplikasi
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Ganti Berkas
                </Button>
              </div>
            </div>
          )}

          {flowState === 'uploading' && (
            <div className="p-6 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-3 text-center">
              <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin mx-auto" />
              <div className="space-y-1">
                <div className="text-[14px] font-bold text-[var(--text-primary)]">
                  Memvalidasi Kolom & Memeriksa Duplikasi di RG ERP...
                </div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  Progres: {uploadProgress}%
                </div>
              </div>
              <div className="w-full max-w-md mx-auto h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-fill)] rounded-full hig-transition"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {flowState === 'success' && receipt && (
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[var(--status-success)] shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0">
                  <div className="text-[14px] font-bold text-[var(--status-success)]">
                    Impor Data Berhasil Disimpan ke Bank Data!
                  </div>
                  <div className="text-[12px] text-[var(--text-primary)]">
                    Berkas <strong className="font-semibold">{receipt.fileName}</strong> telah diproses pada {receipt.waktuWib}.
                  </div>
                </div>
              </div>

              {/* Receipt metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-hairline)]">
                <div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Total Baris</div>
                  <div className="text-[15px] font-bold text-[var(--text-primary)] tabular-nums">
                    {receipt.totalRows}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Diimpor</div>
                  <div className="text-[15px] font-bold text-[var(--status-success)] tabular-nums">
                    +{receipt.importedCount}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Dilewati</div>
                  <div className="text-[15px] font-bold text-[var(--text-tertiary)] tabular-nums">
                    {receipt.skippedCount}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Duplikat ERP</div>
                  <div className="text-[15px] font-bold text-[var(--status-warning)] tabular-nums">
                    {receipt.duplicateCount}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Store className="w-3.5 h-3.5" />}
                  onClick={() => onNavigate('database', 'semua_toko')}
                >
                  Lihat Toko Baru di Semua Toko
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetFlow}
                >
                  Unggah Berkas Lain
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('impor', 'impor_riwayat')}
                >
                  Riwayat Impor
                </Button>
              </div>
            </div>
          )}

          {flowState === 'error' && (
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--status-danger-bg)] border border-[var(--status-danger-border)] space-y-3">
              <div className="flex items-start gap-2.5 text-[var(--status-danger)]">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-[13px] font-bold">Terjadi Kesalahan Saat Mengimpor</div>
                  <div className="text-[12px]">{errorMessage}</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleResetFlow}>
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      </SolidCard>

      {/* 3. FORMAT BERKAS YANG DIDUKUNG (Specification Table from 12-impor-data) */}
      <SolidCard padding="md" className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-2.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Format Berkas yang Didukung (CSV atau Excel .xlsx)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => downloadDummyTemplate('xlsx')}
            >
              Unduh format Excel (.xlsx)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => downloadDummyTemplate('csv')}
            >
              Unduh format CSV
            </Button>
          </div>
        </div>

        <p className="text-[12px] text-[var(--text-secondary)]">
          Kolom telepon sebaiknya berformat Teks agar angka 0 di depan tidak hilang (berkas Excel sudah diatur begitu).
        </p>

        {/* Specification Solid Table */}
        <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border-hairline)]">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead className="bg-[var(--surface-recessed)] text-[var(--text-secondary)] text-[11px] font-semibold uppercase tracking-wider border-b border-[var(--border-hairline)]">
              <tr>
                <th className="px-3.5 py-2">Kolom</th>
                <th className="px-3.5 py-2">Wajib</th>
                <th className="px-3.5 py-2">Contoh</th>
                <th className="px-3.5 py-2">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)] bg-[var(--surface-solid)]">
              <tr>
                <td className="px-3.5 py-2.5 font-mono font-semibold text-[var(--text-primary)]">nama</td>
                <td className="px-3.5 py-2.5 text-[var(--status-success)] font-medium">✓ Ya</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">Toko ABC Cell</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">Nama toko / counter</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2.5 font-mono font-semibold text-[var(--text-primary)]">telepon / phone</td>
                <td className="px-3.5 py-2.5 text-[var(--status-success)] font-medium">✓ Ya</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)] tabular-nums">0812-3456-7890</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">Nomor WhatsApp (boleh +62 / 62 / 0 / tanpa nol)</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2.5 font-mono font-semibold text-[var(--text-primary)]">alamat</td>
                <td className="px-3.5 py-2.5 text-[var(--text-tertiary)] font-medium">Opsional</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">Jl. Asia Mega Mas Blk.A No.5</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">Alamat lengkap counter</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2.5 font-mono font-semibold text-[var(--text-primary)]">kota</td>
                <td className="px-3.5 py-2.5 text-[var(--text-tertiary)] font-medium">Opsional</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">Medan</td>
                <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">Kota / wilayah</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Catatan Penting Bullet List */}
        <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1.5 text-[12px] text-[var(--text-secondary)]">
          <div className="font-bold text-[var(--text-primary)]">Catatan Penting:</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Excel: hanya lembar pertama dibaca; baris pertama harus judul kolom.</li>
            <li>CSV: pemisah harus koma (bukan titik koma).</li>
            <li>Judul kolom jangan memuat kata &apos;toko&apos; atau &apos;nama&apos; selain untuk kolom nama (mis. gunakan &apos;alamat&apos;, bukan &apos;alamat toko&apos;).</li>
            <li>Nomor yang sudah terdaftar di bank data atau RG ERP akan dilewati secara otomatis.</li>
          </ul>
        </div>
      </SolidCard>
    </section>
  );
};
