import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  PromotionalMediaCategory,
  UploadMediaPayloadDTO,
} from '../../mock/api';
import { ModalSheet } from '../ui/ModalSheet';
import { Button } from '../ui/Button';

interface UnggahMediaModalProps {
  open: boolean;
  onClose: () => void;
  categoryOptions: PromotionalMediaCategory[];
  simulateServerError?: boolean;
  prefill?: {
    name: string;
    sizeBytes: number;
    mimeType: string;
    title: string;
  } | null;
  onSubmitUpload: (payload: UploadMediaPayloadDTO) => void;
}

/**
 * Dialog d05: Unggah Media Promosi Baru (`d05-dialog-unggah-media`)
 * - Strictly production controls: file picker, title, category, upload progress
 * - Dev test triggers isolated outside dialog in PrototypeDevToolbar
 */
export const UnggahMediaModal: React.FC<UnggahMediaModalProps> = ({
  open,
  onClose,
  categoryOptions,
  simulateServerError = false,
  prefill,
  onSubmitUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [documentTitle, setDocumentTitle] = useState('');
  const [category, setCategory] = useState<PromotionalMediaCategory>(
    categoryOptions[0] || 'Katalog Harga (PDF/Gambar)'
  );
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeBytes: number;
    mimeType: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (prefill) {
        setDocumentTitle(prefill.title);
        setSelectedFile({
          name: prefill.name,
          sizeBytes: prefill.sizeBytes,
          mimeType: prefill.mimeType,
        });
      } else {
        setDocumentTitle('');
        setSelectedFile(null);
      }
      setCategory(categoryOptions[0] || 'Katalog Harga (PDF/Gambar)');
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMessage(null);
    }
  }, [open, categoryOptions, prefill]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setSelectedFile({
      name: file.name,
      sizeBytes: file.size,
      mimeType: file.type || 'application/pdf',
    });
    if (!documentTitle.trim()) {
      const cleanedTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ');
      setDocumentTitle(
        cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1)
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedFile) {
      setErrorMessage(
        'Pilih berkas PDF atau gambar (.jpg/.png) terlebih dahulu sebelum mengunggah.'
      );
      return;
    }

    if (!documentTitle.trim()) {
      setErrorMessage('Nama Dokumen / Judul Tampilan wajib diisi.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(22);

    const step1 = window.setTimeout(() => setUploadProgress(58), 110);
    const step2 = window.setTimeout(() => setUploadProgress(88), 220);
    const step3 = window.setTimeout(() => {
      if (simulateServerError) {
        setIsUploading(false);
        setUploadProgress(0);
        setErrorMessage(
          'Gagal menghitung SHA-256 Media Handle di server Go API (:8080/api/v1/media/upload). Coba lagi.'
        );
        return;
      }

      setUploadProgress(100);
      onSubmitUpload({
        documentTitle: documentTitle.trim(),
        category,
        fileName: selectedFile.name,
        fileSizeBytes: selectedFile.sizeBytes,
        mimeType: selectedFile.mimeType,
      });
      setIsUploading(false);
      onClose();
    }, 340);

    return () => {
      window.clearTimeout(step1);
      window.clearTimeout(step2);
      window.clearTimeout(step3);
    };
  };

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Unggah Media Promosi Baru"
      subtitle="Berkas akan di-hash (SHA-256) untuk WhatsApp Media Handle Caching lintas sesi."
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={isUploading}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="form-unggah-media-d05"
            variant="primary"
            size="md"
            disabled={isUploading}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {isUploading ? `Mengunggah (${uploadProgress}%)...` : 'Unggah & Simpan Handle'}
          </Button>
        </>
      }
    >
      <form id="form-unggah-media-d05" onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-[var(--radius-sm)] bg-[var(--status-danger-bg)] border border-[var(--status-danger-border)] flex items-start gap-2.5 text-[12px] text-[var(--status-danger)]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-medium">{errorMessage}</div>
          </div>
        )}

        {/* 1. File Picker (PDF or Image) */}
        <div>
          <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1.5">
            Berkas Dokumen (PDF / Gambar JPG, PNG) <span className="text-[var(--status-danger)]">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-recessed)] border border-dashed border-[var(--border-strong)] space-y-2.5">
            {selectedFile ? (
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-hairline)]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-[var(--status-success)] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                      {Math.max(1, Math.round(selectedFile.sizeBytes / 1024))} KB · Siap di-cache ke WhatsApp
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Ganti File
                </Button>
              </div>
            ) : (
              <div className="text-center py-2 space-y-2">
                <FileText className="w-7 h-7 text-[var(--accent-primary)] mx-auto" />
                <div className="text-[12px] text-[var(--text-secondary)]">
                  Format didukung: PDF, JPG, atau PNG (Maks. 5 MB per berkas)
                </div>
                <div className="flex items-center justify-center pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Pilih File dari Perangkat
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Display Title */}
        <div>
          <label
            htmlFor="d05-doc-title"
            className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1"
          >
            Nama Dokumen / Judul Tampilan <span className="text-[var(--status-danger)]">*</span>
          </label>
          <input
            id="d05-doc-title"
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Contoh: Brosur Harga Grosir iPhone Ex-iBox Minggu Ini"
            className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hig-focus"
          />
        </div>

        {/* 3. Category Select */}
        <div>
          <label
            htmlFor="d05-category"
            className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1"
          >
            Kategori Materi Promosi
          </label>
          <select
            id="d05-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PromotionalMediaCategory)}
            className="w-full min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--border-strong)] text-[13px] font-medium text-[var(--text-primary)] hig-focus"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Upload Progress Bar */}
        {isUploading && (
          <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface-recessed)] border border-[var(--border-hairline)] space-y-1.5">
            <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--text-primary)] tabular-nums">
              <span>Menghitung SHA-256 & Menyimpan Media Handle WA...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--surface-solid)] overflow-hidden border border-[var(--border-hairline)]">
              <div
                className="h-full bg-[var(--accent-fill)] transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </form>
    </ModalSheet>
  );
};
